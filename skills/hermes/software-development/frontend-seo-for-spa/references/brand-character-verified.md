# FTG 聖趣旅遊 Brand Character Verification

## Correct Character
- **Char**: `聖`
- **Unicode**: U+8056
- **Name**: CJK UNIFIED IDEOGRAPH-8056
- **Meaning**: "holy", "sage" — used as the first character in the brand name

## Wrong Characters (visual confusables — MUST NOT be used)
| Char | Unicode | Why wrong |
|---|---|---|
| `墺` | U+58BA | Looks similar but is a different CJK character meaning "pond" |
| `墳` | U+58BE | Visual confusable — the `patch` tool can silently substitute this during string matching |
| `墻` | U+58BB | Another visual confusable |
| `墼` | U+58BC | Another visual confusable |

## Verification Commands

### Check for wrong characters (U+58BA, U+58BE, U+58BB, U+58BC) across all source files:
```bash
python3 -c "
import os
wrong_chars = [chr(0x58BA), chr(0x58BE), chr(0x58BB), chr(0x58BC)]
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.jsx', '.js', '.html')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fh:
                for i, line in enumerate(fh, 1):
                    for ch in wrong_chars:
                        if ch in line:
                            print(f'{p}:{i}: found wrong char U+{ord(ch):04X}')
with open('index.html', 'r', encoding='utf-8') as fh:
    for i, line in enumerate(fh, 1):
        for ch in wrong_chars:
            if ch in line:
                print(f'index.html:{i}: found wrong char U+{ord(ch):04X}')
print('Done checking')
"
```

### Fix wrong characters to correct one (U+8056):
```bash
python3 -c "
import os
correct_char = chr(0x8056)
wrong_chars = [chr(0x58BA), chr(0x58BE), chr(0x58BB), chr(0x58BC)]

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.jsx', '.js')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fh:
                c = fh.read()
            for wc in wrong_chars:
                c = c.replace(wc, correct_char)
            with open(p, 'w', encoding='utf-8') as fh:
                f.write(c)

# Also fix index.html
with open('index.html', 'r', encoding='utf-8') as fh:
    c = fh.read()
for wc in wrong_chars:
    c = c.replace(wc, correct_char)
with open('index.html', 'w', encoding='utf-8') as fh:
    f.write(c)
print('Fixed all occurrences')
"
```

## Session History

### 2026-08-26: Brand character correction session
- **Root cause**: The project initially used `墺` (U+58BA) as the brand character, believing it to be correct. However, reference design images showed the correct character is `聖` (U+8056). The `patch` tool (fuzzy matching) can silently substitute visually similar CJK characters during string matching operations.
- **Detection method**: Python Unicode codepoint analysis of the reference image and live site revealed that the correct brand character is `聖` (U+8056), not `墺` (U+58BA) or `墳` (U+58BE).
- **Fix**: Python byte-level replacement of all wrong character occurrences with U+8056 across `src/` and `index.html`, verified by codepoint inspection.
- **Files affected**: `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/pages/corporate-travel.jsx`, `src/pages/family-day.jsx`, `src/pages/privacy-policy.jsx`, `src/pages/terms-of-service.jsx`, `index.html`

## Deploy & Verification

```bash
# 1. Rebuild
npm run build

# 2. Verify correct character in built output
python3 -c "
with open('dist/index.html', 'r', encoding='utf-8') as f:
    c = f.read()
print('Wrong char U+58BA count:', c.count(chr(0x58BA)))
print('Wrong char U+58BE count:', c.count(chr(0x58BE)))
print('Correct char U+8056 count:', c.count(chr(0x8056)))
"

# 3. Verify built JS bundle
python3 -c "
import os
for f in os.listdir('dist/assets'):
    if f.endswith('.js'):
        with open(f'dist/assets/{f}', 'r', encoding='utf-8') as fh:
            c = fh.read()
        print(f'{f}: correct={c.count(chr(0x8056))}, wrong_ba={c.count(chr(0x58ba))}, wrong_be={c.count(chr(0x58be))}')
"

# 4. Commit & push (triggers CI/CD)
git add -A
git commit -m "fix: correct brand character 聖 (U+8056)"
git push origin master

# 5. Verify live site after CI/CD deploy
curl -sSL https://ftg.esggo.co/ | grep -oE '<title>[^<]+</title>'
```

## Critical: Vite Entry Script Tag

When using a custom `index.html` with Vite, ensure the `<script type="module" src="/src/main.jsx">` tag is present. Without it, Vite builds successfully but produces **no JS bundle** (only 2 modules transformed instead of 39+) and no `dist/assets/` directory. The site will render with an empty `<div id="root">` and no JavaScript.

Always verify after build:
```bash
ls dist/assets/  # Must contain JS and CSS files
```
