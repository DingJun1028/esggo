---
name: free-translation-engines
description: Free-only translation under zero-key constraint.
---

# Free Translation Engines (零 key / 免費 / 只用免費硬約束)

## When to use
- User says "只用免費" / "no paid API" / "no private key" / "禁付費API"
- Translation returns the ORIGINAL untranslated text (most common with zh-TW on MyMemory)
- Building a translation chain that must work with ZERO credentials
- Diagnosing why a specific language pair silently fails

## The proven free-only engine chain
1. **Google gtx** (PRIMARY) — unofficial endpoint, free, zero key, supports `auto` detection AND `zh-TW` natively
2. **LibreTranslate** (optional, only if self-hosted via env `LIBRETRANSLATE_URL`)
3. **MyMemory** (fallback, free, add `&de=<email>` to lift quota)
4. **passthrough / fallback-origin** (return original text — never break the live stream)

Order matters: try Google first (most stable free), then self-hosted Libre, then MyMemory, then give up gracefully.

## Google gtx endpoint (the key recipe)
```
GET https://translate.googleapis.com/translate_a/single?client=gtx&sl=<src>&tl=<dst>&dt=t&q=<urlencoded text>
```
- `sl=auto` works (language auto-detect)
- `sl=zh-TW` works (Google handles Traditional Chinese natively — no normalization needed)
- Response: JSON array; translated text = `d[0].map(seg => seg[0]).join('')`
- NO API key, NO auth. TOS gray area but zero-cost / zero-key — satisfies a "only free" hard constraint.

Node fetch example:
```js
const u = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
const r = await fetch(u, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Mozilla/5.0' } });
if (!r.ok) throw new Error('gtx HTTP ' + r.status);
const d = await r.json();
const out = (d[0] || []).map(x => x[0]).join('');
if (!out) throw new Error('gtx empty');
```

## MyMemory quirks (why zh-TW silently fails)
- `langpair=zh-TW|en` → returns the ORIGINAL untranslated text (silent failure, no error!)
- `langpair=auto|en` → `INVALID SOURCE` error
- `langpair=zh-CN|en` → works correctly
- FIX: normalize `zh-TW → zh-CN` and `auto → en` (or any concrete code) BEFORE calling MyMemory
- Add `&de=<email>` to lift the free quota and improve quality (still free, no key)

## Language-code normalization rules
| Input            | MyMemory / LibreTranslate | Google gtx        |
|------------------|--------------------------|-------------------|
| zh-TW / zh-Hant  | → zh-CN                  | send as-is (works)|
| auto             | → en (assumed stable)    | send as-is (works)|
| zh / zh-CN / zh-Hans | → zh-CN              | send as-is        |
| zh-hk            | → zh-CN                  | send as-is        |

Rule of thumb: **normalize for MyMemory/LibreTranslate; pass raw to Google gtx.**

## Verification recipe (no key needed)
- `curl "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=%E4%BD%A0%E5%A5%BD"` → `"hello"`
- `sl=auto&tl=zh-CN&q=Good%20morning` → `"大家早安"` (auto-detected en)
- `sl=zh-TW&tl=en&q=你好世界` → `"hello world"` (Google native zh-TW)

## Pitfalls
- Do NOT trust MyMemory's success on `zh-TW` — it returns the source text untranslated with HTTP 200. Always assert the output differs from input, or prefer Google gtx for CJK.
- A stale server process from a previous session can occupy the port and serve OLD engine logic, making fixes look broken. Kill the port owner before re-testing (`netstat -ano | grep <port>`, then `taskkill /PID <pid> /F`).
- Sharing a public IP with MyMemory's free tier can hit crowd-layer noise (garbage output for some phrases). Google gtx avoids this.
- See `references/google-gtx-endpoint.md` for full request/response shapes and known-good pairs.
