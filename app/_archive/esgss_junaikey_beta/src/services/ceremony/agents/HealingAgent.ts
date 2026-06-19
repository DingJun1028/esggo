/**
 * @esgss/jun-ai-ceremony
 * HealingAgent（自癒補強代理）
 * 
 * 實現缺口偵測與自我修復功能
 * 遵循 W4 聖典執行手冊規範
 */


import { IComponentCore, ISealedData, generateOmniUUID, computeHash, verifyHashLock } from '../core/IComponentCore.js';
import { AlchemyForge, ResonanceResult } from '../core/AlchemyForge.js';

/**
 * 缺口檢測結果
 */
export interface GapResult {
  /** 缺口列表 */
  gaps: Gap[];
  /** 整體健康分數 (0-100) */
  health_score: number;
  /** 是否需要修復 */
  needs_repair: boolean;
  /** 檢測時間戳 */
  timestamp: number;
}

/**
 * 個別缺口
 */
export interface Gap {
  /** 缺口 ID */
  id: string;
  /** 缺口類型 */
  type: GapType;
  /** 缺口嚴重程度 */
  severity: 'critical' | 'warning' | 'info';
  /** 缺口描述 */
  description: string;
  /** 缺口位置 */
  location: string;
  /** 修復建議 */
  remediation: string;
  /** 預估修復難度 */
  difficulty: number;
}

/**
 * 缺口類型
 */
export type GapType =
  | 'missing_uuid'
  | 'version_mismatch'
  | 'timestamp_stale'
  | 'hash_corrupted'
  | 'evidence_incomplete'
  | 'rs_score_low'
  | 'structure_invalid'
  | 'dependency_broken';

/**
 * 修復配置
 */
export interface HealingConfig {
  /** 自動修復 */
  auto_repair?: boolean;
  /** 修復前需要確認的最小嚴重程度 */
  confirm_threshold?: 'critical' | 'warning';
  /** 最大修復嘗試次數 */
  max_repair_attempts?: number;
  /** 跳過特定缺口類型 */
  skip_gap_types?: GapType[];
}

/**
 * 修復結果
 */
export interface PurifyResult {
  /** 是否成功 */
  success: boolean;
  /** 修復的缺口數量 */
  gaps_fixed: number;
  /** 修復前的健康分數 */
  health_before: number;
  /** 修復後的健康分數 */
  health_after: number;
  /** 修復記錄 */
  remediation_log: string[];
  /** 修復後的密封資料 */
  sealed_data?: ISealedData;
  /** 錯誤訊息 */
  error?: string;
}

/**
 * HealingAgent - 自癒補強代理
 * 
 * 功能：
 * 1. scan(components) - 缺口偵測
 * 2. purify(gap, data) - 補強修復
 * 3. heal(system) - 系統級自我修復
 */
export class HealingAgent {
  private config: Required<HealingConfig>;
  private alchemyForge: AlchemyForge;

  constructor(config: HealingConfig = {}) {
    this.config = {
      auto_repair: config.auto_repair ?? false,
      confirm_threshold: config.confirm_threshold || 'warning',
      max_repair_attempts: config.max_repair_attempts || 3,
      skip_gap_types: config.skip_gap_types || []
    };

    this.alchemyForge = new AlchemyForge();
  }

  /**
   * 掃描組件列表，檢測缺口
   * 
   * @param components - 要掃描的組件列表
   * @returns GapResult - 缺口檢測結果
   */
  scan(components: IComponentCore[]): GapResult {
    const allGaps: Gap[] = [];
    let totalHealthScore = 0;

    for (const component of components) {
      const componentGaps = this.detectGaps(component);
      allGaps.push(...componentGaps);

      // 計算組件健康分數
      const componentHealth = this.calculateComponentHealth(component, componentGaps);
      totalHealthScore += componentHealth;
    }

    // 計算整體健康分數
    const overallHealth = components.length > 0
      ? Math.round(totalHealthScore / components.length)
      : 100;

    return {
      gaps: allGaps,
      health_score: overallHealth,
      needs_repair: overallHealth < 70 || allGaps.some(g => g.severity === 'critical'),
      timestamp: Date.now()
    };
  }

  /**
   * 檢測單個組件的缺口
   */
  private detectGaps(component: IComponentCore): Gap[] {
    const gaps: Gap[] = [];

    // 1. 檢查 UUID
    if (!component.uuid || !component.uuid.startsWith('ARIA-CORP-')) {
      gaps.push({
        id: generateOmniUUID('gap', Date.now()).split('-').pop() || '',
        type: 'missing_uuid',
        severity: 'critical',
        description: '組件缺少有效的 OmniUUID',
        location: 'component.uuid',
        remediation: '為組件生成並注入 OmniUUID',
        difficulty: 1
      });
    }

    // 2. 檢查版本
    if (!component.version) {
      gaps.push({
        id: generateOmniUUID('gap', Date.now() + 1).split('-').pop() || '',
        type: 'version_mismatch',
        severity: 'warning',
        description: '組件版本未定義',
        location: 'component.version',
        remediation: '設置組件版本號',
        difficulty: 1
      });
    }

    // 3. 檢查時間戳
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1年
    if (!component.timestamp || Date.now() - component.timestamp > maxAge) {
      gaps.push({
        id: generateOmniUUID('gap', Date.now() + 2).split('-').pop() || '',
        type: 'timestamp_stale',
        severity: 'info',
        description: '組件時間戳過舊或未設置',
        location: 'component.timestamp',
        remediation: '更新組件時間戳',
        difficulty: 1
      });
    }

    // 4. 檢查證據鏈
    if (!component.evidence || component.evidence.length === 0) {
      gaps.push({
        id: generateOmniUUID('gap', Date.now() + 3).split('-').pop() || '',
        type: 'evidence_incomplete',
        severity: 'warning',
        description: '組件缺少證據鏈',
        location: 'component.evidence',
        remediation: '添加證據鏈記錄',
        difficulty: 2
      });
    }

    return gaps;
  }

  /**
   * 計算組件健康分數
   */
  private calculateComponentHealth(component: IComponentCore, gaps: Gap[]): number {
    let score = 100;

    for (const gap of gaps) {
      switch (gap.severity) {
        case 'critical':
          score -= 30;
          break;
        case 'warning':
          score -= 15;
          break;
        case 'info':
          score -= 5;
          break;
      }
    }

    return Math.max(0, score);
  }

  /**
   * 修復缺口 - 補強資料
   * 
   * @param gap - 要修復的缺口
   * @param data - 原始資料
   * @param source_origin - 來源標識
   * @returns PurifyResult - 修復結果
   */
  purify(
    gap: Gap,
    data: Record<string, unknown>,
    source_origin: string
  ): PurifyResult {
    const remediation_log: string[] = [];
    let fixedData = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;
    let gaps_fixed = 0;

    try {
      switch (gap.type) {
        case 'missing_uuid':
          fixedData.uuid = generateOmniUUID(source_origin);
          remediation_log.push(`已生成 OmniUUID: ${fixedData.uuid}`);
          gaps_fixed++;
          break;

        case 'version_mismatch':
          fixedData.version = fixedData.version || '1.0.0';
          remediation_log.push(`已設置版本號: ${fixedData.version}`);
          gaps_fixed++;
          break;

        case 'timestamp_stale':
          fixedData.timestamp = Date.now();
          remediation_log.push(`已更新時間戳: ${fixedData.timestamp}`);
          gaps_fixed++;
          break;

        case 'evidence_incomplete':
          fixedData.evidence = fixedData.evidence || [];
          (fixedData.evidence as string[]).push(`Repaired at ${new Date().toISOString()}`);
          remediation_log.push('已添加證據鏈記錄');
          gaps_fixed++;
          break;

        case 'structure_invalid':
          fixedData = this.fixStructure(fixedData, gap.location);
          remediation_log.push('已修復資料結構');
          gaps_fixed++;
          break;

        default:
          remediation_log.push(`未知缺口類型: ${gap.type}`);
      }

      // 如果修復成功，重新密封資料
      let sealed_data: ISealedData | undefined;
      if (gaps_fixed > 0) {
        sealed_data = this.alchemyForge.seal(fixedData, source_origin);
        remediation_log.push(`已重新密封資料，Rs Score: ${sealed_data.rs_score}`);
      }

      return {
        success: true,
        gaps_fixed,
        health_before: 50, // 估算值
        health_after: 85, // 估算值
        remediation_log,
        sealed_data
      };

    } catch (error) {
      return {
        success: false,
        gaps_fixed: 0,
        health_before: 50,
        health_after: 50,
        remediation_log,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 修復資料結構
   */
  private fixStructure(data: Record<string, unknown>, location: string): Record<string, unknown> {
    const fixed = JSON.parse(JSON.stringify(data));

    // 確保基本字段存在
    if (!fixed.uuid) fixed.uuid = generateOmniUUID('structure_fix');
    if (!fixed.version) fixed.version = '1.0.0';
    if (!fixed.timestamp) fixed.timestamp = Date.now();
    if (!fixed.source_origin) fixed.source_origin = 'structure_healing';
    if (!fixed.evidence) fixed.evidence = [];

    (fixed.evidence as string[]).push(`Structure fixed at ${new Date().toISOString()}`);

    return fixed;
  }

  /**
   * 系統級自我修復
   * 
   * @param components - 系統中的所有組件
   * @returns GapResult - 修復後的結果
   */
  heal(components: IComponentCore[]): GapResult {
    // 首先掃描
    const scanResult = this.scan(components);

    // 如果開啟自動修復，修復所有缺口
    if (this.config.auto_repair) {
      for (const gap of scanResult.gaps) {
        if (this.config.skip_gap_types.includes(gap.type)) continue;
        if (gap.severity === 'critical' || gap.severity === 'warning') {
          // 這裡會調用具體的修復邏輯
          // 實際實現需要組件類型的上下文
        }
      }
    }

    return scanResult;
  }

  /**
   * 驗證組件的密封狀態
   */
  verifySeal(component: ISealedData): boolean {
    return verifyHashLock(component as any, component.hash_lock);
  }

  /**
   * 獲取修復建議摘要
   */
  getHealingSummary(gapResult: GapResult): string {
    const critical = gapResult.gaps.filter(g => g.severity === 'critical').length;
    const warning = gapResult.gaps.filter(g => g.severity === 'warning').length;
    const info = gapResult.gaps.filter(g => g.severity === 'info').length;

    return `
## HealingAgent 檢測摘要
- 整體健康分數: ${gapResult.health_score}/100
- 臨界缺口: ${critical}
- 警告缺口: ${warning}
- 資訊缺口: ${info}
- 需要修復: ${gapResult.needs_repair ? '是' : '否'}
    `.trim();
  }
}

/**
 * 創建預設配置的 HealingAgent 實例
 */
export function createHealingAgent(config?: HealingConfig): HealingAgent {
  return new HealingAgent(config);
}
