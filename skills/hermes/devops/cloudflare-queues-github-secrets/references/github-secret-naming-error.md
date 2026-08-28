# GitHub Actions Secret Naming Error

## Error Message

```
HTTP 422: Secret names must not start with GITHUB_. (https://api.github.com/repos/OWNER/REPO/actions/secrets/GITHUB_WEBHOOK_SECRET)
```

## Root Cause

GitHub API has a built-in validation that rejects secret names starting with `GITHUB_`. This is a security measure to prevent confusion with GitHub's built-in tokens.

## Fix

### Option 1: Rename the Secret (Recommended)

Change from `GITHUB_WEBHOOK_SECRET` to `WEBHOOK_SECRET`:

```bash
# Delete the problematic secret
gh secret delete GITHUB_WEBHOOK_SECRET -R OWNER/REPO

# Create with new name
gh secret set WEBHOOK_SECRET -R OWNER/REPO
```

### Option 2: Update Code

Update your TypeScript interface and code to use the new name:

```typescript
// src/index.ts
export interface Env extends CloudflareBindings {
  WEBHOOK_SECRET?: string;  // Changed from GITHUB_WEBHOOK_SECRET
  REPAIR_PAT?: string;
  AUTO_MERGE?: boolean;
}

// Usage
app.post('/github/webhook', async (c) => {
  const secret = c.env.WEBHOOK_SECRET;  // Use new name
  // ...
});
```

## Common Secret Name Conflicts

The following secret names are problematic:

| ❌ Problematic | ✅ Safe Alternative |
|---------------|---------------------|
| `GITHUB_WEBHOOK_SECRET` | `WEBHOOK_SECRET` |
| `GITHUB_TOKEN` | `ACCESS_TOKEN` |
| `GITHUB_API_KEY` | `API_KEY` |
| `GITHUB_PAT` | `PAT` or `PERSONAL_ACCESS_TOKEN` |

## Verification

After fixing, verify with:

```bash
gh secret list -R OWNER/REPO
```

## References

- GitHub REST API: CreateOrUpdateSecret
- Cloudflare Wrangler: Secrets Management