#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# load env
source $SCRIPT_DIR/load-env.sh

gcloud auth configure-docker $DOCKER_REGISTRY --quiet

for IMAGE in "$@"; do
  VERSION="$($SCRIPT_DIR/get-package-ver.sh $@)"

  REGISTRY_NAME=$DOCKER_REPO/$IMAGE:$VERSION
  IMAGE_NAME=bandwagon/$IMAGE:$VERSION

  echo $REGISTRY_NAME
  echo $IMAGE_NAME
  
  echo "pulling registry: $REGISTRY_NAME"

  docker pull $REGISTRY_NAME
  docker image tag $REGISTRY_NAME $IMAGE_NAME 

  echo "Pull $IMAGE_NAME Done."
done
