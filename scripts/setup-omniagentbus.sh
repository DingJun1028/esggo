#!/usr/bin/env bash
# setup-omniagentbus.sh — OA-TWINS OAB (OmniAgentBus) 部署器 (VPS 實體化)
# 修正版: 2026-08-09 破除 Windows 路徑幻影, 改用 VPS 真實路徑
set -euo pipefail

VPS_BUS_DIR="/opt/esggo/oa-twins/oab"
LOCAL_BUS_SRC="$LOCALAPPDATA/hermes/scripts"   # 備援: 若本機有 broker.py
SRC="${1:-$LOCAL_BUS_SRC}"

echo "=== [1] 準備 VPS 目錄 ==="
ssh -o ConnectTimeout=20 esggo-vps "mkdir -p $VPS_BUS_DIR && echo 'dir ready'"

echo "=== [2] 上傳 broker.py ==="
if [ -f "$SRC/broker.py" ]; then
  scp -o ConnectTimeout=20 "$SRC/broker.py" "esggo-vps:$VPS_BUS_DIR/broker.py" && echo "broker.py uploaded"
else
  echo "本機無 broker.py, 改從 esggo-learning-center 複製"
  scp -o ConnectTimeout=20 "C:/Project/esggo-learning-center/oa-twins/oab/broker.py" "esggo-vps:$VPS_BUS_DIR/broker.py" && echo "broker.py uploaded (from learning-center)"
fi

echo "=== [3] VPS self-test ==="
ssh -o ConnectTimeout=20 esggo-vps "cd $VPS_BUS_DIR && python3 broker.py --bus vps --self-test 2>&1 | head -6"

echo "=== [4] 啟動 OAB broker (background, heartbeat) ==="
ssh -o ConnectTimeout=20 esggo-vps "cd $VPS_BUS_DIR && nohup python3 broker.py --bus vps --store /opt/esggo/oa-twins/oab/journal --heartbeat > /opt/esggo/oa-twins/oab/oab.log 2>&1 & echo 'OAB VPS started PID \$!'"

echo "=== [5] 健康檢查 (journal 增長) ==="
sleep 12
ssh -o ConnectTimeout=20 esggo-vps "cd $VPS_BUS_DIR && echo 'journal lines:'; wc -l oab.oab.jsonl 2>/dev/null || echo 'no journal yet'; echo '--- log tail ---'; tail -3 oab.log 2>/dev/null"

echo "✅ OAB broker 部署完成 (VPS $VPS_BUS_DIR)"
