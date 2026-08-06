# VPS 部署包 (esggo-hub-agnostic)

本包對應任務 A/B/C/D + 拓撲圖。
約束：本 agent session 無 SSH/terminal 通道，所有檔案僅暫存於此，需你在本機/VPS 執行。
VPS 既成事實（來自記憶，非杜撰）：
- OCI ap-singapore-1，IP 161.118.248.180，private 10.0.0.73
- Ubuntu 24.04 aarch64，/opt/esggo，Docker 6/6 healthy
- Node v22.23.1，agents CLI 1.20.74
- ftg.esggo.co 在 Firebase Hosting（React HashRouter）
- TencentDB Agent Memory 備援在 VPS（gateway 8420）

A. Cloudflare Tunnel 擋在 VPS 前面（推薦混合） -> A-cloudflare-tunnel/
B. VPS push-to-deploy（GitHub Actions） -> B-push-to-deploy/
C. VPS 跑 Hermes gateway（跨機共享 agent） -> C-hermes-gateway/
D. 盤點 VPS 上 6 個 Docker 容器 -> D-inventory/inspect-vps.sh（本 session 無法執行）

執行順序：1) D 盤點 2) A Tunnel 3) B push-to-deploy 4) C VPS gateway
以上皆與 esggo-hub 本機桌面板無衝突。
