## 2024-05-31 - [XSS] dangerouslySetInnerHTML
**Vulnerability:** Found unsanitized use of `dangerouslySetInnerHTML` with `error` state in `app/memory/page.tsx` which is directly populated from a fetch response's `error.message`. It's a potential XSS if the API returns malicious HTML.
**Learning:** React components should not use `dangerouslySetInnerHTML` with unescaped data from APIs.
**Prevention:** Avoid `dangerouslySetInnerHTML` when rendering plain text or sanitize HTML strings before using it.
