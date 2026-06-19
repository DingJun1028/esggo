// Data Quality Controller - M2 Data Module
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

// Quality Rule
export interface QualityRule {
  field: string;
  type: 'required' | 'range' | 'format' | 'custom';
  params?: any;
}

// Data Quality Report
export interface DataQualityReport {
  score: number;
  issues: string[];
  validCount: number;
  invalidCount: number;
}

// Service Class
export class DataQualityController {
  private static instance: DataQualityController;
  private rules: Map<string, QualityRule[]> = new Map();

  private constructor() {
    this.initializeRules();
  }

  static getInstance(): DataQualityController {
    if (!DataQualityController.instance) {
      DataQualityController.instance = new DataQualityController();
    }
    return DataQualityController.instance;
  }

  // Validate Data
  async validate(collection: string, data: any[]): Promise<DataQualityReport> {
    const rules = this.rules.get(collection) || [];
    let valid = 0;
    let invalid = 0;
    const issues: string[] = [];

    data.forEach((item, index) => {
      let isItemValid = true;
      rules.forEach(rule => {
        if (!this.checkRule(item, rule)) {
          isItemValid = false;
          issues.push(`Item ${index} failed rule ${rule.field} (${rule.type})`);
        }
      });

      if (isItemValid) valid++;
      else invalid++;
    });

    const score = data.length > 0 ? (valid / data.length) * 100 : 100;
    omniLogger.info(LogCategory.DATA, 'Data Validation Complete', { collection, score });

    return {
      score,
      issues: issues.slice(0, 50), // Limit issues
      validCount: valid,
      invalidCount: invalid,
    };
  }

  // Private Implementation
  private checkRule(item: any, rule: QualityRule): boolean {
    const value = item[rule.field];

    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== null && value !== '';
      case 'range':
        return typeof value === 'number' && value >= rule.params.min && value <= rule.params.max;
      default:
        return true;
    }
  }

  private initializeRules() {
    this.rules.set('carbon_emissions', [
      { field: 'scope1', type: 'range', params: { min: 0, max: 10000 } },
      { field: 'timestamp', type: 'required' },
    ]);
  }
}

export const dataQualityController = DataQualityController.getInstance();
