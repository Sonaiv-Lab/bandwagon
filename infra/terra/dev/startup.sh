#!/bin/bash

echo "=== startup.sh started at $(date) ===" >> /var/log/startup-script.log



echo "=== startup.sh install_deps start $(date) ===" >> /var/log/startup-script.log

echo "Installing docker"

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
# 正確：用 keyring (.gpg)，且要可被 apt 讀取
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
# Add the repository to Apt sources:

CODENAME="$(. /etc/os-release; echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")"   # 應該是 noble
ARCH="$(dpkg --print-architecture)"                                             # 應該是 amd64
echo "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list
sudo apt-get update

# install docker and dependencties
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
# Verify Docker installation
systemctl enable --now docker



# Add user to Docker group for non-root access (replace 'your-user' with your username)
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

# Ubuntu 的 unit 名稱通常是 ssh（不是 sshd）
systemctl enable --now ssh

echo "Installation completed successfully."


echo "=== startup.sh install_deps end $(date) ===" >> /var/log/startup-script.log

echo "setting health check start"

cat >/usr/local/bin/healthz.py <<'PY'
#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"ok")
        else:
            self.send_response(404)
            self.end_headers()

    # 安靜一點，避免日誌爆量
    def log_message(self, fmt, *args):
        return

def main():
    server = HTTPServer(("", 80), Handler)
    server.serve_forever()

if __name__ == "__main__":
    main()
PY
chmod +x /usr/local/bin/healthz.py

# systemd service
cat >/etc/systemd/system/healthz.service <<'UNIT'
[Unit]
Description=Simple /health HTTP endpoint
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /usr/local/bin/healthz.py
Restart=always
RestartSec=2

# 監聽 80 需要權限；直接用 root 最簡單（僅用於健康檢查）
User=root

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now healthz.service

echo "setting health check end"

./scripts/health-check.sh

echo "setting ssh config"
# 可以讓 google 背景服務自動管理 ssh 的金鑰，如果有 terraform 有設定 os_login 要加上去
apt-get install -y openssh-server
systemctl enable --now ssh



echo "setting docker config"
# 把目前的 user 加進去 docker
REGION="asia-east1-docker.pkg.dev"
# 設定 Artifact Registry 的區域
gcloud auth configure-docker $REGION
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

./scripts/docker-pull.sh lineup runner
./scripts/docker-run.sh lineup runner

echo "=== startup.sh finished at $(date) ===" >> /var/log/startup-script.log
