# base_url Misconfiguration — Wrong Service on the Right Port

Symptom: A custom provider (e.g. `custom-ollama`) 404s or returns garbage. The model string is valid, but `base_url` points to a completely different service.

## Root cause

`config.yaml` providers section has `base_url` pointing at the wrong port/service:
- `http://100.71.82.0:8788` → universal-translator (FastAPI, `/translate`, `/speak`, `/ws`)
- `http://localhost:11434` → Ollama (GGUF model serving, `/api/tags`, `/api/generate`)

The HTTP endpoint responds with that app's routes, not a model catalog.

## Diagnostic

```bash
# Probe what service is actually on the configured URL
curl -s --max-time 10 http://<base_url>/api/tags    # Ollama
curl -s --max-time 10 http://<base_url>/v1/models   # OpenAI-compatible
```

If it returns routes like `POST /translate | POST /speak`, it's the translator, not Ollama.

## Fix

Edit `~/.hermes/providers/custom-ollama` base_url to point at the real Ollama:
```yaml
providers:
  custom-ollama:
    base_url: http://localhost:11434
    api_key: ''
```

If Ollama is on a different host/port, adjust accordingly. Verify with `curl http://localhost:11434/api/tags` showing the model list.

## Prevention

When configuring a custom provider, ALWAYS probe the endpoint with `curl` and confirm it returns the expected API shape (model list, not routes page or HTML) before assigning it as `base_url`.
