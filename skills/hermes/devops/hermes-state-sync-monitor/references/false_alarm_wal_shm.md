# False-alarm narrative: WAL/SHM mtime misread (2026-08-06)

## What happened
The 13:04 UTC run of `opencode-vps-sync` (this same checker) concluded **"🔴 橋接斷裂 (bridge break)"**,
citing: *"本機 opencode 仍在活躍使用：opencode.db 的 WAL 檔 mtime 為 2026-08-06 13:03（即時寫入中）"*.

The 13:25 UTC run re-verified and found that claim FALSE:
- `opencode.db` **main file** mtime = 2026-08-04 13:54:54 UTC (unchanged ~40h)
- `opencode.db-wal` = **0 bytes** (already checkpointed/emptied)
- `opencode.db-shm` mtime was indeed fresh (13:22) but that only reflects a DB **open**, not a write

⇒ Local opencode was **idle**, not "actively writing". Staleness was **benign**, not a bridge break.
The 13:25 run corrected the classification and downgraded severity.

## Why the trap exists
SQLite touches `-shm` (shared memory) and `-wal` (write-ahead log) files on **every connection**,
including read-only opens. Their mtime therefore updates whenever the DB is merely *opened*,
even when zero bytes are written. Only two signals prove actual writes:
1. The **main `.db` file** mtime advancing, OR
2. The **`-wal` file size > 0** (uncheckpointed pending writes).

## Rule
Never infer "actively writing" from `-shm`/`-wal` mtime. Check main-file mtime + `-wal` byte size.
If main mtime is old AND `-wal` = 0 bytes → DB is idle → stale watermark is benign.
