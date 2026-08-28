# CrewAI 實作 OA-Team 30 萬能蜂群 — 實戰參考

對應 `soul.md` 的「30 Souls Matrix」：5 大陣列 × 6 代理。本檔記錄 2026-08-07 實作驗證通過的
CrewAI 1.15.12 JSON-first 模式，以及所有踩過的坑。

## 1. 檔案結構（已驗證可 `load_crew()`）

```
oa-team-crewai/
├── crew.jsonc          # CrewAI JSON-first：agents[] + tasks[] + process
├── agents/             # 30 個 agent：sage_01..sage_06 / rune_07..rune_12 /
│                       #   wing_13..wing_18 / forge_19..forge_24 / verify_25..verify_30
├── main.py             # Flow 入口：load_crew() + OATeamFlow
├── gen_agents.py       # 批量生成 30 agent（對應 soul.md 5 陣列）
├── pyproject.toml      # requires-python >=3.10,<3.14；deps crewai[litellm]
└── .env.example
```

## 2. CrewAI 1.15.12 關鍵坑（本機 Windows + uv 環境）

| # | 坑 | 解法 |
|---|-----|------|
| 1 | **Python 版本**：CrewAI 需 `>=3.10,<3.14`；用戶本機是 3.14.6 → 直接 `python3 main.py` 報 `No module named 'crewai'` | `uv python install 3.13`，用 crewai 工具自帶的 python：`$HOME/AppData/Roaming/uv/tools/crewai/Scripts/python.exe` |
| 2 | **PYTHONPATH 污染**：Hermes venv 的損壞 pydantic 被 PYTHONPATH 帶入，crewai import 報 `No module named 'pydantic_core._pydantic_core'` | 執行前 `env -u PYTHONPATH`（保留其他 env，只清 PYTHONPATH） |
| 3 | **litellm 缺漏**：非原生模型（如 `tencent/hy3:free`）報 `LiteLLM fallback package is not installed` | `uv tool install crewai[litellm] --python 3.13`（裝 litellm 1.95） |
| 4 | **JSON-first 欄位限制**：`crew.jsonc` 不能有 `description`；agent JSONC 不能有 `soul_id`/`squad`/`tags` 等非標準欄位，否則 `JSONProjectValidationError` | 元數據（soul_id/squad/tags/tools）寫進 `//` 註解行，JSON 本體只留 role/goal/backstory/llm/allow_delegation |
| 5 | **custom: 工具不存在**：agent 裡寫 `"tools": ["custom:memory_recall"]` 但 `tools/` 沒對應 `.py` → `Custom tool not found` | 暫時移除 tools 欄位，或實作 `tools/<name>.py`（BaseTool 子類） |
| 6 | **模型路由**：裸 `tencent/hy3:free` 被 litellm 誤判為 Tencent 原生 → `TencentException - Connection error` | OpenAI-compatible 端點用 `openai/<model>` 前綴 + `LLM(base_url=..., api_key=...)`；或 env `OPENAI_API_BASE` + `OPENAI_API_KEY` |
| 7 | **crewai run 舊 CLI**：1.15.12 的 `crewai run` 期望 `run_crew` entrypoint（`[project.scripts]`），我們沒 → `Failed to spawn: run_crew` | 不靠 CLI；`main.py` 直接 `load_crew(Path('crew.jsonc'))` 後 `crew.kickoff(inputs=...)` |
| 8 | **load_crew 卡網絡**：用不可達端點（Nous DNS 失敗）時 `load_crew` 逐 agent 建 LLM 物件會卡 260s+ | 純結構驗證改用快速失敗埠 `OPENAI_API_BASE=http://127.0.0.1:9`，秒退且仍證明 JSON 被 CrewAI 接受 |
| 9 | **CrewAI 預設模型 404**：未指定模型時 crewai 0.175 用 `DEFAULT_LLM_MODEL="gpt-4.1-mini"`（見 `constants.py:348`），報 `Model gpt-4.1-mini not found`。`OPENAI_MODEL_NAME` / `OPENAI_API_KEY` 都不會覆寫這個預設 | 必須在 agent jsonc 加 `llm` 欄位（`{"model":"openai/qwen2.5:3b-instruct-q4_K_M","base_url":"http://localhost:11434/v1","api_key":"dummy"}`）或靠執行期 wrapper 注入。注意 §19：倉庫 jsonc 應保持環境驅動、不硬編；硬編 Ollama 是偏離，需 `git checkout` 還原 |
| 10 | **reasoning 模型 → CrewAI 空回應**：gemma4 是 reasoning 模型，OpenAI 端點回 `content:""`、答案在 `reasoning` 欄 → CrewAI `call_llm_native_tools` 報 `ValueError: Invalid response from LLM call - None or empty` | 本地蜂群改用**非 reasoning** 模型 `qwen2.5:3b-instruct-q4_K_M`（本機 Ollama 已裝），content 正常。gemma4 8B 長時間 CPU 推理還會把 Ollama 壓垮（服務消失、連線 HTTP=000） |
| 11 | **Ollama `/v1` 端點冷啟動延遲**：Ollama 重啟後首次 `/v1/chat/completions` 可能延遲 12s+ 才回（curl 誤判 HTTP=000）；`/api/tags` 正常不代表 `/v1` 已熱 | 先打一次 `/v1/models` 或 `/api/tags` 暖機，再跑蜂群；重啟後等 ~5s |


## 3. 5 大陣列 → CrewAI agent 對應

```
智庫聖所 (01-06)  sage_*   #記憶聖所 #全知之眼     → extract_essence  task (sage_01)
符文契約   (07-12)  rune_*   #神聖契約 #雙向TS       → forge_contract   task (rune_07)
光之羽翼   (13-18)  wing_*   #光之羽翼 #自主代行     → dispatch_swarm   task (wing_13)
煉金熵減   (19-24)  forge_*  #原罪煉金 #熵減寶石     → entropy_forge    task (forge_19)
5T 驗算    (25-30)  verify_* #零幻覺 #HashLock       → verify_5t        task (verify_25)
```
process = sequential（三步協作流：提純→協同→驗算）。

## 4. 執行方式（本機 Ollama 免費算立 — 2026-08-10 驗證可用）

```bash
cd oa-team-crewai
# run_local.sh (gitignored) 內容：本地用 qwen2.5 非 reasoning 模型驅動，不汙染倉庫 jsonc
export OPENAI_API_KEY="ollama-local-dummy"
export OPENAI_API_BASE="http://localhost:11434/v1"
export OPENAI_MODEL_NAME="qwen2.5:3b-instruct-q4_K_M"   # 非 reasoning，CrewAI 相容
env -u PYTHONPATH "$HOME/AppData/Roaming/uv/tools/crewai/Scripts/python.exe" main.py "任務描述"
```

- **§19 原則**：倉庫 `agents/*.jsonc` 保持環境驅動（不寫 `llm` 硬編 Ollama）。本地差異走 `run_local.sh`（gitignore）+ `.env`（gitignore）。若發現 30 個 jsonc 被改硬編 `gemma4:latest@localhost:11434`，`git checkout -- oa-team-crewai/agents/ oa-team-crewai/gen_agents.py` 還原。
- agent jsonc 若需顯式 `llm` 欄位（僅在確定要鎖模型時）：`"llm": {"model":"openai/qwen2.5:3b-instruct-q4_K_M","base_url":"http://localhost:11434/v1","api_key":"dummy"}`。

## 5. 當前環境狀態（2026-08-10 更新）

- 本機 Ollama `:11434` **可達**（gemma4 / qwen2.5:3b / nomic-embed-text）。gemma4 為 reasoning 模型勿直接用於 CrewAI（見坑 #10）。
- Nous DNS 失敗問題已由本機 Ollama 繞開（免費算立，符合「只用免費」原則）。
- VPS `161.118.248.180` 也有 Ollama；CrewAI 已裝（`~/oa-team-crewai`，注意 tar 解開多套一層目錄）。
- VPS 磁碟 45G 已滿問題仍待處理（見 §6）。

## 6. VPS 部署上下文（同一 VPS 161.118.248.180 的埠地圖）

| 服務 | 埠 | 說明 |
|------|----|------|
| omni-blueprint-hub | 8787 | OA 的 blueprint hub (pm2) |
| universal-translator | 8788 | 免費版 Live 翻譯（已跑） |
| hermes-webui | 8790 | Hermes WebUI docker（需容器內裝 hermes-agent 才能聊天） |

- VPS SSH：用 config host `esggo-vps-root`（key `esggo_original`，user root）。直連 `root@161.118.248.180` 報 `Permission denied (publickey)`。
- VPS 磁碟 45G **已滿 (100%)**：運行中 docker 鏡像 13GB+ 不能刪；`journalctl --vacuum-time=2h` + `apt-get clean` 釋放 ~244M，docker prune 收效甚微。裝新框架前先確認空間。
- Hermes WebUI 從 `nesquena/hermes-webui` clone；其 `docker-compose.yml` 硬編 8787，須 sed 改 8790 避免與 omni-blueprint-hub 撞埠。
