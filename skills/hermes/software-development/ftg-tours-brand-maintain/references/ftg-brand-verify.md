# FTG 聖趣旅遊 Brand Character Verification

## Correct character
- **聖** = U+8056 (CJK UNIFIED IDEOGRAPH-8056) → 聖趣旅遊 FTG Tours

## Wrong characters (visual confusables — must never appear in source)
- **墺** = U+58BA (CJK UNIFIED IDEOGRAPH-58BA)
- **墳** = U+58BE (CJK UNIFIED IDEOGRAPH-58BE)
- **墧** = U+8FB7 (CJK UNIFIED IDEOGRAPH-8FB7)

## Session history (2026-08-26)
User provided reference image (composer_2026-08-17_07-55-27-750_bd2bda.png) showing:
- Logo: 聖趣旅遊 + FTG TOURS
- Hero headline: 走進自然 / 創造更有意義的旅程

The `patch` tool had silently substituted 聖 (U+8056) → 墺 (U+58BA) in terms-of-service.jsx during string matching.

Fix: Python byte-level replacement of U+58BA with U+8056 across all files.

## Deploy verification
```bash
JS_URL=$(curl -sS https://ftg.esggo.co/ | grep -oE '/assets/index-[a-z0-9]+\.js' | head -1)
curl -sS "https://ftg.esggo.co${JS_URL}" | python3 -c "
import sys
data = sys.stdin.read()
print('聖 (U+8056):', data.count(chr(0x8056)))
print('墺 (U+58BA):', data.count(chr(0x58BA)))
print('墳 (U+58BE):', data.count(chr(0x58BE)))
"
```