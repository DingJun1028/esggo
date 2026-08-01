#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# deploy-unified.sh — Unified Deployment Script
# Uses @esggo/shared/config for consistent configuration
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
success() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; exit 1; }

# ── Configuration ──
VPS_IP="${VPS_IP:-161.118.248.180}"
VPS_USER="${VPS_USER:-root}"
DEPLOY_DIR="/opt/esggo"
COMPOSE_FILE="vps/docker-compose.yml"

# ── Pre-flight Checks ──
log "Pre-flight checks..."

if ! command -v ssh &> /dev/null; then
    error "SSH not found"
fi

if ! command -v docker &> /dev/null; then
    error "Docker not found"
fi

if ! command -v git &> /dev/null; then
    error "Git not found"
fi

success "Pre-flight checks passed"

# ── Step 1: Build Locally ──
log "Building locally..."
npm run build || error "Build failed"
success "Build complete"

# ── Step 2: Commit Changes ──
log "Committing changes..."
git add -A
git commit -m "deploy: unified integration $(date +'%Y-%m-%d %H:%M:%S')" || warn "Nothing to commit"
success "Changes committed"

# ── Step 3: Push to GitHub ──
log "Pushing to GitHub..."
git push origin main || error "Push failed"
success "Pushed to GitHub"

# ── Step 4: Deploy to VPS ──
log "Deploying to VPS ($VPS_IP)..."

# Create deployment script
cat > /tmp/deploy-vps.sh << 'EOF'
#!/bin/bash
set -euo pipefail

echo "Pulling latest changes..."
cd /opt/esggo
git pull origin main

echo "Building Docker images..."
docker-compose -f vps/docker-compose.yml build --no-cache

echo "Restarting services..."
docker-compose -f vps/docker-compose.yml down
docker-compose -f vps/docker-compose.yml up -d

echo "Waiting for services to be healthy..."
sleep 10

echo "Running health checks..."
curl -sf http://127.0.0.1:3000/api/healthz > /dev/null && echo "✓ ESGGO healthy" || echo "✗ ESGGO unhealthy"
curl -sf http://127.0.0.1:8642/status > /dev/null && echo "✓ Gateway healthy" || echo "✗ Gateway unhealthy"
curl -sf http://127.0.0.1:6379 > /dev/null 2>&1 && echo "✓ Redis healthy" || echo "✗ Redis unhealthy"

echo "Deployment complete!"
EOF

scp /tmp/deploy-vps.sh ${VPS_USER}@${VPS_IP}:/tmp/deploy-vps.sh
ssh ${VPS_USER}@${VPS_IP} "chmod +x /tmp/deploy-vps.sh && /tmp/deploy-vps.sh"

success "Deployment complete!"

# ── Step 5: Verify ──
log "Verifying deployment..."

check_endpoint() {
    local url=$1
    local name=$2
    
    if curl -sf "$url" > /dev/null 2>&1; then
        success "$name is healthy"
    else
        warn "$name is unreachable"
    fi
}

check_endpoint "https://esggo.co" "esggo.co"
check_endpoint "https://esggo.co/api/healthz" "ESGGO Health"
check_endpoint "https://ftg.esggo.co" "ftg.esggo.co"
check_endpoint "https://omniagent.esggo.co" "omniagent.esggo.co"
check_endpoint "https://aistation.esggo.co" "aistation.esggo.co"

log "Deployment verification complete!"
