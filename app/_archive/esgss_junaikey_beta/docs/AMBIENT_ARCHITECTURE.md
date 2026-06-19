# Ambient Intelligence Reliability Architecture

## Overview
This document outlines the "Reliability Layer" architecture implemented for the Ambient Sensor Data Ingestion system. This architecture follows enterprise best practices for distributed systems, ensuring zero data loss, flow control, and observability.

## Architectural Patterns

### 1. Outbox Pattern (Transactional Reliability)
**Problem**: Writing to the database and sending a webhook (HTTP) are two distinct operations. If the database write succeeds but the HTTP call fails (frontend/network issues), the systems become inconsistent.
**Solution**:
- **Atomic Transaction**: The `sensor_readings` INSERT and the `outbox_events` INSERT occur in the *same* database transaction via the `tr_sensor_to_outbox` trigger.
- **Guaranteed Consistency**: Check for `is_anomaly`. If true, an even is *always* queued.

### 2. Asynchronous Worker (Decoupling)
**Problem**: Synchronous webhooks increase latency for the IoT ingestion API/DB.
**Solution**:
- **Background Processing**: A `pg_cron` job (running every minute) calls `process_outbox_batch`.
- **Throttling**: The worker processes events in batches (default: 50), preventing downstream flooding (Edge Function/External API).

### 3. Idempotency & Processing Locks
**Mechanism**:
- A boolean flag `processing` prevents multiple worker instances from picking up the same event.
- `processed` flag marks completion.
- Edge Function should handle duplicate IDs gracefully (Idempotency Key = `outbox_id`).

### 4. Dead Letter Queue (Failure Management)
**Logic**:
- **Retries**: Exponential backoff (1m, 4m, 9m...) for transient failures.
- **Circuit Breaking**: maximize attempts = 5.
- **Dead Letter**: Events exceeding max attempts are moved to the `alerts` table. This keeps the active queue clean and allows for manual intervention/auditing.

## Schema Reference

### Tables
- `public.sensor_readings`: Raw data.
- `public.outbox_events`: Event queue.
- `public.alerts`: Failed events (Dead Letter).

### Monitoring Views
- `view_outbox_backlog`: Current queue size (Target: 0).
- `view_outbox_failing`: Stuck events.
- `view_outbox_latency`: Processing performance.

## Maintenance
- **Pruning**: `outbox_events` should be partitioned or periodically pruned (e.g., delete `processed = true` older than 7 days) to maintain performance.
