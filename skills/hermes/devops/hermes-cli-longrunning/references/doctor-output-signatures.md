# hermes doctor — output signatures

## Healthy run (exit 0, ~50–130s)
Final summary looks like:
```
────────────────────────────────────────────────────────────
  Found 3 issue(s) to address:

  1. web workspace has 3 npm vulnerabilities
  2. ui-tui workspace has 1 npm vulnerability
  3. Run 'hermes setup' to configure missing API keys for full tool access
```
Auth Providers section:
```
◆ Auth Providers
  ✓ Nous Portal auth (logged in)
  ⚠ OpenAI Codex auth (not logged in)
  ⚠ MiniMax OAuth (not logged in)
  ⚠ xAI OAuth (not logged in)
```
API Connectivity (instant if OPENROUTER_API_KEY unset):
```
◆ API Connectivity
  Running 31 connectivity checks in parallel…
  ⚠ OpenRouter API (not configured)
```

## What is NOT a failure
- `exit 124` from a *foreground* `terminal()` call = the command was still running when the timeout hit. It did not fail. Relaunch in background and `process(action='wait')`.
- `⚠ OpenRouter API (not configured)` = expected when no OPENROUTER_API_KEY in .env.
- `⚠ <tool> (system dependency not met)` / `(missing X_TOKEN)` = optional integrations, not blocking.

## npm vulnerability counts (as of this session)
- web workspace: 3 high (undici, build-time, pinned by electron/node-gyp)
- ui-tui workspace: 1 high
- agent-browser: 2
- All build-time advisories; `npm audit fix` (non-breaking) does NOT clear them. `--force` risks the dashboard build.
