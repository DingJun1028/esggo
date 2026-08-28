# Push to GitHub when SSH is denied AND `gh auth setup-git` push fails

Surfaced while building a local video pipeline and needing to push to a fresh repo on
a machine where no SSH key is registered with GitHub.

## Symptom
- `git remote add origin git@github.com:...` then `git push` → `Permission denied (publickey)`
- Switch remote to HTTPS, run `gh auth setup-git`, `git push` →
  `Authentication failed` / `remote: Repository not found`

## Recovery (verified working)

```bash
# 1) repo already created on GitHub (gh repo create ... --private)
gh repo create youtube-automation-pipeline --private --description "..." 

# 2) grab the live token gh is using — never paste a token into chat or config
TOKEN=$(gh auth token)

# 3) temporarily embed as x-access-token in the remote URL
git remote set-url origin "https://x-access-token:${TOKEN}@github.com/<owner>/<repo>.git"
git branch -M main
git push -u origin main

# 4) CRITICAL: reset remote to plain HTTPS so the token does NOT persist in .git/config
git remote set-url origin "https://github.com/<owner>/<repo>.git"
```

## Why this matters for this user
The user shares one GitHub account/token across two machines and delegates secret
management to the agent. Leaving a token inside `.git/config` (remote.origin.url) is a
leak vector — always run step 4. `gh` re-injects the token per command after reset, so
normal `git push` continues to work without a stored credential.

## Note on `gh auth setup-git`
It configures a git credential helper, but on this Windows/msys setup it did NOT satisfy
the push auth on its own — the explicit `x-access-token` URL was required. Treat
`gh auth setup-git` as a first try, this token-URL dance as the reliable fallback.
