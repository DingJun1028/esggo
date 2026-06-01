## 2024-05-24 - [XSS Fix]
**Vulnerability:** Found un-sanitized user input passed directly into `dangerouslySetInnerHTML` in `app/memory/page.tsx` and `app/wiki/WikiClientPage.tsx`. This could lead to Cross-Site Scripting (XSS) if attacker controls the input.
**Learning:** `dangerouslySetInnerHTML` is used in multiple places. In `app/wiki/WikiClientPage.tsx` it is used with string replacements adding classes.
**Prevention:** Use a library like `xss` to sanitize HTML. Ensure that if `dangerouslySetInnerHTML` is used for styling (like class names added via regex), you should configure the `xss` library whitelist to allow those attributes.
