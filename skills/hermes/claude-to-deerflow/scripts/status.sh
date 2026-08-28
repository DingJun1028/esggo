#!/usr/bin/env bash
# status.sh — Check DeerFlow status and list available resources.
#
# Usage:
#   bash status.sh                  # health + summary
#   bash status.sh models           # list models
#   bash status.sh skills           # list skills
#   bash status.sh agents           # list agents
#   bash status.sh threads          # list recent threads
#   bash status.sh memory           # show memory
#   bash status.sh thread <id>      # show thread history
#   bash status.sh uploads <id>     # list files uploaded to a thread
#
# Environment variables:
#   DEERFLOW_URL           — Unified proxy base URL (default: http://localhost:2026)
#   DEERFLOW_GATEWAY_URL   — Gateway API base URL (default: $DEERFLOW_URL)
#   DEERFLOW_LANGGRAPH_URL — LangGraph API base URL (default: $DEERFLOW_URL/api/langgraph)

set -euo pipefail

command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 is required (status.sh formats JSON with it)" >&2; exit 1; }

DEERFLOW_URL="${DEERFLOW_URL:-http://localhost:2026}"
GATEWAY_URL="${DEERFLOW_GATEWAY_URL:-$DEERFLOW_URL}"
LANGGRAPH_URL="${DEERFLOW_LANGGRAPH_URL:-$DEERFLOW_URL/api/langgraph}"
CMD="${1:-health}"
ARG="${2:-}"

case "$CMD" in
  health)
    echo "Checking DeerFlow at ${GATEWAY_URL}..."
    HTTP_CODE=$(curl -s -m 10 -o /dev/null -w "%{http_code}" "${GATEWAY_URL}/health" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "000" ]; then
      echo "UNREACHABLE — DeerFlow is not running at ${GATEWAY_URL}"
      exit 1
    elif [ "$HTTP_CODE" -ge 400 ]; then
      echo "ERROR — Health check returned HTTP ${HTTP_CODE}"
      exit 1
    else
      echo "OK — DeerFlow is running (HTTP ${HTTP_CODE})"
    fi
    ;;
  models)
    curl -s -m 60 "${GATEWAY_URL}/api/models" | python3 -m json.tool \
      || { echo "ERROR: fetch failed from ${GATEWAY_URL}/api/models" >&2; exit 1; }
    ;;
  skills)
    curl -s -m 60 "${GATEWAY_URL}/api/skills" | python3 -m json.tool \
      || { echo "ERROR: fetch failed from ${GATEWAY_URL}/api/skills" >&2; exit 1; }
    ;;
  agents)
    curl -s -m 60 "${GATEWAY_URL}/api/agents" | python3 -m json.tool \
      || { echo "ERROR: fetch failed from ${GATEWAY_URL}/api/agents" >&2; exit 1; }
    ;;
  threads)
    curl -s -m 60 -X POST "${LANGGRAPH_URL}/threads/search" \
      -H "Content-Type: application/json" \
      -d '{"limit": 20, "sort_by": "updated_at", "sort_order": "desc", "select": ["thread_id", "updated_at", "values"]}' \
      | python3 -c "
import json, sys
data = json.load(sys.stdin)
threads = data.get('threads', data) if isinstance(data, dict) else data
if not isinstance(threads, list):
    print('Unexpected response shape:', str(data)[:200])
    sys.exit(1)
if not threads:
    print('No threads found.')
    sys.exit(0)
for t in threads:
    if not isinstance(t, dict):
        print('?  ?  (unexpected item)')
        continue
    tid = t.get('thread_id', '?')
    updated = t.get('updated_at', '?')
    title = (t.get('values') or {}).get('title', '(untitled)')
    print(f'{tid}  {updated}  {title}')
" || { echo "ERROR: fetch failed from ${LANGGRAPH_URL}/threads/search" >&2; exit 1; }
    ;;
  memory)
    curl -s -m 60 "${GATEWAY_URL}/api/memory" | python3 -m json.tool \
      || { echo "ERROR: fetch failed from ${GATEWAY_URL}/api/memory" >&2; exit 1; }
    ;;
  thread)
    if [ -z "$ARG" ]; then
      echo "Usage: status.sh thread <thread_id>" >&2
      exit 1
    fi
    curl -s -m 60 "${LANGGRAPH_URL}/threads/${ARG}/history" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if isinstance(data, dict) and 'messages' in data:
    states = [data]
elif isinstance(data, list):
    states = data
else:
    print(json.dumps(data, indent=2))
    sys.exit(0)
for state in states[:5]:
    if not isinstance(state, dict):
        continue
    values = state.get('values', state) if isinstance(state, dict) else {}
    msgs = values.get('messages', [])
    if not msgs:
        continue
    for m in msgs[-5:]:
        if not isinstance(m, dict):
            continue
        role = m.get('type', '?')
        content = m.get('content', '')
        if isinstance(content, list):
            content = ' '.join(p.get('text','') for p in content if isinstance(p, dict))
        preview = content[:200] if content else '(empty)'
        print(f'[{role}] {preview}')
    print('---')
" || { echo "ERROR: fetch failed from ${LANGGRAPH_URL}/threads/${ARG}/history" >&2; exit 1; }
    ;;
  uploads)
    if [ -z "$ARG" ]; then
      echo "Usage: status.sh uploads <thread_id>" >&2
      exit 1
    fi
    curl -s -m 60 "${GATEWAY_URL}/api/threads/${ARG}/uploads/list" | python3 -m json.tool \
      || { echo "ERROR: fetch failed from ${GATEWAY_URL}/api/threads/${ARG}/uploads/list" >&2; exit 1; }
    ;;
  *)
    echo "Unknown command: ${CMD}" >&2
    echo "Usage: status.sh [health|models|skills|agents|threads|memory|thread <id>|uploads <id>]" >&2
    exit 1
    ;;
esac
