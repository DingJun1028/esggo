# AI Station — deploy + CI patterns (verified)

## Multi-arch image (amd64 + arm64) for Oracle Always-Free ARM

In `build.yml` `build` job, after `setup-buildx-action`:

```yaml
- name: Set up QEMU (for multi-arch arm64 builds on the amd64 runner)
  if: ${{ env.DOCKERHUB_USERNAME != '' }}
  uses: docker/setup-qemu-action@v3

- name: Build image (and push multi-arch when credentials exist)
  uses: docker/build-push-action@v6
  continue-on-error: true
  with:
    context: .
    push: ${{ env.DOCKERHUB_USERNAME != '' }}
    load: ${{ env.DOCKERHUB_USERNAME == '' }}
    platforms: >-
      ${{
        env.DOCKERHUB_USERNAME != '' &&
        'linux/amd64,linux/arm64'
        || 'linux/amd64'
      }}
    tags: >-
      ${{
        env.DOCKERHUB_USERNAME != '' &&
        format('{0}/aistation:latest', env.DOCKERHUB_USERNAME)
        || 'aistation:ci'
      }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

Verify on Docker Hub: tag `latest` `images[].architecture` should list `amd64` AND `arm64`.

## Gate a cloud job off build outputs (NOT `secrets` in `if:`)

`secrets` is ILLEGAL in a job-level `if:`. Use a build-job output instead:

```yaml
- name: Probe cloud secrets (gate output for next job)
  id: cloud_gate
  env:
    RUNWAY_API_KEY: ${{ secrets.RUNWAY_API_KEY }}
    ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
  run: |
    if [ -n "$RUNWAY_API_KEY" ] || [ -n "$ELEVENLABS_API_KEY" ]; then
      echo "ready=true" >> "$GITHUB_OUTPUT"
    else
      echo "ready=false" >> "$GITHUB_OUTPUT"
    fi

cloud-integration:
  needs: build
  if: ${{ needs.build.outputs.cloud_ready == 'true' }}
```

## `gh secret set` non-TTY trap

Non-interactive `gh secret set NAME` (no `-b`, no TTY) silently creates an EMPTY
secret and exits 0. Always use `gh secret set NAME -b "VALUE"` (hidden) or run
interactively. After a failed attempt, `gh secret list` then `gh secret delete NAME`
any empty entry before trusting the gate.

## Deploy to a fresh Oracle Always-Free ARM box

`deploy/deploy.sh ubuntu@<IP> aistation.esggo.co` bootstraps docker+nginx (idempotent),
rsync, `docker compose pull && up -d` (native arm64), enables nginx, health-checks.
Prereq: `~/.ssh/id_rsa_esggo.pub` in VPS `authorized_keys` (SSH currently denied).
