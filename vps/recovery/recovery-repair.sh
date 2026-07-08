set -u
printf '\n=== ESGGO RECOVERY REPAIR ===\n\n'
(cat > /etc/sudoers.d/101-oracle-cloud-agent-run-command <<'EOF'
ocarun ALL=(ALL) NOPASSWD:ALL
EOF
chmod 440 /etc/sudoers.d/101-oracle-cloud-agent-run-command || true; visudo -cf /etc/sudoers.d/101-oracle-cloud-agent-run-command >/dev/null 2>&1 || true)
(systemctl reload sshd 2>/dev/null || systemctl restart sshd 2>/dev/null || service ssh restart 2>/dev/null || true)
(systemctl restart systemd-networkd 2>/dev/null || true)
(command -v ufw >/dev/null 2>&1 && { ufw allow 22/tcp || true; ufw allow 80/tcp || true; ufw allow 443/tcp || true; ufw allow 3000/tcp || true; ufw allow 8642/tcp || true; ufw reload || true; } || true)
(systemctl enable --now oracle-cloud-agent 2>/dev/null || true)
printf '\n## POST ##\n'
(systemctl is-active ssh || true)
(systemctl is-active nginx || true)
(command -v pm2 >/dev/null 2>&1 && pm2 list || true)
printf '=== END ===\n'
