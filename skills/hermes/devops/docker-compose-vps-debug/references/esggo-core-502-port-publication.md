# esggo-core: 502 from nginx, but internal container curl returns 200

Date: 2026-07-23
VPS: esggo-vps ubuntu@161.118.252.147
Container: `esggo-core`

## Symptom

`curl https://esggo.co/` returned `502 Bad Gateway`.
Nginx config proxies `esggo.co` to `http://127.0.0.1:3000/`.

## Investigative sequence

1. `curl -sv http://127.0.0.1:3000/` from the VPS host returned:
   `connect to 127.0.0.1 port 3000 ... Connection refused`
2. `docker exec esggo-core curl ...` returned:
   `STATUS 200 OK` with full Next.js HTML
3. `docker inspect --format "{{json .NetworkSettings.Ports}}" esggo-core` returned:
   `{"3000/tcp": null}`

## Root cause

The port is not published/exposed to the host network namespace. `docker ps` showed
`3000/tcp` in the PORTS column, but that only indicates the container *declares*
`EXPOSE 3000`; it does not mean Docker publishes it to the host without an
explicit `ports: "127.0.0.1:3000:3000"` mapping.

Because the host could not reach `127.0.0.1:3000`, nginx returned `502`
(`connect() failed (111: Connection refused)`), while the container still
self-responded on its loopback.

## Secondary issue

Container health is `unhealthy` (`FailingStreak: 192`) because the healthcheck
uses `wget`, which is absent in `node:22-alpine`. Cron jobs also crash with
`PrismaClientInitializationError`: `could not locate the Query Engine for
runtime "linux-arm64-openssl-3.0.x"`.

## Fixes

- Ensure `docker-compose.*.yml` publishes the port explicitly, e.g.:
  `ports: ["127.0.0.1:3000:3000"]`
  or re-check the published side if using compose overrides.
- Rebuild with Prisma dual `binaryTargets` in `schema.prisma`:
  `["linux-musl-arm64-openssl-3.0.x", "linux-arm64-openssl-3.0.x"]`
  and re-run `npx prisma generate` in the builder stage.
- Add `wget`/`curl` to the image or change the healthcheck so Docker does not
  mark the container unhealthy when the app is actually running.

## Key lesson

> Internal container success is not sufficient evidence that a reverse proxy or
> host process can reach the published port. Always validate the same path the
> proxy uses from the *host* namespace.
