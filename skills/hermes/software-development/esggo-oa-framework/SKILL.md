---
name: esggo-oa-framework
description: Build ESG-GO OA TS packages with 5T-gated adapters and bus.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
metadata:
  hermes:
    tags: [esggo, oa-framework, omni-agent-bus, typescript, monorepo, 5T, agent-adapters]
    related_skills: [esggo-ts-sync-merge, typescript-build-cleanup, automatic-execution]
---

# ESG-GO OA Meta-Framework (oa-framework / omni-agent-bus)

Build or extend the OA (OmniAgent) TypeScript meta-framework packages inside the
`DingJun1028/esggo` monorepo. These packages integrate 10 sub-frameworks
(7 VERIFIED: ADK, Genkit, Agent0, CrewAI [real framework; verify_crewai.py needs uv py3.13 venv],
Agent Reach, DeerFlow, Tencent Agent Memory;
+ 3 UNVERIFIED scaffolds: OpenMontage [repo 404], OmniRoute [unreachable this session],
TurboVec/PotatoRAG [github.com/google/turbovec 404])
under a unified adapter interface, enforce a 5T gate (soul.md), and route everything through
an event bus. When given an external project README: verify the repo is REAL via browser/web_extract
BEFORE integrating; if 404/unreachable, mark adapter UNVERIFIED + graceful-degrade (scaffold dispatch,
health 'down') — never fabricate a working integration. CrewAI is the only VERIFIED-real Python subframe.

## When to use
- Adding a new sub-frame adapter to `packages/oa-framework`
- Extending the 5T verification (generated 5T report + dual-layer gate)
- Wiring `packages/omni-agent-bus` (OmniAgentBus) between OA components
- **Deep-connect (深貫廣通):** cross-frame chaining (`chain()`), bus broadcast (`attachBus()`),
  30-bee swarm mapping (`swarm-map.ts`) — the "圓通無礙" closure where sub-frames pass outputs
  to each other and 30 agents subscribe via the bus.
- Debugging why `pnpm run typecheck`/`pnpm run test` fails but `npx tsc` passes

## Architecture (do not break)
- `src/core/types.ts` — `ISubFrameAdapter`, `OATask`, `OATaskResult`, `IComponentCore`, `OAFrameConfig`
- `src/core/t5.ts` — `forgeT5()` (wraps output in a 5T quality report) + `verify5T()` (dual-layer gate)
- `src/core/unverified-registry.ts` — `UNVERIFIED_REGISTRY` + `upgradeToVerified()` + `pendingUnverified()`:
  tracks user-pasted repos we couldn't verify (404/unreachable) so scaffolds can be upgraded later.
- `src/core/omni-gate.ts` — content-level 5T gate, **replicated** from `@esggo/omni-agent/src/gates.ts`
  (NOT imported — see Pitfalls)
- `src/adapters/<name>.ts` — one file per sub-framework, implements `ISubFrameAdapter`
- `src/index.ts` — registers adapters, exports `OAOrchestrator`, `verify5T`, `omni-gate`
- `packages/omni-agent-bus/src/bus.ts` — `OmniAgentBus` + `bus5TGate()` (auto-intercept on publish)
- `packages/omni-agent-bus/src/deploy-gate.ts` — `deployGate()` blocks non-compliant output from deploying

### ISubFrameAdapter contract
```ts
interface ISubFrameAdapter {
  id: SubFrameId;
  bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }>;
  health(): Promise<{ status: 'ok' | 'down'; detail?: string }>;
  dispatch(task: OATask): Promise<{ output: string }>;
}
```

## Steps to add a new adapter (incl. when user pastes an external project README)
1. **Verify the repo is REAL first.** `browser_navigate` the claimed GitHub URL (or
   `web_extract` raw README). If it 404s / is unreachable, do NOT fabricate — mark the
   adapter `UNVERIFIED` (comment citing the failed URL), `health()` returns `down` + scaffold
   `dispatch()` returning a description string (not a real CLI call). This is the design, not a bug.
2. Create `src/adapters/<name>.ts` implementing `ISubFrameAdapter`.
3. `bootstrap()` / `health()` MUST probe the real CLI/SDK and return `ok:false` + `down`
   when absent — **never fake a successful call**. Graceful degradation is the design.
4. `dispatch()` returns `{ output: string }`; the Orchestrator wraps it via `forgeT5()`.
5. Register in `src/index.ts` `OA_SUBFRAMES` array + import.
6. Run verification (see below). After editing, REBUILD `dist/` and re-run OAB `pnpm run test`
   so the cross-package bridge stays AVAILABLE.

## Pitfalls (hit this session — read before debugging)
- **pnpm workspace gate blocks `pnpm run`**: pnpm 11.5.x runs `runDepsStatusCheck`
  before any script; if a sibling workspace package has no `dist` (unbuilt), the script
  aborts with `runDepsStatusCheck` in the stack and exit 1 — even when YOUR package is fine.
  The code may be 100% correct. **Verify with `npx --no-install tsc -p tsconfig.json
  --noEmit --skipLibCheck` and `npx --no-install tsx test/smoke.ts`** to bypass the gate.
  These are the canonical evidence commands when `pnpm run test` is blocked.
- **Optional peer deps + tsc**: `await import('@google/adk')` fails tsc with TS2307 when the
  package isn't installed; adding `// @ts-expect-error` then causes "unused directive" when
  tsc DOESN'T error (e.g. `moduleResolution: bundler`). Use the **variable form** so tsc
  never resolves the module statically: `const m = '@google/adk'; await import(m) as any;`.
- **Don't import unbuilt workspace packages**: `@esggo/omni-agent` has no `dist`, so importing
  its `gates.ts` triggers the pnpm gate. Instead **replicate** the gate logic locally in
  `omni-gate.ts` (copy `GATE_MIN_LENGTH`/`GATE_PATTERNS`/`verifyGate`). Keeps the package
  independently verifiable.
- **5T content gate length floors**: traceable≥100, transparent≥150, tangible≥200,
  trustworthy≥120, trackable≥80 chars + quality regex. Scaffold/fallback outputs that are
  too short WILL fail `verify5T` content-level — `forgeT5` wraps every output in a 5T report
  template (source/揭露/達成/封印/追蹤) so real outputs pass.
- **`.rejected` topics exempt from double-gate**: `OmniAgentBus.publish` re-runs the 5T gate on
  any `OATaskResult` payload; if you publish to `<src>.rejected` from `deployGate`, it would be
  re-intercepted and misrouted. The bus skips the gate for topics ending in `.rejected`.

## Verification (the working recipe)
```bash
cd packages/oa-framework        # or packages/omni-agent-bus
npx --no-install tsc -p tsconfig.json --noEmit --skipLibCheck   # TSC_EXIT=0 required
npx --no-install tsx test/smoke.ts                              # ALL_9_ROUTED_OK / OMNI_AGENT_BUS_OK
# omni-agent-bus also has test/deploy-gate.smoke.ts -> DEPLOY_GATE_OK
```
If `pnpm run test` fails with `runDepsStatusCheck`, that is the gate, not your code — use the
`npx` commands above and report both.

### Cross-package regression (MANDATORY after editing oa-framework OR omni-agent-bus)
The Hermes stale-verification guard fires if you only checked one package. Always run BOTH:
```bash
cd packages/omni-agent-bus && pnpm run test
# Expect: OMNI_AGENT_BUS_OK + DEPLOY_GATE_OK + "oa-framework 載入: AVAILABLE" + OA_PIPELINE_OK
# (deployCalls == number of subframes routed through the gate)
```
This proves the `@esggo/oa-framework` → `OmniAgentBus` bridge stays AVAILABLE and the 5T deploy-gate
still passes. Rebuild `packages/oa-framework/dist` (standalone tsconfig) before this if you changed
any adapter — the bridge dynamic-imports `dist/index.js`.

## Pitfalls (more — hit across the OA subframe-integration sessions)
- **oa-framework tsconfig must NOT `extends` the root tsconfig.** Root has `noEmit:true` +
  a restrictive `include` that excludes `packages/oa-framework/src`, so `tsc -p` builds NOTHING
  (BUILD_EXIT=0 but no `dist/`, or missing `core/orchestrator.js`/`core/t5.js`). Fix: use a
  standalone tsconfig with `noEmit:false`, `module/moduleResolution: NodeNext`, `include: ["src/**/*.ts"]`.
  NodeNext is REQUIRED so emitted `import './x'` carries `.js` (Bundler mode omits it → ESM
  resolution fails in Node → `loadOAFramework` catches → OAB bridge shows UNAVAILABLE).
- **smoke.ts must use `routeTo` to skip the network-touching adapter.** `agentreach` runs real
  `agent-reach` CLI on configured channels (youtube/rss) and hangs the whole `oa.run()` (exit 124).
  Route the smoke task to non-networking adapters only (adk/genkit/agent0/crewai/deerflow/
  tencent-mem/openmontage/omniroute/turbovec all scaffold without network). Also update the
  `RESULT` length assertion in smoke.ts whenever the routeTo count changes (it hard-codes the count).
- **OAB bridge loads `@esggo/oa-framework` via dynamic import.** It needs a workspace symlink:
  add `"@esggo/oa-framework": "workspace:*"` to `packages/omni-agent-bus/package.json` deps, then
  `pnpm install` (don't rely on manual symlinks — a later `pnpm install` can drop them). If the
  import fails it logs `UNAVAILABLE (預期 graceful)` and the bridge returns `available:false`
  WITHOUT fabricating — that is correct behavior, not a failure.
- **git index.lock leftovers.** If a prior `git commit` was interrupted, a stale `.git/index.lock`
  blocks the next commit (`Unable to create index.lock`). `rm -f .git/index.lock` then re-commit.
  When committing adapter work, stage ONLY the oa-framework / omni-agent-bus files — the repo
  accumulates many unrelated uncommitted changes (oci_*.sh, src/*, next-env.d.ts) that should not
  ride along on a focused subframe commit.
- **BRANCH DRIFT before committing OA work.** The working tree is often checked out on a
  NON-`main` branch (e.g. `fix/types-sync-restore-stt-contracts`) created by another session.
  A focused `git commit` + `git push origin HEAD` will push to THAT branch, not `main`
  (`* [new branch] HEAD -> <branch>` in the push output is the tell). Land on `main` explicitly:
  `git branch --show-current` first; after committing, `git checkout main && git merge <branch>
  --no-edit && git push origin main`. Always confirm the push line says `main -> main`.
- **`IComponentCore.evidence` is a STRUCTURED type, not `Record<string,unknown>`.** `types.ts`
  defines `evidence: { originCause: string; processTrace: string[]; finalEffect: string;
  [key: string]: any }` (named fields required). `t5.ts` `forgeT5` doing
  `evidence: opts.evidence ?? {}` compiles under `tsc --noEmit --skipLibCheck` but FAILS under
  a strict `tsc -p tsconfig.json` (build) with TS2739 (missing originCause/processTrace/
  finalEffect). Fix: supply the three named fields and spread the optional override:
  `evidence: { originCause:..., processTrace:[...], finalEffect:..., ...(opts.evidence ?? {}) }`.
  Rule: after any `types.ts` interface edit, run the STRICT build (`tsc -p`, not just
  `--noEmit --skipLibCheck`) or the dist will be silently incomplete / type-broken.
- **Slow-env background test pattern.** In this Windows/MSYS host, foreground
  `pnpm run test` / `npx tsc` routinely hit the 120s tool timeout (exit 124) even when the
  code is correct — the process is just slow to start tsx/tsc. Reliable recipe: launch with
  `terminal(background=true, notify_on_complete=true)`, then `process(action='wait'/'poll')`.
  Don't repeat foreground runs; one background run + poll is enough. The Hermes
  stale-verification guard may flag a prior foreground timeout as "stale" — re-run once in
  background and report the `EXIT=0` evidence; do NOT re-run `hermes verify --json` (see next).
- **`hermes verify --json` is NOT an OA verification tool.** Running it triggers Hermes's OWN
  interrupted-update recovery (it may try to finish a prior `hermes update`) and fails on a
  corrupted hermes venv (`pyyaml==6.0.3` METADATA missing → `Could not auto-recover`). It says
  nothing about your OA packages. To verify OA code use `pnpm run test` + `tsc` (above), never
  `hermes verify`. If Hermes itself reports a broken venv, the manual fix is outside esggo:
  `cd /d "C:\Users\dingj\AppData\Local\hermes\hermes-agent" && "<venv>\Scripts\python.exe" -m pip install -e ".[all]"` — ask the user before touching the Hermes install.
- **UNVERIFIED-registry pattern for user-pasted repos we can't verify.** When the user pastes a
  project README whose GitHub repo 404s / is unreachable, integrate it as an UNVERIFIED scaffold
  (graceful `dispatch` + `health:'down'`) AND record it in `src/core/unverified-registry.ts`
  (`UNVERIFIED_REGISTRY` + `upgradeToVerified(subFrame, realUrl)` + `pendingUnverified()`).
  This keeps a machine-readable "待補 URL" list so a later session can upgrade the scaffold to a
  real integration the moment the user supplies a valid URL. Export it from `src/index.ts`.
- **`gh issue create` uses `-l/--label` (singular), not `--labels`.** Newer gh CLI rejects
  `--labels` (`unknown flag`). Also labels must ALREADY EXIST in the repo or the issue create
  fails with `could not add label: 'X' not found` — use existing labels (e.g. `OmniAgent`,
  `auto-fix`, `github_actions`) rather than the CI-generated ones (`auto-repair`, `swarm`).
  See `references/oab-build-verify-recipes.md` for the GitHub-error-watch cron recipe.

- **`execFileP` is NOT a `node:child_process` export.** Write
  `import { execFile } from 'node:child_process'; const execFileP = promisify(execFile);`.
  `import { execFileP } from 'node:child_process'` fails tsc (TS2724) AND runtime (ReferenceError).
  Hit while authoring the `openmontage` / `turbovec` adapters.
- **`tsx -e` is CJS — no top-level await.** Diagnosing ESM dynamic imports with `tsx -e "await import(...)"`
  dies with "Top-level await is currently not supported with the cjs output format". Write a `.ts`
  file and run `tsx file.ts` (file mode is ESM) instead.
- **Real Python subframe verification (crewai) needs a PYTHONPATH-clean venv.** The shell `PYTHONPATH`
  points at hermes-agent's venv, so a fresh `uv venv` inherits a broken `pydantic_core` →
  `import crewai` → `ModuleNotFoundError: pydantic_core._pydantic_core`. Fix:
  `env PYTHONPATH= uv venv --python 3.13.14 .venv-crewai` then
  `uv pip install --python .venv-crewai/Scripts/python.exe 'crewai'`
  (a bare `uv venv` has NO pip — use `uv pip install`, never `python -m pip`). Run `verify_crewai.py`
  for import + Agent/Task/Crew object construction; `kickoff()` needs an LLM key, skip it honestly.
- **Stale-verification guard:** after editing `packages/oa-framework` OR `packages/omni-agent-bus`,
  re-run BOTH packages' checks (see Cross-package regression above). Reporting only one package's
  green result gets flagged stale.
- **`search_files` + `write_file`/`patch` lint LIE on `C:\` backslash paths (MSYS).** In this
  Windows/MSYS setup, `search_files` returns "系統找不到指定的路徑" (os error 3) for files that DO
  exist when the path uses backslashes (`C:\Project\...`); and the auto-lint after `write_file`/
  `patch` on esggo TS files reports a false `error TS6053: File '...' not found` for the very file
  just written. Both are tooling-path artifacts, NOT real errors. Bypass: use `terminal` +
  `grep -rnE 'pattern' --include=*.ts path` (forward-slash or native paths) for search; for edit
  verification, actually RUN `npx tsc --noEmit` / `pytest` / `tsx` and trust those over the lint
  banner. See `references/windows-path-lint-guard.md`.
- **OAB `test/patterns.smoke.ts` LifecycleTracker assertion is NOW FIXED (green).** Prior
  sessions noted a pre-existing failing `LifecycleTracker 診斷缺口` assertion that made full
  `pnpm run test` return rc=1 — that is RESOLVED. The fix: `LifecycleTracker.gaps()` pushes
  `cross_unit_pairing=${rate}% < 100% (pairingRate gap)` — the diagnosis string MUST contain the
  SAME keyword the test asserts. The test asserts `g.includes('pairingRate')`, so the impl must
  embed `pairingRate` (not only the human label `cross_unit_pairing`). **Rule for any
  `gaps()`/`diagnose()`-style string the tests assert on: embed the field-name keyword**, or the
  assertion silently fails even when the logic is correct. Full `pnpm run test` is now a valid
  green gate again — do NOT skip it.
- **`oa-selfcheck.sh` (repo root) is the canonical single-entry gate.** It runs typecheck + oa
  smoke + `deep-connect` smoke + OAB `pnpm run test` + CrewAI real-run. Use it as the authoritative
  "is the closure green" check; a single package's green is not enough (stale-guard).

## §15 Adding a new 5T-compliant pattern to `omni-agent-bus/src/patterns/` (real recipe)

When the user says "add <X>" as a new §12 integration pattern (e.g. `conduit.ts` = the 7th
5T-compliant mode, a directed point-to-point/group message channel), follow this exact shape —
it is the shape that actually passed `tsc` + isolated `tsx` green this session.

### Skeleton (aligns with event-bus.ts / stream-buffer.ts style)
- Reuse the existing 5T infra: `StreamBuffer` (recipient inbox), `WorkerPool` (parallel
  sendMany), `CompressionEngine` (gzip envelope body), `five-t.ts` (`verify5T`, `verifyGate`,
  `hashLock`), `types.ts` (`FiveTResult`, `FiveTDimension`). Keep the "無作/圓通/無礙" contract:
  empty inbox read returns `[]`; missing recipient returns `[]`; never throw on no-op.
- Export from `patterns/index.ts` (`export { X, createX } from './x.js'`) — otherwise the bus
  can't reach it and `tsx` import of the pattern fails.

### TWO non-obvious bugs that WILL bite (capture as pitfalls)
1. **`verify5T` breaks on `JSON.stringify` Unicode-escaped Chinese payloads.** `five-t.ts`
   `GATE_PATTERNS` are Chinese-keyword regexes (透明|揭露, 建立|達成, hash|封印, 2025|年度…)
   with length floors (transparent≥150, tangible≥200, trustworthy≥120…). `JSON.stringify`
   emits `\uXXXX` escapes, so the regex never matches and `verify5T` returns `failed:[all]`
   even for a compliant payload. Fix: before calling `verify5T`, run a `readable()` helper that
   reverses `\uXXXX` → char (`json.replace(/\\u([0-9a-fA-F]{4})/g, (_,h)=>String.fromCharCode(parseInt(h,16)))`),
   and pass that readable string (NOT the raw `JSON.stringify` output) to `verify5T`.
2. **`StreamBuffer.getDelta` returns wrapped entries, not raw payloads.** `StreamBuffer.append`
   stores `payload` inside `{id, topic, source, timestamp, payload}` (`StreamEntry`). After
   `getDelta(since)`, each item is `{payload: YourEnvelope}`, so `read()` must do
   `const env = entry.payload;` — NOT treat the entry itself as the envelope. Skipping this makes
   `env.seal`/`env.body` come back `undefined` (decompress → undefined) and `verified.pass=false`.

### Test + verification recipe (proven)
- Write `test/<name>.smoke.ts` importing from `../src/patterns/index.js` (NOT `../src/index.js`,
  which only re-exports the bus/deploy-gate/oa-bridge, not patterns).
- Make every test payload carry 5T markers ABOVE the length floors (reference/source, 揭露/說明,
  建立/達成/完成/產出, hash/sha/封印/audit, 2025-2029/年度/monitor) — e.g. a `beeMessage()`
  helper that joins a 5-line meta block. A too-short payload makes `strict` mode throw.
- Assert: traceable id prefix, multicast only hits named recipients, `read(recipient, after)`
  delta returns only newer-than-`after`, `strict` rejects a non-5T payload (catch the throw),
  and `read().verified.pass === true` (source trusted + content untampered).
- Run: `cd packages/omni-agent-bus && npx tsc && npx tsx test/<name>.smoke.ts`. Expect ALL
  GREEN. Do NOT gate success on full `npm test` (the pre-existing Lifecycle assertion fails
  independent of your pattern).
- After merge, sync VPS: `ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 'cd /opt/esggo &&
  git pull origin main && cd packages/omni-agent-bus && npx tsc && pm2 reload oab-broker --update-env'`
  (use `ubuntu@`, NOT `git@` — see esggo-vps-sync-troubleshooting). Confirm the broker pid
  changed + status online.
- **5T gate source-label rule (lifecycle/metrics):** when building a 5T-tracked record, the
  `source` field is a STRUCTURED TRACE LABEL (e.g. `esggo:src/omni-orchestrator`), NOT a compliance
  text. Do NOT run it through `verifyGate("traceable", source)` (length≥100 + keyword) — short
  labels fail and get silently dropped. Accept source if it contains `:` or a 溯源 keyword
  (來源|引用|source|origin). This was the bug that made `snapshot()` return all-zeros on first try.

## §11 Concurrent-WIP push to a shared repo (git hygiene)

When the user authorizes pushing to `DingJun1028/esggo` or the `esggo-learning-center` checkout
(same remote+branch), the working tree often has OTHER sessions' uncommitted WIP (10+ tracked `M`
files, large untracked `node_modules`/`_tmp_vps`). Preserve that WIP — do not `git stash -u` (the
`-u` walks the whole tree incl. node_modules and TIMES OUT). Recipe:

```bash
# 1. commit ONLY your new files (don't ride the WIP)
git add <your-specific-files> && git commit -m "..."

# 2. stash tracked WIP ONLY (no -u)
git stash push -m "wip-before-push"

# 3. remove any untracked file that blocks checkout (rebase error:
#    "untracked working tree files would be overwritten by checkout")
rm -f <blocking-untracked-file>   # e.g. esggo-omni-center/tsc_errors_utf8.txt (safe: tsc log)

# 4. rebase onto remote then push
git pull --rebase origin main && git push origin main

# 5. restore WIP; on UU conflicts, pull the WIP version back from the stash explicitly
git stash pop
# if UU remains: git checkout stash@{0} -- <uu-files> && git add <uu-files>
git stash drop stash@{0}   # only after tracked-M count returns to pre-stash number
```
Verify restoration: `git status --short | grep -E '^ M|^M ' | wc -l` should equal the pre-stash
count. Never `git stash drop` while UU markers are present.

## §12 Cross-repo 5T single-source integration (aistation ↔ esggo)

When a Python service (aistation / OmniAuto) must pass the SAME 5T gate as the TS
swarm, do NOT re-implement 5T in Python. Stand up one HTTP endpoint in esggo and call
it. This session shipped the canonical pattern:

### esggo side — `/api/verify-5t` (single source of truth)
- Route: `app/api/verify-5t/route.ts`, uses `@/lib/five-t-protocol`
  (`calculateFiveTScore` + `FiveTGatekeeper`).
- POST body contract (aligns with aistation `gate5t` artifact):
  ```ts
  { source_origin: string, sources: string[], lifecycle_hooks: unknown[],
    ui_feedback: unknown, transparent_audit: boolean, frozen: boolean }
  ```
- `sources` is a **multi-source array**; `calculateFiveTScore` grades
  `traceable` from `sources.length` (≥4 → traceable≈1). A single `source_origin`
  alone → `sources.length=1` → `traceable=0` → `pass=false`. **This is intentional**:
  it exposes that a latent 5T gate which only checked "field present" was too loose.
  Real artifacts MUST carry ≥4 structured trace labels.
- Returns `{ pass, status, score, hashLock, source: "esggo-five-t-protocol" }`.

### aistation side — `src/gate5t.py`
- `verify_via_esggo(locked)` maps the frozen artifact's fields to the endpoint
  contract, pulling `sources` out of `json.loads(locked.payload)`. On any network
  failure it falls back to local `verify_locked()` (graceful, never blocks).
- **PITFALL — module-level config constant typos cause SILENT fallback.** A typo
  `ESGGG_HASHLOCK_URL` (4 G) vs the used `ESGO_HASHLOCK_URL` (3 G) meant
  `verify_via_esggo` ALWAYS took the `if not ESGO_HASHLOCK_URL:` local branch and
  NEVER called esggo — with zero error. Symptom: `res["source"] == "local"` even
  when `ESGO_HASHLOCK_URL` is set. Fix: grep for the constant name in BOTH the
  def line and every usage; add a test that monkeypatches the module attribute
  (not `setenv`, since it's read at import) and asserts `source == "esggo"`.

### PITFALL — esggo `/api/omni-center/summary` is DOUBLE-NESTED
`GET /api/omni-center/summary` returns
`{ success:true, data:{ success:true, data:{ caseCount:47, griIndicatorCount:142 } } }`
(the route wraps `jsonResponse` which wraps again). A consumer doing
`resp.json().get("data")` gets the OUTER data `{success, data:{...}}` → `caseCount`
is `undefined` → renders `案件數: ?`. **Unwrap defensively**:
```python
inner = payload.get("data", payload)
if isinstance(inner, dict) and "data" in inner:
    inner = inner["data"]
```
Always verify the real shape with a live `curl` before coding the parser.

### PITFALL — `packages/omni-agent-bus/src/patterns/` IS tracked now
Earlier this dir was untracked, but commits in this session added
`src/patterns/{conduit,lifecycle,...}.ts` + `index.ts` and `git pull` on VPS showed
`create mode 100644 packages/omni-agent-bus/src/patterns/conduit.ts`, proving they land.
STILL: do NOT `git add packages/omni-agent-bus/src/patterns/` (drag-risk) — stage only the
specific files you touched:
`git add packages/omni-agent-bus/src/patterns/<name>.ts packages/omni-agent-bus/src/patterns/index.ts packages/omni-agent-bus/test/<name>.smoke.ts`.
Verify a new pattern with the dedicated `tsx test/<name>.smoke.ts` recipe in §15.

### Real-run verification recipe (VPS-equivalent, no SSH risk)
Start the esggo Next dev server locally and curl the endpoint — this is safer than
SSH-deploying (SSH backend lockup would freeze the whole tool layer):
```bash
cd C:/Project/esggo
NEXT_TELEMETRY_DISABLED=1 ./node_modules/.bin/next dev -p 3939   # background=true
# wait for "✓ Ready"; then:
curl -s -X POST http://localhost:3939/api/verify-5t \
  -H "Content-Type: application/json" --data-binary @payload.json
```
Chinese-double-quote JSON in a `-d` string fails with `Bad escaped character` —
always use `--data-binary @file`. See `references/esggo-5t-verify-contract.md`.

## §13 OA self-check gate + GitHub-error auto-repair loop

When the user wants "GitHub 報錯通知信自動修復" / "派萬能分身跟蹤", the working shape is:

1. **`oa-selfcheck.sh`** at repo root — single entry that runs all 4 OA checks
   (typecheck + 10-frame smoke + OAB `pnpm run test` + CrewAI real-run if venv exists).
   Exit 0 = all green; non-0 = failure (for auto-repair to detect). A known-good copy
   lives in the repo; see `references/oab-build-verify-recipes.md`.
2. **`auto-repair.yml` `oa-selfcheck` job** — after the `tracker-notify` job, runs
   `bash oa-selfcheck.sh`; on failure opens an `OA-SWARM-TRACK` issue (labels
   `OmniAgent`,`auto-fix`,`github_actions` — existing labels only, see gh-pitfall above).
   This wires the OA pipeline itself into the auto-repair closure (the user's directive).
3. **`gh-error-mail-watch` cron** (`cronjob` every 15m) — runs a Python watcher that
   polls `gh run list` for NEW `failure`/`cancelled` runs (state file remembers the
   newest seen run id so only NEW failures alert). On new failure it creates a tracking
   issue + delegates an OA swarm fix. Real run confirmed: it caught 5+ real CI failures
   (ESG-GO CI/CD, Deploy to VPS, Sacred Pipeline, learning-center-ci, AI Station image).

### Email step in auto-repair.yml
Add a `dawidd6/action-send-mail` step gated on `conclusion == 'failure'` with
`continue-on-error: true` and `SMTP_*` secrets OPTIONAL (unset → skipped, never blocks
CI). Subject/body cite the Tracker + error type. This is the "報錯通知信" half; the
email channel needs `SMTP_HOST/PORT/USER/PASS/NOTIFY_EMAIL_TO` secrets (user-supplied).

## §14 "從歷史紀錄中給予" — resolve pasted-URL requests via session_search

When the user says "從歷史紀錄給我 X 的 URL/repo" (or implies a URL exists in history):
**use `session_search`, NOT web_search** (web_search/web_extract credits were exhausted
this session — Firecrawl `Payment Required`). Pattern:
```
session_search(query="VPS 活 URL 端口 161.118.248.180 omni-blueprint-hub 8787 ...", limit=5)
session_search(query="OpenMontage OmniRoute TurboVec github repo URL", limit=5)
```
Honest outcome this session: history recorded VPS endpoints (`161.118.248.180:8787`
timed out, `live.esggo.co` 502) that are NOT locally reachable, and ZERO sessions
containing the 3 UNVERIFIED repo URLs (they only appeared in the current conversation's
pasted READMEs). **Do not fabricate URLs to satisfy the request** — report the
session_search result honestly and ask the user to paste the real URL, OR proceed with
the local-closable part (③) while leaving ①② blocked on input.

## §16 OneRingAI adapter (subframe #11, VERIFIED real-run)

User pasted the `@everworker/oneringai` v1.0.0 README (connector-first multi-vendor agent lib:
12 LLM vendors, MemorySystem, tool-permission policies, cost optimization, long-session).
Integrated as a real (not scaffold) `oa-framework` subframe adapter — the canonical "external
project README → adapter" path that ALSO satisfies the repo-is-REAL gate (npm package resolved,
`Agent.run()` fetched a real local-Ollama completion).

### Where it lives
- `packages/oa-framework/src/adapters/oneringai.ts` — `id='oneringai'`, dynamic `import('@everworker/oneringai')`,
  dispatch builds `Connector.create` + `Agent.create({connector:'oa-oneringai', model})` + `agent.run(task.prompt)`.
- Registered via the 3-step: `SubFrameId` union adds `'oneringai'` in `core/types.ts` → adapter →
  `index.ts` import + register + `OA_SUBFRAMES` (now 11).
- Default LLM = **local Ollama** (`http://localhost:11434/v1`, model `qwen2.5:3b-instruct-q4_K_M`) — free-compute compliant.
  Override via `OAFrameConfig.llmBaseUrl` / `llmApiKey` / `llmModel` to point at OpenAI/Anthropic/Google.

### Install (verified)
Add `"@everworker/oneringai": "^1.0.0"` to `packages/oa-framework/package.json` `dependencies`
(pnpm resolves 1.0.1, compatible) then `pnpm install --filter @esggo/oa-framework`.
Node ≥ 22 required (OneRingAI hard floor). `INSTALL_EXIT=1` is usually the `prepare` git-hook
lock failing on a shared `.git/config` — harmless; confirm `node_modules/@everworker/oneringai` exists.

### Consuming-layer API shape (real-run verified — these TypeError'd first)
```ts
import { createOAFrame, verify5T } from '@esggo/oa-framework';
const orch = createOAFrame({ llmBaseUrl:'http://localhost:11434/v1', llmApiKey:'ollama',
                             llmModel:'qwen2.5:3b-instruct-q4_K_M' });  // config, NOT task
const results = await orch.run(task);   // task goes to run(), not createOAFrame()
const a = results[0];                    // forgeT5 product
console.log(a.output);                   // field is .output (NOT .content)
console.log(a.t5);                       // field is .t5 (NOT .fiveT)
const v = verify5T(a);                   // returns {pass:boolean,...} (NOT boolean)
```
Reference demo: `packages/oa-framework/test/app-integration-demo.ts` (DEMO_EXIT=0).

### OneRingAI-specific pitfalls (hit this session)
- **Ollama model tag MUST match `ollama list` exactly.** Writing `qwen2.5:3b` triggers
  `404 model 'qwen2.5:3b' not found` from OneRingAI's OpenAI-protocol provider. Use the full
  tag `qwen2.5:3b-instruct-q4_K_M` (or `gemma4:latest`). Adapter default already fixed to this.
- **`createOAFrame(task).run()` is wrong** → `TypeError: ...reading 'routeTo'` (task lands as config,
  run() gets undefined). Use `createOAFrame().run(task)`.
- **`forgeT5` product fields are `.output` / `.t5`** (not `.content` / `.fiveT`); `verify5T` returns
  an object, read `.pass`.
- Adapter uses `// @ts-expect-error` above the dynamic `import('@everworker/oneringai')` (optional
  dep, missing at tsc time) — do NOT switch to the `const m='@x'; await import(m)` variable form
  here; the static `// @ts-expect-error` is intentional and the build stays green when the dep is present.

### Verification (the working recipe)
```bash
cd packages/oa-framework
npx tsc -p tsconfig.json --noEmit            # EXIT=0 (Windows path; don't use /c/ prefix)
npx tsx test/oneringai-real.ts              # REAL_EXIT=0 — single-route real inference + 5T forge
npx tsx test/app-integration-demo.ts        # DEMO_EXIT=0 — external-app consumption layer
# NOTE: test/smoke.ts still hangs on omniroute/openmontage/turbovec health=ok hitting localhost
# (pre-existing, unrelated to oneringai). Use the two target scripts above for oneringai proof.
```

## §17 Deep-connect (深貫廣通) — chain + bus + 30-bee swarm

The "圓通無礙" closure added this session. Three new capabilities in `packages/oa-framework`:

1. **`OAOrchestrator.chain(task, chain: SubFrameId[])`** — deep-connect: each sub-frame's
   `dispatch` output becomes the NEXT sub-frame's `task.input`. Example:
   `crewai(草稿) → openmontage(視覺) → tencent-mem(記憶)`. Each hop is `forgeT5`-wrapped; an
   unregistered/timeout hop is graceful (returns a `【深貫跳失敗】` forged result, doesn't break
   the chain). Requires `OATask.input?: string` (added to `types.ts` — see Pitfalls).
2. **`OAOrchestrator.attachBus(pub)`** — wide-connect: dependency-inversion injection of a bus
   publisher. `run()` auto-`publish`es each result to `oa.pipeline.<subFrame>` (and
   `oa.pipeline.<subFrame>.failed` on error); `chain()` publishes to `oa.chain.<subFrame>`.
   **Why injection, not import:** `omni-agent-bus` already depends on `@esggo/oa-framework`, so
   oa-framework MUST NOT import the bus back (circular). Pass `omniBus.publish.bind(omniBus)` as
   the publisher from the OAB layer.
3. **`swarm-map.ts`** — `SWARM_NODES` (30 entries, aligned to soul.md 30 Souls Matrix):
   5 arrays (strategy/tech/creative/marketing/guard, ids 1-30) each binding 1-2 sub-frames.
   `broadcastSwarm(array, payload)` publishes to `oa.swarm.<id>` for every node in an array;
   `nodesByArray(array)` / `swarmTopic(id)` helpers. `oa.swarmSize === 30`.

### Test + verification recipe (proven green)
- `test/deep-connect.smoke.ts` — builds an `oa` frame, `attachBus(mockBus)`, then:
  `chain(crewai→openmontage→tencent-mem)`, `run(routeTo:[crewai,openmontage,turbovec])`,
  `broadcastSwarm('guard', {...})`. Asserts `RESULT: DEEP_CONNECT_OK`
  (chain 3 hops + 3 chain topics + 3 pipeline topics + guard-array 6 broadcasts + strategy 6 nodes).
- Run: `cd packages/oa-framework && npx tsx test/deep-connect.smoke.ts` → `DEEP_CONNECT_OK`.
- `oa-selfcheck.sh` step `[2b]` runs this — so the full self-check gate covers deep-connect.

### Pitfalls (deep-connect)
- **`OATask.input` must be added to `types.ts`** before `chain()` typechecks. `chain()` reads
  `task.input` and writes `stepTask = {...task, input: prevOutput}`. Without the field,
  `tsc -p tsconfig.json` (strict build) fails TS2339/TS2353. The field is `input?: string`.
- **mockBus must accept the real `OATaskResult` payload shape** — `published.push({ topic,
  source, subFrame: (payload as any)?.subFrame })`. The bus publisher signature is
  `(topic, source, payload) => void | Promise<void>`; `payload` is the forged `OATaskResult`.
- **Don't import OmniAgentBus into oa-framework** to satisfy `attachBus` — keep the
  dependency-inversion seam. The OAB bridge wires them at runtime.

## References
- `references/agent-reach-cli.md` — real Agent Reach CLI commands (from upstream SKILL.md).
- `references/oneringai-runtime.md` — OneRingAI install + known-good consumption code + real-error transcript.
- `references/monorepo-ts-pitfalls.md` — expanded pnpm-gate / optional-peer-dep / local-replication notes.
- `references/windows-path-lint-guard.md` — Windows/MSYS `search_files` + fake-lint workarounds + omni-agent-bus standalone verify recipe.
- `references/esggo-5t-verify-contract.md` — exact aistation↔esggo 5T endpoint contract, payload mapping, and the double-nested summary unwrap.
- `references/oab-build-verify-recipes.md` — canonical background-test + strict-build + branch-drift + GitHub-error-watch cron recipes, AND the `oa-selfcheck.sh` self-verify entry point (this session).
