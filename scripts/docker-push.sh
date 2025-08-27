#!/bin/bash
set -euo pipefail

gcloud auth configure-docker asia-east1-docker.pkg.dev --quiet

echo $HOME
cat ~/.docker/config.json

REGISTRY="GCP artifacts"  # e.g., docker.io/username 

# 拿到所有 package 的版本，這裡用相對路徑引用
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source $SCRIPT_DIR/get-package-ver.sh

# 改成 multi target 的

for TARGET in "$@"; do
  if [ "$TARGET" = "dugout" ]; then
    VERSION=$DUGOUT_VERSION
  elif [ "$TARGET" = "piggyback" ]; then
    VERSION=$PIGGYBACK_VERSION
  elif [ "$TARGET" = "runner" ]; then
    VERSION=$SCOUT_VERSION
  elif [ "$TARGET" = "lineup" ]; then
    VERSION=$SCOUT_VERSION
  else
    VERSION=""
     echo "未知 target: $TARGET"
  fi

  # source $SCRIPT_DIR/docker-build.sh $TARGET

  IMAGE_NAME="bandwagon/$TARGET:$VERSION"

  IMAGE_TAG="asia-east1-docker.pkg.dev/bandwagon-457014/bandwagon-dev/$TARGET:$VERSION"

  docker tag $IMAGE_TAG

  echo "Pushing Docker image to $REGISTRY..."

  docker push $IMAGE_TAG

  echo "Push $IMAGE_NAME Done."
done
