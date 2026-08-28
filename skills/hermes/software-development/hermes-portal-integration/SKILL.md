---
name: hermes-portal-integration
description: "Integration patterns for Hermes Portal authorization flows, API key management, and secret validation. Supports password authorization, CLI authorization, autonomous agent authorization, and delegate authorization."
version: 1.2.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [integration, authorization, secrets, api-keys, portal]
    related_skills: [automatic-execution, hermes-usage-best-practices, github-secrets, hermes-agent-skill-authoring]
---

# Hermes Portal Integration

## Overview

This skill handles authorization patterns for Hermes Portal operations including:
- Password-based authorization flows
- CLI tool authorization
- Autonomous agent delegation
- Principal/delegate operations

## When to Use

- User says "密碼授權" - password-based operations
- User says "CLI授權" - command-line interface operations
- User says "自主代行授權" - autonomous agent delegation
- User says "代主通典授權" - principal/delegate operations
- Integration with Hermes Portal API
- API key management and validation

## Authorization Types

### 1. Password Authorization (密碼授權)

**Use when:** User grants permission for password-related operations

**Pattern:**
```
User: "密碼授權"
Agent: [verify password authorization] → [execute auth flow] → [verify success]
```

**Actions:**
- Password generation
- Credential rotation
- Auth token refresh
- Secret encryption/decryption

**Portal Commands:**
```bash
# Check portal auth status
hermes portal status

# List available keys
hermes portal keys list

# Verify key validity
hermes portal keys verify <key-id>
```

### 2. CLI Authorization (CLI授權)

**Use when:** User grants permission for CLI command execution

**Pattern:**
```
User: "CLI授權，執行部署腳本"
Agent: [verify CLI authorization] → [check prerequisites] → [execute script] → [verify output]
```

**Actions:**
- Shell command execution
- Script automation
- Tool chain operations
- Build/deploy pipelines

**Portal Integration:**
```bash
# Check CLI tools are available
command -v gh >/dev/null 2>&1 && echo "gh installed"
command -v wrangler >/dev/null 2>&1 && echo "wrangler installed"

# Verify GitHub CLI auth
gh auth status

# Verify Cloudflare auth
wrangler whoami
```

### 3. Autonomous Agent Authorization (自主代行授權)

**Use when:** User grants permission for agent delegation

**Pattern:**
```
User: "自主代行授權，處理這些緊急任務"
Agent: [verify autonomous authorization] → [delegate to subagents] → [monitor progress] → [collect results]
```

**Actions:**
- Subagent spawning
- Parallel task delegation
- Long-running process management
- Multi-agent coordination

### 4. Delegate Authorization (代主通典授權)

**Use when:** User grants permission to act on behalf of principal

**Pattern:**
```
User: "代主通典授權，執行 API 操作"
Agent: [verify delegate authorization] → [act as principal] → [perform operations] → [verify actions]
```

**Actions:**
- API calls on behalf of user
- Resource management
- Administrative operations
- Third-party integrations

## Sequential Authorization Flow

For the authorization sequence: `密碼授權 → CLI授權 → 自主代行授權 → 代主通典授權`

### Step 1: Password Authorization
```
User: "密碼授權"
Agent: 
  1. Verify portal connection (hermes portal status)
  2. Check auth token validity
  3. Refresh if needed
  4. Confirm password operations authorized
```

### Step 2: CLI Authorization
```
User: "CLI授權"
Agent:
  1. Verify CLI tool availability (gh, wrangler, etc.)
  2. Check portal CLI configuration
  3. Verify GitHub auth (gh auth status)
  4. Confirm CLI operations authorized
```

### Step 3: Autonomous Agent Authorization
```
User: "自主代行授權"
Agent:
  1. Check delegation permissions
  2. Verify subagent spawning allowed
  3. Confirm parallel task execution
  4. Log delegation scope
```

### Step 4: Delegate Authorization
```
User: "代主通典授權"
Agent:
  1. Verify GitHub auth (gh auth status)
  2. Check Cloudflare/Wrangler auth
  3. Confirm acting on behalf of principal
  4. Execute with principal context
```

## Authorization Verification Script

**Path:** `~/AppData/Local/hermes/scripts/authorization-flow.sh`

```bash
#!/bin/bash
# Complete authorization flow verification
# Pattern: 密碼授權 → CLI授權 → 自主代行授權 → 代主通典授權

# Step 1: Portal Status
hermes portal status | grep -q "✓ logged in" && echo "✅ Portal 連線"

# Step 2: CLI Tools
command -v gh >/dev/null 2>&1 && echo "✅ gh CLI"
command -v wrangler >/dev/null 2>&1 && echo "✅ wrangler CLI"

# Step 3: GitHub Auth
gh auth status >/dev/null 2>&1 && echo "✅ GitHub auth"
```

## Authorization Verification

### Before Execution
```
1. Identify authorization type from trigger phrase
2. Verify authorization scope matches requested operations
3. Check for required prerequisites (keys, tools, access)
4. Confirm no conflicting restrictions
```

### During Execution
```
1. Log authorized actions for audit trail
2. Verify each operation stays within scope
3. Capture real output for verification
4. Handle scope violations gracefully
```

### After Execution
```
1. Confirm all authorized actions completed
2. Report any out-of-scope attempts
3. Provide evidence of successful operations
4. Document any partial completions
```

## Portal API Integration

### Authentication
```bash
# Check current portal status
hermes portal status

# Authentication is handled via Nous Portal
# No additional auth needed for portal operations
```

### Key Management
```bash
# List available portal keys
hermes portal keys list

# Check key validity
hermes portal keys verify <key-id>
```

### Secret Injection
```bash
# List secret names (values not shown)
hermes portal secrets list
```

## Common Authorization Patterns

### Pattern 1: Sequential Authorization
```
User: "密碼授權，然後CLI授權"
Agent: 
  1. Process password authorization
  2. Verify completion
  3. Process CLI authorization
  4. Execute CLI commands
  5. Verify output
```

### Pattern 2: Parallel Authorization
```
User: "自主代行授權，同時處理多項任務"
Agent:
  1. Spawn multiple subagents
  2. Monitor all progress
  3. Collect results
  4. Consolidate report
```

### Pattern 3: Hierarchical Authorization
```
User: "代主通典授權 + CLI授權"
Agent:
  1. Verify delegate scope
  2. Execute delegated operations
  3. Use CLI for supporting actions
  4. Verify all completed
```

### Pattern 4: Full Authorization Chain
```
User: "密碼授權 → CLI授權 → 自主代行授權 → 代主通典授權"
Agent:
  1. Process each authorization in sequence
  2. Verify each step
  3. Execute authorized operations
  4. Report completion with evidence
```

## Verification Checklist

- [ ] Authorization type correctly identified
- [ ] Authorization scope matches operations
- [ ] Prerequisites verified before execution
- [ ] Actions logged for audit trail
- [ ] Real output verified after each step
- [ ] Scope violations handled appropriately
- [ ] Final report includes evidence

## Integration with Automatic Execution

When `automatic-execution` detects authorization phrases:

```
1. automatic-execution identifies "授權X" phrase
2. Routes to hermes-portal-integration for scope verification
3. Confirms authorization matches requested operations
4. Proceeds with autonomous execution
5. Verifies each step with real output
6. Reports completion with evidence
```

## Related Skills

- `automatic-execution` - Core autonomous execution pattern
- `hermes-usage-best-practices` - General prompting patterns
- `github-secrets` - Secret management patterns
- `hermes-agent-skill-authoring` - For creating/modifying skills

## Examples

### Password Authorization Example
```
User: "密碼授權，請為我生成新的 API 金鑰"
Agent: [verify password auth] → [generate key via portal] → [verify key created] → [report with key info]
```

### CLI Authorization Example
```
User: "CLI授權，執行 build-and-deploy.sh"
Agent: [verify CLI auth] → [check script exists] → [run script] → [verify deployment] → [report]
```

### Autonomous Authorization Example
```
User: "自主代行授權，處理這3個 bug"
Agent: [verify autonomous auth] → [delegate_task x3] → [monitor all] → [collect results] → [summarize]
```

### Delegate Authorization Example
```
User: "代主通典授權，更新 Cloudflare 設定"
Agent: [verify delegate auth] → [verify Cloudflare token] → [execute via wrangler] → [verify changes]
```

### Full Authorization Chain Example
```
User: "密碼授權 → CLI授權 → 自主代行授權 → 代主通典授權"
Agent: 
  1. [password auth] → verify portal connection → refresh token if needed
  2. [CLI auth] → check CLI tools → verify auth → confirm CLI access
  3. [autonomous auth] → check delegation → spawn subagents → monitor
  4. [delegate auth] → verify GitHub/Cloudflare auth → execute
  5. Report all completions with evidence
```