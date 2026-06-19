/**
 * 🔮 OmniNexus MCP Server
 * ======================
 * Exposes OmniNexus to external AI Agents via Model Context Protocol
 * 
 * Usage:
 * 1. Install: npm install @modelcontextprotocol/sdk
 * 2. Run: npx tsx src/core/omni-nexus-mcp-server.ts
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { OmniNexus } from './omni-nexus';

const nexus = OmniNexus.getInstance({ enableCache: true });

const TOOLS = [
  {
    name: 'omni_manifest_asset',
    description: 'Create a 5T-compliant ESG atom with intent and payload',
    inputSchema: {
      type: 'object',
      properties: {
        intent: { type: 'string', description: 'Intent description' },
        payload: { type: 'object', description: 'Payload data' }
      },
      required: ['intent', 'payload']
    }
  },
  {
    name: 'omni_analyze_trend',
    description: 'Analyze ESG market trends using AI',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Trend analysis prompt' }
      },
      required: ['prompt']
    }
  },
  {
    name: 'omni_verify_carbon',
    description: 'Verify carbon emissions (Scope 1/2/3)',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'number', enum: [1, 2, 3], description: 'Carbon scope' },
        data: { type: 'object', description: 'Carbon data' }
      },
      required: ['scope', 'data']
    }
  },
  {
    name: 'omni_forge_gri_report',
    description: 'Generate a GRI-compliant ESG report',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Report title' },
        indicators: { type: 'array', description: 'ESG indicators' }
      },
      required: ['title', 'indicators']
    }
  },
  {
    name: 'omni_seal_5t_proof',
    description: 'Seal a 5T proof for an atom',
    inputSchema: {
      type: 'object',
      properties: {
        atomId: { type: 'string', description: 'Atom UUID' },
        proof: { type: 'string', description: 'Proof data' }
      },
      required: ['atomId', 'proof']
    }
  },
  {
    name: 'omni_ask_jules',
    description: 'Ask Google Jules AI for advanced reasoning',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Question/prompt' },
        context: { type: 'object', description: 'Context data' }
      },
      required: ['prompt']
    }
  },
  {
    name: 'omni_sequential_thinking',
    description: 'Use sequential thinking for complex problems',
    inputSchema: {
      type: 'object',
      properties: {
        thoughtNumber: { type: 'number', description: 'Current thought number' },
        totalThoughts: { type: 'number', description: 'Total thoughts' },
        thought: { type: 'string', description: 'Current thought' },
        nextThoughtNeeded: { type: 'boolean', description: 'Need next thought' }
      },
      required: ['thoughtNumber', 'totalThoughts', 'thought']
    }
  },
  {
    name: 'omni_track_carbon',
    description: 'Track carbon emissions data',
    inputSchema: {
      type: 'object',
      properties: {
        scope: { type: 'number', enum: [1, 2, 3] },
        value: { type: 'number', description: 'Emissions value' },
        unit: { type: 'string', description: 'Unit (tCO2e, kgCO2e)' }
      },
      required: ['scope', 'value', 'unit']
    }
  },
  {
    name: 'omni_cognitive_chat',
    description: 'Chat with AI about ESG topics',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'User message' },
        context: { type: 'object', description: 'Additional context' }
      },
      required: ['message']
    }
  },
  {
    name: 'omni_daily_gnosis',
    description: 'Get daily ESG wisdom/insight',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'omni_governance_verify',
    description: 'Verify data integrity',
    inputSchema: {
      type: 'object',
      properties: {
        proofId: { type: 'string', description: 'Proof ID to verify' }
      },
      required: ['proofId']
    }
  },
  {
    name: 'omni_forge_agent',
    description: 'Create a new ESG agent',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Agent name' },
        traits: { type: 'array', description: 'Agent traits' }
      },
      required: ['name', 'traits']
    }
  },
  {
    name: 'omni_get_status',
    description: 'Get system status',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

const OPERATION_MAP: Record<string, string> = {
  omni_manifest_asset: 'manifest_asset',
  omni_analyze_trend: 'analyze_trend',
  omni_verify_carbon: 'verify_carbon',
  omni_forge_gri_report: 'forge_gri_report',
  omni_seal_5t_proof: 'seal_5t_proof',
  omni_ask_jules: 'ask_jules',
  omni_sequential_thinking: 'sequential_thinking',
  omni_track_carbon: 'excellence.track_carbon',
  omni_cognitive_chat: 'cognitive.chat',
  omni_daily_gnosis: 'cognitive.daily_gnosis',
  omni_governance_verify: 'governance.verify_integrity',
  omni_forge_agent: 'agency.forge_agent',
  omni_get_status: 'eternal.get_status'
};

class OmniNexusMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      { name: 'omni-nexus', version: '10.1.0' },
      { capabilities: { tools: {} } }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;
      const operation = OPERATION_MAP[name as string];

      if (!operation) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
          isError: true
        };
      }

      try {
        const result = await nexus.dispatch(operation, args || {});
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: error.message }) }],
          isError: true
        };
      }
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🔮 OmniNexus MCP Server running on stdio');
  }
}

const server = new OmniNexusMCPServer();
server.start().catch(console.error);
