# Portal API Key Management

## Key Types

### 1. Authentication Keys
- Used for: Portal authentication
- Format: Bearer token
- Location: ~/.hermes/auth.json

### 2. Delegation Keys
- Used for: Acting as principal
- Format: JWT token
- Location: Portal delegation store

### 3. API Keys
- Used for: External API calls
- Format: Varies by provider
- Location: GitHub Secrets or Portal

## Key Rotation Patterns

### Pattern A: Password Authorization Key Rotation
```bash
# 1. Generate new key
hermes portal keys create --name "auth-$(date +%Y%m%d)"

# 2. Verify new key works
hermes portal keys verify <new-key-id>

# 3. Update dependent systems
# (specific to each integration)

# 4. Revoke old key after grace period
hermes portal keys revoke <old-key-id>
```

### Pattern B: CLI Tool Key Injection
```bash
# 1. Get key from portal
hermes portal secrets get CLI_API_KEY

# 2. Inject into environment
export CLI_API_KEY=$(hermes portal secrets get CLI_API_KEY)

# 3. Verify CLI can use it
your-cli-tool --version
```

## Common Key Errors

### Error: "token expired"
**Solution:**
```bash
hermes portal refresh
hermes portal token verify
```

### Error: "permission denied"
**Solution:**
```bash
# Check current permissions
hermes portal auth status

# Verify authorization type
# Ensure correct authorization phase completed
```

### Error: "key not found"
**Solution:**
```bash
# List available keys
hermes portal keys list

# Check if key exists in expected location
hermes portal secrets list
```

## Key Verification Checklist

- [ ] Key exists in portal
- [ ] Key has not expired
- [ ] Key has required permissions
- [ ] Key is properly injected
- [ ] Downstream tool can use key
- [ ] Key rotation documented