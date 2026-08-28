# OA-Team Settings Implementation Pitfall

## Session Context: 2026-07-28

### Incident

When implementing OA-Team collaborative workflow settings, the following test failed:

```
FAILED tests/test_aistation.py::test_feature_summary_has_all_modules - AssertionError
```

### Root Cause

The test `test_feature_summary_has_all_modules` checks that `feature_summary()` returns exactly 5 modules. When OA-Team settings were added, `feature_summary()` now returns 6 modules.

### Solution

Update test assertion:
```python
assert isinstance(fs, dict) and len(fs) == 6  # Updated for OA-Team features
```

And add "team" to the valid value check:
```python
for v in fs.values():
    assert ("free" in v) or ("edge-tts" in v) or ("pillow" in v) or ("local" in v) or ("sqlite" in v) or ("team" in v.lower())
```

### Prevention

When adding new modules to `feature_summary()`:
1. Always update test assertions
2. Consider checking for specific keys rather than total count
3. Document the change