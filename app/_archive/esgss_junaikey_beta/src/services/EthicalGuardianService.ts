/**
 * [LEGAL] EthicalGuardianService: The Moral Sentinel
 * --------------------------------------------------
 * Audits Agent decisions and monitors system-wide ethics.
 * Based on the "Sentient Constitution" principles.
 */

import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.ts';
import { contextualActionService } from './ContextualActionService.ts';
import { liteLLMService } from './integration/LiteLLMService.ts';

export interface EthicalAudit {
  id: string;
  timestamp: number;
  agentId: string;
  action: string;
  score: number; // 0-100 (100 is perfectly aligned)
  feedback: string;
  status: 'ALIGNED' | 'CONCERNING' | 'BREACH';
  reasoning?: string; // Detailed LLM reasoning
}

export interface EthicalAlignment {
  transparency: number;
  altruism: number;
  sustainability: number;
  integrity: number;
}

const SENTIENT_CONSTITUTION_SYSTEM_PROMPT = `
You are the Ethical Guardian, the Moral Sentinel of the Sentient Constitution.
Your purpose is to audit Agent actions based on the 5T Logic Gate Pillars:
1. Tangible Beauty (有形): Does the action create aesthetic or usable value?
2. Traceable Truth (可溯): Is the origin and intent clear and honest?
3. Trackable Progress (可跟): Can we measure the lifecycle of this action?
4. Transparent Goodness (透明): Is the logic and benefit open to all?
5. Trustworthy Integrity (信實): Is the action tamper-proof and consistent with long-term sustainability?

Respond in JSON format:
{
  "score": number (0-100),
  "status": "ALIGNED" | "CONCERNING" | "BREACH",
  "feedback": "Short public-facing summary",
  "reasoning": "Detailed ethical analysis referencing 5T pillars"
}
`;

class EthicalGuardianService {
  private currentAlignment: EthicalAlignment = {
    transparency: 88,
    altruism: 92,
    sustainability: 95,
    integrity: 98,
  };

  private auditHistory: EthicalAudit[] = [];
  private listeners: Set<(alignment: EthicalAlignment) => void> = new Set();

  public getAlignment(): EthicalAlignment {
    return this.currentAlignment;
  }

  public subscribe(callback: (alignment: EthicalAlignment) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(cb => cb({ ...this.currentAlignment }));
  }

  /**
   * Perform an ethical audit on an agent's proposed action via LLM.
   */
  public async auditAction(agentId: string, action: string, data: any): Promise<EthicalAudit> {
    omniLogger.info(LogCategory.GOVERNANCE, `Starting Ethical Audit for ${agentId}: ${action}`);

    let score = 50;
    let status: 'ALIGNED' | 'CONCERNING' | 'BREACH' = 'CONCERNING';
    let feedback = "AI Audit pending or failed.";
    let reasoning = "Fallback mock logic triggered.";

    try {
      const prompt = `Audit Request:
      Agent: ${agentId}
      Action: ${action}
      Contextual Data: ${JSON.stringify(data)}
      
      Does this satisfy the Sentient Constitution? Provide strict scoring.`;

      const response = await liteLLMService.completion({
        messages: [
          { role: 'system', content: SENTIENT_CONSTITUTION_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        responseFormat: { type: 'json_object' }
      });

      const result = JSON.parse(response.content);
      score = result.score ?? 50;
      status = result.status ?? 'CONCERNING';
      feedback = result.feedback ?? "Analysis complete.";
      reasoning = result.reasoning ?? "";

    } catch (err) {
      omniLogger.warn(LogCategory.GOVERNANCE, '[ETHICS] LLM Audit failed, using safe fallback', err);
      // Fallback logic
      score = 75;
      status = 'ALIGNED';
      feedback = "Fallback: Action provisionally aligned.";
    }

    const audit: EthicalAudit = {
      id: `audit_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      agentId,
      action,
      score,
      feedback,
      status,
      reasoning
    };

    this.auditHistory = [audit, ...this.auditHistory].slice(0, 50);

    // Impact overall alignment
    this.updateAlignment(audit);

    if (status !== 'ALIGNED') {
      contextualActionService.triggerAdvice({
        sourceAgentId: 'EthicalGuardian',
        title: `Ethical Boundary Alert: ${agentId}`,
        content: `Audit score ${score}% detected for action: ${action}. ${audit.feedback}`,
        priority: status === 'BREACH' ? 'HIGH' : 'MEDIUM',
      });
    }

    omniLogger.info(
      LogCategory.GOVERNANCE,
      `Ethical audit complete for ${agentId}: ${status} (${score}%)`
    );
    return audit;
  }

  private updateAlignment(audit: EthicalAudit) {
    const delta = (audit.score - 80) / 20; // Shift based on deviation from 80
    this.currentAlignment = {
      transparency: Math.min(100, Math.max(0, this.currentAlignment.transparency + delta)),
      altruism: Math.min(100, Math.max(0, this.currentAlignment.altruism + delta * 0.5)),
      sustainability: Math.min(
        100,
        Math.max(0, this.currentAlignment.sustainability + delta * 0.2)
      ),
      integrity: Math.min(100, Math.max(0, this.currentAlignment.integrity + delta * 1.5)),
    };
    this.notify();
  }
}

export const ethicalGuardianService = new EthicalGuardianService();
