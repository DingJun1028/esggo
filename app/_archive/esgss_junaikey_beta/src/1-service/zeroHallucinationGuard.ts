/**
 * ✅ Zero-Hallucination Guard
 * --------------------------------------------------
 * [核心] 零幻覺防護系統
 * [功能] 驗證回應真實性，不確定時拒絕回答
 */

import { omniLogger, LogCategory } from './omniLogger';

export interface ICitation {
  [key: string]: unknown;
}

export interface VerificationResult {
  is_verified: boolean;
  confidence: number;
  issues: string[];
  suggestions: string[];
}

export interface FactCheckResult {
  claim: string;
  is_factual: boolean;
  evidence: string[];
  confidence: number;
}

class ZeroHallucinationGuard {
  private readonly MIN_CONFIDENCE = 0.7; // 最低信心度閾值

  /**
   * 驗證回應
   */
  async verify(response: string, citations: ICitation[]): Promise<VerificationResult> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 1. 檢查是否有引用
    if (citations.length === 0) {
      issues.push('缺少來源引用');
      suggestions.push('請提供可驗證的來源');
    }

    // 2. 檢查是否包含不確定性詞彙
    const uncertainPhrases = ['可能', '也許', '大概', 'maybe', 'perhaps', 'possibly'];
    const hasUncertainty = uncertainPhrases.some(phrase => response.toLowerCase().includes(phrase));

    if (hasUncertainty) {
      issues.push('回應包含不確定性表述');
    }

    // 3. 檢查是否包含絕對化詞彙（可能是幻覺）
    const absolutePhrases = ['絕對', '一定', '必然', 'always', 'never', 'definitely'];
    const hasAbsolute = absolutePhrases.some(phrase => response.toLowerCase().includes(phrase));

    if (hasAbsolute && citations.length < 2) {
      issues.push('絕對化表述缺乏足夠證據');
      suggestions.push('請提供更多來源支持');
    }

    // 4. 計算整體信心度
    const confidence = this.calculateOverallConfidence(citations, issues);

    const is_verified = confidence >= this.MIN_CONFIDENCE && issues.length === 0;

    omniLogger.info(LogCategory.SYSTEM, 'ZeroHallucination: Response verification', {
      is_verified,
      confidence,
      issues_count: issues.length,
    });

    return {
      is_verified,
      confidence,
      issues,
      suggestions,
    };
  }

  /**
   * 事實檢查
   */
  async checkFact(claim: string): Promise<FactCheckResult> {
    // 這裡應該調用外部事實檢查 API
    // 暫時返回基本檢查結果

    const evidence: string[] = [];
    const is_factual = true;
    let confidence = 0.5;

    // 檢查是否包含數字（數字聲明需要更高證據）
    const hasNumbers = /\d+/.test(claim);
    if (hasNumbers) {
      confidence = 0.3; // 降低信心度，需要更多證據
    }

    return {
      claim,
      is_factual,
      evidence,
      confidence,
    };
  }

  /**
   * 決定是否應該拒絕回答
   */
  shouldRefuse(confidence: number, verification: VerificationResult): boolean {
    // 信心度過低
    if (confidence < this.MIN_CONFIDENCE) {
      return true;
    }

    // 有嚴重問題
    if (verification.issues.length > 2) {
      return true;
    }

    return false;
  }

  /**
   * 生成拒絕回答的訊息
   */
  generateRefusalMessage(language: 'zh-TW' | 'en' = 'zh-TW'): string {
    if (language === 'zh-TW') {
      return (
        '抱歉，我對這個問題沒有足夠的信心提供準確回答。為了避免提供錯誤資訊，我建議您：\n' +
        '1. 提供更多上下文資訊\n' +
        '2. 查閱可靠的資料來源\n' +
        '3. 諮詢相關領域專家'
      );
    } else {
      return (
        "I apologize, but I don't have sufficient confidence to provide an accurate answer. " +
        'To avoid misinformation, I suggest:\n' +
        '1. Provide more context\n' +
        '2. Consult reliable sources\n' +
        '3. Seek expert advice'
      );
    }
  }

  /**
   * 計算整體信心度
   */
  private calculateOverallConfidence(citations: ICitation[], issues: string[]): number {
    let confidence = 1.0;

    // 根據引用數量調整
    if (citations.length === 0) {
      confidence *= 0.3;
    } else if (citations.length === 1) {
      confidence *= 0.6;
    } else {
      confidence *= 0.9;
    }

    // 根據問題數量調整
    confidence *= Math.max(0.1, 1 - issues.length * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }
}

// 單例實例
export const zeroHallucinationGuard = new ZeroHallucinationGuard();
