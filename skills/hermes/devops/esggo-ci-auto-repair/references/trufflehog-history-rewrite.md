# TruffleHog history rewrite recipe (esggo)

## Symptom
`Security Scan / Check for secrets in code` fails even after redacting the secret from the
working tree. TruffleHog (`trufflesecurity/trufflehog@main`, `--only-verified`) scans the full
git history on push / workflow_dispatch, so a once-committed verified secret keeps CI red.

## Confirm the source
```
git rev-list --all | while read c; do git grep -l "<PLAINTEXT>" "$c" 2>/dev/null; done | sort -u
```
If it lists historical commits, working-tree redaction is insufficient.

## Rewrite history (preferred tool: git filter-repo)
```
git filter-repo --replace-text <(echo '<PLAINTEXT>==>[REDACTED]')
git push --force-with-lease origin main
```
This rewrites every commit touching the plaintext. CI will pass on the next run.

## DANGER: do NOT use the `sediment` tool
A `.git_filter_repo_script.sh` in the repo pointed at
`https://github.com/francisrstokes/sediment/releases/download/v0.1.0/sediment-linux-amd64`.
Running it interrupted mid-rewrite and renamed `.git` -> `.git.backup.<timestamp>`, leaving the
repo with no `.git` (all git commands: `fatal: not a git repository`).
Recovery: `mv .git.backup.<timestamp> .git` (the backup is a complete git directory).

## Real case (2026-08-06)
`Omni-Sanctuary/Artifacts/keys/secret-vault-index.md` held Telegram Chat ID `8776627849`
(verified as live `TelegramBotToken`). Plaintext persisted from `c428628e` through 8 later
commits. Redacting the file did not fix run 31063541474; `git filter-repo --replace-text` +
force push was required.
