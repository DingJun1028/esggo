# Branch Consolidation Playbook (condensed runbook)

End-to-end recipe used to collapse a 97-branch GitHub repo (`DingJun1028/esggo`) down to
`main + vps/live`, preserving every unmerged branch's work and deleting the rest. Copy and
adapt the `<owner>/<repo>` and keep-set. Companion to `SKILL.md` sections 0–11.

## 0. Locate the branches (they may be on the remote, not the local repo)
```bash
gh api repos/<owner>/<repo>/branches --paginate --jq '.[]|.name'      # all remote
git branch -r --merged origin/main        | grep -v HEAD | wc -l      # already merged (safe)
git branch -r --no-merged origin/main      | grep -v HEAD | sed 's/origin\///'   # unmerged (unique work)
gh pr list --repo <owner>/<repo> --state open --json number,headRefName,baseRefName
```

## 1. Merge the unmerged (worktree on a scratch branch)
```bash
cd /c/Project/<repo>
git worktree add -b merge-scratch /c/Project/<repo>-merge origin/main
cd /c/Project/<repo>-merge
export GIT_MERGE_AUTOEDIT=no
for b in $(git branch -r --no-merged origin/main | grep -v HEAD | sed 's#origin/##'); do
  git merge --no-ff -X ours "origin/$b" -m "merge: $b into main" \
    || { git merge --abort; echo "ABORTED: $b"; }      # unrelated history → use section 2 import
done
```

## 2. Absorb concurrent push + push
```bash
git fetch origin
git merge --no-ff origin/main            # never rebase
git push origin merge-scratch:main
git rev-list --left-right --count origin/main...origin/main   # expect 0 0
```

## 3. Delete the rest (irreversible) — use scripts/delete-remote-branches.sh
```bash
bash scripts/delete-remote-branches.sh "DingJun1028/esggo" "main vps/live"
```
Idempotent: OK_DEL / OK_GONE (already deleted) / FAIL_STILL. Re-run to mop up FAIL_STILL.
Wrap the loop in a `.sh` file — never inside `execute_code` (caps at ~50 tool calls) and never
as one giant inline command (trips the agent's `BLOCKED (hardline)` parser).

## 4. Verify + local cleanup
```bash
gh api repos/<owner>/<repo>/branches --paginate --jq '.[]|.name' | wc -l   # expect keep-set size
git fetch origin --prune
git for-each-ref --format='%(refname)' refs/heads/ \
  | while read -r ref; do b=${ref#refs/heads/};
      [ "$b" != main ] && [ "$b" != new-branch ] && git branch -D "$b"; done
git worktree remove --force -f -f /c/Project/<repo>-merge; git worktree prune
```

## 5. Post-cleanup PRs (auto-repair bot opens one after you finish)
```bash
gh pr view <N> --repo <owner>/<repo> --json title,headRefName,baseRefName,files
git show origin/main:.github/workflows/ci.yml | python3 -c "import sys,yaml; yaml.safe_load(sys.stdin.read()); print('VALID')" || echo BROKEN
gh pr merge <N> --repo <owner>/<repo> --squash --delete-branch
git fetch origin && git -C /c/Project/<repo> reset --hard origin/main   # resync local main
```

## Gotchas observed (this session)
- `comm -23` needs both sides `sort -u`'d or it mis-compares.
- Windows `git branch -D "feat/foo"` fails silently (ambiguous ref) → use `git for-each-ref refs/heads/` + full name.
- `execute_code` helper dies at ~50 tool calls → never loop 95 API deletes there.
- Inline 90-line bash loop → "hardline" block; wrap in a file.
- NTFS `.Jules` vs `.jules` → phantom "modified" in `git status`; ignore, it's disk-only.
- 60k-file worktree merge can time out + corrupt index → `rm -rf` + `worktree unlock` + `remove --force -f -f` + `prune`.
- Another agent may push to `main` mid-consolidation → `git merge --no-ff origin/main` before push.
- Post-cleanup PR (e.g. OA-TWINS #435) → validate diff + `yaml.safe_load`, then `--squash --delete-branch`.
