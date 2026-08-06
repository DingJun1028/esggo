#!/bin/bash
# Simple health check script — can be called by cron or monitoring

# Check process-based services
FAILED=0

# Nginx check
if ! pgrep -x nginx > /dev/null; then
  echo "CRITICAL: nginx is down"
  FAILED=$((FAILED+1))
fi

# Netdata check  
if ! pgrep -x netdata > /dev/null; then
  echo "CRITICAL: netdata is down"
  FAILED=$((FAILED+1))
fi

# PM2 process check
if ! pgrep -f "node.*esggo-core" > /dev/null && ! pgrep -f "node.*omniagent" > /dev/null; then
  echo "CRITICAL: PM2 services not healthy"
  FAILED=$((FAILED+1))
fi

if [ $FAILED -gt 0 ]; then
  exit 2
fi
echo "OK - all services healthy"
