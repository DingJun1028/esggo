
## 4. Operational traps re-hit every session

**Nginx 502 during boot kills the test (P4).** In the wrapper shell that
restarts gateway + runs the harness, NEVER chain the health curl to the python
run with `&&` or a bare `;`. During the 3–5 min gateway boot, `:2026` returns
502 and `curl -w "%{http_code}"` writes to a closed pipe → **exit code 23**, and
the OCR harness never runs. Guard it:
```bash
curl -s --max-time 10 -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:2026/api/health 2>&1 || true
python3 _vision_test.py 2>&1 | tail -20
```
Better: wait on the **internal** probe loop (gateway `:8001`) before running:
```bash
for i in $(seq 1 50); do sleep 5; docker exec deer-flow-gateway sh -c 'curl -s --max-time 3 http://127.0.0.1:8001/api/health >/dev/null 2>&1' && break; done
```

**Gemma 3 model rename chain (P6).** To use Gemma for vision you must end at a
tool-capable derivative. The working sequence:
- `gemma3:4b` → 400 "does not support tools" (stock modelfile lacks tool template)
- `gemma3-tools` = `ollama create` from bare `FROM gemma3:4b` → STILL 400 (inherits stock template)
- **`gemma3-tooled`** = `ollama create` from a Modelfile WITH the tool template (P3) → works
Set the config entry `model: gemma3-tooled` (not `gemma3:4b` / `gemma3-tools`).

**No sub-2B vision tag exists.** `qwen2.5vl:0.5b` / `qwen2.5-vl:0.5b` → manifest 404.
Qwen2.5-VL on Ollama starts at 3B. The only off-the-shelf Ollama vision model
that advertises tool support (passes DeerFlow binding without a Modelfile) is
`qwen3-vl:2b`. If you need a smaller CPU model, `moondream` is the candidate —
verify its tag before pulling.
