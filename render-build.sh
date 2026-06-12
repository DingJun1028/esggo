#!/usr/bin/env bash
# render-build.sh
# Custom build script for Render to bypass package-lock conflicts

echo "Running custom Render build script..."

# 1. Clean install to ensure all dependencies (including Tailwind v4) are fetched
echo "Cleaning node_modules and running npm install..."
rm -rf node_modules package-lock.json
npm install

# 2. Run the Next.js build
echo "Running Next.js production build..."
npm run build

echo "Build complete."
