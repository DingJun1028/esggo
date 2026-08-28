# Case: esggo Security Scan failure from git history (2026-08-06)

## Symptom
`ESG-GO CI/CD Pipeline` run `31063541474` → `Security Scan` job = failure. Other jobs (Code Quality,
Validate VPS Scripts, Docker Build Test) = success/skipped.

## Root cause (NOT what the job name implies)
The `Security Scan` job has TWO sub-steps. Trivy (vuln scan) PASSED after the pnpm overrides fix.
The failure was the **TruffleHog** sub-step:
```
##[warning]Found verified TelegramBotToken result
##[warning]Found verified GitHubOauth2 result
... finished scanning ... verified_secrets: 2, unverified_secrets: 0
```

## Where the secret was
`Omni-Sanctuary/Artifacts/keys/secret-vault-index.md`, committed in `c428628e`
("feat: add secret vault index + Telegram tracker secrets + gitignore protection").
It contained the bare Telegram chat/bot ID `8776627849` (twice: "Bot Client ID" and "Chat ID").
No full `:token` — but TruffleHog verified the bot ID and flagged it.

## Why working-tree redaction didn't fix CI
TruffleHog scans all git objects. Even after patching the file in the working tree
(`8776627849` → `[REDACTED]`), `git log --all -S "8776627849"` still matched `c428628e`, and
`git grep "8776627849" $(git rev-list --all)` returned old-blob matches. CI re-runs kept failing.

## Resolution path (offered to user, not yet executed)
Option A: `git filter-repo --replace-text` mapping `8776627849==>[REDACTED]`, then
`git push --force-with-lease` (rewrites ~12 SHAs from `c428628e..HEAD`).
Option B: add `additional_args: --exclude-paths` to the trufflehog step in `.github/workflows/deploy.yml`.
User had not chosen A/B/C at session end — CI remains red pending that decision.

## Lesson
A "secret vault index" doc that says "不含明文 Token" is NOT safe if it embeds the chat/bot ID.
Treat any Telegram/Slack/GitHub bot or client ID as a secret. Keep them out of committed files
entirely, or only reference GitHub Secrets by NAME.
