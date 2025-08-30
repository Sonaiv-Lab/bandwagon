#!/bin/bash
set -eo pipefail

if ! command -v node &> /dev/null; then
  echo "Node.js not found, installing nodejs"

  sudo apt-get update
  sudo apt-get install -y nodejs

  echo "Node.js installed: $(node -v)"
else
  echo "Node.js installed: $(node -v)"
fi