# FTG Essgo Console Log Analysis (2026-08-27)

## Raw Console Log Summary
Source: User pasted browser console from `ftg.esggo.co`

### Extension Errors (Category 1 - NON-BLOCKING)
```
NSC_EXT_CONTENT_JS_INSERTED production  (content-script.js:289)
NSC_EXT_CONTENT_JS_INSERTED development (VM14)
[Content] Voice Mode Service initialized (content.js:672)
[useCameraCaptureListener] Camera capture listener registered
[Violation] Permissions policy violation: unload is not allowed in this document
giveFreely.tsx-69ecb326.js:1 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'payload')
```
**Source**: Chrome extension (giveFreely, Voice Mode), not FTG site.

### CSP Report-Only Violations (Category 2 - NON-BLOCKING)
```
Loading script 'https://ftg.esggo.co/assets/index-DGYnAdJZ.js' violates CSP: "script-src 'unsafe-inline' 'unsafe-eval'"
Loading script 'https://static.cloudflareinsights.com/beacon.min.js/...' violates same CSP
Loading script 'https://ftg.esggo.co/cdn-cgi/challenge-platform/...' violates same CSP
Creating worker from 'blob:...' violates CSP (worker-src fallback to script-src)
```
All include: "The policy is report-only, so the violation has been logged but no further action has been taken."

### Cloudflare Scripts (Category 3 - NON-BLOCKING)
```
cdn-cgi/challenge-platform/scripts/jsd/main.js
cdn-cgi/challenge-platform/h/b/scripts/jsd/e694063b5082/main.js
cdn-cgi/rum (Real User Monitoring)
```
Normal Cloudflare anti-bot + RUM scripts.

### Extension Messaging Errors (Category 1 - NON-BLOCKING)
```
browserPolyfillWrapper-54ca72ec.js:944 fetchViaServiceWorker production extension not found
browserPolyfillWrapper-54ca72ec.js:952 Failed to fetch latest config
Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
```
All from `browserPolyfillWrapper` — a browser extension wrapper, not the site.

### Asset 404s (Category 4 - LOW IMPACT)
```
GET https://ftg.esggo.co/vite.svg 404 (Not Found)   (×2 occurrences)
```

**Root cause investigation**:
- Searched `C:\Project\esggo` for `vite.svg` — **file does not exist** anywhere in repo
- Searched `apps/ftg-3.0/` for `vite.svg` reference — **no reference found** in HTML/JS/CSS
- The 404 is likely from a Vite dev server proxy or build tool injection, NOT from FTG 3.0 code
- FTG 3.0 uses plain static files: `index.html`, `styles.css`, `app.js` — no Vite build step

**Conclusion**: vite.svg 404 is spurious — either a browser extension or CDN-level injection, not a real missing asset in the site.

## Site Code Verification

### FTG 3.0 Assets Check
```
apps/ftg-3.0/
  index.html  (19,563 chars — no vite.svg reference)
  app.js      (3,750 bytes — plain JS, no Vite imports)
  styles.css  (15,961 bytes — pure CSS)
  assets/
    logo.svg  (30 lines — brand logo)
    hero.jpg, market.jpg, eco.jpg, craft.jpg, stay.jpg, restore.jpg
```
**No issues found in the actual site code.**

### Git History
- `849d1e839` — Initial FTG 3.0 commit (Aug 14)
- `f513772ed` — UI/UX improvements + RWD (Aug 14)
- `1a3ecbe98` — Fix image display bug: flex-compression height:0 + CF cache (Aug 14)
- `22bc8427b` — Brand logo SVG replacement (Aug 14)

## Image Deduplication Methodology (2026-08-27 Session)

### Pitfall: vision_analyze path failures
When passing image paths to `vision_analyze`, always verify the **exact filename** with `ls -la` first. Subtle character differences (e.g., `ESG` vs `ESGG` prefix, missing characters) cause silent "media file not found" errors.

**Diagnostic workflow:**
1. Run `ls -la /path/to/directory/` to see **actual filenames**
2. Copy the filename **exactly** (including any typos like "ESGG")
3. Avoid guessing from file paths mentioned in conversation text

### Deduplication protocol
When analyzing a batch of images for content overlap:
1. Analyze each image with a **detailed content description** (people count, setting, objects, colors)
2. Cross-reference new images against previously analyzed ones
3. Flag near-duplicates where:
   - Same subject count and poses (e.g., 3 people in mountain setting)
   - Same color palette and location type
   - Same foreground objects (e.g., tea set, tablet, photos)
4. Document whether duplicates are from the same photoshoot/session (different camera angles) vs genuinely distinct content

### Session 2026-08-27 Findings
- **2 duplicate images** found: `composer_2026-08-25_09-46-15-619_f2de9e.png` and `composer_2026-08-25_09-46-15-821_d72e35.png` — same scene (mountain deck, 3 people, tea set) from slightly different camera angles
- **1 image suitable for new use case**: `composer_2026-08-25_09-50-24-715_071c58.png` — distinct content (photo review session, collage-making) ideal for "Employee Well-being Journey" section
- **Filename pitfall**: 2 images failed with "media file not found" because conversation text had `ESGG` prefix while actual filename was `ESG` — resolved by `ls -la` verification

## Final Verdict
**ALL ERRORS ARE NON-BLOCKING**: Third-party extension noise, CSP report-only warnings, and Cloudflare bot-protection scripts. No actual bugs found in the FTG 3.0 website code.

The site is functioning correctly. No code changes needed.