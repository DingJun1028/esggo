# TypeScript Library Architecture for OA-Team 30

## Overview

The `@everworker/oneringai` TypeScript library implements the OA-Team 30 soul canon as a unified
agent framework. This reference documents the architecture, key design patterns, and mapping
to the Python/CrewAI implementation.

## Project Structure

```
oneringai/
├── src/
│   ├── index.ts              # Main entry point — re-exports all public APIs
│   ├── types/                # Core type definitions (Vendor, Services, AuthConfig)
│   ├── core/
│   │   ├── connector.ts      # Connector-First Authentication System
│   │   ├── agent.ts          # Agent class + ToolManager + ToolExecutionPipeline
│   │   └── fiveT-gate.ts     # 5T Protocol Verification Gate
│   ├── registry/
│   │   └── models.ts         # Model Registry v2 (92 text + media models)
│   ├── agents/
│   │   ├── matrix.ts         # 30-Agent Matrix + SwarmFactory + SwarmOrchestrator
│   │   ├── registry.ts       # AgentRegistry (global tracking, inspection)
│   │   └── orchestrator.ts   # AgentOrchestrator (multi-agent teams)
│   ├── agent-runtime/
│   │   ├── index.ts          # AgentRuntime class
│   │   └── codex/            # Optional Codex SDK driver
│   ├── memory/               # Entity/fact memory store
│   ├── tools/                # Built-in tools, developer tools, desktop tools
│   ├── audio/                # TTS/STT
│   ├── search/               # Web search providers
│   ├── mcp/                  # MCP client integration
│   └── utils/                # Crypto, logger, cache utilities
├── package.json              # Exports: ".", "./agent-runtime", "./agent-runtime/codex"
├── tsconfig.json             # moduleResolution: "bundler", target: "ES2022"
└── vitest.config.ts          # Test configuration
```

## Key Design Patterns

### 1. Connector-First Authentication

All vendors (OpenAI, Anthropic, Google, etc.) and external services (GitHub, Slack, etc.)
are accessed through named connectors. The `Connector` class wraps authentication, HTTP
client, and metrics tracking.

```typescript
import { Connector, Vendor } from '@everworker/oneringai';

Connector.create({
  name: 'openai-main',
  vendor: Vendor.OpenAI,
  auth: { type: 'api_key', apiKey: process.env.OPENAI_API_KEY! },
});

const agent = Agent.create({ connector: 'openai-main', model: 'gpt-5.6' });
```

### 2. 5T Protocol Verification

Every artifact produced by the swarm must pass the 5T verification gate:

- **Traceable**: `source_origin` field present
- **Trackable**: `lifecycle_hooks` array with at least one entry
- **Tangible**: `user_feedback` or `tangible_evidence` present
- **Transparent**: `logic_doc` present, no hallucination keywords
- **Trustworthy**: Artifact is JSON-serializable (enables Hash Lock)

```typescript
import { FiveTGate } from '@everworker/oneringai';

const gate = new FiveTGate();
const result = gate.execute({
  source_origin: 'oa-team/agent-runtime',
  lifecycle_hooks: ['init', 'run', 'verify'],
  user_feedback: 'Test passed',
  logic_doc: 'Agent executed via OneRingAI driver',
});

if (result.passed) {
  console.log(result.hash_lock); // sha256:...
}
```

### 3. Agent Runtime

The Agent Runtime provides a vendor-neutral layer for running complete agent systems:

```typescript
import { AgentRuntime, LocalExecutionBackend, OneRingAIDriver } from '@everworker/oneringai/agent-runtime';

const runtime = new AgentRuntime({
  backend: new LocalExecutionBackend({ drivers: [new OneRingAIDriver()] }),
});

const codingAgent = runtime.agent({
  id: 'coding-agent',
  driver: 'oneringai',
  connector: 'openai',
  model: 'gpt-5.6',
});

const session = await codingAgent.createSession();
const { runId, events } = await runtime.startRun(session.id, 'Write a React component');
```

### 4. 30-Agent Matrix

The `SWARM_SPEC` array in `src/agents/matrix.ts` defines all 30 agents from the soul canon,
organized into 5 squads:

- **Strategy** (01-06): Queen Bee, Planner, Analyst, Strategist, Risk, Optimizer
- **Tech** (07-12): Coder, Algorithm, Architect, Data, Tester, Designer
- **Creative** (13-18): Image, Animation, Copy, Audio, Market, Community
- **Marketing** (19-24): Growth, Ops, Biz Analyst, Explorer, Diplomat, Researcher
- **Guard** (25-30): Field Tester, Tracker, Security, Maintainer, Support, Quality

```typescript
import { SwarmFactory, SWARM_SPEC } from '@everworker/oneringai';

const factory = new SwarmFactory('openai');
const queenAgent = factory.createAgent(SWARM_SPEC[0]); // Queen Bee
```

### 5. Tool Manager & Execution Pipeline

Tools are managed through `ToolManager` with a pluggable execution pipeline:

```typescript
import { ToolManager, LoggingPlugin } from '@everworker/oneringai';

// Register a tool
agent.tools.register(myTool);

// Add pipeline plugins
agent.tools.executionPipeline.use(new LoggingPlugin());

// Execute with full pipeline
await agent.tools.execute('my_tool', { arg: 'value' });
```

## TypeScript-Specific Considerations

### Module Resolution

When using `moduleResolution: "bundler"` in tsconfig.json, all relative imports must use
`.js` extensions, even though the source files are `.ts`:

```typescript
// ✅ Correct
import { Agent } from './core/agent.js';

// ❌ Wrong — will fail at compile time
import { Agent } from './core/agent';
```

### Path Handling on Windows

When writing files from Hermes desktop, avoid mixing drive letter paths:
- Use `C:\Users\dingj\...` (native Windows backslashes)
- Or `C:/Users/dingj/...` (consistent forward slashes)
- Never mix `C:\c\` (Hermes virtual drive) with `C:\Users\` (real Windows paths)

### Package Exports

The `package.json` uses subpath exports for the Agent Runtime:

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./agent-runtime": { "types": "./dist/agent-runtime/index.d.ts", "import": "./dist/agent-runtime/index.js" },
    "./agent-runtime/codex": { "types": "./dist/agent-runtime/codex/index.d.ts", "import": "./dist/agent-runtime/codex/index.js" }
  }
}
```

This allows:
```typescript
import { Agent } from '@everworker/oneringai';
import { AgentRuntime } from '@everworker/oneringai/agent-runtime';
```

## Testing Strategy

Tests are written in Vitest and cover:
- Unit tests for each module (5T gate, connectors, model registry)
- Integration tests for agent creation and execution
- End-to-end tests for the full swarm workflow

```bash
# Run all tests
npx vitest run

# Run specific test file
npx vitest run tests/unit/fiveT-gate.test.ts

# Watch mode
npx vitest
```

## Python ↔ TypeScript Mapping

| Python Concept | TypeScript Equivalent | File |
|---|---|---|
| `crew.jsonc` + agents/ | `SWARM_SPEC` | `src/agents/matrix.ts` |
| `main_json.py` (load_crew) | `Agent.create()` | `src/core/agent.ts` |
| `main_python.py` | `Agent.run()` | `src/core/agent.ts` |
| `main_flows.py` | `SwarmOrchestrator` | `src/agents/orchestrator.ts` |
| `oa_5t_gate.py` | `FiveTGate` | `src/core/fiveT-gate.ts` |
| `oa_memory_bridge.py` | `AgentContextNextGen` plugins | `src/core/agent.ts` |
| `oa_webhook_verify.py` | `WebhookResult` + HMAC | `src/core/connector.ts` |
| `gen_agents.py` | `SwarmFactory.createAgent()` | `src/agents/matrix.ts` |
| `verify_level1.py` | Structure tests | `tests/unit/matrix.test.ts` |
| `verify_level3.py` | `SwarmFactory` tests | `tests/integration/swarm.test.ts` |
