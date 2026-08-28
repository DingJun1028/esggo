# Pitfall: `workflow_run.workflows` matches `name:`, not filename

## The bug (found 2026-08-09, esggo)
`auto-repair.yml` watched:
```yaml
workflows: ["OmniCore CI", "OmniCore Build", "OmniCore Deploy"]
```
Only `OmniCore CI` is a real workflow **name**. The other two names do not exist — esggo's
real names are `ESG-GO CI/CD Pipeline` (`deploy.yml`) and `Build & publish AI Station image`
(`build.yml`). Result: **Build/Delploy failures never triggered auto-repair**, silently. The
YAML parsed fine, so CI stayed green and the coverage gap was invisible until audited.

Fix applied:
```yaml
workflows: ["OmniCore CI", "ESG-GO CI/CD Pipeline", "Build & publish AI Station image"]
```

## Why it's a trap
`workflow_run.workflows` is matched against each upstream workflow's **`name:` field**, not its
filename. A typo'd or renamed name parses as valid YAML → no error → silent no-op. Always
confirm every watched name exists as a `name:`.

## Audit recipe
```bash
for f in .github/workflows/*.yml; do
  printf "%-28s -> " "$(basename "$f")"
  grep -m1 '^name:' "$f" | sed 's/name:[[:space:]]*//'
done
# each entry in workflow_run.workflows must appear in that output
```

## Verification quirk: PyYAML parses `on:` as `True`
```python
import yaml
d = yaml.safe_load(open('.github/workflows/auto-repair.yml'))
key = True if True in d else 'on'          # 'on' becomes bool True in YAML 1.1
wr = d[key]['workflow_run']
assert wr['workflows'] == ['OmniCore CI', 'ESG-GO CI/CD Pipeline', 'Build & publish AI Station image']
```

## Authoritative lint: actionlint
GitHub's official Actions linter. On Windows git-bash:
- `npx actionlint@latest <file>` → "could not determine executable" (fails)
- `pip install actionlint` → "No module named actionlint" (python3.14 path issue)
- **Works**: download `actionlint_*.windows_amd64.zip` from the GitHub release, then
  `cmd.exe /c "C:\path\to\actionlint.exe <file>"` (bare .exe paths via git-bash fail too).
- Get correct asset name via `curl ... api.github.com/repos/rhysd/actionlint/releases/latest`
  (the version in docs may be stale → 404). Latest verified: v1.7.12.

## Related hard constraint
Do NOT add a paid external coding agent (Jules/Gemini) for "auto-PR repair" — OA-TWINS
auto-repair already covers it (free, self-hosted), and paid SaaS violates the no-paid-API
rule. Tighten the existing `workflows:` list instead.
