---
name: cross-repo-type-sync
description: "Share TypeScript/JavaScript types across repos without runtime coupling. Covers canonical source selection, generator scripts for .d.ts artifacts, drift-check CLIs, CI gates, and branch mirroring between repos."
version: 1.0.0
author: DingJun1028 / Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [typescript, monorepo, ci, github-actions, sync]
    related_skills: [github-repo-management, github-pr-workflow, vps-bootstrap-and-deploy]
---

# Cross-Repo Type Sync

## Trigger

Use when two or more repos need shared domain types but are not in a single workspace/monorepo.

## Principle

One repo must be canonical. Others consume a generated artifact; CI verifies drift before runtime.

## Workflow

1. **Pick canonical source**
   - One file or package owns the truth, e.g. `src/lib/types.ts`, `packages/shared/src/index.ts`.
2. **Add a generator script**
   - Extract named exports (`enum`, `interface`, `type`) into a raw `.d.ts`.
   - Do not wrap exports in re-export boilerplate unless required.
3. **Add a checker script in the consumer**
   - Regenerate from canonical source, then compare against the checked-in artifact.
   - Normalize comments/import paths before comparison.
   - Exit non-zero on mismatch; print a minimal diff.
4. **Wire CI**
   - Checkout both repos.
   - Run generator.
   - Run checker.
   - Treat mismatch as failure.

## Minimal Generator Shape

Read source, extract export blocks, write `.d.ts` with optional license header only.

## Drift Checker Design

Prefer block-level comparison over full-text normalization when order/formatting differs but semantic content is identical.

```js
// 1. Extract exported names and raw blocks from both source and generated
// 2. Compare:
//    - missing exports: in source but not generated
//    - extra exports: in generated but not source
//    - mismatched blocks: same name but different body after stripping comments
```

This avoids false mismatches from:
- Different block ordering between source and generated
- Comment stripping normalization edge cases
- Wrapper vs raw export style differences

The checker should emit `TYPES_IN_SYNC` on success and `TYPES_OUT_OF_SYNC` plus a short missing/extra/mismatched list on failure.

## CI Skeleton

```yaml
check-types-sync:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        repository: owner/source-repo
        path: source
    - uses: actions/checkout@v4
      with:
        path: consumer
    - run: cd source && node scripts/export-shared-types.js
    - run: |
        GENERATED="$(cd consumer && node scripts/check-types-sync.js)"
        echo "$GENERATED"
        if [ "$GENERATED" != "TYPES_IN_SYNC" ]; then
          echo "Type sync check failed"
          exit 1
        fi
```

## Mirroring One Repo as a Branch in Another

To create a branch copy without affecting either repo's main history:

```bash
# From the source repo
git push <target-origin> HEAD:<new-branch-name>
```

If the target branch already exists and must be replaced, append `--force`; otherwise choose a distinct name.

## Verifying Sync Without a Local Checkout (GitHub API / raw path)

When the sandbox has no terminal (no node to run the generator/checker) — verify a public repo pair remotely:

1. Confirm both repos exist and are public: `GET https://api.github.com/repos/<owner>/<repo>` → `private: false`.
2. Fetch canonical source raw: `https://raw.githubusercontent.com/<owner>/<repo>/main/<path>`.
3. Fetch the consumer's checked-in artifact (same URL pattern) and confirm the CI gate exists: `.../contents/.github/workflows` should list the drift-check workflow.
4. Replay the drift-checker algorithm by hand: extract export blocks from both files, strip `//` comments, compare missing / extra / mismatched — emit the same verdict the checker would (`TYPES_IN_SYNC` / `TYPES_OUT_OF_SYNC`).

**Pitfall — web_extract / Firecrawl mangles raw TypeScript**: it escapes `_` → `\_`, drops generic args (`Record<string, any>` → `Record`), rewrites `[]` → `\[\]`, `|` → `\|`. Never diff or regenerate against web_extract output; it will produce false drift. For exact bytes, `browser_navigate` to the raw.githubusercontent URL and read the snapshot text instead.

ESG-GO specifics (verified topology, generator block map, risk points): `references/esggo-typesync-topology.md`.

## Quick Recovery: CI `TYPES_OUT_OF_SYNC` → auto-regenerate all consumers

When `check-types-sync` reports:
```
missing: PlayerSourceKind, IPlayerSource, IZoomMeeting, IPlayerState, ISecondBrainNote
mismatched: ISseTranslationEvent, ISpeechToSubtitleResult
```
Run this single recovery sequence from the monorepo root:
```bash
cd apps/learning-center && node ../../scripts/export-shared-types.js
cd ../universal-translator && node ../../scripts/export-shared-types.js
cd ../../ && node scripts/export-shared-types.js
```
Then verify all 3 consumers with the block-level checker script from Step 1.

Key points:
- `export-shared-types.js` writes to `path.join(process.cwd(), 'types', 'generated', 'esggo-shared.d.ts')`, so you **must** `cd` into each consumer dir before running it.
- The `map` array inside `export-shared-types.js` is the real gate: new interfaces in `shared/types.ts` won't propagate unless they are listed in `map`.
- Node 20 deprecation warnings in CI logs are non-blocking; only `TYPES_OUT_OF_SYNC` fails the job.
- After regeneration, commit only the changed `.d.ts` files and push; the next CI run should show `TYPES_IN_SYNC`.

## Pitfalls

- **Do not wrap generated exports**: re-export wrappers make diff noisy and drift checks fail.
- **Do not use async fs in generator**: `fs.readFile()` inside ESM can receive malformed args depending on loader. Use `fs.readFileSync()`.
- **Do not hardcode OS paths**: use `path.resolve(process.cwd(), '..', 'shared', 'types.ts')`.
- **Do not regenerate nightly on main**: only run generation/gating in CI or explicitly by maintainer. Nightly regeneration creates noisy PRs.
- **Do not allow generated file drift**: keep the generated artifact checked into the consumer repo so it can be consumed offline; only regenerate on demand.
- **Check which checkout the generator writes into**: if DEST is derived from `process.cwd()` (e.g. `path.join(process.cwd(), 'types', 'generated', ...)`), a CI generate step that `cd`s into the canonical repo writes the artifact into the canonical checkout — dead output, not the consumer artifact. Don't treat that step as the gate; the real gate is the consumer repo's checked-in artifact compared against canonical source. When the generator's cwd contract is ambiguous (CI runs it from the canonical repo but the artifact lives in the consumer repo), state the intended cwd explicitly in the workflow.
