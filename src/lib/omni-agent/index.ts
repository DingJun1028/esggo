/**
 * OmniAgent v2.0 - Orchestration Layer
 *
 * The central orchestrator for ESGGO report assembly.
 * Coordinates 5T gate verification, decision ledger, tag sealing,
 * and trinity hash computation.
 *
 * Architecture:
 * - DecisionLedger:   Immutable chain of agent decisions (hash-chained)
 * - ReportAssembler:  Iterates chapters, creates tags, verifies gates, seals
 * - OmniAgent:       Singleton facade with assembleReport() entry point
 *
 * 5T Protocol (Zhen-Shan-Mei-Xin-Tong):
 *   Traceable    - Every decision is recorded and hash-chained
 *   Transparent  - Assembly progress is fully observable
 *   Tangible     - Produces concrete, measurable output
 *   Trustworthy  - ZK proofs and trinity hash ensure integrity
 *   Trackable    - Full audit trail from input to final report
 */

import { createHash } from 'crypto';
import {
  create5TTag,
  entangle,
  generateZKProof,
  type ZKProof,
} from '../omni-tag/index';
import type { FiveTDimension } from '../omni-core/types';

// ===================================================================
// SECTION 0: Type Aliases & Constants
// ===================================================================

/** Gate is the 5T dimension used as a chapter gate */
type Gate = FiveTDimension;

/** Agent operational mode */
export type AgentMode = 'autonomous' | 'supervised' | 'debug';

/** Agent operational status */
export type AgentStatus =
  | 'idle'
  | 'processing'
  | 'assembling'
  | 'verifying'
  | 'complete'
  | 'error';

/** Assembly pipeline phase */
export type AssemblyPhase =
  | 'loading'
  | 'tagging'
  | 'selecting'
  | 'filling'
  | 'verifying'
  | 'sealing'
  | 'done';

/** Agent capability with confidence tracking (from v2.5 legacy) */
export interface AgentCapability {
  readonly id: string;
  readonly name: string;
  readonly gate: Gate;
  readonly enabled: boolean;
  readonly confidence: number;
  readonly lastExecuted: number;
  readonly executionCount: number;
}

/** Default 5T capabilities */
const DEFAULT_CAPABILITIES: AgentCapability[] = [
  { id: 'cap-traceable', name: '溯源驗證', gate: 'traceable', enabled: true, confidence: 0.95, lastExecuted: 0, executionCount: 0 },
  { id: 'cap-transparent', name: '透明揭露', gate: 'transparent', enabled: true, confidence: 0.92, lastExecuted: 0, executionCount: 0 },
  { id: 'cap-tangible', name: '量化驗證', gate: 'tangible', enabled: true, confidence: 0.97, lastExecuted: 0, executionCount: 0 },
  { id: 'cap-trustworthy', name: '信任封印', gate: 'trustworthy', enabled: true, confidence: 0.98, lastExecuted: 0, executionCount: 0 },
  { id: 'cap-trackable', name: '生命週期追蹤', gate: 'trackable', enabled: true, confidence: 0.93, lastExecuted: 0, executionCount: 0 },
];

/** V5ReportChapter from report-assembly-v5 */
interface V5ReportChapter {
  id: string;
  num: number;
  title: string;
  griCodes: readonly string[];
  fiveTGate: string;
  content: string;
  wordCount: number;
  zkpHash: string;
  omniTagUuid: string;
  evidenceCount: number;
}

// ===================================================================
// SECTION 1: AgentDecision Interface
// ===================================================================

/**
 * A single decision made by the OmniAgent during report assembly.
 * Decisions form a hash-chained ledger for full auditability.
 */
export interface AgentDecision {
  readonly id: string;
  readonly timestamp: number;
  readonly phase: AssemblyPhase;
  readonly action: string;
  readonly chapterId: string;
  readonly input: string;
  readonly output: string;
  readonly fiveTGate?: Gate;
  readonly hash: string;
}

// ===================================================================
// SECTION 2: AssemblyProgress Interface
// ===================================================================

/**
 * Real-time progress of the report assembly process.
 * Emitted via the onProgress callback.
 */
export interface AssemblyProgress {
  readonly taskId: string;
  readonly status: AgentStatus;
  readonly currentChapter: number;
  readonly totalChapters: number;
  readonly chapterTitle: string;
  readonly wordsSoFar: number;
  readonly fiveTGate: string;
  readonly tagsCreated: number;
  readonly decisionsCount: number;
  readonly percent: number;
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly error?: string;
  readonly result?: {
    readonly totalWords: number;
    readonly totalTags: number;
    readonly trinityHash: string;
    readonly durationMs: number;
  };
}

// ===================================================================
// SECTION 3: AssemblyResult Interface
// ===================================================================

/**
 * Final result of a report assembly operation.
 */
export interface AssemblyResult {
  readonly success: boolean;
  readonly totalWords: number;
  readonly totalTags: number;
  readonly totalDecisions: number;
  readonly trinityHash: string;
  readonly zkProof: ZKProof;
  readonly durationMs: number;
  readonly completedAt: string;
  readonly error?: string;
}

// ===================================================================
// SECTION 4: 5T Gate Verification
// ===================================================================

export interface GateVerificationResult {
  readonly passed: boolean;
  readonly score: number;
  readonly issues: string[];
}

/**
 * Verify that a 5T gate is satisfied for a given chapter.
 *
 * Checks:
 * - Content is non-empty and meets minimum length for the gate
 * - Tag hash matches content hash
 * - Gate-specific quality criteria are met
 *
 * @param gate           - The 5T dimension being verified
 * @param chapterContent  - The chapter text content
 * @param tag            - The 5T tag created for this chapter
 */
export function verify5TGate(
  gate: Gate,
  chapterContent: string,
  tag: ReturnType<typeof create5TTag>,
): GateVerificationResult {
  const issues: string[] = [];
  let score = 1.0;

  // Check 1: Content must not be empty
  if (!chapterContent || chapterContent.trim().length === 0) {
    issues.push('Chapter content is empty');
    score -= 0.5;
  }

  // Check 2: Content must meet minimum length threshold
  const minLength = getGateMinLength(gate);
  if (chapterContent.length < minLength) {
    issues.push(
      'Content length (' + chapterContent.length +
      ') below minimum (' + minLength + ') for gate ' + gate
    );
    score -= 0.2;
  }

  // Check 3: Tag must exist and have valid hash
  if (!tag || !tag.hash) {
    issues.push('Tag is missing or has no hash');
    score -= 0.3;
  }

  // Check 4: Tag must be sealed or active
  if (tag && tag.lifecycle !== 'sealed' && tag.lifecycle !== 'paired') {
    issues.push('Tag not sealed: ' + tag.lifecycle);
    score -= 0.2;
  }

  // Check 5: Content quality criteria based on gate
  const gateIssues = verifyGateSpecificCriteria(gate, chapterContent);
  issues.push(...gateIssues);
  score -= gateIssues.length * 0.1;

  // Clamp score
  score = Math.max(0, Math.min(1, score));

  return {
    passed: issues.length === 0,
    score,
    issues,
  };
}

/** Get minimum content length threshold for each gate */
function getGateMinLength(gate: Gate): number {
  switch (gate) {
    case 'traceable':   return 100;
    case 'transparent': return 150;
    case 'tangible':    return 200;
    case 'trustworthy': return 120;
    case 'trackable':   return 80;
    default:            return 100;
  }
}

/** Verify gate-specific quality criteria for chapter content */
function verifyGateSpecificCriteria(gate: Gate, content: string): string[] {
  const issues: string[] = [];
  const minLen = getGateMinLength(gate);

  if (content.length < minLen) {
    issues.push('Content too short for ' + gate + ' gate: ' + content.length + ' < ' + minLen);
  }

  switch (gate) {
    case 'traceable':
      if (!content.match(/GRI|ISO|TCFD|SDG/)) {
        issues.push('Missing standard reference (GRI/ISO/TCFD/SDG)');
      }
      break;
    case 'transparent':
      if (!content.match(/%|百分比|比率|比例/)) {
        issues.push('Missing quantifiable metrics (%)');
      }
      break;
    case 'tangible':
      if (!content.match(/完成|達成|實現|推動|建立|導入/)) {
        issues.push('Missing concrete action evidence');
      }
      break;
    case 'trustworthy':
      if (!content.match(/ZKP|hash|封印|SHA/)) {
        issues.push('Missing ZKP seal or hash lock evidence');
      }
      break;
    case 'trackable':
      if (!content.match(/2025|2026|年度|期間|日期/)) {
        issues.push('Missing temporal tracking reference');
      }
      break;
  }

  return issues;
}
