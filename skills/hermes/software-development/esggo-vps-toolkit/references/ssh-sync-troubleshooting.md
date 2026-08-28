# SSH Sync Troubleshooting Session (2026-08-05)

## Problem Summary
- **Issue**: SSH connection timeout and permission denied when syncing from new Windows machine to VPS
- **VPS IP**: 161.118.248.180
- **Status**: Connection timeout - VPS port 22 may be blocked

## Root Cause Analysis

### Initial Diagnosis (2026-08-05 morning)
- SSH key file permissions: `esggo_original` had mode `0o100666` (666) - incorrect
- Multiple keys checked: `esggo_original`, `vps_deploy_key`, `esggo_vps_fix`, `id_rsa_esggo`, `id_rsa_esggo_new`
- All keys returned: `git@161.118.248.180: Permission denied (publickey)` or timeout

### SSH Key Restoration Attempts
1. ✅ Backed up and restored `esggo_original` from `~/.ssh/esggo_original.bak.20260804063842`
2. ✅ Set permissions: `chmod 600 ~/.ssh/esggo_original`
3. ✅ Regenerated public key: `ssh-keygen -y -f ~/.ssh/esggo_original > ~/.ssh/esggo_original.pub`
4. ❌ Connection still fails with `permission denied` or timeout

## Resolution Steps (Completed)

### 1. Generate New Deploy Key
```bash
ssh-keygen -t ed25519 -C "vps-deploy@$(hostname)" -f ~/.ssh/vps_deploy_key -N ""
```

### 2. Set GitHub Secrets for Auto-Deploy
- `VPS_SSH_KEY`: [stored in GitHub repo secrets]
- `VPS_HOST`: 161.118.248.180
- `VPS_USER`: ubuntu

### 3. GitHub Actions Workflow Template
```yaml
name: VPS Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SSH Deploy
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/esggo
            git pull origin main
            pm2 reload ecosystem.config.js
```

## Deployment Status (2026-08-05)

| Step | Status |
|------|--------|
| `.eslintignore` commit | ✅ Completed (SHA: ca74e39d) |
| GitHub push | ✅ Completed |
| GitHub Secrets setup | ✅ Completed (VPS_SSH_KEY added) |
| GitHub Actions workflow | ⏳ Waiting for VPS connectivity |
| VPS actual sync | ❌ Blocked - SSH port 22 timeout |

## Alternative Sync Methods (If SSH fails)

1. **Cloudflare Tunnel** - VPS behind tunnel, use `cloudflared`
2. **Direct VPS login** - Manual `cd /opt/esggo && git pull && pm2 reload`
3. **SCP file transfer** - If SSH access available
4. **Resume from backup** - Restore previous working state

## Key Lessons

1. **New machine SSH keys require permission fix**: Always `chmod 600` after transfer
2. **Multiple keys strategy**: Maintain `esggo_original`, `esggo_vps_fix`, and `vps_deploy_key`
3. **Windows Git-Bash path issues**: Use full path `-i ~/.ssh/key` not `$HOME/.ssh/key`
4. **Network blocking**: Port 22 may be blocked, requiring alternative access methods