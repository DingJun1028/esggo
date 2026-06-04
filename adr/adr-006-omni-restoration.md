# ADR-006: Omni Restoration Protocol (萬能修復) Implementation

## Status
Accepted

## Context
The system required a robust automated self-healing protocol ("Omni Restoration") capable of detecting and correcting data drift, entropy increases (e.g. malformed characters), and unauthorized modifications across the integrity components. The underlying state machine enforces the 5T protocol (Traceable, Transparent, Tangible, Trackable, Trustworthy). To properly apply "Cause and Effect" (觀因循果) semantics to the data components (`IComponentCore`), we needed to standardize how the `evidence` property was modeled in specific agent layers and frontend hooks, shifting from a standalone string or array of varying types to a structured traceability trace.

## Decision
1. **Refactored `IComponentCore`**: In `lib/agents/qkp-healing-agent.ts` and `lib/hooks/useColorDropStream.ts`, we aligned the standalone implementations of `IComponentCore` with the "觀因循果修復版" requirements.
   - Replaced `evidence: string` with `evidence: { originCause: string; processTrace: string[]; finalEffect: string }`.
   - Updated hardcoded mock nodes to implement realistic simulation tags (e.g. `originCause: "QKP_HEALING_AGENT_DECOUPLED_EXECUTION"`, `finalEffect: "[ISO-14064-1] Zero-Hallucination Standard"`).
2. **Entropy Purification Engine**: Extended `EntropyForge.purify` inside `lib/agents/omni-agent-bus.ts` to actively sanitize the payload string.
   - Uses regex `/[^\x20-\x7E\u4E00-\u9FFF\u3000-\u303F\uFF00-\uFFEF]/g` to eliminate hidden malformed characters while preserving valid English characters, symbols, and Traditional/Simplified Chinese glyphs.
   - Enforces the `ISO-14064-1 Zero-Hallucination Standard` tag inside the resulting compressed payload.

## Consequences
- **Positive**:
  - Agent and frontend simulation logic accurately aligns with backend semantic expectations, enabling seamless `Omni Restoration` demonstrations.
  - The entropy purifier ensures dirty data input streams don't taint the internal HashLock logic.
  - 5T Integrity compliance ensures fully verified provenance of ESG reporting metrics.
- **Negative**:
  - The regex filter is strict. Valid characters not within the ASCII, general Chinese, or specified ranges could be accidentally scrubbed, though none are anticipated in our standard data ingest.
