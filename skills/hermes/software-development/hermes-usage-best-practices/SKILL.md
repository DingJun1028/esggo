---
name: hermes-usage-best-practices
description: "Use when the user wants to prompt Hermes effectively, choose/compose skills, or run long tasks, background jobs, or cron correctly. Covers goal-first instructions, parallel tool calls, skill composition, finishing-the-job discipline, and local cron limits."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [prompting, skills, background, cron, best-practices]
    related_skills: [hermes-agent-skill-authoring, plan, systematic-debugging]
---

# Hermes Agent Usage Best Practices

## Overview

This skill documents how to get the most out of Hermes Agent and its skill library. It is about *working with* the agent: how to phrase requests, how skills are selected and composed, and how to use long-running execution modes (background jobs, cron) without surprises. The underlying rule across all of it: the agent performs best when given a *goal plus constraints*, not a step-by-step script.

## When to Use

- User asks "how should I prompt you" / "best practices" for working with Hermes.
- A task spans multiple skills and needs composing (plan → TDD → PR, debug → review).
- A task will run longer than ~1 min (build, test, deploy) and should use background execution.
- A recurring/unattended task is being scheduled (cron) — and the user must know local cron does not push results back into this terminal.
- Don't use for: authoring a *new* skill (see hermes-agent-skill-authoring); writing a project plan (see plan).

## 1. Goal-first instructions

Give the target outcome and any constraints; let the agent decide the steps and tools.

- Weak: "cd to X, run npm test, paste results." (micro-manages steps)
- Strong: "Make the esggo tests pass and fix the failing cases; give me a failure-cause summary." (states outcome)

State the *deliverable shape* explicitly: edit files in place? terminal report? runnable script? "Fix the bug directly in App.jsx and verify with vitest" beats "look at App.jsx."

Scope precisely — neither too vague ("optimize the project") nor needlessly granular. The agent batches independent reads/commands/searches into one parallel turn, so give all independent info up front rather than across three messages.

## 2. Skill selection and composition

The agent scans available skills before every reply and auto-loads the obvious match (e.g. "open a PR" → github-pr-workflow). You may name a skill to force it: "use github-pr-workflow's standard flow."

Real work rarely fits one skill. Compose them:
- plan + test-driven-development + github-pr-workflow — plan, then TDD, then PR.
- systematic-debugging + requesting-code-review — root-cause debug, then pre-commit security/quality gate.
- firebase-react-apps + github-secrets — build the React/Firebase feature and stash config in repo Secrets.

If a loaded skill is wrong/outdated, the agent patches it via skill_manage (no action needed from you).

## 3. Finishing-the-job discipline

The deliverable is a *working artifact backed by real tool output*, not a plan or a plausible-looking fake. The agent runs the tests, edits the files, and verifies. If a tool/install/network call blocks the real path, it reports the blocker honestly instead of fabricating output. Treat any "success" claim on an operation with external side effects (upload, PR, remote write) as needing verification — the agent re-checks before telling you it succeeded.

## 4. Long-running and unattended execution

- **Background jobs:** for anything > ~1 min (test/built/deploy), run with background=true and notify_on_complete=true. You are not blocked; you get pinged on completion.
- **Subagents (delegate_task):** for context-flooding work (debugging, code review, research synthesis), spawn leaf subagents that return only a final summary. Their self-reports are not verified facts — re-verify side effects.
- **Cron:** for recurring monitors/watchdogs/digests, set deliver to a connected messaging platform (e.g. telegram) if you want to be notified. On this CLI, a local-only cron (deliver='local' or default) saves output but does **NOT** push it back into this terminal — check with action='list'.

## 5. Memory and cross-session context

Stable facts (paths, env constraints, token portability, language preference) belong in memory so you never re-state them. New durable facts → ask the agent to "remember." To recall a past conversation, use session_search rather than re-explaining.

## 6. Common anti-patterns (avoid)

- Writing PowerShell/cd/ls as if it were the agent's syntax — it runs POSIX (bash/git-bash) even on Windows.
- Expecting a local cron to DM you — it won't (local-only).
- Pasting PATs/tokens into chat and leaving them — the agent prompts rotation after use.
- Using cat on images/binaries — use the vision tool, not read_file.
- Trusting stale memory over current code — re-read the actual files before acting (see Verification Checklist).
- Leaving gaps in a numbered step sequence — when a step in a defined pipeline is correctly skipped (e.g. an auto-fix loop when nothing failed, or lint when no linter is installed), state "Step N: skipped (reason)" explicitly. Letting the numbering jump from N to N+2 looks like hidden work and is a reporting defect even when the skip is correct. Equally a defect: dodging the gap with excuses ("it wasn't needed", "the skill didn't require it") instead of plainly owning it. A skipped or missed step is reported as a skipped/missed step — never rationalized away.

## Verification Checklist

- [ ] Request states the outcome + deliverable shape + constraints (not raw steps).
- [ ] If multi-skill, the composition is explicit and ordered.
- [ ] Long task uses background=true + notify_on_complete=true.
- [ ] Side-effecting "success" was re-verified (not taken on subagent's word).
- [ ] Cron deliver target chosen deliberately; local-only limitation acknowledged.
- [ ] Memory updated with any new stable fact; stale memory corrected against real files.
- [ ] Before fixing a "known bug," the agent confirmed it still exists in the current code.
- [ ] In any numbered pipeline report, every step number is accounted for — skipped steps are explicitly marked "skipped + reason", never left as a hole in the sequence.
