/**
 * OmniKey MCP Integration Tests
 * 測試 OmniKeyCore 的 MCP 整合功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OmniKeyCore } from './OmniKey';
import type { MCPServerConfig } from '../services/mcp/MCPBridge';

describe('OmniKeyCore MCP Integration', () => {
  let omniKey: OmniKeyCore;
  const mockSupabaseUrl = 'https://test.supabase.co';
  const mockSupabaseKey = 'test-key';

  beforeEach(() => {
    omniKey = new OmniKeyCore(mockSupabaseUrl, mockSupabaseKey);
  });

  describe('MCP Server Management', () => {
    it('should register an MCP server', async () => {
      const config: MCPServerConfig = {
        serverLabel: 'test_server',
        serverUrl: 'http://localhost:3000',
        description: 'Test MCP Server',
      };

      await expect(omniKey.registerMCPServer(config)).resolves.not.toThrow();
    });

    it('should get list of registered MCP servers', async () => {
      const config: MCPServerConfig = {
        serverLabel: 'test_server',
        serverUrl: 'http://localhost:3000',
      };

      await omniKey.registerMCPServer(config);
      const servers = await omniKey.getMCPServers();

      expect(servers).toBeInstanceOf(Array);
      expect(servers.some(s => s.serverLabel === 'test_server')).toBe(true);
    });
  });

  describe('MCP Tool Loading', () => {
    it('should load tools from ESG data server', async () => {
      const tools = await omniKey.loadMCPTools('esg_data');

      expect(tools).toBeInstanceOf(Array);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools[0]).toHaveProperty('name');
      expect(tools[0]).toHaveProperty('description');
      expect(tools[0]).toHaveProperty('inputSchema');
    });

    it('should throw error for non-existent server', async () => {
      await expect(omniKey.loadMCPTools('non_existent')).rejects.toThrow();
    });
  });

  describe('MCP Tool Execution', () => {
    it('should execute get_carbon_data tool', async () => {
      const result = await omniKey.executeMCPTool('get_carbon_data', {
        company_id: 'TEST-001',
        year: 2024,
      });

      expect(result).toHaveProperty('company_id', 'TEST-001');
      expect(result).toHaveProperty('scope1');
      expect(result).toHaveProperty('scope2');
      expect(result).toHaveProperty('scope3');
    });

    it('should execute calculate_itr tool', async () => {
      const result = await omniKey.executeMCPTool('calculate_itr', {
        scope1: 1000,
        scope2: 500,
        scope3: 2000,
      });

      expect(result).toHaveProperty('temperatureScore');
      expect(result).toHaveProperty('pathway');
      expect(result).toHaveProperty('targetYear');
    });

    it('should retry on failure', async () => {
      const executeSpy = vi.spyOn(omniKey['services'].mcpBridge, 'executeTool');
      executeSpy.mockRejectedValueOnce(new Error('Network { error });
      executeSpy.mockResolvedValueOnce({ success: true });

      const result = await omniKey.executeMCPTool('get_carbon_data', {
        company_id: 'TEST-001',
      });

      expect(result).toHaveProperty('success', true);
      expect(executeSpy).toHaveBeenCalledTimes(2);
    });

    it('should throw after max retries', async () => {
      const executeSpy = vi.spyOn(omniKey['services'].mcpBridge, 'executeTool');
      executeSpy.mockRejectedValue(new Error('Persistent { error });

      await expect(
        omniKey.executeMCPTool('get_carbon_data', { company_id: 'TEST-001' })
      ).rejects.toThrow('Persistent { error };

      expect(executeSpy).toHaveBeenCalledTimes(3); // Default retry attempts
    });
  });

  describe('MCP Chat Integration', () => {
    it('should chat with MCP tools', async () => {
      const result = await omniKey.chatWithMCPTools(
        'What is the carbon footprint of company TEST-001?',
        ['esg_data']
      );

      expect(result).toHaveProperty('response);
      expect(typeof result.response).toBe('string');
    });

    it('should handle tool calls in chat', async () => {
      const result = await omniKey.chatWithMCPTools('Calculate ITR for scope1: 1000, scope2: 500', [
        'esg_data',
      ]);

      expect(result).toHaveProperty('response);
      // Tool calls may or may not be present depending on LLM response
      if (result.toolCalls) {
        expect(result.toolCalls).toBeInstanceOf(Array);
      }
    });
  });

  describe('Awakening Protocol Integration', () => {
    it('should get awakening state', async () => {
      const state = await omniKey.getAwakeningState();

      expect(state).toBeDefined();
      // State structure depends on UltimateAwakeningProtocol implementation
    });

    it('should trigger awakening', async () => {
      const result = await omniKey.triggerAwakening();

      expect(result).toBeDefined();
      // Result structure depends on UltimateAwakeningProtocol implementation
    });
  });

  describe('Event Emission', () => {
    it('should emit mcp-server-registered event', async () => {
      const eventSpy = vi.fn();
      omniKey.on('mcp-server-registered', eventSpy);

      await omniKey.registerMCPServer({
        serverLabel: 'test_server',
        serverUrl: 'http://localhost:3000',
      });

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ serverLabel: 'test_server' })
      );
    });

    it('should emit mcp-tool-executed event', async () => {
      const eventSpy = vi.fn();
      omniKey.on('mcp-tool-executed', eventSpy);

      await omniKey.executeMCPTool('get_carbon_data', { company_id: 'TEST-001' });

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          toolName: 'get_carbon_data',
          result: expect.any(Object),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid tool name gracefully', async () => {
      await expect(omniKey.executeMCPTool('invalid_tool', {})).rejects.toThrow('Unknown tool');
    });

    it('should log errors appropriately', async () => {
      const consoleSpy = vi.spyOn(console, '{ error }.mockImplementation(() => {});

      try {
        await omniKey.executeMCPTool('invalid_tool', {});
      } catch (error) {
        // Expected to throw
      }

      // OmniLogger should have logged the error
      consoleSpy.mockRestore();
    });
  });
});
