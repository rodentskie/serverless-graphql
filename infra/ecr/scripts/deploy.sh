#!/bin/bash

set -e

WORK_DIR=$(pwd)
MAIN_PATH="$WORK_DIR/infra/ecr"

cp cdktf.json "$MAIN_PATH"
cd "$MAIN_PATH"

CDKTF_DISABLE_LOGGING=false cdktf --log-level DEBUG deploy --auto-approve
cat cdktf.log