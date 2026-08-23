---
name: hermes-webui-slow-diagnose
description: Hermes WebUI 慢/逾時診斷 4 大根因 state.db trigram 遺留 cjk_fts cron 憑證 Docker chown 卡死
---

# Hermes WebUI 慢/逾時診斷技能

## When to use
- Hermes WebUI（:8787 / :8788）開啟慢、查詢轉圈、頁面逾時、candidate 候選撈取要 7-13 秒。
- 使用者回報 `hermes-webui` 容器 unhealthy 或 docker desktop 啟動後 WebUI 起不來。
- 需要對 WebUI 遲緩做根因定位與修復，且不想盲目重啟。

## 四大根因（實戰順序）

### 1. state.db trigram 遺留表 / FTS 膨脹
- **症狀**：candidate 候選查詢 7-13 秒；`sqlite3 state.db "SELECT ... trigram"` 慢。
- **根因**：舊版 Hermes 建了 `messages_fts_trigram` / `trigram` 表 + 相關 trigger + view，新版不再用但未清理；`cjk_fts=true` 致 FTS5 索引膨脹。
- **修復**（先備份）：
  ```bash
  cp state.db state.db.bak.$(date +%s)
  sqlite3 state.db "DROP TABLE IF EXISTS messages_fts_trigram; DROP TABLE IF EXISTS trigram; DROP TRIGGER IF EXISTS ...; DROP VIEW IF EXISTS messages_fts_trigram_src;"
  sqlite3 state.db "PRAGMA wal_checkpoint(TRUNCATE);"
  # 授權後再 VACUUM（背景跑，4.6GB 約 300s）
  sqlite3 state.db "VACUUM;"
  ```
- **驗證**：`sqlite3 state.db "SELECT id,preview FROM messages_fts WHERE messages_fts MATCH 'candidate' ORDER BY rank LIMIT 200;"` 應 0.04s 級。

### 2. cjk_fts 設定
- 檢查 `~/.hermes/config.yaml` 的 `cjk_fts:` 應設 `false`（除非確需 CJK FTS）。
- 改完重啟 Hermes WebUI。

### 3. cron / agent 憑證缺失（blocked_config）
- **症狀**：OA-Team 健康檢查 cron 報 `blocked_config`，非端口錯（如 8788 是歷史備份值，現行 config 正確 :11434）。
- **根因**：過期 OAuth token / 缺失 API key。
- **修復**：`hermes cron edit <id> --model custom-ollama/gemma4:latest`（pin 到本機 Ollama 免 key），繞過過期憑證。

### 4. Docker chown 卡死（Windows bind-mount）
- **症狀**：`hermes-webui` 容器 unhealthy，healthcheck 打 `localhost:8787/health` 連不上；容器內無 python/server.py 進程；日誌停在 init 腳本 `usermod` 後。
- **根因**：`docker_init.bash` 的 `chown_home_hermeswebui` 對 bind-mount 進來的 `C:/Users/<user>/.hermes`（含 4.6GB state.db）執行 `find ... -exec chown`，Windows Docker bind-mount 不支援 Unix chown 語義，每 call 逾時重試 → 卡死，永遠到不了 `python server.py`。
- **臨時修復**（容器內，可逆）：
  ```bash
  docker exec hermes-webui-hermes-webui-1 bash -c "set -a; . /tmp/hermeswebui_root_env.txt 2>/dev/null; set +a; cd /app && python server.py"
  ```
  server 起來後 healthcheck 翻 healthy，host `127.0.0.1:8787/health` 回 200。
- **根治**（需改 `docker_init.bash`，用戶授權才動）：Windows 上跳過 chown 或加 `2>/dev/null` + timeout。

## 5T 對應
- **Traceable**：備份 `state.db.bak.*` 留痕；診斷步驟可重現。
- **Trackable**：每步 `sqlite3` / `docker` 指令皆有輸出可追。
- **Tangible**：查詢耗時從 7-13s → 0.04s 可感知。
- **Transparent**：四根因公開說明，不隱瞞「歷史備份值」與「Windows chown 限制」。
- **Trustworthy**：備份在前、VACUUM 授權後跑；不擅自改用戶未授權的專案文件。

## 相關
- `hermes-auth-lock-repair`：auth store lock timeout 修復（本技能互補）。
- `oa-team-soul-canon`：5T 協定總典。
- `skills-sync`：雙向同步至 esggo @ OmniTag 時，本技能須 `git add -f`（受 `/skills/` gitignore 影響）。
