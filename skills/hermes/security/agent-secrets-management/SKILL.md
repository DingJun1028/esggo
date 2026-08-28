---
name: agent-secrets-management
description: Patterns for an agent acting as "secret manager" for a user — retrieving, wiring, auditing, and deleting cloud API keys across local .env, GitHub Secrets, and 1Password, without ever soliciting master credentials. Use when asked to fetch/set/rotate keys, integrate a vault, or unblock a task that needs real API keys.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, linux, macos]
metadata:
  hermes:
    tags: [secrets, github-secrets, 1password, security, headless]
    category: security
---

# Agent Secrets Management

How to act as the user's secret manager. DingJun1028 explicitly delegates this role ("授權給你秘密管理員資格").

## Hard rules (non-negotiable)

1. **NEVER solicit master credentials**: 1Password Secret Key, account password, or any vault master secret. Even under "自主授權 由你決定", route to service-account token or desktop-app (Windows Hello) integration instead. State the line explicitly and refuse Path C (manual `op account add`).
2. **GitHub Secrets are write-only**: `gh secret list` shows names only; values can never be read back. Do not promise retrieval from GitHub Secrets.
3. Never print secret values. Report `found (len=N)` instead.
4. Suggest rotation after any key transits chat history.

## "User pastes key + says store it" workflow (this user's pattern)

DingJun1028 frequently pastes live API keys / auth tokens into chat and says
「請放心儲存密碼」 / 「接受全」 — i.e. explicitly authorizes the agent to persist them.
Handle this with a fixed sequence:

1. **Store to local `.env` only** — never inline the secret into source files or git-tracked files.
   `printf 'KEY_NAME=value\n' >> .env` (append; do not echo the value back to chat).
2. **Confirm gitignore protects it** — `git check-ignore .env` must return the path; if not,
   add `.env` to `.gitignore` before writing. Verify with `git ls-files | grep -E "^\.env$"` → must be empty.
3. **Never print the secret** — report `stored (len=N)` or `✅ .env ignored`, never the value.
   Note: the Hermes output layer redacts secret-like strings (sbp_, sk-, key-hex) to `***` anyway —
   see `hermes-debug-pitfalls` trap 1; do not mistake that redaction for a code bug.
4. **Record provenance, not the value, in docs** — in secret registries (e.g. OMNIAGENT_SECRETS.md)
   write the *purpose* and *which soul/role* owns it, plus storage location (`.env`, gitignored),
   never the literal token.
5. **Rotation reminder** — because the key transited chat, suggest rotating at the provider later.
   Storage ≠ immunity from chat-exposure.

Seen in practice: Tailscale auth key + API token, Supabase key, Google Jules/OmniJules API key —
all stored to `.env` this way. The OmniJules/Jules key is a paid-family-shared
(OJ 訂閱=家庭共享 P) credential; treat `.env` storage as internal-free but still rotate if chat-leaked.

## Headless auth ladder for 1Password (op)

| Path | User action | Agent autonomy | Verdict |
|---|---|---|---|
| A: `OP_SERVICE_ACCOUNT_TOKEN` (vault-scoped) | create SA, paste token once | full headless | **Recommended** (1Password's own rec for automation) |
| B: Desktop app integration + Windows Hello | enable Settings→Developer→Integrate, approve prompt per session | partial (user must be present) | fallback |
| C: `op account add` (Secret Key + password) | types master credentials | — | **FORBIDDEN — never solicit** |

Probe state cheaply: `op account list` (empty = no account), `op vault list` (errors "No accounts configured" when locked). Always wrap `op` calls in `timeout` — some paths block waiting for interactive auth.

## 1Password Windows auth-state diagnosis (post-install)

After installing `op`, verify with this exact ladder, not just `--version`:

```bash
# 1. Installed?
op --version

# 2. Any account on disk?
op account list

# 3. Whoami outcome
op whoami
```

Interpretation:
- `op --version` OK + `op account list` empty + `op whoami` says "no account found for filter" → **CLI installed, zero accounts configured**
- `op account list` shows an account + `op whoami` succeeds → desktop app integration works, proceed
- Otherwise → proceed to Path A (`OP_SERVICE_ACCOUNT_TOKEN`), recommended for headless/Hermes

Error “No accounts configured” / “no account found for filter” is not a network failure. It is an unconfigured-auth state; the fix is sign-in/service account, not retrying in a tmux session.

## 1Password Windows auth-state shortcut (reusable)

For any task requiring live `op` use on Windows, use this helper instead of blind retries:

```python
import subprocess, shlex

def _op_check():
    for cmd in ["op --version", "op account list", "op whoami"]:
        try:
            p = subprocess.run(shlex.split(cmd), capture_output=True, text=True, timeout=10)
            print(f"[{cmd}] rc={p.returncode}")
            if p.stdout.strip():
                print(p.stdout.strip())
            if p.stderr.strip():
                print(p.stderr.strip())
        except Exception as e:
            print(f"[{cmd}] failed: {e}")
```

Use it to classify state cheaply before deciding whether to export `OP_SERVICE_ACCOUNT_TOKEN`, restart a backgrounded session, or stop.

`winget install AgileBits.1Password.CLI` reports success but `op` is NOT on PATH in the current git-bash/MSYS session (PATH reloads only on new logon). Reliable fallback: download the official zip and run locally:

```bash
curl -sSL -o op.zip "https://cache.agilebits.com/dist/1P/op2/pkg/vX.Y.Z/op_windows_amd64_vX.Y.Z.zip"
python -c "import zipfile; zipfile.ZipFile('op.zip').extractall('tools/op')"
tools/op/op.exe --version
```
If inside a repo: gitignore the binary dir (`tools/op/`) — never commit `op.exe`.

## Fail-closed pull-script pattern

When writing "vault → .env + GitHub Secrets" glue (see `scripts/pull_secrets_from_1pw.py` in youtube-automation-pipeline):

- Reuse the hardened writer module (`set_secrets.py`: `_is_plausible` rejects empty/placeholder/short values; `write_local_env` / `write_github_secrets`).
- **Fail-closed**: if vault is locked / `op` errors, write NOTHING. Verify this with an ad-hoc script that snapshots `.env` before/after a forced `--apply` while locked.
- Support `--list-vaults`, `--vault <name>`, auto-discover (title hints like esggo/cloud/api/key), dry-run default, `--apply` to write.
- Delete GitHub secrets non-interactively via `gh api -X DELETE repos/{owner}/{repo}/actions/secrets/{NAME}` (plain `gh secret delete -y` can fail).

## Tool execution limitations (Windows/Hermes Desktop)

When `terminal`, `execute_code`, or `process` tools are **BLOCKED** due to security controls:

1. **Provide manual fallback instructions** - Never stop at "blocked"
2. **Batch-independent tool calls** - Parallel reads/searches first, then sequential actions
3. **Cronjob for scheduled work** - Use `no_agent: true` with specific timestamps, not 'now'

Example blocked scenario:
```
terminal       → BLOCKED (security control)
execute_code   → BLOCKED (arbitrary code execution)
process        → BLOCKED (depends on terminal)
cronjob        → PARTIAL (schedule format restrictions)
```

Fallback: Provide executable command sequences for user manual execution.

## GCP Secret Manager + GitHub Secrets hybrid pattern

For projects requiring both cloud-native and CI/CD secrets:

### 1. GCP Secret Manager (primary storage)
```bash
# Create secret
gcloud secrets create SECRET_NAME --project=PROJECT_ID --data-file=- <<< "VALUE"

# Access in CI/CD
gcs_access=$(gcloud secrets versions access latest --secret="SECRET_NAME" --project="PROJECT_ID")
```

### 2. GitHub Actions OIDC integration (recommended)
```yaml
- name: 'Access GCP Secret'
  id: secret
  uses: google-github-actions/auth@v2
  with:
    credentials_json: '${{ secrets.GCP_SA_KEY }}'
- name: 'Retrieve Secret'
  run: |
    gcloud secrets versions access latest --secret="SECRET_NAME" \
      --project="PROJECT_ID" | gh secret set SECRET_NAME --body -
```

### 3. Fallback: Manual GitHub Secrets
When OIDC is not configured, provide batchable commands:
```bash
for secret in "NAME1|VALUE1" "NAME2|VALUE2"; do
  IFS='|' read -r name value <<< "$secret"
  echo "$value" | gh secret set "$name" --body -
done
```

## Security incident response (credential exposure in chat)

When credentials are accidentally exposed:

1. **Immediate warning** - Classify all exposed secrets by risk level
2. **Rotation priority** - High-risk first (service account keys, PATs, API keys with billing)
3. **Verification** - Provide list of secrets to rotate with specific deadlines
4. **Documentation** - Update SOPs to prevent recurrence

### Rotation deadlines:
- Service account keys / PATs: 12 hours
- Billing-enabled API keys: 24 hours
- Read-only keys: 72 hours

## Verification convention (this user)

Ad-hoc verify scripts go to `tempfile.gettempdir()` as `hermes-verify-*.py`, run once, delete immediately, and print an explicit `AD-HOC VERIFY: PASS/FAIL`. Honest reporting: if a verification cannot be re-run (e.g. execution blocked), say so — never claim a fresh pass from a stale run. Note: the system's "unverified" flags often list already-deleted Temp paths (stale fingerprints); confirm with a disk glob before re-verifying.

## Related Windows fix (bonus)

`wsl --update` failing with `Wsl/CallMsi/Install/REGDB_E_CLASSNOTREG` (all wsl.exe subcommands broken): repair by installing the winget MSI **elevated**:
```bash
powershell.exe -NoProfile -Command "Start-Process winget -ArgumentList 'install --id Microsoft.WSL --source winget --accept-package-agreements --accept-source-agreements' -Verb RunAs -Wait"
```
Then `wsl --version` works again. Pipe wsl.exe output through `tr -d '\0'` in git-bash (UTF-16 output).
