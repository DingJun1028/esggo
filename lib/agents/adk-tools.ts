import { z } from 'genkit';
import { ai } from './genkit';
import { 
  getEnvironmentalData, 
  getSocialMetrics, 
  getGovernanceMetrics, 
  getTasks, 
  getEvidenceFiles, 
  getReadingRoomReports 
} from '../db';

/**
 * ADK Tools: Standard Genkit Tool Definitions
 */

export const fetchEnvironmentalMetrics = ai.defineTool({
  name: 'fetchEnvironmentalMetrics',
  description: 'Fetch environmental ESG metrics from the unified Data Connect backend.',
  inputSchema: z.object({
    category: z.string().optional().describe('Category filter (e.g. GHG, Water)')
  }),
}, async (input) => {
  return await getEnvironmentalData(input.category);
});

export const fetchSocialMetrics = ai.defineTool({
  name: 'fetchSocialMetrics',
  description: 'Fetch social ESG metrics from the unified Data Connect backend.',
  inputSchema: z.object({
    category: z.string().optional().describe('Category filter (e.g. Labor, Safety)')
  }),
}, async (input) => {
  return await getSocialMetrics(input.category);
});

export const fetchGovernanceMetrics = ai.defineTool({
  name: 'fetchGovernanceMetrics',
  description: 'Fetch governance ESG metrics from the unified Data Connect backend.',
  inputSchema: z.object({
    category: z.string().optional().describe('Category filter (e.g. Ethics, Risk)')
  }),
}, async (input) => {
  return await getGovernanceMetrics(input.category);
});

export const listEsgTasks = ai.defineTool({
  name: 'listEsgTasks',
  description: 'Retrieve the current list of ESG compliance tasks and their statuses.',
  inputSchema: z.object({}),
}, async () => {
  return await getTasks();
});

// --- Phase 14: Notion MCP 2.0.0 Integration ---

export const queryNotionDataSource = ai.defineTool({
  name: 'queryNotionDataSource',
  description: 'Query a Notion data source (database) with filters and sorting.',
  inputSchema: z.object({
    dataSourceId: z.string().describe('The ID of the Notion data source (database)'),
    filter: z.any().optional().describe('Notion filter object'),
    sorts: z.any().optional().describe('Notion sorts array')
  }),
}, async (input) => {
  console.log(`[Notion Tool] Querying data source: ${input.dataSourceId}`);
  // In a real MCP setup, this would call the remote Notion MCP server
  return { success: true, message: 'Notion data source queried (Simulated)', data: [] };
});

export const createNotionPage = ai.defineTool({
  name: 'createNotionPage',
  description: 'Create a new page in a Notion database or as a child of another page.',
  inputSchema: z.object({
    parentId: z.string().describe('The parent page_id or database_id'),
    title: z.string().describe('Title of the new page'),
    content: z.string().optional().describe('Initial content in Markdown format')
  }),
}, async (input) => {
  console.log(`[Notion Tool] Creating page: ${input.title} under ${input.parentId}`);
  return { success: true, pageId: 'notion-sim-page-id', url: 'https://notion.so/sim-page' };
});

// --- Phase 15: NocoDB Integration ---

export const syncToNocoDB = ai.defineTool({
  name: 'syncToNocoDB',
  description: 'Synchronize ESG records (reports, metrics, etc.) to a NocoDB table.',
  inputSchema: z.object({
    tableName: z.string().describe('Target NocoDB table name'),
    data: z.any().describe('The record data to upsert')
  }),
}, async (input) => {
  const { nocoClient } = require('../nocodb');
  console.log(`[NocoDB Tool] Syncing to table: ${input.tableName}`);
  return await nocoClient.upsertRecord(input.tableName, input.data);
});

export const ADK_STANDARD_TOOLS = [
  fetchEnvironmentalMetrics,
  fetchSocialMetrics,
  fetchGovernanceMetrics,
  listEsgTasks,
  queryNotionDataSource,
  createNotionPage,
  syncToNocoDB
];
