/**
 * @esgss/jun-ai-ceremony
 * T5TValidator（5T 協議驗證器）
 * 
 * Tangible, Traceable, Trackable, Transparent, Trustworthy
 * 遵循 W4 聖典執行手冊規範
 */


import {
  IT5TProtocol,
  ITangible,
  ITraceable,
  ITrackable,
  ITransparent,
  ITrustworthy,
  T5TComplianceResult,
  ModificationRecord,
  StateRecord,
  AuditEntry,
  TrustRecord,
  T5TProtocolFactory
} from './types/T5TProtocol.js';
import { computeHash, generateOmniUUID } from './core/IComponentCore.js';

/**
 * 深度凍結配置
 */
export interface DeepFreezeConfig {
  /** 遞歸深度限制 */
  maxDepth?: number;
  /** 排除的屬性名稱 */
  excludedProperties?: string[];
  /** 是否監視篡改 */
  enableTamperDetection?: boolean;
}

/**
 * 篡改檢測記錄
 */
export interface TamperRecord {
  /** 檢測時間 */
  timestamp: number;
  /** 屬性路徑 */
  propertyPath: string;
  /** 原始值 */
  originalValue: unknown;
  /** 嘗試修改的值 */
  attemptedValue: unknown;
  /** 檢測器 ID */
  detectorId: string;
}

/**
 * 合規報告生成配置
 */
export interface ComplianceReportConfig {
  /** 報告標題 */
  title?: string;
  /** 包含詳細建議 */
  includeRecommendations?: boolean;
  /** 包含歷史記錄 */
  includeHistory?: boolean;
  /** 輸出格式 */
  format: 'json' | 'markdown' | 'html';
}

/**
 * 5T 驗證詳細結果
 */
export interface T5TValidationDetail {
  /** Tangible 驗證結果 */
  tangible: {
    passed: boolean;
    score: number;
    details: string[];
  };
  /** Traceable 驗證結果 */
  traceable: {
    passed: boolean;
    score: number;
    details: string[];
  };
  /** Trackable 驗證結果 */
  trackable: {
    passed: boolean;
    score: number;
    details: string[];
  };
  /** Transparent 驗證結果 */
  transparent: {
    passed: boolean;
    score: number;
    details: string[];
  };
  /** Trustworthy 驗證結果 */
  trustworthy: {
    passed: boolean;
    score: number;
    details: string[];
  };
}

/**
 * 5TValidator - 5T 協議完整驗證器
 * 
 * 功能：
 * 1. validateTangible() - 驗證可觸知性
 * 2. validateTraceable() - 驗證可追溯性
 * 3. validateTrackable() - 驗證可追蹤性
 * 4. validateTransparent() - 驗證透明性
 * 5. validateTrustworthy() - 驗證可信賴性
 * 6. deepFreeze() - 深度凍結物件
 * 7. detectTamper() - 篡改檢測
 * 8. generateComplianceReport() - 合規報告生成
 */
export class T5TValidator {
  private tamperRecords: TamperRecord[] = [];
  private frozenObjects: Map<object, DeepFreezeConfig> = new Map();

  constructor() {
    // 初始化驗證器
  }

  /**
   * 驗證完整的 5T 協議
   */
  validateProtocol(protocol: IT5TProtocol): T5TValidationDetail {
    const tangibleResult = this.validateTangible(protocol.tangible);
    const traceableResult = this.validateTraceable(protocol.traceable);
    const trackableResult = this.validateTrackable(protocol.trackable);
    const transparentResult = this.validateTransparent(protocol.transparent);
    const trustworthyResult = this.validateTrustworthy(protocol.trustworthy);

    return {
      tangible: tangibleResult,
      traceable: traceableResult,
      trackable: trackableResult,
      transparent: transparentResult,
      trustworthy: trustworthyResult
    };
  }

  /**
   * 驗證 Tangible（可觸知性）
   * 
   * 確保 UI 組件可以被驗證和確認
   */
  validateTangible(tangible: ITangible): {
    passed: boolean;
    score: number;
    details: string[];
  } {
    const details: string[] = [];
    let score = 0;

    // 驗證指紋是否存在
    if (tangible.fingerprint && tangible.fingerprint.length > 0) {
      score += 30;
      details.push('✓ 數位指紋已生成');
    } else {
      details.push('✗ 缺少數位指紋');
    }

    // 驗證是否已驗證
    if (tangible.verified) {
      score += 40;
      details.push('✓ 組件已通過驗證');
      if (tangible.verified_at) {
        details.push(`  驗證時間: ${new Date(tangible.verified_at).toISOString()}`);
      }
    } else {
      details.push('✗ 組件尚未驗證');
    }

    // 驗證方法
    if (tangible.verification_method && tangible.verification_method.length > 0) {
      score += 30;
      details.push(`✓ 驗證方法: ${tangible.verification_method}`);
    } else {
      details.push('✗ 缺少驗證方法');
    }

    return {
      passed: score >= 70,
      score,
      details
    };
  }

  /**
   * 驗證 Traceable（可追溯性）
   * 
   * 確保組件的歷史可以被追溯
   */
  validateTraceable(traceable: ITraceable): {
    passed: boolean;
    score: number;
    details: string[];
  } {
    const details: string[] = [];
    let score = 0;

    // 驗證創建時間
    if (traceable.created_at && traceable.created_at > 0) {
      score += 20;
      details.push(`✓ 創建時間: ${new Date(traceable.created_at).toISOString()}`);
    } else {
      details.push('✗ 缺少創建時間');
    }

    // 驗證創建者
    if (traceable.created_by && traceable.created_by.length > 0) {
      score += 20;
      details.push(`✓ 創建者: ${traceable.created_by}`);
    } else {
      details.push('✗ 缺少創建者資訊');
    }

    // 驗證修改歷史
    if (traceable.modification_history && traceable.modification_history.length > 0) {
      score += 30;
      details.push(`✓ 修改歷史記錄數: ${traceable.modification_history.length}`);

      // 顯示最近的修改
      const recentMods = traceable.modification_history.slice(-3);
      recentMods.forEach(mod => {
        details.push(`  - ${new Date(mod.timestamp).toISOString()}: ${mod.modification_type} by ${mod.modified_by}`);
      });
    } else {
      details.push('✗ 無修改歷史記錄');
    }

    // 驗證原始來源
    if (traceable.origin_source && traceable.origin_source.length > 0) {
      score += 30;
      details.push(`✓ 原始來源: ${traceable.origin_source}`);
    } else {
      details.push('✗ 缺少原始來源');
    }

    return {
      passed: score >= 70,
      score,
      details
    };
  }

  /**
   * 驗證 Trackable（可追蹤性）
   * 
   * 確保組件可以被持續監控
   */
  validateTrackable(trackable: ITrackable): {
    passed: boolean;
    score: number;
    details: string[];
  } {
    const details: string[] = [];
    let score = 0;

    // 驗證追蹤 ID
    if (trackable.tracking_id && trackable.tracking_id.length > 0) {
      score += 25;
      details.push(`✓ 追蹤 ID: ${trackable.tracking_id}`);
    } else {
      details.push('✗ 缺少追蹤 ID');
    }

    // 驗證當前狀態
    if (trackable.current_state && trackable.current_state.length > 0) {
      score += 25;
      details.push(`✓ 當前狀態: ${trackable.current_state}`);
    } else {
      details.push('✗ 缺少當前狀態');
    }

    // 驗證狀態歷史
    if (trackable.state_history && trackable.state_history.length > 0) {
      score += 25;
      details.push(`✓ 狀態歷史記錄數: ${trackable.state_history.length}`);
    } else {
      details.push('✗ 無狀態歷史記錄');
    }

    // 驗證監控指標
    if (trackable.metrics) {
      score += 25;
      details.push(`✓ 活躍度: ${trackable.metrics.activity_level}`);
      details.push(`✓ 使用頻率: ${trackable.metrics.usage_frequency}`);
      if (trackable.metrics.last_activity_at) {
        details.push(`  最後活動: ${new Date(trackable.metrics.last_activity_at).toISOString()}`);
      }
    } else {
      details.push('✗ 缺少監控指標');
    }

    return {
      passed: score >= 70,
      score,
      details
    };
  }

  /**
   * 驗證 Transparent（透明性）
   * 
   * 確保組件的運作對所有相關方透明
   */
  validateTransparent(transparent: ITransparent): {
    passed: boolean;
    score: number;
    details: string[];
  } {
    const details: string[] = [];
    let score = 0;

    // 驗證公開策略
    if (transparent.visibility_policy) {
      score += 20;
      details.push(`✓ 公開策略: ${transparent.visibility_policy}`);
    } else {
      details.push('✗ 缺少公開策略');
    }

    // 驗證存取控制列表
    if (transparent.access_control_list && transparent.access_control_list.length > 0) {
      score += 30;
      details.push(`✓ ACL 條目數: ${transparent.access_control_list.length}`);
      transparent.access_control_list.forEach(acl => {
        details.push(`  - ${acl.subject}: ${acl.permissions.join(', ')}`);
      });
    } else {
      details.push('✗ 無存取控制列表');
    }

    // 驗證審計日誌
    if (transparent.audit_log && transparent.audit_log.length > 0) {
      score += 30;
      details.push(`✓ 審計日誌條目數: ${transparent.audit_log.length}`);
    } else {
      details.push('✗ 無審計日誌');
    }

    // 驗證透明性級別
    if (transparent.transparency_level !== undefined) {
      score += 20;
      details.push(`✓ 透明性級別: ${(transparent.transparency_level * 100).toFixed(0)}%`);
    } else {
      details.push('✗ 缺少透明性級別');
    }

    return {
      passed: score >= 70,
      score,
      details
    };
  }

  /**
   * 驗證 Trustworthy（可信賴性）
   * 
   * 確保組件值得信賴
   */
  validateTrustworthy(trustworthy: ITrustworthy): {
    passed: boolean;
    score: number;
    details: string[];
  } {
    const details: string[] = [];
    let score = 0;

    // 驗證信任分數
    if (trustworthy.trust_score !== undefined) {
      score += 30;
      details.push(`✓ 信任分數: ${trustworthy.trust_score}/100`);
    } else {
      details.push('✗ 缺少信任分數');
    }

    // 驗證信任等級
    if (trustworthy.trust_level) {
      score += 20;
      details.push(`✓ 信任等級: ${trustworthy.trust_level}`);
    } else {
      details.push('✗ 缺少信任等級');
    }

    // 驗證信任歷史
    if (trustworthy.trust_history && trustworthy.trust_history.length > 0) {
      score += 25;
      details.push(`✓ 信任歷史記錄數: ${trustworthy.trust_history.length}`);
    } else {
      details.push('✗ 無信任歷史記錄');
    }

    // 驗證認證列表
    if (trustworthy.certifications && trustworthy.certifications.length > 0) {
      score += 25;
      details.push(`✓ 認證數: ${trustworthy.certifications.length}`);
      trustworthy.certifications.forEach(cert => {
        details.push(`  - ${cert.type}: ${cert.issuer}`);
      });
    } else {
      details.push('✗ 無認證');
    }

    return {
      passed: score >= 70,
      score,
      details
    };
  }

  /**
   * 深度凍結物件
   * 
   * 遞歸凍結物件的所有可寫屬性，防止篡改
   */
  deepFreeze<T extends Record<string, unknown>>(
    obj: T,
    config: DeepFreezeConfig = {}
  ): Readonly<T> {
    const maxDepth = config.maxDepth ?? 10;
    const excludedProperties = config.excludedProperties ?? [];

    const freezeRecursive = (target: Record<string, unknown>, depth: number): void => {
      if (depth > maxDepth) return;

      // 凍結當前物件
      Object.freeze(target);

      // 遞歸凍結所有可枚舉的屬性
      Object.getOwnPropertyNames(target).forEach(prop => {
        if (excludedProperties.includes(prop)) return;

        const value = target[prop];
        if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
          if (Array.isArray(value)) {
            Object.freeze(value);
            (value as unknown[]).forEach(item => {
              if (item !== null && typeof item === 'object' && !Object.isFrozen(item)) {
                freezeRecursive(item as Record<string, unknown>, depth + 1);
              }
            });
          } else {
            freezeRecursive(value as Record<string, unknown>, depth + 1);
          }
        }
      });
    };

    freezeRecursive(obj, 0);

    // 記錄被凍結的物件
    if (config.enableTamperDetection ?? true) {
      this.frozenObjects.set(obj, config);
    }

    return Object.freeze(obj) as Readonly<T>;
  }

  /**
   * 啟動篡改檢測監視器
   */
  enableTamperMonitoring(
    obj: object,
    detectorId: string = `detector-${Date.now()}`
  ): () => void {
    const originalProto = Object.getPrototypeOf(obj);
    const handler: ProxyHandler<object> = {
      set: (target, property, value) => {
        this.tamperRecords.push({
          timestamp: Date.now(),
          propertyPath: String(property),
          originalValue: (target as any)[property as string],
          attemptedValue: value,
          detectorId
        });
        console.warn(`[Tamper Detection] 嘗試修改屬性: ${String(property)}`);
        return false; // 拒絕修改
      },
      deleteProperty: (target, property) => {
        this.tamperRecords.push({
          timestamp: Date.now(),
          propertyPath: String(property),
          originalValue: (target as any)[property as string],
          attemptedValue: undefined,
          detectorId
        });
        console.warn(`[Tamper Detection] 嘗試刪除屬性: ${String(property)}`);
        return false; // 拒絕刪除
      }
    };

    const proxy = new Proxy(obj, handler);

    // 存儲代理引用
    return () => {
      // 清理監視器
    };
  }

  /**
   * 獲取篡改檢測記錄
   */
  getTamperRecords(): TamperRecord[] {
    return [...this.tamperRecords];
  }

  /**
   * 清空篡改檢測記錄
   */
  clearTamperRecords(): void {
    this.tamperRecords = [];
  }

  /**
   * 生成合規報告
   */
  generateComplianceReport(
    protocol: IT5TProtocol,
    config: ComplianceReportConfig
  ): string {
    const validation = this.validateProtocol(protocol);
    const compliance = T5TProtocolFactory.calculateCompliance(protocol);

    switch (config.format) {
      case 'json':
        return JSON.stringify({
          title: config.title ?? '5T Protocol Compliance Report',
          generatedAt: new Date().toISOString(),
          validation,
          compliance,
          tamperRecords: config.includeHistory ? this.tamperRecords : undefined
        }, null, 2);

      case 'markdown':
        return this.generateMarkdownReport(protocol, validation, compliance, config);

      case 'html':
        return this.generateHtmlReport(protocol, validation, compliance, config);

      default:
        return JSON.stringify(compliance);
    }
  }

  /**
   * 生成 Markdown 格式報告
   */
  private generateMarkdownReport(
    protocol: IT5TProtocol,
    validation: T5TValidationDetail,
    compliance: T5TComplianceResult,
    config: ComplianceReportConfig
  ): string {
    let report = `# 5T 協議合規報告\n\n`;
    report += `## 基本資訊\n`;
    report += `- 報告標題: ${config.title ?? '5T Protocol Compliance Report'}\n`;
    report += `- 生成時間: ${new Date().toISOString()}\n`;
    report += `- 來源: ${protocol.traceable.origin_source}\n`;
    report += `- 創建者: ${protocol.traceable.created_by}\n`;
    report += `- 追蹤 ID: ${protocol.trackable.tracking_id}\n\n`;

    report += `## 合規評估\n`;
    report += `- **總分數**: ${compliance.overall_score}/100\n`;
    report += `- **合規狀態**: ${compliance.compliance_status.toUpperCase()}\n\n`;

    report += `## 各維度評估\n`;

    // Tangible
    report += `### Tangible（可觸知性）: ${validation.tangible.score}/100 ${validation.tangible.passed ? '✓' : '✗'}\n`;
    validation.tangible.details.forEach(d => report += `- ${d}\n`);
    report += `\n`;

    // Traceable
    report += `### Traceable（可追溯性）: ${validation.traceable.score}/100 ${validation.traceable.passed ? '✓' : '✗'}\n`;
    validation.traceable.details.forEach(d => report += `- ${d}\n`);
    report += `\n`;

    // Trackable
    report += `### Trackable（可追蹤性）: ${validation.trackable.score}/100 ${validation.trackable.passed ? '✓' : '✗'}\n`;
    validation.trackable.details.forEach(d => report += `- ${d}\n`);
    report += `\n`;

    // Transparent
    report += `### Transparent（透明性）: ${validation.transparent.score}/100 ${validation.transparent.passed ? '✓' : '✗'}\n`;
    validation.transparent.details.forEach(d => report += `- ${d}\n`);
    report += `\n`;

    // Trustworthy
    report += `### Trustworthy（可信賴性）: ${validation.trustworthy.score}/100 ${validation.trustworthy.passed ? '✓' : '✗'}\n`;
    validation.trustworthy.details.forEach(d => report += `- ${d}\n`);
    report += `\n`;

    // 改進建議
    if (config.includeRecommendations && compliance.recommendations.length > 0) {
      report += `## 改進建議\n`;
      compliance.recommendations.forEach((rec, i) => report += `${i + 1}. ${rec}\n`);
      report += `\n`;
    }

    // 篡改記錄
    if (config.includeHistory && this.tamperRecords.length > 0) {
      report += `## 篡改檢測記錄\n`;
      this.tamperRecords.forEach(record => {
        report += `- ${new Date(record.timestamp).toISOString()}: ${record.propertyPath}\n`;
      });
    }

    return report;
  }

  /**
   * 生成 HTML 格式報告
   */
  private generateHtmlReport(
    protocol: IT5TProtocol,
    validation: T5TValidationDetail,
    compliance: T5TComplianceResult,
    config: ComplianceReportConfig
  ): string {
    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>5T Protocol Compliance Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #e0e0e0; }
    .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%); border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.3); }
    .score { font-size: 48px; font-weight: bold; color: ${compliance.compliance_status === 'compliant' ? '#10b981' : compliance.compliance_status === 'partial' ? '#f59e0b' : '#ef4444'}; }
    .status { font-size: 24px; padding: 8px 16px; border-radius: 8px; display: inline-block; margin-top: 10px; }
    .compliant { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .partial { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .non_compliant { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .dimension { margin: 20px 0; padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); }
    .dimension h3 { margin-top: 0; color: #8b5cf6; }
    .passed { color: #10b981; }
    .failed { color: #ef4444; }
    .detail { margin: 5px 0; padding: 5px 10px; background: rgba(0, 0, 0, 0.2); border-radius: 4px; }
    .recommendations { background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-top: 20px; }
    .recommendations h3 { color: #8b5cf6; margin-top: 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>5T 協議合規報告</h1>
    <p>${config.title ?? '5T Protocol Compliance Report'}</p>
    <div class="score">${compliance.overall_score}/100</div>
    <div class="status ${compliance.compliance_status}">${compliance.compliance_status.toUpperCase()}</div>
  </div>

  <div class="dimension">
    <h3>Tangible（可觸知性）: ${validation.tangible.score}/100 ${validation.tangible.passed ? '✓' : '✗'}</h3>
    ${validation.tangible.details.map(d => `<div class="detail">${d}</div>`).join('')}
  </div>

  <div class="dimension">
    <h3>Traceable（可追溯性）: ${validation.traceable.score}/100 ${validation.traceable.passed ? '✓' : '✗'}</h3>
    ${validation.traceable.details.map(d => `<div class="detail">${d}</div>`).join('')}
  </div>

  <div class="dimension">
    <h3>Trackable（可追蹤性）: ${validation.trackable.score}/100 ${validation.trackable.passed ? '✓' : '✗'}</h3>
    ${validation.trackable.details.map(d => `<div class="detail">${d}</div>`).join('')}
  </div>

  <div class="dimension">
    <h3>Transparent（透明性）: ${validation.transparent.score}/100 ${validation.transparent.passed ? '✓' : '✗'}</h3>
    ${validation.transparent.details.map(d => `<div class="detail">${d}</div>`).join('')}
  </div>

  <div class="dimension">
    <h3>Trustworthy（可信賴性）: ${validation.trustworthy.score}/100 ${validation.trustworthy.passed ? '✓' : '✗'}</h3>
    ${validation.trustworthy.details.map(d => `<div class="detail">${d}</div>`).join('')}
  </div>

  ${config.includeRecommendations && compliance.recommendations.length > 0 ? `
  <div class="recommendations">
    <h3>改進建議</h3>
    <ul>
      ${compliance.recommendations.map(r => `<li>${r}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <p style="text-align: center; margin-top: 40px; color: #6b7280;">
    報告生成時間: ${new Date().toISOString()}
  </p>
</body>
</html>`;
  }

  /**
   * 計算整體合規分數
   */
  calculateOverallCompliance(protocol: IT5TProtocol): T5TComplianceResult {
    return T5TProtocolFactory.calculateCompliance(protocol);
  }

  /**
   * 快速驗證 - 檢查是否通過所有 5T 維度
   */
  quickValidate(protocol: IT5TProtocol): boolean {
    const validation = this.validateProtocol(protocol);
    return (
      validation.tangible.passed &&
      validation.traceable.passed &&
      validation.trackable.passed &&
      validation.transparent.passed &&
      validation.trustworthy.passed
    );
  }
}

/**
 * 創建 T5TValidator 實例的工廠函數
 */
export function createT5TValidator(): T5TValidator {
  return new T5TValidator();
}
