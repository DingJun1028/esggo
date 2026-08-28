---
name: hermes-mcp-troubleshooting
description: 診斷修復 Hermes MCP 連接失敗 (args崩潰/孤兒/OAuth/套件壞/env注入).
version: v1.0
author: hermes
license: mit
tags: [hermes, mcp, troubleshooting, config]
metadata:
  hermes:
    tags: [hermes, mcp, troubleshooting]
    related_skills: [esggo-key-rotation, hermes-mcp-management]
---

# Hermes MCP 故障排除 (2026-08-20 實戰)

## When to Use
使用者要求「自動修復 MCP 中的錯誤」、MCP 管理介面某 server 顯示異常、或 `hermes mcp test` 報 Connection failed / 逾時 / 驗證錯誤時。本 skill 補 `hermes-mcp-management` (bundled) 只給標準增刪查、缺實戰排錯的缺口。

# Hermes MCP 故障排除 (2026-08-20 實戰)

本 skill 補 `hermes-mcp-management` (bundled, 只給標準增刪查) 的**實戰排錯**缺口。常見「自動修復 MCP 錯誤」場景: 使用者開 MCP 管理介面看到某 server 異常, 要你修。

## 診斷流程 (先定位再動手)
```bash
HERMES="$LOCALAPPDATA/hermes/hermes-agent/venv/Scripts/hermes.exe"
"$HERMES" mcp list                              # 看所有 server 狀態 (✓ enabled / ✗ disabled)
"$HERMES" mcp test <name>                       # 逐個實測連接 (抓 Connection failed / 逾時 / 驗證錯誤)
"$HERMES" config get mcp_servers.<name>         # 看該 server 的 command/args/env 實際值
```
- `mcp test` 只驗連接+工具發現, **不驗工具執行**; 運行時報錯需實際呼叫。
- 界面顯示「開關灰色/關閉」但 `mcp list` 顯示 `✓ enabled` → 狀態不一致 bug (UI 與 config 不同源), 以 `mcp list` 為準。

## 🔴 PITFALL 1: args 被存成字串 → pydantic `list_type` 崩潰
用 `hermes config set mcp_servers.<name>.args '["-y","x-mcp"]'` 時, **值被當成字串 `'["-y","x-mcp"]'` 而非清單** → 重啟後 `mcp test` 報 `1 validation error for StdioServerParameters ... list_type`。
修法 (用 Python 精準重建, 不要用 `config set` 設 args):
```python
import yaml
p=r"C:\Users\dingj\AppData\Local\hermes\config.yaml"
d=yaml.safe_load(open(p,encoding='utf-8'))
d['mcp_servers']['obsidian-mcp']={'command':'npx','args':['-y','obsidian-mcp@2','serve','--vault','dingjun=C:/Users/dingj/iCloudDrive/iCloud~md~obsidian/DingJun'],'enabled':True}
yaml.safe_dump(d,open(p,'w',encoding='utf-8'),allow_unicode=True,sort_keys=False,default_flow_style=False)
```
**黃金律: 新增/修改 MCP server 的 args 一律用 yaml.safe_dump 重寫該 server dict, 絕不用 `config set ...args`**。

## 🔴 PITFALL 2: 孤兒本地 MCP → 禁用而非留著連失敗
某 server 指向 `http://127.0.0.1:8000/mcp` 但本機無服務 (`curl 127.0.0.1:8000` 空)、也無對應專案腳本 → 每次啟動都連失敗拖慢 MCP 初始化。
修法: `"$HERMES" config set mcp_servers.<name>.enabled false` (非破壞, 留 config 備查)。

## 🔴 PITFALL 3: OAuth server 過期 → reauth 需使用者互動
`atlassian`/`notion` 等 OAuth MCP `mcp test` 報 `Session terminated` → token 過期。
修法: `"$HERMES" mcp reauth <name>` → 它印授權 URL 並自動開瀏覽器, **需使用者登入授權**, 無法代勞。等使用者貼回 `?code=...` 或點 skip。

## 🔴 PITFALL 4: 套件本身 SDK 不相容 → 繞過
`capacities-mcp@1.0.2` 啟動即崩 `Error: Server does not support completions (required for completion/complete)` (fastmcp 舊版 vs @modelcontextprotocol/sdk 新版衝突)。
診斷: `CAPACITIES_API_KEY=x timeout 12 npx -y capacities-mcp 2>&1 | head` 看實際 stderr。
繞過: 不依賴該 MCP, 直接 call 該服務 REST API (如 `https://api.capacities.io/v1/spaces` + `Bearer` token) 拉資料另存。

## env 注入 (給需 token 的 stdio MCP)
```bash
"$HERMES" config set mcp_servers.<name>.env.CAPACITIES_API_KEY "<key>"
```
- token 落地處優先用本地 `C:\Users\dingj\secret-vault\ENV20230818.env` (chmod 600)。
- ⚠️ 貼來的 key 先 `curl -H "Authorization: Bearer <key>" <api>/me` 驗證有效再寫入, 假 key (如 `kvu84`) 會 404。

## obsidian-mcp 實戰 (已驗證可用)
- 不需要 API key, 用 `--vault <id>=<絕對路徑>` 直接讀寫 vault 檔案。
- vault 路徑: `C:/Users/dingj/iCloudDrive/iCloud~md~obsidian/DingJun` (iCloud 同步的 Obsidian, 用 `find` 全系統搜 `.obsidian` 目錄定位)。
- 啟動: `npx -y obsidian-mcp@2 serve --vault dingjun=C:/Users/dingj/iCloudDrive/iCloud~md~obsidian/DingJun` → `mcp test` 連接成功 (12 工具)。
- Local REST API 插件 (`obsidian://show-plugin?id=obsidian-local-rest-api`) 是另一模式 (需 `OBSIDIAN_API_KEY` + 27123 port), 檔案模式不需要它。

## 聖櫃來源可靠性 (注入前必讀, 詳見 esggo-key-rotation)
- GitHub Secrets: `gh secret get` **不存在** (只支援 set), 無法讀回明文。
- Vercel: `vercel env pull` 可取明文, 但 esggo 專案的 `OMNITABLE_API_KEY` 是 mock 值。
- 1Password: `op` CLI 需使用者解鎖 session 才能 `op item get`。
- 落地首選: 本地 secret-vault。
