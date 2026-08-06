#!/usr/bin/env bash

# Complete ESGGO VPS deployment script
# Deploys the entire OmniJules ecosystem to production VPS

set -euo pipefail

# Configuration
VPS_USER="esggo"
VPS_HOST="esggo.internal"
BACKUP_DIR="/backups/esggo"
LOG_DIR="/var/log/esggo"
APP_DIR="/var/www/esggo"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

function setup_directories() {
    log "Setting up directory structure..."
    
    # Create directories
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"
    mkdir -p "$APP_DIR"
    mkdir -p "$APP_DIR/logs"
    mkdir -p "$APP_DIR/node_modules"
    mkdir -p "$APP_DIR/packages"
    mkdir -p "$APP_DIR/vps"
    mkdir -p "$APP_DIR/scripts"
    
    success "Directory structure created"
}

function install_system_dependencies() {
    log "Installing system dependencies..."
    
    # Install Node.js (if not present)
    if ! command -v node >/dev/null 2>&1; then
        log "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    # Install pnpm
    if ! command -v pnpm >/dev/null 2>&1; then
        log "Installing pnpm..."
        npm install -g pnpm
    fi
    
    # Install PM2
    if ! command -v pm2 >/dev/null 2>&1; then
        log "Installing PM2..."
        npm install -g pm2
    fi
    
    # Install additional dependencies
    apt-get update
    apt-get install -y curl git wget unzip tar nginx certbot python3 python3-pip
    
    success "System dependencies installed"
}

function setup_environment() {
    log "Setting up environment variables..."
    
    # Copy environment files
    if [[ -f ".env.example" ]]; then
        cp .env.example .env
    fi
    
    if [[ -f ".env.production.example" ]]; then
        cp .env.production.example .env.production
    fi
    
    # Generate secure environment variables
    if [[ ! -f ".env/secrets" ]]; then
        log "Generating secure environment variables..."
        openssl rand -base64 32 > .env.secrets
    fi
    
    success "Environment variables configured"
}

function deploy_application() {
    log "Deploying ESGGO application..."
    
    # Install dependencies
    log "Installing application dependencies..."
    pnpm install --frozen-lockfile
    
    # Build application
    log "Building application..."
    pnpm build
    
    # Copy files to application directory
    log "Copying application files..."
    cp -r packages omni-agent src scripts *.json *.md *.config.* "$APP_DIR/"
    cp -r vps/scripts/deploy* "$APP_DIR/scripts/" 2>/dev/null || true
    
    success "Application deployed"
}

function setup_monitoring() {
    log "Setting up monitoring infrastructure..."
    
    # Create nginx configuration
    log "Configuring nginx..."
    cat > /etc/nginx/sites-available/esggo << EOF
server {
    listen 80;
    server_name esggo.internal;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /gateway {
        proxy_pass http://localhost:8642;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location /health {
        access_log off;
        return 200 "healthy\n";
    }
    
    access_log /var/log/nginx/esggo_access.log;
    error_log /var/log/nginx/esggo_error.log;
}
EOF
    
    # Enable nginx site
    ln -sf /etc/nginx/sites-available/esggo /etc/nginx/sites-enabled/
    nginx -t && systemctl restart nginx
    
    # Setup log rotation
    cat > /etc/logrotate.d/esggo << EOF
/var/log/nginx/esggo*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}

/var/log/pm2/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF
    
    success "Monitoring infrastructure configured"
}

function setup_ssl() {
    log "Setting up SSL certificate..."
    
    # Only attempt SSL setup if certbot is available
    if command -v certbot >/dev/null 2>&1; then
        # Create a symlink for easier certificate management
        ln -sf /etc/nginx/sites-available/esggo /etc/nginx/sites-enabled/esggo
        
        # Test SSL configuration
        certbot --nginx -d esggo.internal --non-interactive --agree-tos
        
        # Restart nginx with SSL
        systemctl restart nginx
        
        success "SSL certificate installed"
    else
        warn "certbot not available - skipping SSL setup"
    fi
}

function start_services() {
    log "Starting application services..."
    
    # Start Next.js application via PM2
    if [[ -f "$APP_DIR/package.json" ]]; then
        cd "$APP_DIR"
        
        # Start the application with PM2
        pm2 start ecosystem.config.cjs --name esggo
        pm2 save
        pm2 startup
        
        # Configure PM2 log rotation
        pm2 install pm2-logrotate
        pm2-logrotate:config set --logDateFormat "YYYY-MM-DD"
        pm2-logrotate:config set --max-size "100M"
        pm2-logrotate:enable
    fi
    
    # Start OmniJules agent server
    if [[ -f "$APP_DIR/vps/omni-server.mjs" ]]; then
        log "Starting OmniJules agent server..."
        node "$APP_DIR/vps/omni-server.mjs" &
    fi
    
    success "Application services started"
}

function setup_backups() {
    log "Setting up automated backups..."
    
    # Create backup script
    cat > "$APP_DIR/scripts/backup.sh" << 'EOF'
#!/bin/bash

BACKUP_DIR="/backups/esggo"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/esggo"

mkdir -p "$BACKUP_DIR"

# Backup application code
cp -r "$APP_DIR/esggo" "$BACKUP_DIR/esggo_code_$DATE.tar.gz"

# Backup database (if exists)
if [[ -f "$APP_DIR/projects.db" ]]; then
    cp "$APP_DIR/projects.db" "$BACKUP_DIR/projects_db_$DATE" 2>/dev/null || true
fi

# Clean up old backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*_db_*" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x "$APP_DIR/scripts/backup.sh"
    
    # Add to cron (every 4 hours)
    (crontab -l 2>/dev/null | grep -v "backup.sh"; echo "0 */4 * * * $APP_DIR/scripts/backup.sh") | crontab -
    
    success "Backup system configured"
}

function verify_deployment() {
    log "Verifying deployment..."
    
    # Check if application is running
    if systemctl is-active --quiet nginx; then
        success "Nginx is running"
    else
        error "Nginx is not running"
        return 1
    fi
    
    # Check if Node.js app is running
    if pm2 list | grep -q "esggo"; then
        success "Node.js application is running"
    else
        warn "Node.js application may not be running"
    fi
    
    # Check OmniJules agent
    if ps aux | grep -v grep | grep -q "omni-server.mjs"; then
        success "OmniJules agent is running"
    else
        warn "OmniJules agent may not be running"
    fi
    
    # Check system health
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        success "Application responds correctly"
    else
        error "Application is not responding correctly"
    fi
    
    success "Deployment verification complete"
}

function show_summary() {
    echo ""
    log "=" * 70
    log "🎯 ESGGO VPS Deployment Summary"
    log "=" * 70
    log ""
    log "📁 Application Directory: $APP_DIR"
    log "📋 Backup Directory: $BACKUP_DIR"
    log "📝 Log Directory: $LOG_DIR"
    log ""
    log "🔧 Services Running:"
    log "   • Nginx: $(systemctl is-active nginx)"
    log "   • Node.js App: $(pm2 list | grep 'esggo' | wc -l | tr -d ' ' || echo 'Not found')"
    log "   • OmniJules Agent: $(ps aux | grep 'omni-server.mjs' | grep -v grep | wc -l | tr -d ' ' || echo 'Not found')"
    log ""
    log "🌐 Access URLs:"
    log "   • Application: http://esggo.internal:3000"
    log "   • Gateway: http://esggo.internal:8642/gateway"
    log "   • Health Check: http://esggo.internal/health"
    log ""
    log "📊 Monitoring:"
    log "   • Logs: tail -f $LOG_DIR/*.log"
    log "   • PM2: pm2 monit"
    log "   • Nginx: systemctl status nginx"
    log ""
    log "🔄 Scheduled Tasks:"
    log "   • Backups: Every 4 hours"
    log "   • Log rotation: Daily"
    log ""
    log "⚡ Quick Commands:"
    log "   • Restart App: pm2 restart esggo"
    log "   • View Logs: pm2 logs esggo"
    log "   • Start OmniJules: node $APP_DIR/vps/omni-server.mjs"
    log ""
    success "Deployment completed successfully! 🎉"
    log "=" * 70
}

# Main execution
function main() {
    echo "🚀 Starting ESGGO VPS deployment..."
    echo ""
    
    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
       error "This script must be run as root"
       exit 1
    fi
    
    # Run deployment steps
    setup_directories
    install_system_dependencies
    setup_environment
    deploy_application
    setup_monitoring
    setup_ssl
    start_services
    setup_backups
    verify_deployment
    
    # Show summary
    show_summary
}

# Execute main function
main
