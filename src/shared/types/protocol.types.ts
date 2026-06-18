/**
 * ESG GO | 🏛️ 5T 誠信協議門 (The 5T Protocol: Data Governance Framework)
 * v2.1 | Ultimate Minimalist Alignment
 *
 * 英標為骨：Tangible, Traceable, Trackable, Transparent, Trustworthy
 * 繁博為魂：具體·溯源·追蹤·透明·信賴
 */

import { I5TGovernance } from './core.types';

export type ProtocolGateCode = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export interface IProtocolGate {
  readonly code: ProtocolGateCode;
  readonly labelZh: string; // 繁博：真、善、美、通、信
  readonly propertyEn: keyof I5TGovernance;
  readonly titleZh: string;
  readonly descriptionEn: string;
  readonly color: string; // Minimalist Palette
}

/**
 * @const SACRED_GATES
 * @description 5T 協議門之創世定義 v2.1 - 極致簡約版。
 */
export const SACRED_GATES: Record<ProtocolGateCode, IProtocolGate> = {
  T1: {
    code: 'T1',
    labelZh: '具體',
    propertyEn: 'tangible',
    titleZh: '數據具體 (Tangible)',
    descriptionEn:
      'Concrete & perceivable: Data is tangible through KPI cards and GRI coverage matrix.',
    color: '#06B6D4', // Cyan-core
  },
  T2: {
    code: 'T2',
    labelZh: '溯源',
    propertyEn: 'traceable',
    titleZh: '數據溯源 (Traceable)',
    descriptionEn: 'Origin-verified: Every data point carries source_origin and full flow_path.',
    color: '#10B981', // Emerald-soul
  },
  T3: {
    code: 'T3',
    labelZh: '追蹤',
    propertyEn: 'trackable',
    titleZh: '生命追蹤 (Trackable)',
    descriptionEn: 'Lifecycle-aware: Complete event trail with request_id tracking.',
    color: '#219EBC', // Optimal-blue
  },
  T4: {
    code: 'T4',
    labelZh: '透明',
    propertyEn: 'transparent',
    titleZh: '算法透明 (Transparent)',
    descriptionEn: 'Algorithmically verifiable: Zero-hallucination, Formula validation panel.',
    color: '#FFB703', // Critical-amber (for awareness)
  },
  T5: {
    code: 'T5',
    labelZh: '信賴',
    propertyEn: 'trustworthy',
    titleZh: '誠信信賴 (Trustworthy)',
    descriptionEn: 'Cryptographically secured: SHA-256 Hash Lock & ZKP verification.',
    color: '#003262', // Berkeley-blue
  },
};

export interface GateValidationResult {
  readonly gate: ProtocolGateCode;
  readonly passed: boolean;
  readonly timestamp: number;
  readonly evidencePath: string;
  readonly messageZh: string;
  readonly hashLock?: string;
}
