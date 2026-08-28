---
name: oa-soul-delivery
category: autonomous-ai-agents
description: OA-Team soul delivery and 5T cross-language unification.
---

# OA-Team Soul 聖典交付 + 5T 跨語統一

## When to use
- User asks to "解說 / 落地 / 3 層交付 / 診斷" a soul.md chapter (e.g. 第十章 最佳實踐, §23, §24).
- Extending esggo `esggo-omni-center/soul-full.md` with a new §N chapter (user委製附錄接於 §22 之後, 終章封印仍最高律法).
- Making aistation (Python) or any sub-service honor the SAME 5T gate as esggo (no duplicated 5T logic).
- Pushing new files into `esggo` / `esggo-learning-center` / `aistation` when those repos have uncommitted WIP from other sessions.

## 1. 3 層交付 (mandatory for soul chapters)
User's standing preference: every new chapter ships to THREE places:
1. **主典**: `C:/Project/esggo/esggo-omni-center/soul-full.md` — append ` # 第二X章 · … ` after the last §N (currently §24 follows §23). Insert a compact summary (sub-sections 1–7 + 5T 驗證 + 刻印狀態/歸位/啟動令補).
2. **落檔備份**: `C:/Project/esggo-learning-center/soul-chapter-XX-<slug>.md` — the detailed version.
3. **喚醒技能**: patch `oa-dual-agent-obsidian` SKILL.md (or the relevant soul skill) with a `## §X …（喚醒指引）` block pointing at both files + the landing code.

> oa-dual-agent-obsidian is USER-OWNED — patch it via the `patch` tool (worked this session) but recommend `hermes curator adopt oa-dual-agent-obsidian` so future skill_manage writes are allowed. Do NOT claim it as yours.

## 2. 5T 單一真相源統一 (cross TS ↔ Python)
esggo is the 5T authority. Never re-implement 5T scoring in Python.

**esggo side** — add `app/api/verify-5t/route.ts` (Next.js route) reusing `src/lib/five-t-protocol.ts`:
- `calculateFiveTScore({sources, algorithmVerified, metricsProgress, hashLocked, eventsCount})` → `FiveTScore`
- `FiveTGatekeeper.evaluate(score)` → `FiveTStatus`; `FiveTGatekeeper.allPass(status)` → bool
- `FiveTHashLock.generate('verify-5t', JSON.stringify(body))` → sha256
- POST contract: body = `{source_origin, lifecycle_hooks, ui_feedback, transparent_audit, frozen}`; returns `{pass, status, score, hashLock}`.
- Import via `@/lib/five-t-protocol` (same alias hashlock route uses). `tsc --noEmit` must exit 0.

**aistation (Python) side** — `src/gate5t.py` keeps a LOCAL field-level `verify_5t()` (free-path fast gate) AND a `verify_via_esggo(locked)` that POSTs the artifact's 5T checks to `ESGO_HASHLOCK_URL + "/api/verify-5t"`, mapping:
```
source_origin ← uuid if checks["Traceable"] else ""
lifecycle_hooks ← ["locked"] if checks["Trackable"] else []
ui_feedback ← checks["Tangible"]; transparent_audit ← checks["Transparent"]; frozen ← checks["Trustworthy"]
```
Best-effort: if `ESGO_HASHLOCK_URL` unset or network fails → fall back to local `verify_locked()` hash check. Never block the pipeline.

**Threshold insight (verified)**: esggo `calculateFiveTScore` gives `traceable = min(1, sources.length*0.25)`. A single `source_origin` → 0.25 < DEFAULT_THRESHOLD 0.7 → esggo verdict `pass=false` even when aistation local gate passed. This is CORRECT (esggo is stricter); it signals the artifact needs multiple provenance sources. Document this so callers don't think the endpoint is broken.

## 3. Git safe pattern for concurrent-WIP repos
Symptom: `git push` rejected "remote contains work you do not have locally" while the repo also has 11+ uncommitted tracked-M files + possibly `UU`/`UD` unmerged markers from a prior failed pull.

DO:
- `git add <only the new files you created>` (e.g. `soul-full.md`, `app/api/verify-5t/route.ts`, `src/gate5t.py`). Do NOT `git add -A`.
- Commit just those. Then `git fetch origin main`.
- If `git pull --rebase` refuses ("unstaged changes"), the unstaged files are OTHER sessions' WIP — do NOT stash -u (it pulls in `node_modules` and hangs ~180s). Instead:
  - Clear unmerged index entries without touching disk: `git rm --cached -q <UD-files>` (keeps the on-disk file as untracked).
  - Resolve `UU` via `git checkout --ours <file> && git add <file>`.
  - Now `git pull --rebase origin main` can proceed; then `git push origin main`.

DON'T:
- Never `git stash -u` on a repo with `node_modules` in working tree (timeout).
- Never `git reset --hard` (would drop the 11 tracked-M WIP).
- If the conflict is messy and you're unsure, STOP and ask the user to authorize WIP handling — do not force-push.

## 4. Windows / MSYS tool gotchas (verified this session)
- `search_files` and `read_file` FAIL on backslash `C:\Project\...` with "系統找不到指定的路徑". ALWAYS use MSYS forward-slash: `/c/Project/...`.
- `git -C C:\Project\...` rewrites to native paths and can mismatch; use `cd /c/Project/...` then relative git.
- `read_file` mis-detects UTF-8 Chinese `.ts` files as "binary" — use `terminal` + `cat`/`sed -n` to read them.
- `python` = 3.11.15 (use for aistation pytest); `python3`/`py` = 3.14. `pytest` 9.1.1 available.

## 5. Verification (evidence before claiming done)
- aistation: `cd /c/Project/aistation && python -m pytest tests/test_chapter10.py -q` → expect 14 passed (gate5t+kpi+newsletter+alignment). Full suite: 40 passed / 2 skipped (skips = ffmpeg/network integration, expected).
- esggo TS: `cd /c/Project/esggo && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -iE "verify-5t|five-t-protocol|error TS"` → expect empty + exit 0.
- 5T endpoint logic: `node --input-type=module -e "import {...} from './src/lib/five-t-protocol.ts'; ..."` to confirm score/status/pass/hashLock shape before wiring the Python client.
- After any edit, re-run the relevant check and paste the fresh output (don't rely on stale "passed" from earlier in the turn).

## 6. Pitfalls
- Don't insert a chapter numbered "第十章" into v0.6 canon — it already has §10 萬能自動治理. Use §23/§24 (next free user委製 numbers after §22).
- `FiveTGatekeeper.evaluate` takes a `FiveTScore` (numbers), NOT a string. `calculateFiveTScore` converts structured input → score. Don't call evaluate(string).
- `FiveTHashLock.generate(source, content, timestamp?)` needs 2+ args; single-arg call breaks.
- aistation `gate5t.py` `to_component_core()` may end up unused after `verify_via_esggo` switches to the endpoint — keep it (test `test_to_component_core_shape` uses it) but don't depend on it for the verdict.
