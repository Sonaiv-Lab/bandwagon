#!/bin/bash

## init the unbuntu VM for docker environment

# Update package list and install dependencies
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Install Docker
echo "Installing Docker..."
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# Add Docker's APT repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# Install Docker
sudo apt update
sudo apt install -y docker-ce
# Verify Docker installation
docker --version

# Optional: Add user to Docker group for non-root access (replace 'your-user' with your username)
echo "Adding current user to the Docker group..."
sudo usermod -aG docker $USER

# Install Google Cloud SDK
echo "Installing Google Cloud SDK..."
# Add Google Cloud SDK repository
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
# Add Google Cloud's public key
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
# Install Google Cloud SDK
sudo apt update
sudo apt install -y google-cloud-sdk
# Verify gcloud installation
gcloud --version

echo "Installation completed successfully."

echo "setting docker config"
sudo usermod -aG docker $USER
newgrp docker


# 這個應該要抽出去？
REGION="asia-east1-docker.pkg.dev"

gcloud auth configure-docker asia-east1-docker.pkg.dev

# 設定 Artifact Registry 的區域


# 取得 gcloud 的存取令牌
ACCESS_TOKEN=$(gcloud auth print-access-token)

# 使用存取令牌登入 Docker
echo "$ACCESS_TOKEN" | sudo docker login -u oauth2accesstoken --password-stdin "https://${REGION}"

# 提示登入是否成功
if [ $? -eq 0 ]; then
  echo "success logging to ${REGION}"
else
  echo "登入 Docker 到 ${REGION} 失敗，請檢查錯誤訊息。"
fi

echo "setting docker config success"
