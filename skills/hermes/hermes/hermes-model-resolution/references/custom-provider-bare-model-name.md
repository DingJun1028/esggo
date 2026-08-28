# Custom Provider Takes a BARE Model Name (no provider prefix)

## Symptom

`HTTP 404: model 'custom-ollama/qwen2.5:3b-instruct-q4_K_M' not found` — but the model
IS present in the target Ollama instance (`curl http://localhost:11434/api/tags` lists
`qwen2.5:3b-instruct-q4_K_M`).

## Root cause

A user-defined provider in the `providers:` block (e.g. `custom-ollama`, `base_url:
http://localhost:11434/v1`) passes the model string through **verbatim** to the upstream
API. So `model.default: custom-ollama/qwen2.5:3b-instruct-q4_K_M` makes Hermes send the
literal string `custom-ollama/qwen2.5:3b-instruct-q4_K_M` to Ollama, which 404s — the
real Ollama model name has no such prefix.

The `namespace/model` prefix convention (e.g. `nous/...`, `opencode-zen/...`,
`opencode-go/...`) applies ONLY to Hermes built-in catalog providers. A custom
`base_url` provider is a raw OpenAI-compatible passthrough — it gets the raw string.

## Fix

Set provider and model name separately; the model name must be BARE:

```bash
hermes config set model.provider custom-ollama
hermes config set model.default qwen2.5:3b-instruct-q4_K_M
# also fix any alias / delegation.model / fav that carried the prefix
hermes config set delegation.model qwen2.5:3b-instruct-q4_K_M
```

Verify with `hermes config get model` → should show `default: qwen2.5:3b-instruct-q4_K_M`
(no `custom-ollama/` prefix), then `hermes gateway restart` from a separate shell.

## Pitfall: the same prefix can hide in several keys

`model.default`, `model.fav`, `model.aliases.fav`, and `delegation.model` can EACH carry
the wrong `custom-ollama/` prefix independently. Grep the whole config for the bad
prefix and fix every occurrence, not just `model.default`:

```bash
grep -n 'custom-ollama/' "$LOCALAPPDATA/hermes/config.yaml"
```
