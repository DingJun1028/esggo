---
name: esggo-key-rotation
description: ESG-GO 金鑰輪換流程與最佳實踐涵蓋 Supabase、Gemini、GitHub Secrets、Vercel 環境變數更新與迭代記錄
version: v1.0
---

# ESG-GO 金鑰輪換流程 v1.0

## 輪換步驟

1. 在對應平台 (Supabase Dashboard、Google AI Studio 等) 產生新金鑰
2. 更新 GitHub Secrets: `gh secret set <KEY_NAME> --body "<new_key>"`
3. 更新 Vercel 環境變數 (如適用)
4. 記錄迭代至 `iteration-log.txt`
5. 存檔至 Hindsight 記憶庫

## 金鑰格式注意

- Supabase 新格式金鑰以 `sb_publishable_` 或 `sb_secret_` 為前綴
- 舊版 JWT 格式金鑰以 `eyJhbG` 為前綴
- 兩種格式均需同等處理
- Gemini API Key 格式: `AQ.<base64>` (新版 AI Studio 格式)

## 完整金鑰清單

| 金鑰 | 平台 | 更新方式 |
|------|------|----------|
| VITE_SUPABASE_ANON_KEY | GitHub Secrets | `gh secret set` |
| SUPABASE_SERVICE_ROLE_KEY | GitHub Secrets | `gh secret set` |
| VITE_SUPABASE_URL | GitHub Secrets | `gh secret set` |
| NEXT_PUBLIC_GEMINI_API_KEY | GitHub Secrets | `gh secret set` |
| GOOGLE_API_KEY | GitHub Secrets | `gh secret set` |
| OPENAI_API_KEY | GitHub Secrets | `gh secret set` |
| VERCEL_API_KEY | GitHub Secrets | `gh secret set` |
| OPENROUTER_API_KEY | GitHub Secrets | `gh secret set` |
| FIREBASE_* | GitHub Secrets / Vercel | `gh secret set` / `vercel env add` |

## 更新腳本範例

```powershell
$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
chcp 65001 | Out-Null

$githubRepos = @("DingJun1028/esggo", "DingJun1028/esggo-learning-center")

# Supabase
$supaAnon = "sb_publishable_..."
$supaRole = "sb_secret_..."
# Gemini
$gemini = "AQ...."

# OpenAI / Vercel / OpenRouter
$openai = "sk-proj-..."
$vercel = "vcp_..."
$openrouter = "sk-or-v1-..."

foreach ($repo in $githubRepos) {
  gh -R $repo secret set NEXT_PUBLIC_GEMINI_API_KEY --body $gemini
  gh -R $repo secret set GOOGLE_API_KEY --body $gemini
  gh -R $repo secret set OPENAI_API_KEY --body $openai
  gh -R $repo secret set VERCEL_API_KEY --body $vercel
  gh -R $repo secret set OPENROUTER_API_KEY --body $openrouter
  gh -R $repo secret set VITE_SUPABASE_ANON_KEY --body $supaAnon
  gh -R $repo secret set SUPABASE_SERVICE_ROLE_KEY --body $supaRole
  gh -R $repo secret set VITE_SUPABASE_URL --body "https://yhwfmavnhaivvgzeuklx.supabase.co"
}

# Vercel 環境變數
vercel env add NEXT_PUBLIC_GEMINI_API_KEY production
vercel env add GOOGLE_API_KEY production
vercel env add OPENAI_API_KEY production
vercel env add VERCEL_API_KEY production
vercel env add OPENROUTER_API_KEY production
```

## 輪換後驗證

```powershell
gh -R "DingJun1028/esggo" secret list
gh -R "DingJun1028/esggo-learning-center" secret list
```

## Hermes Auth 憑證池維護（opencode-zen / opencode-go 等）

Hermes 自身有 credential pool（`~/.hermes/auth.json`），與 GitHub Secrets / Vercel 是**不同存放處**。修復 provider 拒絕的 key 時用以下流程。

### 診斷
```bash
hermes auth list                       # 看每 provider 狀態：logged in / 401 / 429
hermes auth status opencode-zen        # 注意：status 必帶 provider，裸打報 "required: provider"
```
- `401 ModelError` = provider 端拒絕該 key（舊 key 或 key 失效）
- `429 GoUsageLimitError` = 限流，可 `hermes auth reset` 或待自動 retry

### 重註冊（萬能代理完整授權下可自主執行）
```bash
# 1. 加新 key —— 必須帶 --label，否則卡在互動式 input() 等 stdin → EOFError 崩潰
hermes auth add opencode-zen --type api-key --api-key "<NEW_KEY>" --label api-key-zen
# 2. 清 exhaustion / 限流標記
hermes auth reset opencode-zen
# 3. 移除失效舊條目（會一併清 .env 該 key 並 suppress 防再生）
hermes auth remove opencode-zen 1
# 4. 驗證
hermes auth status opencode-zen        # → logged in
```

### 坑
- **oauth 類型未實作**：`hermes auth add opencode-zen --type oauth` 直接報 "not implemented for auth type oauth yet" —— 只能走 `--type api-key`。
- **shell env vs vault**：`hermes auth list` 讀 vault，不是當前 shell 的 env 變數。若 key 在 `.env` 但 vault 條目失效，需重 `add` + `remove` 舊條目。
- **key 貼聊天後務必赴 portal 輪換**：輪換後把新 key 給分身重新注入（見上方流程）。

## 祕密來源現實 (2026-08-20 實戰 — MCP env 注入前必讀)
為 MCP server / 部署注入憑證時, 來源可靠性天差地別。本輪幫用戶把 Capacities/Obsidian 憑證接入 Hermes MCP, 踩遍所有來源陷阱:

- **GitHub Actions Secrets 不可讀回明文** — `gh secret get CAPACITIES_API_KEY` 直接報 `unknown command "get" for "gh secret"` (GitHub 安全模型只支援 `gh secret set`, 不開放讀回)。**不要假設能從 GitHub 祕密管理員「索取」明文**。若要用 GitHub 的值, 只能請用戶從 Web UI (Settings → Secrets → Actions) 複製貼給你, 或貼 `gh secret set` 指令讓用戶自己跑。
- **Vercel `vercel env pull` 可取明文, 但小心 mock 值** — `vercel env pull /tmp/x.txt --environment production` 能拉出 esggo 專案的 production env; 但 `OMNITABLE_API_KEY` 在 esggo 專案裡是 `dev_mock_key_12345` (測試佔位假值), 直接拿去連 Capacities API 會 404。**拉到值先驗證是否有效**, 別當真實 key 用。
- **1Password `op` CLI 需解鎖 session** — `op whoami` 鎖定時報 `no account found for filter`; `op item list` 無輸出。需要用戶在 1Password 桌面版/瀏覽器點一下解鎖, 讓 `op` 拿到 session 後才能 `op item get`。
- **本地 secret-vault** — `C:\Users\dingj\secret-vault\ENV20230818.env` (chmod 600, gitignored)。這是首選落地處: 拿到真實 key 後 `python3` 精準覆寫該行 (不要用 `echo >>` 重複追加, 會產生重複 key 行)。
- **⚠️ 貼來的 key 先驗證再落地** — 用戶貼 `kvu84` 當 Capacities key, 直接 `curl -H "Authorization: Bearer kvu84" https://api.capacities.io/v1/spaces` 回 `404 Not found` → 無效 (太短/片段/測試字)。**絕對不要用未驗證的值覆寫 vault 裡的可能真實值**, 也不要假裝遷移成功。先 `curl`/API 探針確認有效, 再寫入。
- **Capacities MCP 套件本身壞了** — `capacities-mcp@1.0.2` 用的 `fastmcp` 與新版 `@modelcontextprotocol/sdk` 不相容, 啟動即崩 `Error: Server does not support completions (required for completion/complete)`。**繞過: 直接用 Capacities REST API** (`https://api.capacities.io/v1/spaces`, `Bearer` token) 拉資料, 再寫入目標, 不依賴該壞 MCP。

## 注意事項

- PowerShell 5.1 使用 `System.IO.File` / `[System.Text.UTF8Encoding]` 處理 UTF-8 No BOM，避免中文亂碼
- 如遇 PowerShell `curl` 別名問題，請改用 `curl.exe`
- 新金鑰應分段提供；完成後應清除聊天紀錄中的敏感字樣

## 已確認的金鑰格式 (2026-07-30)

- Supabase anon: `sb_publishable_PLACEHOLDER`
- Supabase service_role: `sb_secret_PLACEHOLDER`
- Gemini API Key: `AQ_PLACEHOLDER`