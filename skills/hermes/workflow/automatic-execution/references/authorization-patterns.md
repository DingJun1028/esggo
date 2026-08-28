# Authorization Patterns Reference

## Sequential Authorization Flow

Pattern: `密碼授權 → CLI授權 → 自主代行授權 → 代主通典授權`

### Step 1: Password Authorization (密碼授權)

**Purpose:** Verify Portal connection and authentication

**Commands:**
```bash
hermes portal status
hermes portal keys list
hermes portal keys verify <key-id>
```

**Verification:**
- Portal status shows "✓ logged in"
- API endpoint is accessible
- Token is valid

### Step 2: CLI Authorization (CLI授權)

**Purpose:** Verify CLI tools are available and authenticated

**Commands:**
```bash
# Check CLI tools
command -v gh >/dev/null 2>&1 && echo "gh installed"
command -v wrangler >/dev/null 2>&1 && echo "wrangler installed"

# Verify GitHub auth
gh auth status

# Verify Cloudflare auth
wrangler whoami
```

**Verification:**
- gh CLI is installed and authenticated
- wrangler CLI is installed and authenticated
- No permission denied errors

### Step 3: Autonomous Agent Authorization (自主代行授權)

**Purpose:** Verify delegation permissions for subagent spawning

**Verification:**
- Check delegation scope in portal
- Verify resource allocation limits
- Confirm parallel task execution allowed

**Commands:**
```bash
# Check delegation permissions
hermes portal auth get-delegation

# List authorized tasks
hermes portal tasks list
```

### Step 4: Delegate Authorization (代主通典授權)

**Purpose:** Verify principal permissions for acting on behalf of user

**Commands:**
```bash
# Verify GitHub principal auth
gh auth status

# Verify Cloudflare principal auth
wrangler whoami
```

**Verification:**
- GitHub auth is valid
- Cloudflare account is accessible
- Principal permissions confirmed

## Authorization Flow Script

See `scripts/authorization-flow.sh` for the complete verification script.

## Common Patterns

### Pattern A: Full Authorization Chain
```
User: "密碼授權 → CLI授權 → 自主代行授權 → 代主通典授權"
Agent: Execute all 4 steps in sequence
```

### Pattern B: Partial Authorization
```
User: "CLI授權 + 自主代行授權"
Agent: Skip Step 1 (password), execute Steps 2-3
```

### Pattern C: Authorization with Action
```
User: "授權部署"
Agent: Verify CLI authorization, then deploy
```

## Error Handling

| Error | Resolution |
|-------|------------|
| Portal not connected | Check internet, re-login |
| CLI tool missing | Install required tool |
| Auth token expired | Refresh token |
| Delegation denied | Check permissions |
| Principal auth failed | Verify account access |