/**
 * OmniAgent v2.1 — Lightweight Bridge Module
 *
 * This module provides a minimal interface for the Gateway bridge.
 * Heavy lifting is done via lazy imports to avoid OOM on VPS.
 */

import { createHash } from 'crypto';
import { IBusEvent, ComponentCore, OmniAgent as IOmniAgent, LifecycleStage } from '@/lib/omni-core/contracts';

/* --- Core Types --- */
export type AgentMode = 'autonomous' | 'supervised' | 'debug';
export type AgentStatus = 'idle' | 'processing' | 'assembling' | 'verifying' | 'complete' | 'error';
export type AssemblyPhase = 'loading' | 'tagging' | 'selecting' | 'filling' | 'verifying' | 'sealing' | 'done';
export type Gate = 'traceable' | 'transparent' | 'tangible' | 'trustworthy' | 'trackable';

export interface AgentCapability {
  readonly id: string;
  readonly name: string;
  readonly gate: Gate;
  readonly enabled: boolean;
  readonly confidence: number;
}

export interface AgentDecision {
  readonly id: string;
  readonly timestamp: number;
  readonly phase: AssemblyPhase;
  readonly action: string;
  readonly chapterId: string;
  readonly hash: string;
}

export interface AssemblyProgress {
  readonly phase: AssemblyPhase;
  readonly currentChapter: number;
  readonly totalChapters: number;
  readonly chapterTitle: string;
  readonly wordsSoFar: number;
  readonly fiveTGate: string;
  readonly tagsCreated: number;
  readonly decisionsCount: number;
  readonly percent: number;
}

export interface AssemblyResult {
  readonly success: boolean;
  readonly totalWords: number;
  readonly totalTags: number;
  readonly totalDecisions: number;
  readonly trinityHash: string;
  readonly durationMs: number;
  readonly completedAt: string;
}

export type { IBusEvent, ComponentCore, LifecycleStage };
export type { IOmniAgent, IOmniAgentBus, IOmniAgentGateway, IBlackboard } from '@/lib/omni-core/contracts';

// ═══════════════════════════════════════════════════════════════
// 5T Gate Verification (Pure Functions — No External Dependencies)
// ═══════════════════════════════════════════════════════════════

const GATE_MIN_LENGTH: Record<Gate, number> = {
  traceable: 100, transparent: 150, tangible: 200, trustworthy: 120, trackable: 80,
};

const GATE_PATTERNS: Record<Gate, RegExp> = {
  traceable: /GRI|ISO|TCFD|SDG/,
  transparent: /%|百分比|比率|比例/,
  tangible: /完成|達成|實現|推動|建立|導入/,
  trustworthy: /ZKP|hash|封印|SHA/,
  trackable: /202[56]|年度|期間|日期/,
};

export function verify5TGate(gate: Gate, content: string, contentHash: string): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const minLen = GATE_MIN_LENGTH[gate];

  if (!content || content.trim().length === 0) {
    issues.push('Content is empty');
  } else if (content.length < minLen) {
    issues.push(`Content length (${content.length}) below minimum (${minLen}) for gate ${gate}`);
  }

  if (GATE_PATTERNS[gate] && !GATE_PATTERNS[gate].test(content)) {
    issues.push(`Missing ${gate}-specific quality criteria`);
  }

  if (!contentHash || contentHash.length < 16) {
    issues.push('Missing or invalid content hash (Trustworthy gate)');
  }

  return { passed: issues.length === 0, issues };
}

// ═══════════════════════════════════════════════════════════════
// Lightweight OmniAgent (No Heavy Imports)
// ═══════════════════════════════════════════════════════════════

const DEFAULT_CAPABILITIES: AgentCapability[] = [
  { id: 'cap-traceable', name: '溯源驗證', gate: 'traceable', enabled: true, confidence: 0.95 },
  { id: 'cap-transparent', name: '透明揭露', gate: 'transparent', enabled: true, confidence: 0.92 },
  { id: 'cap-tangible', name: '量化驗證', gate: 'tangible', enabled: true, confidence: 0.97 },
  { id: 'cap-trustworthy', name: '信任封印', gate: 'trustworthy', enabled: true, confidence: 0.98 },
  { id: 'cap-trackable', name: '生命週期追蹤', gate: 'trackable', enabled: true, confidence: 0.93 },
];

const decisionHash = (prev: string, action: string, output: string, ts: number): string => {
  return createHash('sha256').update(`${prev}:${action}:${output}:${ts}`).digest('hex');
};

export { DEFAULT_CAPABILITIES, decisionHash };

let agentInstance: OmniAgent | null = null;

export class OmniAgent implements IOmniAgent {
  readonly signature: ComponentCore;
  private status: AgentStatus = 'idle';
  private decisions: AgentDecision[] = [];

  constructor() {
    this.signature = {
      uuid: `agent-${Date.now()}`,
      version: '2.1.0',
      timestamp: Date.now(),
      evidence: {},
    };
  }

  static getInstance(): OmniAgent {
    if (!agentInstance) {
      agentInstance = new OmniAgent();
    }
    return agentInstance;
  }

  getSignature(): ComponentCore {
    return this.signature;
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  async execute(event: IBusEvent): Promise<void> {
    console.log(`[OmniAgent] 執行事件: ${event.topic}, payload:`, event.payload);
    this.status = 'processing';
    // 這裡可以加入實際業務邏輯
    this.status = 'complete';
  }

  onMartialLaw(reason: string): void {
    console.warn(`[OmniAgent] 收到全域戒嚴令: ${reason}`);
    this.status = 'idle';
  }

  async assembleReport(
    companyId: string,
    chapters: Array<{ id: string; title: string; wordCount: number; fiveTGate: string; griCodes: readonly string[] }>,
    onProgress?: (progress: AssemblyProgress) => void,
  ): Promise<AssemblyResult> {
    this.status = 'assembling';
    const startTime = Date.now();
    let totalWords = 0;
    let lastDecisionHash = '0'.repeat(64);

    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      totalWords += ch.wordCount;

      const ts = Date.now();
      lastDecisionHash = decisionHash(lastDecisionHash, ch.title, `Processed ${ch.id}`, ts);
      this.decisions.push({
        id: `DSC-${ts}-${i}`,
        timestamp: ts,
        phase: 'verifying',
        action: ch.title,
        chapterId: ch.id,
        hash: lastDecisionHash,
      });

      onProgress?.({
        phase: 'verifying',
        currentChapter: i + 1,
        totalChapters: chapters.length,
        chapterTitle: ch.title,
        wordsSoFar: totalWords,
        fiveTGate: ch.fiveTGate,
        tagsCreated: i + 1,
        decisionsCount: this.decisions.length,
        percent: Math.round(((i + 1) / chapters.length) * 100),
      });
    }

    this.status = 'complete';
    const trinity = createHash('sha256').update(`V:${companyId}:U:${totalWords}:A:${this.decisions.length}`).digest('hex');

    return Object.freeze({
      success: true,
      totalWords,
      totalTags: chapters.length,
      totalDecisions: this.decisions.length,
      trinityHash: trinity,
      durationMs: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    });
  }

  reset(): void {
    this.status = 'idle';
    this.decisions = [];
  }
}

// ═══════════════════════════════════════════════════════════════
// Meta
// ═══════════════════════════════════════════════════════════════

export const OMNI_AGENT_META = Object.freeze({
  version: '2.1.0',
  maxConcurrentTasks: 10,
  supportedFormats: ['html', 'markdown', 'json', 'pdf-ready'] as const,
  gateOrder: ['traceable', 'transparent', 'tangible', 'trustworthy', 'trackable'] as const,
});