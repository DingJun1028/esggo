---
description: Export Design to Code with Pencil MCP
---
This workflow describes how to use the Pencil MCP (Model Context Protocol) server to export production-ready code from Pencil designs.

### Prerequisites
1.  **Pencil Desktop App**: Must be launched and running.
2.  **Claude Code**: A terminal tool that supports MCP (accessible via `claude` command).

### Steps
1.  **Launch Pencil**: Open the Pencil desktop application.
2.  **Open Terminal**: Run `claude` in your project root.
3.  **Verify MCP**: Run `/mcp` inside the Claude Code CLI to ensure `pencil-mcp` is listed.
4.  **Visual Asset Generation**: Use the `generate_image` tool to create UI assets specified in the Pencil design.
5.  **Generate Code**: Use prompts to generate code from your active Pencil selections.

### Example Prompts
-   `Generate React/Tailwind/NextJS code from the selected frame`
-   `Update CSS based on the variables in the design`
-   `Create a React component based on the selected frame`
-   `Generate a high-fidelity image for the [Component Name] based on the Vibe Design`

### Troubleshooting
-   If Pencil MCP is not visible, restart the Pencil app, then restart the `claude` CLI.
