---
name: vps-push-to-deploy
description: >-
  Set up push-to-deploy from GitHub to VPS for static sites and SPAs.
  Use when user wants Vercel-like auto-deploy to a Linux VPS via GitHub Actions.
  Covers SSH auth, pnpm/Vite build, scp transfer, nginx reload, and secret management.
---

# VPS Push-to-Deploy via GitHub Actions

## Trigger
- User asks for Vercel-like auto-deploy to VPS
- Need to replace manual `scp` + `ssh reload nginx` with CI/CD
- Deploy static site or SPA build artifacts to `/var/www/<site>/`

## Prerequisites
- GitHub repo with source code
- VPS with SSH access and `sudo systemctl reload nginx`
- GitHub Secrets: `VPS_SSH_KEY` (private key), `VPS_HOST` (IP), `VPS_USER` (usually `ubuntu`)
- Node.js + pnpm available locally and in CI

## Workflow Template

Create `.github/workflows/deploy-vps.yml`:
```yaml
name: Deploy to VPS via SCP + reload nginx

on:
  push:
    branches: [master, main]
    paths:
      - '<project-dir>/**'
      - '.github/workflows/deploy-vps.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      VPS_HOST: ${{ secrets.VPS_HOST }}
      VPS_USER: ${{ secrets.VPS_USER }}
      VPS_TARGET: /var/www/<site>

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with: { version: 9 }

      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }

      - run: pnpm install --frozen-lockfile
      - run: pnpm run build

      - name: Deploy to VPS
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -o StrictHostKeyChecking=accept-new ${{ env.VPS_USER }}@${{ env.VPS_HOST }} "sudo mkdir -p ${{ env.VPS_TARGET }} && sudo chown -R ${{ env.VPS_USER }}:${{ env.VPS_USER }} ${{ env.VPS_TARGET }}"
          rsync -az --delete -e "ssh -o StrictHostKeyChecking=accept-new" dist/ ${{ env.VPS_USER }}@${{ env.VPS_HOST }}:${{ env.VPS_TARGET }}/
          ssh ${{ env.VPS_USER }}@${{ env.VPS_HOST }} "sudo systemctl reload nginx && echo 'nginx reloaded'"

      - name: Verify deploy
        run: |
          curl -sS https://<domain>/ | grep -q '<site-indicator>' && echo 'deploy verified' || echo 'verify failed'
```

### Branching/publishing best practice
- Use a feature branch + PR, **not** direct commits to `master`/`main`
- Protect the deployment branch and require PR review before merge
- Name branches with a prefix: `ci/`, `fix/`, `feat/`
- Conventional commits: `ci:`, `fix:`, `feat:`, `chore:`

## SPA-Specific Steps

For SPAs behind Cloudflare, additional steps may be needed:

1. **Inline JS patch** if Rocket Loader cannot be disabled:
   - Patch `import.meta` references in the JS bundle
   - Inline the bundle into `index.html`
   - Escape `</script>` to prevent HTML parser truncation

2. **Replace full `index.html`** after inline patching so duplicate inline blocks do not accumulate:
   ```python
   Path('dist/index.html').write_text(fixed_html)
   ```

3. **nginx config** should include:
   ```
   location / { add_header Cache-Control "no-store" always; }
   ```

## Secrets Setup

Store these in GitHub repo Settings → Secrets and variables → Actions:

| Secret | Value |
|--------|-------|
| `VPS_SSH_KEY` | Contents of private SSH key (multiline) |
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH username (usually `ubuntu`) |

## Common Issues

- **ssh-keyscan fails**: add `-p 22 -H` flags, or use `StrictHostKeyChecking=no`
- **Permission denied**: ensure `VPS_SSH_KEY` is the private key, not public
- **scp not found**: use `apt-get install -y openssh-client` in workflow if needed
- **nginx reload fails**: check sudoers config for passwordless sudo
- **Cloudflare still serves old HTML**: purge cache manually or add API-based purge step
- **GitHub Actions job does not start**: if the run fails immediately with a billing/spending-limit message, this is not a workflow syntax error. On free-tier or newly created accounts, confirm GitHub Actions minutes and that billing/payment method is valid. The workflow itself may be fine; fix billing first, then re-run.
- **Account-level billing lock**: on free-tier/private-repo accounts, Actions may be gated before any job starts. Do not debug workflow YAML; resolve billing/payment method first.

## GitHub SSH Auth Failure but Local SCP Works

**Pitfall**: On Windows with Git-Bash/MSYS, `ssh` to the VPS may return `Permission denied (publickey)` while SCP/rsync from a Windows path still succeeds.

**Workaround**:
- Prefer `rsync -az --delete -e "ssh -o StrictHostKeyChecking=accept-new"` over `ssh` for verification steps.
- Do not gate deployment success on a local `ssh` health check if file transfer already succeeded.
- If a remote command is required, run it through the SCP/rsync path or via a local wrapper that uses the same SSH agent/config as successful SCP.

## SSH Key Permission Issues (Windows Git-Bash)

**Pitfall**: Windows Git-Bash sometimes reports "Permission denied (publickey)" even with correct key contents. Always verify:

1. **Private key mode must be 600**:
   ```bash
   chmod 600 ~/.ssh/esggo_original
   chmod 600 ~/.ssh/vps_deploy_key
   ```

2. **Public key mode must be 644**:
   ```bash
   chmod 644 ~/.ssh/esggo_original.pub
   chmod 644 ~/.ssh/vps_deploy_key.pub
   ```

3. **Use absolute paths** - Avoid tilde expansion issues:
   ```bash
   ssh -i /c/Users/dingj/.ssh/esggo_original git@161.118.248.180
   ```

4. **Restore from backup** if key was corrupted:
   ```bash
   cp ~/.ssh/esggo_original.bak.* ~/.ssh/esggo_original
   chmod 600 ~/.ssh/esggo_original
   ssh-keygen -y -f ~/.ssh/esggo_original > ~/.ssh/esggo_original.pub
   ```

## Verification Methods

When SSH access is unavailable, verify sync status via HTTPS endpoints:

```bash
# Primary health check
curl -sS https://<domain>/api/health

# Detailed component check
curl -sS https://<domain>/api/healthz | python3 -m json.tool

# Raw IP direct check (bypass Cloudflare)
curl -sS -H "Host: esggo.co" http://161.118.248.180/api/health
```

## PM2 Service Management

For ESG GO ecosystem with PM2:

```bash
# Check service status
pm2 status

# View logs
pm2 logs esggo-core --lines 20

# Reload configuration (after sync)
pm2 reload ecosystem.config.js

# Restart specific service
pm2 restart esggo-core
```

## OAuth Token Automation

When user authorizes autonomous automation (as per '2026-08-04' update):

- Agent can now manage GitHub Secrets via `gh secret set`
- Can execute `pm2` commands via SSH when keys are properly configured
- OAuth tokens should be rotated after use due to chat history exposure

## Offline / runnerless fallback: VPS cron deploy

When GitHub Actions is unavailable, use a read-only SSH deploy key + cron on the VPS:

1. On the VPS: generate `ed25519` deploy key, add it as a GitHub Deploy Key (read-only)
2. Clone the repo on the VPS
3. Write `~/deploy-scripts/deploy-<site>.sh` that runs, in order:
   - `git fetch origin && git reset --hard origin/master`
   - `pnpm install --frozen-lockfile && pnpm run build`
   - inline-patch `dist/index.html` if needed for Cloudflare/Rocket Loader
   - replace the full `index.html` to avoid duplicate inline blocks
   - `sudo rsync -az --delete $REPO_DIR/dist/ /var/www/<site>/`
   - `sudo systemctl reload nginx`
4. `chmod +x`, test manually, then add cron

## Vercel-like equivalent

This workflow gives you:
- ✅ Auto-deploy on `git push` to main/master
- ✅ Build verification before deploy
- ✅ Deploy logs visible in GitHub Actions UI
- ✅ Fast rollback via git revert

Limits vs Vercel:
- GitHub Actions: 2,000 min/month (free for public repos)
- Vercel Hobby: 100GB bandwidth, unlimited builds
- Build timeout: 6 hours (GitHub) vs 45 min (Vercel)

## Platform Notes
- Works with Vite, React, Next.js static export, Astro, SvelteKit static
- For Docker builds, add `docker build` + `docker save` + `docker load` steps
- For multi-file sites, use `tar` + `scp` + `tar xf` to preserve directory structure

## FTG Tours Reference
See `references/ftg-tours-vite-spa-deploy-notes.md` for site-specific deployment notes
including the critical Vite entry-script-tag pitfall, CJK brand-character verification, and
CI/CD workflow details.
