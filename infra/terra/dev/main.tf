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

# 健康檢查，要有這個 MIG 才會幫你 auto healing
resource "google_compute_health_check" "http" {
  name                = "spot-mig-hc"
  check_interval_sec  = 10
  timeout_sec         = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3

  # 這個是聽 /health 這個 path，所以一定要起一個服務 http 服務
  http_health_check {
    port_specification = "USE_SERVING_PORT"
    request_path       = "/health"
  }
}


resource "google_compute_instance_template" "tpl" {
  name_prefix  = "spot-mig-tlp-"
  machine_type = "e2-medium"

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
    auto_delete  = true
    boot         = true
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

  # 這個是
  metadata_startup_script = file("${path.module}/startup.sh")

  # 這個是指整個 terraform 會先建立新的 instance，然後再把舊的關掉 
  lifecycle {
    create_before_destroy = true
  }
}


resource "google_compute_region_instance_group_manager" "mig" {
  name               = "spot-regional-mig"
  base_instance_name = "spot-vm"
  region             = var.region
  target_size        = 1

  version {
    instance_template = google_compute_instance_template.tpl.self_link
    name              = "primary"
  } 

  auto_healing_policies {
    health_check      = google_compute_health_check.http.self_link
    initial_delay_sec = 60
  }

  update_policy {
    type           = "PROACTIVE" # 主動替換
    minimal_action = "REPLACE"   # 直接重建節點（最乾淨）
    max_surge_fixed       = 1
    max_unavailable_fixed = 0
  }

  distribution_policy_zones = [
    "${var.region}-a",
  ]
}