#!/bin/bash

# Hermes VPS Deployment Script v1.0
# Targeted for Ubuntu 24.04

echo "------------------------------------------------"
echo "🚀 Starting Hermes Gateway Deployment on VPS..."
echo "------------------------------------------------"

# 1. Update and install Node.js (v20)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 for process management
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# 3. Create app directory
mkdir -p ~/hermes-gateway
cd ~/hermes-gateway

# 4. Create package.json
echo "📝 Creating package.json..."
cat <<EOF > package.json
{
  "name": "hermes-vps-gateway",
  "version": "0.14.0",
  "main": "hermes-server.mjs",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@google/generative-ai": "^0.21.0"
  }
}
EOF

# 5. Install dependencies
echo "🚚 Installing dependencies..."
npm install
sudo npm install -g pm2-logrotate

# 6. Environment Setup
echo "🔑 Setting up environment..."
if [ ! -f .env ]; then
  cat <<EOF > .env
GEMINI_API_KEY=your_key_here
PORT=8642
NODE_ENV=production
EOF
  echo "⚠️ Created .env template. PLEASE EDIT IT with your API Key!"
fi

# 7. Security & Firewall
echo "🛡️ Hardening Firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8642/tcp
sudo ufw --force enable

# 8. Launch Hermes Server
echo "🚀 Launching Hermes Server with PM2..."
pm2 start hermes-server.mjs --name hermes-gateway --exp-backoff-restart-delay 100

# 9. Setup PM2 startup
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo "------------------------------------------------"
echo "✅ Hermes Gateway Deployment COMPLETE!"
echo "------------------------------------------------"
echo "🌐 LIVE URL: http://$(curl -s ifconfig.me):8642"
echo "📝 Action Required: Edit ~/hermes-gateway/.env"
echo "💡 Tip: For SSL, install Nginx and certbot:"
echo "   sudo apt install nginx certbot python3-certbot-nginx"
echo "------------------------------------------------"
