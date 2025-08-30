#!/bin/bash


ENV_FILE=./.env

echo "use .env file from $(realpath $ENV_FILE)"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

source $SCRIPT_DIR/env-setup.sh

if [ -f "$ENV_FILE" ]; then
  echo "==== env content start ===="

  cat $ENV_FILE

  echo "==== env content end ===="

  # 過濾掉空行與 # 開頭的註解，再 export
  export $(grep -v '^[[:space:]]*#' "$ENV_FILE" | xargs)
fi
