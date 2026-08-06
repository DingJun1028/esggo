# Deployment helper for VPS Agent v2.
# Target host: root@161.118.248.180
# Use this AFTER restoring SSH/Browser-console access.

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$VPS_IP = '161.118.248.180'
$LOCAL_ROOT = 'C:\var\www\esggo\vps'
$REMOTE_DIR = '/root/vps'

# 1) Copy config snippet
scp -o StrictHostKeyChecking=no "$LOCAL_ROOT\deploy-vps-agent-v2.ps1" "root@${VPS_IP}:${REMOTE_DIR}/" 2>$null

# 2) Placeholder
Write-Host "Deploy script prepared. Restore SSH port 22 first."
