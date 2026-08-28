# 2026-08-22 — 21st class `ssh_action_command_timeout` + the docker-backend REST-API fallback

Two independent lessons from one cron turn where the prescribed tracker script could not run at all.

---

## A. 21st class: `ssh_action_command_timeout` — a failed job log with NO `##[error]` line

### Signature
The failed step's log ends with a **successful-looking** build tail, then one bare line:

```
out: #48 naming to docker.io/library/vps-esggo:latest done
out: #48 unpacking to docker.io/library/vps-esggo:latest
2026/08/22 05:23:20 Run Command Timeout
```

There is **no `##[error]` line anywhere in the job log**. Consequences:

- `grep -nE "##\[error\]"` → only the unrelated Node-20-deprecation `##[warning]`.
- The 9-class grep scheme, `auto-repair.yml` and `oa-twins-tracker.py` all classify it `(unknown)`
  and file a `(unknown)` tracker (here: issue #871, `Error Type: unknown`, `Repairable: false`).
- Like `startup_failure`, this class is **invisible to log-grep triage by construction**.

### Decisive evidence: do the arithmetic on the timestamps
| Marker | Time |
| --- | --- |
| step start (`#2 [internal] load metadata …`) | `05:13:07` |
| `Run Command Timeout` | `05:23:20` |
| **delta** | **10 min 13 s** ⇒ `appleboy/ssh-action` default `command_timeout: 10m` |

### The trap: `timeout:` is NOT `command_timeout:`
`.github/workflows/deploy.yml` (esggo, workflow `ESG-GO CI/CD Pipeline`) L169-177 looked
generously configured yet had no command budget:

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@v1.0.3
  timeout-minutes: 90        # ✅ job level
  with:
    timeout: 60m             # ✅ session / connect timeout — NOT the command budget
    # command_timeout:       # ❌ absent ⇒ default 10m, shorter than the ARM64 docker build
    script: |
      ...
```

Fix = one line: `command_timeout: 60m` inside `with:`.

### Two hard rules that follow
1. **Never route this to `repair-build` / `repair-dependency`.** The build SUCCEEDED — the tail proves
   the image was named and unpacked. Only the SSH session was cut.
2. **The deploy may be half-applied.** Image built, but `docker compose up -d` / health check is
   unproven. Verify the live endpoint (curl), never the workflow colour.

### Related same-turn findings (same sha `bc0871b9`, three different root causes)
| Run | Workflow | Job / Step | Root cause |
| --- | --- | --- | --- |
| `32552714680` | ESG-GO CI/CD Pipeline | Deploy to VPS / **Deploy via SSH** | 21st class (this doc) |
| `32552714623` | Deploy to Oracle VPS | Deploy to VPS / **Deploy direct** | 12b — `ERR_PNPM_OUTDATED_LOCKFILE` for `apps/oa-swarm` |
| `32552714620` | Deploy to Vercel | Deploy to Vercel (production) | credential — `The token provided via --token argument is not valid` |

#### 12b detail worth reusing: an exclusion glob at the WRONG LEVEL
`pnpm-workspace.yaml` intended to exclude the app but negated the wrong path:

```yaml
packages:
  - 'apps/*'        # on the VPS this re-includes the untracked apps/oa-swarm (project #22)
  ...
  - '!oa-swarm'     # ❌ negates ROOT-level oa-swarm, never matched apps/oa-swarm
```
`GET /contents/apps/oa-swarm?ref=main` → **404** ⇒ the tree exists only on the deploy target, which is
why CI installs are green and the VPS install dies. Fix `'!apps/oa-swarm'` — lockfile-neutral (the dir
is absent from the repo, so the importer set cannot change), but only verifiable by re-running the
VPS deploy (`Scope: all 22 workspace projects` must drop to 21).

#### A PR can introduce a Node/pnpm incompatibility that LOOKS like a lockfile bug
PR #872 (`+3/-3` on `vps/Dockerfile.arm64`) downgraded all three stages `node:22-alpine → node:20-alpine`:
```
#18 6.515 warn: This version of pnpm requires at least Node.js v22.13
#18 6.515 warn: The current version of Node.js is v20.20.2
#18 8.837 Error [ERR_UNKNOWN_BUILTIN_MODULE]: No such built-in module: node:sqlite
#18 8.837     at ... corepack/v1/pnpm/11.5.2/dist/pnpm.mjs:55051:25
#18 ERROR: process ".../pnpm install --frozen-lockfile --ignore-scripts" did not complete successfully
```
Frames land in `pnpm.mjs` (same masking as the 19th class) and the failing command is
`pnpm install --frozen-lockfile`, so it reads as dependency/lockfile breakage. It is neither: pnpm 11
requires Node ≥ 22.13 and Node 20 has no `node:sqlite`. Compare the base image against `main` before
classifying.

---

## B. Docker terminal backend: the tracker script is NOT mounted — REST-API fallback

### Symptom
```
ls /c/Users/dingj/AppData/Local/hermes/scripts/   → No such file or directory
command -v gh                                     → NO_GH
```
The docker backend mounts only `/c/Users/dingj/OneDrive` and `/c/Users/dingj/secret-vault`, so
`C:/Users/dingj/AppData/Local/hermes/scripts/oa-twins-tracker.py` (and `gh-error-watch.py`, and the
`gh` CLI itself) are unreachable. A cron prompt whose only step is "run that script" **cannot** be
followed. Declare the deviation, then fall back — do not report silence.

### Fallback: python3 + `GITHUB_TOKEN` from the secret vault
```python
VAULT = "/c/Users/dingj/secret-vault/ENV20230818.env"   # GITHUB_TOKEN=... (repo+workflow scopes)
# read the key with a startswith() scan; never print the value
```
`https://api.github.com` is reachable from the docker backend (`/rate_limit` → 200).

Endpoint map (replaces the `gh` calls the skill normally uses):
| `gh` command | REST endpoint |
| --- | --- |
| `gh run list --json …` | `GET /repos/{o}/{r}/actions/runs?per_page=N` (`head_sha`, `event`, `conclusion`, `name`) |
| `gh run view <id> --json jobs` | `GET /repos/{o}/{r}/actions/runs/{id}/jobs` (`total_count` **0 ⇒ startup_failure**) |
| `gh run view <id> --log-failed` | `GET /repos/{o}/{r}/actions/jobs/{job_id}/logs` (see redirect trap) |
| `gh issue list / view` | `GET /repos/{o}/{r}/issues?state=open`, `/issues/{n}`, `/issues/{n}/comments` |
| `gh issue comment -F` | `POST /repos/{o}/{r}/issues/{n}/comments` `{"body": …}` → **201** + `html_url` (works on PR numbers too) |
| `gh search issues` | `GET /search/issues?q=repo:{o}/{r}+in:title,body+"phrase"` |
| `gh pr view --json files` | `GET /repos/{o}/{r}/pulls/{n}/files` (`patch` field = the diff) |
| reading a file at a sha | `GET /repos/{o}/{r}/contents/{path}?ref={sha}` (404 = **absent at that sha**, the 12b probe) |

### THE trap: the job-logs endpoint 401s if you follow the redirect with your token
`/actions/jobs/{id}/logs` answers **302** to a signed Azure blob URL. `urllib` follows redirects and
**re-sends the `Authorization` header**, which Azure rejects:
```
HTTP 401 Server failed to authenticate the request. Please refer to the information in the www-authenticate header.
```
Follow it manually, unauthenticated:
```python
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise urllib.error.HTTPError(req.full_url, code, newurl, headers, fp)

try:
    with urllib.request.build_opener(NoRedirect).open(req, timeout=60) as r:
        return r.read()
except urllib.error.HTTPError as e:
    if e.code in (301, 302, 303, 307, 308):
        loc = e.reason if isinstance(e.reason, str) else e.headers.get("Location")
        plain = urllib.request.Request(loc)          # NO Authorization header
        with urllib.request.urlopen(plain, timeout=90) as r2:
            return r2.read()
```
Single-job logs come back as **plain text** (a whole-run download would be a zip). The ANSI-strip and
`grep -ah "<short literal>"` rules from the five-traps section apply unchanged.

### Other cron-mode notes for this backend
- `execute_code` is refused under cron; `write_file` + `terminal` + `python3 - <<'PY'` heredocs work.
- There is **no local esggo clone** in the docker backend, so `git`-based diagnosis is replaced by
  `/contents/{path}?ref={sha}` reads. Nothing can be verified by running `pnpm`; classify accordingly
  (file/comment evidence, leave code changes to a foreground session).
- The Windows-side watcher state file is unreachable, so **no state advance is possible** — say so in
  the report instead of writing a docker-side state file that the real script never reads.
