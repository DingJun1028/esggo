# esggo audit case — 2026-08-07

## Repo state
- Monorepo with root `pnpm-workspace.yaml`.
- `pnpm` field in `package.json` is **silently ignored** on pnpm 11.5.2+; overrides must live in `pnpm-workspace.yaml`.

## Findings
- Initial prod audit: 1 critical + 13 high + 5 moderate + 1 low = 20 vulns.
- After workspace overrides + reinstall: 6 prod vulns remain.
- Remaining modules: `tar`, `@tootallnate/once`, `@opentelemetry/*`, `adm-zip`.
- These come from deep transitive paths such as `@google/adk > sqlite3 > node-gyp > tar` and are not runtime-accessible from app code.

## Working override additions
```yaml
overrides:
  "tar": ">=7.5.21 <8"
  "js-yaml": ">=4.3.1 <5"
```

## Lockfile caveat
- Even after overrides, `node_modules/.pnpm/tar@6.2.1` can remain as a stale transitive resolution.
- `pnpm install --no-frozen-lockfile --force` did not remove it in this repo.
- Do not treat the presence of `tar@6.2.1` under `.pnpm` as proof the override failed; use `pnpm audit --prod` output as the source of truth.

## Merge-conflict hygiene
- `pnpm-workspace.yaml` merge conflict commonly occurs on the `sqlite3` line under `allowBuilds:`.
- Accept remote version `sqlite3: false` unless native builds are explicitly required.
