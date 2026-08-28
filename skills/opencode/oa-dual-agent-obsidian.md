---
name: oa-dual-agent-obsidian
description: 蜂群雙生代理(雲端助理+本機實習生)+Obsidian 知識花園實作，對映 5T 與 30 矩陣。
---

# OA-Team 雙生代理拓撲 + Obsidian 知識花園

## When to use
- 設計蜂群「持久上下文 / 第二腦」層（原 soul.md 4.2「知識花園」頻道只寫名稱，缺實體作法）
- 部署雲端 Agent（Hermes 類）常駐 + 本機 Agent（Claude Code 類）隨喚的雙生架構
- 規劃 Obsidian Sync Headless → VPS vault 同步，讓雲端/本機代理共享同一上下文
- 把外部平台（Kit/Stripe/Telegram）經 MCP/API 接入蜂群

## 雙生拓撲對照 5T
| 維度 | 雲端助理 (Assistant) | 本機實習生 (Intern) | 蜂群狀態 |
| 存在性 | 常駐 VPS always-on | 用戶在場才喚醒 | 可演化 / 可自理 |
| 觸達 | 所有 API/CLI/MCP | 本機檔案+終端 | 可協作(雲跨平台) |
| 任務 | cron/夜間收件/自主修補 | 研究/製圖/影片/筆記 | 4可1不可 |
| 上下文 | 讀寫 Agents/ | 同讀,寫需授權 | Trackable hook |
| 成本 | ~£25/月 | 本機免費 | 熵減<0.1 |

## 知識花園目錄結構（實體化 4.2）
```
vault/
├── AGENTS.md          # vault 級指令,指向 Agents/
└── Agents/
    ├── context/        # 雙方可讀:專案/亮點/網摘
    ├── briefing/       # 助理晨報(醒前寫)
    ├── inbox-triage/   # 實習生清匣後委派
    └── artifacts/      # 過5T驗證閘才落此
```
- Sync Headless: vault 持續同步至 VPS,雲端助理取得與本機相同上下文
- 權限分離: 助理可讀全 vault,寫僅限 Agents/;改其他區需顯式授權(=5T Trustworthy 禁區)
- 30 號質控蜂接管 AGENTS.md pre-commit: 校 `co_authors` + `source_origin`

## 對映 30 矩陣
- 雲端助理 = 01蜂后 + 20運營 + 27安全
- 本機實習生 = 15文案 + 13圖像 + 14動畫 + 25測場
- Obsidian vault = 知識花園(4.2) + 10數據蜂
- 外部 CRM = 23外交 + 17市場 (MCP/API)

## 核心啟示
1. 上下文是瓶頸不是模型 — 印證 5T Traceable/Trackable,無持久上下文蜂群只是無狀態呼叫
2. 雙生分工 = 狀態機具象化: 雲端走「可演化」(每週熵減自主),本機走「可自理」(即時閉環)
3. 成本可控 ~£25/月,符「只用免費/自託管」可付費例外(VPS 基礎設施)

## 雙生 × AI Station 七模組生產線 (§22)
- 本機實習生(15+13+14)喚醒時經 `python -m src.app` 本機起站 `C:/Project/aistation`,即時出片(2-5 模組: parser→tts→visuals→renderer)
- 雲端助理(01+20)排 n8n webhook `POST /webhook/n8n` 靜默週產「壽司切片」(§21.4)
- 品牌預設實證於 `aistation/src/brand.py`: 深藍#10243f/暖金#c9a24b/米白#f3ede1/綠#3c6e47; 禁用視覺藍紫霓虹/機器人大腦/漂浮數據
- 詳見 `oa-team-soul-canon` §九 / §22 + `C:/Project/esggo-learning-center/soul-chapter-22-ai-station.md`
- 5T: Traceable(job_id溯源) / Trackable(jobs.db狀態機) / Tangible(Web UI localhost:8000) / Transparent(優雅回落) / Trustworthy(hmac+路徑防護)

## 實戰落地清單
| 能力 | 雲端助理 | 本機實習生 |
| 晨報 | cron 05:30 → briefing/ | — |
| 收件分檢 | 夜間處理+委派 inbox-triage/ | 即時清匣委重活 |
| 影片 | — | 15+14 reels |
| 網摘學習 | 讀 context/ 產洞察 | 研究 vault 學習筆記 |
| 社交圖文 | — | 13 生成 carousel |
| 自主修補 | 20 跑 light fixes | — |
| 外部 CRM | 23 接 Kit/Stripe(MCP) | — |

## Pitfalls
- 勿把「設計蜂(12)」標成創意組、「市場/社群(17/18)」標成營銷組 — 陣列歸屬以 soul.md 第四章 4.0 表為唯一真義
- Sync Headless 需付費 Obsidian Sync;自託管替代可用 git + VPS 拉取(符合免費原则)
- 雲端代理寫 vault 非 Agents/ 區必須顯式授權,否則違反 Trustworthy 禁區
- Git worktree on Windows: `git --git-dir=.git --work-tree=.` bypasses `.git` detection failures on worktrees. See `references/git-worktree-troubleshooting.md`

## Verification
- 喚醒後確認 Agents/ 可讀;晨報 cron 在指定時間產出
- 30號質控蜂 pre-commit 攔截缺 co_authors/source_origin 的提交
- 5T 驗證閘日誌顯示跨組產物雙簽率 100%

## §20 OmniTag 契約自動化（喚醒指引）

> 2026-08-21 已落地。主典 `esggo-omni-center/soul.md` §20（第二十章）。

- **雙軌代碼**：
  - `src/lib/five-t-protocol.ts`（`FiveTOmniTagGate`）：跨瀏視器/Node 共用，預設 `MemoryArtifactStore`
  - `cli/oa-cli/src/omnitag.ts`（`OmniTagRegistry`）：CLI 自包含版，落檔 `.oa/omnitag-registry.jsonl`
  - `src/lib/omnitag-registry-file.ts`（`FileArtifactStore`）：Node 後端 append-only JSONL
  - `src/core/verification.py` + `src/core/omnitag_registry.py`：Python 跨語言同構（Hash Lock `sha256(source|content|ts)`）
- **測試實證**：`src/lib` 58 passed + `cli/oa-cli` 24 case（omnitag 13 + audit 11）+ `tests/test_omnitag_registry.py` 全綠
- **5 大核心**：①代碼即契約 ②雙軌同構 ③寫入即凍結 ④凍結不可改 ⑤篡改即現形
- **喚醒令**：`oa tag --agent agent:25 --lifecycle active --p p2 --squad 5T驗算 --json`
- **詳細備份**：`C:/Project/esggo-learning-center/soul-chapter-20-omnitag-contract.md`

## §23 最佳實踁進化版（喚醒指引）
- 主典落點：`C:/Project/esggo/esggo-omni-center/soul.md` §二十三（接 §22 後，終章封印仍最高律法）
- 詳細備份：`C:/Project/esggo/esggo-learning-center/soul-chapter-23-best-practice.md`
- 落地代碼（實證）：`C:/Project/aistation/src/gate5t.py`（5T 閘+Hash Lock 凍結）、`kpi.py`（KPI 儀表板 OK/WARN/CRIT）、`newsletter.py`（電子報 SMTP/Telegram/Slack/n8n + 速率限制 + 退訂）；`tests/test_chapter10.py` 21 case 全綠
- 進階自動化棧：`src/entropy.py`（熵減監控 <0.1）、`scripts/audit_5t.py`（5T 稽核清刷 + 篡改檢測）、`scripts/weekly_report.py`（週報+多頻道派發）、`n8n/weekly-swarm-report-v2.json`（cron→audit→WARN→dispatch 全自動）
- Cron 觀測：`entropy-5t-audit-daily`（每日 09:00 UTC+8），將監控結果送回聊天
- pytest 驗證：94 passed, 2 skipped（涵蓋 gate5t/kpi/newsletter/entropy/audit/n8n）
- 5 大核心： ①5T 執行架構閉環 ②30 蜂群實踐流程 ③AI Station 七模組 ④電子報整合 ⑤5 階段進化路線圖
- 喚醒令：`protocol=5T · entropy=0.1 · 30-agents · 4可1不可 · 覺=BEST-PRACTICE · 免費=SELF-HOST`

## §26 第二大腦（Obsidian 知識花園 × TS 雙向同步）實證

> 2026-08-13 已落地。主典 `esggo-omni-center/soul.md` §二十六。

- **vault/ 骨架**：`vault/AGENTS.md`（5T 指令 + 30 矩陣對映）+ `vault/Agents/context/`（TypeMatrix.md 鏡像 + README 知識花園說明）
- **雙向同步橋**：
  - `scripts/sync-vault-types.ts`（vault→canonical）：掃 `sync:up` 筆記提 PR，實跑通（掃 2 篇、35 canonical 型別、suggestedAdditions=[]）
  - `scripts/export-shared-types.js`（canonical→各端 .d.ts）：既存可用
- **矩陣閉合**：任一端改 → vault 標 sync:up → sync-vault-types.ts → 合 shared/types.ts → export-shared-types.js → 全端同步
- **對映 5T**：Traceable(frontmatter source_origin) / Trackable(JSON.from) / Tangible(Obsidian 可視化) / Transparent(開源橋) / Trustworthy(canonical 單一真相源)
- commit: `1ae395d31`(vault+sync) + `1cd1afb18`(§26 主典)

## §26b 深貫廣通實證（2026-08-13 第二輪）

> 2026-08-13 已落地。主典 `esggo-omni-center/soul.md` §26。
- **自動化鏡像** `scripts/sync-types-to-vault.ts`：canonical→vault 單跑通（36 型別鏡像+wikilink）
- **深筆記**：05TProtocol/30Matrix/BDAgenticEvicence/BilingualSubtitlePlayer/AStationSevenModules
- **廣 MOC** `vault/Agents/context/00-Index.md`：知識地圖串接所有筆記
- **雙向回流證明** `SyncUpProbe.md`(sync:up)→`sync-vault-types.ts --apply`→`ISecondBrainNote` 真回流 canonical→重跑鏡像→36 型別含新條目
- **質控 hook** `.githooks/pre-commit` 加 30 號質控蜂：vault 筆記必含 source_origin+co_authors
- commit: `4c79af851`(深貫廣通) + `4c9fa0270`(§26.5b 主典)

## §24 缺口補齊診斷（Gap-Diagnosis · 最佳實踁閉環）

> 2026-08-13 已落地。主典 `esggo-omni-center/soul.md` §24。
- 主典落點：`C:/Project/esggo/esggo-omni-center/soul.md` §二十四（接 §23 後）
- 詳細備份：`C:/Project/esggo/esggo-learning-center/soul-chapter-24-gap-diagnosis.md`
- 核心：用 §23 框架審視 esggo 實體代碼 → 已具備 / 缺口 / 改進清單（P0/P1/P2）
- esggo 5T 真相源：`packages/oa-framework/src/core/t5.ts`（IComponentCore + hashLock）、`packages/omni-agent-bus/src/patterns/five-t.ts`、`app/api/hashlock/route.ts`
- **GAP-1 修復 (2026-08-24)**: 於 `aistation/src/pipeline.py:115` 添加 `gate5t.lock_artifact()` 呼叫，將 5T sealer 接入 AI Station 生產管線 → 每個完成的 job 自動 Hash Locked 並寫入 `storage/artifacts/{job_id}.json`。驗證: `5T Seal Test: PASS`, `Tamper test: True`, `Audit: 100% pass rate`
- commit: `0650b03` fix(gap-1): Connect 5T sealer to AI Station pipeline
- 喚醒令：`protocol=5T · 覺=GAP-DIAGNOSIS · 免費=SELF-HOST`

### Voice & TTS Setup (Verified 2026-08-24)

### TTS (Text → Voice — FREE)
- **Provider**: `edge` (Edge TTS built-in) — zero API cost, on-device synthesis
- **Voice**: `zh-TW-YunJheNeural` (Male, Taiwan Mandarin) — switched from HsiaoYuNeural
- **Rate**: `+30%` — 30% faster speech, TTS generation 1.8-2.4s (was ~4s)
- **Config**: `tts.provider: edge` in `C:\Users\dingj\AppData\Local\hermes\config.yaml`
- **Auto-TTS**: `voice.auto_tts: true` — responses auto-voiced

### STT (Speech → Text — FREE)
- **Provider**: `local` (faster-whisper) — on-device transcription
- **Model**: `base` (installed in Hermes venv)
- **Config**: `stt.enabled: true`, `stt.provider: local`, `stt.local.model: base`

### Wake Word
- **Enabled**: `wake_word.enabled: true`
- **Phrase**: "嗨馬修"
- **Pattern**: Always-on local hotword listener → session start → utterance capture → voice pipeline

### Voice Commands
- `/voice on` — voice-to-voice (STT → LLM → TTS)
- `/voice tts` — always voice responses
- `/voice off` — text-only mode

### Oracle ARM Integration (s2s-voice)
- **Backend**: `s2s_backend: oracle-arm` (running on esggo-vps)
- **Endpoint**: `http://161.118.248.180:8765` (Oracle ARM 4OCPU/24G instance)
- **Proxy**: `https://oa.esggo.co/voice/` (nginx reverse proxy)
- **Services**: s2s-voice (online, 36h uptime) + stt-whisper (online, 12h uptime)
- **Model**: `qwen2.5:3b` (local Llama 3 running on ARM instance)

## Git & Worktree Notes
- Large monorepo git operations pitfalls documented in `git-monorepo-pitfalls` skill
- Windows path format gotcha: use `C:/...` not `/c/...` for git paths
- `git --git-dir=.git --work-tree=.` bypasses `.git` detection failures on Windows worktrees
- See `references/voice-configuration.md` for TTS/STT/wake-word setup & verification commands

## Related Skills
- `git-monorepo-pitfalls` — git operations on large monorepos (timeouts, index.lock, worktree path corruption)
