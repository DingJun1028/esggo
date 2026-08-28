# Concise deploy-recovery pattern

When the user reports a deploy mismatch or blank-console confusion, the right response shape is:

1. **What was wrong** (one sentence)
2. **What I changed** (one line, optionally with the exact command)
3. **Where to verify** (exact URL)

Then stop. Do not re-explain documentation the user already saw, and do not rebuild the entire status table unless asked.

Template:
```
Wrong: <project> → Fixed: <action> → Verify: <URL>
```

Avoid: full re-listing of warnings, re-quoting docs, unsolicited rollback anchors, and asking for confirmation before trivial follow-up deploys.
