---
name: github-secrets
description: "GitHub Actions secrets & variables: set/list/delete via gh, the write-only limitation, and the server-side workflow trick to mirror secrets across repos when the user won't paste values."
version: 1.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [GitHub, Secrets, Variables, Actions, gh, Migration]
    related_skills: [github-repo-management, github-auth]
---

# GitHub Secrets & Variables

Manage GitHub Actions secrets/variables with `gh`, and — critically — understand the one constraint that trips everyone up: **secrets are write-only to every client, at every permission level.**

## The write-only hard limit (read this first)

GitHub stores Action secrets encrypted and exposes them **write-only** to all clients. `gh secret list` returns only names + timestamps. Neither `gh` nor the REST API ever returns plaintext, no matter your token scope (`repo`, `admin:repo_hook`, even org owner). There is **no CLI/API call that reads a secret's value back.**

Consequence: if a user asks you to "read the secret out of repo A and copy it into repo B," you cannot — not because of permissions, but because the platform physically doesn't serve it. Do NOT promise to read it. Offer the two real options:

1. **User pastes the values** → you `gh secret set` them into the target (fastest, cleanest).
2. **User won't paste** (the "secret administrator" case) → run a **server-side mirror workflow** (below). Plaintext stays on GitHub's runners; it never reaches your terminal or the chat.

Variables (`gh variable`) differ: they're NOT encrypted and their values ARE readable via `gh variable list` / API. So variables can be copied client-side directly.

## Deleting secrets non-interactively (the `-y` flag does NOT exist)

`gh secret delete <NAME>` prompts for confirmation and **has no `-y` / `--yes` flag** in current gh versions (usage shows only `-a/-e/-o/-u`). Running `gh secret delete NAME -y` returns `rc=1` ("unknown flag: -y") and **silently leaves the secret in place** — a real trap when a cleanup step is supposed to run unattended (e.g. after a placeholder pre-flight, or a key-rotation script).

**Fix — use the REST API directly, which is always non-interactive:**
```bash
gh api -X DELETE "repos/OWNER/REPO/actions/secrets/NAME"
# rc=0 on success; confirm with `gh secret list`
```
When you write a `set_secrets.py`-style helper with a `delete` subcommand, shell out to `gh api -X DELETE` (NOT `gh secret delete -y`). Also have `delete` scrub the **local `.env`** line for the same key — otherwise an even-placeholder value lingers in the working tree. Verify both ends are gone afterwards.

## "Secret administrator" who says "自行查看" still cannot retrieve keys

If a user authorizes you as "secret manager" and says to "look it up yourself," do NOT promise to find real keys — GitHub is write-only (above) AND the repo may simply have **no secrets** (`gh secret list` empty) with **no real keys in local `.env`**. There is then nothing to read. The honest path:

1. `gh secret list` → confirm it's empty (or only placeholder names).
2. Tell the user plainly: no real keys exist client- or server-side, so cloud wiring (the "D" step) can only proceed when they paste values.
3. To prove the wiring is *live* without a real key, run a **placeholder pre-flight**: set a clearly-fake key (`sk-TEST_PLACEHOLDER_...`) via the helper, confirm it lands in both GitHub + local `.env`, then `gh api -X DELETE` it and revert the local `.env` line. This validates the write+delete path with zero real credential exposure.

Never store or echo a real key. After any paste-based setup, advise the user to rotate the pasted key (it lives in chat history).

Verify both ends are gone afterwards.

## `gh secret set NAME` with no TTY silently creates an EMPTY secret

In a non-interactive shell (no stdin / no PTY), running `gh secret set RUNWAY_API_KEY` (no `--body`) does **not** error — it exits `0` and stores an **empty-string** secret. This is a trap: a CI gate that checks `if [ -n "$RUNWAY_API_KEY" ]` then believes a key is present, but the real call fails with an auth error; an empty secret can also satisfy a gate while doing nothing useful.

**Detect + clean:**
```bash
gh secret list | grep RUNWAY_API_KEY          # confirm it landed (name only)
gh api -X DELETE "repos/OWNER/REPO/actions/secrets/RUNWAY_API_KEY"   # no -y flag exists
```
Then have the **user run `gh secret set RUNWAY_API_KEY` in their own interactive terminal** (they paste, input hidden, never echoed) — or paste the value to you and you set it with `gh secret set NAME -b "..."` (still hidden by `gh`; never print it). Never leave an empty placeholder secret behind; it pollutes the gate's truth.

## GitHub Actions job-level `if:` CANNOT read the `secrets` context

`if: ${{ secrets.RUNWAY_API_KEY != '' }}` on a **job** fails workflow validation with:
`Invalid workflow file — Unrecognized named-value: 'secrets'. Located at position 1 within expression: secrets.RUNWAY_API_KEY != ''`.

The `secrets` context is not available in a job's `if:` (only `github`, `needs`, `vars`, `inputs`, `env` are). To gate a job on whether a secret is set:
1. In a prior job, map the secret into a **step env var** and emit an **output** from it:
   ```yaml
   - name: Probe cloud secrets
     id: cloud_gate
     env:
       RUNWAY_API_KEY: ${{ secrets.RUNWAY_API_KEY }}
       ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
     run: |
       if [ -n "$RUNWAY_API_KEY" ] || [ -n "$ELEVENLABS_API_KEY" ]; then
         echo "ready=true" >> "$GITHUB_OUTPUT"
       else
         echo "ready=false" >> "$GITHUB_OUTPUT"
       fi
   ```
2. Gate the dependent job on that output:
   ```yaml
   cloud-integration:
     needs: build
     if: ${{ needs.build.outputs.cloud_ready == 'true' }}
   ```
(`env:` referencing `secrets.*` IS allowed — only `if:` at job level is not.) Same pattern applies to `vars.*` if you prefer a manual toggle over secret-presence detection.

## Basic operations

```bash
# Set a secret from stdin, a string, or a file.
# Windows PowerShell / cmd: use a pipe or a temporary file; --body-file is NOT supported
# by the gh version that ships with this Hermes installation on Windows.
gh secret set API_KEY --body "$VALUE"
echo "$VALUE" | gh secret set API_KEY
gh secret set SSH_KEY < ~/.ssh/id_rsa

# Windows concrete pattern for a local private-key file:
cat "/c/Path/To/id_rsa" | gh secret set VPS_SSH_KEY --repo OWNER/REPO

gh secret list                       # names + updated_at only
gh secret list -R OWNER/REPO
gh secret delete API_KEY
gh secret delete API_KEY -R OWNER/REPO

# Variables (values ARE visible)
gh variable set DEPLOY_ENV --body production
gh variable list
gh variable delete DEPLOY_ENV
```

## Discovering what secrets exist in a repo

`gh secret list` returns only names + timestamps, but often the *names themselves* tell you what the user already stored (e.g. `VPS_HOST`, `VPS_USER`, `SSH_PRIVATE_KEY`, `OCI_*`). When asked to use repo secrets for a task far away from direct key-paste, read the name list first before guessing or asking the user to recreate secrets. It is also a first step in deciding whether a mirror workflow, a local paste is needed, or an existing secret should be reused.

There is no `gh secret get` — reading secret values back is impossible; only the name set is readable client-side.

## Mirror secrets across repos (server-side workaround)

When the user authorizes you to copy secrets from SOURCE repo to TARGET repo but won't hand you the values: a GitHub Actions workflow in SOURCE can read `${{ secrets.X }}` as plaintext *inside its own run*, then write them to TARGET using a PAT. This is the only way to migrate secrets across repos without the user pasting them.

Reusable template: `references/cross-repo-secret-mirror.yml`. Edit `env.TARGET` and the secret name map, then:

```bash
# 1) Temp PAT with secrets:write on TARGET (reuse current gh login; never hardcode)
TOKEN=$(gh auth token)
gh secret set MIRROR_PAT -R OWNER/SOURCE -b "$TOKEN"

# 2) Commit the one-shot workflow into SOURCE
B64=$(base64 -w0 < references/cross-repo-secret-mirror.yml)
gh api repos/OWNER/SOURCE/contents/.github/workflows/mirror-secrets.yml \
  -X PUT -f message="chore: one-shot secret mirror" -f content="$B64"

# 3) Trigger
gh workflow run mirror-secrets.yml -R OWNER/SOURCE

# 4) Poll (see pitfall on gh run watch below)
for i in $(seq 1 12); do
  st=$(gh run view --repo OWNER/SOURCE --json status,conclusion -q '\"\(.status) \(.conclusion)\"' 2>/dev/null || echo "poll-error")
  echo "try $i: $st"
  case "$st" in *completed*|*success*|*failure*) break;; esac
  sleep 10
done

# 5) Verify target received them (names only)
gh secret list -R OWNER/TARGET

# 6) CLEAN UP — always remove the temp secret + workflow file
gh secret delete MIRROR_PAT -R OWNER/SOURCE
SHA=$(gh api repos/OWNER/SOURCE/contents/.github/workflows/mirror-secrets.yml --jq '.sha')
gh api repos/OWNER/SOURCE/contents/.github/workflows/mirror-secrets.yml \
  -X DELETE -f message="chore: remove one-shot mirror" -f sha="$SHA"
```

### Pitfalls
- **`gh run watch` is flaky** — intermittently throws `error connecting to api.github.com` even when the run succeeds. Use a `gh run view --json status,conclusion` poll loop instead.
- The mirror PAT must have `secrets:write` on the **target** repo (a full `repo`-scoped token satisfies this). A token scoped only to the source cannot write to the target.
- Server-side mirror only copies secrets that *exist* in SOURCE. If a value lives in committed code or an `.env.example` placeholder (not an actual secret), the workflow writes an empty string. **Search the source repo first** (`gh search code`, read `.env*` / `google-services.json` / config files); if the real value is committed, just read the file directly — no mirror needed.
- Always run cleanup step 6. Never leave `MIRROR_PAT` or the workflow file behind — that's a lingering secret-shaped surface.
- **Updating an existing workflow file via `gh api` requires the current `sha`.** Omitting `-f sha="<current-sha>"` produces HTTP 422 `"sha" wasn't supplied.` even when uploading a new file with the same path.
- **Do not invent extra secret names.** If `gh secret list` shows `SSH_PRIVATE_KEY` and `VPS_SSH_KEY` but no `SSH_PORT`, do not add a new `SSH_PORT` secret unless the user confirms. Prefer the existing key names; only ask for new ones when truly missing.

## Consuming repo secrets inside a server-side workflow

When local key-paste/SSH is unavailable and you decide to route work through a GitHub Actions workflow that consumes repo secrets, keep these rules:

1. **Logs can show presence, not plaintext.** You can show whether a secret env var is set or empty, but never echo the value itself.
2. **Do not assume referenced secrets are populated.** Debug failure by checking whether the runner shows a secret env as empty; that means the secret isn't set in the target repo, not that YAML is wrong.
3. **Heredocs in run steps do not auto-expand `${VAR}` references.** OpenSSH config / runtime files written via heredoc keep literal `${VAR}` text unless you explicitly substitute it. This fails silently as `Bad port '${SSH_PORT}'`.\n\n  ```bash\n  # WRONG\n  cat > ~/.ssh/config <<EOF\n  Host vps\n    Port ${SSH_PORT}\n  EOF\n\n  # RIGHT\n  printf 'Host vps\\n  Port %s\\n  User %s\\n' '${SSH_PORT}' '${VPS_USER}' > ~/.ssh/config\n  ```\n4. **Format-declared secrets can still be invalid content.** A secret named `SSH_PRIVATE_KEY` or `VPS_SSH_KEY` may start with `-----BEGIN OPENSSH PRIVATE KEY-----` and still fail with `error in libcrypto` / `is not a key file`. That means the stored bytes are not actually a usable private key, even though the header looks right. When SSH auth fails in that pattern, treat the secret content as suspect rather than blaming the runner. If the user still won't paste the key, the correct fallback is diagnosis, not retry.\n\n  Reusable diagnostic workflow: `references/ssh-key-diagnose.yml`. It prints format type and `ssh-keygen -l -f` validation for every candidate secret without revealing the key material.\n5. **`git push` may report `nothing to commit` when the local tree is already clean.** That means the API upload in step 2 succeeded despite local showing clean; do not retry the push blindly. Check `gh run list --workflow=...` to confirm the workflow file exists server-side.

## SSH-deploy via a local private key set as a `SSH_PRIVATE_KEY` secret

When interactive SSH from your machine is blocked (`Permission denied (publickey)`,
no TTY, or you don't want to babysit an interactive shell) but the key file **already
exists locally**, you can deploy via GitHub Actions without ever exposing the key in chat:

1. Set the local key as a masked repo secret — value piped from the file, never printed:
   ```bash
   # Windows git-bash:
   cat "$USERPROFILE/.ssh/id_rsa_esggo" | gh secret set SSH_PRIVATE_KEY -R OWNER/REPO
   # host/user as plain variables (no secret needed):
   gh secret set DEPLOY_HOST -R OWNER/REPO -b "161.118.252.147"
   gh secret set DEPLOY_USER -R OWNER/REPO -b "ubuntu"
   ```
   Use `-b "$(cat file)"` — NOT bare `gh secret set NAME` (that creates an **empty**
   secret in a non-TTY shell; see trap above).
2. A `deploy.yml` workflow writes the secret to `~/.ssh/deploy_key`, `ssh-keyscan`s the
   host, then SSHes in to bootstrap docker/nginx, `docker compose pull && up -d`, and
   reload nginx. Clean the key up in an `if: always()` step.
3. Trigger: `gh workflow run deploy.yml -f domain=aistation.esggo.co`.

This is the "use necessary permission" path: the key is on the user's machine, you
route it through the CLI into a masked secret, and CI does the SSH. The key content
never appears in chat, repo, or (after the cleanup step) the runner filesystem.

Reusable template: `references/ssh-deploy-via-secret.md`.

## Diagnostic deploy: open VPS-local firewall + print facts (no console changes)

After a deploy "succeeds" (container up, loopback health OK), the service may STILL be
unreachable from the public internet. Three distinct blockers are easy to conflate —
diagnose them separately before telling the user "it's done":

1. **VPS-local firewall** (ufw/iptables) — you CAN fix this over SSH (the `SSH_PRIVATE_KEY` secret).
2. **Provider Security List** (Oracle/OCI ingress 80/443) — console-only, you CANNOT fix this from SSH.
3. **DNS A/AAAA record** for the subdomain — console/Cloudflare-only, you CANNOT fix this from SSH.

Add a `diag.yml` workflow (same SSH-secret pattern) that ships a small `diag.sh` via rsync
and runs it on the VPS. It opens 80/443 on the VPS-local firewall, runs `sudo ss -ltnp` to
prove nginx listens on `0.0.0.0:80` (NOT just `127.0.0.1`), curls the loopback health, and
prints the public IP (`curl -fsS https://api.ipify.org` — that's the A-record target for DNS).
If loopback works + nginx listens on `0.0.0.0:80` but the public IP still times out from your
machine, the blocker is #2 or #3 — both console-side. Hand the user the exact console steps;
don't loop on SSH retries. (The `diag.sh` content is reusable; see `vps-bootstrap-and-deploy`
skill references for the canonical version.)

```bash
# diag.sh — runs on the VPS; only opens local firewall + prints facts
sudo ufw allow 80/tcp; sudo ufw allow 443/tcp
sudo ss -ltnp | grep -E ':80 |:443 |:8000 '
sudo nginx -t
curl -fsS --max-time 8 http://127.0.0.1:8000/api/health
curl -fsS --max-time 8 https://api.ipify.org
```

## Pitfall: inserting a `cloud_gate` step breaks step-index-based tests

When you add a `cloud_gate` step (to emit `cloud_ready`) into the `build` job, the job's
step list grows. A CI test that locates the build-push step by a fixed index
(`d['jobs']['build']['steps'][-1]`) will now grab `cloud_gate` instead and fail to find
`platforms`. Fix: locate the step by `uses`/`with` —
`next((s for s in steps if 'build-push-action' in s.get('uses','')))`, or assert on the
step's `with` keys, never on position. Applies to any later workflow edit that inserts
steps before a position you assumed was stable.

## Batch setting secrets from user-provided values

When the user supplies multiple env-var values in one message or asks you to set them all at once, batch them in a single terminal call:

```bash
gh secret set VITE_X --repo OWNER/REPO --body "value1"
gh secret set VITE_Y --repo OWNER/REPO --body "value2"
gh secret set VITE_Z --repo OWNER/REPO --body "value3"
```

Keep the body values short and explicit. If prior secrets in the same project already follow a domain convention (existing `VITE_BOOKING_URL`/`VITE_REPLAY_WEB_APP_URL` etc.), assume the user wants the same naming pattern for new values.

## Domain automation secret conventions

When the user opts into automated DNS/SSL via Cloudflare and GoDaddy, standardize secret names across repos:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `GODADDY_API_KEY`
- `GODADDY_API_SECRET`

Do not inventorize these names repeatedly. If `whois <domain>` shows Cloudflare nameservers, use Cloudflare API. If it shows GoDaddy nameservers, use GoDaddy REST API. Both paths require these credentials to exist in the target repo before automation.

## Failed-CLI fallback for domain tools

If the user requests a CLI that is not installed (`cloudflare`, `godaddy`, `omnicli`) and installation fails:
1. Stop after one install attempt.
2. Switch to direct REST API (`curl` + `jq`).
3. State the missing tool and the fallback path explicitly.
4. Do not retry installs repeatedly.

## When a value isn't a secret at all

Front-end config like `NEXT_PUBLIC_*` / `VITE_*` is often committed in source or build config (not stored as a secret). Before mirroring, grep the repo: `gh search code "AIzaSy" --repo OWNER/REPO`. If it's committed, read it and `gh secret set` client-side.
