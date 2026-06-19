# Sovereign Deployment Skill

## Overview

This skill encapsulates the deployment logic for the **ESG GO Platform x ADK
v1.0** to prevent tool-overload and ensure a smooth, traceable rollout.

## Deployment Target

- **Cloud Provider**: Firebase App Hosting
- **Project ID**: `esg-sunshine`
- **Backend ID**: `esggo`
- **Primary Region**: `us-central1`

## Workflow (Proxy Strategy)

### 1. Verification

Before deployment, verify the build environment:

```bash
npm run lint
npm run build
```

### 2. Secret Management

Ensure `GEMINI_API_KEY` is synced to App Hosting secrets:

```bash
npx firebase-tools apphosting:secrets:set GEMINI_API_KEY --project esg-sunshine
```

### 3. Deployment Command

Execute the unified deployment:

```bash
npx firebase-tools deploy --only apphosting,firestore,storage,functions --project esg-sunshine
```

### 4. Post-Deployment Logic

- Fetch the public URI using `apphosting:backends:list`.
- Verify the SHA-256 integrity of the deployed assets.

## Advantages

- **No Freezing**: Reduces the number of interactive MCP tool calls by using
  well-defined, single-command operations.
- **Traceability**: All deployment steps are logged and follow the Sovereign OS
  5T principles.
- **Consistency**: ensures that environment variables in `apphosting.yaml` match
  the local state before push.
