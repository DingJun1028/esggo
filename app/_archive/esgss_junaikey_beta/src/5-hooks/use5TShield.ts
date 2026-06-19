/**
 * 🛡️ use5TShield (5T 協議防護罩)
 * --------------------------------------------------
 * [系列] 奧秘元鑰 (JunAiKey) 技術體系
 * [功能] 自動驗證數據對象是否符合 5T v8.0 (4可1不可) 規範。
 * [邏輯] 透過計算 trustworthy_hash 並與數據對象進行比對，確保數據真實性。
 */

import { useMemo } from 'react';
import { IComponentCore } from '../0-domain/contracts/IComponentCore';
import { TrustworthyLock } from '../utils/TrustworthyLock';

// 🏛️ Sovereign Protocol Standards
const MAX_SCORE = 100;
const DIMENSION_COUNT = 4;
const SUCCESS_MULTIPLIER = 1;

export interface ShieldStatus {
  isValid: boolean;
  tampered: boolean;
  score: number; // 0-100
  dimensions: {
    tangible: boolean; // 1. 可感知 (Tangible)
    traceable: boolean; // 2. 可溯源 (Traceable)
    trackable: boolean; // 3. 可追蹤 (Trackable)
    transparent: boolean; // 4. 可透明驗算 (Transparent)
  };
}

export function use5TShield(data: IComponentCore | any): ShieldStatus {
  return useMemo(() => {
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        tampered: false,
        score: 0,
        dimensions: {
          tangible: false,
          traceable: false,
          trackable: false,
          transparent: false,
        },
      };
    }

    // Support both IComponentCore (v8.0) and legacy structures if needed
    const evidenceMap = data.evidence || {};
    const legacyProto =
      data['5T_Protocol'] ||
      (data.evidence && !Object.values(data.evidence).some((e: any) => e?.sourceOrigin)
        ? data.evidence
        : null);

    const evidenceItems = Object.values(evidenceMap);

    // 1. 檢驗 4可 維度 (The Logic Gates)
    const traceable =
      evidenceItems.some((e: any) => !!e.sourceOrigin) ||
      !!data.uuid ||
      !!legacyProto?.traceable?.source_origin ||
      !!legacyProto?.source_origin;

    const tangible =
      evidenceItems.some((e: any) => !!e.impactMetric) ||
      (!!data.data && Object.keys(data.data).length > 0) ||
      (!!legacyProto?.metrics && Object.keys(legacyProto.metrics).length > 0);

    const transparent =
      evidenceItems.some((e: any) => !!e.verificationMethod) ||
      !!data.formula ||
      !!legacyProto?.logic_formula ||
      !!legacyProto?.transparent;

    const trackable =
      (!!data.timestamp && !!data.version) ||
      (Array.isArray(legacyProto?.lifecycle_hooks) && legacyProto.lifecycle_hooks.length > 0) ||
      !!legacyProto?.trackable;

    const dimensions = {
      tangible,
      traceable,
      trackable,
      transparent,
    };

    // 2. 檢驗 1不可 (Trustworthy Lock)
    const isTrustworthy = data.status === 'Trustworthy';

    // Real tamper check: Re-calculate hash and compare
    let tampered = false;
    if (data.evidence?.trustworthy?.hash_lock) {
      const dataToHash = {
        uuid: data.uuid,
        timestamp: data.timestamp,
        formula: data.formula,
        impactMetric: data.impactMetric,
        evidence: {
          tangible: data.evidence.tangible,
          traceable: data.evidence.traceable,
          trackable: data.evidence.trackable,
          transparent: data.evidence.transparent,
        },
      };
      const realHash = TrustworthyLock.generateHashSync(dataToHash);
      tampered = realHash !== data.evidence.trustworthy.hash_lock;
    }

    // 3. 計算評分 (4+1 State Machine)
    const passedDimensions = Object.values(dimensions).filter(Boolean).length;
    let calculatedScore = (passedDimensions / DIMENSION_COUNT) * MAX_SCORE;

    if (isTrustworthy) {
      calculatedScore = calculatedScore * SUCCESS_MULTIPLIER;
    }

    return {
      isValid: passedDimensions === DIMENSION_COUNT && isTrustworthy && !tampered,
      tampered,
      score: Math.min(calculatedScore, MAX_SCORE),
      dimensions,
    };
  }, [data]);
}
