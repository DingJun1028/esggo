# ?? OmniSpace Paperclip Adapter for OmniAgent
## v1.0 | #OmniSpace #OmniAgent #AgenticSovereignty

A Paperclip adapter that lets you run OmniAgent as a managed employee in an OmniSpace corporate structure.

OmniAgent is a full-featured AI agent by Nous Research with 30+ native tools, persistent memory, session persistence, 80+ skills, MCP support, and multi-provider model access.

---

### ?? Key Features
This adapter provides:
*   **8 inference providers** - Anthropic, OpenRouter, OpenAI, Nous, OpenAI Codex, ZAI, Kimi Coding, MiniMax
*   **Skills integration** - Scans both Paperclip-managed and OmniAgent-native skills (`~/.omniagent/skills/`), with sync/list/resolve APIs
*   **Structured transcript parsing** - Raw OmniAgent stdout is parsed into typed `TranscriptEntry` objects so Paperclip renders proper tool cards with status icons and expand/collapse
*   **Rich post-processing** - Converts OmniAgent ASCII banners, setext headings, and `+--+` table borders into clean GFM markdown
*   **Comment-driven wakes** - Agents wake to respond to issue comments, not just task assignments
*   **Auto model detection** - Reads `~/.omniagent/config.yaml` to pre-populate the UI with the user's configured model
*   **Session codec** - Structured validation and migration of session state across heartbeats
*   **Filesystem checkpoints** - Optional `--checkpoints` for rollback safety

---

### ?? OmniAgent Capabilities
| Feature | Claude Code | Codex | OmniAgent |
| :--- | :--- | :--- | :--- |
| **Persistent memory** | ? | ? | ? Remembers across sessions |
| **Native tools** | ~5 | ~5 | 30+ (terminal, file, web, browser, vision, git, etc.) |
| **Skills system** | ? | ? | ? 80+ loadable skills |
| **Session search** | ? | ? | ? FTS5 search over past conversations |
| **Sub-agent delegation** | ? | ? | ? Parallel sub-tasks |
| **MCP client** | ? | ? | ? Connect to any MCP server |

---

### ??? Quick Start
1. **Register the adapter** in your OmniSpace server (`lib/omni-space/adapter-registry.ts`):
   ```typescript
   import { adapterRegistry } from './adapter-registry';
   // Already registered by default as 'omniagent_local'
   ```

2. **Create an OmniAgent** in OmniSpace:
   In the UI or via API, create an agent with adapter type `omniagent_local`.

---
© 2026 ESG GO - OmniSpace Agentic Suite.
