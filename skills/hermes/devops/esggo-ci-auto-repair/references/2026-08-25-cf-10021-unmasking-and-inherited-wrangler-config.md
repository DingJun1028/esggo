# 2026-08-25 — CF `10021` unmasking + an inherited wrangler config (TS5058 doubled path)

Two new classes found in one cron turn, plus a correction to how the 21st class should be judged.

---

## 22nd class — `cf_10021_node_api_at_import`

The cause sitting **underneath** the 21st class. Tracker #907 (KV `${FREE_MODELS_KV_ID}`, code
`10042`) was fixed by PR #908 and merged as `b55fa45d`. All three Workers stayed **red** — but with a
completely different signature:

```
✘ [ERROR] A request to the Cloudflare API (/accounts/…/workers/scripts/oa/versions) failed.

  Uncaught TypeError: The argument 'path' must be a file URL object, a file URL string,
  or an absolute path string.. Received 'undefined'
    at null.<anonymous> (node:module:34:15) in createRequire
    at null.<anonymous> (…/@notionhq+workers@0.4.0/…/dist/worker.js:13:20)
   [code: 10021]
```

`@notionhq/workers@0.4.0` calls `createRequire(...)` at **module top level** with `undefined`
(no `import.meta.url` / `__filename` in the Workers runtime). CF performs startup validation *after*
upload, so the whole version is rejected. **Unrelated to `nodejs_compat`** — the package is simply
Workers-incompatible.

**Trap: the upload SUCCEEDS.** The log shows `Total Upload: 413.77 KiB / gzip: 76.69 KiB` and a clean
bindings table immediately before the error. Do not read those as a pass; the failure is the
validation step after them.

### The 21st class is a STACK of masked causes, not one bug

Its root cause has now been three different things on three dates:

| Date | Cause | Code |
| --- | --- | --- |
| 2026-08-23 | `DATABASE_URL` env gate | — |
| 2026-08-25 (earlier) | unexpanded `${FREE_MODELS_KV_ID}` KV binding | `10042` |
| 2026-08-25 (after #908) | `createRequire` at import in `@notionhq/workers` | `10021` |

So **judge a CF fix by the OLD signature disappearing, never by the check-run turning green.**
Two-part proof that #908 worked even though CF stayed red:

1. `10042` / `${FREE_MODELS_KV_ID}` **absent** from the new build log.
2. The bindings table no longer lists the KV — only
   `env.ASSETS`, `env.ENVIRONMENT`, `env.SMART_ROUTER_VERSION`.

A still-red CF build after a correct fix is normally **unmasking**. Write that word into the tracker,
or the next poll reports "the fix failed" and someone reverts a good change.

### Timing: CF builds are SEQUENTIAL per Worker

Completion times on one sha: `06:15:18` (esggo) → `06:19:42` (oa) → `06:23:03` (wrangler-deploy) —
roughly **4 min apart, ~12 min for three**. A poll taken minutes after a merge legitimately shows
`in_progress` for the later Workers. `in_progress` is **neither pass nor fail** — re-poll before
scoring the turn (same rule as burying mechanism #2 for Actions).

Read logs with the MCP tool; `output.summary` on the check-run carries no log text:

```
mcp__cloudflare_builds__workers_builds_get_build_logs  buildUUID=<uuid>
```

Get the UUID from the check-run `details_url` (last path segment):

```bash
gh api "repos/DingJun1028/esggo/commits/<sha>/check-runs?per_page=100" \
  --jq '.check_runs[] | select(.app.slug=="cloudflare-workers-and-pages")
        | "\(.status)/\(.conclusion // "RUNNING") \(.name) \(.details_url | split("/") | .[-1])"'
```

---

## 23rd class — `inherited_wrangler_config` (TS5058 doubled path)

`Deploy OmniGateway Worker` had failed **12/12 runs since 2026-07-30** — it has never once deployed.

```
[custom build] error TS5058: The specified path does not exist:
  '/home/runner/work/esggo/esggo/worker/my-worker/tsconfig.json'
```

The tell is the **doubled segment** `worker/my-worker`.

### Cause

`.github/workflows/deploy-worker.yml` ends with:

```yaml
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v4
        with:
          workingDirectory: worker
```

but `worker/` contains **no `wrangler.toml`**:

```bash
$ git ls-tree origin/main worker/ --name-only
worker/.gitignore
worker/README.md
worker/__tests__
worker/sim.mjs
worker/src
worker/tsconfig.json
```

So wrangler walks **up** and silently inherits the repo-root `wrangler.toml`, which describes a
*different* Worker:

```toml
name = "esggo"
main = "my-worker/src/index.ts"
[build]
command = "npx --yes pnpm install --frozen-lockfile && npx tsc -p my-worker/tsconfig.json"
```

Relative paths in `[build]` resolve against **cwd**. From `worker/`, `my-worker/tsconfig.json`
becomes `worker/my-worker/tsconfig.json` → TS5058.

### Diagnose in two read-only calls

Never assume the config beside the workflow is the one wrangler used:

```bash
git ls-tree origin/main worker/ --name-only    # is there a wrangler.toml here at all?
git show origin/main:wrangler.toml | head -20  # what got inherited instead?
```

### NOT cron-repairable

The fix is a **new** `worker/wrangler.toml`, which means choosing a Worker `name` (creates or targets
a real CF service, and the wrong value can deploy over another Worker), a `compatibility_date`, and
bindings. That is a product decision, not a mechanical edit. File a root-cause tracker.

Note the same root config also emits
`▲ [WARNING] Failed to match Worker name. Your config file is using the Worker name "esggo", but the
CI system expected "wrangler-deploy"` in the CF builds — one root `wrangler.toml` is being reused for
three different Workers, which is the deeper design smell behind both classes.

---

## Anti-pattern: per-run_id trackers hide a chronic red

Every prior tracker for this workflow — **#838, #839, #866, #867, #686** — was titled
`… Deploy OmniGateway Worker #<run_id>` and **closed**, while the cause was never fixed. The red
therefore recurred 12 times invisibly, and a `gh issue list --state open` check finds *nothing*.

**When a chronic red's trackers are all closed per-run_id, say so explicitly.** A per-run tracker is
a notification, not a root-cause record. Search closed issues too before concluding it is untracked:

```bash
gh search issues --repo DingJun1028/esggo "TS5058" --json number,title,state --limit 10
```

Also check the run history rather than just the newest failure — 12/12 red is a very different
finding from "broke today", and it changes the fix from *repair* to *this has never worked*:

```bash
gh run list --repo DingJun1028/esggo --workflow "Deploy OmniGateway Worker" --limit 12 \
  --json databaseId,conclusion,headSha,createdAt
```

---

## Turn shape

`action=none` from the tracker script, yet: 3 CF Workers red (already covered — a sibling had closed
#907 and filed #909 with matching analysis, so **0 new issues** was correct), plus one Actions
workflow red that landed **after** the script's poll snapshot (`32820343709` > state
`32813745531`) — caught only by the mandatory gap scan. Independent re-derivation that *agreed* with
the sibling's classification is what licensed staying silent on GitHub.
