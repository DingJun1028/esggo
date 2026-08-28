# CrewAI 4-Mode Validation — Full Recipe (crewai 1.15.17, Windows venv)

## Four modes
1. **JSON-first** (`main_json.py`): `from crewai.project import load_crew`. Returns **tuple** → `crew = load_crew()[0]`.
2. **Python** (`main_python.py`): explicit `Agent`/`Task`/`Crew`, `build()` returns Crew.
3. **Flows** (`main_flows.py`): `OATeamFlow()` class + `@start`/`@listen`. **No `build()` function.**
4. **Hierarchy** (`main_hierarchy.py`): built from `swarm_spec`, 30 agents, `process="hierarchical"`.

## L1 — Structure
agents 30/30, tasks 5/5, 5 squads × 6. `strip_jsonc` deletes only line-leading `//`; never URL `//`.

## L2 — py_compile
`python -m py_compile main_json.py main_python.py main_flows.py main_hierarchy.py`

## L3 — Construct (no LLM)
- JSON-first: `crew = load_crew()[0]` → `len(crew.agents)==30`, `len(crew.tasks)==5`.
- Python/Hierarchy: `c = build()` → assert `len(c.agents)`.
- Flows: `f = OATeamFlow()` (construct ONLY — `kickoff()` hangs on unreachable LLM).
- Fast-fail endpoint: `OA_LLM_BASE="http://127.0.0.1:9"` `OA_LLM_KEY="dummy"`.

## L4 — Real kickoff (free compute)
`OA_LLM_MODEL="openai/qwen2.5:3b-instruct-q4_K_M" OA_LLM_BASE="http://127.0.0.1:11434/v1" OA_LLM_KEY="ollama"`
Run via `execute_code` subprocess (terminal cwd locked at `C:\c\Users\dingj`); venv `oa-team-crewai/.venv/Scripts/python.exe`; `env -u PYTHONPATH`. Local CPU 30-agent hierarchy = 10+ min; live process + quiet log = inferring, not stuck.

## Pitfalls
- `from crewai import load_crew` → ImportError → use `crewai.project`.
- `res.agents` → AttributeError → `res[0]`.
- `process="hierarchy"` → ValidationError → `"hierarchical"`.
- Flows `from main_flows import build` → ImportError → `OATeamFlow().kickoff()`.
- Flows kickoff hangs on local Ollama → L3 construct-only.
- terminal `cd "C:/Users/..."` fails under git-bash → `execute_code` subprocess + native `C:\c\Users\...`.
- SSH VPS `Permission denied (publickey)` → verify fingerprint first, don't blind-try keys.
- `taskkill /F` blocked by safety guard → don't retry around it.

## OA-Team L4 results (this session)
- JSON-first: 5/5 Task Completed ✓
- Python: Started=10 Completed=5 ✓
- Flows: `Flow Execution Completed` (5 methods) ✓
- Hierarchy: construct verified (30, hierarchical); full kickoff CPU-limited on local box — VPS Ollama (Oracle Always Free ARM) is the intended fix.
