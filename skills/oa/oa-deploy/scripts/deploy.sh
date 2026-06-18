#!/bin/bash
# ESGGO Deploy Script
# Usage: bash deploy.sh [commit_message]

set -e

PROJECT_DIR="C:\Project\esggo\esggo"
cd "$PROJECT_DIR"

echo "🌌 ESGGO Deploy Script"
echo "━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Check status
echo ""
echo "📋 Step 1: Checking git status..."
MODIFIED=$(git status --porcelain | wc -l)
echo "   Modified files: $MODIFIED"

if [ "$MODIFIED" -eq 0 ]; then
    echo "   ✅ No changes to commit"
else
    git status --short
fi

# Step 2: Local build test
echo ""
echo "🔨 Step 2: Running local build test..."
if pnpm run build > /tmp/esggo-build.log 2>&1; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed! Check /tmp/esggo-build.log"
    cat /tmp/esggo-build.log
    exit 1
fi

# Step 3: Commit
echo ""
echo "📝 Step 3: Committing changes..."
COMMIT_MSG="${1:-chore: auto deploy $(date '+%Y-%m-%d %H:%M')}"
git add -A
git commit --no-verify -m "$COMMIT_MSG" || echo "   ℹ️  Nothing to commit"

# Step 4: Push
echo ""
echo "🚀 Step 4: Pushing to origin/main..."
git push origin main
echo "   ✅ Pushed successfully"

# Step 5: Deploy
echo ""
echo "🌐 Step 5: Deploying to Vercel..."
vercel deploy --prod

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deploy complete!"
echo "🔗 https://esggo.vercel.app"
echo "━━━━━━━━━━━━━━━━━━━━━━"
