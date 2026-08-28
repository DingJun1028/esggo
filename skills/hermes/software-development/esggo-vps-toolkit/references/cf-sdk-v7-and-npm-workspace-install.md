# Cloudflare SDK v7 + npm workspace install — verified detail

Companion to SKILL.md §28. Copy-paste artifacts from the 2026-08 `translate.esggo.co` bring-up.

## A. Verified `cloudflare@^7` ensure-tunnel sketch

```ts
import Cloudflare from 'cloudflare';

const ACCOUNT_ID = process.env['CLOUDFLARE_ACCOUNT_ID'];
const API_TOKEN  = process.env['CLOUDFLARE_API_TOKEN'];
const TUNNEL_NAME = process.env['CF_TUNNEL_NAME'] ?? 'esggo-tunnel';
const HOSTNAME    = process.env['CF_HOSTNAME'] ?? 'translate.esggo.co';
const ZONE_NAME   = process.env['CF_ZONE_NAME'] ?? 'esggo.co';

if (!API_TOKEN) { console.error('❌ 缺少 CLOUDFLARE_API_TOKEN'); process.exit(1); }
if (!ACCOUNT_ID) { console.error('❌ 缺少 CLOUDFLARE_ACCOUNT_ID'); process.exit(1); }

const client = new Cloudflare({ apiToken: API_TOKEN });

// Tunnels live under zeroTrust, NOT accounts:
let tunnel = (await client.zeroTrust.tunnels.cloudflared.list({ account_id: ACCOUNT_ID, name: TUNNEL_NAME })).result
  .find(t => t.name === TUNNEL_NAME);
if (!tunnel) {
  const created = await client.zeroTrust.tunnels.cloudflared.create({ account_id: ACCOUNT_ID, name: TUNNEL_NAME, config_src: 'cloudflare' });
  tunnel = { id: created.id!, name: created.name! };
}
const tunnelId = tunnel.id;

const zone = (await client.zones.list({ name: ZONE_NAME })).result.find(z => z.name === ZONE_NAME)!;
const cnameTarget = `${tunnelId}.cfargotunnel.com`;
const existing = (await client.dns.records.list({ zone_id: zone.id, name: HOSTNAME })).result
  .find(r => r.name === HOSTNAME && r.type === 'CNAME');
if (!existing) {
  await client.dns.records.create({ zone_id: zone.id, name: HOSTNAME, type: 'CNAME', content: cnameTarget, ttl: 1, proxied: true } as any);
}
```

Notes:
- `created.id` / `created.name` / `tunnel.id` are typed `string | undefined` → assert `!`.
- DNS `create` param is a union; `as any` on the object avoids the branded `Name` type error (OK in an isolated tool script).
- This is the REST-API path. It needs an Account Token. If you only have the tunnel cert on the VPS,
  use `cloudflared tunnel route dns <name> <host>` instead (no token) — see §3b in `cloudflare-tunnel-vps-expose`.

## B. npm install crash inside a pnpm workspace subdir

Symptom: `npm install` in a leaf package aborts with
`npm error Cannot read properties of null (reading 'matches')` and installs nothing;
the service then dies with `ERR_MODULE_NOT_FOUND: Cannot find package 'ws'`.
Root cause: npm crawls the parent workspace root and hits a corrupted `git+https` dep
(`closure-net@git+https://github.com/google/closure-net.git`).

Fix (isolated install, no workspace crawl):
```bash
npm install ws@^8.18.0 --no-package-lock --no-audit --no-fund --omit=dev \
  --workspaces=false --include-workspace-root=false
```
Prefer from repo root: `pnpm --filter <pkg> add <dep>`.
