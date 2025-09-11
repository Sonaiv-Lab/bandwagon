#!/bin/bash
set -eo pipefail

# 拿相對路徑
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# load env
source $SCRIPT_DIR/load-env.sh
source $SCRIPT_DIR/get-package-ver.sh

gcloud auth configure-docker $DOCKER_REGISTRY --quiet

COMPOSE_PROFILES=""


while [ $# -gt 0 ]; do
  # echo "$#"
  case "${1:-}" in
    --profile)
      if [ $# -lt 2 ]; then
        echo "錯誤: --profile 需要指定 profile" >&2
        exit 2
      fi
      COMPOSE_PROFILES="$2"
      shift 2
      ;;
    -p)
      if [ $# -lt 2 ]; then
        echo "錯誤: --profile 需要指定 profile" >&2
        exit 2
      fi
      COMPOSE_PROFILES="$2"
      shift 2
      ;;
    --)
        shift
        break
      ;;
    *) 
        shift
      ;;
  esac
done

COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose build "$@"
