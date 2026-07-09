## 2024-05-30 - Hash Locks and Immutable State

**Vulnerability:** Core data objects (like `IComponentCore`, `OmniNote`, `OmniTask`) were mutable, which violates the "Omni Restoration" protocol's Hash Lock requirement for snapshot rollbacks and reliable auditing.

**Learning:** When strict data traceability and immutability (like ISO-14064-1 compliance) are required, returning mutable objects from factory functions makes the state unpredictable. Also, raw string data from various sources can contain invisible characters or malformed encodings, causing hashing mismatches.

**Prevention:** Use `Object.freeze()` on returned objects to enforce Hash Locks. Use `EntropyForge.purify()` on raw string data before hashing or storing to normalize encodings and remove zero-width characters, ensuring consistent hashing.
## 2026-07-01 - [Replace Naive Regex HTML Sanitization with xss Library]
**Vulnerability:** Naive regex-based HTML sanitization functions (`sanitizeHtml`, `sanitizeTextHtml`) were discovered in `src/lib/safe-api.ts`, `app/omni-agent/page.tsx`, `app/omni-center/omni-one-chat.tsx`, and `app/omni-center/omni-note-crud.tsx`. They attempted to manually strip `<script>` tags and `on*` event handlers, leaving the application vulnerable to sophisticated Cross-Site Scripting (XSS) bypasses.
**Learning:** Hand-rolled regex sanitization is rarely comprehensive and often misses complex XSS vectors (e.g., malformed tags, nested scripts, alternative event handlers). A dedicated security library like `xss` is required for safe `dangerouslySetInnerHTML` rendering.
**Prevention:** Always use an established, well-maintained HTML sanitization library like `xss` or `DOMPurify` instead of custom regex when rendering untrusted HTML.
## 2026-07-02 - [Remove Hardcoded API Key from Gateway Config]
**Vulnerability:** A hardcoded API key fallback (`omniagent_gold_2026`) was present in the gateway server's configuration and deployment scripts. This meant that if the environment variables weren't set explicitly, anyone knowing this default fallback key could authenticate to the server.
**Learning:** Default API keys and secrets in code provide a false sense of ease-of-use while significantly compromising security. Fallbacks for authentication credentials should never exist.
**Prevention:** Always require secrets to be injected at runtime via environment variables or secret managers, and throw a clear error (or log a warning and block requests) if they are missing.
## 2026-07-09 - [Fix Path Traversal in Wiki Dynamic Route]
**Vulnerability:** The dynamic route `app/wiki/[slug]/page.tsx` was vulnerable to path traversal attacks because it blindly appended user-provided `slug` parameters to a file read operation without validating that the final path stayed within the intended directory.
**Learning:** Never trust user input, especially for file system operations. `decodeURIComponent(slug)` combined with `path.join` can be exploited with sequences like `../../` to escape the intended directory and read arbitrary files (like `.env`).
**Prevention:** To prevent path traversal vulnerabilities in Node.js/Next.js, use `path.resolve` to construct the absolute file path and verify that it strictly starts with the intended base directory (including `path.sep` to avoid partial directory name matches).
