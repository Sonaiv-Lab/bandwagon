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

echo "=== set permission start at $(date) ===" >> /var/log/startup-script.log

## 設定權限相關指令
GROUP=deploy
DIR=/opt/bandwagon
USERS=("lavi_fang_gmail_com")
DOCKER_USERS=("lavi_fang_gmail_com")

# 建立群組
getent group "$GROUP" >/dev/null || groupadd "$GROUP"


# 建立資料夾, -m 設定權限：包含 setgit 2 + 775 , -0 設定 owner, -g 設定 group
install -d -m 2775 -o root -g deploy $DIR

# 這個會在 /etc/profile.d 裡面新增一個 umask_deploy.sh，內容是 umask 002，umask 002 會讓該 session 建立的檔案都是一樣的權限：file = 666 - 002 = 644, dir = 777 - 002 = 775
grep -q 'umask 002' /etc/profile.d/umask_deploy.sh 2>/dev/null || echo 'umask 002' > /etc/profile.d/umask_deploy.sh

# 自己也要執行
umask 002

# 4) 把需要的人加到 deploy 群組（root 不需要）

for u in "${USERS[@]}"; do
  id "$u" &>/dev/null && usermod -aG "$GROUP" "$u" || true
done

# 5) 把需要的人加到 docker 群組（root 不需要）
if getent group docker >/dev/null; then
  for u in "${DOCKER_USERS[@]}"; do
    if id "$u" &>/dev/null; then
      usermod -aG docker "$u"
    fi
  done
fi

# 設定完成
echo "[OK] single-group sharing ready at $DIR"
ls -ld "$DIR"

echo "=== pull project start at $(date) ===" >> /var/log/startup-script.log

# 把 .env 拉下來，但不能放 /opt/bandwagon，會跟 clone 衝突
sudo gcloud secrets versions access latest --secret="bandwagon-dev" > $DIR/.env 
# 把 repo 拉下來

DESTINATION=$DIR/bandwagon

## 這裡沒有 repo 的 load-env.sh，所以需要用指令讀 .env
export $(grep -v '^#' $DIR/.env  | xargs) && git clone "https://oauth2:$GITHUB_REPO_PAT@github.com/Sonaiv-Lab/bandwagon.git" $DESTINATION


# 再把剛剛在外面的 .env 複製過來
cp $DIR/.env $DESTINATION/.env


echo "=== run project start at $(date) ===" >> /var/log/startup-script.log
# === 這裡開始就有 repo 了 ===

cd $DESTINATION

./scripts/docker-pull.sh lineup
./scripts/docker-run.sh lineup

echo "=== startup.sh finished at $(date) ===" >> /var/log/startup-script.log
