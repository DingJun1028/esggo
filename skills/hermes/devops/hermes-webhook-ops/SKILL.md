---
name: hermes-webhook-ops
description: Hermes webhook gateway ops — route CLI gotchas, V2 signing.
---

# Hermes Webhook Ops Cookbook

Companion to the **bundled `hermes-agent` webhook reference** (the API spec — read it first for fields/operators). This skill captures the operational gotchas and integration patterns discovered while wiring the OA-Team 30 swarm (AI Station done → Telegram, GitHub PR → github_comment, CI/monitor → Telegram/Discord).

## When to use
- `hermes webhook subscribe` for AI Station / GitHub / CI / monitoring.
- Implementing an **outbound** webhook sender (a service POSTing completion events to Hermes).
- Debugging `401` / `ignored` / `502` from the gateway.

## Prerequisites
- Enabled via `WEBHOOK_ENABLED=true` in the Hermes `.env`. On this host that file is `C:\Users\dingj\AppData\Local\hermes\.env` (NOT `~/.hermes/`).
- Gateway: `hermes gateway run` (background). Health: `curl http://localhost:8644/health` → `{"status":"ok","platform":"webhook"}`.
- Routes: dynamic ones in `webhook_subscriptions.json` (dict `name -> route`); static ones in `config.yaml` under `platforms.webhook.extra.routes`.

## Create a route (CLI)
```
hermes webhook subscribe <name> \
  --events "video_done" \
  --prompt "🎬 Done\n標題：{title}\n狀態：{status}\n影片：{video_url}" \
  --deliver telegram \
  --deliver-only \
  --description "..."
```
- Auto-generates a per-route HMAC secret (printed on create; also in `webhook_subscriptions.json`).
- `--deliver-only` = **direct delivery** (zero LLM cost, sub-second). Requires `--deliver` to be a REAL target (telegram/discord/github_comment/...), NOT `log` — gateway refuses to start otherwise.
- Template fields use `{dot.notation}` of the payload. Keep them NARROW (named fields, never `{__raw__}` for untrusted sources) — HMAC proves the *sender*, not the *content* (PR titles, commit messages are attacker-controlled).

## GOTCHA 1 — CLI has no `--deliver-extra`
`hermes webhook subscribe` supports only `--deliver-chat-id`, NOT `--deliver-extra`.
- For `github_comment` you can't pass `repo`/`pr_number` via CLI. Either (a) rely on GitHub's PR payload auto-supplying `repository.full_name` + `number` (adapter uses them automatically → works), or (b) write a **static route** in `config.yaml` with `deliver_extra: {repo, pr_number}`.
- Without `--deliver-extra`, omit `chat_id` and the message lands in the platform's configured home channel.

## GOTCHA 2 — `hermes webhook test` returns `ignored` (not a failure)
It sends event type `test`, which your `events` whitelist rejects → `{"status":"ignored","event":"test"}`. To truly verify signature+template+delivery, POST manually (recipe in `references/hermes-webhook-gotchas.md`):
- **Generic route**: put `event_type` INSIDE the JSON body. The gateway reads event from payload `event_type`/`event`, NOT from a header — `X-Webhook-Event` is ignored → `event: unknown`.
- **GitHub route**: `X-GitHub-Event: pull_request` header + `X-Hub-Signature-256: sha256=<hmac(body)>`.
- Sign V1 (`X-Webhook-Signature` = HMAC-SHA256 of body) or V2.

## GOTCHA 3 — sign V2 outbound (senders)
Gateway warns on legacy body-only HMAC (replay-vulnerable). Outbound senders should sign V2:
`X-Webhook-Signature-V2` = HMAC-SHA256 of `"<timestamp>.<body>"`, plus `X-Webhook-Timestamp: <unix seconds>` (±300s window). Reusable notifier in `templates/notify_webhook.py`.

## GOTCHA 4 — Discord needs a connected bot
`deliver: discord` → `502 Delivery failed / Platform discord not connected` if no `DISCORD` token in `.env`. Until configured, route CI/monitor alerts to `telegram` (already connected). Don't burn a route on an unconnected platform.

## GOTCHA 5 — GitHub rejects localhost URLs
`gh api -X POST /repos/<owner>/<repo>/hooks` rejects `config[url]=http://localhost:...` ("not reachable over the public Internet"). For auto-PR-review, expose the gateway publicly (cloudflared tunnel or VPS nginx + Cloudflare). Route logic itself is correct — verified locally with a manual GitHub-format POST → `202 accepted`.

## GOTCHA 6 — `gh api` boolean flag
`-f active=true` → 422 "true is not a boolean". Use `-F active=true` (capital F = typed boolean).

## Verify
- Health check above.
- POST without secret → `401` (expected). With valid V1/V2 sig → `200 delivered` (direct) or `202 accepted` (agent route).
- Full signed-POST test recipe + `gh api` create example: `references/hermes-webhook-gotchas.md`.

## Host-specific (this machine)
- Subscriptions file & `.env`: `C:\Users\dingj\AppData\Local\hermes\` (not `~/.hermes/`).
- Python native (`venv/Scripts/python.exe`) does NOT accept `/c/Users/...` POSIX paths — use `C:/Users/...`.
- aistation pytest: run with Hermes venv python `C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Scripts\python.exe`, NOT system `python3` (3.14.6 has broken `pydantic_core`). Use `--noconftest` for module tests not needing `src.app`/fastapi.
