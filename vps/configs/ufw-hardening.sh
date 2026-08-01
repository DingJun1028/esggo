#!/usr/bin/env bash
set -euo pipefail

# UFW default deny inbound
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (port 22) from VPN/internal only
ufw allow from 10.0.0.0/8 to any port 22/tcp

# Allow HTTP/HTTPS (public)
ufw allow 80/tcp
ufw allow 443/tcp

# Allow services (internal/VPN only)
ufw allow from 10.0.0.0/8 to any port 3000/tcp
ufw allow from 10.0.0.0/8 to any port 8642/tcp
ufw allow from 10.0.0.0/8 to any port 9090/tcp
ufw allow from 10.0.0.0/8 to any port 9093/tcp
ufw allow from 10.0.0.0/8 to any port 19999/tcp

# Enable firewall
ufw --force enable