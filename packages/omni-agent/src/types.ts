// ═══════════════════════════════════════════════════════════════
// @esggo/omni-agent — Types
// 合併自 v5.0 (lib/omni-agent) 與 v2.1 (src/lib/omni-agent)
// 單一事實來源 for OmniAgent 型別定義
// ═══════════════════════════════════════════════════════════════

// ── 5T Protocol ───────────────────────────────────────────────

export type FiveTDimension = 'traceable' | 'transparent' | 'tangible' | 'trustworthy' | 'trackable';

export const FIVE_T_GATES: readonly FiveTDimension[] = [
  'traceable', 'transparent', 'tangible', 'trustworthy', 'trackable',
] as const;

export const FIVE_T_META: Record<FiveTDimension, { zh: string; en: string; symbol: string; color: string }> = {
  traceable:   { zh: '真',  en: 'Traceable',   symbol: 'T¹', color: '#3B82F6' },
  transparent: { zh: '善',  en: 'Transparent',  symbol: 'T²', color: '#22C55E' },
  tangible:    { zh: '美',  en: 'Tangible',     symbol: 'T³', color: '#F59E0B' },
  trustworthy: { zh: '信',  en: 'Trustworthy',  symbol: 'T⁴', color: '#8B5CF6' },
  trackable:   { zh: '通',  en: 'Trackable',    symbol: 'T⁵', color: '#06B6D4' },
};

export interface FiveTScore {
  traceable: number;
  transparent: number;
  tangible: number;
  trustworthy: number;
  trackable: number;
}

// ── Agent Core ─────────────────────────────────────────────────

export type AgentMode = 'autonomous' | 'supervised' | 'debug';
export type AgentStatus = 'idle' | 'processing' | 'assembling' | 'verifying' | 'sealing' | 'complete' | 'error';
export type AssemblyPhase = 'loading' | 'tagging' | 'selecting' | 'filling' | 'verifying' | 'sealing' | 'done';

export interface AgentCapability {
  readonly id: string;
  readonly name: string;
  readonly gate: FiveTDimension;
  readonly enabled: boolean;
  readonly confidence: number;
  readonly lastExecuted?: number;
  readonly executionCount?: number;
}

export interface AgentDecision {
  readonly id: string;
  readonly timestamp: number;
  readonly gate?: FiveTDimension;
  readonly phase?: AssemblyPhase;
  readonly action: string;
  readonly input?: Record<string, unknown>;
  readonly output?: Record<string, unknown>;
  readonly chapterId?: string;
  readonly confidence?: number;
  readonly hash: string;
}

export interface OmniAgent {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly mode: AgentMode;
  readonly status: AgentStatus;
  readonly capabilities: readonly AgentCapability[];
  readonly decisions: readonly AgentDecision[];
  readonly currentTheme: string;
  readonly trinitySyncEnabled: boolean;
  readonly totalReportsAssembled: number;
  readonly agentHash: string;
  readonly startedAt: number;
}

// ── Assembly ───────────────────────────────────────────────────

export interface AssemblyTask {
  readonly id: string;
  readonly companyId: string;
  readonly companyName: string;
  readonly chapters: readonly string[];
  readonly format: 'html' | 'markdown' | 'json';
  readonly theme: string;
  readonly useCache: boolean;
  readonly priority: number;
  readonly createdAt: number;
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
  readonly taskId: string;
  readonly agentId?: string;
  readonly success: boolean;
  readonly totalWords: number;
  readonly totalTags: number;
  readonly totalDecisions: number;
  readonly chapterCount?: number;
  readonly fiveTGatesPassed?: boolean;
  readonly themeApplied?: string;
  readonly trinityHash: string;
  readonly duration: number;
  readonly hashLock?: string;
  readonly completedAt: number;
}

// ── 5T Gate Verification ──────────────────────────────────────

export interface FiveTVerificationResult {
  passed: boolean;
  issues: string[];
  gate: FiveTDimension;
  score: number;
}

// ── Agent Status ───────────────────────────────────────────────

export interface AgentStatusReport {
  id: string;
  name: string;
  status: AgentStatus;
  mode: AgentMode;
  activeCapabilities: number;
  totalDecisions: number;
  theme: string;
  trinitySync: boolean;
  uptime: number;
}

// ── Agent Meta ─────────────────────────────────────────────────

export const AGENT_META = {
  version: '5.1.0',
  maxConcurrentTasks: 10,
  supportedFormats: ['html', 'markdown', 'json', 'pdf-ready'] as const,
  gateOrder: FIVE_T_GATES,
} as const;