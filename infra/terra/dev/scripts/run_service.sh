sudo gcloud secrets versions access latest --secret="bandwagon-dev" > $DIR/.env 
# 把 repo 拉下來

DESTINATION=$DIR/bandwagon

## 這裡沒有 repo 的 load-env.sh，所以需要用指令讀 .env
export $(grep -v '^#' $DIR/.env  | xargs) && git clone "https://oauth2:$GITHUB_REPO_PAT@github.com/Sonaiv-Lab/bandwagon.git" $DESTINATION


# 再把剛剛在外面的 .env 複製過來
cp $DIR/.env $DESTINATION/.env

# === 這裡開始就有 repo 了 ===

cd $DESTINATION

./scripts/docker-pull.sh lineup runner
./scripts/docker-run.sh lineup runner
