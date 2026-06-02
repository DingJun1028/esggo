## 2024-05-24 - [XSS Fix]
**Vulnerability:** Found un-sanitized user input passed directly into `dangerouslySetInnerHTML` in `app/memory/page.tsx` and `app/wiki/WikiClientPage.tsx`. This could lead to Cross-Site Scripting (XSS) if attacker controls the input.
**Learning:** `dangerouslySetInnerHTML` is used in multiple places. In `app/wiki/WikiClientPage.tsx` it is used with string replacements adding classes.
**Prevention:** Use a library like `xss` to sanitize HTML. Ensure that if `dangerouslySetInnerHTML` is used for styling (like class names added via regex), you should configure the `xss` library whitelist to allow those attributes.

## 2024-05-18 - [Fix Authentication Bypass & Hardcoded Secrets in API Routes]
**Vulnerability:** Found hardcoded fallback JWT secrets (`pat_3eeb4039ad864d2c96569dbbc94cfb0a`) and trivial authorization bypasses (`token.startsWith('pat_')`) in both `app/api/omni-gateway/route.ts` and `app/api/omni-table/route.ts`.
**Learning:** Hardcoded testing fallback logic was mistakenly left in production API endpoints, allowing any bearer token starting with `pat_` to bypass authentication and execute sensitive ZKP and Database write operations.
**Prevention:** Ensure that environment variables (like `process.env.BLUE_CC_TOKEN`) are strictly evaluated for authorization without fallback hardcoded strings. Add server configuration error checking (throw error if the required JWT environment variables are missing during cryptographic operations).
