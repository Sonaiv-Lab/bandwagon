#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

source $SCRIPT_DIR/env-setup.sh
source $SCRIPT_DIR/get-package-ver.sh

COMPOSE_PROFILES=$(IFS=,; echo "$*")

COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose up -d
