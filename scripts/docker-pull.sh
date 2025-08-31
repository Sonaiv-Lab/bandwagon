#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

source $SCRIPT_DIR/load-env.sh
source $SCRIPT_DIR/get-package-ver.sh

gcloud auth configure-docker $DOCKER_REGISTRY --quiet

COMPOSE_PROFILES=$(IFS=,; echo "$*")

COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose pull
