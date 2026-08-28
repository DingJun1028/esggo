# ESGGO Docker Compose Deployment Guide (2026-07-23)

## Overview
This document captures the Docker Compose deployment approach used for ESGGO v5.1.0 on an Ubuntu VPS (161.118.252.147) with nginx reverse proxy.

## Files Created

### 1. docker-compose.yml
Multi-service composition with:
- `esggo` - Next.js app container (port 3000)
- `nginx` - Reverse proxy (ports 80/443)
- `redis` - Cache and async task state
- `omniagent-gateway` - AI proxy (port 8642)
- `certbot` - SSL certificate management (profile: certbot)

### 2. nginx.conf
Optimized configuration with:
- HTTP → HTTPS redirect
- SSL termination with security headers
- Proxy to app and gateway
- Gzip compression

### 3. .env.production
Environment variables template for:
- AI Provider Keys (GROQ, OPENROUTER, GEMINI)
- Supabase configuration
- Redis configuration
- Firebase configuration (optional)

## Key Learnings

### Docker Compose v1 vs v2 on Ubuntu 24.04
- Ubuntu 24.04 may have only `docker-compose` v1.29.2
- Use `/usr/bin/docker-compose` explicitly when `docker compose` fails
- Check with: `docker-compose --version`

### SSH Key Handling on Windows
- Use Git Bash/Msys path: `/c/Project/ESGGO VPS/id_rsa_esggo_real`
- Always use `-o StrictHostKeyChecking=no` for first connection
- Use `-o UserKnownHostsFile=/dev/null` to avoid known_hosts issues

### Upload Files When rsync Unavailable
```bash
scp -i /c/Project/ESGGO\ VPS/id_rsa_esggo_real \
    docker-compose.yml nginx.conf .env.production \
    ubuntu@161.118.252.147:/var/www/esggo/
```

### Deployment Sequence
1. Create deploy directory: `sudo mkdir -p /var/www/esggo`
2. Upload files via scp
3. Set permissions: `sudo chmod 600 .env.production`
4. Build and start: `docker-compose up -d --build`
5. Verify health: `curl http://localhost:3000/api/health`

## Dockerfile Considerations

The existing `Dockerfile` at root is x86_64 compatible and works on Ubuntu VPS. The ARM-specific `vps/Dockerfile.arm64` is for Oracle Ampere A1 instances.

Key COPY paths that must exist:
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- `packages/*/package.json` (workspace packages)

## Environment Variables Required

```bash
# AI Provider Keys (at least one free tier)
GROQ_API_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis (defaults work with docker-compose service)
REDIS_HOST=redis
REDIS_PORT=6379

# Firebase (optional)
FIREBASE_SERVICE_ACCOUNT_JSON=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_API_KEY=
```

## Health Check Endpoints

- App: `http://localhost:3000/api/health`
- Nginx: `http://localhost:80/health`
- Gateway: `http://localhost:8642/status`

## SSL Certificate Acquisition

After deployment, obtain SSL certificate:
```bash
# Start certbot container
docker-compose --profile certbot up -d

# Request certificate (replace with actual domain)
docker exec esggo-nginx certbot certonly \
  --webroot -w /var/www/certbot \
  -d your-domain.com \
  --email admin@example.com \
  --agree-tos --non-interactive
```

## Common Issues

### Port Conflicts
If host nginx or next-server already uses ports 80/3000:
- Stop host services first
- Or use different host port mappings

### Memory Constraints on ARM VPS
- 1 OCPU / 6GB RAM is tight
- Consider starting services one at a time
- Keep swap enabled: `sudo swapon -s`

### Permission Denied (publickey)
- Verify SSH key fingerprint matches provider
- Check `~/.ssh/authorized_keys` on VPS
- Use Console Connection as fallback for OCI

## Verification Checklist

- [ ] SSH connection: `ssh -i key ubuntu@161.118.252.147`
- [ ] Docker installed: `docker --version`
- [ ] Docker Compose v1: `docker-compose --version`
- [ ] App health: `curl http://localhost:3000/api/health`
- [ ] Nginx HTTP: `curl http://localhost:80/health`
- [ ] Nginx HTTPS: `curl -I https://your-domain.com`
- [ ] Gateway health: `curl http://localhost:8642/status`