# OA-Team 30 萬能蜂群 — Complete Reference

## Swarm Architecture

### Phase 1: Environment Setup (Agents 1-3)
| Agent | Role | Key Tasks |
|-------|------|-----------|
| Agent 1 | Environment Verification | Python, libraries, Hermes CLI, filesystem, network |
| Agent 2 | Cron Template Creation | Monitoring, data collection, reporting templates |
| Agent 3 | Communication Testing | Slack, Telegram, error handling, threading |

### Phase 2: Data Collection (Agents 4-11)
| Agent | Data Source | Collection Method |
|-------|-------------|-------------------|
| Agent 4 | GitHub API | Repository metrics, commit activity |
| Agent 5 | Google Analytics | User metrics, traffic data |
| Agent 6 | Twitter API | Social mentions, sentiment |
| Agent 7 | RSS Feeds | News aggregation, blog updates |
| Agent 8 | Stock Market | Price data, market indicators |
| Agent 9 | Weather API | Forecast data, alerts |
| Agent 10 | News API | Breaking news, articles |
| Agent 11 | Social Media | Platform metrics, engagement |

### Phase 3: Data Analysis (Agents 12-19)
| Agent | Analysis Type | Output |
|-------|---------------|--------|
| Agent 12 | Anomaly Detection | Outliers, unusual patterns |
| Agent 13 | Trend Analysis | Directional movements, patterns |
| Agent 14 | Predictive Modeling | Future projections, forecasts |
| Agent 15 | Sentiment Analysis | Emotional tone, opinions |
| Agent 16 | Statistical Summary | Mean, median, variance, etc. |
| Agent 17 | Data Cleaning | Remove duplicates, handle missing values |
| Agent 18 | Correlation Analysis | Relationships between metrics |
| Agent 19 | Insight Extraction | Actionable findings from data |

### Phase 4: Report Delivery (Agents 20-27)
| Agent | Report Type | Delivery Channel |
|-------|-------------|------------------|
| Agent 20 | Daily Summary | Telegram thread |
| Agent 21 | Anomaly Alerts | Telegram + Slack |
| Agent 22 | Weekly Report | Telegram thread |
| Agent 23 | Monthly Report | Telegram + Slack |
| Agent 24 | Dashboard Updates | Slack channel |
| Agent 25 | Telegram Messages | Telegram thread |
| Agent 26 | Slack Notifications | Slack channel |
| Agent 27 | Data Visualizations | Telegram + Slack |

### Phase 5: Coordination (Agents 28-30)
| Agent | Role | Responsibilities |
|-------|------|-----------------|
| Agent 28 | Task Scheduler | Load balancing, timing coordination |
| Agent 29 | Quality Control | Validation, accuracy checks |
| Agent 30 | Error Recovery | Retry mechanisms, failure handling |

## Cron Job Templates

### 1. Silent Monitoring
```bash
npx celestial-command --awaken=OA-Team-Monitor --soul=HermesAgent \
  --protocol=5T --entropy-control=0.1 --status=4Can1Cannot \
  --deliver telegram:-1001234567890:17585 --schedule="30m" \
  "Check https://api.example.com/health. If no changes, reply [SILENT]."
```

### 2. Data Collection
```bash
npx celestial-command --awaken=OA-Team-Collector --soul=HermesAgent \
  --protocol=5T --entropy-control=0.1 --status=4Can1Cannot \
  --deliver telegram:-1001234567890:17585 --schedule="*/15 * * * *" \
  "Fetch from https://api.example.com/data. Parse JSON, validate, save to /tmp/oateam-data/. If unchanged, reply [SILENT]."
```

### 3. Reporting
```bash
npx celestial-command --awaken=OA-Team-Reporter --soul=HermesAgent \
  --protocol=5T --entropy-control=0.1 --status=4Can1Cannot \
  --deliver telegram:-1001234567890:17585 --schedule="0 18 * * *" \
  "Compile daily report from /tmp/oateam-data/. Generate Markdown summary. If no changes, reply [SILENT]."
```

## Scheduling Reference

### Relative Delays
- `30m` — Every 30 minutes
- `1h` — Every hour
- `2h` — Every 2 hours

### Intervals
- `every 2h` — Every 2 hours
- `every 30m` — Every 30 minutes

### Standard Cron Expressions
- `0 9 * * *` — Daily at 9 AM
- `0 18 * * *` — Daily at 6 PM
- `0 6 * * 1` — Every Monday at 6 AM
- `*/15 * * * *` — Every 15 minutes
- `0 */6 * * *` — Every 6 hours
- `0 8 * * 1-5` — Weekdays at 8 AM

### ISO Timestamps
- `2025-06-15T09:00:00` — One-shot execution

## Delivery Configuration

### Telegram
```
--deliver telegram:-1001234567890:17585
```
- Channel ID: `-1001234567890`
- Thread ID: `17585`

### Slack
```
--deliver slack
```
- Uses default channel from gateway configuration
- For threading, use Web API instead of webhooks

### Combined Delivery
```
--deliver telegram:-1001234567890:17585,slack
```

## Error Handling Strategy

### Connection Errors
1. Retry with exponential backoff (max 3 retries)
2. Log error to `/tmp/oateam-data/errors.log`
3. Send alert if persistent failures

### API Errors
1. Parse JSON error responses (Telegram)
2. Handle plain-text errors (Slack)
3. Truncate messages to 4096 chars (Telegram limit)

### Data Validation
1. Check HTTP status codes
2. Validate JSON structure
3. Compare content hashes for change detection

## File Structure

```
/tmp/oateam-data/
├── last_health_check.json
├── collection_state.json
├── primary_api.json
├── metrics_api.json
├── daily_report.md
└── errors.log

/tmp/oateam-metrics/
├── anomaly_report.json
├── trend_analysis.json
├── predictions.json
└── insights.json

/tmp/oateam-templates/
├── monitoring-silent.md
├── data-collection.md
└── reporting.md

/tmp/oateam-scripts/
├── monitor_health.py
├── collect_data.py
└── generate_report.py
```

## Monitoring Commands

### Check Cron Outputs
```bash
ls ~/.hermes/cron/output/{job_id}/{timestamp}.md
```

### View Cron Jobs
```bash
cat ~/.hermes/cron/jobs.json
```

### Gateway Logs
```bash
# Linux
journalctl --user -u hermes-gateway

# macOS
cat ~/.hermes/logs/gateway.log
```

### Session History
```bash
ls ~/.hermes/sessions/
```

## Testing

### Run Cron Job Immediately
```bash
/cron run <job_id>
```

### Test Communication Channels
```python
python ~/swarm_channel_test_harness.py
```

### Validate Templates
```bash
# Check template syntax
python -m json.tool /tmp/oateam-templates/*.md
```

## Deployment Checklist

- [ ] Environment verified (Agent 1)
- [ ] Cron templates created (Agent 2)
- [ ] Communication channels tested (Agent 3)
- [ ] Data collection agents deployed (Agents 4-11)
- [ ] Analysis agents deployed (Agents 12-19)
- [ ] Reporting agents deployed (Agents 20-27)
- [ ] Coordination agents deployed (Agents 28-30)
- [ ] Initial test run completed
- [ ] Monitoring verified
- [ ] Error handling confirmed
