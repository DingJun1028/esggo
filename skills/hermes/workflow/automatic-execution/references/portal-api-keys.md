# Portal API Keys Reference

## Key Management

### List Available Keys
```bash
hermes portal keys list
```

### Verify Key Validity
```bash
hermes portal keys verify <key-id>
```

### Create New Key (if authorized)
```bash
hermes portal keys create --name "key-name"
```

## Key Rotation Patterns

### Pattern 1: Standard Rotation
```
1. Generate new key
2. Update dependent services
3. Verify new key works
4. Revoke old key
```

### Pattern 2: Emergency Rotation
```
1. Immediately revoke compromised key
2. Generate replacement key
3. Update all services
4. Verify functionality
```

## Secret Injection

### List Secret Names
```bash
hermes portal secrets list
```

### Inject Secret to Environment
```bash
hermes portal secrets inject <secret-name>
```

### Validate Secrets
```bash
hermes portal secrets validate
```

## Key Security Patterns

### Never Do
- ❌ Store keys in chat history
- ❌ Commit keys to version control
- ❌ Print keys in logs
- ❌ Share keys without encryption

### Always Do
- ✅ Rotate keys regularly
- ✅ Use key names, not values
- ✅ Verify before revoking
- ✅ Document key purpose

## Common Key Types

| Key Type | Purpose | Rotation Frequency |
|----------|---------|-------------------|
| API_KEY | General API access | 90 days |
| SECRET_KEY | Authentication | 60 days |
| TOKEN | Session auth | 24 hours |
| DELEGATION_KEY | Agent delegation | 30 days |

## Troubleshooting

| Issue | Command | Resolution |
|-------|---------|------------|
| Key not found | `hermes portal keys list` | Create new key |
| Key expired | `hermes portal keys verify` | Rotate key |
| Key revoked | Check portal status | Regenerate key |
| Permission denied | Check scope | Request access |