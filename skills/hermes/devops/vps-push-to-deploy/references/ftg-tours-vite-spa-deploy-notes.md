# FTG Tours — Vite SPA Deploy Notes

## Deployment Target
- **Domain**: https://ftg.esggo.co/
- **VPS**: 161.118.248.180 (Oracle Cloud, ap-singapore-1)
- **Remote dir**: `/var/www/ftgtours`
- **CI/CD**: `.github/workflows/deploy-vps.yml` — builds with `npm run build`, rsyncs `dist/` to VPS, reloads nginx
- **CI/CD trigger**: push to `master` branch

## Build Configuration
- **Framework**: Vite 8.1.5 + React 19 + Tailwind CSS
- **Build command**: `npm run build`
- **Output dir**: `dist/`
- **Entry point**: `index.html` MUST contain `<script type="module" src="/src/main.jsx">`

## Critical Pitfall: Missing Vite Entry Script Tag
Vite builds "successfully" (exit code 0, no errors) but produces NO JavaScript bundle when `index.html`
lacks the `<script type="module" src="/src/main.jsx">` entry tag.

**Symptoms:**
- Build output: `✓ 2 modules transformed` (instead of 30+ for a real React app)
- `dist/assets/` directory does NOT exist after `npm run build`
- `dist/index.html` has `<div id="root">` but NO `<script src=...>` tag
- Live site returns HTTP 200 but renders empty root div (blank page)
- No console errors (JS never loads)

**Diagnosis:**
```bash
# After build, check for assets directory
ls dist/assets/
# If this fails → entry script tag is missing

# Check build output for module count
npm run build 2>&1 | grep "modules transformed"
# "2 modules" = broken, "30+ modules" = correct
```

**Fix:**
```html
<!-- In index.html, BEFORE closing </body> tag -->
<script type="module" src="/src/main.jsx"></script>
```

## CDN Cache Buster Pattern
When deploying static assets behind Cloudflare, append a version Query parameter to bust the edge cache:
```html
<!-- Instead of: -->
<link href="styles.css" />
<!-- Use: -->
<link href="styles.css?v=20260817" />
```

## CI/CD Verification
The workflow verifies deployment by checking for a specific string in the HTML response:
```bash
curl -sS "https://ftg.esggo.co/" | grep -q 'FTG TOURS' && echo 'deploy verified' || echo 'verify failed'
```

## CJK Character Gotchas (Brand Name Verification)
The brand name uses `Sheng` (U+8056). Common lookalike mistakes:
- Wrong char 1 (U+58BA) — wrong, CJK Extension A variant
- Wrong char 2 (U+58BE) — wrong, another lookalike variant with different meaning
- Correct: `Sheng` (U+8056) — "holy/sacred" in Chinese

Verification command:
```bash
python3 -c "
with open('dist/index.html', 'r', encoding='utf-8') as f:
    content = f.read()
if 'Sheng' in content:
    print('PASS: correct brand character')
else:
    for c in 'wrong_chars':
        if c in content:
            print(f'FAIL: wrong char U+{ord(c):04X}')
"
```

For the ESG team day label, `Wing-1` uses:
- Char A (U+6C38) + Char B (U+7E8C) — correct
- NOT Char C (U+7E86) — which looks identical but means something different

## React Router Links in Footer
All footer navigation must use `<Link>` components (from `react-router-dom`) instead of `<a>` tags.
Using `<a>` tags causes full page reloads instead of SPA navigation, breaking the React state.

## Reference Images
Reference design mockups are located at the user's OneDrive desktop folder (8 PNG images):
- Homepage designs
- Corporate travel, family day, ESG team day, wellbeing retreat, executive retreat pages
- ESG impact note

The vision_analyze tool can read these files when paths use proper CJK encoding.