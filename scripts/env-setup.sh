
echo "brew version: $(brew -v)"

# 下載 fnm
bash <(curl -fsSL https://moonrepo.dev/install/proto.sh)

echo "proton version $(proto -V)"

proto install


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

fvm global 3.32.4

flutter doctor

echo
echo "flutter install success, please install extension of your editor yourself"


echo
echo "setting env success，✅ Please restart your terminal or run: source ~/.zshrc"




