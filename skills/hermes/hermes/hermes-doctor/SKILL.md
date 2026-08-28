---
name: hermes-doctor
description: "Interpret hermes doctor output and its workspace advisories."
version: 1.0.0
author: OA-Team
license: MIT
platforms: [linux, macos, windows]
---

# Hermes Doctor — Correct Interpretation & Remediation

`hermes doctor` is a **diagnostic readout, not an auto-fix tool**. Run it when the user asks for a health check or says `hermes doctor --fix`, then interpret each finding against the mapping below before proposing or applying any remediation. Do not promise that `--fix` cleared everything — it often applies nothing.

## What doctor actually does

- Reads the live environment: Python, SQLite journal mode, SSL CA bundle, config.yaml version/keys, auth state, npm audit of Hermes's own workspaces, tool availability, skills hub.
- Is **read-only** for the most part. Any auto-remediation is whatever the CLI chooses to apply on its own; do not assume it fixed flagged items.
- Can hang on the network health check (up to ~180s). If it stalls, say so and fall back to targeted checks.

## The four advisory classes and how to read them

### 1. `state.db is large (X GB) — consider enabling sessions.auto_prune`

- **First check:** Is `sessions.auto_prune` already `true` in config? Use `hermes config get sessions.auto_prune` or read config.yaml. If already enabled, this is a **false-positive advisory** — the check does not always reconcile against live config. Say so; do not re-enable.
- **If not enabled:** enable via `hermes config set sessions.auto_prune true` (never hand-edit config.yaml).
- **Scope params:** `sessions.prune_after_days` and `sessions.keep_last_n` control what gets trimmed. keep-last-n=100 is usually fine.
- **Manage expectations:** auto_prune bounds *future* growth; it does not shrink an already-large DB instantly.

### 2 & 3. `web workspace deps (...) build-tool advisory; clears via lockfile bump` and `ui-tui workspace deps (...)`

**This is the most-misread pair. Get the scope and tool right:**

- **Scope:** these advisories are about Hermes's **own internal dev workspaces**, typically under the Hermes home directory (e.g. `~/AppData/Local/hermes/hermes-agent/web/` and `.../ui-tui/` on Windows). They are **not** the user's project (e.g. not esggo, not any app the user is building).
- **Tooling mismatch:** doctor runs `npm audit --workspace web` and `npm audit --workspace ui-tui` (npm), **not pnpm**. Those workspaces often have a `package.json` but no lockfile. Running `pnpm audit` there will say "No pnpm-lock.yaml found" — that is expected, not a problem.
- **Severity reality:** these are build-time dev-tool transitive advisories (esbuild/vite/postcss/undici chains etc.). They do not ship to users. npm scores them "high" but real-world impact for the CLI agent runtime is low.
- **How to actually clear them:**
  1. Generate the missing lockfile: `cd <workspace-dir> && npm install` (or `npm install --legacy-peer-deps` if peers complain).
  2. Run the root-level fix from the Hermes agent root: `npm audit fix --workspaces=false`. Do **not** use `--workspace <name>` with `npm audit fix` — it crashes npm on this monorepo tree (arborist bug: edgesOut / isDescendantOf).
  3. Re-check: `npm audit --json --workspace web` and `--workspace ui-tui` to confirm counts dropped.
- **Residuals are normal.** Transitive build-tool chains often leave unfixable high counts with no npm action offered. Do not recommend `--force` unless the user explicitly accepts semver-break risk. Leaving them as advisory is acceptable.
- **pnpm users:** running `pnpm audit --fix=update` in a *different* project (e.g. esggo root) does **not** affect these Hermes-internal workspaces. They are separate trees, separate package managers.

### 4. `Run 'hermes setup' to configure missing API keys for full tool access`

- Optional setup nudge, **not a blocker**. Missing keys just mean some optional tools (Discord, x_search, spotify, feishu, browser-cdp) are unavailable.
- Do not run `hermes setup` unless the user asks. Missing keys are often intentional (free/self-hosted preference, or those channels unused).
- If the user wants full tool access, run `hermes setup` and let the wizard prompt for each missing key.

## The false-positive check pattern (apply to ANY advisory)

Before treating a doctor finding as actionable:

1. Read the relevant config/key yourself (`hermes config get <path>` or read config.yaml).
2. If the config already matches the "good" state, label it a false positive and say so — do not re-apply.
3. For workspace advisories, confirm scope (Hermes-internal vs user project) and tool (npm vs pnpm) before proposing anything.

## Verification evidence rule

- Report only what real tool output returned. If `npm audit --workspace web` says 4 high, say 4 high — do not claim "cleared" because pnpm audit was clean in another tree.
- If doctor hangs, say so and fall back to targeted checks rather than pretending the run completed.

## Pitfalls

- **Never hand-edit config.yaml.** Always `hermes config set`. A stray indent breaks the live gateway.
- **Do not tell the user `--fix` cleared advisories** when doctor still shows them after the run. `--fix` may have done nothing; be honest about the residual.
- **Do not confuse the user's pnpm workspaces with Hermes's npm workspaces.** Different trees, different package managers, different advisory scopes.
- **`npm audit fix --workspace <name>` crashes npm** on this monorepo tree. Use root-level `npm audit fix --workspaces=false` instead.
- **`pnpm audit` in a dir with no lockfile** errors "No pnpm-lock.yaml found" — expected. Generate the lockfile first if you want to clear via pnpm.
- **Do not treat build-tool advisories as urgent.** They are dev-time, not runtime, and often have no clean fix path.

## When to escalate to the user

- User explicitly wants Discord / x_search / spotify / feishu / browser-cdp tools → offer `hermes setup`.
- User wants workspace advisories fully cleared and accepts semver risk → offer `npm audit fix --force`.
- User is worried about state.db size → confirm auto_prune is enabled; if not, enable it; explain it bounds growth, not shrinks.
- User expects `--fix` to have cleared everything → explain doctor is diagnostic and what actually changed vs what remains advisory.
