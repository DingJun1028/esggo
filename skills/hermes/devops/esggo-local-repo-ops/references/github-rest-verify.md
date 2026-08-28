# GitHub REST verify recipe (esggo)

Use after `gh pr create` / `gh pr merge` — verify with REST, not `gh` output alone
(`gh` prints the URL even on partial failure; REST is the source of truth).

```python
from hermes_tools import terminal
import json

OWNER, REPO = "DingJun1028", "esggo"

def pr_state(n):
    r = terminal(f'curl -s "https://api.github.com/repos/{OWNER}/{REPO}/pulls/{n}"')
    d = json.loads(r["output"])
    return (d["state"], d.get("merged"), d["head"]["ref"], d["base"]["ref"])

def ci_state(pr_num):
    sha = json.loads(terminal(f'curl -s "https://api.github.com/repos/{OWNER}/{REPO}/pulls/{pr_num}"').output])["head"]["sha"]
    s = json.loads(terminal(f'curl -s "https://api.github.com/repos/{OWNER}/{REPO}/commits/{sha}/status"').output)
    return s.get("state"), [(c["context"], c["state"]) for c in s.get("statuses", [])]

# Example: PR #880
print(pr_state(880))   # ('closed', True, 'fix/...', 'main')  -> merged
print(ci_state(890))   # ('success', [('Devin Review','success'),('CodeRabbit','success')])
```

State interpretation:
- `state=closed` + `merged=True` → actually merged (GitHub shows "closed" for squash/merge).
- `state=open` + `mergeable=True` + CI `success` → safe to `gh pr merge N --squash --delete-branch`.
- `state=open` + CI `pending` → wait for reviewers (CodeRabbit) before merging.
- Never merge a PR with `mergeable=null`/CI `failure` unless user explicitly overrides.

Merge command (sandbox terminal, after CI green):
```
gh -R DingJun1028/esggo pr merge <N> --squash --delete-branch
```

Cleanup local main after all PRs merged:
```
git -C C:/Project/esggo checkout main
git -C C:/Project/esggo reset --hard origin/main
```
