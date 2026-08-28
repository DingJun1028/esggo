# Tool Limitation Recovery Patterns

通用工具失效降級模式庫。每次會話若遇到新失效模式，加一条 `## Pattern N`。

## Pattern 1: SSH terminal wall + computer_use timeout (Windows Hermes Desktop)

**症狀**
- `terminal` 報 `SSH connection failed: getsockname failed: Not a socket`
- `computer_use` 報 `cua-driver session never reached ready (timeout 30s; stuck in phase: manifest-discovery)`

**不重試的 dead end**
- 重跑同一條 terminal 指令不會恢復；重啟 cua-driver 需要使用者手動 `hermes computer-use install` / `doctor`

**可行的 fallback 順序**
1. `mcp__my_server__write_file` / `create_directory` — 只做檔案寫入，不跑 shell
2. `web_search` / `web_extract` / `browser_*` — 唯讀網路/瀏覽器操作
3. `execute_code` — Python 邏輯運算，不碰 shell
4. 提供使用者手動 PowerShell / Git Bash 指令區塊，附完整複製貼上腳本

**誠實回報格式**
```
⚠️ 阻塞: terminal SSH + computer_use 雙通道失效
✅ 已用 MCP 檔案通道完成: <具體檔案>
❌ 未完成: <具體任務，需 shell/git>
修復方式: 
  A. hermes computer-use doctor && hermes computer-use install
  B. 手動貼上以下 PowerShell 腳本...
```

## Pattern 2: MCP file server JSON escaping

**症狀**
- `tool_call` 的 `arguments` 欄位含多行 TS/JSON 時報 `Expecting ',' delimiter`

**解法**
- 改用 `mcp__my_server__write_file` 直接寫入，避免雙重 JSON 轉義
- 若仍要用 tool_call，把 content 拆成最小單位或先寫臨時檔

## Pattern 3: Git operations without terminal

**症狀**
- 需要 `git add/commit/push/merge`，但 terminal 與 computer_use 皆失效

**解法**
- 先確保所有檔案經 MCP 寫入完成
- 提供完整 Git Bash / PowerShell 指令給使用者手動執行
- 不假稱已完成 push/merge；誠實區分「檔案已寫入」與「Git 已完成」

## Pattern 4: Browser timeout on GitHub pages

**症狀**
- `browser_navigate` 到 `github.com` 120s timeout

**解法**
- 不要重試同一 URL
- 改用 `web_extract` / `web_search` 取得 repo 資訊
- 或用 `gh` CLI 經 terminal（若 terminal 通線）

## 不記錄為 pattern 的（環境依賴，不 durable）
- 特定 binary 缺失（`cua-driver` binary missing）
- 單次 SSH key 問題
- 單次 npm/pnpm 版本錯誤
- 具體 API key 未配置