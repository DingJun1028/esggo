/**
 * ESG GO | 🏛️ 5T 誠信協議門 (The 5T Protocol: Data Governance Framework)
 * v2.1 | Ultimate Minimalist Alignment
 * 
 * 英標為骨：Traceable, Transparent, Tangible, Trackable, Trustworthy
 * 繁博為魂：真·善·美·通·信
 */

import { I5TGovernance, T5Status } from '../shared/types';

export type ProtocolGateCode = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export interface IProtocolGate {
  readonly code: ProtocolGateCode;
  readonly labelZh: string;           // 繁博：真、善、美、通、信
  readonly propertyEn: keyof I5TGovernance; 
  readonly titleZh: string;           
  readonly descriptionEn: string;     
  readonly color: string;             // Minimalist Palette
}

/**
 * @const SACRED_GATES
 * @description 5T 協議門之創世定義 v2.1 - 極致簡約版。
 */
export const SACRED_GATES: Record<ProtocolGateCode, IProtocolGate> = {
  T1: {
    code: 'T1',
    labelZh: '真',
    propertyEn: 'traceable',
    titleZh: '數據之真 (Truth)',
    descriptionEn: 'Origin-verified: Traceable source_origin grounding.',
    color: '#06B6D4' // Cyan-core
  },
  T2: {
    code: 'T2',
    labelZh: '善',
    propertyEn: 'transparent',
    titleZh: '治理之善 (Goodness)',
    descriptionEn: 'Algorithmically verifiable: Zero-hallucination ISO standards.',
    color: '#10B981' // Emerald-soul
  },
  T3: {
    code: 'T3',
    labelZh: '美',
    propertyEn: 'tangible',
    titleZh: '演化之美 (Beauty)',
    descriptionEn: 'UI/UX Excellence: Liquid Glass with mechanical precision.',
    color: '#219EBC' // Optimal-blue
  },
  T4: {
    code: 'T4',
    labelZh: '通',
    propertyEn: 'trackable',
    titleZh: '透明之通 (Transferful)',
    descriptionEn: 'Lifecycle-aware: Real-time tracking via data hooks.',
    color: '#FFB703' // Critical-amber (for awareness)
  },
  T5: {
    code: 'T5',
    labelZh: '信',
    propertyEn: 'trustworthy',
    titleZh: '誠信之結 (Trust)',
    descriptionEn: 'Cryptographically secured: Ultimate Hash Lock & freeze.',
    color: '#003262' // Berkeley-blue
  }
};

export interface GateValidationResult {
  readonly gate: ProtocolGateCode;
  readonly passed: boolean;
  readonly timestamp: number;
  readonly evidencePath: string;
  readonly messageZh: string;
  readonly hashLock?: string;
}
