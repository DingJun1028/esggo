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

export const ADK_STANDARD_TOOLS = [
  fetchEnvironmentalMetrics,
  fetchSocialMetrics,
  fetchGovernanceMetrics,
  listEsgTasks
];
