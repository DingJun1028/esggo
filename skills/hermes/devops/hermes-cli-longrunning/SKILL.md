---
name: hermes-cli-longrunning
description: Hermes doctor/dashboard are long-running, not timeouts.
---

# Hermes CLI Long-Running Commands

## When to use this skill
Trigger whenever you run a Hermes CLI subcommand that does NOT return quickly:
- `hermes doctor` / `hermes doctor --fix` — runs **31 parallel connectivity checks + npm audit**; takes **50–130s**.
- `hermes dashboard` — a **long-lived web server**; it never exits in foreground.
- `hermes update` — git pull + venv rebuild; can take minutes, may need `--force-venv`.

## The fake-timeout trap (most important lesson)
A foreground `terminal()` call hits its timeout (default 10–15s, max 600s) and returns `exit 124`. This looks like a hang but is usually just a slow/long-running command. **Do not conclude the command failed, and do not spam retries or pkill loops.** Switch to background execution and poll.

## Correct execution pattern
Launch in background and wait for completion:
```bash
# Bounded command (doctor, update, doctor --fix):
terminal(command="hermes doctor", background=true, notify_on_complete=true)
process(action="wait", session_id=<id>, timeout=120)
# read captured output from the wait result
```
```bash
# Never-exiting server (dashboard): launch, then verify out-of-band
terminal(command="hermes dashboard --skip-build --no-open --port 9119", background=true)
# in a SEPARATE call:
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:9119/   # expect 200
```

## Pitfalls
- **Don't `pkill -f "hermes dashboard"` thinking it's hung** — it's a server. Kill only when you actually intend to stop it. The repeated "Command timed out" is the foreground timeout firing, NOT the server dying.
- **Port already in use**: `Error 10048 / address already in use` on 9119 means a prior instance is still bound. Either `pkill -f "hermes dashboard"` then retry, or launch on a different port (`--port 9120`).
- **OpenRouter probe**: `hermes doctor` only probes OpenRouter if `OPENROUTER_API_KEY` is exported in `.env`. Without it, it prints `⚠ OpenRouter API (not configured)` instantly — that is expected, not an error. Configure via `hermes auth add openrouter --type api-key --label "OpenRouter Key" --api-key <key>` if you want the check to pass.
- **`npm audit fix` is non-breaking**: it will NOT clear undici / brace-expansion vulnerabilities pinned by electron / node-gyp (build-time deps). `npm audit fix --force` would install undici outside the stated dependency range and may break the dashboard build. Leave build-time advisories alone unless the user explicitly wants a forced bump + a rebuild verification (`cd web && npm run build`).

## Dashboard bring-up recipe (verified working)
```bash
# 1. Build the web UI once (≈60s — run in background, it can exceed foreground limits)
cd ~/AppData/Local/hermes/hermes-agent/web && npm run build

# 2. Register the OAuth client (writes HERMES_DASHBOARD_OAUTH_CLIENT_ID to ~/.hermes/.env)
hermes dashboard register --name <label>
#   → localhost bind leaves the auth gate off; use --host 0.0.0.0 to require Nous login

# 3. Launch the server (background — never exits)
hermes dashboard --skip-build --no-open --port 9119

# 4. Verify
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:9119/   # → 200
```
Note: `hermes dashboard register` rejects `127.0.0.1`/`localhost` redirect URIs ("Use a real domain") — just omit `--redirect-uri` for localhost-only use.

## doctor --fix reality
`hermes doctor --fix` auto-fixes non-breaking items, then re-scans and may STILL report the same npm vulnerabilities (they require `--force`). **Exit code 0 = the command completed successfully**, not "nothing to fix". Read the final "Found N issue(s)" summary, not just the exit code.

## References
- `references/doctor-output-signatures.md` — what healthy vs. degraded `hermes doctor` output looks like.
