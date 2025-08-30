#!/bin/bash
set -eo pipefail

# 拿相對路徑
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# load env
source $SCRIPT_DIR/load-env.sh

gcloud auth configure-docker $DOCKER_REGISTRY --quiet

for IMAGE in "$@"; do
  VERSION="$($SCRIPT_DIR/get-package-ver.sh $@)"

  REGISTRY_NAME="$DOCKER_REPO/$IMAGE:$VERSION"
  IMAGE_NAME="bandwagon/$IMAGE:$VERSION"
  
  # echo "start build $IMAGE_NAME"

  # source $SCRIPT_DIR/docker-build.sh $TARGET

  docker tag $IMAGE_NAME $REGISTRY_NAME

  echo "Pushing Docker image to GCP artifacts..."

  docker push $REGISTRY_NAME

  echo "Push $IMAGE_NAME Done."
done
