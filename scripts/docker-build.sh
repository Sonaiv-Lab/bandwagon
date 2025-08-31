#!/bin/bash
set -eo pipefail

# 拿相對路徑
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# load env
source $SCRIPT_DIR/load-env.sh
source $SCRIPT_DIR/get-package-ver.sh

gcloud auth configure-docker $DOCKER_REGISTRY --quiet

if [ "$1" = "--push" ]; then
COMPOSE_PROFILES=$(IFS=,; echo "${*:2}")
echo "building projects: $COMPOSE_PROFILES"
COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose build --push
else 
COMPOSE_PROFILES=$(IFS=,; echo "$*")

echo "building projects: $COMPOSE_PROFILES"
COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose build
fi
