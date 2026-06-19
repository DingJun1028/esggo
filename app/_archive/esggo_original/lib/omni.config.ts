import { z } from 'zod';

let _omniagentAI: any = null;
export async function getOmniAgentAI() {
  if (!_omniagentAI) {
    const { genkit } = await import('genkit');
    const { googleAI } = await import('@genkit-ai/googleai');
    _omniagentAI = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-1.5-pro-latest',
    });
  }
  return _omniagentAI;
}

// Structured Output Schema for ESG Analysis
export const ESGArtifactSchema = z.object({
  title: z.string(),
  content: z.string(),
  indicators: z.array(z.string()).optional(),
  confidence: z.number(),
  gaps: z.array(z.string()).optional(),
});

// ADK & AgentZ0 configuration
export const omniagentConfig = {
  agentName: 'OmniAgent Orchestrator',
  version: '1.1.0',
  agentZ0Enabled: true,
  adkOptions: {
    logLevel: 'debug',
    enable5TSeal: true,
    swarmThreshold: 0.7, // Confidence threshold for autonomous swarm activation
  },
  personas: {
    researcher: "你是一位資深的 ESG 數據研究員，專長於 GRI、SASB 與 TCFD 框架的數據提取與比對。",
    auditor: "你是一位嚴謹的 5T 協議審計師，專注於資料的真實性、溯源性與 5T 誠信協議的合規性。",
    planner: "你是一位專案管理專家，擅長將複雜的永續專案拆解為具體可執行的子任務。"
  }
};
