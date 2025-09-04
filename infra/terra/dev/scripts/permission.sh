
## 設定權限相關指令
GROUP=deploy
USERS=("lavi_fang_gmail_com")
DOCKER_USERS=("lavi_fang_gmail_com")

# 建立群組
getent group "$GROUP" >/dev/null || groupadd "$GROUP"


# 建立資料夾, -m 設定權限：包含 setgit 2 + 775 , -0 設定 owner, -g 設定 group
install -d -m 2775 -o root -g deploy $DIR

# 設定完成
ls -ld "$DIR"
echo "[OK] single-group sharing ready at $DIR"

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



getent group "$GROUP"
getent group docker

echo "[OK] single-group sharing ready at $DIR"
