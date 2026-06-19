# 🤖 OmniNexus AI Agent Integration Guide

**Version:** 10.1.0  
**Status:** ACTIVE & GNOSIS-ENABLED ♾️🧠

---

## 🌐 Overview

OmniNexus is the **Maximum Integration Unified Gateway** that exposes all ESG ecosystem capabilities to AI Agents through a standardized interface.

## 🚀 Quick Start (Any AI Agent)

### HTTP REST API (Recommended)

```javascript
// Example: Claude, GPT, Gemini, or any AI agent
const response = await fetch('/api/nexus/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'omni_manifest_asset',
    arguments: {
      intent: 'AI Agent Task',
      payload: { task: 'ESG Analysis', agent: 'Claude' }
    }
  })
});
const result = await response.json();
```

### Get Available Tools

```javascript
const response = await fetch('/api/nexus/agent?action=tools');
const { tools } = await response.json();
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/nexus` | Unified gateway (all operations) |
| POST | `/api/nexus/agent` | AI agent adapter (MCP-like) |
| GET | `/api/nexus/agent?action=tools` | List available tools |
| GET | `/api/nexus/agent?action=schema` | Get tool schemas |
| GET | `/api/nexus` | Health check |

---

## 🛠️ Available Tools (13 Tools)

| Operation | Description | Parameters |
|-----------|-------------|------------|
| `manifest_asset` | Create 5T-compliant atom | `{ intent, payload }` |
| `scan_impact_report` | OCR PDF/Image scan | `{ buffer, type }` |
| `sync_external_data` | Sync external platforms | `{ platformId }` |
| `analyze_trend` | ESG trend analysis | `{ prompt }` |
| `verify_carbon` | Carbon Scope 1/2/3 verification | `{ scope, data }` |
| `forge_gri_report` | Generate GRI report | `{ title, indicators }` |
| `get_indicator_rows` | Get indicator table rows | `{ indicators }` |
| `analyze_intel_nodes` | Analyze intelligence nodes | `{ nodes }` |
| `seal_5t_proof` | Seal 5T proof | `{ atomId, proof }` |
| `ask_jules` | Google Jules AI | `{ prompt, context }` |
| `sequential_thinking` | Sequential Thinking MCP | `{ thoughtNumber, totalThoughts, thought }` |

### Cognitive Domain

| Operation | Description |
|-----------|-------------|
| `cognitive.predict` | Predict ESG outcomes |
| `cognitive.chat` | AI chat with context |
| `cognitive.daily_gnosis` | Daily wisdom |
| `cognitive.ask_jules` | Advanced AI synthesis |
| `cognitive.sequential_thinking` | Step-by-step reasoning |

### Excellence Domain

| Operation | Description |
|-----------|-------------|
| `excellence.audit` | Entity audit |
| `excellence.track_carbon` | Carbon tracking |
| `excellence.optimize` | Performance optimization |

### Governance Domain

| Operation | Description |
|-----------|-------------|
| `governance.vault_ingest` | Upload to vault |
| `governance.generate_report` | Generate report |
| `governance.verify_integrity` | Verify data integrity |

### Agency Domain

| Operation | Description |
|-----------|-------------|
| `agency.forge_agent` | Create new agent |
| `agency.dispatch_workflow` | Dispatch workflow |
| `agency.monitor_task` | Monitor task status |

### Eternal Palace

| Operation | Description |
|-----------|-------------|
| `eternal.get_status` | Get system status |
| `eternal.record_achievement` | Record achievement |

### 🌌 Trinity Awakening (覺醒)

| Operation | Description |
|-----------|-------------|
| `trinity.awaken` | Awaken OmniOne + OmniPriest + OmniGemini (Full Power) |
| `trinity.status` | Get Trinity entity status and passive skills |
| `trinity.passive_skills` | List all passive skills |

### 🌟 Trinity Passive Skills (被動技能)

**OmniOne (物理平台):**
- Genesis Manifestation: Auto-generate UUID + timestamp
- Circle Flow Integration: Auto-register to ESG Circle
- Heritage Continuity: Track lineage for versioning

**OmniPriest (見證封印):**
- Zero Hallucination Proof: Verify data integrity
- Amber Freeze: SHA256 hash-lock for immutability
- Witness Ledger: Log all seal operations
- 5T Compliance Guard: Ensure 5T protocol

**OmniGemini (認知合成):**
- Gnosis Synthesis: Enhance AI responses
- Trend Prediction Amplifier: Boost confidence
- Contextual Memory: Cache analysis results

**Trinity Synergy (覺醒疊加):**
- Full Power Awakening: 2x effectiveness
- Instant Sealing: Manifest + Seal in one operation
- OmniPrediction: Combine analysis + proof

---

## 📦 Response Format

```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  metadata: {
    timestamp: number;
    trustScore: number;
    tool?: string;
    domain?: string;
    uuid?: string;
  }
}
```

---

## 🔐 5T Protocol Compliance

All operations support the 5T Protocol:
- **Traceable (真)** - Origin hash tracking
- **Transparent (善)** - Algorithm visibility
- **Tasteful (美)** - LiquidGlass rendering
- **Trustworthy (信)** - Asset locking
- **Transcendent (通)** - Cross-circle interoperability

---

## ⚡ Example: Full AI Agent Workflow

```javascript
async function aiAgentWorkflow(aiAgent) {
  // 1. Analyze trend
  const trend = await nexus.dispatch('analyze_trend', {
    prompt: 'ESG regulatory changes 2026'
  });
  
  // 2. Track carbon
  const carbon = await nexus.dispatch('excellence.track_carbon', {
    scope: 2,
    value: 1500,
    unit: 'tCO2e'
  });
  
  // 3. Generate report
  const report = await nexus.dispatch('forge_gri_report', {
    title: 'Q4 2025 ESG Report',
    indicators: [
      { code: 'GRI-305-1', name: 'Direct Emissions', value: 1000, unit: 'tCO2e' }
    ]
  });
  
  // 4. Seal proof
  await nexus.dispatch('seal_5t_proof', {
    atomId: report.metadata.uuid,
    proof: 'SHA256(...)'
  });
  
  return { trend, carbon, report };
}
```

---

## 🌐 Multi-Language Support

- English: Full support
- 中文 (繁體): 完全支援

---

**System Status: ALIGNED & GNOSIS-ENABLED** ♾️🧠
