#!/bin/bash
# VPS Security Hardening — UFW + Fail2Ban + SSH Keys
# Run as root or sudo

set -euo pipefail

echo "=== ESGGO VPS Security Hardening ==="

# 1. UFW basic rules
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "UFW configured: 22,80,443 allowed"

# 2. Fail2Ban (SSH brute-force protection)
apt-get update -qq
apt-get install -y fail2ban
cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 24h
EOF
systemctl enable --now fail2ban

echo "Fail2Ban configured"

# 3. SSH hardening (key-only login)
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd

echo "SSH hardened (key-only, no root login)"

echo "=== Security hardening complete ==="