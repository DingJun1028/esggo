# Automatic Execution Examples

## Good Usage

```
User: "下一步"
Agent: [Completes all remaining work]
Agent: [Verifies with real runs]
Agent: [Summary of completed work]
```

## Bad Usage (to avoid)

```
User: "下一步"
Agent: "Should I continue with step 1, 2, and 3?"  # ❌ Asking for confirmation
```

## Task Completion Checklist

When user says "全部都做" or "繼續":

- [ ] Complete the task end-to-end
- [ ] Use real tool calls to verify
- [ ] Report results with concrete output
- [ ] Only ask questions if blocked by:
  - Missing API keys
  - Network issues
  - External service failures

## Signal Recognition

| Signal | Interpretation |
|--------|---------------|
| "下一步" | Autonomous continuation |
| "繼續" | Resume execution |
| "全部都做" | Complete everything |
| "最佳實踐" | Apply best practices |
| "授權" | Authorize execution |