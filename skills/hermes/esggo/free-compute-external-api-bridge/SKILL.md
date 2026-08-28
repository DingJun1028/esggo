---
name: free-compute-external-api-bridge
category: esggo
description: "Bridge a paid SaaS API to OmniJules without billing."
version: 1.0.0
author: Hermes Agent (autonomous session)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [esggo, oa-team, 5t, free-compute, api-bridge, soul-md-17, jules]
---

# Free-Compute External API Bridge

When the user pastes a paid SaaS API doc and says "give this to OmniJules" (or similar),
build a bridge that preserves the knowledge but never actually bills them. This user has a
hard rule: **only free compute** — no paid API keys, no private npm. Violations must fall
back to free paths automatically. (Anchored in OA-Team soul.md §17 "外部協力映射".)

## When to use
- User pastes a paid API Quickstart/reference and asks to "hand it to OmniJules / the swarm".
- Any task that would otherwise require calling a metered cloud endpoint.
- Building an adapter that maps an external capability onto the free self-hosted stack.

## Hard rules
1. **Archive first.** Save the raw API doc as a reference file (e.g. `tools/<svc>-api-reference.md`)
   so OmniJules can read the capability without a live call.
2. **Map every paid endpoint to a free equivalent** in the user's own stack:
   - list sources → `gh repo list`
   - create session → trigger OA-TWINS `auto-repair.yml` workflow
   - approve plan → 5T 驗算闡 (EntropyForge.applyHashLock) auto-gate
   - list activities → `gh run list`
   - send message → OAB event bus `publish({tag:'agent:NN', ...})`
3. **Strict paid gating.** Paid path fires ONLY when ALL hold:
   `MODE=paid` AND `API_KEY` set AND `ALLOW_PAID_API=1`. Otherwise free fallback — always.
   When gated ON, print a stderr warning that this bills a paid SaaS and violates free-compute.
4. **Side effects default to DRY-RUN.** Any command that triggers an external action
   (dispatch workflow, call API) must NOT execute unless an explicit `EXECUTE=1` env is set.
   Print the equivalent command instead.

## Pitfalls (proven this session)
- **False-success side effect.** `gh workflow run` writes failures to stderr and empty stdout —
  naive `&& echo "✅ done"` misreports success. Always verify with a follow-up read
  (`gh run list --limit 1` confirms whether a new run was actually consumed). Never trust
  stdout alone.
- **Lint before deliver.** `ruff check` caught an unused `typing.Any` import; a `print(REF)`
  returned `None` instead of the path. Run `py_compile` + `ruff check` + behavioral DRY-RUN
  self-test + paid-gating check (no key ⇒ free fallback) + side-effect confirmation.

## Dual-file shape
Ship both a bash (`*.sh`) and python (`*.py`) bridge so either shell can use it. Both share
the same gating/env contract. Keep the free-equivalent mapping table in the SKILL or a
`references/` file.

## Deliverable verification protocol
1. `python3 -m py_compile bridge.py` → COMPILE_OK
2. `python3 -m ruff check bridge.py` → All checks passed!
3. `python3 bridge.py selftest` → every call reports free path, never touches paid host
4. `MODE=paid ALLOW_PAID_API=1 python3 -c "..."` with no key → `paid_allowed=False`, free fallback
5. confirm no external action consumed (e.g. `gh run list` shows no new run)

See `references/free-bridge-pattern.md` for the concrete Jules mapping and self-test recipe.

## Relationship to other skills
- `oa-team-soul-canon` (user-owned, recommend `hermes curator adopt`) carries the §17 mapping
  this pattern implements. If adopted, fold this bridge into its §13.
- Do NOT edit user-owned skills; if you discover one is outdated, recommend adoption.
