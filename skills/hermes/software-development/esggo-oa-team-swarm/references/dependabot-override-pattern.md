# Dependabot Override Pattern — esggo

## Session Context

Resolved 39 Dependabot alerts (25 unique GHSA advisories) in DingJun1028/esggo repo via pnpm workspace overrides. All alerts were npm ecosystem; 0 pip alerts.

## Alerts Resolved

| GHSA ID | CVE | Severity | Package | Fix Version | Override Applied |
|---|---|---|---|---|---|
| GHSA-4cwx-7wf7-3272 | CVE-2026-13697 | high | undici | 7.29.0 | `>=7.29.0 <8` |
| GHSA-7p8r-x3mc-p8w7 | CVE-2026-18446 | high | fast-uri | 3.1.5 | `>=3.1.5 <4` |
| GHSA-8r6m-32jq-jx6q | N/A | high | fast-xml-parser | 5.10.1 | `>=5.10.1` |
| GHSA-rgw5-rvv9-x895 | CVE-2026-69152 | high | brace-expansion | 5.0.9 | `>=5.0.9` |
| GHSA-mh99-v99m-4gvg | CVE-2026-14257 | high | brace-expansion | 5.0.8 | (covered by `>=5.0.9`) |
| GHSA-v2hh-gcrm-f6hx | CVE-2026-16221 | high | fast-uri | 3.1.4 | (covered by `>=3.1.5`) |
| GHSA-f88m-g3jw-g9cj | N/A | high | sharp | 0.35.0 | EXCLUDED (devDep, next@16 pins ^0.34.5) |
| GHSA-r28c-9q8g-f849 | N/A | high | postcss | 8.5.18 | `>=8.5.23` (already in workspace) |
| GHSA-fxqj-rqcc-2cmp | CVE-2026-69153 | medium | postcss | 8.5.23 | (covered by `>=8.5.23`) |
| GHSA-j3f2-48v5-ccww | CVE-2026-59877 | medium | protobufjs | 7.6.5 | `>=7.6.5 <8` |
| GHSA-8j4g-w8fx-2239 | CVE-2026-69207 | medium | hono | 4.12.34 | Not in root lockfile |
| GHSA-v3r7-h72x-cjcm | CVE-2026-16729 | medium | undici | 7.29.0 | (covered by `>=7.29.0 <8`) |
| GHSA-8xcm-r25x-g524 | CVE-2026-16728 | medium | undici | 7.29.0 | (covered) |
| GHSA-m8rv-5g2x-5cg5 | CVE-2026-15157 | medium | undici | 7.29.0 | (covered) |
| GHSA-jr45-8vmc-qm54 | CVE-2026-14643 | medium | undici | 7.29.0 | (covered) |
| GHSA-4633-3j49-mh5q | CVE-2026-64647 | medium | next | 16.2.11 | `^16.2.11` (in package.json) |
| GHSA-68g3-v927-f742 | CVE-2026-64648 | medium | next | 16.2.11 | (covered) |
| GHSA-955p-x3mx-jcvp | CVE-2026-64643 | medium | next | 16.2.11 | (covered) |
| GHSA-q8wf-6r8g-63ch | CVE-2026-64644 | medium | next | 16.2.11 | (covered) |
| GHSA-6gpp-xcg3-4w24 | CVE-2026-64642 | high | next | 16.2.11 | (covered) |
| GHSA-m99w-x7hq-7vfj | CVE-2026-64641 | high | next | 16.2.11 | (covered) |
| GHSA-89xv-2m56-2m9x | CVE-2026-64649 | high | next | 16.2.11 | (covered) |
| GHSA-p9j2-gv94-2wf4 | CVE-2026-64645 | high | next | 16.2.11 | (covered) |
| GHSA-c2j3-45gr-mqc4 | N/A | low | dompurify | 3.4.12 | `>=3.4.12 <4` |
| GHSA-v422-hmwv-36x6 | CVE-2026-12590 | low | body-parser | 1.20.6 | `>=1.20.6 <2` |

## Verification

- `pnpm audit --prod` → 0 vulnerabilities in production deps
- `pnpm run test` → 468/468 passed (1 pre-existing failure in universal-tag-service, Prisma module related)
- `pnpm run build` → pre-existing failure (Prisma module), unrelated to overrides

## Key Discovery

- `pnpm update <pkg>@<ver>` does NOT bump transitive deps — they must be overridden in `pnpm-workspace.yaml`
- `undici` is transitive via `jsdom@29.1.1` (used by `vitest` and `isomorphic-dompurify`) — cannot be upgraded without breaking dev environment
- `sharp` is pinned by `next@16` which only accepts `^0.34.5` — excluded from override with AGENTS.md #7 rationale
- `hono` is not in the root lockfile at all — only transitive via `apps/learning-center`