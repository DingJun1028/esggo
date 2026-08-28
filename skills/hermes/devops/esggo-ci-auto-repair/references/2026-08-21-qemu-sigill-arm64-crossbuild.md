# 19th class: `qemu_sigill` — ARM64 cross-build killed in the EMULATION layer

Discovered 2026-08-21 cron poll. Run `32330949473`, ESG-GO CI/CD Pipeline @ `da0f42d2`, tracker #846
(which had **0 comments** — the root cause was unrecorded anywhere), `(unknown)` twin #845.

## Signature

Failing job/step (`cut -f1,2 <log> | sort -u` — one only):
```
Docker Build Test	Build Docker image (ARM64)
```

Real error lines:
```
#20 27.89 [ERROR] Command was killed with SIGILL (Invalid machine instruction):
          /usr/local/bin/node /root/.cache/node/corepack/v1/pnpm/11.5.2/bin/pnpm.mjs install
#20 27.89     at getFinalError (file:///root/.cache/node/corepack/v1/pnpm/11.5.2/dist/pnpm.mjs:34089:14)
#20 ERROR: process "/dev/.buildkit_qemu_emulator /bin/sh -c pnpm run build"
          did not complete successfully: exit code: 1
ERROR: failed to build: failed to solve: process "/dev/.buildkit_qemu_emulator /bin/sh -c pnpm run build" ...
##[error]buildx failed with: ERROR: failed to build: ...
```

**The two decisive tokens are `/dev/.buildkit_qemu_emulator` and `SIGILL (Invalid machine
instruction)`.** An x86 runner emulating ARM64 through `qemu-user` executes Node, whose JIT emits an
instruction the emulator rejects and the process is killed.

## Do NOT misroute it

`pnpm`, the `Dockerfile` and the application source are all innocent. The stack frames point into
`pnpm.mjs`, which makes it *look* like the 11th/12th lockfile classes or a plain `build` failure —
it is neither. Never send this down `repair-dependency` / `repair-build`, and never "fix"
`pnpm run build`. `SIGILL` is not reachable from application code at all.

## Flakiness is the DEFAULT hypothesis — prove it with the sha table

```bash
gh run list --repo DingJun1028/esggo --workflow "ESG-GO CI/CD Pipeline" --branch main --limit 4 \
  --json databaseId,conclusion,headSha,createdAt \
  --jq '.[] | "\(.databaseId) \(.conclusion) \(.headSha[0:8]) \(.createdAt)"'
```

Observed:

| run_id | sha | time (UTC) | conclusion |
| --- | --- | --- | --- |
| 32330949473 | `da0f42d2` | 08-20 04:11 | **failure** |
| 32326348442 | `81de815b` | 08-20 02:55 | success |
| 32326257436 | `2bc1f634` | 08-20 02:53 | success |
| 32163858782 | `f081bbc9` | 08-18 17:06 | success |

Adjacent shas green + a merge commit red ⇒ emulation flake, not a code regression.

## This is one of the few classes a cron turn SHOULD repair inline

`gh run rerun <id> --failed` is low-risk, reversible, and doubles as the discriminator:

| Rerun outcome | Verdict | Action |
| --- | --- | --- |
| `success` | emulation flake | close the tracker + its `(unknown)` twin, with evidence |
| same `SIGILL` | **deterministic** | escalate to a permanent fix; do NOT re-rerun |

## Permanent fixes (build-matrix change = human decision, never from cron)

1. **Native ARM64 runner** — `runs-on: ubuntu-24.04-arm`. Removes the QEMU path entirely. Best.
2. **Move `pnpm install` / `pnpm run build` out of the emulated stage**; let the ARM64 stage only
   `COPY` prebuilt artifacts, so no Node JIT ever runs under emulation.
3. Pinning `setup-qemu-action` / an older qemu image — mitigation, not a cure.

## Verification

Judge by job conclusion, never by a bare count — the standard zero-needs-its-conclusion rule:
```bash
grep -ac SIGILL <log>                                          # 0 alone proves nothing
gh run view <id> --repo DingJun1028/esggo --json jobs \
  --jq '.jobs[] | "\(.conclusion // "running")\t\(.name)"'      # must show that job success
```

## Emulated builds are SLOW — "still running" is not "hung"

The failing run died at **~2 min** (`04:13:18` build start → `04:15:07` error). A healthy rerun of the
same job was still `in_progress` past **10 min** while every sibling job (`Validate VPS Scripts`,
`Security Scan`, `Code Quality`) had already gone `success`. Passing the previous failure timestamp is
itself weak positive evidence. Hand the confirmation to the next 15-minute poll rather than blocking
the turn on it.

## Co-occurring but INDEPENDENT causes on the same `main`

This class is easy to wrongly bundle with the deploy reds. Same poll, same `main`, three mutually
exclusive causes — one fix turns exactly one workflow green:

| Workflow | Root cause | Tracker |
| --- | --- | --- |
| ESG-GO CI/CD Pipeline | `qemu_sigill` (this class) | #846 / #845 |
| Deploy to Oracle VPS | 12b — `apps/oa-swarm` untracked on the deploy target | #843 (#844 dup) |
| Deploy to Vercel | invalid `VERCEL_TOKEN` (credential) | #842 |
