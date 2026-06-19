# 🤖 OmniNexus AI Agent FAQ

**Version:** 10.1.0

---

## ❓ General Questions

### Q1: What is OmniNexus?
OmniNexus is the **Maximum Integration Unified Gateway** that exposes all ESG ecosystem capabilities to AI Agents through a standardized HTTP API interface.

### Q2: Which AI agents can use OmniNexus?
**All AI agents** can use OmniNexus:
- Claude (Anthropic)
- GPT-4/GPT-4o (OpenAI)
- Gemini (Google)
- Grok (xAI)
- Any custom AI agent
- MCP-enabled agents

### Q3: Do I need to install any packages?
**No!** The REST API (`/api/nexus/agent`) requires no additional packages. Just use standard `fetch()`.

---

## 🔌 Connection Questions

### Q4: How do I connect my AI agent?
```javascript
// Simple REST call
const response = await fetch('https://your-domain.com/api/nexus/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tool: 'omni_get_status',
    arguments: {}
  })
});
```

### Q5: What is the base URL?
```
Production: https://your-domain.com/api/nexus/agent
Local:      http://localhost:3000/api/nexus/agent
```

### Q6: Is authentication required?
Currently open. Add API key validation in production if needed.

---

## 🛠️ Tool Questions

### Q7: How many tools are available?
**13 tools** covering:
- Asset management
- ESG analysis
- Carbon tracking
- Report generation
- AI reasoning

### Q8: Can I get a list of all tools?
```bash
GET /api/nexus/agent?action=tools
```

### Q9: What parameters does each tool need?
```bash
GET /api/nexus/agent?action=schema
```

---

## 💡 Usage Questions

### Q10: Example - Create an ESG asset?
```javascript
await fetch('/api/nexus/agent', {
  method: 'POST',
  body: JSON.stringify({
    tool: 'omni_manifest_asset',
    arguments: {
      intent: 'Carbon Reduction Achievement',
      payload: { reduction: '15%', year: 2025 }
    }
  })
});
```

### Q11: Example - Analyze ESG trends?
```javascript
await fetch('/api/nexus/agent', {
  method: 'POST',
  body: JSON.stringify({
    tool: 'omni_analyze_trend',
    arguments: {
      prompt: 'Predict ESG regulatory changes for 2026'
    }
  })
});
```

### Q12: Example - Track carbon emissions?
```javascript
await fetch('/api/nexus/agent', {
  method: 'POST',
  body: JSON.stringify({
    tool: 'omni_track_carbon',
    arguments: {
      scope: 2,
      value: 1500,
      unit: 'tCO2e'
    }
  })
});
```

---

## 🔧 Troubleshooting

### Q13: Getting "Unknown tool" error?
Check available tools:
```bash
GET /api/nexus/agent?action=tools
```

### Q14: Getting timeout errors?
Reduce payload size or use pagination for large data.

### Q15: Response format?
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"success\":true,\"data\":{...}}"
    }
  ]
}
```

---

## 🌍 Multi-Language

### Q16: Can I use Chinese prompts?
**Yes!** Full Chinese (繁體中文) support:
```javascript
{
  tool: 'omni_analyze_trend',
  arguments: { prompt: '分析2026年ESG市場趨勢' }
}
```

---

## 🔐 Security

### Q17: Is my data secure?
- 5T Protocol provides data integrity
- All operations are logged
- SHA256 proof sealing available

### Q18: Can I run locally?
Yes! Run `npm run dev` and use `http://localhost:3000/api/nexus/agent`

---

## 📊 Performance

### Q19: Is there rate limiting?
Not currently. Add via Upstash Redis if needed.

### Q20: Is caching supported?
Yes! OmniNexus uses Redis caching for repeated queries.

---

## 🤝 Support

### Q21: How to report issues?
Create an issue at: https://github.com/anomalyco/opencode/issues

### Q22: Where is documentation?
- Full Guide: `AI_AGENT_INTEGRATION_GUIDE.md`
- This FAQ: `AI_AGENT_FAQ.md`

---

**System Status: ALIGNED & GNOSIS-ENABLED** ♾️🧠
