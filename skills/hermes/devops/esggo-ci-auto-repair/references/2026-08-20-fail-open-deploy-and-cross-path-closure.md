# 20th class `fail_open_deploy` + cross-path closure trap + in_progress≠hung (2026-08-20)

One cron turn. Watcher `action=none`, newest main sha `c9a4a6c1` all-green, but 5 open trackers
(#842 Vercel, #843/#844 VPS lockfile-12b, #845/#846 ESG-GO CI/CD). Three durable lessons.

## 20th class: `fail_open_deploy` — a GREEN run that contains `[emerg]`

Both watchers filter `conclusion == 'failure'`, so a defect inside a **successful** run is never
sampled. Found only because #846's acceptance criteria forced reading the *winning* job's log.

Signature — present in `gh run view <id> --log`, **absent from `--log-failed`** (which is empty):
```
err: 2026/08/20 17:43:14 [emerg] 821823#821823: invalid number of arguments in
     "proxy_set_header" directive in /etc/nginx/...
err: nginx: configuration file /etc/nginx/nginx.conf test failed
...
✅ Successfully executed commands to all host.        ← step still SUCCEEDS
```
Deploy script line:
```bash
# Reload host nginx in case conf/vhost changed
sudo nginx -t && sudo systemctl reload nginx
```
`nginx -t` fails → `&&` short-circuits → `systemctl reload nginx` **never runs**; and because the line
is not the step's last command, its non-zero status does not fail the step (`✅ Deployment successful`).

Double damage:
1. New vhost/proxy config **not applied** — host nginx keeps serving the old config; "successful"
   deploy did not actually update the reverse proxy.
2. The bad file is on disk with a fatal `[emerg]` syntax error, so the next `systemctl restart nginx`
   or reboot leaves nginx **unable to start** — surfaces later as a full-site 502 with zero CI signal.

Fix (foreground; cron does not edit deploy scripts):
```bash
sudo nginx -t || { echo "[FAIL] nginx config invalid — aborting"; exit 1; }
sudo systemctl reload nginx
```
and correct the directive (`proxy_set_header Host $host;` — needs exactly 2 args).
Acceptance: next deploy log shows `nginx: configuration file ... test is successful`, no `[emerg]`.

Record it even when the tracker is otherwise closable — the poller can NEVER re-find a defect inside a
green run. **Generalised rule: grep the WINNING job's log whenever you certify a deploy; an empty
`--log-failed` is not evidence of health.**

## A green deploy in workflow B does NOT clear a deploy tracker for workflow A

The trap produced a correct-*looking* "root cause resolved, close it" verdict against real evidence.
esggo has TWO deploy paths to the same VPS, exercising different code:

| | tracker's red path (#843/#844) | the green run `32330949473` |
| --- | --- | --- |
| workflow | Deploy to Oracle VPS | ESG-GO CI/CD Pipeline |
| step | **`Deploy direct`** | **`Deploy via SSH`** |
| install site | **host** `/var/www/esggo` | **inside the Docker image** |
| install cmd | `pnpm install --frozen-lockfile` on host | `RUN pnpm install --frozen-lockfile --ignore-scripts` |
| workspace source | real host tree (**includes untracked `apps/oa-swarm/` residue**) | `COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./` |
| result | ❌ `Scope: 21` → `ERR_PNPM_OUTDATED_LOCKFILE` | ✅ passes |

The container COPYs only **git-tracked manifests**, so a 12b host-side untracked importer cannot enter
the build context — the green install is *structurally incapable* of testing it. Same
"0 hits cannot distinguish *fixed* from *code path never executed*" hazard as the aborted-linter trap:
here the missing signature meant **not run**, not repaired.

Before crediting any deploy success to a tracker, confirm **step name + install location** match the
failing path (`cut -f1,2 <log> | sort -u` names the step).

**Corollary — write closure criteria as a WORKFLOW NAME, not "the job goes green".** A criterion of
"wait for that job's final conclusion" actively misleads the next poll once a sibling path passes. Say
"only a green run of `Deploy to Oracle VPS` with `Scope: all 20` closes this". If an earlier comment of
yours left a loose criterion (mine said "await final conclusion"), post an explicit self-correction —
a tracker whose newest comment leads a reader to the wrong action is stale even when its diagnosis is
right. This turn I posted a "傾向性觀察" that a 6-min-alive deploy suggested the drift was cleared, then
had to **retract it**: the deploy was alive because it never ran the host install, not because it
survived it.

## `in_progress` for hours ≠ hung — read `startedAt` per JOB, never run-level `updatedAt`

Run `32330949473`: `createdAt 04:11:22Z` / `updatedAt 17:36:49Z` (13h) reads as hung. It was not —
`Docker Build Test` had been **re-run** at `17:10:39Z` (QEMU SIGILL flake, 19th class), passed at
`17:36:45Z`, and `Deploy to VPS` started `17:36:48Z`, 3s later.
```bash
gh run view <id> --repo DingJun1028/esggo --json jobs \
  --jq '.jobs[] | "\(.name) status=\(.status) concl=\(.conclusion) started=\(.startedAt)"'
```
A job whose `startedAt` is hours after its siblings' was re-run; the run is legitimately progressing.
Bonus: a rerun that turns green is the 19th class's discriminator **already executed** — record the
flake as confirmed rather than re-diagnosing. Also: this run's `conclusion` was `""` (empty) at poll
time = `status=in_progress`, neither pass nor fail; any `conclusion=="failure"` filter is blind to it.

## Correct cron outcome for this shape
watcher `action=none` + all reds already tracked & sibling-covered + one run still `in_progress` that
concludes green mid-turn + a fail-open defect inside that green run ⇒ **0 new issues, 4 comments
(#846 continue-verify, #843 3rd-recurrence index, #843 self-correction, #846 close-evidence+defect),
1 digest, 0 state writes** (state already at newest `32370553488`). The fail-open defect is left for a
foreground session to file a dedicated tracker, because cron cannot fix deploy scripts and a subagent
would be discarded.
