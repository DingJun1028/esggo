---
name: frontend-refactor-safety
description: "Prevents DOM/JS desync crash and CJK regex mojibake."
version: 1.0.0
author: Hermes Agent
license: MIT
tags: [frontend, html, javascript, refactoring, debugging, dom]
---

# Frontend Refactor Safety (vanilla HTML/JS)

Patterns for restructuring hand-written HTML+`<script>` UIs without breaking
event wiring. These bite hardest during "cleanup" refactors — collapsing a
control panel into an icon toolbar, removing buttons, or rewriting the body
into a floating overlay — exactly when you think you're just tidying up.

## When to use
- Collapsing controls into a capsule/toolbar of icons (removing some buttons).
- Rewriting `<body>` structure (floating overlay, glassmorphism, RWD rewrite).
- Renaming element ids or moving them between containers.
- Adding any `detectLang`-style regex over non-ASCII character ranges.

## Pitfall 1 — DOM/JS binding desync silently kills the whole script

**Symptom the user reports:** "toolbar buttons don't respond / can't be
clicked" — ALL of them, not just the removed one.

**Root cause:** If you delete a button from the HTML but leave its binding in
JS, e.g.
```js
$('btnTheme').onclick = () => { ... };   // btnTheme no longer in DOM
```
then `$('btnTheme')` is `null`, `.onclick=` throws `TypeError`, and because it
is a top-level statement in the `<script>`, **the entire script aborts at that
line**. Every handler defined *after* it (even unrelated buttons like
🪟/🎙️/⚙️) never gets bound. One removed button takes down the whole UI.

This is especially sneaky because the removed button is the one you *intended*
to drop — the failure looks like "the buttons I kept are broken."

**Fix pattern — guard every optional binding:**
```js
const themeBtn = document.getElementById('btnTheme');
if (themeBtn) themeBtn.onclick = () => { ... };
```
Or, for a group of icon buttons that may or may not exist:
```js
const courseBtn = document.getElementById('btnCourse');
if (courseBtn) courseBtn.onclick = () => { ... };
```

**Rule of thumb:** any `$('x')` or `getElementById('x')` whose element you
might have removed/renamed during the refactor MUST be null-guarded. Don't
assume "it's still there" — verify.

## Verification — id-existence scan (run after every UI refactor)

A static scan catches this class of bug *before* deploy. See
`scripts/check_script_ids.py`: it extracts every `$('id')` /
`getElementById('id')` reference from the `<script>` blocks and checks each id
exists in the markup. Any missing id = a future null-crash.

```bash
python3 scripts/check_script_ids.py apps/omnilive/public/index.html
# MISSING IDS (1): reference in JS but not in HTML:
#   - btnTheme        <-- would throw at runtime, aborting the script
```

Also run `node --check` on the extracted script to catch syntax errors:
```bash
python3 - <<'PY'
import re
html=open('apps/omnilive/public/index.html',encoding='utf-8').read()
m=re.search(r'<script>(.*)</script>', html, re.S)
open('/tmp/chk.mjs','w').write(m.group(1))
PY
node --check /tmp/chk.mjs && echo JS_SYNTAX_OK
```

## Pitfall 2 — CJK / non-ASCII regex mojibake

**Symptom:** a regex range like `/[一-鿿㐀-䶿豈-﫿]/` "shows garbled characters"
(e.g. `぀-ヿ` appears) and the user flags it as mojibake.

**Reality check first:** the file *bytes* are often correct (UTF-8 for
一 U+4E00, 鿿 U+9FFF, 㐀 U+3400, 䶿 U+4DBF, 豈 U+F900, 﫿 U+FAFF). The garble is
usually a **terminal/display font** rendering CJK *Compatibility Ideographs*
(U+F900 豈) as look-alike kana — not actual file corruption. Verify with a
byte-level read before "fixing" something that isn't broken.

**Robust fix — write ranges as pure-ASCII `\u` escapes** so the source contains
zero literal CJK characters and can never mojibake through any tooling:
```js
// detect Chinese vs English by Han-character ratio (no literal CJK in source)
const CJK = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
```
When you must edit such a line via patch/write tools, prefer a Python
byte-level replace (open `rb`, `data.replace(old_bytes, new_bytes)`) over
pasting literal CJK into the patch string — the tool layer can mangle literal
non-ASCII in the diff.

**Language-detection note (zh-TW ↔ en two-language case):** count Han chars
(CJK Unified + Extension A + Compatibility) vs total; ratio > 0.15 ⇒ Chinese
→ translate to en, else en → zh-TW. Do NOT add kana (hiragana/katakana) ranges
unless Japanese is actually a target language — including them misclassifies.
If Japanese *is* needed, add explicit kana ranges and a "kana ratio > 8% ⇒ ja"
branch *before* the Han check.

## Deploy checklist for a UI refactor
1. `node --check` the extracted `<script>` (syntax).
2. `python3 scripts/check_script_ids.py <file>` — zero missing ids.
3. Commit, push, deploy to a test instance, then verify buttons actually fire
   (click each one; don't trust "it loaded").
4. Keep the previous stable version on a separate branch/instance so a broken
   UI can be rolled back by pointing the proxy back.
