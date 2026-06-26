#!/usr/bin/env bash
# ==============================================================================
# ESGGO Nginx Automated Setup Script
# Run this on the VPS to automatically apply the Nginx configuration
# Usage: sudo ./setup-nginx.sh
# ==============================================================================

set -Eeuo pipefail

log() {
  echo "==> [Nginx Setup] $1"
}

# Ensure script is run as root
if [ "$(id -u)" -ne 0 ]; then
  log "Error: This script must be run as root or with sudo."
  exit 1
fi

NGINX_CONF_SOURCE="nginx-esggo.conf"
NGINX_CONF_DEST="/etc/nginx/sites-available/esggo"
NGINX_CONF_LINK="/etc/nginx/sites-enabled/esggo"

# 1. Install Nginx if not present
if ! command -v nginx >/dev/null 2>&1; then
  log "Installing Nginx..."
  apt-get update
  apt-get install -y nginx
fi

# 2. Copy configuration
if [ -f "${NGINX_CONF_SOURCE}" ]; then
  log "Copying Nginx configuration to ${NGINX_CONF_DEST}..."
  cp "${NGINX_CONF_SOURCE}" "${NGINX_CONF_DEST}"
elif [ -f "vps/${NGINX_CONF_SOURCE}" ]; then
  log "Copying Nginx configuration from vps/${NGINX_CONF_SOURCE} to ${NGINX_CONF_DEST}..."
  cp "vps/${NGINX_CONF_SOURCE}" "${NGINX_CONF_DEST}"
else
  log "Error: ${NGINX_CONF_SOURCE} not found in current directory or vps/ directory."
  exit 1
fi

# 3. Enable configuration via symbolic link
if [ ! -L "${NGINX_CONF_LINK}" ]; then
  log "Creating symbolic link to enable site..."
  ln -s "${NGINX_CONF_DEST}" "${NGINX_CONF_LINK}"
else
  log "Symbolic link already exists at ${NGINX_CONF_LINK}"
fi

# 4. Remove default Nginx site to prevent conflicts
if [ -f "/etc/nginx/sites-enabled/default" ]; then
  log "Removing default Nginx site configuration link..."
  rm "/etc/nginx/sites-enabled/default"
fi

# 5. Test configuration
log "Testing Nginx configuration syntax..."
if nginx -t; then
  log "Syntax check passed. Reloading Nginx service..."
  systemctl reload nginx
  log "SUCCESS: Nginx has been successfully configured and reloaded."
  log "Next.js (Port 3000) & OmniAgent Gateway (Port 8642) are now proxied on Port 80!"
else
  log "ERROR: Nginx syntax check failed. Please review the configuration."
  exit 1
fi
