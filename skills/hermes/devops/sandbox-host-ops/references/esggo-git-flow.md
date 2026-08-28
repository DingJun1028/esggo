# esggo git flow — known-good host PowerShell script

Reproduce with modifications. Ran against `C:\Project\esggo` via the
emit-script / paste-back bridge (sandbox can't reach host FS).

## Scenario
`git status --short` showed 16 tracked `.ts` files each with a 1-line change
(`2 +-`) + `pnpm-lock.yaml` (`+6`), plus untracked `wd_out.txt` / `wd_trace.txt`
(debug artifacts — must NOT be committed). No `.xcodeproj` present (JunAIKey is a
separate repo). Branch was `main`; never push `main` directly.

## Script (PowerShell, host terminal)
```powershell
cd C:\Project\esggo
git checkout -b chore/omni-12-contract-sync
git add -u                                   # stages only tracked files; excludes wd_*.txt
$msg = @"
chore(omni-12): synchronize core-contract and celestial interfaces across twelve-omni modules

- Align 10 twelve-omni modules + core-skeleton/omni-user-registry with updated
  core-contract and celestial interface definitions.
- pnpm-lock.yaml regenerated for lockfile consistency.
- Excludes wd_out.txt / wd_trace.txt debug artifacts (untracked).
"@
git commit -m $msg
git push -u origin chore/omni-12-contract-sync

$body = @"
## 變更摘要
跨 twelve-omni 10 個模組 + core-skeleton / omni-user-registry / celestial interfaces / core-contract / omni-agent 型別同步合約更新。

## 5T 對應
- Traceable: 變更限於受追蹤檔，wd_*.txt 偵錯產物已排除
- Transparent: 純合約/介面對齊，無運行時行為變更
- Trustworthy: 僅同步既有介面，未引入新依賴風險
- Trackable: pnpm-lock.yaml 鎖定一致性
- Tangible: 待 CI typecheck 綠燈驗證

## 待辦
- [ ] CI typecheck 通過
- [ ] 將 wd_out.txt / wd_trace.txt 加入 .gitignore
"@
gh pr create --title "chore(omni-12): synchronize core-contract and celestial interfaces across twelve-omni modules" --body $body
```

## Verification (agent side, never trust "created")
- `gh pr view <n>` → confirm number + URL exist
- `git ls-remote origin` → confirm branch pushed
- Next commit: add `wd_out.txt`, `wd_trace.txt` to `.gitignore`
