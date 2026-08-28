# Regex pitfall: optional close bracket in mixed 【】 / [] character class

Reproduction of a bug that silently zeroed two AI Station DNA-marker parsers
(`apps/aistation/src/parsers/dna_parser.py` and `apps/aistation/src/brand.py`)
on 2026-08-27. No exception is raised — `re.findall`/`finditer` just returns `[]`.

## Symptom
A parser meant to match mixed full-width `【場景】` and half-width `[Scene]` markers
returns `[]` for EVERY input, even a 1-segment sample. No `re.error`.

## Wrong pattern (returns [])
```python
import re
M = "場景|衝突|洞察|方法|反思|Scene|Conflict|Insight|Method|Reflection"
WRONG = re.compile(
    r"[\\[【]\s*(" + M + r")\s*[\\]②]?\s*[:：]?\s*(.*?)"
    r"(?=[\\[【](?:" + M + r")[\\]②]?|\Z)",   # <-- [\\]②]? in the LOOKAHEAD
    re.DOTALL,
)
print(WRONG.findall("[Scene] A quiet library at midnight."))   # []
print(WRONG.findall("【場景】夜裡的圖書館。"))                  # []
```

## Why it breaks
Inside a character class `[...]`, `\)` is a literal `)` (not an escaped group-close),
and `\\` is a literal backslash. So `[\\)】]?` means "optional literal `\` OR `)` OR `】`"
— it does NOT mean "optional `]` or `】`". The negative lookahead therefore demands a
literal `)`/`】`/`\` right after the NEXT marker, which is never present, so the match
fails and the whole scan yields nothing.

## Right pattern (works)
Use `[\]】]?` (or equivalently `[\\]】]?`) for "optional closing bracket, either width":
```python
RIGHT = re.compile(
    r"[\\[【]\s*(" + M + r")\s*[\]②]?\s*[:：]?\s*(.*?)"
    r"(?=[\\[【](?:" + M + r")[\]②]?|\Z)",
    re.DOTALL,
)
print(RIGHT.findall("[Scene] A quiet library at midnight."))   # [('Scene', 'A quiet library at midnight.')]
print(RIGHT.findall("【場景】夜裡的圖書館。【洞察】安靜是線索。"))
# [('場景', '夜裡的圖書館。'), ('洞察', '安靜是線索。')]
```

## Debug method (when a bracket parser returns [])
1. Print the compiled pattern: `print(DNA_PATTERN)` — read the char classes literally.
2. Run `re.findall` on a 1-segment sample for BOTH widths:
   `[Scene] x.` and `【場景】x。`
3. If both are `[]`, the bug is almost always a mis-escaped char class in the
   lookahead (stray `\\` or `)` where `]` was intended). Swap `[\\)】]?` → `[\]】]?`
   and re-test.
4. Normalize `type` to a stable English key (Scene/Conflict/Insight/Method/Reflection)
   so downstream visuals/render stay language-agnostic.
