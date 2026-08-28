# Downloading real CI logs for error classification

The `analyze` job must classify based on **actual failure output**, not the commit message. Commit
messages are unreliable (e.g. a `fix:` commit can still fail typecheck for an unrelated reason).

## Working pattern (verified in esggo auto-repair v2)
Use `actions/github-script@v7` to list failed jobs, then fetch each job's log archive:

```js
const runId = ${{ github.event.workflow_run.id }};
const jobs = await github.rest.actions.listJobsForWorkflowRun({
  owner: context.repo.owner, repo: context.repo.repo, run_id: runId
});
const failedJobs = jobs.data.jobs.filter(j => j.conclusion === 'failure');
for (const job of failedJobs) {
  const logs = await github.request(
    'GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs',
    { owner: context.repo.owner, repo: context.repo.repo, job_id: job.id,
      headers: { Accept: 'application/vnd.github.v3+json' } }
  ).catch(() => null);
  // logs.body is a ZIP; save it for the bash step to unzip
}
```

Then in a bash step:
```bash
mkdir -p /tmp/ci-logs
gh api "/repos/${{ github.repository }}/actions/runs/${{ github.event.workflow_run.id }}/logs" \
  --output /tmp/ci-logs/run.zip
cd /tmp/ci-logs && unzip -o run.zip
ALL_LOGS=$(find /tmp/ci-logs -name '*.txt' -o -name '*.log' | xargs cat 2>/dev/null)
# grep signatures -> set error_type / repairable outputs
```

## Why this matters
v1 of the esggo workflow guessed the error type from `git log -1` subject. It produced wrong
classifications (e.g. a dependency lockfile break mislabeled as `typescript`), so the wrong repair
job fired and the fix silently no-op'd. The log-download approach fixed that.

## Error signature table (for the grep step)
| error_type | grep signature |
|------------|---------------|
| typescript | `TS[0-9]{4}` / `error TS` / `property .* does not exist` |
| eslint | `eslint` / `parsing error` / `is defined but never used` |
| test | `FAIL` / `expect.*received` / `vitest` |
| build | `Module not found` / `Cannot resolve` / `next.*build.*error` |
| dependency | `ERR_PNPM` / `lockfile` / `module.*not found.*node_modules` |
| secret | `AKIA` / `ghp_` / `secret` / `credential` |
| docker | `docker` / `image.*fail` / `buildx` |
| prisma | `prisma` / `database` / `migration` |

Order matters: check `typescript` and `eslint` before `build`/`dependency` because their signatures
are more specific. Mark `secret` and `test` as `repairable=false` (human must intervene).
