# hermes auth — live transcripts (captured 2026-08-04, Local backend = Git-Bash)

## `hermes auth status` (bare — fails)
```
hermes auth status
hermes: auth status: error: the following arguments are required: provider
```
→ Use `hermes auth list` instead.

## `hermes auth list` (output)
```
copilot (1 credentials):
  #1  GITHUB_TOKEN         api_key env:GITHUB_TOKEN

nous (1 credentials):
  #1  device_code          oauth   device_code ←

opencode-go (1 credentials):
  #1  OPENCODE_GO_API_KEY  api_key env:OPENCODE_GO_API_KEY rate-limited GoUsageLimitError (429) (ready to retry) ←

opencode-zen (1 credentials):
  #1  OPENCODE_ZEN_API_KEY api_key env:OPENCODE_ZEN_API_KEY auth failed ModelError (401) (re-auth may be required)
```

## `hermes auth reset opencode-zen` (output)
```
Reset status on 1 opencode-zen credentials
```
Note: reset only clears the vault entry. The API key lives in the Hermes vault, NOT in `$OPENCODE_ZEN_API_KEY` (env check returned UNSET). To fix 401, add a fresh key:
`hermes auth add opencode-zen --type api-key --api-key <NEW>`

## `hermes auth add` WITHOUT `--label` (fails non-interactively)
```bash
Label (optional, default: api-key-2): Traceback (most recent call last):
  ...
    label = input(f"Label (optional, default: {default_label}): ").strip() or default_label
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
EOFError: EOF when reading a line
```
→ ALWAYS pass `--label <name>` (even when `--api-key` is supplied):
`hermes auth add opencode-zen --type api-key --api-key "$OPENCODE_ZEN_API_KEY" --label api-key-zen`

## `hermes auth add opencode-zen --type oauth` (fails — not implemented)
```bash
bash: no job control in this shell
`hermes auth add opencode-zen` is not implemented for auth type oauth yet.
```
→ Fall back to `--type api-key`.

## `hermes auth remove <provider> <index>` of an `env:` entry (purges .env + suppresses re-seed)
```bash
Removed opencode-zen credential #2 (OPENCODE_ZEN_API_KEY)
Note: OPENCODE_ZEN_API_KEY is still set in your shell environment (not in ~/.hermes/.env).
  Unset it there (shell profile, systemd EnvironmentFile, launchd plist, etc.) or it will keep being visible to Hermes.
  The pool entry is now suppressed — Hermes will ignore OPENCODE_ZEN_API_KEY until you run `hermes auth add opencode-zen`.
```
→ Use this to cleanly purge stale/broken env-sourced credentials.

## `hermes auth status <provider>` (verify fix)
```bash
$ hermes auth status opencode-zen
opencode-zen: logged in
```
→ After fixing a 401, confirm with `auth status <provider>`, not just `auth list` (list may still echo stale flags until re-verified).

## Recovering a 401 provider — verified playbook (Local/Git-Bash)
```bash
cd "$LOCALAPPDATA/hermes" && set -a && . ./.env; set +a   # keys now in $OPENCODE_ZEN_API_KEY etc.
hermes auth add opencode-zen --type api-key --api-key "$OPENCODE_ZEN_API_KEY" --label api-key-zen
hermes auth reset opencode-zen                                # clears exhaustion/401 flags
hermes auth remove opencode-zen 1                             # drops stale #1 (env: entry), purges .env + suppress
hermes auth status opencode-zen                               # expect "logged in"
```
NOTE: if `.env` keys are themselves expired, repeat with a freshly pasted key:
`hermes auth add opencode-zen --type api-key --api-key "<NEW_KEY>" --label api-key-zen`, then remove the old entry.
For THIS user the agent is authorized to self-manage keys end-to-end (2026-08-04 red line abolished) — still recommend rotation after any key is exposed in chat, never invent a value.

## Local-backend environment fact
Terminal runs `/usr/bin/bash` (Git for Windows). PWD = `/c/Users/dingj`.
Env-var existence check must use bash, not PowerShell:
```
if [ -n "$OPENCODE_ZEN_API_KEY" ]; then echo "ZEN_ENV=SET"; else echo "ZEN_ENV=UNSET"; fi
```
PowerShell form `if ($env:VAR) { }` throws `syntax error near unexpected token`.
