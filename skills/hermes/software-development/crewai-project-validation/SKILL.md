---
name: crewai-project-validation
description: Validating CrewAI projects — L1–L4 ladder and pitfalls.
---

# Crewai Project Validation

Use when a CrewAI project must be proven correct beyond "it compiles" — e.g. OA-Team 30-agent swarms, or any multi-mode crew. Empirical ladder validated against crewai 1.15.17 on Windows venv.

## When to load
- Building/validating a CrewAI crew, flow, or hierarchy.
- `load_crew` import errors, `AttributeError` on crew, `ValidationError` on process.
- Need to prove a crew builds/runs without hand-waving.

## The L1–L4 ladder

**L1 — Structure (jsonc parse).** Count agents/tasks; verify squad arrays. `strip_jsonc` must delete ONLY line-leading `//` comments — never `//` inside URLs (`http://`, `https://` get mangled).

**L2 — py_compile.** `python -m py_compile main_*.py`. Syntax gate only.

**L3 — Construct (no LLM kickoff).** Build the object, assert shape:
- JSON-first: `from crewai.project import load_crew` (NOT `from crewai import load_crew`). Returns a **tuple** → `crew = load_crew()[0]`. Assert `len(crew.agents)==30`, `len(crew.tasks)==5`.
- Python/Hierarchy: `from main_python import build; c = build()`. Assert `len(c.agents)`.
- Flows: `from main_flows import OATeamFlow; f = OATeamFlow()` — **construct only**. Do NOT call `kickoff()`: Flow kickoff initializes a default-LLM connection and hangs if the endpoint is unreachable.
- Use a fast-fail endpoint `OA_LLM_BASE="http://127.0.0.1:9"` + `OA_LLM_KEY="dummy"` so construct doesn't block on network.

**L4 — Real kickoff (free compute).** Point at a reachable Ollama: `OA_LLM_MODEL="openai/qwen2.5:3b-instruct-q4_K_M" OA_LLM_BASE="http://127.0.0.1:11434/v1" OA_LLM_KEY="ollama"`. Local CPU running 30-agent hierarchy takes 10+ min; a quiet log with a live process = CPU inferring, not stuck.

## Pitfalls (crewai 1.15.17, Windows)
- `from crewai import load_crew` → ImportError. Use `crewai.project`.
- `res.agents` → AttributeError (it's a tuple). Use `res[0]`.
- `process="hierarchy"` → ValidationError. Use `"hierarchical"`.
- Flows `from main_flows import build` → ImportError. Use `OATeamFlow().kickoff()` (no `inputs` arg).
- Flows kickoff hangs on local Ollama → L3 construct-only; full kickoff only when endpoint is fast/reachable.
- terminal `cd "C:/Users/..."` fails under git-bash cwd lock → drive via `execute_code` subprocess with native `C:\c\Users\...` paths; venv at `oa-team-crewai/.venv/Scripts/python.exe`; run with `env -u PYTHONPATH` (PYTHONPATH pollution breaks `load_crew`).
- SSH to VPS `Permission denied (publickey)` → do NOT blindly try many keys; `ssh-keygen -lf` to verify fingerprint against the trusted key first.
- `taskkill /F` to terminate a process is blocked by the safety guard (needs explicit consent) → do not retry around it.

## Safe git-from-fragment pattern
User-pasted git snippets are often pseudo-code (`@url:` markdown, `<your-username>` placeholders). Never `git init` in the cwd root (pollutes the user dir). Instead: (1) create an isolated project dir, (2) `git init` there, (3) resolve `<your-username>` from `git config user.name`, (4) GET-probe `https://api.github.com/repos/<owner>/<repo>` before push — if 404, `gh repo create` (gh auth already in keyring) then `git remote add` + `branch -M main` + `push -u`. CI DockerHub secrets (DOCKERHUB_USERNAME/TOKEN) must be set by the user in GitHub UI — never handle those credentials.

See `references/crewai-4mode-validation.md` for the full L1–L4 recipe and the OA-Team-specific matrices.
