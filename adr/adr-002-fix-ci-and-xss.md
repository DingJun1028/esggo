# ADR-002: Fix XSS in Intelligence Report & CI Pipeline Package Manager

## Status
Accepted

## Context
The application was found to have a Cross-Site Scripting (XSS) vulnerability in `app/intelligence/page.tsx` where AI-generated content (`generatedReport`) was directly injected into the DOM via `dangerouslySetInnerHTML`.
Simultaneously, the CI build was failing due to a mix of `npm` and `pnpm` being used in the `Dockerfile` and `.github/workflows/ci.yml`. The project mandates `pnpm` as the sole package manager.

## Decision
1. We will use the `xss` library to sanitize all HTML injected into `dangerouslySetInnerHTML`.
2. We will strictly enforce `pnpm` usage across `Dockerfile` and GitHub action workflows by replacing `npm install` and `npm ci` with the respective `pnpm` equivalents.

## Consequences
- **Positive:** System is protected from XSS. The CI build now uses a consistent package manager and builds reliably.
- **Negative:** None.
