# Tailscale + Hermes WebUI 手機存取（2026-08-10 實證）

## 目標
讓手機（iOS/Android）經 Tailscale 私網存取 Hermes WebUI，不必暴露到公網。

## 前提（已確認）
- Tailscale 已裝且連網：本機 `dingjun` (100.103.244.34)、VPS `esggo-vps-omni` (100.71.82.0)、手機 `iphone-11-1` (100.97.118.26) 同帳號 `dingjunhong1028@`。
- VPS 的 Hermes WebUI 跑在 docker，容器內聽 8787。

## 坑：docker 只綁 localhost
VPS docker-compose 預設 `"127.0.0.1:8787:8787"` → 只聽 localhost。Tailscale 流量到 VPS 的 `100.71.82.0` 介面，但 docker 沒綁該介面 → 本機經 `curl http://100.71.82.0:8790` 回 `HTTP=000`（不可達）。

## 修復（VPS 端）
```bash
ssh esggo-vps
cd /home/ubuntu/hermes-webui
cp docker-compose.yml docker-compose.yml.bak-$(date +%Y%m%d)
# 改 ports: "127.0.0.1:8787:8787" -> "0.0.0.0:8790:8787"  (全介面聽, 含 Tailscale)
sed -i 's|      - "127.0.0.1:8787:8787"|      - "0.0.0.0:8790:8787"|' docker-compose.yml
docker stop hermes-webui-hermes-webui-1
docker rm hermes-webui-hermes-webui-1
docker compose up -d
```
> 安全：VPS 在 Oracle Cloud + Tailscale 私網，外部網際網路連不到 8790（只有 Tailscale 設備能連 `100.71.82.0`），無須額外防火牆。

## 驗證（本機經 Tailscale 打）
```bash
curl -sf -m 10 http://100.71.82.0:8790/ -o /dev/null -w "TAILSCALE_IP=%{http_code}\n"
# 或經 Magic DNS (已啟用):
curl -sf -m 10 http://esggo-vps-omni:8790/ -o /dev/null -w "MAGICDNS=%{http_code}\n"
# 兩者皆應 200, 首頁 <title>Hermes</title>
```

## 手機端設定（用戶操作）
1. 安裝並登入 Tailscale（同一 Google 帳號 `dingjunhong1028@`）。
2. 首頁點 Connect 開啟 VPN。
3. **iOS 關鍵**：設定 → 一般 → VPN → Tailscale → 開啟 **Connect On Demand**（避免背景斷線；iOS 會顯示 `offline, last seen Xm ago` 是正常省電，開 On Demand 後自動重連）。
4. Safari/Chrome 開：`http://esggo-vps-omni:8790/`（或 `http://100.71.82.0:8790/` 若 Magic DNS 不工作）。
5. 登入 Hermes（本機帳號/密碼）。

## 注意
- Hermes 本機是桌面 app，非 web server → 手機走 VPS WebUI（經 Tailscale），非本機。
- VPS WebUI 健康路徑：`curl http://127.0.0.1:8790/`（首頁回 200/302），勿用 `/health` 對 Ollama（`/api/tags` 才是 Ollama 活躍檢查）。
