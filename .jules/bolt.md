## 2026-08-08 - [Promise.any for connection endpoints]
**Learning:** Sequential network requests in loops can cause cascading timeout delays blocking the main thread when endpoints are unreachable.
**Action:** Use Promise.any to concurrently check all possible endpoints. The first one to connect resolves immediately, bypassing any remaining long-running connection timeouts.
