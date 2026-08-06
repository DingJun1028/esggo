#!/usr/bin/env bash
set -u
echo "=== STEP 1 ==="
ip a || true; ip route || true; curl -s --max-time 5 http://checkip.amazonaws.com || echo "checkip: unavailable"; ping -c 3 1.1.1.1 || true
echo "=== STEP 2 ==="
ip -brief link show || true; ip -brief addr show || true; hostname -I || true
echo "=== STEP 3 iface ==="
INTF=$(ip -brief addr show | awk '($1 ~ /^(eth|ens|enp|veth|eno)/){print $1; exit}')
echo "detected_iface=${INTF:-none}"
[ "${INTF:-}" != "" ] && ip -4 addr show dev "$INTF" || true
echo "=== STEP 4 firewall ==="
ufw allow 22/tcp || true; ufw allow 80/tcp || true; ufw allow 443/tcp || true; ufw allow 8642/tcp || true; ufw allow 9999/tcp || true; ufw reload || true; ufw status verbose || true
echo "=== STEP 5 sshd ==="
systemctl restart sshd || true; ss -ltnp | grep ':22' || true; journalctl -u sshd -n 50 --no-pager || true
echo "=== STEP 6 local services ==="
(curl -s --max-time 3 http://127.0.0.1:8642/health || echo "health: unavailable") | sed 's/^/[gateway] /'
(ss -ltnp | grep ':22' >/dev/null 2>&1 && echo "ssh: listening" || echo "ssh: not listening") | sed 's/^/[ssh] /'
echo "=== STEP 7 relay probe ==="
(curl -s --max-time 5 "http://100.108.241.29:9999/status" || echo "relay: unavailable") | sed 's/^/[relay] /'
echo "=== STEP 8 agent ==="
[ -f /opt/esggo/vps-agent.sh ] && echo "[agent] found:/opt/esggo/vps-agent.sh" || echo "[agent] missing:/opt/esggo/vps-agent.sh"
ps aux | grep -E 'vps-agent|python.*agent|node.*agent' | grep -v grep || true
echo "=== STEP 9 auto fix ==="
if ! ss -ltnp | grep -q ':22 '; then echo "[fix] port22_not_listening"; ufw allow 22/tcp || true; ufw reload || true; systemctl restart sshd || true; fi
echo "=== STEP 10 ip ==="
hostname -I || true; ip -4 -o addr show up primary scope global || true
echo "=== REPAIR_DONE ==="
