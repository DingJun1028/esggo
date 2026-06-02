## 2024-05-24 - [XSS Fix]
**Vulnerability:** Found un-sanitized user input passed directly into `dangerouslySetInnerHTML` in `app/memory/page.tsx` and `app/wiki/WikiClientPage.tsx`. This could lead to Cross-Site Scripting (XSS) if attacker controls the input.
**Learning:** `dangerouslySetInnerHTML` is used in multiple places. In `app/wiki/WikiClientPage.tsx` it is used with string replacements adding classes.
**Prevention:** Use a library like `xss` to sanitize HTML. Ensure that if `dangerouslySetInnerHTML` is used for styling (like class names added via regex), you should configure the `xss` library whitelist to allow those attributes.

## 2024-05-18 - [Fix Authentication Bypass & Hardcoded Secrets in API Routes]
**Vulnerability:** Found hardcoded fallback JWT secrets (`pat_3eeb4039ad864d2c96569dbbc94cfb0a`) and trivial authorization bypasses (`token.startsWith('pat_')`) in both `app/api/omni-gateway/route.ts` and `app/api/omni-table/route.ts`.
**Learning:** Hardcoded testing fallback logic was mistakenly left in production API endpoints, allowing any bearer token starting with `pat_` to bypass authentication and execute sensitive ZKP and Database write operations.
**Prevention:** Ensure that environment variables (like `process.env.BLUE_CC_TOKEN`) are strictly evaluated for authorization without fallback hardcoded strings. Add server configuration error checking (throw error if the required JWT environment variables are missing during cryptographic operations).
## 2024-05-18 - [Fix Database Availability and Test Dependencies]
**Vulnerability:** Several API routes and testing suites were lacking fallback or error handling for offline or incorrectly configured databases (like Supabase). Also, the test environment relied on undocumented or incorrectly mocked dependencies (like `better-sqlite3` and `MockSupabaseAdmin`).
**Learning:** Hard-failing applications during component isolation and unit testing due to unmocked external data sources reduces system resiliency. `SupabaseClient` requires explicit configuration or must be mocked safely.
**Prevention:** Make use of delayed configuration and check configuration bounds proactively, falling back gracefully where possible (or throwing clear initialization errors) to increase resilience against offline dependencies.
## 2024-05-18 - [Fix GitHub Actions using npm instead of pnpm]
**Vulnerability:** GitHub action workflows (`.github/workflows/ci.yml` and `.github/workflows/governance.yml`) were executing `npm` commands, violating the strict requirement to use `pnpm` as the sole package manager for the repository. This caused CI failures and inconsistency between environments.
**Learning:** Mixing package managers (like relying on `npm ci` or `npm install` when the lockfile is `pnpm-lock.yaml`) leads to unreliable CI, build failures, missing dependencies, or downgraded packages.
**Prevention:** CI workflows must be explicitly configured with `pnpm/action-setup` to ensure the correct package manager and version are used across all pipeline stages. All script execution must use `pnpm`.
