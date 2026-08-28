# Testing Patterns for OA-Team CrewAI Swarm

## pytest.mark.parametrize with dict.items() — THE PITFALL

### Common Bug
When you do:
```python
SQUADRON_BOUNDS = {1: (1, 6), 2: (7, 12), 3: (13, 18), 4: (19, 24), 5: (25, 30)}

@pytest.mark.parametrize("squadron,(lo,hi)", list(SQUADRON_BOUNDS.items()))
def test_agents_in_squadron_range(squadron, lo, hi): ...
```

**Error**: `the number of names (3): ['squadron', '(lo', 'hi)'] must be equal to the number of values (2): (1, (1, 6))`

### Root Cause
`dict.items()` yields **nested tuples** `(key, (v1, v2))`. pytest's parametrize tries to unpack `(1, (1, 6))` into 3 names: `squadron=1`, then `(1, 6)` gets split into `lo=1` and `hi=6`... but the name parsing sees `(lo,hi)` as two separate names PLUS the string gets split by comma. Actually the real issue is pytest tries to split `(1, 6)` as the value for the 3rd parameter.

### Fix 1: Flatten with list comprehension
```python
@pytest.mark.parametrize(
    "squadron,lo,hi",
    [(k, v[0], v[1]) for k, v in SQUADRON_BOUNDS.items()]
)
def test_agents_in_squadron_range(squadron, lo, hi): ...
```

### Fix 2: Unpack into 2 names
```python
@pytest.mark.parametrize("squadron,bounds", list(SQUADRON_BOUNDS.items()))
def test_agents_in_squadron_range(squadron, bounds):
    lo, hi = bounds
    ...
```

### Fix 3: Use flat tuples in the dict
```python
SQUADRON_BOUNDS = [(1, 1, 6), (2, 7, 12), (3, 13, 18), (4, 19, 24), (5, 25, 30)]

@pytest.mark.parametrize("squadron,lo,hi", SQUADRON_BOUNDS)
def test_agents_in_squadron_range(squadron, lo, hi): ...
```

## JSONC Parsing for Tests

```python
def _strip_jsonc(text: str) -> str:
    """Strip // comments from JSONC to produce valid JSON for parsing."""
    import json, re
    lines = []
    for line in text.split("\n"):
        stripped = line.lstrip()
        if stripped.startswith("//"):
            continue
        # Remove inline comments while respecting strings
        in_string = False
        quote_char = None
        result = []
        i = 0
        while i < len(line):
            c = line[i]
            if not in_string and c in ('"', "'"):
                in_string = True
                quote_char = c
            elif in_string and c == quote_char:
                in_string = False
                quote_char = None
            elif not in_string and c == "/" and i + 1 < len(line) and line[i + 1] == "/":
                break
            result.append(c)
            i += 1
        lines.append("".join(result))
    return "\n".join(lines)
```
