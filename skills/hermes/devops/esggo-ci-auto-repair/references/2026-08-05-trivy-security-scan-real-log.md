# Trivy security-scan failure misread as a test/lint failure (2026-08-05, run 31029613913)

## The trap
`ESG-GO CI/CD Pipeline` went red. The compaction summary **and the user's own repro** both said
"Vitest/ESLint failed". Both were WRONG. The real failing job was:

```
Security Scan / Run Trivy vulnerability scanner (filesystem)
```

A conversational narrative is never evidence. Only `gh run view <id> --log-failed` is.

## What the log actually said
**6 HIGH** findings, all in `esggo-omni-center/pnpm-lock.yaml`:

| Package | Advisories |
| --- | --- |
| `brace-expansion` | CVE-2026-14257, CVE-2026-69152 |
| `fast-uri` | CVE-2026-16221, CVE-2026-18446 |
| `fast-xml-parser` | GHSA-8r6m-32jq-jx6q |
| `undici` | CVE-2026-13697 |

Trivy step config: `exit-code: 1`, `severity: CRITICAL,HIGH`, `ignore-unfixed: true`.

## Grep signatures to check BEFORE assuming test/lint
```bash
grep -nE "Total: [0-9]+ \(|CRITICAL: [0-9]+|HIGH: [0-9]+|exit code 1" <log>
grep -nE "CVE-20[0-9]{2}-[0-9]+|GHSA-[a-z0-9-]+" <log> | head -20
```

## repair-security
The vulnerable packages were **transitive devDeps** pulled by `vite` / `esbuild` / `vitest`, not
direct dependencies. Fix:
1. Bump `vite` / `vitest` / `esbuild` in `esggo-omni-center/package.json` to the patched range
   (or `pnpm upgrade <pkg>`).
2. `pnpm install` and re-lock.
3. Re-run Trivy (or just the CI job) and require **0 HIGH / 0 CRITICAL** before opening the PR.

Beware the lockfile hazards documented in the 11th/12th classes: a regeneration here can collide with
any open lockfile-only PR. Check `gh pr list` for a sibling touching `pnpm-lock.yaml` first, and
prefer an additive diff (`+N/-0`) over a full route-B regeneration.
