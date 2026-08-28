# Trivy Security Scan Failure — esggo CI

## How to diagnose (always do this first)
```bash
# List recent runs on the failing branch
gh run list --repo DingJun1028/esggo --branch main --limit 5
# View the FAILED-job logs of a specific run
gh run view <RUN_ID> --repo DingJun1028/esggo --log-failed 2>&1 | tail -80
# Grep for the real failure signature (strip ANSI first)
gh run view <RUN_ID> --repo DingJun1028/esggo --log-failed 2>&1 | sed 's/\x1b\[[0-9;]*m//g' \
  | grep -iE "Total: [0-9]|CRITICAL|HIGH|exit code 1|trivy" | head
```

## Real failure signature (run 31029613913, 2026-08-05)
Job: `Security Scan / Run Trivy vulnerability scanner (filesystem)`
Trivy config: `scan-type: fs`, `exit-code: 1`, `severity: CRITICAL,HIGH`, `ignore-unfixed: true`.
Output tail:
```
esggo-omni-center/pnpm-lock.yaml (pnpm)
Total: 6 (HIGH: 6, CRITICAL: 0)
| Library        | Vulnerability     | Severity | Fixed Version        |
| brace-expansion | CVE-2026-14257    | HIGH     | 5.0.8, 3.0.3, ...    |
| brace-expansion | CVE-2026-69152    | HIGH     | 1.1.18, 2.1.4, ...   |
| fast-uri       | CVE-2026-16221    | HIGH     | 2.4.3, 3.1.4, 4.1.1  |
| fast-uri       | CVE-2026-18446    | HIGH     | 2.4.4, 3.1.5, 4.1.2  |
| fast-xml-parser| GHSA-8r6m-32jq-jx6q| HIGH    | 5.10.1               |
| undici         | CVE-2026-13697    | HIGH     | 7.29.0, 8.9.0        |
##[error]Process completed with exit code 1.
```
Note: `undici-types` also appears in the lock but was NOT flagged (only `undici@7.28.0` was).

## Fix recipe
The vulnerable pkgs were transitive devDeps via `vite` / `esbuild` / `vitest` in
`esggo-omni-center/package.json`. To repair:
```bash
cd esggo-omni-center
# see who pulls them
pnpm why brace-expansion fast-uri fast-xml-parser undici
# bump the direct toolchain deps to a patched range, e.g.:
#   vite ^7 (or latest), vitest ^4.x patched, esbuild bumped transitively
pnpm upgrade vite vitest esbuild
pnpm install
# verify locally (optional; CI re-run confirms)
```
Then commit the new `pnpm-lock.yaml` and let CI re-run. Confirm 0 HIGH/CRITICAL.

## Pitfall: narrative vs evidence
The compaction summary claimed "Vitest/ESLint failure" — false. Only the pipeline log is truth.
Never open a repair PR for tests/lint when the real failing job is the security scan.
