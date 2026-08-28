---
name: socrata-scrape
version: 1.0.0
author: OA-Team (Hermes Agent)
license: AGPL-3.0
metadata:
  hermes:
    tags: [scraping, free, open-data, socrata, real-estate, government, zero-cost]
description: Free keyless Socrata open-data scraping.
---

# Socrata Open-Data Scrape (Free Path)

Use when the user wants property / parcel / permit / open-government data for free, or when paid scrapers (Zenrows, Zillow) are blocked or violate a "free-only" rule.

## When to use
- User asks for real-estate / parcel / permit / open-data and the free-only rule applies.
- Zillow / Craigslist / Redfin are blocked (PerimeterX / Cloudflare on datacenter IPs).
- You need structured JSON with no API key and no proxy.

## Core technique (verified 2026-08-16)
Socrata-backed portals (data.sfgov.org, data.cityofnewyork.us, data.oaklandca.gov, …) are FREE, KEYLESS, weak-anti-bot. They expose a JSON API.

1. **Enumerate datasets** — `GET https://<domain>/api/views/?limit=50`. Then filter CLIENT-SIDE by name regex (`/property|parcel|assess|permit/i`). Do NOT use `?q=…&domain=…` on the catalog — the `domain` filter is broken and returns 0 results.
2. **Fetch records** — `GET https://<domain>/resource/<id>.json?$limit=N`. Returns an array of row objects.
3. **Network reality on corporate-whitelisted hosts**: `node` built-in `fetch` often fails (`fetch failed`) because proxy env vars aren't visible to node. Use `curl` via `child_process.execSync` — curl picks up the system proxy. (Confirm whitelist with `curl -s -o /dev/null -w "%{http_code}" https://data.sfgov.org` → 200; `google` 200 but `craigslist`/`redfin` 000 = not whitelisted.)
4. **Retry on `000`**: whitelisted egress is flaky. Wrap curl in an 8× retry loop; treat `000` as retryable, but `404`/`403` as terminal (real "not found" — Socrata returns `{"error":true,"message":"Not found"}`).
5. **Freeze & tag** (5T): `Object.freeze` each record, inject `source_origin` (`<domain>/resource/<id>`) and `fetched_at`.

## Verified SF datasets (data.sfgov.org)
| Dataset | ID | Content |
|---|---|---|
| Parcels - Active/Retired | `8jwb-2stv` | block/lot, address, zoning, lat/lng |
| PermitSF Permitting Data | `tyz3-vt28` | building/fire permits, address, status |

See `references/sfgov_datasets.md` for the exact probe transcript + reusable Node wrapper.

## Why not Zillow (free)?
Zillow uses PerimeterX; any datacenter IP (Oracle VPS, cloud, even local Playwright) gets "Press & Hold to confirm you are a human" / 403 px-captcha. Residential proxy is required = paid. The user-owned `zenrows-mcp-hermes` skill covers the paid SDK `_api/search` bypass (recommend `hermes curator adopt zenrows-mcp-hermes` if it lacks the phantom-CLI + Zillow notes).

## 5T compliance
- Traceable: `source_origin` per record
- Trackable: `fetched_at` timestamp
- Tangible: structured JSON
- Transparent: public Socrata API, no auth
- Trustworthy: `Object.freeze()`

## Acceptance checklist
- [ ] Enumerated via `/api/views/` (not broken `domain=` catalog filter)
- [ ] Fetched via `curl` (node fetch may fail on whitelisted net)
- [ ] 8× retry loop handles `000` flakiness
- [ ] Each record frozen + tagged with `source_origin` / `fetched_at`
