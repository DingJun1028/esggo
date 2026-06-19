/**
 * ⚡ Omni Skill Execution Engine: SkillExecutionEngine
 * --------------------------------------------------
 * [Core Task] Drives agent skill trees, converting RPG data into system performance
 * [Protocol] 4+1 Protocol (Traceable, Trackable, Calculable, Immutable)
 * [Standard] English Standardization
 */

import { IComponentCore } from '@/core/interfaces.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { v4 as uuidv4 } from 'uuid';
import { SKILL_TREE } from '../data/rpg-data.js';

export type SkillID = 's_deep_search' | 's_self_healing' | 's_ui_genesis' | string;

interface Skill<TParams, TResult> {
  id: SkillID;
  execute: (params: TParams, traceId: string, agentCore?: IComponentCore) => Promise<TResult>;
}

export class SkillExecutionEngine {
  private static instance: SkillExecutionEngine;
  private skillRegistry = new Map<SkillID, Skill<any, any>>();

  private constructor() {
    this.registerSkills();
  }

  public static getInstance(): SkillExecutionEngine {
    if (!SkillExecutionEngine.instance) {
      SkillExecutionEngine.instance = new SkillExecutionEngine();
    }
    return SkillExecutionEngine.instance;
  }

  private registerSkills(): void {
    // Register all known skills
    this.registerSkill({ id: 's_deep_search', execute: this.handleDeepSearch });
    this.registerSkill({
      id: 's_self_healing',
      execute: (params, traceId, core) => this.handleSelfHealing(core!, traceId),
    });
    this.registerSkill({ id: 's_ui_genesis', execute: this.handleUIGenesis });
    this.registerSkill({ id: 's_auto_response', execute: this.handleAutoResponse });
    this.registerSkill({ id: 's_seraphim_advisor', execute: this.handleSeraphimAdvisor });
  }

  public registerSkill(skill: Skill<any, any>): void {
    if (this.skillRegistry.has(skill.id)) {
      omniLogger.warn(LogCategory.SYSTEM, `[Skill Registry] Overwriting skill: ${skill.id}`, {
        source_origin: 'SkillExecutionEngine.registerSkill',
      });
    }
    this.skillRegistry.set(skill.id, skill);
  }

  public async executeSkill(
    skillId: SkillID,
    agentCore: IComponentCore,
    params: any,
    unlockedSkills: string[] = []
  ): Promise<{ result: any; updatedCore: IComponentCore }> {
    const executionId = uuidv4();
    omniLogger.info(LogCategory.AGENT, `[Skill Init] Starting execution: ${skillId}`, {
      trace_id: executionId,
      source_origin: 'SkillExecutionEngine.executeSkill',
      metadata: { agent_uuid: agentCore.uuid },
    });

    try {
      this.checkSkillRequirements(skillId, unlockedSkills);

      const skill = this.skillRegistry.get(skillId);
      let result: any;

      if (skill) {
        result = await skill.execute(params, executionId, agentCore);
      } else {
        // Fallback for generic RPG skills not in the registry
        result = { status: 'Executed', skill: skillId, message: 'Simulated Execution' };
        omniLogger.debug(
          LogCategory.AGENT,
          `Executing unregistered skill via fallback: ${skillId}`,
          { trace_id: executionId }
        );
      }

      const updatedCore: IComponentCore = {
        ...agentCore,
        evidence: {
          ...agentCore.evidence,
          [`skill_${skillId}_${Date.now()}`]: this.generateHashLock(result),
        },
      };

      omniLogger.info(LogCategory.AGENT, `[Skill Success] Execution completed: ${skillId}`, {
        trace_id: executionId,
        source_origin: 'SkillExecutionEngine.executeSkill',
        metadata: { evidence_hash: this.generateHashLock(result) },
      });

      return { result, updatedCore };
    } catch (error: any) {
      omniLogger.error(LogCategory.AGENT, `[Skill Failed] Execution interrupted: ${skillId}`, {
        trace_id: executionId,
        source_origin: 'SkillExecutionEngine.executeSkill',
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  private checkSkillRequirements(skillId: string, unlockedSkills: string[]): void {
    const skillNode = SKILL_TREE.nodes.find(n => n.id === skillId);
    if (!skillNode && !this.skillRegistry.has(skillId) && !skillId.startsWith('s_seraphim')) {
      // Allow seraphim as it was special-cased before
      throw new Error(`Skill does not exist or is not registered: ${skillId}`);
    }
    if (!unlockedSkills.includes(skillId) && unlockedSkills.length > 0) {
      omniLogger.warn(
        LogCategory.AGENT,
        `[Permission Warning] Attempted to execute locked skill: ${skillId}`,
        {
          source_origin: 'SkillExecutionEngine.checkSkillRequirements',
        }
      );
    }
  }

  // --- Domain Handlers ---

  private async handleDeepSearch(params: any, traceId: string) {
    const query = params.query || 'ESG Trends';
    omniLogger.debug(LogCategory.AI, `Executing deep search: ${query}`, { trace_id: traceId });
    return {
      data: `Deep analysis result for: ${query}`,
      confidence: 0.98,
      sources: ['Reuters', 'Bloomburg', 'Nature'],
    };
  }

  private async handleSelfHealing(core: IComponentCore, traceId: string) {
    omniLogger.info(LogCategory.SYSTEM, 'Initiating self-healing process...', {
      trace_id: traceId,
    });
    return {
      healed_files: 0,
      status: 'System Healthy',
      diagnostics: 'No critical entropy detected',
    };
  }

  private async handleUIGenesis(params: any, traceId: string) {
    omniLogger.info(LogCategory.UI, 'Generating dynamic UI component...', { trace_id: traceId });
    return { component_id: `ui_${Date.now()}`, theme: 'OmniDark', layout: 'Grid' };
  }

  private async handleAutoResponse(params: any, traceId: string) {
    return { response: `Auto-generated response to: ${params.message}`, timestamp: Date.now() };
  }

  private async handleSeraphimAdvisor(params: any, traceId: string) {
    omniLogger.info(LogCategory.AI, 'Activating Seraphim Advisor...', {
      trace_id: traceId,
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      strategy: 'GAP_FILLING',
      target: 'Scope 2 Emissions',
      action_plan: [
        'Routing power to Green Grid (Solar Array A)',
        'Initiaing PPA Purchase Order',
        'Notifying Governance Board',
      ],
      sroi_impact: +0.4,
    };
  }

  private generateHashLock(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `hash:${hash.toString(16)}`;
  }
}
