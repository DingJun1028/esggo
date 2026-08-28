# Pitfalls — Session 2026-08-24

## 1. test_chapter10.py 缺少 `frozen: True` 字段

**Error**: `ValueError: 5T gate failed: missing ['frozen']`

**Root cause**: `verify_5t()` checks `a.get("frozen")` for the Trustworthy gate. The test artifact in `test_weekly_report_5t_freeze_integration` built the dict without `"frozen": True`.

**Fix**: Add `"frozen": True` to the artifact dict.

## 2. `sys` not imported in test file

**Error**: `NameError: name 'sys' is not defined` when subprocess tests call `sys.executable`.

**Root cause**: The test file used `__import__("sys")` at line 9 (path injection) but didn't have a top-level `import sys`. The subprocess test code references `sys.executable` directly.

**Fix**: Add `import sys` at the top of the test file.

## 3. `skill_manage` patch clobbering adjacent sections

**Problem**: `skill_manage(action='patch', old_string="...", new_string="...")` matched a short `old_string` that appeared in TWO places (§23 and §26b both contained `soul.md` path references). The replace_all was implicitly false but the tool error only said "2 matches" — it did NOT apply. A subsequent attempt with slightly different context accidentally replaced §26b content instead of §24.

**Fix pattern**:
1. Always use ≥2 lines of surrounding context in `old_string` for uniqueness
2. If `skill_manage` reports "not found in active profile" (Windows path with non-ASCII), use the `patch` tool directly with the absolute skill file path
3. For large rewrites, prefer `patch` tool or `skill_manage(action='edit')` (full rewrite) over `patch` action

## 4. Chapter numbering in soul.md

Master canon structure (v0.6+):
- §1–§21: Core chapters (already in canon)
- §22+: User-commissioned appendices (inserted between last core chapter and terminal seal)
- Terminal seal (Soul Seal) starts with `═════════ 終章`

Insertion point verification:
```bash
grep -n "終章、靈魂封印" soul.md  # should be near the end
grep -n "第二十二章\|第二十三章" soul.md  # should be before terminal seal
```

## 6. Windows sed/escape corruption when editing test files

**Problem**: Using `sed` or Python string replacement on test files with
literal `\n` sequences inside Python string literals can corrupt the file —
the escape sequence `\\n` in the original source gets interpreted as a literal
newline character, breaking Python syntax.

**Example**: In `test_parse_dna_splits_long_segments`, the script string used
`"...文本。\\n"` (escaped). A naive `sed -i 's/\\n/\n/g'` would convert `\\n`
to a literal newline inside the string literal, creating a `SyntaxError:
unterminated string literal`.

**Fix pattern**:
1. Never use `sed` to manipulate escape sequences in Python source files
2. Use `read_file` to inspect the exact bytes, then use the `patch` tool with proper context
3. Alternatively, use Python to read/write the file with explicit escape handling
4. Always verify with `python -c "import ast; ast.parse(open('file.py').read())"` before running tests

## 7. Monkeypatching both submit() and enqueue()

**Problem**: When monkeypatching `pipeline.enqueue` in tests, if the code under
test ALSO calls `pipeline.submit` (which starts a background thread), the mock
doesn't intercept it and the test hangs or fails unexpectedly.

**Fix pattern**: Always monkeypatch BOTH functions when a test endpoint might
call either:
```python
monkeypatch.setattr(pipeline, "enqueue", _fake_enqueue)
monkeypatch.setattr(pipeline, "submit", _fake_enqueue)
```
Or better: audit the endpoint code to ensure it only calls ONE of them, and
remove redundant calls. The MPT webhook was fixed to only call `enqueue()`.

+## 8. Missing Pydantic BaseModel import when adding new endpoint models

**Problem**: Adding `class MPTWebhookIn(BaseModel)` to `app.py` without
importing `BaseModel` from `pydantic` causes `NameError` at module load time.

**Fix**: Always add the import alongside existing FastAPI imports:
```python
from pydantic import BaseModel
```
When adding new Pydantic models to any FastAPI app file that doesn't
already import BaseModel.

## 9. _split_long_narration must be defined AFTER _split_sentences

**Problem**: `_split_long_narration` calls `_split_sentences` internally.
If `_split_long_narration` is defined BEFORE `_split_sentences` in the
module, Python raises `NameError` at call time (not definition time —
this only surfaces when the function is actually invoked).

**Fix pattern**: Always place `_split_sentences` (the dependency) before
`_split_long_narration` in the source file. The linter won't catch this
since `_split_sentences` is eventually defined — it only fails at runtime.

## 5. aistation interpreter mismatch

- `python` → 3.11.15 (correct, used by venv)
- `python3` → 3.14.6 (wrong — don't use for aistation tests; CrewAI doesn't support 3.14)
- Always use `.venv/Scripts/python.exe -m pytest` from the aistation project root
