# ESG-GO Type-Sync Topology (verified 2026-08-01)

Verified via GitHub API + raw fetches (sandbox had no terminal; checker algorithm replayed by hand).

## Repos

| Role | Repo | Default branch | Notes |
|---|---|---|---|
| Canonical source | `DingJun1028/esggo` (public) | `main` | Monorepo; `shared/types.ts` v3.1.0-Omni, blob sha `c745f68` (last modified 2026-07-22). |
| Consumer | `DingJun1028/esggo-learning-center` (public) | `main` | Vite + React frontend (JS/JSX); last push 2026-07-28. |

## Pipeline

- **Generator**: `esggo/scripts/export-shared-types.js` — hardcoded map of 21 exports in order (4 enums: `ESGKnowledgeBase`, `ARVOStage`, `SkillCategory`, `MasteryLevel`; 17 interfaces: `IKnowledgeRecord` … `IApiResult`). `findExportBlock(name, kind)` brace-counts from the `export <kind> <name>` line; output = blocks joined with blank lines, `.trim()` + trailing `\n`. `LIC` header const is defined but **never used** — generated file has no header.
- **DEST contract**: `path.join(process.cwd(), 'types', 'generated', 'esggo-shared.d.ts')` — only correct when cwd is the consumer repo. CI runs it as `cd esggo && node scripts/export-shared-types.js`, so CI's generate step writes into the esggo checkout (dead output); the real gate is the checked-in consumer artifact.
- **Drift checker**: `learning-center/scripts/check-types-sync.js` — SRC = `../esggo/shared/types.ts` (sibling checkout assumption), DEST = `types/generated/esggo-shared.d.ts`; block-level compare, strips `//` comments; emits `TYPES_IN_SYNC` (exit 0) or `TYPES_OUT_OF_SYNC` + missing/extra/mismatched (exit 1).
- **CI gate**: `esggo-learning-center/.github/workflows/ci.yml` job `check-types-sync` — checkout esggo → generate → `cd learning-center && node scripts/check-types-sync.js` → expect `TYPES_IN_SYNC`. (The esggo repo's own `ci.yml` is the platform CI, unrelated.)
- **npm script added 2026-08-01**: `"check:types-sync": "node scripts/check-types-sync.js"` in consumer package.json.

## Verified state (2026-08-01)

Local `C:\Project\esggo-learning-center\types\generated\esggo-shared.d.ts` vs GitHub `esggo/shared/types.ts` main: **21/21 blocks identical → TYPES_IN_SYNC** (no missing / extra / mismatched; `ISkillNode`'s `// 0-7` comment present on both sides).

## Risk points / open items

1. Local `C:\Project\esggo-learning-center`'s git origin was re-pointed to `esggo.git` on 2026-07-31, but the tree actually belongs to `esggo-learning-center` repo (content never synced). Push/pull against the wrong remote is a real hazard — confirm intent (monorepo migration vs accidental re-point).
2. Generator DEST cwd contract ambiguity (see above) — if a maintainer ever relies on the CI generate step's output, it silently goes to the wrong checkout.
3. Consumers `functions/src/setClaims.ts` and `esggo-auto-repair/worker/src/*.ts` use independent domain types (no shared-type imports); frontend is JSX. No other surface currently consumes the artifact — it serves as the single source for future TS/JSDoc use.
