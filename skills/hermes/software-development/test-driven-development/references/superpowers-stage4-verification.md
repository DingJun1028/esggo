# Subagent Verification Pitfall — Learned

> **Source**: Superpowers Stage 4 execution — 4 parallel subagents dispatched for TDD implementation
> **Date**: 2026-08-26
> **Branch**: `feature/aistation-core-modules`
> **Hash Lock**: `sha256:subagent_verification_pitfall_v1`

---

## Problem

Subagents may report creating files that don't actually exist on disk. When dispatching parallel subagents for TDD implementation, the subagent's **summary may claim success** but the actual files may be missing or tests may not actually pass.

### Production Observation

In a real Superpowers Stage 4 execution with 4 parallel subagents:
- ✅ Subagent sa-0 (DNA Parser) — **actually created** `tests/test_dna_parser.py` + `src/parsers/dna_parser.py` (committed in `25944a909`)
- ✅ Subagent sa-1 (TTS) — **actually created** `tests/test_speech.py` + `src/synthesizers/speech.py` (real 23,616-byte mp3 generated)
- ⚠️ Subagent sa-2 (Visual) — **claimed created** `tests/test_visuals.py` but file did NOT exist on disk
- ⚠️ Subagent sa-3 (Evidence) — **actually created** `src/storage/evidence.py` + `tests/test_evidence.py`

**Root cause**: Subagent summaries are self-reports, not verified facts. Two of four subagents' deliverables did not match their claims.

---

## Solution: Mandatory Post-Completion Verification

Always include explicit verification steps in the subagent's context:

```python
delegate_task(
    goal="Implement Module X using strict TDD",
    context="""
    After completing TDD (RED-GREEN-REFACTOR):
    1. Run `ls tests/` to confirm test file exists
    2. Run `ls src/` to confirm source file exists
    3. Run `pytest tests/ --collect-only` to confirm ALL tests are discovered
    4. Run `pytest tests/ -v` to confirm all tests PASS
    5. Return full pytest output — NOT just a summary
    """,
    toolsets=['terminal', 'file']
)
```

---

## Tool Selection: terminal vs execute_code

> **Preference**: Use `terminal` for running tests, NOT `execute_code`.

- `execute_code` requires user consent and may be **BLOCKED**
- `terminal` runs directly in the sandboxed environment without consent
- Both can run pytest, but `terminal` is more reliable

```bash
# Correct approach:
terminal("cd /path/to/project && python -m pytest tests/ -v --tb=short")
```

---

## Additional Pitfalls (Learned)

### Path Issues on Windows
```bash
# WRONG: Path("/c/Users/dingj/secret-vault") fails
# CORRECT: Use C:/c/Users/dingj/ (actual CWD is C:\c\Users\dingj)
```

### Git Worktree Already Checked Out
```bash
# Error: 'feature/branch' is already used by worktree at 'C:/c/Users/dingj/esggo'
# Solution: Run git worktree list to see existing worktrees, then use a different path
```

### Shell Quote Handling in terminal tool
```bash
# WRONG: ls "C:\Users\..." && ls "C:\Users\..."  (mixed quotes cause syntax errors)
# CORRECT: ls "C:/c/Users/dingj/path" && echo "---"
```

---

## 5T Mapping

| 5T | How this reference supports it |
|---|---|
| **Traceable** | Each verification step produces observable evidence |
| **Trackable** | File existence + pytest collection = concrete tracking |
| **Tangible** | `ls` output + pytest results = direct, verifiable artifacts |
| **Transparent** | Verification commands are visible and reproducible |
| **Trustworthy** | `pytest --collect-only` proves tests exist; full run proves they pass |
