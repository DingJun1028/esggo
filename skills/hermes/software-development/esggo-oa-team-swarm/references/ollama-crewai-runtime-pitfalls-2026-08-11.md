# Ollama + CrewAI Runtime Pitfalls — 2026-08-11

Session-specific detail for the OA-Team 30 swarm local-runtime buildout on Windows + VPS.

## Ollama reasoning model trap

`gemma4` is a reasoning model. When CrewAI calls Ollama's `/v1/chat/completions`, gemma4
returns the answer in `message.reasoning`, leaving `message.content` EMPTY.

CrewAI 0.175 `call_llm_native_tools` path validates `message.content` non-empty → raises
`ValueError: Invalid response from LLM call - None or empty`.

Verified fix: use `qwen2.5:3b-instruct-q4_K_M` (non-reasoning). Direct curl test:
```
curl -s -m 30 http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:3b-instruct-q4_K_M","messages":[{"role":"user","content":"hi"}],"max_tokens":50}'
```
Expected: `"content":"Hello! How can I assist you today?"` (non-empty).

Also: gemma4 8B on CPU can crash Ollama during long sequential swarm inference (OOM/service drop).

## CrewAI native tool-calling path

CrewAI 0.175 walks `call_llm_native_tools` for agents with delegation/tools. Ollama small models
return empty/invalid `tool_calls` → `None or empty`.

Fix: local wrapper `run_swarm_local.py` (gitignored) that loads crew, sets each agent
`tools=[]`, `allow_delegation=False`, then kickoff.

## OAB broker daemon trap

`nohup python3 broker.py --heartbeat &` and `setsid ... < /dev/null &` both START the process,
but asyncio event loop STALLS in daemon mode → journal stops growing (stuck at N lines).

`python3 -u broker.py --heartbeat` in foreground writes journal fine (7→13 lines in 10s).

Fix: `pm2 start broker.py --name oab-broker --interpreter python3 -- --bus vps --store <dir> --heartbeat`
then `pm2 save`. Verified: journal grew 7→157+ lines, survives restart.

## Tailscale curl timeout

First connection to a Tailscale IP (e.g. `100.71.82.0:8790`) over direct WireGuard handshake can
take >8s. `curl -m 8` returns `HTTP=000` even though the service is UP.

Fix: use `curl -m 12+` when testing Tailscale endpoints. Verified: `-m 12` → `HTTP=200`.

## load_crew signature

CrewAI 0.175: `load_crew(source: 'Path|str', agents_dir=None)`. Calling without `source` raises
`TypeError: missing 1 required positional argument: 'source'`.

Correct: `load_crew('crew.jsonc')`. Verify `len(crew.agents)==30 and len(crew.tasks)==5`.

## VPS crewai uv tool

`python3 -c "import crewai"` on VPS → `ModuleNotFoundError` (crewai is in uv-isolated env).

Correct:
```bash
export PATH=$HOME/.local/bin:$PATH
CREWAI_PY=$(dirname $(readlink -f $(which crewai)))/python
$CREWAI_PY -c "from main import load_crew; c,_=load_crew('crew.jsonc'); print(len(c.agents), len(c.tasks))"
```

## crew.jsonc process field

`"process": "parallel"` is NOT supported in CrewAI 0.175 → pydantic validation error.
`"process": "hierarchical"` requires `manager_llm` or `manager_agent` → violates §19 unless explicitly wanted.
Default: `"process": "sequential"`.

## git rebase with unrelated tracked edits

When `git pull --rebase` hits "untracked files would be overwritten", the conflicting files may
be YOUR other in-progress work. Fix:
```bash
git stash push -u -m "WIP: <context>"
git pull --rebase origin main
git stash pop
```

## Ollama .env for stability

Write `C:\Users\dingj\.ollama\.env`:
```
OLLAMA_NUM_PARALLEL=1
OLLAMA_NUM_THREAD=4
```
Restart Ollama app to apply. Prevents CPU OOM during long swarm inference.
