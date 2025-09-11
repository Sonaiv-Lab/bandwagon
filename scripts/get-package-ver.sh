#!/bin/bash
set -eo pipefail

# set project version to ENV variable
export PIGGYBACK_VERSION=$(node -p "require('./piggyback/package.json').version")
export SCOUT_VERSION=$(node -p "require('./scout/package.json').version")
export LINEUP_VERSION=$(node -p "require('./scout/services/lineup/package.json').version")
export RUNNER_VERSION=$(node -p "require('./scout/services/runner/package.json').version")
export DUGOUT_VERSION=$(node -p "require('./scout/services/dugout/package.json').version")



is_sourced() {
  # 比較 $0 和 ${BASH_SOURCE[0]}，確認是被 source 還是直接使用
  [[ "${BASH_SOURCE[0]}" != "${0}" ]]
}

if [ -z "$1" ]; then
  # 如果被 source 需要用 return
  if is_sourced; then
    return 0
  # 如果被直接使用，用 exit
  else
    exit 0
  fi
fi

VERSION=""
TARGET=$1

if [ "$TARGET" = "dugout" ]; then
    VERSION=$DUGOUT_VERSION
  elif [ "$TARGET" = "piggyback" ]; then
    VERSION=$PIGGYBACK_VERSION
  elif [ "$TARGET" = "runner" ]; then
    VERSION=$RUNNER_VERSION
  elif [ "$TARGET" = "lineup" ]; then
    VERSION=$LINEUP_VERSION
  fi

# 外面也可用 stdout 接
echo $VERSION
