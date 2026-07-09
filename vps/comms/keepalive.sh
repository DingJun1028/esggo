#!/usr/bin/env bash
# OA-VPS keepalive probe — 防 Oracle 閒置收割 (7天 P95 CPU/網路/記憶體 <20% 即回收)
# 每 5 分鐘對 localhost 三端口探針，製造網路+CPU 活動（loopback，不耗出站流量）
set -u
LOG=/var/log/keepalive.log
TS=$(date '+%Y-%m-%d %H:%M:%S')
for port in 3000 8642 9999; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "http://127.0.0.1:${port}/" 2>/dev/null || echo 000)
  if [ "$code" = "000" ]; then
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "http://127.0.0.1:${port}/status" 2>/dev/null || echo 000)
  fi
  echo "$TS probe :$port -> $code" >> "$LOG"
done
# 偶發 CPU 活動（邊緣情況：純網路也過低時仍撐 CPU 項）
timeout 8 bash -c 'a=0; while true; do a=$((a+1)); done' 2>/dev/null &
echo "$TS cpu-tick done" >> "$LOG"
# 日誌截斷（避免 /var 漲滿，200GB Block 內短期無虞）
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 2000 ]; then
  tail -1000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
