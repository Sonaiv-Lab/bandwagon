#!/bin/bash

echo "=== startup.sh started at $(date) ===" >> /var/log/startup-script.log

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# install docker and dependencties
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
# Verify Docker installation
sudo docker run hello-world

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
# 把目前的 user 加進去 docker
sudo usermod -aG docker $USER
# 設定目前的權限
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

echo "=== pull project start at $(date) ===" >> /var/log/startup-script.log

# 到 opt/scout 建立資料夾
cd /opt
# 把 .env 拉下來，但不能放 /opt/bandwagon，會跟 clone 衝突
sudo gcloud secrets versions access latest --secret="bandwagon-dev" > /opt/.env 
# 把 repo 拉下來

## 這裡沒有 repo 的 load-env.sh，所以需要用指令讀 .env
export $(grep -v '^#' /opt/.env | xargs) && git clone "https://oauth2:$GITHUB_REPO_PAT@github.com/Sonaiv-Lab/bandwagon.git"


# 改權限
sudo chown lavi_fang_gmail_com:lavi_fang_gmail_com /opt/bandwagon

# 再把剛剛在外面的 .env 複製過來
cp /opt/.env /opt/bandwagon/.env 

echo "=== run project start at $(date) ===" >> /var/log/startup-script.log

# === 這裡開始就有 repo 了 ===

cd /opt/bandwagon

./scripts/docker-pull.sh

./scripts/docker-run.sh

echo "=== startup.sh finished at $(date) ===" >> /var/log/startup-script.log
