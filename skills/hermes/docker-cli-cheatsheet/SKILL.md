---
name: docker-cli-cheatsheet
description: "Corrected, battle-tested Docker CLI reference. Use when building images, running containers, debugging a Docker host, or writing Dockerfiles/compose. Includes fixes for common cheat-sheet errors (--no-cache placement, daemon startup, shell-in-container, prune -a) and the high-frequency commands most references omit (compose, --rm, batch cleanup, volumes, networks, buildx)."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [docker, cli, cheatsheet, containers, devops, reference]
---

# Docker CLI Cheat Sheet (corrected)

A pragmatic Docker command reference. Corrections vs. common cheat sheets are flagged with ⚠.

## Build images
```bash
docker build -t <image_name> .                       # build from Dockerfile in cwd
docker build -t <image_name> --no-cache .            # ⚠ --no-cache goes BEFORE the context '.'
docker build -t <image_name> -f path/Dockerfile .    # custom Dockerfile path
docker buildx build --platform linux/amd64,linux/arm64 -t <image> .   # multi-arch
```
⚠ Common error: `docker build -t name . no-cache` puts `no-cache` AFTER the build context `.`
and fails. `--no-cache` is a build flag — place it before the final `.` argument.

## Images
```bash
docker images                  # list local images
docker rmi <image_name|id>     # delete an image
docker image prune             # remove dangling (untagged) images only
docker image prune -a          # ⚠ add -a to also remove all unused images (not just dangling)
docker search <term>           # search Docker Hub
docker pull <image_name>       # pull from registry
docker push <user>/<image>     # publish to Docker Hub (must be logged in)
docker login -u <user>         # authenticate to a registry
```

## Run containers
```bash
docker run <image>                              # create + run (random name)
docker run --name <cname> <image>               # with a custom name
docker run -d <image>                           # detached (background)
docker run --rm <image>                         # ⚠ auto-remove container when it exits (very common)
docker run -p <host>:<container> <image>        # publish a port (e.g. -p 8080:80)
docker run -v <host>:<container> <image>        # mount a volume
docker run -e KEY=val <image>                   # set an env var
docker run -it <image> sh                       # interactive + TTY, run shell
```

## Lifecycle
```bash
docker start <cname|id>        # start a stopped container
docker stop  <cname|id>        # graceful stop
docker restart <cname|id>
docker rm <cname|id>           # remove a stopped container
docker rm -f <cname|id>        # force-remove a running container

# batch helpers (handy for cleanup)
docker stop $(docker ps -q)                       # stop all running
docker rm $(docker ps -a -q)                       # remove all containers
docker container prune                             # remove all stopped containers
```

## Inspect / debug
```bash
docker ps                       # running containers
docker ps -a                    # all containers (running + stopped)
docker logs -f <cname>          # follow logs (streaming)
docker inspect <cname|id>       # raw JSON config/state
docker container stats          # live CPU/mem/IO per container
docker exec -it <cname> sh      # shell inside a running container
# ⚠ some images lack `sh` (distroless/alpine variants) — try `bash` or `ash` instead
```

## Volumes & networks (often needed in real deploys)
```bash
docker volume ls
docker volume create <vname>
docker volume rm <vname>
docker network ls
docker network create <nname>
```

## Compose (the command you'll actually use most)
```bash
docker compose up -d           # build (if needed) + start all services in background
docker compose down            # stop + remove containers, networks (keeps volumes)
docker compose down -v         # also remove volumes
docker compose ps              # service status
docker compose logs -f <svc>   # follow a service's logs
```
Reference projects: https://github.com/docker/awesome-compose

## Daemon / host
⚠ `docker -d` is an OLD daemon flag and does NOT start the daemon on modern installs.
```bash
# Linux (systemd):
sudo systemctl start docker
sudo systemctl enable docker
docker info                     # system-wide info (confirms daemon is up)
docker --help                  # help; also: docker <subcommand> --help
```
On macOS/Windows use the **Docker Desktop** app (https://docs.docker.com/desktop) — there is no
`docker -d` there.

## Windows / MSYS pitfalls (bind-mount line endings, missing /app)
When building/running containers from a Windows checkout of a repo that contains shell scripts,
two common failures show up:

1. **CRLF in entrypoint / health probes** — copied scripts keep `\r\n` line endings inside the
   image. Bash then reports `$'\r': command not found` or `no such file or directory` for
   scripts that clearly exist.
   - Symptom in logs: `/hermeswebui_init.bash: line 5: syntax error near unexpected token '$'{\r''`
   - Symptom in health: `health_probe.sh: line 29: $'\\r': command not found`
   - Fix BEFORE building: `sed -i 's/\r$//' docker_init.bash` and `find scripts -type f \( -name '*.sh' -o -name '*.bash' \) -print0 | xargs -0 sed -i 's/\r$//'`
   - Rebuild with `docker compose build` after normalization.

2. **Empty `/app` after init** — some compose setups rsync/copy source into `/app` during init,
   but on constrained runtimes the copy can silently no-op. Container is "Up" but nothing listens.
   - Quick probe: `docker exec <svc> ls -la /app` — if empty while `/apptoo` has files, copy failed.
   - Workaround: `docker exec -u root <svc> bash -lc 'cp -a /apptoo/. /app/ && chown -R hermeswebui:hermeswebui /app'`
   - Then ensure venv + deps inside the runtime user:
     ```
     su -s /bin/bash -c "export UV_CACHE_DIR=/uv_cache && cd /app && uv venv venv" hermeswebui
     su -s /bin/bash -c "export UV_CACHE_DIR=/uv_cache && source /app/venv/bin/activate && uv pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org" hermeswebui
     touch /app/venv/.deps_installed
     ```
   - Common uv failure on first run: `failed to create directory /home/hermeswebui/.cache/uv: Permission denied`.
     Fix: `chown -R hermeswebui:hermeswebui /home/hermeswebui` or set `UV_CACHE_DIR=/uv_cache`.

3. **Background-first compose** — foreground `docker compose up -d` from this tool can return
   `exit -1` with "starts a long-lived server/watch process". Use `background=true` with
   `notify_on_complete=true`, then verify health in a follow-up `docker compose ps` / `logs`.

## Concepts (quick)
- **Image**: standalone, executable package — code + runtime + libs + settings.
- **Container**: runtime instance of an image; runs identically across hosts.
- **Docker Hub**: registry for sharing images — https://hub.docker.com
- Docs: https://docs.docker.com
