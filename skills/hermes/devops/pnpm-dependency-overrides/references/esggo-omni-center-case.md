# Case: esggo-omni-center Trivy 6 HIGH → 0 (2026-08-06)

## Trigger
`ESG-GO CI/CD Pipeline` run failed in `Security Scan` — NOT tests/lint. Trivy (`aquasecurity/trivy-action`)
scanned `esggo-omni-center/pnpm-lock.yaml` and found 6 HIGH.

## Vulnerable → patched (all transitive)
| pkg | vulnerable | patched (override) | resolved in lockfile |
|-----|-----------|-------------------|----------------------|
| brace-expansion | <5.0.8 | >=5.0.8 | 5.0.9 |
| fast-uri | <=3.1.3 | >=3.1.4 | 4.1.2 (already >3.1.4) |
| fast-xml-parser | <5.10.1 | >=5.10.1 | 5.10.1 |
| undici | <7.29.0 | >=7.29.0 | 8.10.0 (already >7.29.0) |
| sharp | <0.35.0 | >=0.35.0 | 0.35.3 |
| next | <16.2.11 | >=16.2.11 | 16.3.0 |
| postcss | <=8.5.17 | >=8.5.18 | 8.5.21 |

Note: `fast-uri` and `undici` were ALREADY at safe versions after the first override pass — only
brace-expansion / fast-xml-parser were the original Trivy 6. The additional `sharp`/`next`/`postcss`
HIGHs surfaced via `pnpm audit` and had to be added in a SECOND override pass to reach 0 HIGH/CRIT.

## Commands that worked
```bash
cd esggo-omni-center
# edit pnpm-workspace.yaml overrides (root already had postcss/uuid/gaxios/glob/minimatch)
export CI=true
pnpm install --lockfile-only      # ~30s, no "ignored" warning = override read
pnpm audit --audit-level high --json | node -e '...count high/critical...'   # => 0
git add pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "fix: resolve Trivy HIGH vulns via pnpm overrides"
git push
```

## Gotcha that cost a cycle
First attempt put overrides in `package.json` `pnpm` field → silent ignore → `pnpm install` aborted
with TTY error → lockfile unchanged → CI still red. Moved to `pnpm-workspace.yaml` → resolved.
