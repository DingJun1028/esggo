---
name: github-actions-vps-ssh-deploy
description: Wire and verify a GitHub Actions SSH deploy key to a VPS.
---

# GitHub Actions → VPS SSH Deploy Key (lifecycle + verification)

Class-level workflow for making a CI pipeline actually log into a VPS over SSH. The
common failure mode is "I pasted the public key onto the server but CI still times out"
— that is almost always one of: (a) the `VPS_SSH_KEY` secret holds a *different* private
key than the one whose public half was installed, (b) the host key isn't pinned so the
runner hangs on the first-connection prompt, or (c) the key wasn't hardened/permissioned
and sshd refuses it.

## When to use
- Setting up a new repo's SSH deploy (appleboy/ssh-action, webfactory, or raw ssh in a step).
- A deploy job fails with `Permission denied (publickey)` or a silent 60m timeout.
- You just appended a key to `authorized_keys` and want to prove CI can use it.

## Steps (in order)
1. **Pick the server user.** Prefer a non-root sudo user (`ubuntu`). Confirm reachability:
   `ssh -o BatchMode=yes -o ConnectTimeout=8 <user>@<host> 'whoami'`.
2. **Key pair.** Use or generate an ed25519 pair. Keep the private half only in the repo
   secret (never commit it). Local private key file (e.g. `~/.ssh/ci_deploy_key`) is fine
   for verification.
3. **Install public key, hardened + idempotent.** On the server:
   ```bash
   KEY="ssh-ed25519 AAAA... comment"
   PREFIX="restrict,no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty,no-user-rc "
   mkdir -p ~/.ssh && chmod 700 ~/.ssh
   grep -qF "${KEY#* }" ~/.ssh/authorized_keys 2>/dev/null || echo "$PREFIX$KEY" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```
   The `restrict` prefix stops the CI key from being abused as a jump host / port forwarder.
4. **Capture the host key (MITM protection).** From your machine:
   `ssh-keyscan -t ed25519 -p 22 <host>` → store the line as secret `VPS_HOST_KEY`.
   (Also capture ecdsa as fallback if you like.)
5. **Align repo secrets with the workflow's expected names.** At minimum:
   `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (the *private* key content), `VPS_HOST_KEY`.
   Set via `gh secret set NAME < file` (reads stdin, keeps the key out of shell history).
   **CRITICAL:** `VPS_SSH_KEY` must be the private half of the public key you installed in
   step 3. Verify pairing: `diff <(cat local_key.pub) <(ssh user@host 'grep comment ~/.ssh/authorized_keys')`
   — the base64 blob must match (ignore the `restrict...` prefix on the server side).
6. **Pin the host key inside the workflow**, BEFORE the ssh step, so `StrictHostKeyChecking`
   doesn't block on a prompt the runner can't answer:
   ```yaml
   - name: Pin VPS host key (MITM protection)
     run: |
       mkdir -p ~/.ssh
       echo "${{ secrets.VPS_HOST_KEY }}" >> ~/.ssh/known_hosts
       chmod 600 ~/.ssh/known_hosts
   ```
   Minimal, non-destructive: add only this step; keep the existing deploy logic
   (docker compose / nginx reload) untouched.
7. **Verify end-to-end by simulating the runner** (the real proof, not "file written"):
   ```bash
   TMPKH=$(mktemp); echo "$HOSTKEY_LINE" > "$TMPKH"
   ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=yes \
       -o UserKnownHostsFile="$TMPKH" -i ~/.ssh/ci_deploy_key \
       ubuntu@<host> 'cd <deploy_dir> && git rev-parse --abbrev-ref HEAD && command -v docker && sudo -n nginx -t'
   rm -f "$TMPKH"
   ```
   Green lights = login OK, deploy dir reachable, tooling present, sudo reload permitted.
8. **Commit / push safely.** If `git push` is rejected (non-fast-forward because another
   device/CI pushed), stash unrelated working-tree changes first, rebase, then pop:
   `git stash push -m wip; git rebase origin/main; git stash pop; git push origin main`.
   Never `git push --force` on a shared main.

## Pitfalls
- **Secret misalignment** (step 5) is the #1 cause of silent CI timeouts. The private key
  in `VPS_SSH_KEY` MUST pair with the public key installed on the server. Other local
  private keys whose public halves are NOT on the server will never log in.
- **Host key not pinned** → CI hangs on first connection. Always do step 6.
- **MSYS git path bug (Windows git-bash):** `git -C /c/Project/repo` can report
  `fatal: not a git repository` even though `.git` exists; use the native Windows path
  `C:\Project\repo` instead. Same for `python3` reading files — pass `r'C:\...'` and open
  with `encoding='utf-8-sig'`.
- **read_file mis-flags valid UTF-8 YAML as binary** (seen with BOM / certain bytes).
  Fall back to terminal `cat -v` / `sed` / `awk` to read or edit; verify YAML with python
  (`yaml.safe_load(io.open(path, encoding='utf-8-sig'))`). Do NOT loop on read_file 3×.
- **Don't blindly overwrite a production workflow.** Add minimal steps; preserve existing
  deploy logic. Back up the file (`cp ... .bak.$(date +%Y%m%d%H%M%S)`) before editing.
- **rebase with uncommitted changes** → `git stash` first or the rebase aborts/conflicts.

## Verification checklist (report honestly)
- [ ] Public key installed on server (hardened prefix present)
- [ ] `VPS_SSH_KEY` private pairs with installed public (diff confirms)
- [ ] `VPS_HOST_KEY` secret set; workflow writes it to runner known_hosts
- [ ] Simulated CI login (step 7) returns green on every check
- [ ] Commit pushed; remote `main` shows the new commit

See `references/verification-recipe.md` for the exact command transcript pattern and the
MSYS / read_file workarounds condensed.
