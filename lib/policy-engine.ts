/**
 * ESG GO | Dynamic Policy Engine (T2 Transparent)
 * Validates ESG data against regulatory guardrails and templates.
 * Integrated with Firebase Data Connect for persistent policies.
 */

import { dcListRegulatoryPolicies } from './dataconnect-services';

export interface RegulatoryPolicy {
  id: string;
  standard: 'CSRD' | 'GRI' | 'SASB' | 'TCFD' | 'ISO' | string;
  code: string;
  name: string;
  description: string;
  rules: PolicyRule[];
}

export interface PolicyRule {
  type: 'UNIT_CHECK' | 'RANGE_CHECK' | 'SOURCE_REQUIRED' | 'VARIANCE_LIMIT';
  targetField: string;
  expectedValue?: unknown;
  minValue?: number;
  maxValue?: number;
  varianceThreshold?: number; // e.g., 0.2 for 20%
}

export interface PolicyValidationResult {
  isValid: boolean;
  score: number; // 0-100
  violations: string[];
  recommendations: string[];
}

// Fallback templates if DB is empty or unreachable
const FALLBACK_TEMPLATES: RegulatoryPolicy[] = [
  {
    id: 'policy_csrd_e1_1',
    standard: 'CSRD',
    code: 'ESRS E1-1',
    name: 'Climate Change Mitigation - Scope 1',
    description: 'Requirements for disclosing direct greenhouse gas emissions.',
    rules: [
      { type: 'UNIT_CHECK', targetField: 'unit', expectedValue: 'tCO2e' },
      { type: 'SOURCE_REQUIRED', targetField: 'source_origin' },
      { type: 'VARIANCE_LIMIT', targetField: 'value', varianceThreshold: 0.5 }
    ]
  },
  {
    id: 'policy_gri_305_1',
    standard: 'GRI',
    code: 'GRI 305-1',
    name: 'Direct (Scope 1) GHG Emissions',
    description: 'Disclosure on direct GHG emissions in metric tons of CO2 equivalent.',
    rules: [
      { type: 'UNIT_CHECK', targetField: 'unit', expectedValue: 'tCO2e' },
      { type: 'RANGE_CHECK', targetField: 'value', minValue: 0 }
    ]
  }
];

export class PolicyEngine {
  private static instance: PolicyEngine;
  private policies: RegulatoryPolicy[] = FALLBACK_TEMPLATES;

  static getInstance(): PolicyEngine {
    if (!PolicyEngine.instance) {
      PolicyEngine.instance = new PolicyEngine();
    }
    return PolicyEngine.instance;
  }

  /**
   * Syncs policies from the database.
   */
  async syncPolicies() {
    try {
      const remote = await dcListRegulatoryPolicies();
      if (remote.length > 0) {
        this.policies = remote.map((p: any) => ({
          id: p.id,
          standard: p.standard,
          code: p.code,
          name: p.name,
          description: p.description || '',
          rules: JSON.parse(p.rulesJson)
        }));
      }
    } catch (e: any) {
      console.warn('PolicyEngine: Failed to sync from DB, using fallbacks.', e);
    }
  }

  getPolicy(id: string): RegulatoryPolicy | undefined {
    return this.policies.find(p => p.id === id);
  }

  listPolicies(): RegulatoryPolicy[] {
    return this.policies;
  }

  /**
   * Evaluates data against a specific policy.
   */
  validate(policyId: string, data: unknown, history: unknown[] = []): PolicyValidationResult {
    const policy = this.getPolicy(policyId);
    if (!policy) {
      return { isValid: false, score: 0, violations: ['Policy not found'], recommendations: [] };
    }

    const violations: string[] = [];
    const recommendations: string[] = [];
    let passedRules = 0;

    for (const rule of policy.rules) {
      let rulePassed = true;

      switch (rule.type) {
        case 'UNIT_CHECK':
          if ((data as any)[rule.targetField] !== rule.expectedValue) {
            violations.push(`單位錯誤：預期為 ${rule.expectedValue}，但收到 ${(data as any)[rule.targetField]}`);
            rulePassed = false;
          }
          break;

        case 'RANGE_CHECK':
          const val = Number((data as any)[rule.targetField]);
          if (rule.minValue !== undefined && val < rule.minValue) {
            violations.push(`數值過低：${val} 低於最低閾值 ${rule.minValue}`);
            rulePassed = false;
          }
          if (rule.maxValue !== undefined && val > rule.maxValue) {
            violations.push(`數值過高：${val} 超過最高閾值 ${rule.maxValue}`);
            rulePassed = false;
          }
          break;

        case 'SOURCE_REQUIRED':
          if (!(data as any)[rule.targetField] || !(data as any)[rule.targetField].startsWith('/')) {
            violations.push(`缺少合法溯源：${rule.targetField} 必須包含有效的系統路徑`);
            rulePassed = false;
          }
          break;

        case 'VARIANCE_LIMIT':
          if (history.length > 0 && rule.varianceThreshold) {
            const lastVal = Number((history[0] as any)[rule.targetField]);
            const currentVal = Number((data as any)[rule.targetField]);
            const variance = Math.abs(currentVal - lastVal) / (lastVal || 1);
            if (variance > rule.varianceThreshold) {
              violations.push(`異動幅度過大：本次數值偏離前次記錄 ${Math.round(variance * 100)}%，超過門檻 ${rule.varianceThreshold * 100}%`);
              recommendations.push('請檢查數據是否輸入錯誤，或在備註中說明重大異動原因。');
              rulePassed = false;
            }
          }
          break;
      }

      if (rulePassed) passedRules++;
    }

    const score = Math.round((passedRules / policy.rules.length) * 100);

    return {
      isValid: violations.length === 0,
      score,
      violations,
      recommendations
    };
  }
}

export const policyEngine = PolicyEngine.getInstance();
