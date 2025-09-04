echo "install docker"

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

# 確認 docker 已經安裝 
docker --version

# enable docker 
systemctl enable --now docker
systemctl status docker


echo "setting docker config"
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