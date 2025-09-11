#!/bin/bash
set -euo pipefail


WORKING_DIR=/opt/bandwagon

# 建立資料夾, -m 設定權限：包含 setgid 2 + 775 , -0 設定 owner, -g 設定 group
install -d -m 2775 -o root -g deploy "$WORKING_DIR"

# 設定完成
ls -ld "$WORKING_DIR"
echo "[OK] single-group sharing ready at $WORKING_DIR"

REPO_DIR=$WORKING_DIR/bandwagon
PROJECT_ENV=$REPO_DIR/.env
TEMP_ENV=$WORKING_DIR/.env 


# 建立 ENV 暫存檔
sudo gcloud secrets versions access latest --secret="bandwagon-dev" > $TEMP_ENV

git config credential.helper store

if [ ! -d "$REPO_DIR" ] ; then
  rm -rf "$REPO_DIR"

  # 把 repo 拉下來
  ## 這裡沒有 repo 的 load-env.sh，所以需要用指令讀 .env
  set -a
  . "$TEMP_ENV"
  set +a

  git clone "https://oauth2:$GITHUB_REPO_PAT@github.com/Sonaiv-Lab/bandwagon.git" "$REPO_DIR"
fi

if [ ! -f "$PROJECT_ENV" ] ; then
  cp "$TEMP_ENV" "$PROJECT_ENV"
fi

# === 這裡開始就有 repo 了 ===
cd "$REPO_DIR"

./scripts/docker-run.sh -p lineup,runner --pull
