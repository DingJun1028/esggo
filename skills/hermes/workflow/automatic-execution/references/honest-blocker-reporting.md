# Honest Blocker Reporting

Use this when autonomous execution cannot complete because of an external blocker.

## Rule

Do not fabricate success. Do not silently skip deployment steps. Report the blocker with evidence and concrete options, then stop.

## Template

```
已繼續把四項任務推進到可交付狀態，並保留一條真實阻塞。

目前完成：
1. ...
2. ...
3. ...
4. ...

真實阻塞：
- <specific blocker with evidence>
- 因此無法 <specific consequence>

你要我下一步：
A. <option 1>
B. <option 2>
C. <option 3>
D. 先停在這裡，後續再繼續
```

## Decision tree

- Missing credentials / auth wall → offer to set secret or restore auth
- Network / SSH / publickey failure → offer manual steps or alternative transport
- External service unavailable → offer degraded/local fallback
- Ambiguous next action → offer A/B/C/D instead of guessing

## Why this matters

Fabricated success survives in conversation history and gets treated as fact. Honest blocker reporting preserves trust and lets the user choose the next step.
