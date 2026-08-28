---
name: ci-secret-scan-history
description: Fix TruffleHog CI secret-scan failures from git history.
---

# CI Secret-Scan Failures (TruffleHog scans GIT HISTORY)

## When to use
- A `Security Scan` / secret-scan CI job fails with "Found verified ... result" even though you just
  redacted the secret from the working tree.
- `gh run view <id> --log-failed` shows `trufflesecurity/trufflehog` with `Found verified TelegramBotToken`
  / `Found verified GitHubOauth2` / etc., and `verified_secrets: N`.
- You grepped the working tree, found nothing, but CI still fails on every run.

## ⚠️ KEY FACT — TruffleHog scans the whole repo incl. `.git` history
The GitHub TruffleHog action (`trufflesecurity/trufflehog@main`, `--only-verified`) checks out the
repo and scans **all git objects**, not just the working tree. Redacting `secret-vault-index.md` in
the current commit does NOT help — the plaintext is still in an earlier commit's blob (e.g.
`c428628e`), and `workflow_dispatch` / push triggers scan full history. That is why CI stays red.

## Diagnosis
1. Re-run the failing run, then: `gh run view <id> --log 2>&1 | grep -iE "Found verified|verified_secrets"`.
2. Find WHERE the secret lives: `git log --all -S "<unique-secret-substring>" --oneline`
   (e.g. `git log --all -S "8776627849"` → shows the committing SHA that introduced it).
3. Confirm it's in history, not just working tree: `git grep "<substring>" $(git rev-list --all | head -50)`
   will show `commitsha:path:line` matches from old blobs.

## Fix options (pick one)
- **A. Rewrite history (thorough, force push).** Use `git filter-repo --replace-text <map.txt>`
  where `map.txt` is `<plaintext>==>[REDACTED]` per line. Then `git push --force-with-lease`.
  This rewrites every SHA after the offending commit (here ~12 commits). Repo is personal/solo so
  force push is acceptable. CI will then pass because the blob no longer exists.
- **B. Exclude path in the action (no history rewrite).** In the workflow YAML, add to the
  trufflehog step: `additional_args: --exclude-paths .trufflehog-exclude.txt` (or `extra_args`) and
  list `Omni-Sanctuary/Artifacts/keys/**` etc. CI skips scanning those paths. History still裸奔
  (secret retrievable from `git cat-file` on old blobs) — only use B if you cannot force-push or
  the secret is already revoked/rotated.
- **C. Revoke + rotate first.** If the secret is still live (a real Telegram bot token / GitHub
  OAuth), `--revoke` it BEFORE relying on A or B, since old blobs remain decryptable until GC.

## Pitfalls
- **Do NOT assume the failure is Trivy / dependency.** In the 2026-08-06 esggo run, the `Security
  Scan` job failed on TruffleHog (verified secret in history), NOT on the Trivy vuln scan. The two
  share a job name. Always read `--log-failed` / `--log` to see WHICH sub-step failed.
- **Chat ID alone can be "verified".** TruffleHog flagged `8776627849` (a Telegram chat/bot ID, no
  full `:token`) as a verified `TelegramBotToken` because the bot ID is checkable. Treat any bot/client
  ID as a secret — redact it, don't leave it in docs.
- **`secret-vault-index.md` "no plaintext token" claim is insufficient.** Even a bare chat ID triggers
  the scan. If a doc says "本索引檔不含任何明文 Token" but contains the chat ID, TruffleHog still fires.
- Working-tree `git grep` returning clean does NOT mean CI passes — history still has it.

## References
See `references/esggo-telegram-secret-case.md` for the 2026-08-06 esggo run: Telegram chat ID in
`Omni-Sanctuary/Artifacts/keys/secret-vault-index.md` (commit `c428628e`) caused `Security Scan`
failure on every run until history was addressed.
