/**
 * 🔮 OmniNexus - Core Module Exports
 * ================================
 * 終極整合統一閘道 | Ultimate Integration Unified Gateway
 * 終始矩陣：雙向 TypeScript 映射器 | Bidirectional TypeScript Mapper
 * 
 * ⚠️ 三位一體 = 合一 | TRINITY = ONE
 * OmniOne = 唯一總代理 | OmniOne = Sole Supreme Agent
 */

export { OmniOne, omniOne } from './omni-one';
export type { IOmniStatus } from './omni-one';

export { OmniNexus, omniNexus } from './omni-nexus';
export { OmniNexusTrinity, omniNexusTrinity } from './omni-nexus-trinity';
export { OmniNexusSingularity, omniNexusSingularity } from './omni-nexus-singularity';
export type { ITrinityStatus } from './omni-nexus-trinity';
export type { ISingularityStatus } from './omni-nexus-singularity';

export { OmniMCP } from './omni-mcp';

export { OmniAPI } from './omni-api';

export { OmniMapper } from './omni-mapper';
export type {
  IReportDisplayDTO,
  ICarbonDisplayDTO,
  IIndicatorRowDTO,
  IIntelDisplayDTO,
  IVirtueDisplayDTO,
  IReportFormInput,
  ICarbonFormInput,
} from './omni-mapper';

export { omniLogger } from './omniLogger';
export type { LogCategory } from './omniLogger';

export * from './omni-types';
export * from './omni-one';
export * from './omni-core';
export * from './omni-connector';
export * from './omni-state';
export * from './omniLogger';

// 🧠 Agent Knowledge & Skills (代理知識庫 & 技能包)
export { AgentKnowledgeDB } from './agent-knowledge-db';
export type { IKnowledgeEntry } from './agent-knowledge-db';

export { AgentSharedKnowledgeDB } from './agent-shared-knowledge-db';
export type { ISharedEntry } from './agent-shared-knowledge-db';

export { SkillRegistry, Skill_DataSynthesizer, Skill_RiskPredictor, Skill_ResilienceAura } from './omni-agent-skills';
export type { ISkillPackage } from './omni-agent-skills';

export { OmniAgent } from './OmniAgent';
export type { IOmniAgent } from './OmniAgent';

export * from '../lib/sentient-manifest';

export const AI_AGENT_TOOLS = [
  { name: 'omni_manifest_asset', description: 'Create 5T-compliant ESG atom' },
  { name: 'omni_analyze_trend', description: 'Analyze ESG market trends' },
  { name: 'omni_verify_carbon', description: 'Verify carbon emissions (Scope 1/2/3)' },
  { name: 'omni_forge_gri_report', description: 'Generate GRI report' },
  { name: 'omni_seal_5t_proof', description: 'Seal 5T proof' },
  { name: 'omni_ask_jules', description: 'Ask Google Jules AI' },
  { name: 'omni_sequential_thinking', description: 'Sequential thinking' },
  { name: 'omni_track_carbon', description: 'Track carbon emissions' },
  { name: 'omni_cognitive_chat', description: 'AI chat about ESG' },
  { name: 'omni_daily_gnosis', description: 'Get daily ESG insight' },
  { name: 'omni_governance_verify', description: 'Verify data integrity' },
  { name: 'omni_forge_agent', description: 'Create ESG agent' },
  { name: 'omni_get_status', description: 'Get system status' },
  { name: 'trinity_awaken', description: 'Awaken Trinity (OmniOne+Priest+Gemini)' },
  { name: 'trinity_status', description: 'Get Trinity status' }
];
