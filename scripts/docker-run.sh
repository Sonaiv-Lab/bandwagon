#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

source $SCRIPT_DIR/env-setup.sh
source $SCRIPT_DIR/get-package-ver.sh

docker compose --profile lineup up
