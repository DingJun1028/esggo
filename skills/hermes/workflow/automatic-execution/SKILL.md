---
name: automatic-execution
description: "Use when user says '下一步' / '繼續' / '最佳實踐' / '授權X' / '全部都做' - complete all tasks without per-step confirmation. Autonomous end-to-end execution mode for seamless workflow continuation."
version: 1.5.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [workflow, user-preference, execution-mode, autonomous, seamless, authorization]
    related_skills: [hermes-usage-best-practices, systematic-debugging, test-driven-development, hermes-agent-skill-authoring, plan, hermes-portal-integration]
---

# Automatic Execution Mode

When user says "下一步" / "繼續" / "最佳實踐" / "授權X" / "全部都做", interpret this as:

> **AUTONOMOUS END-TO-END EXECUTION - DO NOT ASK FOR PER-STEP CONFIRMATION**

## Overview

This skill defines the pattern for autonomous execution mode where the agent completes all tasks without interrupting for per-step confirmation. The goal is seamless, uninterrupted workflow from trigger to completion.

## When to Use

- User explicitly says: "下一步" (next step)
- User says: "繼續" (continue)
- User says: "完成" (complete)
- User says: "最佳實踐" (best practices - implies apply optimal approach)
- User says: "授權X" (authorize X - implies permission granted)
- User says: "全部都做" (do everything/all of it)
- User provides implicit continuation signal in non-English contexts
- Don't use for: initial clarification, ambiguous requests, or when user explicitly asks for confirmation

## Authorization Grant Patterns

### Password Authorization
- "密碼授權" - Direct authorization for password-based operations
- Interprets as: User consents to password-related actions without confirmation

### CLI Authorization
- "CLI授權" - Authorization for command-line interface operations
- Interprets as: Full autonomy for CLI commands and terminal operations

### Autonomous Agent Authorization
- "自主代行授權" - Authorization for autonomous agent delegation
- Interprets as: Permission to spawn subagents and delegate tasks

### Principal/Delegate Authorization
- "代主通典授權" - Authorization for principal/delegate operations
- Interprets as: Permission to act on behalf of the principal

### Omnipotent Clone Authorization
- "授權 萬能分身 全部權限" / "全部都做" / "自主授權自動化"
- Interprets as: Unrestricted fallback authorization — use ALL available tools, methods, and strategies to complete the task.
- Scope: terminal, computer_use, browser, web, mcp, subagents, cron, filesystem, git, deploy.
- Constraint: still must honestly report blockers vs failures; authorization does not override tool unavailability.

### Awakening Best Practice Authorization
- "習得 [覺醒奧義] 代主自行最佳實踐通"
- Interprets as: Activate best-practice enlightenment mode — apply full best-practice workflow autonomously, including defect repair, without asking.

### Omni-Clone Principal Authorization
- "授權[萬能分身]"代主自行，自主通典""
- Interprets as: Full principal-delegate authority granted. Act on user's behalf across all domains, with autonomous decision-making and execution. No per-step confirmation.

### Swarm Mode Authorization
- "授權 '萬能蜂群'模式 可進行小組任務"
- Interprets as: Activate multi-agent swarm coordination. Delegate to subagents, run parallel tasks, and coordinate cross-group work under the 5T protocol.

## Authorization Decision Tree

```
User says "授權X" or similar?
  ├─ Identify authorization type:
  │     ├─ Password authorization → proceed with auth flows
  │     ├─ CLI authorization → execute terminal commands
  │     ├─ Autonomous authorization → delegate to subagents
  │     └─ Delegate authorization → act on principal's behalf
  └─ NO: Continue with standard autonomous execution
```

## Core Execution Pattern

### 1. Scope Analysis (0.5-1 min)
- Parse the user's request for all explicit and implicit requirements
- Identify deliverables, constraints, and success criteria
- Check for missing prerequisites (secrets, API keys, dependencies)

### 2. Prerequisites Check
- Verify required tools are available
- Check for required API keys/secrets (report missing ones)
- Validate environment setup
- If blocked: report blocker with clear next-step options

### 3. Authorization Verification
- Check if authorization grant detected
- Verify authorization scope matches requested operations
- Proceed only if authorization covers the task

### 4. Plan Generation (if needed)
- Use `plan` skill for complex multi-step tasks
- Generate numbered steps with completion criteria
- Identify skill dependencies

### 5. Execution Loop
For each step:
1. Execute the action
2. Verify with real tool output
3. Document result
4. Move to next step

### 6. Verification & Reporting
- Cross-check all deliverables
- Provide evidence for each claim
- Summarize with numbered pipeline report

## Trigger Phrase Classification

| Phrase | Type | Interpretation |
|--------|------|----------------|
| "下一步" | Continuation | Resume execution, proceed to next logical step |
| "繼續" | Continuation | Continue without interruption |
| "完成" | Completion | Continue until fully complete |
- "最佳實踐" | Quality | Apply all best practices, optimize approach
- "授權X" | Authorization | Grant permission for action X
- "全部都做" | Completeness | Complete all sub-tasks, no partial work
- "快點"/"趕快" | Urgency | Prioritize, execute immediately
- "是" | Continuation | Proceed with the proposed next action without re-asking for confirmation
- "繼續完成" | Blocked continuation | User explicitly says to keep going after an environment/blocker was reported; continue toward completion and only ask if a new decision is required

## Authorization Scope Mapping

| Authorization Type | Permitted Actions | Verification Required |
|-------------------|-------------------|----------------------|
| 密碼授權 | Password operations, auth flows | Verify auth success |
| CLI授權 | Terminal commands, scripts | Verify command output |
| 自主代行授權 | Subagent delegation, parallel tasks | Verify subagent completion |
| 代主通典授權 | Principal operations, API calls | Verify principal action |

## Multi-Skill Composition Patterns

### Debug Workflow
```
systematic-debugging → identify root cause → fix → verify
```

### TDD Workflow
```
plan → write failing test → watch fail → implement → watch pass → refactor
```

### Deployment Workflow
```
build → test → verify → deploy → post-deploy verification
```

### Research Workflow
```
research question → gather sources → analyze → synthesize → deliver
```

### Authorization Workflow
```
authorization detected → verify scope → execute authorized actions → verify completion
```

## Prerequisites Check Matrix

| Task Type | Required Checks |
|-----------|-----------------|
| GitHub operations | `gh auth status`, repo access, PAT validity |
| Cloud deployments | API keys, region access, quota |
| Database operations | Connection string, schema, credentials |
| External APIs | Auth tokens, rate limits, endpoint availability |
| CLI operations | CLI tool installed, PATH configured |
| Subagent tasks | Task specification, resource allocation |

## Verification Protocol

After each significant operation:

1. **File edits**: Read back to confirm changes applied correctly
2. **Terminal commands**: Capture and verify output for success/failure
3. **API calls**: Confirm HTTP status or response data
4. **Deployments**: Verify target system state matches expectation
5. **Tests**: Run actual test commands, not just assume
6. **Authorizations**: Confirm authorization was properly applied

## Numbered Pipeline Reporting

When reporting multi-step work:

```
1. 步驟一: 完成 (real output evidence)
2. 步驟二: 完成 (real output evidence)
3. 步驟三: 跳過 (reason - e.g., "no linter configured")
4. 步驟四: 完成 (real output evidence)
```

**Never leave gaps** - Every number in sequence must be accounted for.

## Common Pitfalls to Avoid

1. ❌ Asking "Shall I continue?" after trigger phrase
2. ❌ Pausing for confirmation on routine operations
3. ❌ Leaving numbered steps unaccounted for in reports
4. ❌ Not verifying tool outputs with real runs
5. ❌ Missing external blocking issues (cloud keys, network, permissions)
6. ❌ Fabricating success for blocked operations
7. ❌ Proceeding without proper authorization scope

## When Blocked

Only stop for genuine external blockers:

- Missing cloud API keys (report which key needed)
- Network connectivity failures
- Permission denied errors
- External service unavailable
- Missing required authorizations

When `terminal`, `execute_code`, or `process` tools are BLOCKED:
1. **Try alternate tool channels** - computer_use, browser_navigate, web_search, mcp file server
2. **PowerShell Fallback** - Provide complete PowerShell script blocks for manual execution
3. **File-based Automation** - Write scripts to accessible directories first
4. **Cronjob Scheduling** - Use `no_agent: true` with specific timestamps
5. **Memory Archiving** - Use `hindsight_retain` for permanent knowledge storage
6. **Report blocker clearly** with next-step options

### Multi-Tool Fallback Ladder (Windows / Hermes Desktop)
```
terminal (SSH)        → ❌ getsockname / network wall
computer_use (cua)   → ❌ driver timeout / unavailable
browser_navigate     → ✅ read-only page fetches (GitHub PRs return real
                        data WITHOUT login for public/merged PRs)
web_extract/web_search → ⚠️ Firecrawl credits can be EXHAUSTED
                        ("Payment Required") — do NOT retry, switch channel
mcp__my_server       → ✅ file read/write only (no shell/git)
execute_code         → ✅ Python subprocess → real git-bash for script
                        syntax + set -e control-flow verification
```

Rule: try the next channel, do not retry the same failed channel expecting different output. Distinguish **environment blocker** (cannot run) from **task blocker** (task cannot proceed even if tools worked).

#### Verified recipe when terminal AND Firecrawl are both down (2026-08 session-proven)
1. **Read-only fetches (GitHub PR review, etc.):** use `browser_navigate(url="https://github.com/<owner>/<repo>/pull/<n>")` and `.../pull/<n>/files`. These returned real title/author/branch/status/diff **without a login wall** for public + merged PRs. ⚠️ GitHub redirects `pull/new/<n>.files` to a "create new PR" page if the PR # doesn't exist — that is itself proof the user-supplied PR meta was fabricated; always cross-check the real page. Private/draft PRs hit a Sign-in wall — do NOT type passwords.
2. **Shell-script verification without `terminal`:** `execute_code` can shell out to the **local git-bash binary** `C:\Program Files\Git\bin\bash.exe` (the SSH wedge is in Hermes's `terminal` tool, not the bash binary). Syntax: `bash -n script.sh`. Control-flow: create a temp dir with a **stub CLI** (e.g. `oci` that `echo '[]'`) placed FIRST on `PATH`, then run the real script under `set -e` — proves it reaches its final summary instead of aborting on empty CLI output. This catches the classic `set -e + grep -c` early-abort bug (fix: append `|| true` to every count-grep). **Label such runs as mock-backed; never claim "已安裝/已佈建通過" from a stub run.** Full recipe in `references/blocked-tool-verified-fallbacks.md`.

Report the blocker clearly with next-step options:
```
⚠️ 阻塞: terminal/execute_code/process 工具被阻止
請在 PowerShell 中執行以下腳本:
[完整 PowerShell 腳本內容]
```
```
⚠️ 阻塞: 缺少 GITHUB_TOKEN secret
請在 GitHub repo Settings → Secrets 設定: GITHUB_TOKEN
完成後回覆「已設定，繼續」
```

## Skill Integration Points

### With `hermes-usage-best-practices`
- Use goal-first instructions, not step-by-step scripts
- Specify deliverable shape explicitly
- Batch independent operations

### With `systematic-debugging`
- When issues arise, auto-invoke Phase 1 investigation
- Build tight feedback loops
- Never fix without root cause

### With `test-driven-development`
- For code changes: RED → GREEN → REFACTOR cycle
- Verify each test failure is expected
- Watch tests pass before considering done

### With `plan`
- Complex tasks auto-trigger plan generation
- Each plan step gets completion criteria
- Progress tracked via numbered pipeline

### With `hermes-portal-integration`
- Authorization grants trigger portal operations
- API key management flows
- Secret validation and injection

## Support Files

### References
- `references/authorization-patterns.md` - Sequential authorization flow patterns for 密碼授權 → CLI授權 → 自主代行授權 → 代主通典授權
- `references/portal-api-keys.md` - Key management and rotation patterns
- `references/blocked-tool-verified-fallbacks.md` - When terminal(SSH) AND Firecrawl both down: browser_navigate for read-only GitHub PR fetches + execute_code→git-bash stub-CLI mock runs for set -e control-flow verification

### Scripts
- `scripts/verify_authorization.sh` - Verify each authorization type completion

## Verification Checklist

- [ ] Trigger phrase correctly identified as autonomous signal
- [ ] Full scope of work analyzed before starting
- [ ] Prerequisites checked (keys, tools, environment)
- [ ] Authorization verified (if applicable)
- [ ] Plan generated (if needed) with numbered steps
- [ ] Each step executed and verified with real output
- [ ] No gaps in numbered pipeline reporting
- [ ] External blockers reported honestly (not fabricated)
- [ ] Final summary includes evidence of completion
- [ ] All deliverables verified against success criteria

## Related Skills

- `hermes-usage-best-practices` - General prompting patterns
- `systematic-debugging` - When issues need investigation
- `test-driven-development` - For verification-focused workflows
- `hermes-agent-skill-authoring` - For creating/modifying skills
- `plan` - For complex multi-step task planning
- `hermes-portal-integration` - For authorization and API integration