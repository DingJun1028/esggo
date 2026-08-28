# SF Socrata Datasets — Verified Reference (2026-08-16)

## Environment notes (corporate-whitelisted host)
- `node` built-in `fetch` → `fetch failed` (proxy env not inherited by node).
- `curl` works (picks up system proxy). Use `curl` via `execSync`.
- Whitelist check: `curl -s -o /dev/null -w "%{http_code}" https://data.sfgov.org` → `200`. `google`=200, `craigslist`/`redfin`=000 (blocked).
- `000` is flaky egress → retry loop; `404`/`403` are terminal.

## Enumeration (NOT via catalog domain filter — it's broken)
```
GET https://data.sfgov.org/api/views/?limit=50
→ filter client-side: /property|parcel|assess|building|permit|real/i
```
Confirmed SF datasets found this way:
- `8jwb-2stv` — Parcels - Active and Retired (no geometry)
- `tyz3-vt28` — PermitSF Permitting Data

## Fetch
```
GET https://data.sfgov.org/resource/8jwb-2stv.json?$limit=5   → 200, array
GET https://data.sfgov.org/resource/tyz3-vt28.json?$limit=5   → 200, array
```
Sample parcel row: `{mapblklot:"3584032", from_address_num:"3976", street_name:"19TH", street_type:"ST", zoning_code:"RH-2", zoning_district:"RESIDENTIAL- HOUSE, TWO FAMILY", centroid_latitude:"37.7597", centroid_longitude:"-122.4320", ...}`
Sample permit row: `{recordid:"2858", recordno:"FIRE-26-216", recordtype:"Fire sprinkler permit", status_detail:"Active - Not Issued", streetno:"3250", streetname:"18TH ST", postalcode:"94110", ...}`

## Reusable Node wrapper
```js
const { execSync } = require('child_process');
const fs = require('fs');
function curlJSON(url, retries = 8) {
  for (let i = 0; i < retries; i++) {
    try {
      const out = '/tmp/sf_tmp.json';
      const code = execSync(`curl -s --max-time 20 -o "${out}" -w "%{http_code}" "${url}"`, { encoding: 'utf8' }).trim();
      if (code === '200') {
        const d = JSON.parse(fs.readFileSync(out, 'utf8'));
        if (Array.isArray(d) && d.length) return d;
      }
      if (code !== '000') return null; // 404/403 = real not-found, stop
    } catch (e) {}
  }
  return null;
}
function fetchDataset(id, limit = 5) {
  const rows = curlJSON(`https://data.sfgov.org/resource/${id}.json?$limit=${limit}`) || [];
  return Object.freeze(rows.map(r => Object.freeze({
    ...r, source_origin: `data.sfgov.org/resource/${id}`, fetched_at: new Date().toISOString()
  })));
}
```

## Confirms free-only rule satisfied
No API key, no proxy, no paid SDK. Only Zillow-class sites need paid residential proxies.
