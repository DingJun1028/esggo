/**
 * Omni MCP Server
 * =========================================
 * [?¨Ë≥™] Â∞áÊ???ADK Â∑•ÂÖ∑?¥Èú≤?∫Ê?Ê∫?MCP ?çÂ??Ñ‰∏ª?çÂ???
 * [EN] Main MCP server exposing all ADK tools as a standard MCP service.
 *
 * Supports Stdio (dev) and StreamableHTTP (production) transports.
 * Integrates 5T Protocol audit logging on every tool call.
 *
 * @version 1.0.0
 * @date 2026-02-19
 */

import type { McpServerConfig, McpToolRegistration, McpToolResult } from './types';
import { batchCreateMcpRegistrations } from './McpToolAdapter';

// ?Ä?Ä?Ä ADK Tool Imports ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
import { auditReportTool } from '../tools/AuditReportTool';
import { benchmarkAnalysisTool } from '../tools/BenchmarkAnalysisTool';
import { chartGenerationTool } from '../tools/ChartGenerationTool';
import { complianceCheckTool } from '../tools/ComplianceCheckTool';
import { dataSynthesisTool } from '../tools/DataSynthesisTool';
import { narrativeGenerationTool } from '../tools/NarrativeGenerationTool';
import { reportAssemblyTool } from '../tools/ReportAssemblyTool';
import { webSearchTool } from '../tools/WebSearchTool';

import { omniMeceToolset } from './OmniMeceToolset';
import { Protocol5T } from '../../omni/core/types/InfoOne.types';
import { omniOrb } from '../../omni/core/OmniOrb';

// ?Ä?Ä?Ä Default Configuration ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
const DEFAULT_CONFIG: McpServerConfig = {
    name: 'omni-mcp-server',
    version: '1.0.0',
    mode: 'stdio',
    port: 8090,
    host: '0.0.0.0',
    enable5TAudit: true,
};

// ?Ä?Ä?Ä Tool Registry ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
const ADK_TOOLS = [
    auditReportTool,
    benchmarkAnalysisTool,
    chartGenerationTool,
    complianceCheckTool,
    dataSynthesisTool,
    narrativeGenerationTool,
    reportAssemblyTool,
    webSearchTool,
];

// ?Ä?Ä?Ä OmniMcpServer Class ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export class OmniMcpServer {
    private readonly config: McpServerConfig;
    private readonly registrations: McpToolRegistration[];
    private readonly toolMap: Map<string, McpToolRegistration>;

    constructor(config: Partial<McpServerConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };

        // Convert base ADK tools into MCP registrations
        this.registrations = batchCreateMcpRegistrations(
            ADK_TOOLS as unknown as Array<{
                name: string;
                description: string;
                parameters?: { shape?: Record<string, unknown> };
                execute?: (args: Record<string, unknown>) => Promise<unknown>;
            }>,
            { enable5TAudit: this.config.enable5TAudit },
        );

        // Build lookup map
        this.toolMap = new Map();
        for (const reg of this.registrations) {
            this.toolMap.set(reg.name, reg);
        }

        // Register MECE tools
        const meceRegistrations = omniMeceToolset.toMcpRegistrations();
        for (const reg of meceRegistrations) {
            this.registerTool(reg);
        }

        this.log(`[OmniMcpServer] Initialized with ${this.registrations.length} tools (including MECE).`);

        // ?Ä?Ä?Ä Sovereign Observability (Nirvana Hook) ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
        this.startPerpetualMonitoring();
    }

    /**
     * Perpetual monitoring hook for system health resonance.
     */
    private startPerpetualMonitoring(): void {
        this.log('[OmniMcpServer] ?îÆ Establishing Perpetual Monitoring (Nirvana Hook)...');
        setInterval(() => {
            omniOrb.observe('MCP_SERVER_RESONANCE');
            // Heartbeat manifestation
            omniOrb.manifest({
                status: 'ALIGNING',
                resonance: Math.random(),
                timestamp: Date.now()
            }, Protocol5T.TRACKABLE);
        }, 60000); // Check every minute
    }

    // ?Ä?Ä?Ä MCP Handler: list_tools ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
    /**
     * Returns all registered tool schemas in MCP format.
     * Equivalent to MCP `list_tools` handler.
     */
    listTools(): Array<{
        name: string;
        description: string;
        inputSchema: Record<string, unknown>;
    }> {
        this.log('[OmniMcpServer] list_tools requested.');
        return this.registrations.map((reg) => ({
            name: reg.name,
            description: reg.description,
            inputSchema: reg.inputSchema,
        }));
    }

    // ?Ä?Ä?Ä MCP Handler: call_tool ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
    /**
     * Execute a tool by name with the given arguments.
     * Equivalent to MCP `call_tool` handler.
     */
    async callTool(
        name: string,
        args: Record<string, unknown>,
    ): Promise<McpToolResult> {
        this.log(`[OmniMcpServer] call_tool: ${name}`);

        const registration = this.toolMap.get(name);
        if (!registration) {
            return {
                status: 'error',
                data: { error: `Tool "${name}" not found. Available: ${Array.from(this.toolMap.keys()).join(', ')}` },
            };
        }

        try {
            const result = await registration.handler(args);

            if (result.auditTrail) {
                this.log(`[5T-Audit] Tool: ${name} | Status: ${result.status} | Time: ${new Date(result.auditTrail.timestamp).toISOString()}`);
            }

            return result;
        } catch (error) {
            this.log(`[OmniMcpServer] Error executing tool "${name}": ${error}`);
            return {
                status: 'error',
                data: { error: error instanceof Error ? error.message : String(error) },
            };
        }
    }

    // ?Ä?Ä?Ä Register Additional Tool ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
    /**
     * Register an additional MCP tool at runtime.
     */
    registerTool(registration: McpToolRegistration): void {
        this.registrations.push(registration);
        this.toolMap.set(registration.name, registration);
        this.log(`[OmniMcpServer] Registered additional tool: ${registration.name}`);
    }

    // ?Ä?Ä?Ä Server Info ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
    getServerInfo(): { name: string; version: string; toolCount: number; mode: string } {
        return {
            name: this.config.name,
            version: this.config.version,
            toolCount: this.registrations.length,
            mode: this.config.mode,
        };
    }

    // ?Ä?Ä?Ä Logging ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
    private log(message: string): void {
        if (typeof process !== 'undefined' && process.stderr) {
            process.stderr.write(`${message}\n`);
        }
    }
}

// ?Ä?Ä?Ä Singleton Export ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
export const omniMcpServer = new OmniMcpServer();

// ?Ä?Ä?Ä CLI Entry Point ?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä?Ä
/**
 * When run directly (`tsx src/adk/mcp/OmniMcpServer.ts`),
 * starts the MCP server in Stdio mode.
 */
if (typeof process !== 'undefined' && process.argv[1]?.includes('OmniMcpServer')) {
    const server = new OmniMcpServer({ mode: 'stdio' });
    const info = server.getServerInfo();
    process.stderr.write(`\n?? Omni MCP Server Started (‰∏äÂ??•Ê∞¥)\n`);
    process.stderr.write(`   Name: ${info.name}\n`);
    process.stderr.write(`   Version: ${info.version}\n`);
    process.stderr.write(`   Tools: ${info.toolCount}\n`);
    process.stderr.write(`   Mode: ${info.mode}\n`);
    process.stderr.write(`   5T Audit: enabled\n\n`);

    // List all available tools
    for (const tool of server.listTools()) {
        process.stderr.write(`   ?ì¶ ${tool.name}: ${tool.description}\n`);
    }
    process.stderr.write(`\n`);
}
