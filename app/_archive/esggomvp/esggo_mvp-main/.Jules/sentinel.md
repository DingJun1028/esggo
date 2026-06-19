## 2024-05-30 - [Hardcoded NCB API Token in Service Configuration]
**Vulnerability:** Found a hardcoded fallback API token (`ncb_49ca437e9c8b4ffe...`) in `src/core/omni-ncb-service.ts` which was used as a fallback if the environment variable was missing.
**Learning:** Default fallbacks for service configuration variables often contain sensitive production or staging keys committed by accident during development or testing, creating critical leaks if the source code is compromised or public.
**Prevention:** Never use hardcoded keys as fallback values. Always configure the application to throw an error, fail safely, or use empty strings (`''`) to ensure environments explicitly inject valid keys.
