terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.8.0"
    }
  }

  backend "local" {} # 先用 local state，簡單測試用
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_compute_firewall" "allow_health_check" {
  name    = "allow-health-check"
  network = "default"

  allow {
    protocol = "tcp"
    # Here should match with health_check in startup.sh
    ports = ["8888"]
  }

  source_ranges = [
    "35.191.0.0/16",
    "130.211.0.0/22"
  ]

  target_tags = ["healthz-enabled"]
}

# 健康檢查，要有這個 MIG 才會幫你 auto healing
resource "google_compute_health_check" "http" {
  name                = "spot-mig-hc"
  description         = "Health check via http"
  check_interval_sec  = 10
  timeout_sec         = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3

  # 這個是聽 /health 這個 path，所以一定要起一個服務 http 服務
  http_health_check {
    request_path = "/health"
    port         = 8888
  }
}


resource "google_compute_instance_template" "tpl" {
  name_prefix  = "spot-mig-tlp-"
  machine_type = "e2-medium"

  # for healthcheck firewall rule
  tags = ["healthz-enabled"]

  service_account {
    # 若未提供 email，就用 Compute Default SA
    email  = coalesce(var.service_account_email, null)
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }

  # 建議啟用的東西，但不太知道要幹嘛
  shielded_instance_config {
    enable_secure_boot          = true
    enable_vtpm                 = true
    enable_integrity_monitoring = true
  }

  scheduling {
    # 建立 SPOT VM

    provisioning_model = "SPOT"
    preemptible        = true
    # 會讓 MIG 來補機，這裡就不設定 true
    automatic_restart   = false
    on_host_maintenance = "TERMINATE"
  }

  # 啟動的磁碟
  disk {
    auto_delete = true
    boot        = true
    # arm, ubuntu, 然後不會什麼東西都沒有
    source_image = "projects/ubuntu-os-cloud/global/images/ubuntu-2404-noble-amd64-v20250828"
    disk_size_gb = 30
  }

  network_interface {
    network    = "default"
    subnetwork = "default"
    access_config {}
  }

  # 開了這個才會依照 IAM 自動幫你登入，才能直接在 VM 使用 GCS
  metadata = {
    enable-oslogin = "TRUE"
  }

  metadata_startup_script = templatefile("${path.module}/scripts/startup.sh.tmpl", {
    setup_gcs    = file("${path.module}/scripts/setup_gcs.sh"),
    setup_docker = file("${path.module}/scripts/setup_docker.sh"),
    permission   = file("${path.module}/scripts/permission.sh"),
    health_check = file("${path.module}/scripts/health_check.sh"),
    run_service  = file("${path.module}/scripts/run_service.sh"),
  })

  # 這個是指整個 terraform 會先建立新的 instance，然後再把舊的關掉 
  lifecycle {
    create_before_destroy = true
  }
}


resource "google_compute_address" "reserved_internal" {
  name         = "spot-mig-reserved-internal"
  subnetwork   = "default"
  address_type = "INTERNAL"
  region       = var.region
}

resource "google_compute_per_instance_config" "default" {
  instance_group_manager = google_compute_instance_group_manager.mig.name
  zone                   = var.zone
  name                   = "spot-vm-lineup"
  preserved_state {
    internal_ip {
      interface_name = "nic0"
      auto_delete    = "NEVER"
      ip_address {
        address = google_compute_address.reserved_internal.id
      }
    }
  }
}


resource "google_compute_instance_group_manager" "mig" {
  name               = "spot-regional-mig"
  base_instance_name = "spot-vm"
  zone               = var.zone

  target_size = 0 # use stateful config

  version {
    instance_template = google_compute_instance_template.tpl.self_link
    name              = "primary"
  }

  auto_healing_policies {
    health_check      = google_compute_health_check.http.self_link
    initial_delay_sec = 60
  }

  update_policy {
    type                           = "PROACTIVE" # 主動替換
    most_disruptive_allowed_action = "REPLACE"
    minimal_action                 = "REPLACE"  # 直接重建節點（最乾淨）
    replacement_method             = "RECREATE" # 設定 stateful mig 一定要為 RECREATE
    max_surge_fixed                = 0          # replace method 是 RECREATE 要是 0
    max_unavailable_fixed          = 1
  }

}