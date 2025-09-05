#!/bin/bash
set -eo pipefail


SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"


$SCRIPT_DIR/mig-vms.sh ssh --command "cd $REPO_DIR && ./scripts/docker-run.sh -p $@ --pull"

