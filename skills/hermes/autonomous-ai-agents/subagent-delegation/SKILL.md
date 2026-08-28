---
name: subagent-delegation
category: autonomous-ai-agents
description: Delegate to background subagents when terminal is stuck.
tags: delegation, subagent, terminal-recovery
---

# Subagent Delegation Pattern

When SSH terminal loops endlessly, stop retrying and dispatch a background subagent via `delegate_task`. Monitor the subagent's live transcript at `C:\Users\dingj\AppData\Local\hermes\cache\delegation\live\<delegation_id>\task-0.log`. Leaf subagents cannot call `delegate_task`, `clarify`, `memory`, or `send_message`. Orchestrator subagents are bounded by `max_spawn_depth=1`. Results are self-reports, not verified facts — verify after completion. When deploying Cloudflare Workers or edge functions as part of the OA-Team 30 swarm, use subagent delegation for any VPS-side file creation.

## Terminal Stuck in Reasoning Loop

If the SSH terminal is stuck in a reasoning loop (60/60 iterations), do NOT retry terminal commands. Dispatch a background subagent via `delegate_task` instead. The subagent creates all files and runs deployment commands directly on the VPS. Monitor progress via the live transcript at `C:\Users\dingj\AppData\Local\hermes\cache\delegation\live\<delegation_id>\task-0.log`.

This pattern was validated during the deer-flow Cloudflare Worker deployment session where the terminal was completely unresponsive but the subagent successfully created all Worker files and ran `npx wrangler deploy`.

## HTTP 429 on Completion Check

When the final API call to check the subagent result returns `HTTP 429: Rate limit exceeded`, the subagent's work is still valid — the 429 only blocks the *status-checking* call, not the subagent itself. Do NOT re-dispatch another subagent to verify. Instead, read the live transcript file directly from the Windows host filesystem to confirm what was created. The transcript is the ground truth.