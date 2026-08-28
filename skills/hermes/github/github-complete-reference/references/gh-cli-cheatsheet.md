# GitHub CLI (gh) 完整速查表

> 本機環境（docker/Windows）目前無 `gh`。但在任意有 gh 的環境（CI、有裝 gh 的機器）可直接用。
> 安裝：`brew install gh` / `winget install GitHub.cli` / `sudo apt install gh`
> 登入：`gh auth login`（互動）或 `gh auth login --with-token <<< "$TOKEN"`

## 倉庫
```
gh repo view DingJun1028/esggo
gh repo clone DingJun1028/esggo
gh repo create myrepo --public --description "x"
gh repo edit --visibility private
gh repo set-default
```

## PR
```
gh pr create --title "feat: x" --body "..." --base main
gh pr list --author @me
gh pr status
gh pr checks --watch
gh pr diff
gh pr review <n> --approve
gh pr merge --squash --delete-branch
gh pr merge --auto --squash
gh pr checkout <n>
gh pr close <n> --comment "reason"
```

## Issue
```
gh issue create --title "bug: x" --body "..."
gh issue list --state open
gh issue view <n>
gh issue close <n>
gh issue comment <n> --body "..."
```

## Release / Tag
```
gh release create v1.2.3 --title "v1.2.3" --notes "..." --target main
gh release upload v1.2.3 ./dist/app.exe
gh release list
gh release view v1.2.3
gh release delete v1.2.3
git tag -a v1.2.3 -m "..." && git push origin v1.2.3
```

## Actions / Secrets / Env
```
gh workflow list
gh run list --branch main
gh run view <run_id> --log-failed
gh run watch
gh secret list
gh secret set NAME -b "$VALUE"
gh secret delete NAME
gh variable list
gh variable set NAME -b "$VALUE"
gh environment list
```

## Webhooks / API 直通
```
gh api repos/DingJun1028/esggo/releases
gh api -X POST repos/DingJun1028/esggo/releases -f tag_name=v1.2.3 -f name=v1.2.3
gh webhook list
```

## 認證狀態
```
gh auth status
gh auth token   # 印出當前 token（敏感！僅本機除錯用）
```
