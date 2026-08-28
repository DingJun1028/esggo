# Docker static verification (no running daemon)

Reusable harness for when `docker build` / `docker compose up` cannot run
(Docker Desktop daemon fails to start, e.g. "Docker Desktop is unable to start"
on WSL2/Hyper-V). Verifies the container config *without* building an image.

Save as `%TEMP%/hermes-verify-dockerfiles.py` (fresh name each run), edit `PROJ`
to the project dir, run with the host venv python, then delete.

```python
import sys, yaml
from pathlib import Path

PROJ = Path(r"C:\Project\aistation")   # <- point at the project
sys.path.insert(0, str(PROJ))

print("=== 1. docker-compose.yml parses + exposes service ===")
comp = yaml.safe_load((PROJ / "docker-compose.yml").read_text(encoding="utf-8"))
svc = comp["services"]["aistation"]
assert svc["image"] == "aistation:latest"
assert "8000:8000" in svc["ports"]
assert svc["volumes"] == ["./storage:/app/storage"]
print("  OK service=aistation ports=", svc["ports"], "volumes=", svc["volumes"])

print("=== 2. Dockerfile COPY/CMD targets exist ===")
df = (PROJ / "Dockerfile").read_text(encoding="utf-8")
for token in ["requirements.txt", "src.app:app", "uvicorn", "ffmpeg"]:
    assert token in df, f"Dockerfile missing {token}"
assert (PROJ / "requirements.txt").exists()
import src.app as app
from fastapi import FastAPI
assert isinstance(app.app, FastAPI)
print("  OK Dockerfile references real requirements.txt + src.app:app (app:", app.app.title, ")")

print("=== 3. .dockerignore sensible ===")
ignore = (PROJ / ".dockerignore").read_text(encoding="utf-8").splitlines()
for entry in [".git", ".venv", "storage", "*.db", ".env"]:
    assert entry in ignore, f".dockerignore missing {entry}"
print("  OK ignored:", [e for e in ignore if not e.startswith('#')])

print("=== 4. compose environment has optional cloud keys (${VAR:-} form) ===")
envs = svc.get("environment", {})
for k in ["HOST", "PORT", "OPENAI_API_KEY", "ELEVENLABS_API_KEY",
          "RUNWAY_API_KEY", "AWS_S3_BUCKET", "NCBDB_TOKEN"]:
    assert k in envs, f"compose environment missing {k}"
print("  OK optional cloud keys wired via", [k for k in envs if k not in ("HOST", "PORT")])

print("AD_HOC_DOCKERFILES_VERIFY_DONE")
print("BLOCKER: real `docker build` not executed - Docker Desktop daemon fails to start on this host.")
```

Notes:
- `pyyaml` must be importable (`pip install pyyaml` in the host venv if absent).
- If keys are **commented out** in compose instead of `${VAR:-}`, step 4's
  assertion fails — that is the real bug this harness catches (commented keys
  are not present as env entries at runtime).
- Always end the run by stating the daemon blocker honestly; never imply a
  successful `docker build` occurred.
