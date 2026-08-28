# The `/c/...` MSYS path trap applies to `python3`, not just `gh` — and it exits 0

Discovered 2026-08-08 12:47Z cron turn, while dispatching the Telegram digest.

## Symptom

```bash
python3 /c/Users/dingj/AppData/Local/hermes/scripts/_send_tg_alert.py
```
```
C:\Users\dingj\AppData\Local\Python\pythoncore-3.14-64\python.exe: can't open file
'C:\\c\\Users\\dingj\\AppData\\Local\\hermes\\scripts\\_send_tg_alert.py':
[Errno 2] No such file or directory
```
`exit_code: 0`.

## Why it matters more than the `gh -F` version

SKILL.md already documents that `gh` rejects the MSYS drive form because `gh` is a **native Windows
binary** with no access to the MSYS mount table. The Python launcher on this host is the same kind of
binary, so `/c/Users/...` is passed through literally and Windows resolves it as a **relative** path
against the current drive → `C:\c\Users\...`.

The dangerous part is the **exit code**. The wrapper reports `exit_code: 0` because the failure is
Python's own "file not found" message on stdout/stderr rather than a shell-level error. Any retry
loop keyed on `$?` — the pattern the skill recommends for TLS flakiness — will conclude the digest
was delivered when nothing was sent. The Telegram channel then goes silently dark while the GitHub
audit trail looks complete.

## Rule

Invoke every native Windows binary with the drive-letter form, quoted:

```bash
python3 "C:/Users/dingj/AppData/Local/hermes/scripts/_send_tg_alert.py"
python3 "C:/Users/dingj/AppData/Local/hermes/scripts/gh-error-watch.py"
```

And require a positive success marker in the output, never the exit code:

| Command | Marker that proves it worked |
| --- | --- |
| `_send_tg_alert.py` | `ok: True message_id: <n>` |
| `gh-error-watch.py` | a parseable JSON object with `action` |
| `gh issue comment -F` | the returned `#issuecomment-<id>` URL |

Note the cron prompt itself already uses the correct quoted drive-letter form for the watcher
(`python3 "C:/Users/dingj/AppData/Local/hermes/scripts/gh-error-watch.py"`), which is why the watcher
never exhibited this — only hand-written follow-up calls do.

## Affected class of commands

Anything not built by MSYS: `gh`, `python3`/`python`, `node`, `powershell.exe`, `wrangler`, `firebase`.
MSYS-native tools (`grep`, `sed`, `wc`, `git`) accept `/c/...` fine, which is exactly what makes the
mixed pipeline in a normal cron turn so easy to get wrong — `wc -c /c/path` succeeds on the line
directly above a `python3 /c/path` that silently fails.
