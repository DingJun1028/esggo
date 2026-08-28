# Watermark keys & opencode.db schema (observed 2026-08-06)

## Hermes `state.db` → `state_meta` table
All sync watermarks live here as `key,value` (value is epoch-**ms** string for time keys).

Full key inventory seen (6 keys total):
| key | kind | note |
|---|---|---|
| `opencode_local_last_sync` | epoch-ms | local→Hermes sync watermark |
| `opencode_vps_last_sync` | epoch-ms | local→VPS sync watermark |
| `telegram_vps_bridge_last_id` | counter (int) | Telegram bridge last msg id — **NOT a timestamp**, never age it |
| `fts_optimize_available` | flag (1) | unrelated |
| `ghost_session_prune_v1` | flag (1) | unrelated |
| `orphaned_compression_finalize_v1` | flag (1) | unrelated |

Decode epoch-ms: `datetime.fromtimestamp(int(v)/1000, timezone.utc)`. Age hours = `(now_ms - int(v))/3_600_000`.

## opencode.db (local session store)
Default path (Windows/MSYS): `~/.local/share/opencode/opencode.db`
Fallback: `%LOCALAPPDATA%/../opencode/opencode.db`

Relevant tables (counts observed 2026-08-06):
| table | rows | role |
|---|---|---|
| `session` | 102 | opencode sessions |
| `message` | 7,145 | messages |
| `part` | 29,402 | message parts |
| `event` | 88,968 | events |
| `event_sequence` | 39 | **internal watermark table** (aggregate_id → max seq) |

`PRAGMA integrity_check` → ok. No orphan messages. Internal watermarks all MATCH actual max(seq) → DB internally consistent & idle.

## Worked numbers (2026-08-06 05:25 UTC)
- `opencode_local_last_sync` = 1785848375661 → 2026-08-04 12:59:35 UTC → age **40.46 h**
- `opencode_vps_last_sync` = 1785848784845 → 2026-08-04 13:06:24 UTC → age **40.35 h**
- `opencode.db` main mtime = 2026-08-04 13:54:54 UTC (idle ~40.4 h)
- `opencode.db-wal` = **0 bytes** (checkpointed/empty) → no pending writes
- `opencode.db-shm` mtime fresh (touched on open, NOT a write signal)

⇒ Both watermarks stale BUT benign: source DB idle, WAL empty, nothing to sync.
