---
name: reporting-hygiene
description: "Use when the agent produces a numbered or stepwise report, or runs a defined pipeline (e.g. code-review Step 1-8). Ensures no step is silently dropped from the sequence and no gap is rationalized away with excuses."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [reporting, honesty, verification, step-sequence, no-dodging]
    related_skills: [hermes-usage-best-practices, requesting-code-review, systematic-debugging]
---

# Reporting Hygiene

## Overview

When an agent reports work as a numbered sequence (pipeline steps, checklists,
task lists), the sequence itself is a claim: "I did exactly these steps, in this
order." Two failure modes quietly undermine that claim — both are reporting
defects even when the underlying work was correct:

1. **Holes in the sequence** — a step is correctly skipped (nothing failed, no
   linter installed) but the numbering jumps N → N+2 without comment. Looks like
   hidden work.
2. **Rationalizing the gap** — instead of plainly stating the skip, the agent
   explains it away ("wasn't needed", "the skill didn't require it"). The gap is
   still unaccounted; the excuse just buries it.

Core rule: a skipped or missed step is reported as *skipped / missed + reason*.
Never dodged, never excused.

## When to Use

- Producing any numbered report: code-review pipelines, build/test sequences,
  multi-step plans, ordered task lists.
- A defined pipeline step is skipped because a precondition wasn't met.
- Self-review: scan your own output for missing step numbers before sending.

Don't use for: free-form prose where no sequence is implied (a gap there isn't a
defect). Do use for any list the reader could number.

## The Rule, Concretely

For every step number in a defined sequence:

- **Executed** → state what happened and the result (e.g. "Step 3: tests 8/8 pass").
- **Skipped (correctly)** → state it: "Step 7: skipped — Step 6 found no failures,
  auto-fix loop not triggered." Name the reason.
- **Missed (my error)** → own it: "Step 7 was omitted from my earlier report; it
  should have been marked skipped. Corrected here." Do not retrofit an excuse.

Forbidden phrasings (these are the dodge, not the report):
- "Step 7 wasn't needed."
- "The skill didn't require it."
- "We can skip that part." (without stating it was a step in the sequence)

## Worked Example

A pre-commit review has Steps 1-8. Steps 2, 3, 5 all pass; Step 6 finds no
failures. Correct report:

```
Step 1 diff obtained
Step 2 static scan — clean
Step 3 tests 8/8 — no regression
Step 4 self-review — pass
Step 5 independent reviewer — passed=true
Step 6 evaluation — all pass
Step 7 auto-fix loop — SKIPPED (Step 6 found no failures; loop not triggered)
Step 8 commit — [verified] <hash>
```

Incorrect (the dodge): "...Step 6 all pass, so we committed." — Step 7 vanished
with no account. Even though skipping was right, the silent hole is the defect.

## Relationship to Other Skills

- **hermes-usage-best-practices** — links here for the "numbered gaps" anti-pattern.
- **requesting-code-review** — the Step 1-8 pipeline is the canonical case; apply
  this skill whenever you report that pipeline.
- **systematic-debugging** — Phase 1 "confirm the bug exists" pairs with this:
  reporting "I fixed it" without first confirming it existed is the same class of
  unverified claim.

## Common Pitfalls

1. **Silent skip** — jumping N → N+2. Fix: write "Step N+1: skipped (reason)".
2. **Excuse instead of account** — "wasn't needed" hides the gap. Fix: state skipped/missed plainly.
3. **Retroactive justification** — after being caught, explaining why it was fine.
   Fix: acknowledge the reporting gap first, then optionally note the skip was correct.
4. **Over-numbering prose** — forcing a sequence onto narrative text. Fix: only number
   where a defined pipeline or ordered list exists.

## Verification Checklist

- [ ] Every step number in the reported sequence is present or explicitly marked skipped/missed.
- [ ] Each skipped step names its reason (no bare "skipped").
- [ ] No step is explained away with "wasn't needed" / "not required" instead of accounted.
- [ ] If a step was missed in an earlier message, it is acknowledged as a miss, not excused.
- [ ] The reader could reconstruct the exact set of steps performed, with no holes.
