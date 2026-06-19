---
description: Sync Workflow (Fetch, Rebase, Verify, Push)
---

// turbo-all

1. **Fetch & Rebase**
   Fetch latest changes from origin and rebase local changes onto main to keep history clean.

```powershell
git fetch origin
git rebase origin/main
```

2. **Verify & Build**
   Run full type-check, lint, and build to ensure code integrity.

```powershell
npm run type-check
npm run lint
npm run build
```

3. **Push Changes**
   Once verified, push changes to the remote main branch.

```powershell
git push origin main
```
