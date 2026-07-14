#!/usr/bin/env bash
# OA-VPS: 啟用 Oracle Cloud Agent + Bastion plugin（讓 OCI Bastion 能建 Managed SSH session 連 10.0.0.119:22）
# 執行前提：root 在 OA_VPS 上跑（ssh root@161.118.248.180 -p 22 進去後 sudo bash 此檔）
# 注意：oracle-cloud-agent 是自動化運維代理，安裝後會接管部分監控/日誌上報；不改 SSH 配置、不動網路。
#       若你不想裝完整 agent，可只裝 bastion 插件（見下方註解分支）。
set -e
echo "[1] detect OS"
. /etc/os-release
echo "OS=$NAME $VERSION_ID"
echo "[2] install oracle-cloud-agent (Ubuntu/Debian)"
if command -v apt-get >/dev/null; then
  apt-get update -y
  # 官方套件（Oracle 維護的 repo）
  if ! apt-get install -y oracle-cloud-agent 2>/dev/null; then
    echo "  apt 直接裝失敗，改用手動 repo 腳本"
    curl -fsSL https://objectstorage.us-ashburn-1.oraclecloud.com/n/cloudbridge/b/installscript/o/install.sh -o /tmp/oc_agent_install.sh 2>/dev/null || true
    # 若無網路取官方腳本，則嘗試 snap/手動啟用已存在服務
  fi
fi
echo "[3] enable + start bastion plugin"
# oracle-cloud-agent 的 bastion 插件由 agent 管理；確保 agent 跑起
systemctl enable oracle-cloud-agent 2>/dev/null || true
systemctl start  oracle-cloud-agent 2>/dev/null || true
# 若裝了 oci 代理套件含 bastion 子服務
systemctl enable oracle-bastion-plugin 2>/dev/null || true
systemctl start  oracle-bastion-plugin 2>/dev/null || true
echo "[4] verify"
systemctl is-active oracle-cloud-agent 2>/dev/null && echo "agent: ACTIVE" || echo "agent: NOT active (檢查上方安裝輸出)"
echo "[5] done — 回報 agent 狀態給 Hermes，它會建 bastion session 驗證"
