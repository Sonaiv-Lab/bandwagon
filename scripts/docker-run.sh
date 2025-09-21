#!/bin/bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

source $SCRIPT_DIR/env-setup.sh
source $SCRIPT_DIR/get-package-ver.sh

COMPOSE_PROFILES=$(IFS=,; echo "$*")


LOCAL=0
COMPOSE_PROFILES=""
PULL=0

while [ $# -gt 0 ]; do
  # echo "$#"
  case "${1:-}" in
    --pull) 
        PULL=1
        shift
      ;;
    --local) 
        LOCAL=1
        shift
      ;;
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

if [ $PULL == 1 ]; then
  COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose pull
fi

if [ $LOCAL == 1 ]; then
  COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose -f compose.yaml -f compose.local.yaml up -d "$@"
else
  COMPOSE_PROFILES="$COMPOSE_PROFILES" docker compose up -d "$@"
fi
