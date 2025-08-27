#!/bin/bash

# 拿到所有 package 的版本，這裡用相對路徑引用
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source $SCRIPT_DIR/get-package-ver.sh

docker compose build "$@"
