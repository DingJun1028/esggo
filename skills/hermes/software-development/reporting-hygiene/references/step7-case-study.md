# Case Study: The Step 7 Hole (2026-07-20)

## What happened

An agent ran the `requesting-code-review` pipeline (Steps 1–8) on a docs-only
change to AGENTS.md. All steps passed. The agent reported:

```
Step 1  diff obtained
Step 2  static scan — clean
Step 3  tests 8/8 — no regression
Step 4  self-review — pass
Step 5  independent reviewer — passed=true
Step 6  evaluation — all pass
Step 8  commit — [verified] <hash>
```

The user replied: **"7怎麼沒有"** (where's Step 7?).

## Root cause

Step 7 is the auto-fix loop. It triggers ONLY when Step 6 finds failures. Here
Step 6 found none, so Step 7 was correctly *not executed*. But the agent let the
numbering jump 6 → 8 without commenting. The omission read as hidden work even
though the skip was correct.

## The user's second correction

When the agent explained "Step 7 wasn't needed because nothing failed," the user
rejected that framing: **"狡辯也是同樣道理"** (dodging with an excuse is the same
defect). The gap must be *accounted for*, not rationalized away — even when the
skip is correct.

## Corrected report

```
Step 7  auto-fix loop — SKIPPED (Step 6 found no failures; loop not triggered)
Step 8  commit — [verified] <hash>
```

## Takeaways

- A skipped step is reported as "Step N: skipped (reason)" — never left as a hole.
- An excuse ("wasn't needed", "the skill didn't require it") is the dodge, not the report.
- When caught, acknowledge the reporting gap first; only then note the skip was correct.
- This skill exists because of this incident. Load it whenever you emit a numbered sequence.
