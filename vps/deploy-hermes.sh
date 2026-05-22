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

# 6. Open Firewall port 8642
echo "🛡️ Configuring Firewall..."
sudo ufw allow 8642/tcp

# 7. Start server with PM2
echo "🚀 Launching Hermes Server..."
pm2 start hermes-server.mjs --name hermes-gateway

# 8. Setup PM2 startup
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo "------------------------------------------------"
echo "✅ Hermes Gateway is now LIVE on port 8642!"
echo "Check status with: pm2 status"
echo "View logs with: pm2 logs hermes-gateway"
echo "------------------------------------------------"
