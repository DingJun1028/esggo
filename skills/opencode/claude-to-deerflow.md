---
name: claude-to-deerflow
description: Interact with a running DeerFlow instance via its HTTP API.
---

# DeerFlow Skill

Communicate with a running DeerFlow instance via its HTTP API. DeerFlow is an AI agent platform
built on LangGraph that orchestrates sub-agents for research, code execution, web browsing, and more.

## Requirements

- `bash`, `curl`, `python3` — required by the helper scripts (`scripts/chat.sh`, `scripts/status.sh`).
- A running DeerFlow instance (start with `make dev` in the DeerFlow repo). Everything in this skill
  talks to that instance over HTTP; without one, every call fails with a health check error.

## Architecture

DeerFlow exposes two API surfaces behind an Nginx reverse proxy:

| Service        | Direct Port | Via Proxy                        | Purpose                          |
|----------------|-------------|----------------------------------|----------------------------------|
| Gateway API    | 8001        | `$DEERFLOW_GATEWAY_URL`          | REST endpoints and embedded agent runtime |
| LangGraph-compatible API | 8001 | `$DEERFLOW_LANGGRAPH_URL`       | Agent threads, runs, streaming   |

## Environment Variables

All URLs are configurable via environment variables. **Read these env vars before making any request.**

| Variable                | Default                                  | Description                        |
|-------------------------|------------------------------------------|------------------------------------|
| `DEERFLOW_URL`          | `http://localhost:2026`                  | Unified proxy base URL             |
| `DEERFLOW_GATEWAY_URL`  | `${DEERFLOW_URL}`                        | Gateway API base (models, skills, memory, uploads) |
| `DEERFLOW_LANGGRAPH_URL`| `${DEERFLOW_URL}/api/langgraph`          | LangGraph API base (threads, runs) |
| `DEERFLOW_TIMEOUT`      | `600`                                    | Max seconds to wait for a streaming run (`chat.sh` only) |

When making curl calls, always resolve the URL like this:

```bash
# Resolve base URLs from env (do this FIRST before any API call)
DEERFLOW_URL="${DEERFLOW_URL:-http://localhost:2026}"
DEERFLOW_GATEWAY_URL="${DEERFLOW_GATEWAY_URL:-$DEERFLOW_URL}"
DEERFLOW_LANGGRAPH_URL="${DEERFLOW_LANGGRAPH_URL:-$DEERFLOW_URL/api/langgraph}"
```

## Available Operations

### 1. Health Check

Verify DeerFlow is running:

```bash
curl -s "$DEERFLOW_GATEWAY_URL/health"
```

### 2. Send a Message (Streaming)

This is the primary operation. It creates a thread and streams the agent's response.

**Step 1: Create a thread**

```bash
curl -s -X POST "$DEERFLOW_LANGGRAPH_URL/threads" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response: `{"thread_id": "<uuid>", ...}`

**Step 2: Stream a run**

```bash
curl -s -N -X POST "$DEERFLOW_LANGGRAPH_URL/threads/<thread_id>/runs/stream" \
  -H "Content-Type: application/json" \
  -d '{
    "assistant_id": "lead_agent",
    "input": {
      "messages": [
        {
          "type": "human",
          "content": [{"type": "text", "text": "YOUR MESSAGE HERE"}]
        }
      ]
    },
    "stream_mode": ["values", "messages-tuple"],
    "stream_subgraphs": true,
    "config": {
      "recursion_limit": 1000
    },
    "context": {
      "thinking_enabled": true,
      "is_plan_mode": true,
      "subagent_enabled": true,
      "thread_id": "<thread_id>"
    }
  }'
```

The response is an SSE stream. Each event has the format:
```
event: <event_type>
data: <json_data>
```

Key event types:
- `metadata` — run metadata including `run_id`
- `values` — full state snapshot with `messages` array
- `messages-tuple` — incremental message updates (AI text chunks, tool calls, tool results)
- `end` — stream is complete

**Context modes** (set via `context`):
- Flash mode: `thinking_enabled: false, is_plan_mode: false, subagent_enabled: false`
- Standard mode: `thinking_enabled: true, is_plan_mode: false, subagent_enabled: false`
- Pro mode: `thinking_enabled: true, is_plan_mode: true, subagent_enabled: false`
- Ultra mode: `thinking_enabled: true, is_plan_mode: true, subagent_enabled: true`

### 3. Continue a Conversation

To send follow-up messages, reuse the same `thread_id` from step 2 and POST another run
with the new message.

### 4. List Models

```bash
curl -s "$DEERFLOW_GATEWAY_URL/api/models"
```

Returns: `{"models": [{"name": "...", "provider": "...", ...}, ...]}`

### 5. List Skills

```bash
curl -s "$DEERFLOW_GATEWAY_URL/api/skills"
```

Returns: `{"skills": [{"name": "...", "enabled": true, ...}, ...]}`

### 6. Enable/Disable a Skill

```bash
curl -s -X PUT "$DEERFLOW_GATEWAY_URL/api/skills/<skill_name>" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

### 7. List Agents

```bash
curl -s "$DEERFLOW_GATEWAY_URL/api/agents"
```

Returns: `{"agents": [{"name": "...", ...}, ...]}`

### 8. Get Memory

```bash
curl -s "$DEERFLOW_GATEWAY_URL/api/memory"
```

Returns user context, facts, and conversation history summaries.

### 9. Upload Files to a Thread

```bash
curl -s -X POST "$DEERFLOW_GATEWAY_URL/api/threads/<thread_id>/uploads" \
  -F "files=@/path/to/file.pdf"
```

Supports PDF, PPTX, XLSX, DOCX — automatically converts to Markdown.

### 10. List Uploaded Files

```bash
curl -s "$DEERFLOW_GATEWAY_URL/api/threads/<thread_id>/uploads/list"
```

### 11. Get Thread History

```bash
curl -s "$DEERFLOW_LANGGRAPH_URL/threads/<thread_id>/history"
```

### 12. List Threads

```bash
curl -s -X POST "$DEERFLOW_LANGGRAPH_URL/threads/search" \
  -H "Content-Type: application/json" \
  -d '{"limit": 20, "sort_by": "updated_at", "sort_order": "desc"}'
```

### 13. Download an Artifact

When a run produces files, `chat.sh` prints `Created File: <gateway>/api/threads/<thread_id>/artifacts/<path>`.
The virtual path has its leading `/` stripped before hitting the endpoint (mirrors `chat.sh`'s `artifact_url()`):

```bash
curl -O "$DEERFLOW_GATEWAY_URL/api/threads/<thread_id>/artifacts/mnt/user-data/outputs/report.md"
```

## Usage Script

The helper scripts live in `scripts/` next to this SKILL.md. On this machine (Hermes default profile)
the absolute path is:

```
C:\Users\dingj\AppData\Local\hermes\skills\claude-to-deerflow\scripts\
```

Send a message and collect the full (non-streaming) response:

```bash
bash <skill_dir>/scripts/chat.sh "Your question here"
bash <skill_dir>/scripts/chat.sh "Follow-up" <thread_id>          # continue a conversation
bash <skill_dir>/scripts/chat.sh "Research X" "" ultra            # pick a mode (flash|standard|pro|ultra)
DEERFLOW_URL=http://host:2026 bash <skill_dir>/scripts/chat.sh "hi"   # custom endpoint
```

`chat.sh` behavior:
1. Checks health (exits with a clear message if DeerFlow is not reachable)
2. Creates a thread (or reuses the `thread_id` you pass)
3. Streams the run to a temp file (bounded by `DEERFLOW_TIMEOUT`)
4. Parses the last `values` event, prints the final AI response and any `present_files` artifact URLs

Inspect status/resources:

```bash
bash <skill_dir>/scripts/status.sh                    # health + summary
bash <skill_dir>/scripts/status.sh models             # list models
bash <skill_dir>/scripts/status.sh skills             # list skills
bash <skill_dir>/scripts/status.sh agents             # list agents
bash <skill_dir>/scripts/status.sh threads            # list recent threads
bash <skill_dir>/scripts/status.sh memory             # show memory
bash <skill_dir>/scripts/status.sh thread <id>        # show thread history
bash <skill_dir>/scripts/status.sh uploads <id>       # list files uploaded to a thread
```

### Windows PowerShell 呼叫方式（本機 Windows 終端）

腳本是 bash script，**不要**用 PowerShell 的 `&` 呼叫運算子直接跑 `.sh`，
也**不要**用 `&&` 串接（Windows PowerShell 5.1 不支援 `&&`，整行直接 ParserError；
`&&` 只有 PowerShell 7+/pwsh 支援）。一律用 `bash` 前綴：

```powershell
bash "C:\Users\dingj\AppData\Local\hermes\skills\claude-to-deerflow\scripts\chat.sh" "你的問題"
bash "C:\Users\dingj\AppData\Local\hermes\skills\claude-to-deerflow\scripts\status.sh" health

# 指定實例：PowerShell 用 $env:，不是 DEERFLOW_URL=... 前綴（那是 bash 語法）
$env:DEERFLOW_URL = "http://localhost:2026"
bash "C:\Users\dingj\AppData\Local\hermes\skills\claude-to-deerflow\scripts\status.sh" models

# 連續執行：PS5.1 用「;」取代「&&」
bash "C:\...\scripts\status.sh" health; bash "C:\...\scripts\status.sh" models

# 語法檢查（分開跑，勿用 && 串）
bash -n "C:\Users\dingj\AppData\Local\hermes\skills\claude-to-deerflow\scripts\chat.sh"
```

在 bash 環境（Git Bash / WSL / VPS）才用 `DEERFLOW_URL=http://host:2026 bash <skill_dir>/scripts/chat.sh "hi"` 的原生寫法。

## Parsing SSE Output

The stream returns SSE events. To extract the final AI response from a `values` event:
- Look for the last `event: values` block
- Parse its `data` JSON
- The `messages` array contains all messages; the last one with `type: "ai"` is the response
- The `content` field of that message is the AI's text reply

## Pointing at a Remote Instance

The scripts resolve the base URL from `DEERFLOW_URL` (default `http://localhost:2026`).
To talk to DeerFlow on another host (e.g. a VPS), set it explicitly:

```bash
export DEERFLOW_URL="http://<host-or-ip>:2026"
bash <skill_dir>/scripts/status.sh health
```

**Note for this Hermes session**: the `terminal` tool here is an SSH session to the user's VPS,
so `localhost` inside the scripts refers to the VPS, not the local Windows machine. If DeerFlow
runs on the local machine, either run the scripts in a local Windows terminal, or reach it through
an SSH tunnel from that terminal:

```bash
# in a local Windows terminal:
ssh -L 2026:localhost:2026 <vps> &
DEERFLOW_URL=http://localhost:2026 bash <skill_dir>/scripts/chat.sh "hello"
```

## Deployment (VPS 建制)

To stand up a DeerFlow instance this skill can talk to, follow the sequence-ordered
provisioning runbook in `references/vps-provision.md` (grounded in upstream `Install.md`
and the `Makefile` — Docker path preferred, local path fallback, model config, verification
sequence, systemd persistence, and tunnel wiring).

## Security Note

DeerFlow's HTTP API has no built-in authentication. Never expose ports 8001/2026 directly to the
public internet; keep them behind a firewall, an authenticated reverse proxy, or a VPN/tunnel.

## Error Handling

| Symptom | Cause | Fix |
|---------|-------|-----|
| `HTTP 000` / "not reachable" | DeerFlow not running, or wrong host/port | Start it (`make dev`), or fix `DEERFLOW_URL` |
| Health returns `4xx/5xx` | Service still starting up, or config error | Wait and retry; check DeerFlow logs |
| "No AI response found in the stream" | Stream ended without a usable `values` event | Re-run with `ultra` mode; check `recursion_limit`; the script prints raw SSE when output is short |
| `ERROR from DeerFlow: ...` | The run errored server-side | Read the error payload; fix the request or the agent config |
| `python3: command not found` | Missing runtime | Install Python 3, or alias `python3` to `python` |
| Script appears to hang | Long research run | `chat.sh` is bounded by `DEERFLOW_TIMEOUT` (default 600 s); raise it for very long runs |

## Tips

- For quick questions, use flash mode (fastest, no planning).
- For research tasks, use pro or ultra mode (enables planning and sub-agents).
- You can upload files first, then reference them in your message.
- Thread IDs persist — you can return to a conversation later.
