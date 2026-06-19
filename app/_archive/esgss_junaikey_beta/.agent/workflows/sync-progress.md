---
description: Sync project progress to the remote repository after reporting.
---

// turbo-all

1. Fetch the latest changes from the remote repository.
```powershell
git fetch origin
```

2. Rebase the current branch onto origin/main.
```powershell
git rebase origin/main
```

3. Add all project documentation and code changes.
```powershell
git add .
```

4. Commit the changes with a meaningful message.
```powershell
git commit -m "chore: sync project progress to remote repository [Phase 27]"
```

5. Push the changes to the remote repository.
```powershell
git push origin main
```

6. Verify that the push was successful.
```powershell
git status
```
