set -u
printf '\n=== ESGGO RECOVERY DIAGNOSTICS ===\n\n'
printf '## HOST ##\n'; hostname || true; whoami || true; uname -a || true; uptime || true
printf '\n## IP ##\n'; ip a || true
printf '\n## SSH ##\n'; (ss -ltnp || true) | grep -E ':22|LISTEN' || true; cat /etc/ssh/sshd_config 2>/dev/null | grep -E '^(Port|PasswordAuthentication|PubkeyAuthentication|PermitRootLogin)' || true
printf '\n## FIREWALL ##\n'; (ufw status verbose || true)
printf '\n## SERVICES ##\n'; (systemctl list-units --type=service --state=running || true) | head -60
printf '\n## PM2 ##\n'; (command -v pm2 >/dev/null && pm2 list || true)
printf '\n=== END ===\n'
