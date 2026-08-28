# Docker Network Split Patterns

## Pattern 1: --force-recreate without full network alignment
Symptom: 502 Bad Gateway, "No address associated with hostname"
Cause: Some containers on `*-dev` network, others on `docker_*` network
Fix: `docker compose up -d --build --force-recreate`

## Pattern 2: Missing compose env vars
Symptom: Volume mounts resolve to wrong paths, services can't find config
Cause: `.env` file missing vars that compose file references with `${VAR}`
Fix: Create `.env.local` with only missing vars

## Pattern 3: Docker daemon crash recovery
Symptom: All containers restart fresh with default networks
Cause: `com.docker.service` stopped unexpectedly
Fix: Restart Docker Desktop, recreate all containers

## Pattern 4: DNS alias loss
Symptom: Container-to-container DNS fails but container-to-IP works
Cause: Container rebuilt without network alias annotation
Fix: Verify `docker inspect <container> --format '{{...Aliases}}'` is non-empty
