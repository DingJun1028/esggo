---
name: hindsight-docs
description: Hindsight: Agent Memory That Learns - documentation and integration guide
---

# Hindsight: Agent Memory That Learns

[Hindsight](https://hindsight.vectorize.io/) is a memory system for AI agents that learns from interactions. It provides persistent memory capabilities for Claude Code, Codex, and other agentic AI tools.

## Overview

Hindsight enables agents to:
- Store and retrieve contextual memories
- Learn from past interactions
- Maintain long-term context across sessions
- Improve performance over time

## Key Features

- **Vector-based memory retrieval** - Semantic search over stored memories
- **Multi-platform support** - Works with Claude Code, Codex, OpenCode, and more
- **REST API** - Programmatic access via Python, Node.js, or CLI
- **Cloud-backed storage** - Persistent memory across devices

## Installation

### Via pip (Bare Metal)

```bash
pip install hindsight
```

### Via Docker

```bash
docker run -it --rm vectorize/hindsight:latest
```

### For Claude Code Integration

```bash
pip install hindsight
hindsight-claude install
```

## Quick Start

### Initialize Memory Bank

```bash
hindsight init
```

### Store a Memory

```bash
hindsight store --content "User prefers TypeScript over Python for frontend work" --tags preference,typescript
```

### Query Memories

```bash
hindsight query --question "What are the user's coding preferences?"
```

## API Usage

### Python SDK

```python
from hindsight import HindsightClient

client = HindsightClient(api_key="your-api-key")

# Store memory
client.store(
    content="User's project uses FastAPI backend",
    tags=["project", "fastapi"]
)

# Retrieve relevant memories
memories = client.query("What backend framework does the user use?")
```

### REST API

```bash
curl -X POST https://api.hindsight.vectorize.io/v1/memories \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content": "Your memory content", "tags": ["tag1", "tag2"]}'
```

## Integration with Other Agents

### With Claude Code
Hindsight integrates via hooks that capture session start, user prompts, and responses.

### With OpenCode
Similar hook-based integration for persistent memory.

### Custom Integration
Use the REST API or Python SDK to build custom memory-retrieval logic.

## Documentation

- **Main docs**: https://hindsight.vectorize.io/
- **API Reference**: https://hindsight.vectorize.io/api-reference
- **Python SDK**: https://hindsight.vectorize.io/sdks/python
- **CLI**: https://hindsight.vectorize.io/sdks/cli

## Troubleshooting

### Connection Issues
- Verify API key is valid
- Check network connectivity to api.hindsight.vectorize.io
- Ensure rate limits haven't been exceeded

### Memory Not Found
- Try rephrasing your query
- Check if memory was stored with correct tags
- Verify the memory bank is initialized

## Related Tools

- Hermes Agent: https://github.com/NousResearch/hermes-agent
- Claude Code: https://docs.anthropic.com/en/docs/claude-code
- OpenAI Codex CLI: https://github.com/openai/codex
