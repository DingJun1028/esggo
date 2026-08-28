---
name: docker-network-isolation-diagnosis
description: Diagnose Docker compose container network DNS failures.
version: 0.2.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [docker, networking, debugging, compose, dns, 502, infrastructure]
    related_skills: [systematic-debugging]
---

# Docker Network Isolation Diagnosis Skill

## Overview

Diagnose and fix Docker compose containers splitting across networks, causing DNS resolution failures (502/500/timeout). The tight feedback loop proves DNS resolution works before and after the fix.

## When to Use

- nginx returns 502 Bad Gateway after docker-compose restart
- gateway logs: "No address associated with hostname" for redis/mysql/etc.
- curl inside container: "DNS resolving timed out"
- Services that worked before suddenly can't communicate
- `--force-recreate` caused network split

**Don't use for:** Intentional multi-network setups, Docker Swarm/K8s networks, non-Docker networking issues.

## Quick Start

```bash
# One-command diagnostics
bash ~/.hermes/skills/docker-network-isolation-diagnosis/scripts/docker-net-check.sh

# Force all containers onto same network
docker compose up -d --build --force-recreate
```

## Procedure

### Phase 1: Tight Feedback Loop (RED)

1. Run the diagnostic script:
   ```bash
   bash ~/.hermes/skills/docker-network-isolation-diagnosis/scripts/docker-net-check.sh
   ```
2. Confirm the symptom (502/500/DNS timeout)

### Phase 2: Root Cause Analysis

1. Inspect each container's network membership:
   ```bash
   docker inspect <container> --format '{{.Name}}: net={{range $n,$c := .NetworkSettings.Networks}}{{$n}} ip={{$c.IPAddress}}{{end}}'
   ```
2. Check DNS aliases (empty aliases = container recreated without original network):
   ```bash
   docker inspect <container> --format '{{range $n,$c := .NetworkSettings.Networks}}{{$c.Aliases}}{{end}}'
   ```
3. Test DNS resolution from container:
   ```bash
   docker exec <container> wget -qO- http://<service>:<port>/health 2>&1
   ```

### Phase 3: Identify the Split

- Each container must share at least one network name
- Check `Aliases` field is non-empty: `[<container_name> <service_name> <container_id>]`
- Check IPs are in the same subnet (`172.x.x.x` vs `192.168.x.x`)

### Phase 4: Apply Fix (GREEN)

```bash
# Remove stale containers on wrong network
docker compose rm -sf <container-names>

# Recreate ALL on correct network
docker compose up -d --build --force-recreate
```

### Phase 5: Verify

```bash
# Confirm all containers on same network
for c in gateway nginx frontend redis; do
  docker inspect "deer-flow-$c" --format '{{.Name}}: net={{range $n,$c := .NetworkSettings.Networks}}{{$n}}{{end}}'
done

# Confirm HTTP 200 (not 502/500)
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:2026/health
# Expect: 200
```

## Pitfalls

1. **Partial recreate**: `--force-recreate` on only some containers splits the network. Always recreate ALL.
2. **Missing .env vars**: compose vars without defaults cause silent path resolution failures. Create `.env.local` with only the missing vars (never commit secrets).
3. **Docker Desktop daemon crash**: after a daemon crash, containers start fresh — network state resets. Full recreate required.
4. **Alpine containers**: Alpine images lack `python`, `curl`, `nslookup`. Use `wget` (BusyBox) or `docker run --rm --network=<network> nicolaka/netshoot nslookup <host>`.
5. **Env-file path doubling**: Windows path mangling with compose. Always run compose from the file's directory.
6. **Cache not refreshed**: after fixing nginx config, run `nginx -s reload` inside the container before testing.

## Verification Checklist

- [ ] All containers share at least one network name
- [ ] Each container has non-empty Aliases field
- [ ] IP addresses are in the same subnet
- [ ] Container-to-container DNS resolution works (HTTP 200)
- [ ] Host curl returns HTTP 200 (not 502/500)

## Support Files

- **`scripts/docker-net-check.sh`** — Executable diagnostic that checks network membership, DNS aliases, and subnet alignment across all containers
- **`templates/.env.local.example`** — Starter file for compose env overrides (internal paths only, no secrets)
- **`references/network-split-patterns.md`** — Session-specific notes on common Docker compose network split scenarios

## Related

- [systematic-debugging](systematic-debugging) — use Phase 1 (tight feedback loop) before this skill
- Docker docs: [`docker compose up --force-recreate`](https://docs.docker.com/compose/how-tos/recreate-restart-policy/)
