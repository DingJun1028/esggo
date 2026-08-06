# C. 本地桌面 app 連 VPS 上的 Hermes gateway

VPS 端：
  cd /opt/esggo/vps-deploy-pack/C-hermes-gateway
  docker compose up -d

本地桌面 app 端：
  設定 -> 遠端 gateway / Profiles -> 新增 profile 指向 VPS gateway
  - 走 Tunnel：https://app.esggo.co
  - 直連：http://161.118.248.180:8786
  登入 OAuth/token，切換 profile 後 agent 執行/記憶/cron 都走 VPS。

注意：本地 esggo-hub 本機 Python 後端與 VPS gateway 是兩件事，不衝突。
TencentDB Agent Memory 備援 gateway（8420）若也在 VPS 可同網共存。
