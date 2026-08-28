---
name: spec-reassembly-artifact
description: Reassemble spec fragments into a verified working artifact.
category: software-development
---

# Spec Reassembly → Verified Artifact

## Trigger
- User pastes several numbered fragments ("Pasted text #1 .. #N") forming a spec or code.
- User asks to turn a concept / soul.md / blueprint into a real runnable program.
- Spec mentions UI/UX → default to **RWD responsive design** (mobile-first Bento Box).

## Workflow
1. **Read ALL fragments.** Some pastes get mis-flagged `"Binary file"` by `read_file` (CRLF/UTF-16). Read those via terminal: `sed 's/\r$//' file`. See `references/tool-quirks.md`.
2. **Reconstruct a COMPLETE file**, not stubs. Honor every spec clause (5T, `IComponentCore`, single-table, state machine). Keep original field names.
3. **If UI involved, build RWD by default**: mobile-first single column → Bento Box grid at ≥768 / ≥1024; `viewport-fit=cover`; `clamp()` fluid type; sticky table header + scroll-wrap for wide tables.
4. **Write to agreed drop location** (e.g. `C:\Project\esggo-learning-center\<module>\`). Test writability with `touch` first.
5. **VERIFY with real execution**: TS engine `node file.ts` (Node 24 native); browser JS `node --check`; UI `python3 -m http.server` + `curl`.

## Pitfalls
- `read_file` "Binary file" on CRLF pastes → use terminal `cat`/`sed`, NOT `read_file`.
- Hermes "Model not found" 404 → wrong provider prefix (`opencode/ling-3.0-flash-free` should be `inclusionai/ling-3.0-flash:free` under `nous`). Check `context_length_cache.yaml`; fix via `hermes config set model.default <correct>`.
- Don't run browser-only JS through `node` for type/lint (`window` undefined) — use `node --check`.

## Verification checklist
- [ ] All N fragments consumed (no gap)
- [ ] Engine runs end-to-end (`node file.ts` → exit 0 + expected stdout markers)
- [ ] Every browser `.js` passes `node --check`
- [ ] HTTP serve returns 200 for every asset + key spec markers in served HTML
- [ ] RWD present: `viewport` meta + `@media` breakpoints; wide tables scroll-wrap
- [ ] Server killed after verification

## References
- `references/tool-quirks.md` — read_file binary workaround, Hermes model-404 diagnosis, Node24 native TS, verification recipes.
- `templates/rwd-bento-skeleton.html` — RWD Bento Box dashboard starter (mobile-first, 4 breakpoints).

## Example (this session)
Reassembled 17 pasted fragments into `OmniBlueprintHub.ts` (5T + IComponentCore + single-table engine, exit 0) plus RWD frontend (`index.html` hub + `live-sync.html` share page, `styles.css` Bento Box, `data.js`/`app.js`/`sync.js`). Verified via `node OmniBlueprintHub.ts` (exit 0), `node --check` ×3, and `python3 -m http.server` + `curl` (all 6 assets 200 + key markers).
