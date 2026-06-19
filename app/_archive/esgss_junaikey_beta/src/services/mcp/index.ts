/**
 * MCP Service Module
 *
 * Placeholder for Model Context Protocol interactions.
 * Currently, types are defined in src/types/mcp.ts.
 * Logic will be migrated here as needed.
 */

import { McpServer, McpRunActionOutput } from '../../types.js';

export class McpService {
  async connect(server: McpServer): Promise<boolean> {
    // Implementation pending
    return true;
  }
}

export const mcpService = new McpService();
