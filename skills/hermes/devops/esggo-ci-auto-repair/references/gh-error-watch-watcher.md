# GitHub 報錯通知信自動修復機制 — 輪詢式監視器 + 萬能分身跟蹤

實作於 DingJun1028/esggo（2026-08-07）。解決用戶需求：「GitHub 報錯通知信 → 收信即偵測 →
完整修復 + 補齊缺口 + 派萬能分身 (OA-TWINS) 跟蹤」。

## 為什麼不是「email webhook 觸發」
- AgentMail 未在本環境配置（`~/.hermes/config.yaml` 無 `AGENTMAIL_API_KEY`）。
- 無公開 webhook 伺服器。skill `agentmail` 明載：即時 inbound 用 webhook 需公開伺服器，
  個人使用改用 cron 輪詢。
→ 因此用 **cron 輪詢 GitHub failure API** 作為「收報錯即偵測」的務實落地（等效於收信觸發）。

## 三層機制
1. **auto-repair.yml v2.2**（已 push）：CI 失敗時 `tracker-notify` job 除建 GitHub Issue
   （label `auto-repair/tracker/swarm`）+ 發 Telegram 外，新增 `Send repair notification email`
   step（用 `dawidd6/action-send-mail@v3`，`continue-on-error: true`，依賴 `SMTP_*` /
   `NOTIFY_EMAIL_TO` secrets，未設則 skip 不阻塞）。這就是「GitHub 報錯通知信」。
2. **gh-error-watch.py**（Hermes script，路徑
   `C:/Users/dingj/AppData/Local/hermes/scripts/gh-error-watch.py`）：輪詢
   `DingJun1028/esggo` 最近 20 個 workflow runs，`conclusion in (failure, cancelled, timed_out)`
   且 `run.id > 已知 newest_run_id`（state 檔 `.gh_watch_state.json`）才視為 new_failure。
   對每個 new_failure：下載真實失敗 log（`gh run view --log-failed --job <id>`——對齊
   「只信 pipeline log，不臆測」教訓），用關鍵字分類 error_type（security/typescript/
   eslint/build/prisma/docker/dependency/other），輸出 JSON：
   `{"action":"delegate"|"none","new_failures":[...],"newest_run_id":"..."}`。
   無新失敗 → `action:"none"`（cron job 靜默結束，不發訊）。
3. **cronjob `gh-error-mail-watch`**（Hermes cron，每 15 分鐘，skill `esggo-ci-auto-repair`）：
   跑腳本；`action=="delegate"` 時：(a) 為每個 new_failure 建 tracking issue
   （label 用倉庫**既存**的 `OmniAgent`/`auto-fix`/`github_actions`，不要用 auto-repair 等
   不存在的 label——見下方 PITFALL）；(b) `delegate_task` 派 OA 蜂群做完整修復 + 補齊缺口。

## 真實驗證（本輪）
- `python3 gh-error-watch.py` 真實抓到 5+ 個歷史 CI 失敗 run（ESG-GO CI/CD / Deploy to VPS /
  Sacred Pipeline / learning-center-ci / AI Station image），並下載真實失敗 log 分類。
- 建 tracking issue #429（label `OmniAgent,auto-fix,github_actions`）= 派萬能分身跟蹤示範。
- auto-repair.yml 經 `python yaml.safe_load` 驗證 YAML_OK；已 commit push（v2.2）。

## PITFALLS
- **`gh issue create` 用 `-l`/`--label`，不是 `--labels`**（新版 gh CLI 改了 flag 名，
  舊 `--labels` 報 `unknown flag`）。且 label 必須**倉庫已存在**，否則
  `could not add label: 'X' not found`——用 `gh label list` 先查。本倉庫可用：`OmniAgent`
  （請萬能代理自動處理）、`auto-fix`、`github_actions`、`bug` 等。
- **state 檔首次跑會把最近所有 failure 當 new**：這是正確的（建立基線）。之後只偵測
  新於 `newest_run_id` 的。不要每次都「修所有歷史失敗」。
- **cronjob deliver 設 `local`** 時輸出只存不回傳本 session（CLI 無 live-delivery channel）。
  若要通知，設 `deliver: 'telegram'` 或 `'all'`（需 Telegram 已連）。
- **auto-repair.yml 的 email step 必須 `continue-on-error: true`**：SMTP secret 未設時
  不能讓整個 CI 紅掉。
- **不要動其他累積未提交變更**：esggo 工作區常累積 24+ 未提交項（oci_*.sh、src/*、
  next-env.d.ts）。提交 auto-repair 變更時只 `git add .github/workflows/auto-repair.yml`，
  排除其他。

## 複用
未來要「收 X 通知即修復」一律走此模式：cron 輪詢 + 真實 log 下載 + tracking issue
（既存 label）+ delegate OA 蜂群。需要 email 即時性時再接 AgentMail webhook。
