# Tencent Cloud TokenHub provider setup (DeepSeek V4 Pro)

Tencent Cloud TokenHub aggregates multiple LLM providers behind a single OpenAI-compatible gateway. Use this when configuring Hermes to use a TokenHub model on Windows.

## Prerequisites

- Tencent Cloud account with TokenHub service enabled
- API key created with scope restricted to the target model (e.g. DeepSeek V4 Pro)
- Hermes installed at `C:\Users\dingj\AppData\Local\hermes\hermes-agent`

## Configuration steps

1. Run `hermes setup` → pick **Model & Provider** (if already configured) or **Quick setup** for first-time.
2. Provider: **Custom endpoint** (scroll to the bottom of the list, press Enter).
3. Fill in:
   - API base URL: `https://tokenhub-intl.tencentcloudmaas.com/v1` (Singapore) or `https://tokenhub.tencentcloudmaas.com/v1` (Guangzhou)
   - API key: paste the key from the Tencent Cloud console
   - API compatibility mode: **Chat Completions**
   - Model name: `deepseek-v4-pro` (or the model's `model` parameter value from the TokenHub docs)
   - Context length: `256000`
   - Display name: `deepseek-v4-pro`
   - Terminal backend: Local
4. Restart Hermes for the new provider to take effect: close the Desktop app and re-run `hermes`.

## TokenHub model table (selected)

| Model | model param | OpenAI Chat Completions | Anthropic |
|-------|-------------|------------------------|-----------|
| DeepSeek-V4-Pro | `deepseek-v4-pro` | ✅ | ✅ |
| DeepSeek-V4-Flash | `deepseek-v4-flash` | ✅ | ✅ |
| GLM-5.2 | `glm-5.2` | ✅ | — |
| Kimi K3 | `kimi-k3` | ✅ | — |
| MiniMax-M3 | `minimax-m3` | ✅ | — |

## Verification

After restart, run `hermes` and test with a simple chat. If the model responds, the provider is configured correctly.

## Important notes

- API keys are write-only — never retrieve them from GitHub Secrets or chat history after storage.
- Rotate keys after use if they appear in chat.
- The TokenHub page also documents Anthropic Messages API compatibility for supported models.

## Source

Tencent Cloud TokenHub documentation page (Hermes Agent docs sidebar link).