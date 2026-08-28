---
name: browser-console-error-analysis
description: Triage browser console errors into noise vs real bugs.
tags: [debugging, browser, console, csp, cloudflare, static-site, ftg]
---
# Browser Console Error Analysis

## When to use
- User pastes browser console logs from a deployed site (e.g. ftg.esggo.co)
- Errors appear after a deploy but site seems to render fine
- Need to triage whether errors are actionable bugs or noise

## Error Categorization Framework

### Category 1: Third-Party Extension Errors (NON-BLOCKING)
These come from browser extensions, not the site itself:
- `giveFreely.tsx-*`: Chrome extension errors (`Cannot read properties of undefined (reading 'payload')`)
- `browserPolyfillWrapper-*`: Extension messaging failures
- `content.js`, `content.d0f3cf01.js`: Content script errors from extensions
- `NSC_EXT_CONTENT_JS_INSERTED`: Extension injection markers

**Diagnostic**: Check if the script filename contains known extension patterns (giveFreely, browserPolyfill, content-script). These will also show `[Violation] Permissions policy violation` from extension contexts.

**Action**: Ignore — these are from the user's browser extensions, not the site.

### Category 2: CSP Report-Only Violations (NON-BLOCKING)
Cloudflare and analytics scripts violating a `report-only` CSP:
- `Loading the script '...' violates the following Content Security Policy directive: "script-src 'unsafe-inline' 'unsafe-eval'"`
- `Connecting to '...' violates the following Content Security Policy directive: "connect-src 'none'"`
- Key tell: **"The policy is report-only, so the violation has been logged but no further action has been taken."**

**Diagnostic**: Look for the `report-only` phrase in the CSP violation message. These are logging-only warnings.

**Action**: Ignore if report-only. If enforcing (not report-only), update CSP headers to include the required domains.

### Category 3: Cloudflare Challenge Platform (NON-BLOCKING)
Cloudflare anti-bot challenge scripts:
- `cdn-cgi/challenge-platform/scripts/jsd/main.js`
- `cdn-cgi/challenge-platform/h/b/scripts/jsd/...`
- `cdn-cgi/rum` (Real User Monitoring)

**Action**: These are normal Cloudflare bot-protection scripts. If they cause issues, check that Cloudflare JS Challenge is set to appropriate security level.

### Category 4: Asset 404s (LOW IMPACT)
Resource loading failures:
- `GET https://ftg.esggo.co/vite.svg 404 (Not Found)`

**Diagnostic**: Check if the asset actually exists in the source code. If the HTML references `vite.svg` but the file does not exist, either:
1. Add the missing asset to the deployment
2. Remove the unused reference from the HTML

**Action**: Verify the asset in the filesystem. If unused, remove the reference. If needed, add the asset.

### Category 5: Actual Site Bugs (ACTION REQUIRED)
These are real errors that need fixing:
- `Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'X')` from the site's own JS files
- `Error: Could not establish connection. Receiving end does not exist.` from content scripts (if from the site, not extension)
- Runtime errors in the site's `app.js` or rendered bundles

## Method: Source-Code Cross-Reference
When you see an error, always verify against the actual source code:
1. **Check the filename** does it match a file in the project repo?
2. **Search the source** — `grep -rn "filename" /path/to/project/`
3. **Check deployment** — `curl -I https://site/filename` to confirm what is actually deployed
4. **File system search** — `find /path -name "filename.ext" -not -path "*/node_modules/*"`

## Method: Deployment Verification
When the error is about a missing asset:
1. Check the source code references (grep for the filename in HTML/script files)
2. Check the local filesystem for the asset
3. Verify what is actually deployed via curl
4. Compare with git history to see if the asset was ever tracked

## Cross-reference with deployment debugging
This skill complements `spa-deploy-and-cdn-debug` — when console errors suggest a real site bug (Category 5), use that skill for the deploy/fix cycle. When errors are Category 1-4, they can be safely ignored while proceeding with deployment verification.