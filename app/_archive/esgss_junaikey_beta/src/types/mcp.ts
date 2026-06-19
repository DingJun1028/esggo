// ==================== MODEL CONTEXT PROTOCOL (MCP) ====================

export interface McpServer {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'connecting' | 'failed';
  transport: 'sse' | 'streamable_http' | 'stdio' | 'http';
  auth: 'none' | 'oauth';
  latency: number;
  tools: { name: string; description: string }[];
  documentationUrl?: string;
  activeConnections?: number;
  health?: {
    cpu: number;
    memory: number;
    errorRate: number;
  };
  metadata?: Record<string, any>;
}

export interface McpRunActionOutput {
  success: boolean;
  result: any;
  error: string | null;
}

/** MCP 工具執行上下文 */
export interface MCPToolExecutionContext {
  toolName: string;
  serverLabel: string;
  args: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

/** MCP 整合配置 */
export interface MCPIntegrationConfig {
  enabled: boolean;
  defaultServers: string[];
  timeout: number;
  retryAttempts: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/** MCP 工具結果 */
export interface MCPToolResult {
  toolName: string;
  result: any;
  error?: string;
  executionTime?: number;
}
