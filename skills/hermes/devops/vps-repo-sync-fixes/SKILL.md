---
name: vps-repo-sync-fixes
description: Fix VPS git permission errors and bootstrap deploy keys.
tags: [devops, vps, git, ssh, deploy-key, pm2]
triggers:
  - vps git pull fails permission denied
  - insufficient permission .git/objects
  - deploy key add github
  - git reset --hard origin/main on vps
  - sync /opt/esggo or similar vps repo
---

# VPS Repo Sync Fixes

## Pattern A — `git pull` / `git reset --hard` fails with permission errors

Symptom on VPS:
```
insufficient permission for adding an object to repository database .git/objects
error: unable to create file components/views/...: Permission denied
cannot create directory at 'data/prisma'
```
Root cause: `.git/objects` may be 775/ubuntu, but **some nested subdirs were written by root** (e.g. a prior `sudo docker` or `sudo git` run), so the unprivileged deploy user cannot write.

Fix (one shot, via the already-working ssh key + sudo):
```bash
ssh -i ~/.ssh/<working_key> <user>@<vps> \
  'sudo chown -R <user>:<user> /opt/<repo> && cd /opt/<repo> && git reset --hard origin/main'
# if untracked local files block the reset:
ssh -i ~/.ssh/<working_key> <user>@<vps> \
  'cd /opt/<repo> && git clean -fdq apps/omni-blueprint-hub app/api/auth src/lib'
```
Do NOT `git clean -fd` the whole tree blindly — scope it to the conflicting dirs. After chown, a normal `git pull` works.

## Pattern B — Deploy Key bootstrap (when user pastes a pubkey + authorizes CLI/API)

User may paste a public key and say "authorize all via CLI/API". Do it inline, never store secrets in files/git.

1. Add pubkey to GitHub Deploy Keys (read file, don't echo value):
   ```bash
   PUB=$(cat ~/.ssh/vps_deploy_key.pub)
   gh api -X POST repos/<owner>/<repo>/keys -f title="vps-deploy-<name>" -f key="$PUB"
   # expect: {"verified":true,...}
   ```
2. Ship the PRIVATE key to VPS over the already-working channel:
   ```bash
   scp -i ~/.ssh/<working_key> ~/.ssh/vps_deploy_key <user>@<vps>:~/.ssh/
   ssh -i ~/.ssh/<working_key> <user>@<vps> 'chmod 600 ~/.ssh/vps_deploy_key'
   ```
3. Pull on VPS using that key (GitHub verifies against the Deploy Key):
   ```bash
   ssh -i ~/.ssh/<working_key> <user>@<vps> \
     'cd /opt/<repo> && GIT_SSH_COMMAND="ssh -i ~/.ssh/vps_deploy_key -o StrictHostKeyChecking=no" git pull origin main'
   ```

## Pattern C — User pastes plaintext credentials + "use CLI/API"

Treat as unrestricted authorization to run the CLI/API calls directly (gh api, curl, scp). Rules:
- Use the value only for the immediate call; never write it to a file or commit it.
- `curl -H "Authorization: Bearer <token>"` for verify is fine inline.
- After the session, recommend the user rotate any token that sat in chat history.

## Verify before claiming success
- `gh api` add key → assert `verified:true` in response.
- `git pull` → assert `HEAD` equals expected remote SHA (`git rev-parse HEAD` on VPS).
- `pm2 reload ecosystem.config.js` → `pm2 list` shows target apps `online`.
