# Execute-Code File-Writing Escaping Hell + Base64 Bypass

Captured from the OA-Team 30 CrewAI build session. The `execute_code` sandbox
layer rewrites string literals in a way that breaks naive file writes. Symptoms
and the reliable workaround.

## Symptoms (each caused a SyntaxError / truncated file)

1. **f-string `{}` inside content** — markdown tables or JSON with `{` `}` get
   parsed as f-string placeholders → `f-string: closing parenthesis does not match`.
2. **`\n` becomes a literal newline** — writing `f"// {x}\n"` or `"\n"` inside a
   generated .py produces a real line break mid-statement → `unterminated string literal`.
3. **`encoding="utf-8"` split** — the literal `"utf-8"` got mangled mid-token
   (`utf` + `-8`) → `NameError` / broken string. Use `ENC = "utf" + "-8"` or pass
   `errors="replace"`.
4. **jsonc `//` eaten** — a `strip_jsonc()` that removes any `//` also deletes the
   `//` inside `"http://127.0.0.1:9"` in a JSON value → `Invalid control character`.
   Fix: only strip `//` when it is the FIRST non-whitespace token of the line.
5. **List-element quoting** — building a file as a list of strings and `write()`-ing
   it added stray surrounding quotes (`'    if len(ag)...'`) → invalid Python.
6. **Stray imports** — forgetting `import os` in the harness snippet → `NameError`.
7. **rglob crashes** on broken symlinks (`node_modules/.pnpm/...`) → `FileNotFoundError`.
   Use exact `Path(...).exists()` checks, never recursive scans over OneDrive trees.

## Reliable workaround: BASE64

Encode the desired file content as base64 inside the sandbox, then decode+write.
This sidesteps every literal-escaping trap because the sandbox never sees the
real `"`, `\n`, `{`, or `//` characters in your source.

```python
import base64
from pathlib import Path
raw = "..."  # the EXACT file content, as a normal Python string here
b64 = base64.b64encode(raw.encode("utf-8")).decode("ascii")
# later, in the same or next cell:
decoded = base64.b64decode(b64).decode("utf-8")
Path(r"C:\c\Users\dingj\oa-team-crewai\verify_level1.py").write_text(decoded, encoding="utf-8")
```

For JSON configs, build the dict, `json.dumps` it, then base64 the result —
never hand-write JSON with `{}` inside an f-string.

## Terminal cwd wedge (Windows)

Host cwd can wedge to a dead path (`C:\c\Users\dingj`); git-bash `/c/Users/...`
and `C:/Users/...` both fail with `No such file or directory`; `cd /d` is cmd-only.
Drive the venv interpreter directly from `execute_code`:

```python
import subprocess, os
cwd = Path(r"C:\c\Users\dingj\oa-team-crewai")
venv_py = cwd / ".venv" / "Scripts" / "python.exe"
env = {k: v for k, v in os.environ.items() if k != "PYTHONPATH"}  # clear PYTHONPATH (crewai pitfall)
env.update({"OPENAI_API_BASE": "http://127.0.0.1:11434/v1", "OPENAI_API_KEY": "ollama"})
subprocess.Popen([str(venv_py), str(cwd / "main_json.py")], cwd=str(cwd), env=env,
                 stdout=open(cwd / "run.log", "w"), stderr=subprocess.STDOUT)
```

Then poll `run.log` from `execute_code` (it can read the real file even when the
terminal cannot cd there).
