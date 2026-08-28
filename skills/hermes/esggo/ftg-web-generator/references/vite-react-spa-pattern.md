# FTG Vite+React SPA Build Pattern (from session: 墾趣旅遊 website)

## Context
Session built a multi-page B2B corporate-travel SPA for FTG Tours at `C:\Users\dingj\Downloads\ftg-tours-website-src/`. Uses Vite 8 + React 19 + Tailwind 3 + React Router 7 (HashRouter). Replaces the earlier single-file HTML generator (ftg-gen.js) with a component-based architecture for the `ftg.esggo.co` marketing site.

## Project bootstrap
```bash
cd /c/Users/dingj/Downloads/ftg-tours-website-src
npm install          # 105 packages
npm run dev          # → http://localhost:5173
npm run build        # → dist/ (284K JS, 28K CSS)
npx vite preview --port 9001 --host 0.0.0.0  # local preview
```

## Routing (HashRouter — no server config needed)
```
/                          → Home.jsx
/corporate-travel          → corporate-travel.jsx
/family-day                → family-day.jsx
/esg-team-day              → esg-team-day.jsx
/wellbeing-retreat         → wellbeing-retreat.jsx
/executive-retreat         → executive-retreat.jsx
/esg-impact-note           → esg-impact-note.jsx
```

## Common pitfall: missing ImageCarousel import
All 6 service pages reference `<ImageCarousel>` in JSX but **do not import it**. This causes a Vite/Rollup build-time `X is not defined` error. Fix:
```jsx
// Add to EVERY service page that uses the carousel:
import ImageCarousel from '../components/ImageCarousel';
```
Verify all pages have the import:
```bash
for f in src/pages/*.jsx; do echo -n "$f: "; grep -c "ImageCarousel" "$f"; done
# Expect 2 (import + usage) for all service pages, 0 for Home.jsx
```

## Common pitfall: external image URLs in Hero
The Home.jsx hero section initially used an Unsplash URL:
```jsx
src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80"
```
This fails when network is unavailable or the URL changes. Replace with local assets:
```jsx
src="/subpage-images/corporate-travel.png"
loading="eager"
decoding="async"
```

## Style-system dependencies
The Tailwind config defines `ftg-*` design tokens. The CSS file (`src/index.css`) defines reusable component classes used across pages:
- `.btn-primary` `.btn-secondary` — CTA buttons
- `.section-title` `.section-subtitle` `.section-label` — typography
- `.card-elevated` `.card-muted` — card containers

Pages reference these classes but they are defined in `src/index.css` `@layer components`. If a page fails to render styles, check that `index.css` is imported in `src/main.jsx`.

## Assets structure
```
public/
  logos/ftg-logo.png          # Logo used in Navbar + Footer
  subpage-images/             # Hero carousel images for 6 service pages
    corporate-travel.png
    family-day.png
    esg-team-1.png  esg-team-2.png
    wellbeing-1.png  wellbeing-2.png
    executive-retreat.png
    esg-impact-1.png  esg-impact-2.png
```

## Verification checklist
1. `npx vite build` → 0 errors, dist/ populated
2. `npx vite preview` → all routes return 200
3. Each service page contains its title in the built JS:
   ```bash
   for s in "企業員工旅遊" "企業家庭日" "ESG Outdoor Team Day" "Employee Wellbeing Retreat" "高階主管共識" "ESG Impact Note"; do
     echo -n "$s: "; grep -c "$s" dist/assets/*.js
   done
   # Expect 2 occurrences each (nav link + page title)
   ```
4. Local images load (no 404 on `/subpage-images/*` or `/logos/*`)

## SEO head (already structured in index.html)
The index.html includes hreflang (`zh-Hant`, `zh-CN`, `en`, `x-default`), canonical, OG meta tags, and Twitter cards. This follows the `frontend-seo-for-spa` skill pattern. Per-page SEO can be added via `usePageSeo` hook if needed.
