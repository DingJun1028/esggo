# 秘密管理員 授權調閱申請單（Groq API Key — TencentDB Memory Gateway）

- 申請單號：**TDAI-2026-0801-001**（沿用既有 reference 格式，可合併/續號）
- 申請人（授權主體）：丁俊宏（DingJun1028 / dingjunhong1028@gmail.com）
- 申請日期：2026-08-01
- 用途：TencentDB Agent Memory Gateway（Hermes 本機記憶系統 v1 主路徑）LLM 引擎
- 請求項目：Groq API Key（`gsk_...`）
  - 端點：`https://api.groq.com/openai/v1`
  - 模型：`openai/gpt-oss-20b`（30 RPM / 1K RPD / 8K TPM，2026-08-01 驗證）
- 權限範圍：僅 LLM 推論調用（Groq 帳號內無其他授權）
- 保管方式：GitHub Secrets（DingJun1028 repos）+ 本機 `HERMES_HOME\.env`（`TDAI_LLM_API_KEY`）
- 調閱方式：① 授權主體本人貼出 key（本次），或 ② 1Password SA token 授權後自動取用
- 風險處置：key 經聊天紀錄傳遞 → 接線完成後依 31-key 輪換規範建議輪換
- 失效條件：TDAI-2026-0801-001 完成驗證（/health ok + L0-L3 抽取）後撤銷，或保留供 VPS v2 備援複用

## 執行鏈（key 到位後 10 分鐘完測）
1. `$env:TDAI_LLM_API_KEY="***"`
2. `powershell -ExecutionPolicy Bypass -File "...\hermes-memory-tencentdb-windows\scripts\setup-tdai-memory.ps1"`
3. 重啟 Hermes → `curl http://127.0.0.1:8420/health` → runbook 5 步驗證

## 替代調閱通道（若 key 已在某處）
| 通道 | 狀態 | 解鎖動作 |
|------|------|----------|
| Groq Console（console.groq.com/keys） | 瀏覽器已就位，登入牆 | 選 Continue with GitHub（DingJun1028）→ API Keys → Create → 貼回 |
| 1Password（vault `esggo`） | 未解鎖（history 實證） | GUI 開 Settings→Developer→Integrate with 1Password CLI + Windows Hello → 回「啟用了」 |
| GitHub Secrets | 值不可讀（僅 list/set/delete） | 不適用取值，只作保管 |
| GCP Secret Manager（esg-sunshine） | 需 gcloud auth | 同 1Password 解鎖後可由我代查 |
