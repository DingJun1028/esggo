#!/usr/bin/env bash
# ============================================================
# VPS: 部署 Oracle 同步層 (階段 2)
# vps/deploy-oracle-sync.sh
# ============================================================
# 前置（需先完成）：
#   1) OCI 控制台釋放 ADB 配額 (Always Free 2/2 已滿)
#   2) ~/.oci/config + pem 放至 VPS
#   3) ADB wallet 下載至 $OMNI_WALLET_DIR
#   4) OMNI_DB_PWD 設於 app/.env (gateway 或 next app)
#
# 本腳本：建 OMNI_* schema + 觸發一次從 Prisma 讀近期 TagPair 同步
# ============================================================
set -e
cd /var/www/esggo

export PATH="$HOME/.local/bin:$PATH"

echo "=== check OCI CLI ==="
command -v oci >/dev/null 2>&1 || { echo "oci CLI missing"; exit 1; }
oci --version | head -1

echo "=== check creds ==="
[ -n "$OMNI_DB_PWD" ] || { echo "OMNI_DB_PWD not set (export or .env)"; exit 1; }
[ -f ~/.oci/config ] || { echo "~/.oci/config missing"; exit 1; }

echo "=== init Oracle schema (OMNI_TRUST_LEDGER / OMNI_PROFILE_VECTOR) ==="
python3 scripts/oracle-sync.py init

echo "=== sync recent TagPairs from Prisma ==="
# 用 node 一小段讀 Prisma 近期 TagPair -> 逐筆 sync
node -e '
const { prisma } = require("./src/lib/prisma");
const { syncTagPairToOracle } = require("./src/core/tags/oracle-sync-service");
(async () => {
  const pairs = await prisma.tagPair.findMany({ take: 50, orderBy: { createdAt: "desc" } });
  let ok = 0;
  for (const p of pairs) {
    const r = await syncTagPairToOracle({ uuid: p.anchorTagId, pairId: p.id, action: "TRUST_GRANT", timestamp: p.createdAt.getTime() });
    if (r.ok) ok++;
  }
  console.log(JSON.stringify({ total: pairs.length, synced: ok }));
  await prisma.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
'

echo "=== done ==="
