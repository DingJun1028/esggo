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
## 2026-07-03 - [Refactor sshExec to prevent local command injection]
**Vulnerability:** `sshExec` in `src/agents/vps/handlers.ts` constructs SSH commands via string interpolation within `execAsync`. This is vulnerable to local command injection via shell substitutions.
**Learning:** Using raw shell strings for executing commands is dangerous, especially when arguments are passed dynamically.
**Prevention:** Always use `execFile` or `spawn` with an argument array instead of a raw shell string when executing commands dynamically.
