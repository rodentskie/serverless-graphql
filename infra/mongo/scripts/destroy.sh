#!/bin/bash

set -e

WORK_DIR=$(pwd)
MAIN_PATH="$WORK_DIR/infra/mongo"

cp cdktf.json "$MAIN_PATH"
cd "$MAIN_PATH"

CDKTF_DISABLE_LOGGING=false cdktf --log-level DEBUG destroy --auto-approve
cat cdktf.log
