---
name: swarm-deployment
category: autonomous-ai-agents
description: Deploy and manage multi-agent swarms using Hermes Agent delegation with phased rollout, background monitoring, and cross-platform compatibility
tags: swarm, multi-agent, delegation, monitoring, deployment, windows-paths
---

# Swarm Deployment Pattern

## Overview

A methodology for deploying multi-agent AI swarms using Hermes Agent's `delegate_task` capability. This pattern handles phased rollout, background monitoring, and cross-platform compatibility issues.

## When to Use

- Deploying 3+ agent swarms for monitoring, data collection, or analysis
- Coordinating multi-phase workflows with dependencies
- Operating on Windows hosts where path handling differs from Linux
- Needing background monitoring of parallel agent execution

## Phased Deployment

### Phase Structure
1. **Phase 1: Environment Setup** (3 agents) — Verify environment, create templates, test communication
2. **Phase 2: Data Collection** (8 agents) — Collect from APIs, RSS, social media, market data
3. **Phase 3: Data Analysis** (8 agents) — Anomaly detection, trend analysis, predictive modeling
4. **Phase 4: Reporting** (8 agents) — Daily summaries, alerts, dashboard updates
5. **Phase 5: Coordination** (3 agents) — Task scheduling, quality control, error recovery

### Deployment Pattern
```python
# Deploy 3 agents in parallel per phase
delegate_task(goal="Phase 1 Agent 1: ...", role='leaf')
delegate_task(goal="Phase 1 Agent 2: ...", role='leaf')
delegate_task(goal="Phase 1 Agent 3: ...", role='leaf')

# Wait for completion before next phase
# Check live transcripts or wait for async batch completion
```

## Background Monitoring

### Live Transcript Paths
Each delegated agent streams to:
```
C:\Users\dingj\AppData\Local\hermes\cache\delegation\live\{delegation_id}\task-0.log
```

### Monitoring Commands
```bash
# Check progress
tail -5 C:/Users/dingj/AppData/Local/hermes/cache/delegation/live/{delegation_id}/task-0.log

# Wait for completion
tail -5 .../task-0.log | grep -E "(completed|finished|DONE|final)"

# Check for errors
grep -i "error\|fail\|exception" .../task-0.log
```

### Expected Timing
- **Phase 1 agents**: 3-5 minutes (environment checks, file creation)
- **Phase 2+ agents**: 1-2 minutes (data collection, analysis)
- **Total swarm deployment**: 15-25 minutes

## Cross-Platform Path Handling

### Windows Path Mapping
On Windows hosts, the bash shell maps `/c/` to `C:\`:
- ✅ Use `/c/tmp/oateam-data/` for Windows
- ❌ Avoid bare `/tmp/oateam-data/` (fails on Windows)

### Script Configuration
```python
import os, platform

BASE_DIR = '/c/tmp/oateam-data' if platform.system() == 'Windows' else '/tmp/oateam-data'
```

### Verification
Always test scripts before deployment:
```bash
python C:/tmp/oateam-scripts/monitor_health.py
ls -la C:/tmp/oateam-data/
```

## Error Handling

### Model Capacity Errors (HTTP 503)
- Agents may exhaust iteration budgets despite completing tasks
- **Always verify file outputs** were created even if final summary failed
- Check live transcripts for actual completion status

### Agent Completion Verification
```bash
# Check if expected output files exist
ls -la /c/tmp/oateam-data/
ls -la /c/tmp/oateam-templates/

# Verify script outputs
python /c/tmp/oateam-scripts/monitor_health.py
```

## Pitfalls

### 1. Windows Path Mismatch
**Problem**: Scripts using `/tmp/` fail on Windows with "No such file or directory"
**Fix**: Use `/c/tmp/` paths or platform-aware configuration

### 2. Model Capacity Exhaustion
**Problem**: HTTP 503 errors cause agents to exhaust iteration budgets
**Fix**: Verify file outputs independently; the agent may have completed work before the error

### 3. Silent Failures
**Problem**: Agents may appear to complete but fail to create expected files
**Fix**: Always verify outputs with `ls` or file existence checks

### 4. Phase Dependencies
**Problem**: Deploying Phase 2 before Phase 1 completes causes failures
**Fix**: Wait for Phase 1 completion (check live transcripts) before proceeding

## Related Skills

- `autonomous-ai-agents/hermes-agent` — Hermes Agent configuration and troubleshooting
- `oa-team-swarm` — Full OA-Team 30 swarm architecture and templates