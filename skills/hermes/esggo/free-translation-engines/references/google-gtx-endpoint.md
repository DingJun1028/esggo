# Google gtx endpoint — reference detail

## Request
```
GET https://translate.googleapis.com/translate_a/single
  ?client=gtx
  &sl=<source lang code or 'auto'>
  &tl=<target lang code>
  &dt=t            # return translated text segments
  &q=<urlencoded text>
```
Headers: `User-Agent: Mozilla/5.0` recommended (some setups 403 without it).

## Response shape
Top-level JSON array. Translated text spread across `response[0]` which is an array of
`[segmentText, sourceText, ...]` tuples.

```js
const out = (d[0] || []).map(x => x[0]).join('');
```

## Known-good pairs (verified 2026-08)
| sl     | tl     | q                    | result                       |
|--------|--------|----------------------|------------------------------|
| zh-CN  | en     | 你好                 | hello                        |
| zh-TW  | en     | 你好世界             | hello world                  |
| auto   | zh-CN  | Good morning         | 大家早安 (auto-detected: en) |
| en     | zh-TW  | meeting starts       | 會議開始                      |
| ja     | zh-TW  | 会議が始まります      | 會議開始 (CJK normalized)     |

## Why it satisfies "只用免費"
- No API key, no auth header, no project, no billing.
- TOS is a gray area (unofficial client=gtx), but it costs $0 and requires no private credential.
- Stable and fast in practice; avoids MyMemory crowd-layer noise on shared IPs.

## Caveats
- Not an official API; field shape could change. Keep `gtx` behind a named engine wrapper with fallback.
- For production, treat as best-effort; chain MyMemory/LibreTranslate behind it for resilience.
