# 1Password Service Account Command Reference

## Environment Setup

```bash
export OP_SERVICE_ACCOUNT_TOKEN="<your-service-account-token>"
op user get --me
```

Expected output:
```
ID:                     <service-account-id>
Name:                   <service-account-name>
Email:                  <service-account-email>
State:                  ACTIVE
Type:                   SERVICE_ACCOUNT
Created:                <timestamp>
Updated:                <timestamp>
Last Authentication:    now
```

## Command Categories

### Read Operations
- `op read <secret-reference>` — Read a secret
- `op read "op://vault/item/field?attribute=otp"` — Read OTP
- `op vault get <vault-id-or-name>` — Get vault info

### Execution
- `op run -- <command>` — Run with secret env vars
- `op inject` — Inject into templates

### Item Management
- `op item get [--vault <vault>]` — Get item
- `op item list [--vault <vault>]` — List items
- `op item create` — Create item
- `op item edit` — Edit item
- `op item delete` — Delete item

### Document Management
- `op document get` — Get document
- `op document upload` — Upload document
- `op document delete` — Delete document

### Vault Management
- `op vault create` — Create vault
- `op vault delete` — Delete vault
- `op vault group grant/revoke` — Group permissions
- `op vault user grant/revoke` — User permissions

### Service Account Commands
- `op service-account ratelimit` — Check rate limits

## API Request Optimization Examples

### Before (multiple requests)
```bash
op item get "My Secret"  # 3 requests
op read "op://Vault/Item"  # 3 requests
```

### After (single request)
```bash
op item get "H6Y2ABC123" --vault "ABCD1234"  # 1 request
op read "op://ABCD1234/H6Y2ABC123" --vault "ABCD1234"  # 1 request
```

## Common Operations

### Read a secret
```bash
op read "op://app-prod/db/password"
```

### Get OTP
```bash
op read "op://app-prod/npm/one-time password?attribute=otp"
```

### Run with secrets
```bash
op run -- env | grep DB_
```

### Create vault
```bash
op vault create "New Vault"
```

### List items in specific vault
```bash
op item list --vault "My Vault"
```

## Troubleshooting

### "account is not signed in"
Verify token is set: `echo $OP_SERVICE_ACCOUNT_TOKEN`

### Rate limited
Check limits: `op service-account ratelimit`

### Connect vars override
Clear Connect vars:
```bash
unset OP_CONNECT_HOST OP_CONNECT_TOKEN
```

## Version Requirements
- Service accounts require 1Password CLI v2.18.0 or later