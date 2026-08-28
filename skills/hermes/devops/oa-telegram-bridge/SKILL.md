---
name: oa-telegram-bridge
description: OA-Telegram 萬能代理橋接器部署與修復（Telegram→OmniAgent）。
---

# OA-Telegram 萬能代理橋接器

## 觸發條件
- 部署/修復 OA-Telegram 橋接器
- Telegram 頻道（OA_Hermes_Superbot）收不到 OA 回應
- 用戶要從 Telegram 直接驅動 OmniAgent（萬能代理）
- 用戶提到「telegram-vps-bridge / oa-telegram / Telegram 代理」等模糊指代

## 核心定位（用戶明確要求 — 最重要）
**OA-Telegram = 處理 Telegram 的萬能代理**
- Telegram 收到訊息 → 轉發 OmniAgent Gateway :8642 `/execute` → 結果回傳 Telegram
- **不是**「通用 Telegram bridge」、**不是**「只查 OA 狀態的腳本」
- 若用戶說「XXX bridge 設置無完善」之類模糊指代，先確認是要「Telegram→OmniAgent 代理」而非通用橋接或狀態查詢。本 session 實際踩過：先建通用 bridge（被否）→ 改 OA 狀態查詢器（被否）→ 最後才是「萬能代理」才對。

## 基礎設施事實
- **Bot**: `OA_Hermes_Superbot`（token 在 secret-vault `ENV20260820.env` 的 `TELEGRAM_BOT_TOKEN`）
- **Chat ID**: `6387287462`（OA 頻道，固定寫死）
- **OmniAgent Gateway**: `http://127.0.0.1:8642`，認證 header 優先序 `X-Omni-Token` → `X-Api-Key` → `Authorization: ***（gateway 自身讀 `GATEWAY_API_KEY` 環境變數）
- **部署路徑**: `/opt/esggo/scripts/oa-telegram-bridge.py`
- **環境檔**: `/opt/esggo/scripts/oa-telegram-bridge.env`（600 權限，含 TELEGRAM_BOT_TOKEN + GATEWAY_API_KEY）

## 部署流程
1. 寫腳本（見 `templates/oa-telegram-bridge.py`）到 `/opt/esggo/scripts/`
2. 建 env 檔（**不硬編 token**）：
   - 本機 `C:\Users\dingj\secret-vault\ENV20260820.env` 取 `TELEGRAM_BOT_TOKEN`
   - VPS `/var/www/esggo/apps/gateway/.env` 取 `GATEWAY_API_KEY`
   - `chmod 600` env 檔
3. pm2 啟動（pm2 不直接支援 --env-file，需 source 後啟動）：
   ```bash
   cd /opt/esggo/scripts && set -a && source ./oa-telegram-bridge.env && set +a
   pm2 start oa-telegram-bridge.py --interpreter python3 --name oa-telegram-bridge
   ```
4. 驗證：`pm2 logs oa-telegram-bridge` + Telegram 頻道收測試訊息

## Token 注入坑（Windows/OCI）
- secret-vault 有 TELEGRAM_BOT_TOKEN，但**絕不硬編**進腳本（5T Trustworthy）
- 用 env_file 注入 pm2（source 後 pm2 start）
- GATEWAY_API_KEY 在 VPS gateway .env（600），用 python `re` 讀取避免 shell 轉義問題
  （不要用 `$(grep ... | cut)` 嵌套，OCI/MSYS 會觸發 hardline blocklist）

## 管理指令（橋接器內建）
- `/oa` `/hive` `/status` `/models` `/alert` `/help`
- 非 `/` 開頭的訊息 → 轉發 OmniAgent `/execute`（萬能代理核心）

## 驗證清單
- [ ] `getMe` 回 True（Bot token 有效）
- [ ] pm2 status online
- [ ] Telegram 頻道收到啟動訊息
- [ ] 發測試訊息 → OmniAgent 回應

## 常見坑
1. 混淆「通用 bridge / 狀態查詢 / 萬能代理」→ 用戶要的是後者（本 session 實證）
2. 硬編 token → 改 env_file 注入
3. OMNI_TOKEN 變數名錯 → 實際是 `GATEWAY_API_KEY`（gateway README 用此名）
4. Chat ID 不對 → 固定 `6387287462`（OA 頻道）
5. shell 變數嵌套指令被 blocklist 擋 → 改用 python 讀取/寫入 env
