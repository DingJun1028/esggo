# AI Station — VPS deployment (esggo family)

## Image
Already pushed to Docker Hub (built by CI, not the local daemon):
`docker.io/dingjunhong1028/aistation:latest` (digest visible via
`https://hub.docker.com/v2/repositories/dingjunhong1028/aistation/tags`).

## Local daemon is usually down
On the Windows dev box the Docker **daemon won't start** ("Docker Desktop is
unable to start"). So you cannot `docker build`/`push` locally. Two paths:

1. **CI publish (preferred, no daemon needed):** set repo Secrets
   `DOCKERHUB_USERNAME` + `DOCKERHUB_TOKEN` (a Docker Hub Personal Access Token
   with Read/Write; generated at hub.docker.com -> Account Settings -> Security ->
   New Access Token). Then `gh workflow run build.yml --ref main` builds AND
   pushes server-side. The workflow only pushes when `DOCKERHUB_USERNAME` is
   non-empty; buildx/build steps are `continue-on-error` so a transient
   registry blip can't fail the test-gated CI.
   - Set secrets WITHOUT echoing the token into chat/history:
     `gh secret set DOCKERHUB_USERNAME -b "dingjunhong1028"`
     `gh secret set DOCKERHUB_TOKEN -b "dckr_pat_..."`  (typed at the masked prompt)

2. **Local build (only if daemon comes up):** `docker login -u dingjunhong1028`
   (paste PAT at the password prompt), `docker build -t dingjunhong1028/aistation:latest .`,
   `docker push dingjunhong1028/aistation:latest`.

## VPS deployment artifacts (in repo `deploy/`)
- `deploy/docker-compose.yml` — pulls the image, binds `127.0.0.1:8000`, mounts
  `./storage`, healthcheck on `/api/health`, env from a server-side `.env`
  (gitignored: `deploy/.env`). All cloud keys optional.
- `deploy/nginx/aistation.esggo.co.conf` — reverse proxy `127.0.0.1:8000`,
  `X-Forwarded-*` + WebSocket upgrade headers, HTTP block + commented HTTPS
  (certbot) block. Swap server_name for the real subdomain.
- `deploy/deploy.sh USER@HOST [DOMAIN]` — rsyncs `deploy/`, `docker compose pull
  && up -d`, installs the nginx site, reloads nginx, hits `/api/health`.
  Does NOT transmit secrets (only the compose + nginx files).

## SSH access constraint (session state — may change)
This dev machine's `~/.ssh/id_rsa_esggo` / `id_rsa_esggo_new` were **rejected**
(`Permission denied (publickey)`) for `deploy`/`ubuntu`/`root` @ `161.118.252.147`
and `161.118.248.180` (both in `known_hosts`). To deploy, the user must add this
host's pubkey (`id_rsa_esggo.pub`) to the VPS `~/.ssh/authorized_keys`, or supply
a working key. Do NOT solicit the server password.

## Bring-up checklist on the VPS
1. `docker` + `docker compose` plugin + `nginx` installed.
2. DNS A/AAAA for the subdomain -> VPS IP.
3. `deploy/deploy.sh deploy@<IP> aistation.esggo.co`
4. `sudo certbot --nginx -d aistation.esggo.co` for HTTPS.
5. Verify: `curl -fsS http://127.0.0.1:8000/api/health`.
