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

## 2026-07-22 - [Path Traversal in Dynamic Routes]
**Vulnerability:** The dynamic route `app/wiki/[slug]/page.tsx` constructed file paths using `path.join(process.cwd(), 'wiki', 'wiki', \`${decodedSlug}.md\`)` without validating the resulting absolute path. This allowed potential directory traversal attacks using payloads like `../../../` to read unintended local files on the server.
**Learning:** Using `path.join` with user-supplied input (like route parameters) is unsafe as it resolves `../` segments but doesn't prevent escaping the base directory.
**Prevention:** To prevent path traversal in Node.js/Next.js, always construct an absolute file path using `path.resolve` and verify that the resulting string strictly starts with the intended base directory (including `path.sep` to prevent partial folder matches).
