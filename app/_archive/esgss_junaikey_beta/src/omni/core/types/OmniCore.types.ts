import { ILocalizedString } from '../../../types/i18n.types.ts';

/**
 * 🏷️ 奧秘標籤類型 / Omni Tag Type
 */
export enum OmniTagType {
  PERCEPTION = 'PERCEPTION',
  MEMORY = 'MEMORY',
  REASONING = 'REASONING',
  ACTION = 'ACTION',
  SKILL = 'SKILL',
  KNOWLEDGE = 'KNOWLEDGE',
  CONTEXT = 'CONTEXT',
}

/**
 * 🌀 奧秘共鳴維度 / Omni Resonance Dimension
 */
export enum OmniResonanceDimension {
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  SOCIAL = 'SOCIAL',
  GOVERNANCE = 'GOVERNANCE',
  TECHNOLOGICAL = 'TECHNOLOGICAL',
  AWARENESS = 'AWARENESS',
}

/**
 * 🏷️ 奧秘標籤 / Omni Tag
 */
export interface OmniTag {
  id: string;
  type: OmniTagType;
  name: string;
  value: unknown;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/**
 * 📦 奧秘元件狀態 / Omni Component State
 */
export enum OmniComponentState {
  UNINITIALIZED = 'UNINITIALIZED',
  READY = 'READY',
  EXECUTING = 'EXECUTING',
  ERROR = 'ERROR',
  CLEANED = 'CLEANED',
}

/**
 * 📦 奧秘元件 / Omni Component
 */
export interface OmniComponent<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  state: OmniComponentState;
  execute(input: TInput): Promise<TOutput>;
  cleanup(): Promise<void>;
}

/**
 * 🎯 奧秘請求與回應 / Omni Request & Response
 */
export interface OmniRequest {
  id: string;
  type: 'QUERY' | 'COMMAND' | 'LEARN' | 'REASON';
  content: string;
  context?: Record<string, unknown>;
  timestamp: number;
  source?: string;
  tags?: string[];
  payload?: any;
}

export interface IVerifiedResponse {
  core: OmniRequest;
  message: string;
  verified: boolean;
  data: any;
  source_origin: string;
  five_t_ref: string;
}

export interface OmniResponse {
  id: string;
  requestId: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  content: string;
  data?: unknown;
  generatedTags: OmniTag[];
  executionTime: number;
}

/**
 * 🌌 奧秘核心介面 / Omni Core Interface
 * --------------------------------------------------
 * [TC] 三元一體核心系統的統一口徑。整合元件、標籤與智庫。
 * [EN] Unified interface for the Trinity Core system. Integrates components,
 *      tags, and think tank.
 */
export interface IOmniCore {
  readonly id: string;
  readonly name: ILocalizedString;
  readonly version: string;

  /** 初始化核心 / Initialize Core */
  initialize(): Promise<void>;

  /** 處理奧秘請求 / Process Omni Request */
  process(request: OmniRequest): Promise<OmniResponse>;

  /** 廣播共鳴信號 / Broadcast Resonance */
  broadcastResonance(pattern: string, intensity: number, dimension?: any): void;
}
