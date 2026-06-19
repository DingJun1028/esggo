/**
 * MCP Integration Tests
 * =========================================
 * [?¬è³ª] MCP ?´å?æ¨¡ç??„å–®?ƒæ¸¬è©?
 * [EN] Unit tests for the MCP integration module.
 *
 * @version 1.0.0
 * @date 2026-02-19
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { adkToMcpInputSchema, createMcpRegistration } from '../McpToolAdapter';
import { ExternalMcpRegistry } from '../ExternalMcpRegistry';
import { OmniMeceToolset } from '../OmniMeceToolset';
import { OmniMcpServer } from '../OmniMcpServer';

// ?€?€?€ McpToolAdapter Tests ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
describe('McpToolAdapter', () => {
    it('should convert a minimal ADK tool to MCP schema', () => {
        const mockTool = {
            name: 'test_tool',
            description: 'A test tool',
        };

        const schema = adkToMcpInputSchema(mockTool);

        expect(schema).toBeDefined();
        expect(schema.type).toBe('object');
        expect(schema.properties).toBeDefined();
    });

    it('should create MCP registration with handler', async () => {
        const mockTool = {
            name: 'mock_tool',
            description: 'Mock tool for testing',
            execute: async (args: Record<string, unknown>) => ({
                result: 'success',
                input: args,
            }),
        };

        const registration = createMcpRegistration(mockTool, { enable5TAudit: true });

        expect(registration.name).toBe('mock_tool');
        expect(registration.description).toBe('Mock tool for testing');
        expect(registration.handler).toBeInstanceOf(Function);

        const result = await registration.handler({ query: 'test' });
        expect(result.status).toBe('success');
        expect(result.auditTrail).toBeDefined();
        expect(result.auditTrail?.toolName).toBe('mock_tool');
    });

    it('should handle tool execution errors gracefully', async () => {
        const errorTool = {
            name: 'error_tool',
            description: 'Tool that throws',
            execute: async () => {
                throw new Error('Test error');
            },
        };

        const registration = createMcpRegistration(errorTool);
        const result = await registration.handler({});

        expect(result.status).toBe('error');
        expect((result.data as { error: string }).error).toBe('Test error');
    });

    it('should error when tool has no execute method', async () => {
        const noExecTool = {
            name: 'no_exec_tool',
            description: 'Tool without execute',
        };

        const registration = createMcpRegistration(noExecTool);
        const result = await registration.handler({});

        expect(result.status).toBe('error');
        expect((result.data as { error: string }).error).toContain('does not have an execute method');
    });
});

// ?€?€?€ ExternalMcpRegistry Tests ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
describe('ExternalMcpRegistry', () => {
    let registry: ExternalMcpRegistry;

    beforeEach(() => {
        registry = ExternalMcpRegistry.getInstance();
        registry.clear();
    });

    it('should register and retrieve an external server', () => {
        registry.register({
            id: 'test-server',
            name: 'Test MCP Server',
            connection: { type: 'stdio', command: 'echo', args: ['hello'] },
            enabled: true,
        });

        const server = registry.get('test-server');
        expect(server).toBeDefined();
        expect(server?.name).toBe('Test MCP Server');
    });

    it('should unregister a server', () => {
        registry.register({
            id: 'to-remove',
            name: 'Removable',
            connection: { type: 'stdio', command: 'echo', args: [] },
            enabled: true,
        });

        expect(registry.unregister('to-remove')).toBe(true);
        expect(registry.get('to-remove')).toBeUndefined();
    });

    it('should toggle enabled state', () => {
        registry.register({
            id: 'toggleable',
            name: 'Toggle Test',
            connection: { type: 'stdio', command: 'echo', args: [] },
            enabled: true,
        });

        registry.setEnabled('toggleable', false);
        expect(registry.listEnabled()).toHaveLength(0);
        expect(registry.listAll()).toHaveLength(1);

        registry.setEnabled('toggleable', true);
        expect(registry.listEnabled()).toHaveLength(1);
    });

    it('should generate MCPToolset configs', () => {
        registry.register({
            id: 'stdio-server',
            name: 'Stdio Server',
            connection: { type: 'stdio', command: 'npx', args: ['-y', 'test-server'] },
            toolFilter: ['read_file'],
            enabled: true,
        });
        registry.register({
            id: 'http-server',
            name: 'HTTP Server',
            connection: { type: 'sse', url: 'https://mcp.example.com/sse' },
            enabled: true,
        });

        const configs = registry.getMcpToolsetConfigs();
        expect(configs).toHaveLength(2);
        expect(configs[0].connectionParams.type).toBe('StdioConnectionParams');
        expect(configs[0].toolFilter).toEqual(['read_file']);
        expect(configs[1].connectionParams.type).toBe('SseConnectionParams');
    });

    it('should provide accurate summary', () => {
        registry.register({
            id: 'a',
            name: 'A',
            connection: { type: 'stdio', command: 'a', args: [] },
            enabled: true,
        });
        registry.register({
            id: 'b',
            name: 'B',
            connection: { type: 'stdio', command: 'b', args: [] },
            enabled: false,
        });

        const summary = registry.getSummary();
        expect(summary.total).toBe(2);
        expect(summary.enabled).toBe(1);
        expect(summary.disabled).toBe(1);
    });
});

// ?€?€?€ OmniMeceToolset Tests ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
describe('OmniMeceToolset', () => {
    it('should generate MCP registrations for all MECE descriptors', () => {
        const toolset = new OmniMeceToolset();
        const registrations = toolset.toMcpRegistrations();

        expect(registrations.length).toBeGreaterThan(0);
        for (const reg of registrations) {
            expect(reg.name).toBeTruthy();
            expect(reg.description).toBeTruthy();
            expect(reg.handler).toBeInstanceOf(Function);
        }
    });

    it('should return descriptors with correct categories', () => {
        const toolset = new OmniMeceToolset();
        const descriptors = toolset.getDescriptors();

        const categories = new Set(descriptors.map((d) => d.category));
        expect(categories.has('cognitive')).toBe(true);
        expect(categories.has('excellence')).toBe(true);
        expect(categories.has('governance')).toBe(true);
    });

    it('should handle service execution with degraded fallback', async () => {
        const toolset = new OmniMeceToolset();
        const registrations = toolset.toMcpRegistrations();
        const truthTool = registrations.find((r) => r.name === 'omni_truth_engine');

        expect(truthTool).toBeDefined();

        // Execute ??since actual service may not be importable in test context,
        // it should gracefully degrade
        const result = await truthTool!.handler({ query: 'test claim' });
        expect(result.status).toBeDefined();
        expect(result.auditTrail).toBeDefined();
    });
});

// ?€?€?€ OmniMcpServer Tests ?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€?€
describe('OmniMcpServer', () => {
    it('should be defined synchronously (deployment-ready)', () => {
        // This tests that OmniMcpServer can be instantiated without async
        const server = new OmniMcpServer();
        expect(server).toBeDefined();
    });

    it('should list all registered tools', () => {
        const server = new OmniMcpServer();
        const tools = server.listTools();

        expect(tools.length).toBeGreaterThan(0);
        for (const tool of tools) {
            expect(tool.name).toBeTruthy();
            expect(tool.description).toBeTruthy();
            expect(tool.inputSchema).toBeDefined();
        }
    });

    it('should return error for unknown tool call', async () => {
        const server = new OmniMcpServer();
        const result = await server.callTool('nonexistent_tool', {});

        expect(result.status).toBe('error');
        expect((result.data as { error: string }).error).toContain('not found');
    });

    it('should allow runtime tool registration', () => {
        const server = new OmniMcpServer();
        const initialCount = server.listTools().length;

        server.registerTool({
            name: 'custom_tool',
            description: 'Custom test tool',
            inputSchema: { type: 'object', properties: {} },
            handler: async () => ({ status: 'success' as const, data: 'ok' }),
        });

        expect(server.listTools().length).toBe(initialCount + 1);
    });

    it('should provide server info', () => {
        const server = new OmniMcpServer({ name: 'test-server', version: '0.1.0' });
        const info = server.getServerInfo();

        expect(info.name).toBe('test-server');
        expect(info.version).toBe('0.1.0');
        expect(info.toolCount).toBeGreaterThan(0);
    });
});
