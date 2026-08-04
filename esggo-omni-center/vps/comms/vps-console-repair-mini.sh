#!/bin/bash
set -u
ip a || true
ip route || true
curl -s --max-time 5 http://checkip.amazonaws.com || echo "checkip: unavailable"
ping -c 3 1.1.1.1 || true
ip -brief link show || true
ip -brief addr show || true
hostname -I || true
INTF=$(ip -brief addr show | awk '($1 ~ /^(eth|ens|enp|veth|eno)/){print $1; exit}')
echo "detected_iface=${INTF:-none}"
if [ "${INTF:-}" != "" ]; then ip -4 addr show dev "$INTF" || true; fi
ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
ufw allow 8642/tcp || true
ufw allow 9999/tcp || true
ufw reload || true
ufw status verbose || true
systemctl restart sshd || true
ss -ltnp | grep ':22' || true
journalctl -u sshd -n 50 --no-pager || true
(curl -s --max-time 3 http://127.0.0.1:8642/health || echo "health: unavailable") | sed 's/^/[gateway] /'
(curl -s --max-time 3 http://127.0.0.1:22 || echo "ssh: unavailable") | sed 's/^/[ssh] /'
RELAY_TARGET="${RELAY_TARGET:-http://100.108.241.29:9999}"
(curl -s --max-time 5 "$RELAY_TARGET/status" || echo "relay: unavailable") | sed 's/^/[relay] /'
if [ -f /opt/esggo/vps-agent.sh ]; then echo "[agent] found:/opt/esggo/vps-agent.sh"; else echo "[agent] missing:/opt/esggo/vps-agent.sh"; fi
ps aux | grep -E 'vps-agent|python.*agent|node.*agent' | grep -v grep || true
if ! ss -ltnp | grep -q ':22 '; then echo "[fix] port22_not_listening"; ufw allow 22/tcp || true; ufw reload || true; systemctl restart sshd || true; fi
hostname -I || true
ip -4 -o addr show up primary scope global || true
echo "=== REPAIR_DONE ==="
