#!/bin/bash
# rename-workflow.sh - Complete GitHub repository rename workflow
# Usage: ./rename-workflow.sh <old-name> <new-name>

set -e

OLD_NAME="${1:-}"
NEW_NAME="${2:-}"

if [ -z "$OLD_NAME" ] || [ -z "$NEW_NAME" ]; then
    echo "Usage: $0 <old-repo-name> <new-repo-name>"
    exit 1
fi

echo "=== GitHub Repository Rename Workflow ==="
echo "Old: $OLD_NAME"
echo "New: $NEW_NAME"
echo ""

# Step 1: Rename on GitHub
echo "Step 1: Renaming repository on GitHub..."
gh repo rename "$NEW_NAME" -y

# Step 2: Update local remote URL
echo "Step 2: Updating local remote URL..."
git remote set-url origin "https://github.com/$(gh api user --jq '.login')/$NEW_NAME.git"

# Step 3: Verify
echo "Step 3: Verifying..."
echo "Remote URL: $(git remote get-url origin)"
echo "GitHub repo: $(gh repo view --json nameWithOwner -q '.nameWithOwner')"

echo ""
echo "=== Rename Complete ==="
echo "Next steps:"
echo "1. git push -u origin main"
echo "2. Update any CI/CD workflows that reference the old repo name"
echo "3. Update documentation links"
echo "4. Notify any collaborators"