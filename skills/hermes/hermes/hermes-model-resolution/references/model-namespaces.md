# Known Hermes model → provider namespaces (verified 2026-08-04)

Source: `~/.hermes/context_length_cache.yaml` (base_url reveals provider) and `~/.hermes/auth.json` (provider catalogs). Read auth.json via terminal/python — `read_file` is blocked on it.

## Confirmed-correct mappings

| Model ID | Provider | Base URL | Notes |
|---|---|---|---|
| `inclusionai/ling-3.0-flash:free` | nous | https://inference-api.nousresearch.com/v1 | ling family lives under NOUS, not opencode |
| `tencent/hy3:free` | nous | https://inference-api.nousresearch.com/v1 | current live default |
| `deepseek-v4-flash-free` | opencode-zen | https://opencode.ai/zen/v1 | valid |
| `poolside/laguna-xs-2.1:free` | opencode-zen | — | valid |
| `poolside/laguna-s-2.1:free` | opencode-zen | — | valid |
| `stepfun/step-3.7-flash:free` | nous | — | valid |

## Known-BAD string (root cause of this session's 404)

`opencode/ling-3.0-flash-free` → DOES NOT EXIST.
- Wrong prefix: `opencode/` (OpenCode Zen/Go only carries poolside `laguna-*`, GLM, Kimi, MiniMax — not ling).
- Wrong name: `ling-3.0-flash-free` vs correct `ling-3.0-flash:free`.
- Correct form: `inclusionai/ling-3.0-flash:free` (provider nounous → resolves to `nous`).

## OpenCode provider scope (why arbitrary open models 404 there)

`opencode-zen` / `opencode-go` are CURATED, LIMITED catalogs. They do NOT expose every open model. If you get a 404 with an `opencode/` prefix, the model almost certainly belongs to a different provider (nous/inference-api.nousresearch.com is the common home for `inclusionai/*`, `tencent/*`, `stepfun/*`).

## How to map any unknown model to its provider

1. Grep `context_length_cache.yaml` for the model substring → read the `@base_url`.
   - `inference-api.nousresearch.com` → `nous` provider, namespace = the part before `@` (e.g. `inclusionai/ling-3.0-flash:free`).
2. If absent from cache, grep `auth.json` providers section for the model family; match against `base_url`.
3. If still unknown, the model isn't configured locally — do NOT guess an `opencode/` prefix; ask the user or check the provider's real catalog.
