---
name: static-web-prototype
description: "Build and browser-verify static HTML/CSS/JS web prototypes."
version: 1.0.0
author: esggo
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [web, design, prototype, html, css, landing-page, browser-verify]
---

# Static Web Prototype

## When to use
User asks for a new web page / landing page / web design prototype. Deliver a **self-contained, runnable** HTML/CSS/JS prototype — not just a description or mockup narrative.

## Core principle: verify the artifact, not the build chain
For pure static HTML/CSS/JS there is **no build step**. Verify the rendered page itself in the browser agent. Do NOT route verification through `pnpm run test` / `tsc` / `hermes verify` — those require a working workspace build chain and will fail for reasons (prisma EPERM, pyyaml METADATA, prepare scripts) that have nothing to do with your HTML. A green browser render IS the passing verification.

## Workflow
1. **Recon first.** Search the repo for existing brand assets / prior site code (e.g. an existing deployed site's colors, copy, structure). Reuse the brand voice if found.
2. **Design system via CSS custom properties** in `:root` — tokens like `--green / --gold / --cream / --ink`. Align to the existing brand family if one exists. Example ESG/OA family: 永續綠 `#3c6e47` + 暖金 `#c9a24b` + 米白 `#f3ede1` + 深藍 `#10243f`.
3. **Single-page semantic structure**: sticky nav → hero (with stat cards) → brand story → services/cards (3-col) → features (dark emphasis block for rhythm) → process steps → contact form → footer.
4. **Responsive**: CSS grid with breakpoints at `900px` (tablet: collapse to 1–2 cols, hide nav-links) and `540px` (mobile: 1 col).
5. **Interactions**: form `onsubmit` handler (`preventDefault` + confirmation message); scroll-in reveal via `IntersectionObserver` (initial `opacity:0; translateY(18px)`, reveal on intersect).
6. **Separate files**: `index.html` + `styles.css` + `app.js` (cleaner than inlined; easier to review).

## Verification (browser)
```
browser_navigate(url="file:///C:/Project/esggo/apps/<name>/index.html")
browser_vision(question="confirm no layout break / text overflow / missing styles; check hero, cards, dark section, form render correctly")
```
- If vision reports issues, fix CSS and re-navigate. The screenshot path returned is for the user to preview.
- Re-run navigate + vision once more at the end as a fresh verify (don't trust a single early load).

## Pitfalls
- No dependency tree for static HTML — just link `styles.css` and `app.js` with **relative paths**; never hand-build symlinks (that's for pnpm workspace TS apps, not static pages).
- Always `<meta name="viewport">` + `lang` attribute.
- Fonts: Google Fonts `<link>` (e.g. Noto Sans TC) with `system-ui` fallback.
- Keep copy real (not lorem ipsum) when a brand voice is known.
- Don't over-explain the design in chat — show the rendered result (screenshot) + the file paths.

## References
- `references/ftg-2.0.md` — concrete worked example: 墾趣旅遊 FTG 2.0 design system (colors, sections, copy, verification result).
## Templates
- `templates/landing.html` — starter scaffold (nav/hero/story/services/features/process/contact/footer + design tokens + responsive + IO animation). Copy and modify.
