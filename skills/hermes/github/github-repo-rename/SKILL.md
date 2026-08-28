---
name: github-repo-rename
description: "Rename GitHub repositories using gh CLI or git remote commands. Handles name changes, URL updates, and push to new location."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [GitHub, Repositories, Rename, gh-cli, Git]
    related_skills: [github-repo-management, github-auth]
---

# GitHub Repository Rename

Rename GitHub repositories and update local configurations.

## Overview

When renaming a GitHub repository, you need to:
1. Rename the remote repository on GitHub
2. Update the local git remote URL
3. Push content to the new repository if needed

## Methods

### With gh CLI (Recommended)

```bash
# Rename the repository on GitHub
gh repo rename <new-name> -y

# Update local remote URL automatically
git remote -v  # Verify the URL was updated

# Push to the new location
git push -u origin main
```

**Common pattern:**
```bash
# Rename and push in one sequence
gh repo rename my-new-name -y
git remote -v  # Check if URL updated
git push -u origin main
```

### With git + curl (API method)

```bash
# Get current repo info
gh api repos/OWNER/REPO --jq '.name'

# Rename via API
curl -X PATCH \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/OWNER/REPO \
  -d '{"name":"new-repo-name"}'

# Update local remote
git remote set-url origin https://github.com/OWNER/new-repo-name.git
```

## Important Notes

### GitHub Auto-redirect
GitHub automatically redirects the old repository URL to the new one for a period of time. However:
- Git operations may fail with the old URL after rename
- Local clones will need the remote URL updated
- CI/CD workflows may need updating

### Branch Name Considerations
After renaming, the default branch name may change:
```bash
# Check current branch
git branch -a

# If needed, set upstream to new remote
git branch --set-upstream-to=origin/main main
```

### Verification Steps
1. Verify new GitHub URL: `gh repo view`
2. Check local remote: `git remote -v`
3. Confirm push works: `git push -u origin main`
4. Verify content on new repo

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `fatal: repository '...' not found` | Old URL is broken; update remote with `git remote set-url` |
| `Updates were rejected because the remote contains work that you do not have locally` | Run `git pull` first, then push |
| `Permission to ... denied` | Check token has `repo` scope; re-authenticate if needed |
| GitHub shows "This repository moved" | Old URL redirects to new; update local remote |

## Related Skills

- `github-repo-management` - General repository operations
- `github-auth` - Authentication setup
- `github-secrets` - Managing secrets during repo transitions