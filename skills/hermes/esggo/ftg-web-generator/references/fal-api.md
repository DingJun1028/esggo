# FAL Image API integration (Path C for ftg-tools)

Module: `apps/ftg-tools/fal-images.js`. Called by `ftg-gen.js` to populate `assets/*.jpg`.

## Contract
`generateForTheme(theme, outDir, localAssetsDir) -> Promise<{source, reason?}>`
- `source: 'fal-api'` — images fetched from FAL and written to `outDir`.
- `source: 'local-fallback'` — copied from `localAssetsDir`; `reason` is `'no FAL_KEY'` or the caught error string.

## Happy path (when FAL_KEY set)
```
POST https://fal.run/fal-ai/flux/dev
Headers: Authorization: Key <FAL_KEY>, Content-Type: application/json, Accept: application/json
Body:    { "prompt": <slot prompt>, "image_size": "landscape", "num_images": 1 }
Timeout: 120000 ms
Response JSON: { "images": [ { "url": "https://..." } ] }
Then: https.get(url) -> stream to outDir/<slot>.jpg
```
Slots: `hero, stay, eco, craft, market, restore` — prompts in `PROMPTS` map (terraced-paddy hero, eco homestay, river restoration, bamboo craft, rural market, wetland/forest).
Override model via `FAL_MODEL` env (default `fal-ai/flux/dev`).

## Failure handling (mandatory)
- No `FAL_KEY`/`FAL_API_KEY` -> skip network, copy local.
- Any `req.on('timeout'|'error')`, non-200 download, or JSON-parse miss -> `catch` -> copy local.
- The caller (`ftg-gen.js`) always writes HTML/CSS/JS **before** invoking, inside an async IIFE, so a hang/failure never blocks page output.

## Tests
`fal-images.test.mjs` (2 cases, both expect `local-fallback`):
1. delete `FAL_KEY` -> `falKey()` empty, images copied from a temp local dir.
2. set `FAL_KEY='dummy-invalid'` -> network/auth fails -> still falls back locally.

Run: `cd apps/ftg-tools && node --test fal-images.test.mjs`
