---
name: esggo-omni-center-workspace
description: Manage esggo-omni-center sub-workspace.
---

# esggo-omni-center Workspace

## Trigger
Use when working with the esggo-omni-center sub-workspace, which has its own pnpm-lock.yaml and package.json separate from the root esggo repo.

## Key Facts
- Located at `esggo-omni-center/` on the `main` branch of DingJun1028/esggo
- Has its own `pnpm-lock.yaml` and `package.json`
- NOT present in the local C:\Project\esggo directory — must be fetched from GitHub
- Dependabot alerts for this workspace are reported against its own lockfile path

## Accessing the Workspace Remotely
```bash
curl -sL "https://raw.githubusercontent.com/DingJun1028/esggo/main/esggo-omni-center/pnpm-lock.yaml" -o esggo-omni-center-lock.yaml
curl -sL "https://raw.githubusercontent.com/DingJun1028/esggo/main/esggo-omni-center/package.json" -o esggo-omni-center-package.json
```

## Workspace Structure (from package.json)
- Direct dependencies: @esggo/* workspace packages, @google/genai, @grpc/*, @notionhq/*, @prisma/client, firebase, framer-motion, isomorphic-dompurify, jose, lucide-react, react, react-dom, react-markdown, uuid, xss, zod, etc.
- Direct devDependencies: next, postcss, eslint, typescript, vitest, turbo, etc.

## Dependabot Alerts for this Workspace
At triage time (2026-08-04), 39 open alerts across 11 packages, all npm ecosystem.

## Upgrading Dependencies
1. Check current versions in the remote lockfile
2. Apply upgrades via `pnpm update <package>@<version>` in the workspace
3. If transitive dep lock-in occurs, add overrides to `pnpm-workspace.yaml`
4. Run `pnpm install` to regenerate lockfile
5. Verify with `pnpm test` and `pnpm build`
6. Commit and push to a feature branch, create PR targeting `main`