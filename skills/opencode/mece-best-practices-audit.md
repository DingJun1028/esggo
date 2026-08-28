---
name: mece-best-practices-audit
description: Run a MECE best-practices / gap audit on a codebase and emit a grounded TODO artifact. Use when the user says '最佳實踐', '全域最佳實踐TODO', 'BP audit', 'review the codebase for gaps', or asks for a prioritized best-practices TODO list. Pairs with the programmatic Excalidraw generator (diagrams/workflow.excalidraw) for visual deliverables.
---

# MECE Best-Practices Audit

## When to use

- User asks for "最佳實踐" / "全域最佳實踐TODO項目" / best-practices review / gap audit.
- You've finished a build and want to surface outstanding gaps before declaring done.
- You need a prioritized, file-grounded TODO rather than generic advice.

## Core principle: MECE + grounded

- **MECE**: pick 7 mutually-exclusive pillars, then exhaust lifecycle gaps under each.
  Canonical pillars: Correctness · Security · Maintainability · Performance ·
  Extensibility · Observability · Testing.
- **Grounded, not generic**: read the actual source (`read_file` / `search_files`)
  BEFORE writing any TODO item. Every entry cites a file/function. "Add tests" or
  "improve security" with no citation is an unverified claim — forbidden.
- **Lifecycle-exhaustive**: for each pillar, ask: does the code cover init → run →
  error → cleanup → observe? List what's missing.

## Workflow

1. **Inventory** the repo: `search_files(target='files', pattern='*.py')` + read the
   key modules (config, pipeline, api, db, renderer, etc.).
2. **Per pillar**, enumerate gaps with concrete evidence (file:line or function name).
3. **Classify each gap**:
   - `✅ 已修` — fixed this session (note the file + commit hash).
   - `🔲 待辦` — identified, not done (note the fix).
   - `🔒 外部阻礙` — blocked on a cloud key / user decision. **Do NOT solicit
     secrets in chat** (standing rule). Surface a 2-option choice instead.
4. **Emit a TODO artifact**: write `TODO.md` at repo root with the 7 pillars as
   `##` sections, each item on its own line with status prefix. Commit it.
5. **Fix the clearly-correct, safe items now** (defensive fallbacks, missing
   columns, font fallbacks, healthchecks) and mark them `✅` with the hash.
6. **Optional visual**: if the user wants the flow, generate a diagram with the
   programmatic Excalidraw generator — see `references/excalidraw-programmatic.md`.

## The "繼續 / closure" protocol (autonomous continuation)

When the user issues a terse "繼續" / "下一步" on a project that already has a
MECE TODO.md, resume autonomously — do NOT ask per-step. The loop:

1. **Reconstitute state**: `git status` + `git diff --stat` + read TODO.md.
   Note uncommitted changes and every `🔲` / `🔒` item.
2. **Verify in-flight changes first**: install deps if needed, run the project's
   test suite. Never pile new work on red tests.
3. **Pick the next `🔲` (or resolvable `🔒`) item**. Implement the fix in code.
4. **Add a regression test** — see `references/isolated_state_fixture.md` for the
   pollution-safe pattern that redirects DB + storage to `tmp_path`.
5. **Re-run the full suite** — must be green; report the pass count + exit code.
6. **Update TODO.md**: flip `🔲`→`✅` with a one-line note of the change; fix any
   contradictory markup (an item marked `🔲` whose body already says "已 gitignore ✅").
7. **Report**: numbered summary of changes + what was verified. Surface
   external-block decisions (commit? push? needs secret?) as a 2-option choice,
   never as a silent blocker.

## Pitfalls (hard-won)

- **Vague TODO = unverified claim.** No entry without a file/function citation.
- **Silent external blocker.** Key-gated fixes → `🔒` + choice, never faked.
- **Fix-not-recorded.** When you fix during audit, commit + mark `✅ <hash>` so the
  artifact and repo stay in sync.
- **No overlap padding.** If a pillar yields nothing, write "N/A (checked, nothing
  found)", don't invent a gap.
- **Honest reporting** (see `reporting-hygiene`): the audit is a numbered pipeline;
  every pillar is accounted for, even if empty.
- **Tests must match the ACTUAL source API, not assumed signatures.** When you
  write/extend pytest to lock in an audit fix, read the real function signatures
  first (`read_file` the module). Inventing functions or wrong return shapes
  (e.g. assuming `src/config.DB_PATH` exists when it lives in `src/db.py`, or a
  `feature_summary()` returning "1".."7" keys) burns patch cycles and produces
  false failures. If a test needs a helper that doesn't exist AND is genuinely
  useful (e.g. `tts.build_srt`), ADD it to the source as part of the fix, then
  test it — don't stub it in the test.
- **Tie fixes to verification.** Every item you fix this session should be
  covered by a test before you mark it `✅`. If adding a test isn't feasible
  (e.g. ffmpeg e2e needs the Docker image), run the full suite locally AND note
  CI as the verification path in the `✅` line.
- **Webhook None-handling**: returning `video_url=None` forces the caller to
  guess. Prefer an explicit `ok` boolean (`status==done and bool(video_url)`)
  so clients branch on `if (body.ok)`.
- **Concat ordering**: don't concat media by loop position; order by an explicit
  `index` field so a non-monotonic parser can't scramble playback. Pass the
  post-ordering dicts into the renderer as a length guard.
- **Timing side-channel on secrets**: compare webhook secrets with
  `hmac.compare_digest`, never `!=`.
- **Background job silence**: a threaded job runner must wrap the worker in
  try/except and write `failed` to the store, or jobs hang forever in
  `queued`/`rendering`.
- **`atexit` must not cancel in-flight renders.** `pool.shutdown(wait=False,
  cancel_futures=True)` at interpreter exit can kill a background job that is
  still rendering, orphaning it in `rendering`. Use `cancel_futures=False` so an
  in-flight render finishes. (A job that's still `queued` at exit is acceptable to
  drop, but a `rendering` one should complete.)
- **Don't `mkdir` at import time** (repo pollution → flaky tests). A module that
  does `STORAGE_DIR.mkdir(parents=True, exist_ok=True)` at import creates the dir
  in the repo root on every `import`, even under an `isolated_state` fixture that
  redirects `STORAGE_DIR` *after* import — leaving a real `storage/` + `jobs.db`
  behind that pollutes sibling tests. Create dirs lazily (in `init_db()` /
  before writing), not at module top level.
- **Process-global state poisons shared test buckets.** A module-level rate
  limiter / cache keyed by `request.client.host` is shared across ALL tests; under
  `TestClient` every request reports `client.host == "testclient"`, so all tests
  accumulate into ONE bucket and eventually trip a 429. Fix: an autouse conftest
  fixture that neutralizes the limiter for ordinary tests (high limit + clear
  buckets), and have the dedicated limiter test save/restore the limit + clear
  buckets in `finally` (never `reload()` the module — that permanently lowers the
  global and breaks later tests).
- **Poll budgets for real-render tests.** Tests that render via a background pool
  and poll for `done` must budget generously (e.g. 120 × 0.5s). A cold/slow ffmpeg
  startup on a loaded box exceeds a 30s budget and flakes. Keep such tests behind
  the `isolated_state` fixture and skip gracefully if ffmpeg is absent.
- **TODO markup contradictions**: an item can drift (body says done, marker says
  `🔲`). Reconcile the marker to the body when closing.

## Example TODO shape

```
## 1. 正確性 / Correctness
- ✅ Docker 映像中文消失：visuals._font + renderer._CAP_FONT 偏好 Noto CJK；Dockerfile 裝 fonts-noto-cjk (f30314a)
- 🔲 編號/序列：run_final 目前線性 concat，未來按 shot.index 排序
## 2. 安全 / Security
- 🔲 n8n Webhook 無認證：加 X-AI-Station-Key 校驗
## 5. 可擴充性 / Extensibility
- 🔒 Docker Hub 自動推映像：CI 已接好，待貼 DOCKERHUB_USERNAME + TOKEN
```

See `references/mece-audit-template.md` for the full 7-pillar scaffold to copy.
See `references/excalidraw-programmatic.md` for the diagram-generation companion.
See `references/isolated_state_fixture.md` for the pollution-safe pytest fixture.

## Support files (this skill owns)
- `references/isolated_state_fixture.md` — pytest `isolated_state` fixture that redirects DB + storage to `tmp_path` so render/integration tests never touch real repo state.
- `references/dockerhub-publish-via-secrets.md` — push to Docker Hub via `gh secret set` + CI `docker/build-push-action` when the LOCAL daemon is down (never echo the PAT; verify via read-only registry API).
- `references/mece-audit-template.md` — copy-ready 7-pillar `TODO.md` scaffold + per-pillar lifecycle checklist.
- `references/excalidraw-programmatic.md` — programmatic Excalidraw generator (sequence/flow) + orphan-binding validator + upload note. (The `excalidraw` skill is bundled/off-limits; this is the companion that captures the generator technique.)
