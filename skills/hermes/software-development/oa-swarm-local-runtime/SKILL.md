---
name: oa-swarm-local-runtime
description: OA-Team 30 蜂群本機運行與 OAB broker 部署的 CrewAI/Ollama 相容性坑與已驗證修復。
tags: [oa-team, crewai, ollama, swarm, omniautobus, oab, esggo]
---

# OA-Team 30 本機蜂群運行時（OA-Swarm Local Runtime）

> 2026-08-09 實證固化，2026-08-10 補 pm2 daemon 與 git push 衝突模式。OA 六節點中 OA-Team（蜂群協作層）與 OAB（事件總線）的本機實體化路線與坑。

## 1. 三層 + OAB 實體化狀態（2026-08-10 更新）

| 節點 | 狀態 | 載體 |
|------|------|------|
| OA-Local | ✅ | Ollama + tracker 腳本 + Telegram notify |
| OA-Team | 🟢 CrewAI 實體化 | `esggo-learning-center/oa-team-crewai`（CrewAI JSON-first） |
| OA-VPS | ✅ | WebUI :8790 (Tailscale 可達) + CrewAI 部署 + OAB broker pm2 常駐 |
| OA-TWINS | 🟡 | 記憶雙路徑✅，事件互聯經 OAB |
| OAB | 🟢 broker 實體化 + pm2 常駐 | `oa-twins/oab/broker.py` 修復 + VPS `pm2 start oab-broker` |

## 2. CrewAI JSON-first 蜂群（OA-Team）

### 2.1 路線（非幻影）
- ⚠️ **`agents-cli swarm start --agents=30` 是幻影指令**（三源驗證不存在）。用 **CrewAI `load_crew()`** 或 Hermes `delegate_task`。
- 專案結構：`crew.jsonc`（5 squad 引用）+ `agents/*.jsonc`（30 個，標準欄位 `role/goal/backstory/allow_delegation`，可選 `llm`）+ `main.py`（`load_crew` + Flow kickoff）。
- 驗證：`python verify_oa_team_structure.py --crew-dir .` → `30 agents / 5 tasks`。

### 2.2 本機 Ollama 相容性（必卡點，已驗證解法）

| 現象 | 根因 | 解法 |
|------|------|------|
| `ValueError: Invalid response from LLM call - None or empty` | (a) **reasoning 模型**（gemma4）答案在 `reasoning` 欄、`content` 空；(b) CrewAI 0.175 對有 delegation/tools 的 agent 走 `call_llm_native_tools`，Ollama 小模型回空 | (a) 改用 `qwen2.5:3b-instruct-q4_K_M`（非 reasoning，本機已裝）；(b) `load_crew` 後遍歷 `crew.agents` 設 `tools=[]` / `allow_delegation=False` / `function_calling_llm=None` |
| Ollama `/v1/chat/completions` 首請求 `HTTP=000` | OpenAI 端點首次熱身慢（12-30s） | curl `-m 60`；CrewAI 自帶重試 |
| Ollama 進程消失 | gemma4 8B CPU 長推理資源耗盡 | 用 3b；崩後 `ollama serve`；`/api/tags` 驗活（勿用 `/api/health` 不存在） |

### 2.3 環境驅動設計（§19 拒絕偏離）
- agent jsonc **不含硬編 `llm`**（環境驅動，CI 友好）。
- 本地跑用 gitignore 的 wrapper（不進庫）：`run_local.sh`（`export OPENAI_API_BASE=http://localhost:11434/v1 OPENAI_MODEL_NAME=qwen2.5:3b-instruct-q4_K_M`）+ `run_swarm_local.py`（關 native tools 後 `crew.kickoff()`）。
  - **已驗證端到端**：2026-08-10 `proc_4768b1b2c1a7` 跑完 `exit 0`，Flow Completed，`None or empty` 錯誤計數 0，日誌含 `========== 蜂群答案 ==========` 分隔符輸出真答案。
- ⚠️ CrewAI 0.175 **不讀 `OPENAI_MODEL_NAME`** 決定 model（預設 `gpt-4.1-mini` from `constants.py`）。本機 Ollama 生效靠 wrapper 關 tools 路徑 + 模型選非 reasoning，非 env model 注入。
- ⚠️ **回推幻影修正**：本機跑通後曾試圖把 `llm` 硬編進 30 jsonc 提交，經用戶裁定「還原到 HEAD」——`git checkout -- oa-team-crewai/agents/ oa-team-crewai/gen_agents.py` 還原，倉庫保持環境驅動。往後同類問題一律還原，本地差異走 gitignore wrapper，不再漂移。

## 3. OAB broker 實體化（OmniAgentBus）

### 3.1 三個已修復 bug（`oa-twins/oab/broker.py`）
1. `__slots__` 寫 `"event"` 但 `__init__` 設 `self.eventType` → `AttributeError`。改 slots 為 `eventType`。
2. `_matches(tags, topic)` 對 `subscribe("platform:", _h)` 解析 `want=""` 不匹配任何 `platform:*` tag。加分支：`topic=="platform:"` → 匹配任意 `platform:*` 子類。
3. `_amain` heartbeat 分支 `OmniAgentBus(...)` **未傳 `store_dir=args.store`** → `self._path=None` → journal 不寫。改 `store_dir=args.store`。

### 3.2 啟動與驗證（VPS）

```bash
# 本地 self-test (應收 ['health.heartbeat','swarm.phase'], journal size 2, entropy<0.1)
python3 broker.py --bus local --store ./journal --self-test
# VPS 部署運行 (ssh -f 避免 foreground 卡 timeout: 背景進程持 fd 致 SSH 不釋放)
ssh -f esggo-vps "cd /opt/esggo/oa-twins/oab && pkill -f 'broker.py --bus vps'; sleep 1; mkdir -p journal; setsid python3 broker.py --bus vps --store /opt/esggo/oa-twins/oab/journal --heartbeat > oab.log 2>&1 < /dev/null &"
```
- journal 寫入 `{bus_id}.oab.jsonl`（如 `vps.oab.jsonl`），不可變稽核軌跡。
- 查狀態：`ssh esggo-vps "pgrep -f 'broker.py --bus vps'"` + `ls journal/`。

### 3.3 ⚠️ daemon 化 heartbeat 陷阱（2026-08-10 實證）

`setsid ... < /dev/null &` 或 `nohup ... &` 啟動的 OAB broker，**self-test 寫 journal 正常，但 `--heartbeat` 背景模式 journal 不增長**（非 `-u` 模式 timeout 殺時 buffer 丟失；即便 `-u` 前台跑 10s 寫 7 條，daemon 化後停在 7 條不推進）。

根因：asyncio 事件迴圈在 daemon 化（setsid/nohup+disown，stdin=/dev/null）且無外部 I/O 時會停滯。

**已驗證解法：用 pm2 管理**（pm2 正確處理 daemon 化 + asyncio）：

```bash
ssh esggo-vps "cd /opt/esggo/oa-twins/oab && pkill -f 'broker.py --bus vps'; sleep 2; \
  pm2 start broker.py --name oab-broker --interpreter python3 \
    -- --bus vps --store /opt/esggo/oa-twins/oab/journal --heartbeat && pm2 save"
```
- pm2 啟動後 heartbeat journal 持續累積（7→13→... 條），`pm2 list` 顯示 `online`。
- `pm2 save` 寫入 `/home/ubuntu/.pm2/dump.pm2`，VPS 重啟自動恢復。
- 驗證：`wc -l journal/*.jsonl` 應隨時間增長；`pm2 logs oab-broker` 看輸出。

### 3.4 git 推送衝突處理（未追蹤檔擋 rebase）

推送 `esggo-learning-center` 遇 `rebase` 被未追蹤檔（如 `float.html`/`lang-matrix.mjs`）擋住 `would be overwritten by checkout`：

```bash
# 1. 備份衝突未追蹤檔到 /tmp
mkdir -p /tmp/esggo_lc_conflicts
mv "apps/universal-translator/public/float.html" /tmp/esggo_lc_conflicts/
mv "apps/universal-translator/types/generated/lang-matrix.mjs" /tmp/esggo_lc_conflicts/
mv "scripts/sync-lang-matrix.mjs" /tmp/esggo_lc_conflicts/
# 2. rebase 拉遠端
git pull --rebase origin main
# 3. push（若 commit 與遠端重複會被 drop，結果仍同步）
git push origin main
# 4. 恢復備份檔（不丟使用者的其他進行中工作）
mv /tmp/esggo_lc_conflicts/* 目標路徑/
```
- 若本地 commit 內容遠端已有，`rebase` 會 `dropping <hash> ... patch contents already upstream`，結果 `Everything up-to-date` 屬正常。

## 4. 相關 Skills
- `oa-team-swarm`（含幻影指令 `agents-cli swarm start` 待 adopt 修正；VPS IP 應為 161.118.248.180 非 252.147）
- `oa-components`（OAB 狀態待 adopt 更新為 🟢 pm2 常駐）
- `best-practice-awakening`（六則含「幻影不執」「蜂群驗結」）
- `oa-swarm-operations`（雙生代理+決策樹+共享記憶）

## 5. 支援檔案（本 skill 附）
- `scripts/run_swarm_local.py` — 已驗證的本地蜂群執行器（關 native tools/delegation，Ollama 相容）。複製到 `oa-team-crewai/` 並加 `.gitignore` 後使用。
- `references/tailscale-hermes-webui.md` — VPS docker `0.0.0.0:8790` + Tailscale IP/MagicDNS 手機存取實證。
- `references/crewai-ollama-pitfalls.md` — CrewAI+Ollama 相容性坑詳解。
- `references/ts-sync-reverse-trap.md` — types 同步反向陷阱（貼文聲稱「extra 要刪」實為 generated 缺後段要補，先核對來源再動手）。
