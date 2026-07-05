# Architecture Decision Records (ADR)

## ADR-001: Event Sourcing for AI Model Routing
**Status**: Accepted
**Date**: 2025-07-05
**Context**: Need audit trail for AI model routing decisions in ESG compliance scenarios
**Decision**: Use Time-Rift Protocol (Event Sourcing) with SHA-256 hash locking
**Consequences**: Full traceability, time-travel debugging, shadow testing capability

## ADR-002: Zero-Trust Security Model
**Status**: Accepted
**Date**: 2025-07-05
**Context**: ESG data requires strict access control and tamper-proof audit trails
**Decision**: OAG (OmniAgentGateway) with Hash Lock + Object.freeze() + zero-hallucination verification
**Consequences**: Immutable evidence chains, compliance with ISO-14064-1/GRI standards

## ADR-003: Multi-Provider Model Discovery
**Status**: Accepted
**Date**: 2025-07-05
**Context**: Avoid vendor lock-in, ensure cost-effective model access
**Decision**: Dynamic discovery from OpenRouter, Groq, Hugging Face, NVIDIA with 30-min cache TTL
**Consequences**: Automatic failover, cost optimization, vendor diversity

## ADR-004: Shadow Testing Framework
**Status**: Accepted
**Date**: 2025-07-05
**Context**: Safe deployment of new models without production risk
**Decision**: Traffic splitting (5-15%) with automated metric comparison
**Consequences**: Zero-downtime model upgrades, automated promotion criteria

## ADR-005: Model Conversion Pipeline
**Status**: Accepted
**Date**: 2025-07-05
**Context**: Support multiple deployment targets (PyTorch, ONNX, TensorFlow.js)
**Decision**: PyTorch → ONNX → TensorFlow.js conversion with quantization support
**Consequences**: Cross-platform deployment, 3-5x inference speedup via quantization