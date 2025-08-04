
echo "brew version: $(brew -v)"

# 下載 fnm
brew install fnm



# setup the fnm init scripts
# from https://github.com/Schniz/fnm?tab=readme-ov-file#shell-setup
TARGET="$HOME/.zshrc"
LINE='eval "$(fnm env --use-on-cd --shell zsh)"'

# 檢查是否已存在
if ! grep -Fxq "$LINE" "$TARGET"; then
  echo "# fnm: nodejs version manager" >> "$TARGET"
  echo "$LINE" >> "$TARGET"
  echo "✅ Added fnm init line to $TARGET"
else
  echo "ℹ️  fnm init line already exists in $TARGET"
fi

eval "$LINE"

# 檢查有沒有正常運行
echo "fnm(node version manager) version: $(fnm --version )"


VERSION="22.15.0"
fnm use --install-if-missing "$VERSION"

echo "node version: $(node -v)"
echo "npm version: $(npm -v)"


# pnpm 
# ref: https://pnpm.io/installation
npm install --global corepack@latest

corepack enable pnpm

# check version
echo "pnpm version: $(pnpm -v)"

# fvm

brew tap leoafarias/fvm
brew install fvm

cd ./jumbotron-flutter
fvm install

echo
echo "flutter install success, please install extension of your editor yourself"


echo
echo "setting env success，✅ Please restart your terminal or run: source ~/.zshrc"




