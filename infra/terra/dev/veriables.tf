variable "project_id" {
  type = string
}

variable "region" {
  type = string
}


variable "zone" {
  type    = string
  default = "asia-east1-a"
}

variable "service_account_email" {
  type        = string
  default     = null
  description = "VM 使用的 Service Account"
}

variable "subnetwork" {
  type = string
}


