// 數據品質控制服務 - M1核心數據管理模組
import { DataOperationResult } from './dataManager';
import { ESGDataValidator, esgValidator } from './esg';

// 驗證規則類型
export enum ValidationRuleType {
  REQUIRED = 'required',
  TYPE = 'type',
  RANGE = 'range',
  PATTERN = 'pattern',
  CUSTOM = 'custom',
  CONSISTENCY = 'consistency',
  BUSINESS_LOGIC = 'business_logic'
}

// 數據品質問題等級
export enum QualityIssueLevel {
  CRITICAL = 'critical',    // 嚴重問題，必須修復
  HIGH = 'high',           // 高優先級問題
  MEDIUM = 'medium',       // 中等優先級問題
  LOW = 'low',            // 低優先級問題
  INFO = 'info'           // 信息級別，僅供參考
}

// 數據品質問題
export interface DataQualityIssue {
  id: string;
  field: string;
  value: any;
  rule: string;
  level: QualityIssueLevel;
  message: string;
  suggestion?: string;
  timestamp: number;
  resolved?: boolean;
  resolvedAt?: number;
}

// 數據品質報告
export interface DataQualityReport {
  id: string;
  dataSource: string;
  timestamp: number;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  issues: DataQualityIssue[];
  qualityScores: {
    completeness: number;
    accuracy: number;
    consistency: number;
    validity: number;
    overall: number;
  };
  recommendations: string[];
}

// 驗證規則定義
export interface ValidationRule {
  id: string;
  name: string;
  type: ValidationRuleType;
  field: string;
  params: Record<string, any>;
  enabled: boolean;
  level: QualityIssueLevel;
  description: string;
}

// 數據清理動作
export enum DataCleaningAction {
  REMOVE = 'remove',           // 刪除記錄
  CORRECT = 'correct',         // 修正值
  IMPUTE = 'impute',           // 填補缺失值
  STANDARDIZE = 'standardize', // 標準化格式
  FLAG = 'flag'               // 標記但保留
}

// 數據清理規則
export interface DataCleaningRule {
  id: string;
  name: string;
  condition: (record: any) => boolean;
  action: DataCleaningAction;
  params: Record<string, any>;
  enabled: boolean;
  description: string;
}

// 數據品質控制服務主類
export class DataQualityController {
  private static instance: DataQualityController;
  private validationRules: Map<string, ValidationRule[]> = new Map();
  private cleaningRules: Map<string, DataCleaningRule[]> = new Map();
  private qualityReports: Map<string, DataQualityReport> = new Map();
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): DataQualityController {
    if (!DataQualityController.instance) {
      DataQualityController.instance = new DataQualityController();
    }
    return DataQualityController.instance;
  }

  // 註冊驗證規則
  registerValidationRule(dataType: string, rule: ValidationRule): void {
    if (!this.validationRules.has(dataType)) {
      this.validationRules.set(dataType, []);
    }
    this.validationRules.get(dataType)!.push(rule);
  }

  // 註冊清理規則
  registerCleaningRule(dataType: string, rule: DataCleaningRule): void {
    if (!this.cleaningRules.has(dataType)) {
      this.cleaningRules.set(dataType, []);
    }
    this.cleaningRules.get(dataType)!.push(rule);
  }

  // 驗證單筆數據
  validateRecord(
    record: any,
    dataType: string,
    options: { strict?: boolean } = {}
  ): { isValid: boolean; issues: DataQualityIssue[]; score: number } {
    const rules = this.validationRules.get(dataType) || [];
    const issues: DataQualityIssue[] = [];
    let totalScore = 100;
    const scoreWeights = { critical: 20, high: 10, medium: 5, low: 2, info: 0 };

    for (const rule of rules) {
      if (!rule.enabled) continue;

      try {
        const issue = this.checkRule(record, rule);
        if (issue) {
          issues.push(issue);
          totalScore -= scoreWeights[issue.level];
        }
      } catch (error) {
        console.warn(`驗證規則 ${rule.name} 執行失敗:`, error);
      }
    }

    // ESG特定驗證
    const esgIssues = this.performESGValidation(record, dataType);
    issues.push(...esgIssues);
    esgIssues.forEach(issue => {
      totalScore -= scoreWeights[issue.level];
    });

    const finalScore = Math.max(0, totalScore);

    return {
      isValid: options.strict ? issues.length === 0 : finalScore >= 60,
      issues,
      score: finalScore
    };
  }

  // 驗證數據集
  async validateDataset(
    records: any[],
    dataType: string,
    dataSource: string
  ): Promise<DataOperationResult<DataQualityReport>> {
    const startTime = Date.now();

    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const issues: DataQualityIssue[] = [];
      let validRecords = 0;

      // 逐筆驗證
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const validation = this.validateRecord(record, dataType);

        if (validation.isValid) {
          validRecords++;
        } else {
          // 為每個問題創建詳細的問題記錄
          validation.issues.forEach(issue => {
            issues.push({
              ...issue,
              id: `${reportId}_${i}_${issues.length}`,
              timestamp: Date.now()
            });
          });
        }
      }

      // 計算品質評分
      const qualityScores = this.calculateQualityScores(records, issues);
      const recommendations = this.generateRecommendations(issues, qualityScores);

      const report: DataQualityReport = {
        id: reportId,
        dataSource,
        timestamp: Date.now(),
        totalRecords: records.length,
        validRecords,
        invalidRecords: records.length - validRecords,
        issues,
        qualityScores,
        recommendations
      };

      this.qualityReports.set(reportId, report);
      this.notifySubscribers('quality_report_generated', report);

      return {
        success: true,
        data: report,
        metadata: {
          operation: 'validate_dataset',
          timestamp: startTime,
          duration: Date.now() - startTime,
          recordsProcessed: records.length,
          issuesFound: issues.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '數據集驗證失敗',
        metadata: {
          operation: 'validate_dataset',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 清理數據
  cleanDataset(
    records: any[],
    dataType: string
  ): { cleanedRecords: any[]; cleaningReport: any; issuesResolved: number } {
    const cleaningRules = this.cleaningRules.get(dataType) || [];
    const cleanedRecords = [...records];
    let issuesResolved = 0;
    const cleaningActions: any[] = [];

    for (let i = 0; i < cleanedRecords.length; i++) {
      const record = cleanedRecords[i];

      for (const rule of cleaningRules) {
        if (!rule.enabled) continue;

        try {
          if (rule.condition(record)) {
            const originalRecord = { ...record };
            const result = this.applyCleaningAction(record, rule);

            if (result.changed) {
              cleaningActions.push({
                ruleId: rule.id,
                ruleName: rule.name,
                recordIndex: i,
                action: rule.action,
                before: originalRecord,
                after: record
              });
              issuesResolved++;
            }
          }
        } catch (error) {
          console.warn(`清理規則 ${rule.name} 應用失敗:`, error);
        }
      }
    }

    return {
      cleanedRecords,
      cleaningReport: {
        totalRecords: records.length,
        cleanedRecords: cleanedRecords.length,
        actionsApplied: cleaningActions.length,
        actions: cleaningActions
      },
      issuesResolved
    };
  }

  // 檢測數據異常
  detectAnomalies(
    records: any[],
    dataType: string,
    options: {
      sensitivity?: 'low' | 'medium' | 'high';
      methods?: ('statistical' | 'pattern' | 'isolation' | 'business_logic')[];
    } = {}
  ): DataQualityIssue[] {
    const {
      sensitivity = 'medium',
      methods = ['statistical', 'pattern', 'business_logic']
    } = options;

    const anomalies: DataQualityIssue[] = [];

    // 統計異常檢測
    if (methods.includes('statistical')) {
      const statisticalAnomalies = this.detectStatisticalAnomalies(records, sensitivity);
      anomalies.push(...statisticalAnomalies);
    }

    // 模式異常檢測
    if (methods.includes('pattern')) {
      const patternAnomalies = this.detectPatternAnomalies(records, dataType);
      anomalies.push(...patternAnomalies);
    }

    // 業務邏輯異常檢測
    if (methods.includes('business_logic')) {
      const businessAnomalies = this.detectBusinessLogicAnomalies(records, dataType);
      anomalies.push(...businessAnomalies);
    }

    return anomalies;
  }

  // 數據一致性檢查
  checkConsistency(records: any[], dataType: string): DataQualityIssue[] {
    const issues: DataQualityIssue[] = [];

    if (records.length < 2) return issues;

    // 檢查跨記錄一致性
    const consistencyRules = this.getConsistencyRules(dataType);

    for (const rule of consistencyRules) {
      try {
        const ruleIssues = rule.validator(records);
        issues.push(...ruleIssues);
      } catch (error) {
        console.warn(`一致性規則 ${rule.name} 檢查失敗:`, error);
      }
    }

    return issues;
  }

  // 生成品質改進建議
  generateImprovementSuggestions(report: DataQualityReport): string[] {
    const suggestions: string[] = [];

    // 基於品質評分提供建議
    if (report.qualityScores.completeness < 80) {
      suggestions.push('考慮實施數據收集流程改進，確保關鍵字段的完整性');
    }

    if (report.qualityScores.accuracy < 80) {
      suggestions.push('建立數據驗證規則和自動化檢查機制');
    }

    if (report.qualityScores.consistency < 80) {
      suggestions.push('實施數據治理政策，規範數據標準和格式');
    }

    if (report.qualityScores.validity < 80) {
      suggestions.push('增強數據輸入控制和業務規則驗證');
    }

    // 基於問題類型提供具體建議
    const issueTypes = report.issues.reduce((acc, issue) => {
      acc[issue.rule] = (acc[issue.rule] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(issueTypes).forEach(([rule, count]) => {
      if (count > report.totalRecords * 0.1) { // 超過10%的記錄有此問題
        suggestions.push(`針對 ${rule} 問題實施批量數據清理`);
      }
    });

    return suggestions;
  }

  // 事件訂閱
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);

    return () => {
      const subscribers = this.subscribers.get(event);
      if (subscribers) {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      }
    };
  }

  // 獲取品質報告
  getQualityReport(id: string): DataQualityReport | undefined {
    return this.qualityReports.get(id);
  }

  // 獲取所有品質報告
  getAllQualityReports(): DataQualityReport[] {
    return Array.from(this.qualityReports.values());
  }

  // 私有方法實現

  private checkRule(record: any, rule: ValidationRule): DataQualityIssue | null {
    const value = record[rule.field];

    switch (rule.type) {
      case ValidationRuleType.REQUIRED:
        if (value === null || value === undefined || value === '') {
          return {
            id: '',
            field: rule.field,
            value,
            rule: rule.name,
            level: rule.level,
            message: `${rule.field} 為必填字段`,
            timestamp: Date.now()
          };
        }
        break;

      case ValidationRuleType.TYPE:
        const expectedType = rule.params.type;
        if (typeof value !== expectedType) {
          return {
            id: '',
            field: rule.field,
            value,
            rule: rule.name,
            level: rule.level,
            message: `${rule.field} 應為 ${expectedType} 類型`,
            timestamp: Date.now()
          };
        }
        break;

      case ValidationRuleType.RANGE:
        const { min, max } = rule.params;
        if (typeof value === 'number') {
          if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
            return {
              id: '',
              field: rule.field,
              value,
              rule: rule.name,
              level: rule.level,
              message: `${rule.field} 超出範圍 [${min || '-∞'}, ${max || '∞'}]`,
              timestamp: Date.now()
            };
          }
        }
        break;

      case ValidationRuleType.PATTERN:
        const pattern = new RegExp(rule.params.pattern);
        if (typeof value === 'string' && !pattern.test(value)) {
          return {
            id: '',
            field: rule.field,
            value,
            rule: rule.name,
            level: rule.level,
            message: `${rule.field} 格式不符合要求`,
            timestamp: Date.now()
          };
        }
        break;

      case ValidationRuleType.CUSTOM:
        const customValidator = rule.params.validator;
        if (typeof customValidator === 'function' && !customValidator(value)) {
          return {
            id: '',
            field: rule.field,
            value,
            rule: rule.name,
            level: rule.level,
            message: rule.params.message || `${rule.field} 自定義驗證失敗`,
            timestamp: Date.now()
          };
        }
        break;
    }

    return null;
  }

  private performESGValidation(record: any, dataType: string): DataQualityIssue[] {
    const issues: DataQualityIssue[] = [];

    // 碳排放數據驗證
    if (dataType.includes('carbon') || record.scope1 !== undefined) {
      const carbonValidation = esgValidator.validateCarbonData(record);
      if (!carbonValidation.isValid) {
        carbonValidation.errors.forEach(error => {
          issues.push({
            id: '',
            field: 'carbonData',
            value: record,
            rule: 'ESG_Carbon_Validation',
            level: QualityIssueLevel.HIGH,
            message: error,
            timestamp: Date.now()
          });
        });
      }
    }

    // 社會影響數據驗證
    if (dataType.includes('social') || record.employeeSatisfaction !== undefined) {
      const socialValidation = esgValidator.validateSocialData(record);
      if (!socialValidation.isValid) {
        socialValidation.errors.forEach(error => {
          issues.push({
            id: '',
            field: 'socialData',
            value: record,
            rule: 'ESG_Social_Validation',
            level: QualityIssueLevel.MEDIUM,
            message: error,
            timestamp: Date.now()
          });
        });
      }
    }

    // 治理評分驗證
    if (dataType.includes('governance') || record.boardComposition !== undefined) {
      const governanceValidation = esgValidator.validateGovernanceData(record);
      if (!governanceValidation.isValid) {
        governanceValidation.errors.forEach(error => {
          issues.push({
            id: '',
            field: 'governanceData',
            value: record,
            rule: 'ESG_Governance_Validation',
            level: QualityIssueLevel.MEDIUM,
            message: error,
            timestamp: Date.now()
          });
        });
      }
    }

    return issues;
  }

  private applyCleaningAction(record: any, rule: DataCleaningRule): { changed: boolean; action: string } {
    switch (rule.action) {
      case DataCleaningAction.REMOVE:
        // 標記記錄為無效（實際刪除由調用方處理）
        record._markedForRemoval = true;
        return { changed: true, action: 'marked_for_removal' };

      case DataCleaningAction.CORRECT:
        const { field, correction } = rule.params;
        if (field && correction !== undefined) {
          record[field] = correction;
          return { changed: true, action: 'corrected' };
        }
        break;

      case DataCleaningAction.IMPUTE:
        const { targetField, method, defaultValue } = rule.params;
        if (targetField && (record[targetField] === null || record[targetField] === undefined)) {
          if (method === 'mean' && rule.params.mean !== undefined) {
            record[targetField] = rule.params.mean;
          } else if (method === 'median' && rule.params.median !== undefined) {
            record[targetField] = rule.params.median;
          } else if (defaultValue !== undefined) {
            record[targetField] = defaultValue;
          }
          return { changed: true, action: 'imputed' };
        }
        break;

      case DataCleaningAction.STANDARDIZE:
        const { standardizeField, format } = rule.params;
        if (standardizeField && format) {
          const originalValue = record[standardizeField];
          record[standardizeField] = this.standardizeValue(originalValue, format);
          return { changed: originalValue !== record[standardizeField], action: 'standardized' };
        }
        break;

      case DataCleaningAction.FLAG:
        const { flagField, flagReason } = rule.params;
        record._flags = record._flags || [];
        record._flags.push({ field: flagField, reason: flagReason, timestamp: Date.now() });
        return { changed: true, action: 'flagged' };
    }

    return { changed: false, action: 'no_action' };
  }

  private standardizeValue(value: any, format: string): any {
    switch (format) {
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      case 'trim':
        return typeof value === 'string' ? value.trim() : value;
      case 'number':
        return typeof value === 'string' ? parseFloat(value) || value : value;
      case 'date':
        if (typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? value : date.getTime();
        }
        return value;
      default:
        return value;
    }
  }

  private detectStatisticalAnomalies(records: any[], sensitivity: 'low' | 'medium' | 'high'): DataQualityIssue[] {
    const issues: DataQualityIssue[] = [];
    const numericFields = this.findNumericFields(records);

    const thresholds = {
      low: 3,      // 3倍標準差
      medium: 2.5, // 2.5倍標準差
      high: 2      // 2倍標準差
    };

    const threshold = thresholds[sensitivity];

    numericFields.forEach(field => {
      const values = records
        .map(r => r[field])
        .filter(v => typeof v === 'number' && !isNaN(v));

      if (values.length < 10) return; // 數據不足，跳過

      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      );

      records.forEach((record, index) => {
        const value = record[field];
        if (typeof value === 'number' && !isNaN(value)) {
          const zScore = Math.abs(value - mean) / stdDev;
          if (zScore > threshold) {
            issues.push({
              id: '',
              field,
              value,
              rule: 'Statistical_Anomaly',
              level: zScore > threshold * 1.5 ? QualityIssueLevel.HIGH : QualityIssueLevel.MEDIUM,
              message: `${field} 值 ${value} 偏離平均值 ${mean.toFixed(2)} 超過 ${threshold} 倍標準差`,
              suggestion: '檢查數據是否正確，或考慮移除異常值',
              timestamp: Date.now()
            });
          }
        }
      });
    });

    return issues;
  }

  private detectPatternAnomalies(records: any[], dataType: string): DataQualityIssue[] {
    const issues: DataQualityIssue[] = [];

    // 檢查重複記錄
    const seen = new Set();
    records.forEach((record, index) => {
      const key = JSON.stringify(record);
      if (seen.has(key)) {
        issues.push({
          id: '',
          field: 'record',
          value: record,
          rule: 'Duplicate_Record',
          level: QualityIssueLevel.MEDIUM,
          message: '發現重複記錄',
          suggestion: '合併或刪除重複記錄',
          timestamp: Date.now()
        });
      }
      seen.add(key);
    });

    // 檢查格式異常
    const stringFields = this.findStringFields(records);
    stringFields.forEach(field => {
      records.forEach((record, index) => {
        const value = record[field];
        if (typeof value === 'string') {
          // 檢查特殊字符過多
          const specialCharCount = (value.match(/[^a-zA-Z0-9\s]/g) || []).length;
          if (specialCharCount > value.length * 0.5) {
            issues.push({
              id: '',
              field,
              value,
              rule: 'Format_Anomaly',
              level: QualityIssueLevel.LOW,
              message: `${field} 包含過多特殊字符`,
              suggestion: '檢查數據格式是否正確',
              timestamp: Date.now()
            });
          }
        }
      });
    });

    return issues;
  }

  private detectBusinessLogicAnomalies(records: any[], dataType: string): DataQualityIssue[] {
    const issues: DataQualityIssue[] = [];

    // 業務邏輯異常檢測示例
    if (dataType.includes('carbon')) {
      records.forEach((record, index) => {
        const { scope1 = 0, scope2 = 0, scope3 = 0, total = 0 } = record;
        const calculatedTotal = scope1 + scope2 + scope3;

        if (Math.abs(total - calculatedTotal) > 0.01) {
          issues.push({
            id: '',
            field: 'total',
            value: total,
            rule: 'Business_Logic_Anomaly',
            level: QualityIssueLevel.HIGH,
            message: `總排放量 ${total} 與 Scope 1+2+3 總和 ${calculatedTotal} 不匹配`,
            suggestion: '檢查數據計算邏輯或修正錯誤值',
            timestamp: Date.now()
          });
        }
      });
    }

    return issues;
  }

  private findNumericFields(records: any[]): string[] {
    if (records.length === 0) return [];

    const sample = records[0];
    return Object.keys(sample).filter(key =>
      records.some(r => typeof r[key] === 'number' && !isNaN(r[key]))
    );
  }

  private findStringFields(records: any[]): string[] {
    if (records.length === 0) return [];

    const sample = records[0];
    return Object.keys(sample).filter(key =>
      records.some(r => typeof r[key] === 'string')
    );
  }

  private calculateQualityScores(records: any[], issues: DataQualityIssue[]): DataQualityReport['qualityScores'] {
    // 完整性評分
    const completeness = records.length > 0 ?
      (records.filter(r => !r._markedForRemoval).length / records.length) * 100 : 0;

    // 準確性評分（基於問題數量）
    const accuracy = Math.max(0, 100 - (issues.length / records.length) * 50);

    // 一致性評分
    const consistencyIssues = issues.filter(i => i.rule.includes('Consistency'));
    const consistency = Math.max(0, 100 - (consistencyIssues.length / records.length) * 30);

    // 有效性評分
    const validityIssues = issues.filter(i => i.level === QualityIssueLevel.CRITICAL || i.level === QualityIssueLevel.HIGH);
    const validity = Math.max(0, 100 - (validityIssues.length / records.length) * 40);

    // 總體評分
    const overall = (completeness * 0.3 + accuracy * 0.3 + consistency * 0.2 + validity * 0.2);

    return {
      completeness: Math.min(100, completeness),
      accuracy: Math.min(100, accuracy),
      consistency: Math.min(100, consistency),
      validity: Math.min(100, validity),
      overall: Math.min(100, overall)
    };
  }

  private generateRecommendations(issues: DataQualityIssue[], scores: DataQualityReport['qualityScores']): string[] {
    const recommendations: string[] = [];

    if (scores.overall < 60) {
      recommendations.push('數據品質嚴重不足，建議暫停使用並進行全面審核');
    } else if (scores.overall < 80) {
      recommendations.push('數據品質需要改進，建議實施數據治理計劃');
    }

    // 基於問題類型提供具體建議
    const criticalIssues = issues.filter(i => i.level === QualityIssueLevel.CRITICAL);
    if (criticalIssues.length > 0) {
      recommendations.push(`發現 ${criticalIssues.length} 個關鍵品質問題，需要立即修復`);
    }

    const fieldIssues = issues.reduce((acc, issue) => {
      acc[issue.field] = (acc[issue.field] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(fieldIssues).forEach(([field, count]) => {
      if (count > issues.length * 0.2) {
        recommendations.push(`字段 ${field} 有較多品質問題，建議檢查數據收集流程`);
      }
    });

    return recommendations;
  }

  private getConsistencyRules(dataType: string): Array<{ name: string; validator: (records: any[]) => DataQualityIssue[] }> {
    // 一致性檢查規則示例
    return [
      {
        name: 'Time_Order_Consistency',
        validator: (records) => {
          const issues: DataQualityIssue[] = [];
          const timeFields = ['timestamp', 'createdAt', 'updatedAt', 'date'];

          for (const field of timeFields) {
            const timeRecords = records
              .filter(r => r[field])
              .map(r => ({ ...r, timeValue: new Date(r[field]).getTime() }))
              .sort((a, b) => a.timeValue - b.timeValue);

            for (let i = 1; i < timeRecords.length; i++) {
              const prev = timeRecords[i - 1];
              const current = timeRecords[i];

              if (current.timeValue < prev.timeValue) {
                issues.push({
                  id: '',
                  field,
                  value: current[field],
                  rule: 'Time_Order_Inconsistency',
                  level: QualityIssueLevel.MEDIUM,
                  message: `${field} 時間順序不一致`,
                  suggestion: '檢查數據時序邏輯',
                  timestamp: Date.now()
                });
              }
            }
          }

          return issues;
        }
      }
    ];
  }

  private initializeDefaultRules(): void {
    // 初始化默認驗證規則
    const commonRules: ValidationRule[] = [
      {
        id: 'required_id',
        name: 'Required_ID',
        type: ValidationRuleType.REQUIRED,
        field: 'id',
        params: {},
        enabled: true,
        level: QualityIssueLevel.CRITICAL,
        description: 'ID字段為必填'
      },
      {
        id: 'timestamp_format',
        name: 'Timestamp_Format',
        type: ValidationRuleType.TYPE,
        field: 'timestamp',
        params: { type: 'number' },
        enabled: true,
        level: QualityIssueLevel.HIGH,
        description: '時間戳應為數字類型'
      }
    ];

    // ESG特定規則
    const esgRules: ValidationRule[] = [
      {
        id: 'carbon_positive',
        name: 'Carbon_Positive_Values',
        type: ValidationRuleType.CUSTOM,
        field: 'scope1',
        params: {
          validator: (value) => value === undefined || value === null || (typeof value === 'number' && value >= 0),
          message: '碳排放值不能為負數'
        },
        enabled: true,
        level: QualityIssueLevel.HIGH,
        description: '碳排放數據應為非負數'
      },
      {
        id: 'year_range',
        name: 'Year_In_Range',
        type: ValidationRuleType.RANGE,
        field: 'year',
        params: { min: 2000, max: new Date().getFullYear() + 1 },
        enabled: true,
        level: QualityIssueLevel.MEDIUM,
        description: '年份應在合理範圍內'
      }
    ];

    // 數據清理規則
    const cleaningRules: DataCleaningRule[] = [
      {
        id: 'remove_empty_records',
        name: 'Remove_Empty_Records',
        condition: (record) => !record.id && !record.timestamp,
        action: DataCleaningAction.REMOVE,
        params: {},
        enabled: true,
        description: '移除沒有關鍵字段的空記錄'
      },
      {
        id: 'standardize_timestamps',
        name: 'Standardize_Timestamps',
        condition: (record) => typeof record.timestamp === 'string',
        action: DataCleaningAction.STANDARDIZE,
        params: { standardizeField: 'timestamp', format: 'date' },
        enabled: true,
        description: '將字符串時間戳標準化為數字'
      }
    ];

    // 註冊規則
    this.validationRules.set('common', commonRules);
    this.validationRules.set('esg', esgRules);
    this.cleaningRules.set('common', cleaningRules);
  }

  private notifySubscribers(event: string, data: any): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('事件訂閱者回調失敗:', error);
        }
      });
    }
  }
}

// 導出單例實例
export const dataQualityController = DataQualityController.getInstance();