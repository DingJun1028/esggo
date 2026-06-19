/**
// Classified under: 永續影響層 (ESG Impact Layer) & 信任治理層 (Trust & Governance Layer)
 * 💡 奧秘組件心核：供應商得分服務 (SupplierScoringService)
 * --------------------------------------------------
 * [協議] 創價型 ESG - 供應鏈策略優化
 */

import { trustProtocolService } from './TrustProtocolService';

export interface SupplierMetrics {
  dataTrustIndex: number; // D: 3+1 協議達成率 (0-1)
  emissionIntensity: number; // I: 單位產值碳排 (低者得分高)
  reductionCommitment: number; // C: SBTi/RE100 參與度 (0-1)
  responseSpeed: number; // R: API 對接頻率 (0-1)
}

export type SupplierGrade = 'S' | 'A' | 'B' | 'C';

export interface SupplierScore {
  supplierId: string;
  supplierName: string;
  totalScore: number;
  grade: SupplierGrade;
  advice: string;
  trustMeta?: {
    hash: string;
    sealedAt: string;
  };
}

export class SupplierScoringService {
  /**
   * 計算供應商總分與等級
   * 公式：S = (Wd * D) + (Wi * I) + (Wc * C) + (Wr * R)
   * 並透過 TrustProtocol 進行加密鎖定
   */
  static async calculateScore(
    id: string,
    name: string,
    metrics: SupplierMetrics
  ): Promise<SupplierScore> {
    const Wd = 0.4,
      Wi = 0.3,
      Wc = 0.2,
      Wr = 0.1;

    // 假設 I 已經過歸一化處理，越高代表碳效能越好
    const total =
      (metrics.dataTrustIndex * Wd +
        metrics.emissionIntensity * Wi +
        metrics.reductionCommitment * Wc +
        metrics.responseSpeed * Wr) *
      100;

    let grade: SupplierGrade = 'C';
    let advice = '';

    if (total >= 90) {
      grade = 'S';
      advice = '核心戰略夥伴：優先採購，建議啟動深度低碳產品研發補貼。';
    } else if (total >= 75) {
      grade = 'A';
      advice = '優質合規廠商：維持現狀，鼓勵從金額法過渡至活動法基礎核算。';
    } else if (total >= 60) {
      grade = 'B';
      advice = '觀察/輔導對象：建議在 1 季內要求補齊 🟢 可溯源 證據鏈。';
    } else {
      grade = 'C';
      advice = '高風險供應源：數據不透明且碳效能低下，建議啟動供應商替換評估。';
    }

    const rawScore: SupplierScore = {
      supplierId: id,
      supplierName: name,
      totalScore: parseFloat(total.toFixed(2)),
      grade,
      advice,
    };

    // 🔗 TrustProtocol Integration: Immutable Seal
    const sealed = await trustProtocolService.sealGeneric(rawScore);

    return {
      ...sealed.data,
      trustMeta: {
        hash: sealed.hash,
        sealedAt: sealed.sealedAt,
      },
    };
  }
}
