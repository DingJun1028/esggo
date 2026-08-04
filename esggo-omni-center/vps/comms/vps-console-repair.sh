#!/usr/bin/env bash
set -euo pipefail

echo '=== OCI Serial Console Repair Script ==='
echo 'Run as root in Serial Console or from agent run command after sudoers fix.'

echo '--- disk ---'
lsblk
blkid

echo '--- remount root rw ---'
mount -o remount,rw /

echo '--- fsck all in fstab ---'
fsck -y -A || true

echo '--- fstab ---'
cat /etc/fstab | grep -vE '^\s*(#|$)' || true

echo '--- network ---'
ip a || true
systemctl status systemd-networkd || true

echo '--- sudoers ---'
if [ -f /etc/sudoers.d/101-oracle-cloud-agent-run-command ]; then
  cat /etc/sudoers.d/101-oracle-cloud-agent-run-command
else
  echo 'missing /etc/sudoers.d/101-oracle-cloud-agent-run-command'
fi

echo '--- oracle-cloud-agent ---'
systemctl status oracle-cloud-agent || true

echo '--- pm2 ---'
sudo -n pm2 list || true

echo '--- nginx ---'
sudo -n nginx -t || true

echo '--- esggo app port ---'
sudo -n ss -ltnp | grep ':3000' || true

echo '--- disk usage ---'
df -h /
df -h /boot || true

echo '--- repair complete ==='
