# OA-Team 30 Swarm — Quick Start Guide

## Prerequisites

1. **Hermes Agent v0.19.0+**
   ```bash
   hermes --version
   ```

2. **Python 3.11+**
   ```bash
   python3 --version
   ```

3. **Required Libraries**
   ```bash
   pip install requests
   ```

4. **Communication Credentials**
   - Telegram bot token and chat ID
   - Slack webhook URL or Web API token

## Quick Deployment

### Step 1: Verify Environment
```python
# Run environment check
python -c "
import requests, json, datetime
print('Python OK')
print('requests:', requests.__version__)
print('json:', json.__version__)
print('datetime:', datetime.__version__)
"
```

### Step 2: Create Data Directories
```bash
mkdir -p /tmp/oateam-data /tmp/oateam-metrics /tmp/oateam-templates /tmp/oateam-scripts
```

### Step 3: Deploy Cron Templates
```bash
# Copy templates from skill directory
cp ~/AppData/Local/hermes/skills/oa-team-swarm/templates/*.md /tmp/oateam-templates/
```

### Step 4: Deploy Scripts
```bash
# Copy scripts from skill directory
cp ~/AppData/Local/hermes/skills/oa-team-swarm/scripts/*.py /tmp/oateam-scripts/
chmod +x /tmp/oateam-scripts/*.py
```

### Step 5: Test Communication
```bash
# Test Telegram
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage" \
  -d "chat_id=<YOUR_CHAT_ID>" \
  -d "text=OA-Team 30 Swarm test message"

# Test Slack
curl -X POST <YOUR_SLACK_WEBHOOK> \
  -H "Content-Type: application/json" \
  -d '{"text":"OA-Team 30 Swarm test message"}'
```

### Step 6: Deploy First Cron Job
```bash
# Create monitoring cron job
npx celestial-command \
  --awaken=OA-Team-Monitor \
  --soul=HermesAgent \
  --protocol=5T \
  --entropy-control=0.1 \
  --status=4Can1Cannot \
  --deliver telegram:-1001234567890:17585 \
  --schedule="30m" \
  "Check https://api.example.com/health. If no changes, reply [SILENT]."
```

### Step 7: Validate
```bash
# Run job immediately
/cron run <job_id>

# Check output
ls ~/.hermes/cron/output/<job_id>/
```

## Swarm Deployment

### Phase 1: Environment (3 agents)
Spawn 3 agents with these goals:
1. Environment verification
2. Cron template creation
3. Communication channel testing

### Phase 2: Data Collection (8 agents)
Spawn 8 agents for:
1. GitHub API monitoring
2. Google Analytics data
3. Twitter API monitoring
4. RSS feed aggregation
5. Stock market data
6. Weather API monitoring
7. News API monitoring
8. Social media metrics

### Phase 3: Analysis (8 agents)
Spawn 8 agents for:
1. Anomaly detection
2. Trend analysis
3. Predictive modeling
4. Sentiment analysis
5. Statistical summaries
6. Data cleaning
7. Correlation analysis
8. Insight extraction

### Phase 4: Reporting (8 agents)
Spawn 8 agents for:
1. Daily summaries
2. Anomaly alerts
3. Weekly reports
4. Monthly reports
5. Dashboard updates
6. Telegram messages
7. Slack notifications
8. Data visualizations

### Phase 5: Coordination (3 agents)
Spawn 3 agents for:
1. Task scheduling
2. Quality control
3. Error recovery

## Common Issues

### Issue: HTTP 503 from API
**Solution**: The API is temporarily unavailable. Implement retry with exponential backoff.

### Issue: Telegram 401 Unauthorized
**Solution**: Verify bot token is correct. Check bot has access to the chat.

### Issue: Slack webhook returns 404
**Solution**: Verify webhook URL is correct. For threading, use Web API instead.

### Issue: [SILENT] not working
**Solution**: Ensure the exact string "[SILENT]" is in the prompt. Check if data actually changed.

### Issue: Cron job not running
**Solution**: Check schedule expression syntax. Verify job is enabled. Check gateway logs.

## Next Steps

1. Customize data sources for your specific needs
2. Configure alert thresholds
3. Set up dashboard integrations
4. Implement backup and recovery procedures
5. Monitor swarm performance and optimize

For full documentation, see `references/complete-reference.md`
