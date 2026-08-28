# MCP Server Failure: Placeholder Path (Session Transcript)

## Problem

The `my-server` MCP server (using `@modelcontextprotocol/server-filesystem`) was failing
because its configuration pointed to a placeholder directory path `/path/to/dir` that did
not exist on the system.

## Error Messages

From `~/.hermes/logs/mcp-stderr.log`:

```
===== [2026-07-23 10:58:39] starting MCP server 'my-server' =====
Warning: Cannot access directory C:\path\to\dir, skipping
Error: None of the specified directories are accessible

===== [2026-07-23 11:00:40] starting MCP server 'my-server' =====
Warning: Cannot access directory C:\path\to\dir, skipping
Error: None of the specified directories are accessible

===== [2026-07-23 11:03:42] starting MCP server 'my-server' =====
Warning: Cannot access directory C:\path\to\dir, skipping
Error: None of the specified directories are accessible
```

The server was repeatedly attempting to start, failing, and retrying.

## Root Cause

In `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  my-server:
    command: npx
    args:
      - -y
      - '@modelcontextprotocol/server-filesystem'
      - /path/to/dir          # ← placeholder, doesn't exist
```

## Fix Applied

1. Identified the failing server via `hermes mcp list` and `hermes mcp test my-server`
2. Checked `mcp-stderr.log` for the specific error
3. Updated the config using `hermes config set mcp_servers.my-server.args.2 /c/Project/esggo-learning-center`
   - Note: initial attempt with `args[2]` created a duplicate key; corrected to dot notation `args.2`
4. Discovered that `/c/...` (MSYS path) was misinterpreted as `C:\c\...` by the server
5. Corrected to Windows-style path: `C:\Project\esggo-learning-center`
6. Verified with `hermes mcp test my-server` — connected successfully, 14 tools discovered

## Final Config

```yaml
mcp_servers:
  my-server:
    command: npx
    args:
      - -y
      - '@modelcontextprotocol/server-filesystem'
      - C:\Project\esggo-learning-center
```

## Verification

```
$ hermes mcp test my-server
Testing 'my-server'...
  Transport: stdio → npx
  Auth: none
  ✓ Connected (2187ms)
  ✓ Tools discovered: 14
```
