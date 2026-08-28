---
name: crewai-oa-swarm
category: autonomous-ai-agents
description: Build OA-Team 30 swarm as a CrewAI JSON-first crew.
tags: swarm, crewai, oa-team, esggo, multi-agent, json-first
---

# CrewAI OA-Team 30 萬能蜂群

Use this when the user wants to implement the OA-Team 30-agent swarm (from `soul.md`) as a
**CrewAI** crew, or more generally when building a CrewAI JSON-first multi-agent project
under Windows + uv with a non-OpenAI LLM behind LiteLLM.

## When to use
- User pastes CrewAI docs (installation / build-with-ai / skills / quickstart / CLI / LLM-connection) AND wants a working 30-agent swarm.
- Building `crew.jsonc` + `agents/*.jsonc` projects that must pass `crewai.project.load_crew`.
- Routing `tencent/hy3:free` / Nous / OpenRouter through CrewAI via LiteLLM.

## Architecture (soul.md → CrewAI)
5 squads × 6 agents = 30. `crew.jsonc` lists all 30 in `agents[]` and 5 sequential tasks;
each task's `agent` is the squad representative (sage_01 / rune_07 / wing_13 / forge_19 / verify_25).
See `references/crewai-oa-team-swarm.md` for the full mapping and the verified file tree.

## Critical pitfalls (Windows + uv + CrewAI 1.15.12)
1. **Python version** — CrewAI needs `>=3.10,<3.14`. If host python is 3.14.x, `python3 main.py`
   says `No module named 'crewai'`. Fix: `uv python install 3.13` and run with the crewai tool's
   own interpreter: `~/AppData/Roaming/uv/tools/crewai/Scripts/python.exe`.
2. **PYTHONPATH pollution** — Hermes venv's broken pydantic leaks in via PYTHONPATH and breaks crewai
   import (`No module named 'pydantic_core._pydantic_core'`). Fix: prefix every run with `env -u PYTHONPATH`.
3. **litellm missing** — non-native models error `LiteLLM fallback package is not installed`.
   Fix: `uv tool install crewai[litellm] --python 3.13`.
4. **JSON-first field limits** — `crew.jsonc` must NOT have `description`; agent JSONC must NOT have
   `soul_id`/`squad`/`tags`/`tools` (unless the `custom:` tool file exists under `tools/`).
   Put metadata in `//` comment lines. Otherwise `JSONProjectValidationError`.
5. **Model routing** — bare `tencent/hy3:free` is misread as Tencent-native (`TencentException`).
   Use `openai/<model>` prefix + `LLM(base_url=..., api_key=...)`, or set `OPENAI_API_BASE`/`OPENAI_API_KEY`.
6. **`crewai run` CLI** — 1.15.12 expects a `run_crew` script entrypoint we don't have
   (`Failed to spawn: run_crew`). Don't use the CLI; call `load_crew(Path('crew.jsonc')).kickoff(inputs=...)` from `main.py`.
7. **load_crew hangs on bad endpoint** — an unreachable LLM base_url makes `load_crew` stall 260s+
   while instantiating per-agent LLM objects. For structure-only verification, point
   `OPENAI_API_BASE=http://127.0.0.1:9` (closed port) → fails fast in ~20s and still proves CrewAI
   accepts the JSON.
8. **Default model 404** — if no `llm` is set, crewai 0.175 falls back to `DEFAULT_LLM_MODEL="gpt-4.1-mini"`
   (constants.py:348) and errors `Model gpt-4.1-mini not found`. `OPENAI_MODEL_NAME` / `OPENAI_API_KEY` do NOT override it.
   Fix: add an `llm` field to each agent JSONC (`{"model":"openai/qwen2.5:3b-instruct-q4_K_M","base_url":"http://localhost:11434/v1","api_key":"dummy"}`)
   OR inject via an execution-time wrapper. NOTE §19: the committed `agents/*.jsonc` MUST stay env-driven (no hardcoded Ollama);
   if you find 30 jsonc hardcoded to `gemma4:latest@localhost:11434`, `git checkout -- oa-team-crewai/agents/ oa-team-crewai/gen_agents.py` to restore.
9. **Reasoning model → CrewAI empty response** — `gemma4` is a reasoning model; its OpenAI endpoint returns `content:""`
   (answer sits in `reasoning`), so CrewAI's `call_llm_native_tools` raises `ValueError: Invalid response from LLM call - None or empty`.
   Fix: use a non-reasoning local model `qwen2.5:3b-instruct-q4_K_M` (already on Ollama). gemma4 8B also crashes Ollama under long CPU runs.
10. **Ollama `/v1` cold start** — after an Ollama restart the first `/v1/chat/completions` can lag 12s+ (curl sees HTTP=000);
   `/api/tags` being up doesn't mean `/v1` is warm. Warm up with one `/v1/models` or `/api/tags` call, wait ~5s, then run.

## Verification ladder (honest, no fake "pass")
- Level 1 (no crewai): parse `crew.jsonc` + 30 `agents/*.jsonc` with a jsonc-stripping reader; assert counts/fields.
- Level 2 (crewai import): `python -c "import main; main.OATeamFlow()"` — proves Flow wiring.
- Level 3 (crewai load_crew): `load_crew(Path('crew.jsonc'))` with fast-fail base_url → proves CrewAI accepts structure (30 agents / 5 tasks).
- Level 4 (real LLM): `crew.kickoff(inputs=...)` — REQUIRES a reachable LLM endpoint. If DNS/key fails,
  report it as environment-blocked, never claim "verified" for level 4.

## References
- `references/crewai-oa-team-swarm.md` — full pitfall table, squad→agent map, run command, VPS port map, current block (Nous DNS).
- `templates/crew.jsonc` — known-good JSON-first crew (30 agents, 5 tasks, sequential).
- `scripts/gen_agents.py` — idempotent 30-agent generator from the 5-squad spec (writes soul_id/squad/tags/tools into `//` comments).
