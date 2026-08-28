# DeerFlow LLM hookup — Hermes subscription proxy (verified 2026-08-04)

DeerFlow's LLM needs a real endpoint; the `.env` keys configure.py writes are `your-*-api-key`
placeholders and config `$DEEPSEEK_API_KEY` resolves to a fake value (real calls 401). The
no-key path is to point DeerFlow at Hermes' local subscription proxy.

## Correct commands (the trap: it is `hermes proxy start`, NOT `hermes proxy`)
```powershell
hermes auth list                  # list providers; nous should be present (OAuth signed in)
hermes auth status nous           # `hermes auth status` WITHOUT a provider errors
hermes proxy start                # OpenAI-compatible local proxy for the signed-in OAuth provider
```
- Default endpoint: **`http://127.0.0.1:8645/v1`** (customize: `hermes proxy start --host 0.0.0.0 --port <PORT>`).
- Any OpenAI-compatible client can use it; api_key can be any placeholder —
  **`unused-proxy-attaches-real-creds`** — the proxy attaches the real credentials itself.
- Model example: `Hermes-4-70B`. If the proxy doesn't recognize it, use your actual
  Nous Subscription model id (e.g. `hy3:free`).
- Proof nous is logged in: the Hermes model picker shows a `NOUS PORTAL` section and the
  status bar shows a `nous:` prefixed model (e.g. `nous: tencent/hy3:free`).

## DeerFlow config.yaml model entry — field is `api_base`, NOT `base_url`!
DeerFlow model entries use **`api_base`** (e.g. the existing entry `api_base: https://api.deepseek.com/v1`).
`apply_model.py` in the repo writes `base_url:` which is **NOT read** — that's a latent bug.
Prefer an `edit_file` on `config.yaml` itself:
```yaml
models:
  - name: hermes-proxy
    use: langchain_openai:ChatOpenAI
    model: Hermes-4-70B
    api_base: http://127.0.0.1:8645/v1
    api_key: unused-proxy-attaches-real-creds
    request_timeout: 600.0
    max_retries: 2
```
After editing models, **restart the gateway container** for the change to take effect:
`"C:\Program Files\Git\bin\bash.exe" -lc "docker compose -f docker/docker-compose-dev.yaml restart gateway"`.

## Verify
```bash
curl -s http://localhost:8001/api/models | head   # should show hermes-proxy
# or open http://127.0.0.1:2026/ and send a message (LangGraph thread run)
```

## Known pitfall — nginx SSL crash-loop
If docker compose mounts `/etc/nginx/certs/fullchain.pem` and that file doesn't exist, the
nginx container crash-loops (`cannot load certificate ... No such file`). Confirm the cert
exists or use a compose file without HTTPS.