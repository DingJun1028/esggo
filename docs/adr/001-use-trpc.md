---
uuid: "e7458cbf-618f-42a8-ab43-fb4708143f42"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.508Z"
evidence: "docs\adr\001-use-trpc.md"
---
# ADR 001: Use tRPC for Type-Safe API Communication

## Status
Accepted

## Context
We need a robust, type-safe communication layer between the frontend (Next.js/React) and backend (Node.js) services. Options considered included REST with manual OpenAPI specs, GraphQL, gRPC, and tRPC.

## Decision
We chose tRPC because it provides:
- Full TypeScript end-to-end type safety without code generation.
- Minimal boilerplate compared to GraphQL.
- Seamless integration with Next.js API routes and React Query.
- Built-in support for subscriptions via WebSocket (if needed later).

## Consequences
### Positive
- Eliminates API contract mismatches between client and server.
- Reduces boilerplate for defining routes and types.
- Easy to adopt incrementally.

### Negative
- Requires both client and server to be TypeScript (already satisfied).
- Less suitable for polyglot environments; external consumers would need to generate clients from the OpenAPI facade (we can provide a thin OpenAPI wrapper if needed).

## Related Decisions
- ADR 002: Provide an OpenAPI facade for external integrations (pending).
