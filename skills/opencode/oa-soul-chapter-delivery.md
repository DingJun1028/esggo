---
name: oa-soul-chapter-delivery
description: OA-Team soul.md 章節 3 層落檔 + aistation 5T 代碼 + pytest 驗證流程。
---

# OA-Team Soul.md 最佳實踐章節交付

## When to use
- 用戶要求解說 / 落地 / 補寫 soul.md 某章（特別是「最佳實踐」「進化版」「5T 實踐」類章節）。
- 用戶下達「全部都要」「3 層都要」：解說 + 落地代碼 + 3 層交付 + 診斷，同時做。
- 要把 AI Station / 5T 協議 / 30 矩陣 落成可執行機制（非紙上願景）。

## 3 層交付協定（用戶硬偏好，必做）
1. **主典**：`C:/Project/esggo/esggo-omni-center/soul.md` 插入新 §章節（接在最後一章之後；終章封印仍為最高律法，不逾界）。
   - ⚠️ 注意：master canon 檔名為 `soul.md`，**不是** `soul-full.md`（後者是早期草稿，已廢用）。
2. **備份**：`C:/Project/esggo/esggo-learning-center/soul-chapter-XX-*.md`（詳細版，含 5T 驗證段與啟動令）。
   - ⚠️ 注意：備份檔案編號與主典不一定對應。例如 `soul-chapter-23-best-practice.md` 實際內含 §22 + §23 + §24（多章併編）。
3. **喚醒技能**：更新 `oa-dual-agent-obsidian` SKILL.md 補 §章喚醒指引（落點路徑 + 5 大核心 + 喚醒令）。

> 注意：`oa-team-soul-canon` 與 `oa-dual-agent-obsidian` 皆為 **user-owned**（見 memory：寫入被拒須先 `hermes curator adopt`）。本會話實測對 oa-dual-agent-obsidian 可寫，但標準流程應先 adopt，否則未來可能被拒。

## 章節編號陷阱（v0.6 結構）
- 主典已是 v0.6：終章在檔尾，§1–§21 為正篇，§22–§24 為當前用戶委製附錄，接在 §21 之後、終章封印之前。
- 用戶委製附錄章節會**往後遞增編號**（本會話新增 §22 AI Station → §23 Best Practice → §24 Gap Diagnosis）。
- **不要硬插「第十章」**：會與既有 `soul-chapter-10-entropy-week.md` 撞號；用 `grep -nE '第二十章|第二十一章|terminapter' soul.md` 查現有章號再決定。
- ⚠️ **插入點驗證**：總是檢查終章封印 `═════════ 終章` 的行號，確保新章節插入在其之前，而非之後（違反終章鐵律）。

## 落地代碼模式（aistation，Python 3.11）
三件套，皆通過 pytest 實證（見 references/pitfalls.md 取關鍵片段）：
- `src/gate5t.py`：5T 驗證閘（`verify_5t`）+ Hash Lock 凍結（`lock_artifact` 回 frozen dataclass，改值拋 `FrozenInstanceError`；驗證失敗拋 `ValueError` 不釋出）。
- `src/kpi.py`：KPI 儀表板（OK/WARN/CRIT 閾值告警，對接 `metrics.compute_metrics`）。
- `src/newsletter.py`：電子報（SMTP / Telegram / Slack / n8n + HMAC V2 簽章 + 速率限制 + 一鍵退訂）。
- 測試：`tests/test_chapter10.py`（21 case 全綠：10 gate5t + 6 kpi + 5 newsletter + 3 weekly_report E2E）。

## Pitfalls（本會話實證，見 references/pitfalls.md）

### New Technique: When browser automation fails (HTTP 402, browser daemon unavailable)
Use AI image generation (`image_generate` tool) as fallback for creating visual assets:
1. Write detailed HTML template with exact specs (brand colors, typography, layout)
2. Define structured prompts: `[theme] image - [breakpoint] ([dimensions]). [subject]. [style]. [colors].`
3. Call `image_generate` once per breakpoint variant (desktop/tablet/mobile/compact)
4. Download via `curl -L -o <filename> <url>` in a loop with `&&` chaining
5. Verify with `ls -lh *.png | wc -l` before proceeding
6. See `references/esg-image-generation-workflows.md` for full workflow + prompt templates

- **search_files 在 Windows `C:\\` 路徑失效**：回 0 或 IO error，即使檔案存在。改用 `terminal` + `grep -nE` / `find` 取章節結構與落點。forward-slash `C:/` 也不可靠。
- **aistation 直譯器**：Python 3.11.15（可用），python3=3.14.6（勿混用）。
- **Restarting Hermes Gateway from inside the gateway process**: When the shell process is a child of the gateway, `hermes gateway restart` is blocked. Solution: run `hermes gateway run` from a separate background process outside the running gateway.
- **Dual `.env` file problem**: Different `.env` files may have different `API_SERVER_KEY`. Always verify which `.env` the config references.
- **CI TypeScript checking**: Don't use `tsc --noEmit file.ts` (single-file can't resolve project aliases/paths). Use `pnpm typecheck` (based on tsconfig.json).
- **GitHub API rate limiting with curl**: curl + python3 JSON parsing may hit rate limits. Always include User-Agent header.
- **iCloud sync blocking plugin file writes**: iCloud Drive files on Windows may return `OSError [Errno 22]`. Retry or edit via Obsidian UI.
- **`pnpm vitest run` worker crash**: `Error: Worker exited unexpectedly` (exit 124) is an environment issue. CI uses `continue-on-error: true`.
- **aistation 直譯器**：`python`=3.11.15（可用），`python3`=3.14.6（勿混用）；pytest 9.1.1 已裝。
- **dataclass 欄位順序**：`GateReport(passed, checks=...)` 報 `missing 1 required positional argument` —— 有預設值欄位須排在有預設值之後（或全給預設）。修正：`passed: bool = False`。
- **pytest fixture 作用域**：`isolated_state` 定義在 `test_aistation.py` 而非 conftest；新測試檔須自帶同款 fixture（重定向 `config.STORAGE_DIR` + `db.DB_PATH` 到 `tmp_path` 並 `db.init_db()`），否則 `fixture 'isolated_state' not found`。
- **patch 工具對部分讀取檔案警告**：追加章節到檔尾用 `patch` 匹配末段唯一文字即可，不需全讀整檔。
- **跨檔案批量替換**：當需在多個檔案中同步替換相同字串（如品牌名重命名），使用 `sed -i` 比多次 `patch` 更可靠。指令形如 `sed -i 's/old/new/g' src/file1.py src/file2.py tests/test_x.py`。在 Windows Git-Bash 環境下可直接運行。`patch` 對於多檔案同時修改容易因 `old_string` 唯一性失敗，且每次都需完整上下文；`sed` 一次處理全部更高效。
- **`enqueue()` vs `submit()` 同步模式**：`enqueue()` 是同步阻塞模式（直接呼叫 `run_pipeline()`） — 適用於 webhook 流程需立即回傳結果；`submit()` 是非同步背景模式（透過 ThreadPoolExecutor） — 適用於 API 呼叫需即刻返回 `job_id`，後續輪詢。兩者皆須接受 `voice`/`style_name`/`style_text` 參數以支援 TTS voice override。Webhook 端點不應同時呼叫 `submit()` + `enqueue()`，會導致 job_id 不匹配與背景線程序浪費。
- **pytest monkeypatch fixture 作用域**：`_fake_enqueue` mock 必須接受與實際函數簽名完全一致的參數（包括 `video_ratio=None`），否則 FastAPI TestClient 會因 `TypeError: unexpected keyword argument` 失敗。
- **`_split_long_narration` 需包含句末標點才會分割**：單一句子無標點（如逗號結尾）不會被分割，因 `_split_sentences` 只在 `。.!?！？` 後分割。測試文字必須包含中文句號。
- **Python heredoc 與 `\n` 轉義**：在 `python3 << PYEOF` 腳本中寫入含 `\n` 的 Python 字串字面量時，`\\n` 會被解釋為 literal newline 而非 escape sequence，導致 SyntaxError。使用 `\\\\n` 來表示字面上的 `\n`。
- **`skill_manage(action='patch')` 陷阱**：short `old_string` may match adjacent sections and clobber them. When patching large SKILL.md files, include ≥2 lines of surrounding context in `old_string`, or use `skill_manage(action='edit')` for full-rewrite. When the skill name doesn't resolve (common on Windows path with non-ASCII chars), fall back to the `patch` tool with explicit `path` to the skill file directly.
- **patch 工具的 escape-drift 警告**：當 `old_string`/`new_string` 包含 `\\` 或 `"` 時，patch 工具可能報 `Escape-drift detected`。此時改用 `terminal` + `python3 << PYEOF` script 直接讀寫文件更可靠。

## Verification
- `cd /c/Project/aistation && python -m pytest tests/test_chapter10.py -q` → 21 passed.
- `python -m pytest -q` 全專案 → 68 passed, 2 skipped (ffmpeg-dependent).
- 主典 / 備份 / 技能三處落點皆存在且 §章編號連續。

## 診斷框架（缺口清單）
用新章框架審視現有專案時，誠實分三類，逐項標列不偽造：
- ✅ **已具備**（實體代碼路徑）
- ⚠️ **缺口**（明列，不合理化）
- 🔧 **改進清單**（P0→P2 優先序）

**§24 診斷結果實測 (2026-08-23)**：
- ✅ `src/gate5t.py` + `src/kpi.py` + `src/newsletter.py` — 21 test cases 全綠
- ✅ `scripts/weekly_report.py` — cron-drivable KPI→5T gate→Newsletter 管線
- ✅ `src/entropy.py` — 實時熵值計算（job_failure_rate + lifecycle_incompleteness + 5t_audit_failure），測試 11 pass
- ✅ Hermes cron job `entropy-5t-audit-daily` (0 9 * * *) — 每日自動驗證
- 🔧 esggo TS `t5.ts` 與 aistation `gate5t.py` 5T 定義未統一（兩套閘門邏輯）
- 🔧 跨組配對率無自動埋點 (P1)
