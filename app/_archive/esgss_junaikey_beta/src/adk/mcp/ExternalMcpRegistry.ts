/**
 * External MCP Registry
 * =========================================
 * [?¬è³ª] å¤–éƒ¨ MCP ä¼ºæ??¨ç?çµ±ä?è¨»å??‡ç??½é€±æ?ç®¡ç?
 * [EN] Unified registry for external MCP servers with lifecycle management.
 *
 * @version 1.0.0
 * @date 2026-02-19
 */

import type { ExternalMcpServerEntry, StdioMcpConnection, HttpMcpConnection } from './types';

// ?€?€?€ External MCP Registry ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
export class ExternalMcpRegistry {
    private readonly servers: Map<string, ExternalMcpServerEntry> = new Map();
    private static instance: ExternalMcpRegistry;

    private constructor() { }

    static getInstance(): ExternalMcpRegistry {
        if (!ExternalMcpRegistry.instance) {
            ExternalMcpRegistry.instance = new ExternalMcpRegistry();
        }
        return ExternalMcpRegistry.instance;
    }

    // ?€?€?€ Register ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * Register an external MCP server.
     *
     * @example
     * ```ts
     * registry.register({
     *   id: 'filesystem',
     *   name: 'File System MCP',
     *   connection: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '/path'] },
     *   toolFilter: ['read_file', 'list_directory'],
     *   enabled: true,
     * });
     * ```
     */
    register(entry: ExternalMcpServerEntry): void {
        this.servers.set(entry.id, entry);
    }

    // ?€?€?€ Unregister ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * Remove a server from the registry.
     */
    unregister(id: string): boolean {
        return this.servers.delete(id);
    }

    // ?€?€?€ Get ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * Get a specific server entry by ID.
     */
    get(id: string): ExternalMcpServerEntry | undefined {
        return this.servers.get(id);
    }

    // ?€?€?€ List All ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * List all registered servers.
     */
    listAll(): ExternalMcpServerEntry[] {
        return Array.from(this.servers.values());
    }

    // ?€?€?€ List Enabled ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * List only enabled servers.
     */
    listEnabled(): ExternalMcpServerEntry[] {
        return this.listAll().filter((s) => s.enabled);
    }

    // ?€?€?€ Enable/Disable ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * Toggle a server's enabled state.
     */
    setEnabled(id: string, enabled: boolean): boolean {
        const server = this.servers.get(id);
        if (!server) return false;
        server.enabled = enabled;
        return true;
    }

    // ?€?€?€ Get MCPToolset Configs ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * Convert all enabled servers to MCPToolset-compatible configurations.
     * Returns arrays ready for use in LlmAgent's tools array.
     *
     * @example
     * ```ts
     * const toolsetConfigs = registry.getMcpToolsetConfigs();
     * const agent = new LlmAgent({
     *   tools: [...localTools, ...toolsetConfigs.map(c => new MCPToolset(c.connectionParams, c.toolFilter))],
     * });
     * ```
     */
    getMcpToolsetConfigs(): Array<{
        connectionParams: {
            type: 'StdioConnectionParams' | 'SseConnectionParams';
            serverParams?: { command: string; args: string[]; env?: Record<string, string> };
            url?: string;
            headers?: Record<string, string>;
        };
        toolFilter?: string[];
    }> {
        return this.listEnabled().map((entry) => {
            if (entry.connection.type === 'stdio') {
                const stdio = entry.connection as StdioMcpConnection;
                return {
                    connectionParams: {
                        type: 'StdioConnectionParams' as const,
                        serverParams: {
                            command: stdio.command,
                            args: stdio.args,
                            env: stdio.env,
                        },
                    },
                    toolFilter: entry.toolFilter,
                };
            }

            const http = entry.connection as HttpMcpConnection;
            return {
                connectionParams: {
                    type: 'SseConnectionParams' as const,
                    url: http.url,
                    headers: http.headers,
                },
                toolFilter: entry.toolFilter,
            };
        });
    }

    // ?€?€?€ Clear ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * Remove all registered servers.
     */
    clear(): void {
        this.servers.clear();
    }

    // ?€?€?€ Summary ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
    /**
     * Get a summary of the registry state.
     */
    getSummary(): { total: number; enabled: number; disabled: number } {
        const all = this.listAll();
        const enabled = all.filter((s) => s.enabled).length;
        return {
            total: all.length,
            enabled,
            disabled: all.length - enabled,
        };
    }
}

// ?€?€?€ Singleton Export ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
export const externalMcpRegistry = ExternalMcpRegistry.getInstance();
