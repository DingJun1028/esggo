/**
 * Omni Awakening MCP Server
 *
 * Exposes the ESGss JunAiKey system's awakening capabilities via the Model Context Protocol.
 *
 * Protocol: JSON-RPC 2.0 over Stdio
 */

import { getUltimateAwakeningProtocol } from '../../src/omni/protocols/UltimateAwakeningProtocol.ts';
import { AwakeningBroadcaster } from '../../src/omni/infrastructure/broadcast/AwakeningBroadcaster.ts';
import { EvidenceVault } from '../../src/services/EvidenceVault.ts';
import { omniLogger, LogCategory } from '../../src/omni/infrastructure/logging/OmniLogger.ts';
import { agentService } from '../../src/services/agentService.ts';
import { bidirectionalSyncService } from '../../src/services/bidirectionalSync.ts';
import { evolutionEngine } from '../../src/omni/services/OmniEvolutionEngine.ts';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AvatarPersona } from '../../src/types/agency.ts';

// MCP requires stdout to be reserved for JSON-RPC messages only.
// Redirect console.log to stderr so application logs don't corrupt the protocol.
const originalLog = console.log;
console.log = console.error;

// MCP Types (Simplified for standalone implementation without SDK)
interface MCPRequest {
    jsonrpc: '2.0';
    id?: string | number; // Optional for notifications
    method: string;
    params?: any;
}

interface MCPResponse {
    jsonrpc: '2.0';
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

interface MCPNotification {
    jsonrpc: '2.0';
    method: string;
    params?: any;
}

interface Tool {
    name: string;
    description: string;
    inputSchema: any;
}

interface ServerOptions {
    transport: 'stdio' | 'http';
    port?: number;
}

export class OmniAwakeningServer {
    private tools: Tool[] = [
        {
            name: 'get_awakening_state',
            description: 'Get the current status of the Ultimate Awakening Protocol',
            inputSchema: { type: 'object', properties: {} },
        },
        {
            name: 'trigger_awakening',
            description: 'Execute the Ultimate Awakening Protocol sequence',
            inputSchema: { type: 'object', properties: {} },
        },
        {
            name: 'broadcast_insight',
            description: 'Broadcast a spiritual or data insight to the system',
            inputSchema: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    message: { type: 'string' },
                    category: {
                        type: 'string',
                        enum: ['awakening', 'enlightenment', 'self-reliance', 'altruism', 'truth'],
                    },
                },
                required: ['title', 'message'],
            },
        },
        {
            name: 'search_evidence',
            description: 'Search for evidence in the Vault to support truth',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string' },
                },
                required: ['query'],
            },
        },
        {
            name: 'get_ultimate_awakening_codex',
            description: 'List all Omni Awakening related items (Skills, Protocols, Rituals, Services)',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },

        {
            name: 'get_esg_components',
            description: 'Get current ESG system components (Souls, Bridges) and their health status',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },
        {
            name: 'enable_auto_evolution',
            description: 'Start the Omni-Evolution Daemon to auto-evolve agents based on ESG confidence',
            inputSchema: {
                type: 'object',
                properties: {
                    intervalMs: {
                        type: 'number',
                        description: 'Check interval in milliseconds (default: 30000)',
                    },
                },
            },
        },
        {
            name: 'disable_auto_evolution',
            description: 'Stop the Omni-Evolution Daemon',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },
        {
            name: 'get_evolution_status',
            description: 'Get status of the Omni-Evolution Daemon',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },
        {
            name: 'grant_agent_experience',
            description: 'Grant experience points to an agent, potentially causing a level up',
            inputSchema: {
                type: 'object',
                properties: {
                    agentId: { type: 'string' },
                    amount: { type: 'number' },
                },
                required: ['agentId', 'amount'],
            },
        },
        {
            name: 'assign_agent_persona',
            description: 'Assign a new persona (avatar) to an agent',
            inputSchema: {
                type: 'object',
                properties: {
                    agentId: { type: 'string' },
                    persona: {
                        type: 'string',
                        enum: Object.values(AvatarPersona),
                    },
                },
                required: ['agentId', 'persona'],
            },
        },
        {
            name: 'get_chain_status',
            description: 'Get current blockchain status (height, mempool, latest hash)',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },
        {
            name: 'verify_proof',
            description: 'Verify if a transaction hash is anchored in the blockchain',
            inputSchema: {
                type: 'object',
                properties: {
                    hash: { type: 'string' },
                },
                required: ['hash'],
            },
        },
        {
            name: 'generate_esg_report',
            description: 'Generate an Omni ESG Report from verified truth claims',
            inputSchema: {
                type: 'object',
                properties: {
                    format: {
                        type: 'string',
                        enum: ['json', 'text'],
                        description: 'Output format (default: json)',
                    },
                },
            },
        },
    ];

    private options: ServerOptions;
    private sseClients: Set<Response> = new Set();

    constructor(options: ServerOptions = { transport: 'stdio' }) {
        this.options = options;

        if (this.options.transport === 'http') {
            this.setupHttpServer();
        } else {
            this.setupStdio();
        }

        omniLogger.info(
            LogCategory.SYSTEM,
            `Omni Awakening MCP Server Initialized [Transport: ${this.options.transport}]`
        );

        // Hook into broadcasters to forward notifications to clients
        // checks broadcast instance - ideally we subscribe to it
        // For now, we manually assume broadcast_insight tool triggers this,
        // but real backend events should also trigger notifications.
    }

    private setupStdio() {
        process.stdin.setEncoding('utf8');
        let buffer = '';

        process.stdin.on('data', chunk => {
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
                    this.handleMessage(line, response => {
                        process.stdout.write(JSON.stringify(response) + '\n');
                    });
                }
            }
        });
    }

    private setupHttpServer() {
        const app = express();
        const port = this.options.port || 3000;

        app.use(cors());
        app.use(bodyParser.json());

        // SSE Endpoint
        app.get('/sse', (req, res) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            this.sseClients.add(res);

            const initialNotify: MCPNotification = {
                jsonrpc: '2.0',
                method: 'notifications/initialized',
            };
            res.write(`data: ${JSON.stringify(initialNotify)}\n\n`);

            req.on('close', () => {
                this.sseClients.delete(res);
            });
        });

        // JSON-RPC Endpoint
        app.post('/messages', async (req, res) => {
            const request: MCPRequest = req.body;

            // Handle batch? MCP spec implies single for now usually
            await this.processRequest(request, response => {
                res.json(response);
            });
        });

        app.listen(port, () => {
            omniLogger.info(LogCategory.SYSTEM, `MCP HTTP Server listening on port ${port}`);
        });
    }

    private async handleMessage(message: string, sendResponse: (res: MCPResponse) => void) {
        try {
            const request: MCPRequest = JSON.parse(message);

            // Basic validation
            if (request.jsonrpc !== '2.0' || !request.method) {
                return; // Ignore invalid messages
            }

            await this.processRequest(request, sendResponse);
        } catch (error: any) {
            sendResponse({
                jsonrpc: '2.0',
                id: 0,
                error: { code: -32700, message: 'Parse error', data: error.message },
            });
            omniLogger.error(LogCategory.SYSTEM, 'MCP Parse Error', { error: error.message });
        }
    }

    private async processRequest(request: MCPRequest, sendResponse: (res: MCPResponse) => void) {
        const { id, method, params } = request;

        try {
            switch (method) {
                case 'initialize':
                    if (id !== undefined) {
                        sendResponse({
                            jsonrpc: '2.0',
                            id,
                            result: {
                                protocolVersion: '0.1.0',
                                serverInfo: {
                                    name: 'OmniAwakeningServer',
                                    version: '1.0.0',
                                },
                                capabilities: {
                                    tools: {},
                                },
                            },
                        });
                    }
                    break;

                case 'tools/list':
                    if (id !== undefined) {
                        sendResponse({
                            jsonrpc: '2.0',
                            id,
                            result: {
                                tools: this.tools,
                            },
                        });
                    }
                    break;

                case 'tools/call':
                    if (id !== undefined) {
                        await this.handleToolCall(id, params, sendResponse);
                    }
                    break;

                case 'notifications/initialized':
                    // Client initialized
                    break;

                default:
                    // console.error to not pollute stdout if stdio
                    omniLogger.warn(LogCategory.SYSTEM, `Method not found: ${method}`);
                    if (id !== undefined) {
                        sendResponse({
                            jsonrpc: '2.0',
                            id,
                            error: { code: -32601, message: 'Method not found' },
                        });
                    }
                    break;
            }
        } catch (error: any) {
            if (id !== undefined) {
                sendResponse({
                    jsonrpc: '2.0',
                    id,
                    error: { code: -32603, message: `Internal error: ${error.message}` },
                });
            }
        }
    }

    private async handleToolCall(
        id: string | number,
        params: any,
        sendResponse: (res: MCPResponse) => void
    ) {
        const { name, arguments: args } = params;

        try {
            let result: any;

            switch (name) {
                case 'enable_auto_evolution':
                    const interval = (args as any)?.intervalMs || 30000;
                    evolutionEngine.startAutoEvolutionDaemon(interval);
                    result = {
                        status: 'started',
                        message: `Omni-Evolution Daemon started with ${interval}ms interval.`,
                    };
                    break;

                case 'disable_auto_evolution':
                    evolutionEngine.stopAutoEvolutionDaemon();
                    result = {
                        status: 'stopped',
                        message: 'Omni-Evolution Daemon stopped.',
                    };
                    break;

                case 'get_evolution_status':
                    result = evolutionEngine.getDaemonStatus();
                    break;

                case 'get_awakening_state':
                    const protocol = getUltimateAwakeningProtocol();
                    result = protocol.getState();
                    break;

                case 'trigger_awakening':
                    const p = getUltimateAwakeningProtocol();
                    result = await p.executeAwakening();
                    break;

                case 'broadcast_insight':
                    const broadcaster = AwakeningBroadcaster.getInstance();
                    const insightData = {
                        category: (args.category as any) || 'awakening',
                        title: args.title,
                        message: args.message,
                        priority: 'high' as any,
                        actionable: false,
                    };

                    broadcaster.shareInsight(insightData);

                    // Broadcast to SSE clients as well
                    this.broadcastNotification('notifications/insight', insightData);

                    result = { status: 'broadcast_sent' };
                    break;

                case 'search_evidence':
                    const query = (args.query || '').toLowerCase();
                    const filenameMatches = EvidenceVault.search(query);
                    const allEvidence = EvidenceVault.getAllEvidence();
                    const otherMatches = allEvidence.filter(
                        e =>
                            e.id.toLowerCase().includes(query) ||
                            (e.witness && e.witness.toLowerCase().includes(query))
                    );

                    const uniqueIds = new Set(filenameMatches.map(e => e.id));
                    const combinedMatches = [...filenameMatches];

                    otherMatches.forEach(e => {
                        if (!uniqueIds.has(e.id)) {
                            combinedMatches.push(e);
                        }
                    });

                    result = { count: combinedMatches.length, matches: combinedMatches.slice(0, 5) };
                    break;

                case 'get_ultimate_awakening_codex':
                    result = {
                        title: '🌌 Ultimate Awakening Codex',
                        description:
                            'A comprehensive registry of all system components related to the Ultimate Awakening.',
                        categories: {
                            Protocols: [
                                {
                                    name: 'UltimateAwakeningProtocol',
                                    path: 'src/omni/protocols/UltimateAwakeningProtocol.ts',
                                    description: 'The core engine coordinating the comprehensive system awakening.',
                                },
                            ],
                            Skills: [
                                {
                                    name: 'AgentUnityUltimate',
                                    path: 'src/omni/skills/AgentUnityUltimate.ts',
                                    description: 'The Mythic+ skill representing the unity of all agents.',
                                },
                            ],
                            Services: [
                                {
                                    name: 'OmniAltruismEngine',
                                    path: 'src/omni/services/OmniAltruismEngine.ts',
                                    description: "Engine driving the system's altruistic behaviors.",
                                },
                                {
                                    name: 'OmniEsgManager',
                                    path: 'src/omni/services/OmniEsgManager.ts',
                                    description: 'Core manager for ESG metrics and compliance.',
                                },
                                {
                                    name: 'OmniTruthEngine',
                                    path: 'src/omni/services/OmniTruthEngine.ts',
                                    description: 'The source of truth verification.',
                                },
                            ],
                            Rituals: [
                                {
                                    name: 'EternalPalaceAwakening',
                                    path: 'src/omni/interaction/rituals/EternalPalaceAwakening.tsx',
                                    description: 'UI component for the Eternal Palace ritual.',
                                },
                                {
                                    name: 'UltimateAwakeningRitual',
                                    path: 'src/omni/interaction/rituals/UltimateAwakeningRitual.tsx',
                                    description: 'The interactive ritual interface.',
                                },
                            ],
                            Infrastructure: [
                                {
                                    name: 'AwakeningBroadcaster',
                                    path: 'src/omni/infrastructure/broadcast/AwakeningBroadcaster.ts',
                                    description: 'System-wide insights broadcaster.',
                                },
                                {
                                    name: 'AwakeningScheduler',
                                    path: 'src/omni/infrastructure/scheduler/AwakeningScheduler.ts',
                                    description: 'Manages timing for awakening events.',
                                },
                                {
                                    name: 'AwakeningStateManager',
                                    path: 'src/omni/infrastructure/state/AwakeningStateManager.ts',
                                    description: 'Manages the state transitions of awakening.',
                                },
                            ],
                        },
                    };
                    break;

                case 'get_esg_components':
                    const agents = await agentService.getAgents();
                    const syncHealth = bidirectionalSyncService.getSyncHealth();

                    const soulComponents = agents.map(a => ({
                        id: `soul_${a.id}`,
                        type: 'soul',
                        label: a.name,
                        status: a.agent_status,
                        level: a.level,
                        isAwakened: a.isAwakened,
                    }));

                    const bridgeComponents = (syncHealth.bridges || []).map((b: any) => ({
                        id: b.id,
                        type: 'sync_bridge',
                        label: b.id.replace('_bridge', '').replace('_', ' ↔ ').toUpperCase(),
                        status: b.status,
                        successRate: b.successRate,
                    }));

                    result = {
                        summary: {
                            total_components: soulComponents.length + bridgeComponents.length,
                            souls_active: soulComponents.length,
                            bridges_active: bridgeComponents.length,
                            system_health: 'OPTIMAL',
                        },
                        components: {
                            souls: soulComponents,
                            bridges: bridgeComponents,
                        },
                    };
                    break;

                case 'grant_agent_experience':
                    const { agentId: grantId, amount } = args;
                    if (!grantId || amount === undefined) throw new Error('Missing agentId or amount');
                    result = await agentService.grantExperience(grantId as string, Number(amount));
                    break;

                case 'assign_agent_persona':
                    const { agentId: assignId, persona } = args;
                    if (!assignId || !persona) throw new Error('Missing agentId or persona');

                    if (!Object.values(AvatarPersona).includes(persona as AvatarPersona)) {
                        throw new Error(
                            `Invalid persona: ${persona}. Must be one of: ${Object.values(AvatarPersona).join(', ')}`
                        );
                    }

                    result = await agentService.assignAvatar(assignId as string, persona as AvatarPersona);
                    break;

                case 'get_chain_status':
                    // Dynamic import to avoid circular dependency issues
                    const { blockchainAnchor } = await import('../../src/omni/services/BlockchainAnchorService.ts');
                    result = blockchainAnchor.getChainStatus();
                    break;

                case 'verify_proof':
                    const { hash } = args;
                    if (!hash) throw new Error('Missing hash argument');
                    const { blockchainAnchor: ba } = await import('../../src/omni/services/BlockchainAnchorService.ts');
                    result = ba.verifyTransaction(hash as string);
                    break;

                case 'generate_esg_report': {
                    const { reportGenerator } = await import('../../src/omni/services/OmniReportGenerator.ts');
                    const format = (args.format as 'json' | 'text') || 'json';
                    const report = await reportGenerator.generateReport(format);
                    // If JSON, parse it back to object so it nestles nicely in result
                    result = format === 'json' ? JSON.parse(report) : { text: report };
                    break;
                }

                default:
                    sendResponse({
                        jsonrpc: '2.0',
                        id,
                        error: { code: -32601, message: `Tool not found: ${name}` },
                    });
                    return;
            }

            sendResponse({
                jsonrpc: '2.0',
                id,
                result: {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                },
            });
        } catch (error: any) {
            sendResponse({
                jsonrpc: '2.0',
                id,
                error: { code: -32000, message: `Tool execution failed: ${error.message}` },
            });
        }
    }

    private broadcastNotification(method: string, params: any) {
        const notification: MCPNotification = {
            jsonrpc: '2.0',
            method,
            params,
        };
        const message = JSON.stringify(notification);

        // 1. Send to Stdio (if active)
        if (this.options.transport === 'stdio') {
            process.stdout.write(message + '\n');
        }

        // 2. Send to all SSE Clients
        if (this.sseClients.size > 0) {
            const sseData = `data: ${message}\n\n`;
            this.sseClients.forEach(client => {
                client.write(sseData);
            });
        }
    }
}

// Start the server if not in a test environment
if (!process.env.VITEST) {
    // Parse arguments simple manually
    const args = process.argv.slice(2);
    let transport: 'stdio' | 'http' = 'stdio';
    let port = parseInt(process.env.PORT || '3000', 10);

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const nextArg = args[i + 1];

        if (arg === '--transport' && nextArg) {
            transport = nextArg as any;
        }
        if (arg === '--port' && nextArg) {
            port = parseInt(nextArg, 10);
        }
    }

    new OmniAwakeningServer({ transport, port });
}
