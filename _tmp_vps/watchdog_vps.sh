#!/usr/bin/env bash
# VPS OOM 看門狗：每 10 分鐘探活，恢復後自動 deploy_voice_agent.sh
# 對齊記憶確認的看門狗設置（每 10min 探活 + 狀態變化通知）
# 用法：nohup bash /path/watchdog_vps.sh > /tmp/watchdog.log 2>&1 &

VPS="161.118.248.180"
SSH_KEY="$HOME/.ssh/esggo_original"
INTERVAL=600  # 10 分鐘
LAST_STATE="down"
DEPLOY_DONE=0

echo "[watchdog] start $(date -u +%FT%TZ) target=$VPS"

while true; do
  # 探活：ssh 握手 7s timeout
  if timeout 7 ssh -o StrictHostKeyChecking=no -o ConnectTimeout=7 -i "$SSH_KEY" ubuntu@$VPS "echo UP" >/dev/null 2>&1; then
    CUR="up"
  else
    CUR="down"
  fi

  if [ "$CUR" != "$LAST_STATE" ]; then
    echo "[watchdog] $(date -u +%FT%TZ) state change: $LAST_STATE -> $CUR"
    LAST_STATE="$CUR"
  fi

  if [ "$CUR" = "up" ] && [ "$DEPLOY_DONE" -eq 0 ]; then
    echo "[watchdog] $(date -u +%FT%TZ) VPS recovered! running deploy_voice_agent.sh"
    # 把本機腳本傳過去並執行
    scp -o StrictHostKeyChecking=no -i "$SSH_KEY" \
      /c/Project/esggo-learning-center/_tmp_vps/deploy_voice_agent.sh \
      ubuntu@$VPS:/tmp/deploy_voice_agent.sh 2>&1 | tail -2
    timeout 300 ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -i "$SSH_KEY" ubuntu@$VPS \
      "bash /tmp/deploy_voice_agent.sh" 2>&1 | tail -30
    DEPLOY_DONE=1
    echo "[watchdog] $(date -u +%FT%TZ) deploy finished (DEPLOY_DONE=1)"
  fi

  sleep $INTERVAL
done
