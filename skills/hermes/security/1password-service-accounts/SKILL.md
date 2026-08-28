---
name: 1password-service-accounts
description: Complete reference for 1Password Service Account CLI operations including supported commands, rate limits, and API request optimization.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [security, secrets, 1password, service-accounts, cli]
    category: security
---

# 1Password Service Accounts

Use this skill for comprehensive service account operations with 1Password CLI.

## Overview

Service accounts allow programmatic access to 1Password vaults and items via CLI without interactive authentication. Requires CLI v2.18.0+.

## Authentication

Set the service account token:
```bash
export OP_SERVICE_ACCOUNT_TOKEN="<your-token>"
op user get --me  # Verify: should show Type: SERVICE_ACCOUNT
```

## Supported Commands

### Read-only & Execution
- `op read` — Read secrets
- `op inject` — Inject into templates
- `op run` — Run with secret env vars
- `op service-account ratelimit` — Check limits

### Vault Management
- `op vault create` — Create vaults
- `op item` — Manage items (use `--vault` if multiple vaults)
- `op document` — Manage documents (use `--vault` if multiple vaults)

### Vault-Specific (only for vaults created by service account)
- `op vault delete`
- `op vault group grant/revoke`
- `op vault user grant/revoke`

## API Request Optimization

Pass IDs instead of names to reduce requests:

| Command | Requests | Optimization |
|---------|----------|--------------|
| `op item list` | 1 + N vaults | `--vault` + vault ID |
| `op item get` | 3 | item ID + vault ID |
| `op item create` | 1+1 | vault ID |
| `op item delete` | 5+1 | vault ID |
| `op item edit` | 5+1 | vault ID |
| `op read` | 3 | item ID + vault ID |
| `op vault delete` | 2+1 | vault ID |
| `op vault get` | 2 | vault ID |

## Rate Limits

Service accounts have hourly and daily limits.

Check status:
```bash
op service-account ratelimit
```

## Unsupported Commands

- `op connect`, `op group`, `op user provision/confirm/suspend/delete/recovery`
- `op user get/list`, `op group get/list` (not recommended)
- `op events-api`, `op vault edit` (limited)

## Important Notes

- If `OP_CONNECT_HOST` or `OP_CONNECT_TOKEN` are set, they override `OP_SERVICE_ACCOUNT_TOKEN`
- Clear Connect vars to use service account auth
- Use `--vault` flag when service account has access to multiple vaults

## References
- https://developer.1password.com/docs/service-accounts/
- https://developer.1password.com/docs/service-accounts/rate-limits/
- https://developer.1password.com/docs/cli/reference/management-commands/