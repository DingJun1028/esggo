# ??雓??? Google Cloud Run Deployment Guide

## Overview

This guide enables automated deployment from **GitHub** to **Google Cloud Run** using **Cloud Build**.

Architecture: **Unified Container** (Frontend built as static files, served by Express Backend).

## Prerequisites

1.  Google Cloud Project.

2.  Billing Enabled.

3.  APIs Enabled: `Cloud Build API`, `Cloud Run Admin API`, `Container Registry API`.

4.  GCloud CLI installed (optional, for manual trigger).

## Manual Setup Steps

### 1. Connect Repository

1.  Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers).

2.  Click **Create Trigger**.

3.  Source: **GitHub**.

4.  Event: **Push to a branch** (e.g., `main`).

5.  Configuration: **Cloud Build configuration file (yaml or json)**.

6.  Location: `cloudbuild.yaml` (Inline).

### 2. Set Permissions

Go to **IAM & Admin** and ensure the `Cloud Build Service Account` has:

- `Cloud Run Admin`

- `Service Account User`

### 3. Environment Variables (Secret Manager)

For production, store `GEMINI_API_KEY` and DB credentials in **Secret Manager** and reference them in `cloudbuild.yaml`:

```yaml
- '--set-secrets'

- 'GEMINI_API_KEY=projects/$PROJECT_ID/secrets/gemini-api-key/versions/latest'
```

## Local Test (Docker)

To verify the container works locally before pushing:

```bash

# Build

docker build -t esgss-local .



# Run

docker run -p 8080:8080 -e GEMINI_API_KEY=your_key esgss-local

```

Visit `http://localhost:8080` to see the App.

## Troubleshooting

- **502 Bad Gateway**: Check if `server.ts` is listening on `process.env.PORT` (Default 8080).

- **Static Files 404**: Verify `Dockerfile` copied `frontend/dist` to `backend/public`.

