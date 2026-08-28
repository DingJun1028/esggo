# FTG Tours Website SEO Change Log

## Session 1: Vite+React SPA scaffold (墾趣旅遨 website)
Build path: `C:\Users\dingj\Downloads\ftg-tours-website-src\`

## SEO status — index.html (already structured, NOT yet implemented per-page SEO)
- `index.html` — canonical, hreflang (zh-Hant/zh-CN/en/x-default), keywords, OG, Twitter cards: **DONE**. Full Traditional Chinese brand line in meta description. This follows the `frontend-seo-for-spa` skill pattern for the root document.
- `src/utils/seo.js` — NOT created (no per-page SEO hooks). `index.html` head covers root page SEO; individual route pages rely on client-side render with no unique `<title>`/meta per route.
- `src/main.jsx` — does NOT bootstrap JSON-LD Organization/LocalBusiness/WebSite scripts. No `data-ftg-seo` guard.
- `public/robots.txt` — exists (Allow: /) but points to old sitemap URL.
- `public/sitemap.xml` — exists with 7 routes at canonical `https://ftg.esggo.co`.

### Gap: per-page SEO needed for route pages
The 6 service pages (`/corporate-travel`, `/family-day`, etc.) render via React client-side and have no unique `<title>` or meta tags. To add per-page SEO, create `src/utils/seo.js` exporting `usePageSeo({title, description, path})` and call it in each page component. See main skill `frontend-seo-for-spa` §3 Per-page SEO hook for the pattern.

## Build verification (this session)
```text
npx vite build result: ✓ built in 15.73s, 35 modules transformed
Asset sizes: JS 284K, CSS 28K
nginx preview: all 7 routes HTTP 200
Route content in built JS: all 6 service titles appear (2 occurrences each: nav + page title)
```

## Canonical site
`https://ftg.esggo.co`
