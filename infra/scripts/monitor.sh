#!/usr/bin/env bash
set -euo pipefail
echo "===ESGG0 MONITOR $(date)==="
echo "Disk:" && df -h / | tail -1
echo "Memory:" && free -h | head -1
echo "PM2:" && pm2 list --no-color 2>/dev/null | tail -n +2
echo "Health:" && curl -s -o /dev/null -w "frontend=%{http_code}\n" http://127.0.0.1:3000/ && curl -s -o /dev/null -w "gateway=%{http_code}\n" http://127.0.0.1:8642/status
