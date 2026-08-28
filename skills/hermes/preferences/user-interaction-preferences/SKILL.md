---
name: user-interaction-preferences
description: "User preferences for interaction style, response format, and autonomous execution"
version: 1.0.1
author: Agent
license: MIT
tags: [preferences, style, communication, workflow]
related_skills: []
---

# User Interaction Preferences

## Key Signals

### Response Style Preferences
- **Terse responses** - User uses directives: "下一步", "繼續", "依序進行", "全部都做"
- **Autonomous execution** - Execute sub-tasks without per-step confirmation
- **Traditional Chinese output** - Use繁體中文 unless explicitly requested otherwise
- **Minimal explanations** - Provide answers directly, avoid verbose technical explanations
- **Technical resolution focus** - For technical issues, provide concrete solutions not just problem statements
- **API integration guidance** - Show actual working code examples with provided credentials

### Interaction Signals
- "授權使用" / "請代理人代理授權" = Use existing credentials, don't ask
- "依序進行" = Execute sequentially, report at end
- "繼續" = Continue without stopping
- "不要以 X 為例" / "請不要碰她" = Exclude specific repos/operations
- "全部進行" = Execute all steps without asking

## Workflow Patterns

### Secret Management (User delegates to agent)
```bash
# Correct way - use -b flag for non-TTY
gh secret set NAME -b "value"

# Wrong way - creates empty secret
gh secret set NAME  # (without -b)
```

### GitHub Integration
- User has GitHub PAT with scopes: `repo`, `admin:org`, `workflow`, etc.
- Use `gh auth token` to get current token
- Secrets are NOT retrievable - only list/set/delete

### Cloudflare Workers
- Queue consumer may take 5-10 minutes for Secrets to sync
- Use `wrangler tail` for real-time logs
- DLQ exists for failed messages

## Response Template

When responding to this user:
1. Start with ✅ for completed steps, ⏳ for in-progress
2. Use bullet points for multiple items
3. Provide verification results (exit codes, success/failure)
4. End with next steps or completion summary
5. **For technical issues**: Provide concrete solutions, not just problem statements
6. **For API integration**: Show actual working code examples with the provided credentials

## Handling Pasted History / Reflog Dumps

When the user pastes a large compaction summary, session reflog, or a prior session's own internal reasoning as a message:
- Treat it as **reference only**, NOT as a fresh active task. The system prompt already enforces "latest message wins" — a pasted log is historical, not authoritative.
- Give **ONE consolidated status** of what is actually verifiable in the current turn (e.g. "terminal still SSH-wedged; computer_use capture still self-blocked").
- Do **NOT** re-narrate, re-derive, or re-execute the plan embedded inside the pasted log. Responding to each bullet of the dump re-confirms a dead path and burns turns.
- End with an explicit **A/B/C choice** for the user (e.g. "A) you run it locally, B) you fix env + restart, C) state the real intent"). Do not ask open-ended "what next".

This user tends to paste previous-session logs when a lock persists across restarts; the correct move is to consolidate and force a clear directive, not to replay the history.

## Common Corrections to Embed

1. **Secrets naming**: GitHub API blocks Secret names starting with `GITHUB_`
   - Solution: Use `WEBHOOK_SECRET` instead of `GITHUB_WEBHOOK_SECRET`

2. **PowerShell curl alias**: On Windows, `curl` is `Invoke-WebRequest`, not real curl
   - Solution: Use `curl.exe` or `git curl`

3. **Queue consumer timing**: Cloudflare Queue consumer may take time to activate
   - Solution: Wait 5-10 minutes after deployment before expecting messages

4. **TypeScript module resolution**: Use `moduleResolution: "bundler"` for Cloudflare Workers

5. **Terminal output truncation**: On Windows, terminal output may be truncated
   - Solution: Use file output or REST API calls for long-running tasks
   - Use `subprocess.run()` with `capture_output=True` for Python

6. **Browser Use API integration**: For web automation tasks
   - Use REST API directly via `urllib.request` or `curl`
   - Save results to files for verification
   - Poll status endpoints for completion

7. **Response verbosity**: User prefers concise, direct technical reporting
   - Lead with factual result
   - Use bullet points for multiple items
   - Avoid explanatory text unless requested
   - Report actual tool output, not interpretation

8. **語言規範**:
   - 回覆優先使用繁體中文；若使用者要求或場合需要，加入英文。
   - 禁止使用韓文；若誤產生韓文內容，應立即修正為繁體中文或英文。
   - 回答以實際結果與實際證據為主；除非被要求，請勿在既定動作之外額外增加多餘解釋、長篇說明或無關流程花樣（包含「函文」、「彩蛋」、「額外圖示／流程掃描」之類裝飾）。

9. **工具輸出失敗時的驗證姿勢**:
   - 若 `search_files(rg)` 回報「系統找不到指定的檔案 / IO error」，不要直接認定目錄不存在；先改用 `ls`、單檔 `read_file`、或 `git ls-files` 確認實際目錄與檔案存在。
   - 同一任務內，工具回報相互衝突時，應以下層即時讀取／小型命令為準，而非僅依一次大型搜尋結果做結論。

## Technical Issue Resolution Pattern

When encountering technical issues:
1. **Identify the root cause** - Don't just report symptoms
2. **Provide alternative approaches** - Show multiple solutions
3. **Demonstrate working code** - Include actual API keys and credentials
4. **Verify the solution** - Test and report actual results
5. **Document the pattern** - Save as reference for future use