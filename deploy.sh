#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="esggo-app"
REPO_URL="https://github.com/DingJun1028/esggo.git"
BRANCH="main"
APP_DIR="/opt/esggo-app"                          
NODE_VERSION="20"                                  
PORT="3000"
HEALTHCHECK_PATH="/"                               
BUILD_CMD="NODE_OPTIONS=--max_old_space_size=8192 npm run build" 
PM2_SCRIPT="npm"
PM2_ARGS="run start"
KEEP_RELEASES="5"                                  

ENV_FILE_CONTENT=$(cat <<'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SYSTEM_DESIGN_VERSION=8.5.0-Alpha
