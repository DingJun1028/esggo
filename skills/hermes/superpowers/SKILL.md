---
name: superpowers
category: software-development
version: "1.0.0"
author: obra / Prime Radiant (captured by OA-Team)
license: "MIT License"
description: Superpowers 編碼代理方法論 技能系統 跨 OpenCode Hermes 等多 CLI 安裝矩陣
tags: [superpowers, methodology, skills-system, opencode, hermes, tdd, subagent]
metadata:
  hermes:
    tags: [superpowers, methodology, skills-system, opencode, hermes]
    related_skills: [skills-sync, hermes-cli-catalog, oa-team-soul-canon]
---

# Superpowers — 編碼代理軟體開發方法論

## When to use
- 用戶提及 Superpowers、coding-agent 方法論、subagent-driven-development、brainstorming→plans→TDD 流程。
- 用戶要在 Hermes / OpenCode 等多 CLI 環境建立可組合技能系統（見 `skills-sync` 雙向同步契約）。
- 用戶問 TDD / systematic-debugging / writing-plans / requesting-code-review 的標準實踐。

## 核心運作
- 啟動即觸發：**先不寫碼，先釐清真正要做什麼**（brainstorming）。
- 產出可分段閱讀的設計文件 → 用戶簽核。
- 簽核後寫實作計畫（給「熱情但品味差、無判斷力、厭惡測試的菜鳥」也能跟）→ 強調真 TDD / YAGNI / DRY。
- 「go」後啟動 subagent-driven-development，自主推進數小時不偏離計畫。
- 技能自動觸發，無需特別操作。

## 基礎工作流（7 階段，強制非建議）
1. **brainstorming** — 寫碼前啟動。蘇格拉底式釐清，分段呈現設計供驗證，存設計文件。
2. **using-git-worktrees** — 設計通過後。建隔離 workspace（新 branch），跑專案 setup，驗證乾淨測試基線。
3. **writing-plans** — 核可設計後。拆成 2–5 分鐘小任務，每個含確切檔案路徑/完整碼/驗證步驟。
4. **subagent-driven-development** / **executing-plans** — 有計畫後。每任務派新 subagent + 兩階段審查（規格合規→程式品質），或批次執行+人工檢查點。
5. **test-driven-development** — 實作中。RED-GREEN-REFACTOR：先寫失敗測試→看它失敗→寫最小碼→看通過→commit。刪除測試前寫的碼。
6. **requesting-code-review** — 任務間。對照計畫審查，按嚴重度回報，critical 阻擋。
7. **finishing-a-development-branch** — 任務完。驗證測試，選 merge/PR/keep/discard，清理 worktree。對於部署/網際網路-facing 變更，額外執行 5T 驗證閘：
   - **Traceable**: 驗證 identity/key (e.g. `auth/verify` → `valid: true`)
   - **Trackable**: 驗證容器 uptime (e.g. `docker ps` → `Up Xh (healthy)`)
   - **Tangible**: 驗證面向用戶的回應 (e.g. `curl` → HTTP 200 + expected content)
   - **Transparent**: 驗證公開端點 (e.g. Cloudflare Tunnel → HTTPS 200)
   - **Trustworthy**: 驗證 auth/identity (e.g. Bearer token → `userId: usr-...`)

   > 示例：Obsidian sync 部署驗證 — `hermex.esggo.co:200`, `memory.esggo.co:200`, `gateway.esggo.co:200` 三域名同時回應 200 才算完成。

> **代理在任一任務前檢查相關技能。** 強制工作流，非建議。

## 技能庫（What's Inside）
- **Testing**: test-driven-development（RED-GREEN-REFACTOR，含反模式參考）
- **Debugging**: systematic-debugging（4 階段根因）、verification-before-completion
- **Collaboration**: brainstorming、writing-plans、executing-plans、dispatching-parallel-agents、requesting-code-review、receiving-code-review、using-git-worktrees、finishing-a-development-branch、subagent-driven-development
- **Meta**: writing-skills（含測試方法論）、using-superpowers

## 安裝矩陣（多 CLI — 即本輪「CLI」焦點）
> 每個 harness 分開裝。以下為各 CLI 安裝指令（擷取自上游 README）：

| CLI | 安裝指令 |
| --- | --- |
| **Hermes Agent** | `hermes plugins install obra/superpowers --enable`（裝後重啟 session；Hermes 無 post-compaction hook，壓實過首輪的長 session 會丟 bootstrap → 開新 session） |
| OpenCode | 令 OpenCode：`Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md` |
| Claude Code | `/plugin install superpowers@claude-plugins-official` 或 marketplace `obra/superpowers-marketplace` |
| Antigravity | `agy plugin install https://github.com/obra/superpowers` |
| Codex App / CLI | 官方 Codex plugin marketplace 搜 `superpowers` |
| Cursor | `/add-plugin superpowers` |
| Devin CLI | `devin plugins install obra/superpowers` |
| Factory Droid | `droid plugin marketplace add https://github.com/obra/superpowers` → `droid plugin install superpowers@superpowers` |
| Gemini CLI | `gemini extensions install https://github.com/obra/superpowers` |
| GitHub Copilot CLI | `copilot plugin marketplace add obra/superpowers-marketplace` → `copilot plugin install superpowers@superpowers-marketplace` |
| Grok Build CLI | `grok plugin install superpowers@xai-official --trust` |
| Kimi Code | `/plugins install https://github.com/obra/superpowers` |
| Pi | `pi install git:github.com/obra/superpowers` |

- 倉庫：`https://github.com/obra/superpowers`（MIT License）
- 社群：Discord `https://discord.gg/35wsABTejz`、Issues `https://github.com/obra/superpowers/issues`
- 視覺遙測：brainstorming 視覺伴侶預設載 Prime Radiant logo（含版本號，不含專案/提示內容）；設 `SUPERPOWERS_DISABLE_TELEMETRY` 停用。

## 哲學
- **TDD**：先寫測試。
- **Systematic over ad-hoc**：流程勝於猜測。
- **Complexity reduction**：簡單為首要目標。
- **Evidence over claims**：聲稱前先驗證。

## 5T 對應（接入 OA-Team 知識花園）
- **Traceable**：每階段產物（設計文件/計畫/測試）可溯源至任務。
- **Trackable**：git worktree + 分支流轉即軌跡。
- **Tangible**：分段設計供人類簽核、兩階段審查回饋。
- **Transparent**：技能自動觸發、工作流公開。
- **Trustworthy**：TDD + 驗證後完成 + critical 阻擋，確保不可竄改的正確性。

## 與 skills-sync 的關係（雙向同步）
- Superpowers 本身是跨 harness 技能系統，**OpenCode 與 Hermes 皆為其目標 CLI**——這與 `skills-sync` 的「Hermes 技能樹 ↔ esggo OmniTag OpenCode 雙格式」契約同向。
- 本技能（superpowers）已納入 Hermes 技能樹，將經 `skills-sync` 轉 OpenCode 格式並同步至 `esggo` @ `OmniTag`。
- 若用戶啟用上游 Superpowers 插件（`hermes plugins install obra/superpowers --enable`），其內建 sub-skills（brainstorming/TDD 等）會與本擷取技能共存；本技能僅為方法論索引，實際 sub-skills 需從 `obra/superpowers` 倉庫取得。

## 已知限制
- 本技能為上游 README 頂層方法論擷取；實際 sub-skills 內容不在貼文中，需從 `obra/superpowers` 取得。
- `gg4` 一詞仍未定義（用戶標為焦點主題，但技能樹/記憶/檔案均無命中）；本契約暫不假設其形態。
- 容器無 `hermes` 二進位，無法實跑 `hermes plugins install`；安裝須在主機執行。
