import { ADKAgent, ADKSwarm } from './adk-core';
import { ADK_STANDARD_TOOLS } from './adk-tools';
import { agent0, OmniCommander, omniAgentBus } from './omni-commander';

/**
 * ADK Swarm Deployment: ESG GO Official Agents
 */

export const esgResearcher = new ADKAgent({
  name: 'ESG_Researcher',
  role: 'Sustainability Data Specialist',
  model: 'googleai/gemini-1.5-flash',
  systemPrompt: `
You are the ESG_Researcher. Your specialty is GRI, SASB, and TCFD mapping.
You help identify relevant metrics and draft professional sustainability content.
  `,
  tools: ADK_STANDARD_TOOLS
});

export const esgAuditor = new ADKAgent({
  name: 'ESG_Auditor',
  role: 'Internal Control and 5T Compliance Officer',
  model: 'googleai/gemini-1.5-flash',
  systemPrompt: `
You are the ESG_Auditor. You verify the 5T integrity (Traceable, Transparent, Tangible, Trustworthy, Trackable).
You look for data gaps, check hash locks, and perform automated ZKP-like verification.
  `,
  tools: ADK_STANDARD_TOOLS
});

export const esgStrategist = new ADKAgent({
  name: 'ESG_Strategist',
  role: 'External Communication and Strategic Alignment',
  model: 'googleai/gemini-1.5-pro',
  systemPrompt: `
You are the ESG_Strategist. You help align sustainability goals with corporate strategy.
You focus on Notion syncing, report visualization, and executive summaries.
  `,
  tools: ADK_STANDARD_TOOLS
});

export const omniSwarm = new ADKSwarm();
omniSwarm.register(esgResearcher);
omniSwarm.register(esgAuditor);
omniSwarm.register(esgStrategist);
omniSwarm.register(agent0);

/**
 * The OmniAgent: Orchestrated by Supreme Commander via OmniAgentBus
 */
export const omniAgent = new OmniCommander(omniSwarm);
