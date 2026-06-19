## 2025-01-29 - Privilege Escalation via Mass Assignment

**Vulnerability:** The `register` endpoint in `AuthController.ts` allowed users to specify their own `role` in the request body. Since the backend directly used this input (`role: role || 'Observer'`), an attacker could register as an 'Admin' by sending `{"role": "Admin"}`.
**Learning:** Mass assignment vulnerabilities occur when user input is blindly bound to internal object models without filtering. In authentication flows, sensitive fields like `role`, `permissions`, or `isAdmin` must NEVER be accepted from public registration inputs.
**Prevention:**

1. Always use explicit field extraction (`const { safeField1, safeField2 } = req.body`) instead of spreading (`...req.body`).
2. Hardcode default values for sensitive fields in public endpoints (`role: 'Observer'`).
3. Use a DTO (Data Transfer Object) or schema validation library (like Zod) to strip unknown or forbidden fields before processing.

## 2026-01-30 - Hardcoded Secrets & Permissive CORS

**Vulnerability:** `server/server.js` contained a hardcoded default for `API_SECRET_TOKEN` and used `cors()` without options, allowing any origin to access the API.
**Learning:** Centralized configuration is crucial. When secrets or security configs are defined ad-hoc in entry files, they often bypass validation logic and become "forgotten" defaults that get deployed to production.
**Prevention:**

1. Enforce a "Single Source of Truth" for configuration (e.g., `config/index.js`).
2. Add startup validation logic that throws errors if critical secrets are default/missing in production.
3. Use linter rules to flag `process.env` usage outside of configuration files.

## 2026-02-01 - Sensitive Information Leakage via Error Messages

**Vulnerability:** The global error handler and multiple API routes in `server/server.js` were configured to return `error.message` to the client in all environments. This exposed sensitive details such as SQL syntax errors, file paths, and logic failures to potential attackers.
**Learning:** Decentralized error handling (individual try-catch blocks sending custom responses) often leads to inconsistent security postures. When developers optimize for debugging speed by returning error details, they often forget to strip these details in production.
**Prevention:**

1. Implement a single, robust global error handler that checks `NODE_ENV`.
2. Refactor all route handlers to use `next(error)` instead of sending their own error responses.
3. Use automated tests to verify that production responses do not contain known sensitive strings or stack traces.

## 2026-02-10 - Unprotected Sensitive Endpoints

**Vulnerability:** The `evidenceRoutes.js` exposed `GET /pending` and `PUT /status` endpoints without authentication. This allowed unauthenticated users to view sensitive evidence data and approve/reject evidence, potentially triggering blockchain and carbon accounting actions.
**Learning:** Defining routes without a default secure-by-design approach (e.g., a top-level `router.use(authenticateToken)`) often leads to new or "internal" endpoints exposed. When routes are added incrementally, developers might forget to add the auth middleware to each new handler.
**Prevention:**

1. Apply authentication middleware at the router level (`router.use(auth)`) for modules that handle sensitive data, rather than per-route.
2. Separate public and private routes into distinct routers or files to make the security boundary explicit.
3. Implement integration tests that specifically check for 401/403 status on all endpoints assumed to be private.

## 2026-01-21 - Timing Attack in Secret Comparison

**Vulnerability:** The `authenticateRequest` middleware in `server/server.js` used a standard string comparison (`token !== API_SECRET_TOKEN`) to validate the API secret. This exposes the application to timing attacks, where an attacker can deduce the secret by measuring the response time of the comparison operation.
**Learning:** Standard string comparison operators return false as soon as a mismatch is found, creating a time leakage channel. Security-critical comparisons (like API keys, password hashes, or HMACs) must always take constant time, regardless of the input.
**Prevention:**

1. Use `crypto.timingSafeEqual` for all secret comparisons.
2. Ensure both inputs are of the same length before comparison (or hash them first using SHA-256 to guarantee equal length).
3. Encapsulate this logic in a dedicated utility or middleware to prevent regression.

## 2026-02-28 - Bypass of Configuration Validation

**Vulnerability:** The `server/src/config/index.js` file contained critical security validation logic (`validateConfig`) that was commented out. This allowed the server to start in production mode with unsafe default secrets (like `default-jwt-secret-key`), bypassing the intended security controls.
**Learning:** Security controls that are "commented out for development convenience" often make their way into production. Code reviews can miss commented-out function calls if they look like "to-do" or "legacy" code.
**Prevention:**

1. Never comment out security logic. Use environment variables (e.g., `SKIP_VALIDATION=true`) if a bypass is strictly necessary for dev, but default to secure.
2. Use automated tests that specifically attempt to start the application with bad configurations and assert failure.
3. Ensure the CI/CD pipeline runs these configuration integrity tests.

## 2026-03-01 - Unrestricted File Upload Configuration

**Vulnerability:** The `multer` configuration in `server/server.js` was initialized with default settings, lacking file size limits and file type filtering. This allowed unrestricted uploads, exposing the server to Denial of Service (DoS) via disk exhaustion and potential storage of malicious files.
**Learning:** Default configurations for middleware libraries (like `multer`, `body-parser`) are often permissive for ease of use but insecure for production. Developers often copy-paste "quick start" snippets without reviewing the security implications of defaults.
**Prevention:**

1. Explicitly configure limits (`fileSize`, `files`) for all upload handlers.
2. Implement strict allow-lists (allow-listing) for file types/extensions using `fileFilter`.
3. Centralize upload configuration in a config file and reference it, rather than hardcoding setup in server entry points.

## 2026-02-08 - Unprotected Routers Pattern
**Vulnerability:** Entire API routers (`marketIntelligenceRoutes`, `unifiedAdvancementRoutes`) were mounted without authentication middleware.
**Learning:** Router-level mounting in `server.ts` does not automatically inherit global auth if global auth is commented out.
**Prevention:** Always verify `app.use` calls for sensitive routers include `authenticateRequest` or ensure global middleware is active.

## 2026-02-08 - Unprotected Routers Pattern
**Vulnerability:** Entire API routers (`marketIntelligenceRoutes`, `unifiedAdvancementRoutes`) were mounted without authentication middleware.
**Learning:** Router-level mounting in `server.ts` does not automatically inherit global auth if global auth is commented out.
**Prevention:** Always verify `app.use` calls for sensitive routers include `authenticateRequest` or ensure global middleware is active.
