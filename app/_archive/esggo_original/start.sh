#!/bin/bash

# ESG GO Platform Bootstrap Script (start.sh) v1.0
# Automatic Environment Setup and Startup

echo "------------------------------------------------"
echo "🌟 Initializing ESG GO Enterprise Platform..."
echo "------------------------------------------------"

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v20+."
    exit 1
fi

# 2. Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 3. Check for .env
if [ ! -f ".env" ]; then
    echo "⚠️ .env file missing. Creating from .env.example..."
    cp .env.example .env
fi

# 4. Start the platform using ctl.sh
echo "🚀 Bootstrapping services..."
chmod +x ctl.sh
./ctl.sh start

echo "------------------------------------------------"
echo "✅ ESG GO Platform is now initializing."
echo "🔗 URL: http://localhost:3000"
echo "🛠️ CLI: npx omni --help"
echo "------------------------------------------------"
