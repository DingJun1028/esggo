#!/bin/bash

# ESG GO Platform Control Script (ctl.sh) v1.0
# Inspired by Hermes WebUI Standard Lifecycle

APP_DIR=$(pwd)
LOG_FILE="./omni_trace.log"
PID_FILE="./platform.pid"

show_help() {
  echo "Usage: ./ctl.sh [command]"
  echo ""
  echo "Commands:"
  echo "  start      Start Next.js and Hermes Gateway in background"
  echo "  status     Check status of platform processes"
  echo "  logs       Tail the system logs"
  echo "  restart    Restart all services"
  echo "  stop       Stop all background services"
}

start() {
  echo "🚀 Starting ESG GO Platform..."
  # Start Next.js
  npm run dev > $LOG_FILE 2>&1 &
  NEXT_PID=$!
  
  # Start Hermes Gateway (Simulated for local)
  node vps/hermes-server.mjs >> $LOG_FILE 2>&1 &
  GATEWAY_PID=$!

  echo "$NEXT_PID $GATEWAY_PID" > $PID_FILE
  echo "✅ Platform started. PIDs: $NEXT_PID (Next.js), $GATEWAY_PID (Gateway)"
  echo "📝 Logs: tail -f $LOG_FILE"
}

status() {
  if [ -f $PID_FILE ]; then
    PIDS=$(cat $PID_FILE)
    echo "📊 Platform Status: ONLINE"
    echo "PIDs: $PIDS"
    npx omni daemon status
  else
    echo "⚪ Platform Status: OFFLINE"
  fi
}

stop() {
  if [ -f $PID_FILE ]; then
    echo "🛑 Stopping ESG GO Platform..."
    kill $(cat $PID_FILE) 2>/dev/null
    rm $PID_FILE
    echo "✅ All services stopped."
  else
    echo "⚠️ No platform process found."
  fi
}

logs() {
  tail -f $LOG_FILE
}

case "$1" in
  start)   start ;;
  status)  status ;;
  stop)    stop ;;
  restart) stop; sleep 2; start ;;
  logs)    logs ;;
  *)       show_help ;;
esac
