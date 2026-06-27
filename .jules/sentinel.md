## 2026-06-27 - [XSS Vulnerability in dangerouslySetInnerHTML]
**Vulnerability:** Found Cross-Site Scripting (XSS) vulnerability due to rendering untrusted user/AI content directly using `dangerouslySetInnerHTML` in `omni-one-chat.tsx` and `omni-note-crud.tsx`.
**Learning:** React's `dangerouslySetInnerHTML` bypasses built-in XSS protections. Rendering user input or AI-generated Markdown/HTML without prior sanitization allows execution of arbitrary injected scripts.
**Prevention:** Always use a sanitization library like `xss` or `dompurify` on untrusted HTML strings before passing them to `dangerouslySetInnerHTML`.
