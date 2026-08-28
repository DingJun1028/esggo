# esggo git: merge all branches into main + push to remote

Recurring user directive: "將更新檔案佈署至遠端倉庫 https://github.com/DingJun1028/esggo.git 並將分支全部與主線合併".

## Safe procedure (run from a WORKING local shell — see references/recovering-local-shell.md)
```powershell
cd C:\Project\esggo
git checkout main
git pull origin main
# Merge every local branch except main with --no-ff (preserves history)
git merge --no-ff fix/google-auth-provider-setup        -m "merge: fix/google-auth-provider-setup -> main"
git merge --no-ff fix/replay-drive-link-and-ui-cleanup -m "merge: fix/replay-drive-link-and-ui-cleanup -> main"
git merge --no-ff ci/final-qa-and-i18n-en              -m "merge: ci/final-qa-and-i18n-en -> main"
# dependabot branches: review first, then
# git merge --no-ff dependabot/npm_and_yarn/<hash> -m "merge: dependabot -> main"
git push origin main
```

## Notes
- Use `--no-ff` so feature branches keep their merge commit (audit trail, satisfies 5T Traceable).
- Replace the branch list with the actual `git branch` output at run time — do NOT hardcode.
- Always `git pull origin main` before merging to avoid non-fast-forward rejects.
- Verify each merge succeeded (no conflicts) before the next step.
- The repo's remote is `https://github.com/DingJun1028/esggo.git`; push requires the user's GitHub token/credential helper on the host.
- If the shell is the dead embedded terminal, this will NOT execute — use the recovery procedure first.
