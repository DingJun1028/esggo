import sqlite3, os, sys

# Background-safe state.db shrink: disable cjk_fts trigram bloat, DROP the
# trigram FTS5 virtual table (FTS5 auto-drops its shadow/trigger tables), then
# VACUUM to reclaim space. Run via:
#   terminal(background=True, notify_on_complete=True,
#            command="python <path>/state_db_shrink.py")
# NEVER run DROP/VACUUM in foreground — it gets interrupted (exit 130, turn-lease).

DB = r'C:/Users/dingj/AppData/Local/hermes/state.db'
LOG = r'C:/Users/dingj/AppData/Local/hermes/scripts/state_db_shrink.log'

def main():
    log = []
    try:
        size_before = os.path.getsize(DB) / 1024 / 1024
        log.append('size MB before: %.1f' % size_before)

        # 1. DROP trigram virtual table
        c = sqlite3.connect(DB)
        try:
            c.execute('DROP TABLE messages_fts_trigram')
            log.append('dropped messages_fts_trigram OK')
        except Exception as e:
            log.append('drop err: ' + repr(e))
        remain = c.execute("SELECT name FROM sqlite_master WHERE name LIKE '%trigram%'").fetchall()
        log.append('remaining trigram: ' + str(remain))
        c.commit()
        c.close()

        # 2. VACUUM to reclaim space
        c = sqlite3.connect(DB)
        c.execute('VACUUM')
        c.commit()
        c.close()

        size_after = os.path.getsize(DB) / 1024 / 1024
        log.append('size MB after: %.1f' % size_after)
        log.append('reclaimed MB: %.1f' % (size_before - size_after))
        log.append('DONE')
    except Exception as e:
        log.append('FATAL: ' + repr(e))
    with open(LOG, 'w', encoding='utf-8') as f:
        f.write('\n'.join(log))
    print('\n'.join(log))

if __name__ == '__main__':
    main()
