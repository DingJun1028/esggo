# OmniTag Reporting Format for Queue Consumer Monitoring

## Overview

When reporting issues from cron jobs or scheduled tasks for the esggo-auto-repair Worker queue consumer, use the standardized OmniTag format for consistent monitoring and alerting.

## Format Structure

```
[agent:X][squad:GROUP][lifecycle:STATE][p1-p4][platform:TYPE][best-practice:STATUS]
```

## Fields

| Field | Values | Description |
|-------|--------|-------------|
| **agent** | 13 | Agent number for queue consumers |
| **squad** | 光之羽翼 | Consumer team name |
| **lifecycle** | active, degraded, completed | Current operational state |
| **priority** | p1, p2, p3, p4 | Issue severity (p1=critical) |
| **platform** | vps, worker, desktop, cli | Execution environment |
| **best-practice** | awakened, compliant, needs-improvement | Status compliance |

## Example Usage

### Secrets Not Configured (Critical Issue)
```
[agent:13][squad:光之羽翼][lifecycle:active][p1][platform:vps][best-practice:awakened]
```

### Queue Backlog Detected
```
[agent:13][squad:光之羽翼][lifecycle:degraded][p1][platform:vps][best-practice:awakened]
```

### DLQ Has Messages (High Priority)
```
[agent:13][squad:光之羽翼][lifecycle:active][p2][platform:vps][best-practice:awakened]
```

### Consumer Not Processing
```
[agent:13][squad:光之羽翼][lifecycle:degraded][p1][platform:vps][best-practice:awakened]
```

## Health Check Interpretation

When using the health endpoint `curl -s https://esggo-auto-repair.dingjunhong1028.workers.dev/health | jq`, interpret results as follows:

| Health Field | True Value | False Value | OmniTag Implication |
|--------------|------------|-------------|---------------------|
| `status` | "ok" | Worker not running | [lifecycle:degraded] |
| `queue` | true | Binding missing | [p1] |
| `webhookConfigured` | true | WEBHOOK_SECRET missing | [p1][platform:vps] |
| `patConfigured` | true | REPAIR_PAT missing | [p1][platform:vps] |

## Common Scenarios and OmniTag Responses

### Scenario 1: All Secrets Missing
```bash
# Health check shows:
# {"status":"ok","queue":true,"webhookConfigured":false,"patConfigured":false}

# OmniTag report:
[agent:13][squad:光之羽翼][lifecycle:active][p1][platform:vps][best-practice:awakened]
```

### Scenario 2: Worker Not Running
```bash
# Health check shows:
# {"status":"error","queue":false,"webhookConfigured":false,"patConfigured":false}

# OmniTag report:
[agent:13][squad:光之羽翼][lifecycle:degraded][p1][platform:vps][best-practice:needs-improvement]
```

### Scenario 3: Everything Healthy
```bash
# Health check shows:
# {"status":"ok","queue":true,"webhookConfigured":true,"patConfigured":true}

# OmniTag report:
[agent:13][squad:光之羽翼][lifecycle:active][p4][platform:vps][best-practice:compliant]
```

## Integration with Monitoring Systems

Use OmniTag format in:
- Telegram alerts
- Discord notifications
- Log entries
- Monitoring dashboards
- Incident reports

## Related Skills

- `hermes-usage-best-practices` - Cron job patterns and reporting
- `tool-availability-contexts` - Tool availability across execution contexts
- `cloudflare-queue-consumer` - Queue consumer management