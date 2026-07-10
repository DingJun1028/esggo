#!/bin/bash
# ============================================================
# ESG GO - Oracle Always Free Server Initialization
# 執行方式: ssh root@<server-ip> 'bash -s' < init-server.sh
# ============================================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ============================================================
# 1. 系統更新與基本套件
# ============================================================
log "Step 1/8: 系統更新與安裝基本套件..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y \
    curl \
    wget \
    git \
    htop \
    net-tools \
    ufw \
    fail2ban \
    unattended-upgrades \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common

# ============================================================
# 2. 設定時區與 locale
# ============================================================
log "Step 2/8: 設定時區與 locale..."
timedatectl set-timezone Asia/Taipei
locale-gen en_US.UTF-8
update-locale LANG=en_US.UTF-8

# ============================================================
# 3. 建立部署使用者
# ============================================================
log "Step 3/8: 建立部署使用者..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    usermod -aG sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
    log "使用者 'deploy' 已建立"
else
    warn "使用者 'deploy' 已存在"
fi

# ============================================================
# 4. 設定 SSH 安全性
# ============================================================
log "Step 4/8: 設定 SSH 安全性..."
cat > /etc/ssh/sshd_config.d/esggo.conf << 'EOF'
# 禁止 root 登入
PermitRootLogin no

# 禁止密碼登入（僅允許金鑰）
PasswordAuthentication no
PubkeyAuthentication yes

# 限制登入嘗試
MaxAuthTries 3
LoginGraceTime 30

# 使用 SSH Protocol 2
Protocol 2

# 禁用不需要的認證
ChallengeResponseAuthentication no
UsePAM yes
EOF

systemctl restart sshd

# ============================================================
# 5. 設定防火牆
# ============================================================
log "Step 5/8: 設定防火牆..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

# ============================================================
# 6. 設定 Fail2Ban
# ============================================================
log "Step 6/8: 設定 Fail2Ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# ============================================================
# 7. 安裝 Docker
# ============================================================
log "Step 7/8: 安裝 Docker..."
if ! command -v docker &> /dev/null; then
    # 新增 Docker 官方 GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # 新增 Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # 安裝 Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # 啟動 Docker
    systemctl enable docker
    systemctl start docker

    log "Docker 安裝完成"
else
    warn "Docker 已安裝"
fi

# ============================================================
# 8. 設定自動安全更新
# ============================================================
log "Step 8/8: 設定自動安全更新..."
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

dpkg-reconfigure -plow unattended-upgrades

# ============================================================
# 建立部署目錄
# ============================================================
log "建立部署目錄..."
mkdir -p /opt/esggo
mkdir -p /opt/esggo/nginx/ssl
mkdir -p /opt/esggo/nginx/conf.d
chown -R deploy:deploy /opt/esggo

# ============================================================
# 設定 Swap（可選，對小記憶體有幫助）
# ============================================================
log "設定 Swap 2GB..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    sysctl -p
fi

# ============================================================
# 設定核心參數
# ============================================================
log "優化核心參數..."
cat >> /etc/sysctl.conf << 'EOF'
# 網路優化
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15

# 記憶體優化
vm.swappiness = 10
vm.overcommit_memory = 1
vm.dirty_ratio = 10
vm.dirty_background_ratio = 5

# 安全性
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
EOF
sysctl -p

# ============================================================
# 完成
# ============================================================
echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}  ESG GO Oracle Always Free 伺服器初始化完成！${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo "下一步："
echo "1. 設定 SSH 金鑰: ssh-copy-id deploy@<this-server-ip>"
echo "2. 上傳部署腳本: scp -r oracle-deploy/ deploy@<server-ip>:/opt/esggo/"
echo "3. 執行部署: ssh deploy@<server-ip> 'cd /opt/esggo && bash scripts/deploy.sh'"
echo ""
echo "重要資訊："
echo "- 伺服器 IP: $(curl -s ifconfig.me)"
echo "- 防火牆狀態: $(ufw status | head -1)"
echo "- Docker 版本: $(docker --version)"
echo ""
