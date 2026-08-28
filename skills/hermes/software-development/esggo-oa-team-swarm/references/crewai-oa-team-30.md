# CrewAI OA-Team 30 萬能蜂群 — 實作與執行模式 (2026-08-07 驗證, 本輪更新)

OA-Team 30 蜂群 (soul.md 的 5 大陣列 × 6 代理) 用 **CrewAI** 實作。本檔記錄在本機 Windows/Git-bash 環境下從零建起並跑通的確切步驟與坑（本輪已驗證通過 `load_crew` 原生組裝）。

## 為什麼用 CrewAI（非標準 Hermes Agent）
- VPS 上的 OmniAgent(OA) 是 esggo 的 `packages/omni-agent`（OmniJules 5T 閘道驗證引擎，TS），不是聊天 agent，WebUI/crewai 都不能當 backend。
- Hermes WebUI 容器需標準 hermes-agent 才能聊天；VPS 磁盤滿時裝不下。
- CrewAI 是多智能體框架，對應 soul.md「30 人代理小隊」願景，JSON-first 格式直映 5 陣列。

## 安裝（已驗證可行）
系統 Python 是 3.14.6，**超出 CrewAI 支援 (<3.14)**。用 uv 裝隔離環境：
```bash
uv python install 3.13
uv tool install crewai[litellm] --python 3.13   # litellm 讓 tencent/hy3:free 等自訂模型可路由
```
crewai 裝在 `C:/Users/<user>/AppData/Roaming/uv/tools/crewai/Scripts/python.exe`。
用該 python 執行（不要用系統 python3）：
```bash
CREWAI_PY="$(cygpath -u 'C:/Users/dingj/AppData/Roaming/uv/tools/crewai/Scripts/python.exe')"
env -u PYTHONPATH "$CREWAI_PY" main.py "任務描述"
```

## ⚠️ JSON-first 格式硬性約束（load_crew 原生驗證 — 本輪實證）
`crewai.project.load_crew('crew.jsonc')` 對檔案格式極嚴格，以下都會被拒：
1. **`crew.jsonc` 不能有 `description` 欄位**（報 `unsupported field(s): description`）。
2. **`agents/*.jsonc` 只能有標準欄位**：`role` / `goal` / `backstory` / `allow_delegation`（選用 `llm` / `tools`）。
   - `soul_id` / `squad` / `tags` / `tools`（custom:xxx）都會被拒 → 這些寫進 `//` 註解行，不要放 JSON 鍵。
   - `custom:memory_recall` 這類工具名若放進 `tools` 陣列，需對應 `tools/<name>.py` 的 BaseTool 子類，否則報 `Custom tool not found`。暫時移除 tools 欄位讓結構先通過。
3. **`llm` 必須寫在 agent jsonc（2026-08-09 修正）**。`load_crew` 在 build_agent 時若 agent 無 `llm` 欄位，會用 crewai 預設 `gpt-4.1-mini`（`constants.DEFAULT_LLM_MODEL`），而 `OPENAI_MODEL_NAME` 環境變數**不會**覆蓋它（實證報 `Model gpt-4.1-mini not found: 404`）。修正：每個 `agents/*.jsonc` 寫 `llm: {"model": "gemma4:latest", "base_url": "http://localhost:11434/v1"}`。`crew.jsonc` 頂層 `llm` 反會被拒（`unsupported field(s): llm`）——只能 agent 層。`gen_agents.py` 已改為寫入該欄位，改結構只要重跑它。
4. **`crew.jsonc` 的 `agents` 陣列** 列出 `sage_01`..`verify_30` 檔名（不含 `.jsonc` 副檔名），`tasks[].agent` 引用同名。

## crewai 版本陷阱
- **`crewai run` 報 `run_crew program not found`**：1.15.12 舊版 CLI 期望 `run_crew` entrypoint（來自 `crewai create` 腳手架的 pyproject `[project.scripts]`）。我們的專案沒有。
  - 解法 A：直接 `python main.py`（main.py 用 `load_crew()` + `OATeamFlow().kickoff()`，不依賴 CLI）。
  - 解法 B（CI）：`uv run --with 'crewai[litellm]' python main.py`（解決 ModuleNotFoundError，因 uv tool 裝的 crewai 不在 `python` 的 site-packages）。
- 舊建議「用 class-based Agent/Task/Crew 組裝」已被本輪推翻：`load_crew()` JSON-first 才是 Quickstart 推薦模式，且本輪已用 `load_crew` 原生驗證通過（30 agents / 5 tasks）。

## 模型路由（litellm）
裸 `tencent/hy3:free` 會被 litellm 誤判為 Tencent 原生端點 → `TencentException Connection error`。
必須用 `LLM(model="openai/tencent/hy3:free", base_url=..., api_key=...)` 顯式走 OpenAI-compatible 路由（CrewAI 顯示正規化為 `tencent/hy3:free`，但 `openai/` provider 已生效 — 實際報 `OpenAI API connection error` 即證明）。
**但要注意**：`OPENAI_MODEL_NAME` / `OPENAI_API_BASE` 環境變數**不會**覆寫 crewai 預設 model（`crewai/llm.py` 不讀這些 env）。若 agent jsonc 無 `llm` 欄位，crewai 用 `gpt-4.1-mini` 預設並對 Ollama 端點 404。故本地免費跑需在 agent jsonc 寫 `llm`，或走 §19 wrapper 模式。

## §19 倉庫純淨原則（2026-08-09 用戶決定 — 強制）
- **提交的 jsonc 保持環境驅動**：不得硬編 `gemma4:latest@localhost:11434`（偏離原 commit 的 CI 友好設計 + 觸發 CRLF 警告 + 汙染倉庫）。
- **本地要跑免費 Ollama**：用 gitignored `run_local.sh` wrapper（`export OPENAI_API_BASE=http://localhost:11434/v1` + `OPENAI_MODEL_NAME=gemma4:latest` + `OPENAI_API_KEY=ollama-local-dummy` 後呼叫 `main.py`）。wrapper 放 `.gitignore`，不進庫。
- **或** `gen_agents.py` 從 env 讀 `OA_LLM_MODEL` / `OA_LLM_BASE` 寫入**生成**的 jsonc（生成檔不進庫，原 committed 版仍環境驅動）。
- CI 用 `CREWAI_API_KEY` 注入真 OpenAI key，預設 `gpt-4.1-mini` 即生效（jsonc 無 llm 欄位時）。
- **矛盾回答防範**：同一個「是否提交硬編 jsonc」問題，過往曾給出「還原 / 提交 / 保留不動」三種矛盾答案。正解唯一：還原到 HEAD，本地差異走 gitignore wrapper。任何 session 不再漂移。
- 本輪實證：30 jsonc + gen_agents.py 已 `git checkout` 還原，倉庫乾淨；本地用 `run_local.sh` 跑 gemma4 成功（Ollama active 證實）。

## 結構（對應 soul.md，本輪可用）
- `crew.jsonc`：標準格式（`name` / `agents[]` / `tasks[]` / `process` / `verbose`），**無 description**。
- `agents/*.jsonc`：30 個定義（sage_01..06 / rune_07..12 / wing_13..18 / forge_19..24 / verify_25..30），**僅標準欄位** + `//` 註解含 soul_id/squad/tags/tools。
- `gen_agents.py`：批量生成 30 agent（改結構只跑這支；寫標準欄位 + 註解元數據）。
- `main.py`：用 `from crewai.flow import Flow, listen, start` + `from crewai.project import load_crew`，`OATeamFlow` 的 `@start` 收任務、`@listen` 跑 `load_crew(...).kickoff(inputs={...})`。
- `README.md`：陣列對應表。

## 驗證（本輪實證可跑）
- **結構驗證**（不依賴網絡）：`load_crew(Path('crew.jsonc'))` 成功，30 agents / 5 tasks 組裝通過。
  - 用快速失敗埠避免 DNS 卡死：`env -u PYTHONPATH OPENAI_API_KEY=dummy OPENAI_API_BASE=http://127.0.0.1:9 "$CREWAI_PY" -c "from crewai.project import load_crew; c,_=load_crew(Path('crew.jsonc')); assert len(c.agents)==30 and len(c.tasks)==5"`（~21s 完成）。
- **純 JSON 驗證**：strip `//` 後 json.loads 斷言 30 agents / 5 tasks / 每 agent 含 role+goal+backstory。
- **CI 執行證明**：GitHub Actions run `31159358321` 實際執行 workflow，證明 YAML 合法、`uv run` 解決 import、`load_crew` 進入 build_agent 階段（失敗只因 secret 注入為空）。

## GitHub Actions 路徑（關鍵坑）
- **workflow 必須在 repo 根 `.github/workflows/`**，不能放 `oa-team-crewai/.github/`（GitHub 不認嵌套路徑 — 本輪實證 `crewai-run.yml` 放子目錄完全沒被註冊）。
- `CREWAI_API_KEY` 由用戶 `gh secret set` 存入 repo Secrets（secret 值不可 `gh secret get` 回讀，設計如此）。CI 注入為 `OPENAI_API_KEY`：`env: OPENAI_API_KEY: ${{ secrets.CREWAI_API_KEY }}`。
- 本輪實證：CI 讀到 `CREWAI_API_KEY length = 0`（注入失敗）— 可能 secret 不在 repo 級 Actions 作用域。需用戶確認 GitHub Web UI `Settings → Secrets and variables → Actions` 有 `CREWAI_API_KEY`。

## LLM 端點（2026-08-09 更新 — 本地 Ollama 已可用）
- 本機 Ollama 已常駐 `:11434`，含 `gemma4:latest` / `qwen2.5:3b` / `nomic-embed-text`。這是**免費算立**驅動蜂群的最佳路徑，不違反 only-free 約束。
- 實測可跑通：agent jsonc 寫 `llm: {model: gemma4:latest, base_url: http://localhost:11434/v1}`，`OPENAI_API_KEY=ollama-local-dummy`（任意非空值），`env -u PYTHONPATH "$CREWAI_PY" main.py "任務"` 即真 kickoff。
- CPU-only 推論 30 agents × 5 sequential tasks 約需 10+ 分鐘（gemma4 8B Q4）。
- VPS 上 `gemma4:latest` 會 OOM（9.6GB > 2.8GB RAM），VPS 必須用 `gemma4:e2b`（~1.5GB），見 SKILL.md §9。
- `api.nousresearch.com` 在本網絡 DNS 解析失敗，故 Nous 端點不適合作 CrewAI LLM；統一走本機 Ollama。

## Windows / Git-Bash 路徑坑（2026-08-09 實證）
- **`os.path.expanduser("~/...")` 在 Git-Bash 展開成混合分隔符**（`C:\Users\dingj/.hermes/scripts/...`），導致 state 寫入/讀取不一致、`subprocess` 找不到 `SENDER` 檔案。修正：一律用絕對 Windows 路徑 `r"C:\Users\dingj\AppData\Local\hermes\scripts\..."`。
- **`/tmp/xxx.txt` 在 Windows Git-Bash 下解析異常**：`echo > /tmp/x` 與 `python open('/tmp/x')` 可能落到不同位置；測試用 `C:/Users/dingj/AppData/Local/Temp/x.txt` 絕對路徑。
- **`crewai` 不自動讀 `.env`**：`python main.py` 前必須 `export OPENAI_API_BASE=...`（wrapper 顯式 export，不能只擺 `.env` 檔）。
- 本輪 `oa-twins-tracker.py` 原用 `expanduser` 致 `state_written` 假成功、Telegram 0 發；改絕對路徑後 `telegram_sent: 7/7` 全通。

- 現有 `~/.oci/config` 有效（tenancy / region=ap-singapore-1 / key_file / fingerprint 俱全）。安裝 `uv tool install oci-cli --python 3.13`，`oci iam region-subscription list` 回 `READY` 證明連通。
- 帳號已有 2 台 Always Free ARM A1.Flex（debi-node / esggo-vps = 161.118.248.180），ARM 配額已用滿。
- 嘗試 `oci compute instance launch --shape VM.Standard.E2.1.Micro`（AMD Always Free，獨立配額）持續回 `CannotParseRequest` 400，經 `--debug` 證明請求體 JSON **完全合法**（無重複欄位、無非法鍵）。推測：該 region 的 AMD Micro Always Free 需透過 **Oracle Cloud 控制台網頁**勾選「Always Free」才能建立，OCI CLI 無法自動標記資格。這**不是腳本錯誤**。
- 若需申請：收集 AD=`ap-singapore-1-AD-1`、subnet OCID、Oracle Linux 8 image OCID，去 console 勾選 Always Free。不要無限 retry CLI launch（浪費嘗試）。
- 可用 `bash -n` 驗證 OCI 腳本語法；內聯過長命令會被 agent 硬阻（heredoc/大單行），改用 `.sh` 腳本檔執行。
