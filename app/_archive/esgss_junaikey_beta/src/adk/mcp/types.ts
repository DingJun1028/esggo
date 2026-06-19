/**
 * MCP Integration Type Definitions
 * =========================================
 * [?¨Ë≥™] MCP ?îË≠∞?¥Â??ÑÊ†∏ÂøÉÈ??ãÂ?Áæ?
 * [EN] Core type definitions for MCP protocol integration.
 *
 * @version 1.0.0
 * @date 2026-02-19
 */

// ?Ä?Ä?Ä Connection Mode ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export type McpConnectionMode = 'stdio' | 'sse' | 'streamable-http';

// ?Ä?Ä?Ä Server Configuration ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export interface McpServerConfig {
    /** Server name for identification */
    readonly name: string;
    /** Server version */
    readonly version: string;
    /** Transport mode */
    readonly mode: McpConnectionMode;
    /** Port for HTTP-based transports */
    readonly port?: number;
    /** Host binding for HTTP-based transports */
    readonly host?: string;
    /** Enable 5T Protocol audit logging on every tool call */
    readonly enable5TAudit: boolean;
}

// ?Ä?Ä?Ä Tool Registration ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export interface McpToolRegistration {
    /** Tool name (MCP-compatible identifier) */
    readonly name: string;
    /** Human-readable description */
    readonly description: string;
    /** JSON Schema for input parameters */
    readonly inputSchema: Record<string, unknown>;
    /** The handler function to execute */
    readonly handler: (args: Record<string, unknown>) => Promise<McpToolResult>;
}

// ?Ä?Ä?Ä Tool Result ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export interface McpToolResult {
    /** Execution status */
    readonly status: 'success' | 'error';
    /** Serializable result data */
    readonly data: unknown;
    /** Optional 5T audit trail */
    readonly auditTrail?: FiveTAuditRecord;
}

// ?Ä?Ä?Ä 5T Audit Record ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export interface FiveTAuditRecord {
    readonly tangible: boolean;    // ?ØÊ???
    readonly traceable: boolean;   // ?ØÊ∫ØÊ∫?
    readonly trackable: boolean;   // ?ØËøΩËπ?
    readonly transparent: boolean; // ?ØÈ?ÁÆ?
    readonly trustworthy: boolean; // ‰∏çÂèØÁØ°Êîπ
    readonly timestamp: number;
    readonly toolName: string;
    readonly sourceOrigin: string;
}

// ?Ä?Ä?Ä External MCP Server Entry ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export interface ExternalMcpServerEntry {
    /** Unique identifier for this server */
    readonly id: string;
    /** Display name */
    readonly name: string;
    /** Connection parameters */
    readonly connection: StdioMcpConnection | HttpMcpConnection;
    /** Optional tool name filter */
    readonly toolFilter?: string[];
    /** Whether this server is active */
    enabled: boolean;
}

export interface StdioMcpConnection {
    readonly type: 'stdio';
    readonly command: string;
    readonly args: string[];
    readonly env?: Record<string, string>;
    readonly timeout?: number;
}

export interface HttpMcpConnection {
    readonly type: 'sse' | 'streamable-http';
    readonly url: string;
    readonly headers?: Record<string, string>;
    readonly timeout?: number;
}

// ?Ä?Ä?Ä MECE Service Tool Descriptor ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export interface MeceServiceToolDescriptor {
    /** Service category: cognitive | excellence | governance | agency | sovereign | guidance */
    readonly category: 'cognitive' | 'excellence' | 'governance' | 'agency' | 'sovereign' | 'guidance';
    /** Tool name */
    readonly toolName: string;
    /** Service description */
    readonly description: string;
    /** 5T compliance level */
    readonly fiveTLevel: 'tangible' | 'traceable' | 'trackable' | 'transparent' | 'trustworthy';
    /** Optional JSON Schema for input parameters. If omitted, defaults to { query: string, data?: object } */
    readonly inputSchema?: Record<string, unknown>;
}

// ?Ä?Ä?Ä Deployment Environment ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export type DeploymentEnvironment = 'local' | 'cloud-run' | 'gke' | 'vertex-ai';

export interface DeploymentConfig {
    readonly environment: DeploymentEnvironment;
    readonly mcpServerUrl?: string;
    readonly authToken?: string;
    readonly toolFilter?: string[];
    readonly timeout: number;
}
