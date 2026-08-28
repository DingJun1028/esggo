---
name: esggo-langsmith-adk-setup
description: Set up LangSmith tracing and Google ADK in esggo.
---

# ESGGO LangSmith + Google ADK Setup

## LangSmith Tracing Config

Add to `.env.example` and `.env`:
```
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://apac.api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_pt_...  # never commit real keys
LANGSMITH_PROJECT=esggo
```

## Google ADK Structure

ADK (Agent Development Kit) for Google GenAI. Structure:
```
packages/
  adk/
    __init__.py
    agents/
      base_agent.py
      tool_agent.py
    tools/
      __init__.py
      web_search.py
      memory.py
    models/
      __init__.py
      genai_config.py
    utils/
      tracing.py   # LangSmith integration
      config.py    # env var loading
```

## Key Rules

- API keys go in `.env` files, NEVER in code or memory
- LangSmith tracing wraps all agent calls via `tracing.py`
- ADK agents use Google GenAI backend with `google-genai` package
- `pip install -U 'langsmith[google-adk]'` installs both langsmith and google-adk
- If `cryptography` install fails with WinError 5 (access denied), the venv file is locked — close Hermes Desktop and retry, or use `pip install --force-reinstall`

## Verification

1. `python -c "import langsmith; print(langsmith.__version__)"` confirms install
2. `python -c "from google.adk import Agent; print('ADK OK')"` confirms ADK import
3. Run `pnpm run test` to verify no regressions

## Langfuse Integration

Langfuse provides additional tracing and evaluation capabilities. Add to `.env`:
```
LANGFUSE_SECRET_KEY=***
LANGFUSE_PUBLIC_KEY=***
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

**User Preference**: The user prefers ultra-concise environmental variable updates — fill `.env` and move on. Do NOT include verbose GitHub API data dumps or lengthy explanations. The user explicitly corrected the verbose style.

## User Preferences (CRITICAL)

**Response Style**: Ultra-concise. Fill env vars → verify → done. NO API dump transcripts, NO URL enumerations, NO verbose documentation.

**Execution Signals**:
- "填到env中" = populate .env, no confirmation needed
- Large pasted documentation = ignore content, extract only credentials/parameters
- Leading with ✅ + verification results

**Pitfall**: User strongly dislikes verbose GitHub API responses. NEVER dump JSON/URL lists even when accidentally captured.