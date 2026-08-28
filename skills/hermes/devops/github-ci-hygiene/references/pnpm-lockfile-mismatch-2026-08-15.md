# pnpm lockfile mismatch — session evidence

## Observed failure pattern
- Workflow: `pnpm install --frozen-lockfile`
- Error:
  ```
  [ERR_PNPM_LOCKFILE_CONFIG_MISMATCH] Cannot proceed with the frozen installation. The current "overrides" configuration doesn't match the value found in the lockfile
  ```
- CI log location: `gh run view <RUN_ID> --log-failed` under the "Install dependencies" step.

## Root cause
`pnpm-workspace.yaml` and `pnpm-lock.yaml` `overrides` blocks diverged after a merge added/edited workspace overrides without re-locking.

## Verified fix
```bash
pnpm install --lockfile-only --no-frozen-lockfile
git add pnpm-lock.yaml
```
Acceptance:
```bash
pnpm install --frozen-lockfile   # must be EXIT=0
```

## Notes
- Do not edit `package.json` for this class of failure; only re-lock.
- After fix, keep one canonical tracker PR/issue; close duplicates with reference to the fix commit SHA.