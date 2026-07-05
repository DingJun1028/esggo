#!/usr/bin/env bash
set -euo pipefail

# UFW default deny inbound
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (port 2222 after change)
ufw allow 2222/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow services
ufw allow 3000/tcp
ufw allow 8642/tcp
ufw allow 9090/tcp
ufw allow 9093/tcp
ufw allow 19999/tcp

# Enable firewall
ufw --force enable