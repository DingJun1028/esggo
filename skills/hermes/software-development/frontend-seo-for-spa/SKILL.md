---
name: frontend-seo-for-spa
description: "Audit and harden SEO for Vite/React SPAs in Traditional/Simplified Chinese with English: JSON-LD Organization/LocalBusiness/WebSite, hreflang zh-Hant/zh-CN/en/x-default, canonicalization, per-page title/description/OG, robots/sitemap, and build/lint/test verification. Also captures brand-copy consistency rules for Chinese SPA head metadata and static asset references."
version: 1.1.0
metadata:
  hermes:
    tags: [react, vite, seo, json-ld, hreflang, chinese, spa]
    category: software-development
---

# Frontend SEO for SPAs (zh-Hant/zh-CN/en)

## Use when

- User asks to “strengthen SEO” on a Vite/React SPA
- Task involves JSON-LD Organization/LocalBusiness/WebSite
- Task involves hreflang `zh-Hant` / `zh-CN` / `en` / `x-default`
- Need to improve `<title>`, meta description, OG tags, canonical URL
- Need to confirm `/robots.txt` and `/sitemap.xml` for a Chinese-market SPA
- User wants exact change list + build/lint/test verification
- Deploy script risk: SPA deployed under a shared nginx host needs a deploy script that does not overwrite the site config
- Working with static multi-page sites under `pages/**/*.html` with front matter + layout template, including `/en/` subdirectories

## Static multi-page SEO additions

For static HTML sites built from front matter:

- Inject per-page `<title>`, `description`, `keywords`, `canonical`, `og:*`, `twitter:*` from layout, with front matter overriding defaults when present.
- Include `<meta charset="UTF-8">` and `lang` attribute on `<html>` matching the page language.
- Add skip link and `<main id="main-content">` landmark around `{{content}}`.
- Add `sitemap.xml` and `robots.txt` under `assets/`, then copy to site root during build/deploy.
- Add Google Analytics placeholder only if the user wants it; otherwise leave it out to avoid unnecessary third-party requests.

## i18n additions

- Add `/en/` pages with `lang: en` front matter.
- Add a language toggle button with `localStorage` persistence and path prefix switching.
- Build script must preserve subdirectory output and rewrite relative asset paths by depth so nested pages do not break CSS/image links.

## Image optimization additions

- Generate WebP copies via Pillow and serve them through `<picture><source type=\"image/webp\">`.
- Use `<img loading=\"lazy\">` for content images instead of `background-image` when lazy loading is desired.
- Full-page migration check: after replacing old `background-image:url(...)` with `<picture>` markup, grep the built output for any remaining `background-image:url` to confirm every page was updated.
  - Root pages: `grep -R "background-image:url" dist/*.html || echo "NO_OLD_BG"`
  - With locales: `grep -R "background-image:url" dist/*.html dist/en/*.html || echo "NO_OLD_BG"`
- New image markup pattern:
  `<picture><source srcset=\"../assets/images/<name>.webp\" type=\"image/webp\"><img class=\"service-card__media\" src=\"../assets/images/<name>.png\" loading=\"lazy\" alt=\"...\"></picture>`
- When adding `/en/` pages under `pages/en/`, the build script must preserve subdirectory structure and rewrite asset prefixes by depth so nested pages resolve `../assets/...` correctly.

## Fixed brand contract

Use these anchors so marketing copy does not drift across meta, JSON-LD, sitemap, and static assets.

- **Brand character**: `聖` (U+8056) — verify with `python3 -c "for ch in content: if ord(ch)==0x8056: print('correct char found')"` after edits. The common visual-confusable `墺` (U+58BA) and `墳` (U+58BE) are WRONG characters and must never be used. See `references/brand-character-verified.md`.
- **Preferred title format**: `聖趣旅遊 FTG - 走進自然創造更有意義的旅程`
- **Preferred meta description**: `企業員工旅遊、家庭日、ESG 戶外團隊日、員工身心平衡旅程。走進自然，創造更有意義的旅程。`
- **Service names in Chinese**: `企業員工旅遊` (Corporate Travel), `企業家庭日` (Family Day), `ESG 戶外團隊日` (ESG Team Day), `員工身心平衡旅程` (Wellbeing Retreat), `高階主管共識營` (Executive Retreat), `ESG 影響報告` (ESG Impact Note)
- **Brand aliases**: `聖趣旅遊` ; `FTG TOURS`
- **Favicon reference**: always use `/favicon.svg`; do not introduce `/vite.svg` or other aliases.
- **Do NOT use**: `台灣最懂戶外健康與永續行動的旅行解方品牌` — this old English-in-Chinese description was removed from all meta tags (og:description, twitter:description, meta description) per user request. Replace with the description above.
- **Vite entry script**: Ensure `index.html` has `<script type="module" src="/src/main.jsx">` before `</body>`. Without it, Vite builds 0 JS modules, produces no `dist/assets/`, and the site renders with an empty `#root` div. Check: `ls dist/assets/` after build — if empty, the entry tag is missing.

### Brand character verification (CRITICAL for CJK)

Always verify the Unicode codepoint after making edits — `墺` (U+58BA) and `墳` (U+58BE) render nearly identically but are **different characters**. The `patch` tool can silently substitute one for the other during string matching. Use Python for precise character control:

```bash
# Verify brand character after edits
python3 -c "
with open('index.html','r',encoding='utf-8') as f: c=f.read()
for i,ch in enumerate(c):
    if ord(ch) in [0x58BA, 0x58BE]:
        print(f'Pos {i}: {ch} -> U+{ord(ch):04X}')
"

# Fix wrong character if patch introduced it
python3 -c "
import codecs
with open('src/pages/Home.jsx','r','encoding=utf-8') as f: c=f.read()
fixed = c.replace(chr(0x58BE), chr(0x58BA))
with open('src/pages/Home.jsx','w',encoding='utf-8') as f: f.write(fixed)
"
```

### Full Chinese localization requirement

When the user asks for all-Chinese UI (no English text in visible elements):
1. Replace all English service names in page H1 subtitles: `Solution 01`–`Solution 06` labels stay as-is, but the H1 and H2 titles must be Chinese
2. Replace English descriptions: `ESG Team Day` → `ESG 戶外團隊日`, `Employee Wellbeing Retreat` → `員工身心平衡旅程`, `ESG Impact Note` → `ESG 影響報告`
3. Replace English in `footer.jsx` comments and link text
4. **Do not** rename React component/function names (e.g., `CorporateTravel`, `EsgTeamDay`) — those are code identifiers, not UI text
5. Verify via `grep -rn "ESG Team Day\|Employee Wellbeing\|Impact Note" src/ | grep -v node_modules` after edits

## SEO checklist

1. `index.html`
   - `<title>` consistent with brand line
   - `<meta name="description">` with brand line + core services
   - `<meta name="keywords">` with service keywords in zh + en
   - `<link rel="canonical">` to live root
   - `<link rel="alternate" hreflang="...">` for `zh-Hant`, `zh-CN`, `en`, `x-default`
   - `<meta name="robots" content="index, follow">`
   - OG: `og:title`, `og:description`, `og:url`, `og:type`
   - JSON-LD Organization: `@type=Organization`, `name`, `url`, `logo`, `description`, `contactPoint`, `address`
   - **Only one `</head>`**; keep Twitter/JSON-LD tags inside the head.
   - Exact brand copy rule: if the title says `墾趣旅遊`, every Twitter/OG title must say `墾趣旅遊` too.

2. JSON-LD bootstrap
   - Create `src/utils/seo.js` exporting:
     - `organizationJsonLd`: Organization with contactPoint + PostalAddress + logo + sameAs
     - `localBusinessJsonLd(service)`: LocalBusiness with serviceType
     - `webSiteJsonLd`: WebSite with `inLanguage: ['zh-Hant','zh-CN','en']`
   - Inject scripts once in `src/main.jsx` before render, guarded by `data-ftg-seo`

3. Per-page SEO hook
   - Add `usePageSeo({ title, description, path, keywords })` to each route page
   - Ensure each route’s `description` matches the brand line
   - Canonical must equal route path; avoid trailing-slash drift

4. `public/robots.txt`
   - `User-agent: *`
   - `Allow: /`
   - `Disallow: /private/`
   - `Sitemap:` pointing at live domain

5. `public/sitemap.xml`
   - XML urlset with homepage first at priority 1.0
   - One `<url>` per public route with `changefreq` and `priority`
   - All `<loc>` using canonical live domain, no `http://localhost`

6. Deploy-script hygiene
   - Deploy script must **only** upload build artifacts to the target directory.
   - Do **not** write `/etc/nginx/sites-available/*` from the deploy script when the site is hosted under a shared nginx config.
   - Ownership normalize: after upload, `chown -R $VPS_USER:$VPS_USER $TARGET_DIR` is fine.
   - Reload nginx from CI if needed; config changes belong to a separate, reviewed nginx-config step.

## Build/lint/test sequence

Use this exact sequence and report the real command output.

1. `pnpm install`
2. `pnpm build`
3. `pnpm lint`
4. If no test runner exists, report `No test files found`; do not invent tests.

## Pitfalls

- `vite.svg` drift: some Vite templates reference `/vite.svg`; replace with `/favicon.svg` everywhere.
- Unused lint noise: drop unused `useLocation` imports.
- hreflang counts as changed metadata: re-lint after SEO edits.
- JSON-LD duplication: inject scripts only once per page load, guarded by `data-ftg-seo`.
- Description drift: copy the same brand line into meta, JSON-LD, sitemap homepage entry, and every per-page description.
- **HTML head structure**: do not insert a second `</head>` or close the head early when adding JSON-LD/OG/Twitter blocks.
- **Subagent workspace discipline**: when asked to update the FTG SEO in `C:\\Project\\ftg-tours-website`, do not write to `C:\\Users\\dingj\\ftg-tours-website` or another user-scoped path. Verify the working directory before edit/commit.
- **Windows/MSYS deploy quirks**: prefer `scp` over `rsync` when `rsync` is missing, and copy through `/tmp/ftg-deploy/` on the VPS before nginx reload.
- **Media-heavy subpage heroes**: store travel photos under `public/subpage-images/` and reference them via `/subpage-images/...` rather than inlining base64; always pair hero media with a single `bg-ftg-forest/75` overlay and keep text in `relative z-10`; use fade-only carousel animation, interval `6000` ms, transition `800` ms.
- **Logo filetype swap checklist**: when replacing `.jpg` with `.png`, update both `Navbar.jsx` and `Footer.jsx` to the same extension, rebuild, grep built JS for old-base64 or old-filename remnants, redeploy via `/tmp/ftg-deploy/`, and confirm via VPS path.
- **Windows path quoting in MSYS Git Bash**: `cp` heredocs/trailing quotes with Windows paths fail under bash quoting; prefer `/c/Users/...` or `C:/Users/...` paths instead of `"C:\Users\..."`-style quoting.
- **VPS deploy when `rsync` is unavailable**: on Windows hosts `rsync` may be missing. Use `scp -r` to `/tmp/ftg-deploy/`, then `sudo cp -a /tmp/ftg-deploy/. /var/www/<site>/` followed by `sudo systemctl reload nginx`.
- **Logo swap discipline**: when replacing the site logo filetype, update both `Navbar.jsx` and `Footer.jsx` to the same extension, rebuild, verify the asset exists under `dist/logos/`, then redeploy; do not leave one component pointing at the old `.jpg` while the other points at `.png`.
- **Media-heavy subpage heroes**:
  - Store travel photos under `public/subpage-images/` and reference them via `/subpage-images/...` rather than inlining base64.
  - Always pair hero media with a solid overlay such as `bg-ftg-forest/75` and keep text in `relative z-10` so copy remains readable.
  - Favor single overlay strength over stacking multiple gradients; stacking often muddies text on camera-heavy images.
  - Carousel animation should be fade-only, no scale/slide, with interval `6000` ms and transition duration `800` ms to avoid competing with content.
- **CJK typography discipline**: Use Traditional Chinese (zh-Hant) consistently across all UI text. Common simplified-only characters that sneak in: `台` (U+53F0) → `臺` (U+81FA), `閉` (U+7E8F) → `閉` (U+9589), `环` (U+73AF) → `環` (U+74B0), `谈` (U+8C08) → `談` (U+8AB1). Verify with a Python script scanning `src/` for these codepoints.
- **English text leakage**: When localizing to Chinese, check for stray English words that were left in JSX strings (e.g., "fog" in "缺少 fog 延伸素材", "wellness" in descriptions). The `patch` tool can partially match strings and leave fragments. Always grep `src/` for English words after localization edits: `grep -rn "fog\|wellness\|Solution" src/ --include="*.jsx"`.

## ESG Impact Note Image Validation

When validating or replacing images for ESG Impact Note sub-pages:

1. **Content audit checklist** (see `references/esg-impact-note-image-checklist.md`):
   - ✅ Image shows **actual content** (text/quotes/data), not a **blank template**
   - ✅ Image shows **real employee photos** (not placeholders) for feedback pages
   - ✅ Image shows **real action items** with owners/deadlines for next-steps pages
   - ✅ Image shows **real dates/participants** for activity info pages
   - ✅ Image uses **FTG brand colors** (#3c6e47, #c9a24b, #f3ede1, #10243f)
   - ✅ Image is **not duplicated** across sections (check filenames + visual similarity)
   - ✅ Image supports **4 RWD sizes**: 1024×768, 768×1024, 480×800, 360×640

2. **Duplicate detection workflow**:
   - Run vision_analyze on all images in the download folder
   - Cross-reference with existing deployed images on ftg.esggo.co
   - Flag images with >80% visual overlap (same people, same setting, minor crop differences)
   - Remove duplicates before processing

3. **Placeholder generation pattern**:
   - When source image lacks required content, generate HTML template with:
     - Real employee names + quotes (from placeholder spec JSON)
     - Actual action items with priority levels (P0/P1/P2)
     - Real dates, participant counts, and location data
   - Use Puppeteer to capture PNGs at all 4 RWD sizes
   - Verify SHA-256 hash consistency

4. **Common pitfalls**:
   - **`vite.svg` drift**: Static HTML pages may still reference `/vite.svg` if built from a Vite template — ensure only `/favicon.svg` is used
   - **CJK brand character**: Verify `墳` (U+58BA) is used, not `墮` (U+58BE) in any image alt text or filename
   - **RWD compression**: Ensure scale factor doesn't clip text at 360px width; use `overflow-wrap: break-word` in templates
   - **Filename duplicates**: Watch for similar filenames like `成果內容-員工回饋與影像故事.png` vs `結果內容-員工回饋與影像故事.png` — the first character (成 vs 結) determines different content but visual similarity can mask issues

## Verification evidence

After work, report exact paths, commands, and output fragments:

```text
path: C:\Project\ftg-tours-website
build: pnpm run build
lint: pnpm run lint
json validation: node -e ...  // exported schema object stringified ok
```

Then list modified files with one-line change summaries.
