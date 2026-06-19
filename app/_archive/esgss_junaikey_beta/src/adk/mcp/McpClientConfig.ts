/**
 * MCP Client Configuration
 * =========================================
 * [?¬è³ª] å»ºç??‡å???MCP ä¼ºæ??¨ç???Ž¥å·¥å?
 * [EN] Factory for creating connections to external MCP servers.
 *
 * Provides environment-aware connection switching:
 * - Stdio for local dev
 * - SSE/StreamableHTTP for Cloud Run / GKE
 *
 * @version 1.0.0
 * @date 2026-02-19
 */

import type { StdioMcpConnection, HttpMcpConnection, DeploymentEnvironment } from './types';

// ?€?€?€ Environment Detection ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
/**
 * Detect the current deployment environment.
 */
export function detectEnvironment(): DeploymentEnvironment {
    // Cloud Run sets K_SERVICE
    if (typeof process !== 'undefined' && process.env?.K_SERVICE) {
        return 'cloud-run';
    }
    // GKE sets KUBERNETES_SERVICE_HOST
    if (typeof process !== 'undefined' && process.env?.KUBERNETES_SERVICE_HOST) {
        return 'gke';
    }
    // Vertex AI Agent Engine
    if (typeof process !== 'undefined' && process.env?.VERTEX_AI_AGENT_ENGINE) {
        return 'vertex-ai';
    }
    return 'local';
}

// ?€?€?€ Stdio Connection Factory ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
/**
 * Create a Stdio connection config for a local MCP server.
 *
 * @example
 * ```ts
 * const conn = createStdioConnection('npx', ['-y', '@modelcontextprotocol/server-filesystem', '/path']);
 * ```
 */
export function createStdioConnection(
    command: string,
    args: string[],
    env?: Record<string, string>,
    timeout = 5,
): StdioMcpConnection {
    return {
        type: 'stdio',
        command,
        args,
        env,
        timeout,
    };
}

// ?€?€?€ HTTP Connection Factory ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
/**
 * Create an SSE or StreamableHTTP connection config for a remote MCP server.
 *
 * @example
 * ```ts
 * const conn = createHttpConnection('https://mcp.example.com/mcp', { Authorization: 'Bearer token' });
 * ```
 */
export function createHttpConnection(
    url: string,
    headers?: Record<string, string>,
    type: 'sse' | 'streamable-http' = 'streamable-http',
    timeout = 30,
): HttpMcpConnection {
    return {
        type,
        url,
        headers,
        timeout,
    };
}

// ?€?€?€ Pre-configured Server Connections ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€

/**
 * Create a connection to the Omni MCP Server (self-hosted).
 * Automatically switches between Stdio (local) and HTTP (cloud).
 */
export function createOmniMcpConnection(): StdioMcpConnection | HttpMcpConnection {
    const env = detectEnvironment();

    if (env === 'local') {
        return createStdioConnection(
            'npx',
            ['tsx', 'src/adk/mcp/OmniMcpServer.ts'],
        );
    }

    // For cloud environments, connect via HTTP
    const mcpUrl = process.env?.MCP_SERVER_URL || 'http://localhost:8090/mcp';
    const authToken = process.env?.MCP_AUTH_TOKEN;

    return createHttpConnection(
        mcpUrl,
        authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    );
}

/**
 * Create a connection to the @modelcontextprotocol/server-filesystem.
 */
export function createFilesystemMcpConnection(
    allowedPath: string,
): StdioMcpConnection {
    return createStdioConnection(
        'npx',
        ['-y', '@modelcontextprotocol/server-filesystem', allowedPath],
    );
}

/**
 * Create a connection to the @modelcontextprotocol/server-google-maps.
 * Requires GOOGLE_MAPS_API_KEY environment variable.
 */
export function createGoogleMapsMcpConnection(): StdioMcpConnection {
    const apiKey = process.env?.GOOGLE_MAPS_API_KEY || '';
    return createStdioConnection(
        'npx',
        ['-y', '@modelcontextprotocol/server-google-maps'],
        { GOOGLE_MAPS_API_KEY: apiKey },
    );
}
