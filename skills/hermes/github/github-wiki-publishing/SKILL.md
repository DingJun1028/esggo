---
name: github-wiki-publishing
description: "Publish multi-page documentation to GitHub Wiki under free-tier constraints: clone/push via HTTPS, Windows/MSYS token handling, REST vs git behavior, priming fallback for 404 clone."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [GitHub, Wiki, Documentation, Free-tier, Publishing]
    related_skills: [github-auth, github-repo-management]
---

# GitHub Wiki Publishing

Publish markdown-based documentation to GitHub Wiki. Wikis are included with repos at no extra cost, making them a natural free-tier documentation target.

## When to use

- User asks to create/publish GitHub Wiki pages.
- Collaboration docs need a repo-linked, Markdown-native knowledge base.
- Docs should remain inside the existing repo ecosystem without external CMS costs.

## Prerequisites

- Repo has Wiki enabled: `has_wiki_enabled=true`.
- Authenticated GitHub `gh` CLI available; `gh auth token` works in the current shell.
- `git` available in PATH.

## Core workflow

### 1. Verify repo wiki state

```bash
gh repo view owner/repo --json hasWikiEnabled,nameWithOwner
```

### 2. Clone the wiki

GitHub Wiki is a separate git repo at `owner/repo.wiki.git`, not a first-class page API.

```bash
TOKEN=$(gh auth token)
git clone "https://$TOKEN@github.com/owner/repo.wiki.git" ./wiki-local
```

### 3. Add/update pages

Each top-level Markdown file becomes a wiki page. `Home.md` is special (home/overview).

```bash
cd wiki-local
cat > Home.md << 'EOF'
# Title
First page content.
EOF

mkdir -p Guides
cat > Guides/Setup.md << 'EOF'
# Setup
Instructions here.
EOF
```

### 4. Commit and push

```bash
git add .
git commit -m "docs: publish first wiki pages"
git push origin main   # or master for older repos
```

## Pitfall: 404 list or clone failure

`gh api repos/owner/repo/wiki` often returns `404 Not Found` even when `has_wiki_enabled=true`. This does NOT mean wiki is disabled; it usually means:

- No page exists yet, OR
- The endpoint requires different auth than clone/push.

**Fix:** attempt clone directly. If clone fails with `Repository not found`:

```bash
TOKEN=$(gh auth token)
REMOTE="https://$TOKEN@github.com/owner/repo.wiki.git"
mkdir -p /tmp/wiki-primer && cd /tmp/wiki-primer
git init
git remote add origin "$REMOTE"
git commit --allow-empty -m "prime wiki"
git push origin master
git clone "$REMOTE" wiki-local
cd wiki-local
```

Then write pages and push.

## Windows MSYS notes

- Use `https://<SECRET_b49776cf>.wiki.git` in git-bash.
- Do NOT rely on PowerShell env vars (`$env:GITHUB_TOKEN`) inside git-bash/`terminal` tool.
- `-c credential.helper=` wrappers are unreliable; inline token in the URL is more robust.

## Verification

After push:

```bash
gh api repos/owner/repo --jq '.has_wiki_enabled'
# Also check web UI: https://github.com/owner/repo/wiki
# 404 in gh api list/write endpoints is expected until pages propagate.
```

## Related

- `github-repo-management` for cloning, `gh` auth, and repo info patterns.
- `github-auth` for token handling if `gh auth token` is unavailable.
