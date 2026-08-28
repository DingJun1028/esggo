# GitHub Dependabot triage — command recipes (esggo, 2026-08-12 verified)

## 1. Count + group open alerts by manifest (the key first step)
```bash
gh api repos/DingJun1028/esggo/dependabot/alerts?state=open --paginate -q '.[] | .dependency.manifest_path' \
  | sort | uniq -c | sort -rn
```
Sample output (2026-08-12, 80 open):
```
46 rules-tutorial/functions/package-lock.json
11 esggo-omni-center/apps/learning-center/package-lock.json
11 apps/learning-center/pnpm-lock.yaml
 7 esggo-omni-center/pnpm-lock.yaml
 1 pnpm-lock.yaml
 1 oa-team-crewai/uv.lock
 1 cli/omnicli/package.json
 1 cli/oa-cli/package.json
 1 cli/esggo-cli/package.json
```

## 2. Per-manifest package + fixed version
```bash
gh api repos/DingJun1028/esggo/dependabot/alerts?state=open --paginate \
  -q '.[] | "\(.security_advisory.severity)\t\(.dependency.package.name)\tfixed=\(.security_advisory.first_patched_version.identifier // "none")\t\(.dependency.manifest_path)"'
```

## 3. Root workspace only (what pnpm overrides affect)
```bash
gh api repos/DingJun1028/esggo/dependabot/alerts?state=open --paginate \
  -q '.[] | select(.dependency.manifest_path=="pnpm-lock.yaml") | "  #\(.number) \(.security_advisory.severity) \(.dependency.package.name)"'
```
2026-08-12 result: `#1428 high sharp` (the only root alert; AGENTS.md #7 exclusion).

## 4. Dismissal (BLOCKED in this env — documented, do not retry blindly)
Requires `security_events:write` token scope. Standard `gh` token here LACKS it.
Every variant below returns HTTP 422 "data matches no possible input":
```bash
# Form fields — 422
gh api repos/DingJun1028/esggo/dependabot/alerts/1428 -X PATCH \
  -f dismissed_reason=not_used -f "dismissed_comment=..."
# --input JSON — 422
echo '{"dismissed_reason":"not_used","dismissed_comment":"..."}' \
  | gh api repos/DingJun1028/esggo/dependabot/alerts/1428 -X PATCH --input -
# Explicit header — 422
gh api ... -X PATCH -H "Content-Type: application/json" -f dismissed_reason=not_used ...
```
Valid reasons: `fix_started, inaccurate, no_bandwidth, not_used, tolerable_risk`.
INVALID: `not_vulnerable` (422). For "code path unused" use `not_used`.
If you HAVE a scoped token, the correct call is:
```bash
gh api repos/DingJun1028/esggo/dependabot/alerts/1428 -X PATCH --input - <<'JSON'
{"dismissed_reason":"not_used","dismissed_comment":"AGENTS.md #7 exclusion: ..."}
JSON
```

## 5. Verify root workspace is clean (the real target)
```bash
cd /c/Project/esggo && pnpm audit --prod
# => No known vulnerabilities found
```
