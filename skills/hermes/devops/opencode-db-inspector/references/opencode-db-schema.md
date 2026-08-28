# opencode.db schema map (captured 2026-08-06, host dingj/Windows)

DB path: `C:\Users\dingj\.local\share\opencode\opencode.db` (~361 MB, XDG-style data dir)
mtime observed: 2026-08-04 21:54:54

## Full table inventory (row counts at capture)
| table | rows | note |
|-------|------|------|
| account | 0 | |
| account_state | 0 | (id, active_account_id, active_org_id) |
| control_account | 0 | |
| credential | 0 | |
| data_migration | 0 | ledger, normally empty |
| event | 88968 | append-only log |
| event_sequence | 39 | WATERMARK per session |
| message | 7145 | canonical messages |
| migration | 38 | all have time_completed |
| part | 29402 | message parts |
| permission | 0 | |
| project | 5 | |
| project_directory | 3 | |
| session | 102 | canonical sessions |
| session_context_epoch | 0 | |
| session_input | 0 | |
| session_message | 0 | legacy link table, expected empty |
| session_share | 0 | |
| todo | 45 | |
| workspace | 0 | |

## Watermark columns
`event_sequence(aggregate_id TEXT, seq INTEGER, owner_id TEXT)`
`event(id TEXT, aggregate_id TEXT, seq INTEGER, type TEXT, data TEXT)`

Watermark check SQL:
```sql
-- lag: watermark behind actual max event seq
SELECT es.aggregate_id, es.seq, MAX(e.seq) AS max_seq
FROM event_sequence es
JOIN event e ON e.aggregate_id = es.aggregate_id
GROUP BY es.aggregate_id
HAVING es.seq < MAX(e.seq);
```

## Orphan-FK check
```sql
SELECT COUNT(*) FROM message
WHERE session_id NOT IN (SELECT id FROM session);   -- expect 0
```

## Migration applied check
```sql
SELECT COUNT(*) FROM migration WHERE time_completed IS NULL;   -- expect 0
```

## Notes
- `message` has 7145 rows across 97 distinct sessions (5 sessions carry no messages — fine).
- `event_sequence` has exactly 39 entries, all matching real session ids, all with
  `seq == MAX(event.seq)` → 0 lag at capture. This is the "state.db 水位" the monitor
  compares against; there is NO separate opencode state.db on this host (only Hermes's
  own `AppData\Local\hermes\state.db`, unrelated).
- `session_message` = 0 is expected; the live store is `message`, not `session_message`.
