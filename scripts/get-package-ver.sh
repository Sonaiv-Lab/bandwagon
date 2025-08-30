#!/bin/bash
set -eo pipefail

# set project version to ENV variable
export PIGGYBACK_VERSION=$(node -p "require('./piggyback/package.json').version")
export DUGOUT_VERSION=$(node -p "require('./dugout/package.json').version")
export SCOUT_VERSION=$(node -p "require('./scout/package.json').version")


if [ -z "$1" ]; then
  exit 1
fi

VERSION=""
TARGET=$1

if [ "$TARGET" = "dugout" ]; then
    VERSION=$DUGOUT_VERSION
  elif [ "$TARGET" = "piggyback" ]; then
    VERSION=$PIGGYBACK_VERSION
  elif [ "$TARGET" = "runner" ]; then
    VERSION=$SCOUT_VERSION
  elif [ "$TARGET" = "lineup" ]; then
    VERSION=$SCOUT_VERSION
  fi

# 外面也可用 stdout 接
echo $VERSION
