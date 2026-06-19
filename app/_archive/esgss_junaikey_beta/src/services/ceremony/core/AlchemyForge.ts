/**
 * @esgss/jun-ai-ceremony
 * AlchemyForge（熵減煉金爐）
 * 
 * 實現熵減轉換與 Rs 共鳴計算
 * 遵循 W4 聖典執行手冊規範
 */


import { IComponentCore, ISealedData, ComponentCoreFactory, generateOmniUUID, computeHash, createSealedObject } from './IComponentCore.js';

/**
 * 共鳴評估結果
 */
export interface ResonanceResult {
  /** Rs 共鳴分數 (0-100) */
  rs_score: number;
  /** 共鳴等級 */
  tier: 'Coal' | 'Seed' | 'Pulse';
  /** 熵減係數 */
  entropy_coefficient: number;
  /** 轉換效率 */
  conversion_efficiency: number;
  /** 淨化建議 */
  purification_suggestions: string[];
}

/**
 * 煉金轉換配置
 */
export interface AlchemyConfig {
  /** 目標版本 */
  target_version?: string;
  /** 最小 Rs 分數閾值 */
  min_rs_threshold?: number;
  /** 啟用淨化 */
  enable_purification?: boolean;
  /** 自定義證據 */
  custom_evidence?: string[];
}

/**
 * AlchemyForge - 熵減煉金核心引擎
 * 
 * 功能：
 * 1. calculateResonance(data) - 計算 Rs 靈魂共鳴值
 * 2. seal(data) - 執行 Hash Lock
 * 3. transmute(data) - 熵減轉換
 */
export class AlchemyForge {
  private config: Required<AlchemyConfig>;

  constructor(config: AlchemyConfig = {}) {
    this.config = {
      target_version: config.target_version || '1.0.0',
      min_rs_threshold: config.min_rs_threshold || 50,
      enable_purification: config.enable_purification ?? true,
      custom_evidence: config.custom_evidence || []
    };
  }

  /**
   * 計算資料的 Rs 靈魂共鳴值
   * 
   * @param data - 要計算共鳴的資料
   * @param source_origin - 來源標識
   * @returns ResonanceResult - 共鳴評估結果
   */
  calculateResonance(
    data: Record<string, unknown>,
    source_origin: string
  ): ResonanceResult {
    const dataString = JSON.stringify(data);
    const hash = computeHash(dataString);

    // 計算複雜度分數
    const complexityScore = this.calculateComplexity(data);

    // 計算一致性分數
    const consistencyScore = this.calculateConsistency(data, hash);

    // 計算完整性分數
    const integrityScore = this.calculateIntegrity(data);

    // Rs 共鳴公式：綜合評估複雜度、一致性和完整性
    const rs_score = Math.round(
      (complexityScore * 0.3 + consistencyScore * 0.4 + integrityScore * 0.3) * 100
    );

    // 熵減係數
    const entropy_coefficient = this.calculateEntropyCoefficient(rs_score);

    // 轉換效率
    const conversion_efficiency = this.calculateConversionEfficiency(entropy_coefficient);

    // 確定等級
    const tier = this.determineTier(rs_score);

    // 淨化建議
    const purification_suggestions = this.generatePurificationSuggestions(rs_score, {
      complexity: complexityScore,
      consistency: consistencyScore,
      integrity: integrityScore
    });

    return {
      rs_score,
      tier,
      entropy_coefficient,
      conversion_efficiency,
      purification_suggestions
    };
  }

  /**
   * 執行 Hash Lock - 密封資料
   * 
   * @param data - 要密封的資料
   * @param source_origin - 來源標識
   * @returns ISealedData - 密封後的資料
   */
  seal(data: Record<string, unknown>, source_origin: string): ISealedData {
    const resonance = this.calculateResonance(data, source_origin);

    // 創建核心
    const evidence = [
      ...this.config.custom_evidence,
      `Rs Score: ${resonance.rs_score}`,
      `Sealed at: ${new Date().toISOString()}`,
      `Entropy Coefficient: ${resonance.entropy_coefficient.toFixed(4)}`
    ];

    const core = ComponentCoreFactory.createSealed(
      source_origin,
      data,
      resonance.rs_score,
      resonance.tier
    );

    // 返回密封的資料
    return {
      ...core,
      evidence: [...core.evidence, ...evidence]
    };
  }

  /**
   * 熵減轉換 - 將資料轉換為高共鳴狀態
   * 
   * @param data - 原始資料
   * @param source_origin - 來源標識
   * @returns ISealedData - 轉換後的密封資料
   */
  transmute(data: Record<string, unknown>, source_origin: string): ISealedData {
    // 先計算共鳴
    const resonance = this.calculateResonance(data, source_origin);

    // 如果需要淨化
    if (this.config.enable_purification && resonance.rs_score < this.config.min_rs_threshold) {
      // 執行淨化處理
      data = this.purifyData(data, resonance.purification_suggestions);
      // 重新計算共鳴
      resonance.rs_score = this.calculateResonance(data, source_origin).rs_score;
    }

    // 密封資料
    return this.seal(data, source_origin);
  }

  /**
   * 計算資料複雜度
   */
  private calculateComplexity(data: Record<string, unknown>): number {
    const dataString = JSON.stringify(data);
    const uniqueChars = new Set(dataString).size;
    const totalChars = dataString.length;

    // 複雜度基於唯一字符比例
    return Math.min(1, uniqueChars / Math.max(totalChars, 1));
  }

  /**
   * 計算資料一致性
   */
  private calculateConsistency(data: Record<string, unknown>, hash: string): number {
    // 一致性基於 Hash 的某些特性
    const hashNumber = parseInt(hash.substring(0, 8), 16);
    const normalized = hashNumber / 0xFFFFFFFF;

    // 添加一些結構一致性檢查
    const hasNestedObjects = JSON.stringify(data).includes('{');
    const structureScore = hasNestedObjects ? 0.8 : 0.5;

    return (normalized * 0.5 + structureScore * 0.5);
  }

  /**
   * 計算資料完整性
   */
  private calculateIntegrity(data: Record<string, unknown>): number {
    const dataString = JSON.stringify(data);

    // 檢查是否包含必要字段
    const hasRequiredFields = ['uuid', 'version', 'timestamp'].every(
      field => dataString.includes(`"${field}"`)
    );

    // 檢查 JSON 格式是否完整
    let isValidJson = false;
    try {
      JSON.parse(dataString);
      isValidJson = true;
    } catch {
      isValidJson = false;
    }

    return (hasRequiredFields ? 0.6 : 0) + (isValidJson ? 0.4 : 0);
  }

  /**
   * 計算熵減係數
   */
  private calculateEntropyCoefficient(rs_score: number): number {
    // 熵減係數與 Rs 分數正相關
    // Rs 越高，熵減越多
    const normalizedRs = rs_score / 100;

    // 使用非線性函數使高分更顯著
    return Math.pow(normalizedRs, 1.5);
  }

  /**
   * 計算轉換效率
   */
  private calculateConversionEfficiency(entropy_coefficient: number): number {
    // 轉換效率 = 熵減係數 * 100%
    return Math.min(100, Math.round(entropy_coefficient * 100));
  }

  /**
   * 確定 SBT 等級
   */
  private determineTier(rs_score: number): 'Coal' | 'Seed' | 'Pulse' {
    if (rs_score >= 80) return 'Pulse';
    if (rs_score >= 50) return 'Seed';
    return 'Coal';
  }

  /**
   * 生成淨化建議
   */
  private generatePurificationSuggestions(
    rs_score: number,
    scores: { complexity: number; consistency: number; integrity: number }
  ): string[] {
    const suggestions: string[] = [];

    if (scores.complexity < 0.5) {
      suggestions.push('Increase data diversity and complexity');
    }
    if (scores.consistency < 0.5) {
      suggestions.push('Improve data structural consistency');
    }
    if (scores.integrity < 0.6) {
      suggestions.push('Ensure data contains all required fields');
    }
    if (rs_score < 30) {
      suggestions.push('Suggest complete reconstruction of data structure');
    }

    return suggestions.length > 0
      ? suggestions
      : ['Data quality is good, no purification needed'];
  }

  /**
   * 淨化資料
   */
  private purifyData(
    data: Record<string, unknown>,
    suggestions: string[]
  ): Record<string, unknown> {
    // 深拷貝以避免修改原始資料
    const purified = JSON.parse(JSON.stringify(data));

    // 確保包含必要字段
    if (!purified.uuid) {
      purified.uuid = generateOmniUUID('purification');
    }
    if (!purified.version) {
      purified.version = this.config.target_version;
    }
    if (!purified.timestamp) {
      purified.timestamp = Date.now();
    }

    // 添加淨化記錄
    purified._purified = {
      timestamp: Date.now(),
      suggestions
    };

    return purified;
  }

  /**
   * 驗證密封資料的完整性
   */
  verifySeal(sealedData: ISealedData): boolean {
    const { hash_lock, ...data } = sealedData;
    const dataString = JSON.stringify(data);
    const computedHash = computeHash(dataString);

    return computedHash === hash_lock;
  }

  /**
   * 提取密封資料中的資料部分
   */
  extractData<T = Record<string, unknown>>(sealedData: ISealedData): T {
    const { uuid, version, timestamp, source_origin, evidence, rs_score, sbt_tier, hash_lock, ...data } = sealedData;
    return data as T;
  }
}

/**
 * 創建預設配置的 AlchemyForge 實例
 */
export function createAlchemyForge(config?: AlchemyConfig): AlchemyForge {
  return new AlchemyForge(config);
}
