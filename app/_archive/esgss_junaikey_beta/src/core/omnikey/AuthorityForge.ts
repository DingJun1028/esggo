/**
 * Jun.AI.Key - 權能冶煉引擎 (Authority Forging Engine)
 * 觀察行為與數據，主動將重複/複雜任務冶煉為專屬「權能鑰匙」
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import { omniLogger } from '@/omni/infrastructure/logging/OmniLogger';

import { MemoryPalace, MemoryQuery } from './MemoryPalace';
import { v4 as uuidv4 } from 'uuid';

export interface BehaviorPattern {
  id: string;
  userId: string;
  pattern: string; // 行為模式描述
  frequency: number; // 發生頻率
  complexity: number; // 複雜度 (1-10)
  timeSpent: number; // 平均耗時 (分鐘)
  successRate: number; // 成功率
  lastObserved: number;
  tags: string[];
}

export interface AuthorityKey {
  id: string;
  userId: string;
  name: string;
  description: string;
  pattern: BehaviorPattern;
  forgedAt: number;
  power: number; // 權能強度 (1-100)
  automationLevel: number; // 自動化程度 (1-10)
  script?: string; // 生成的自動化腳本
  api?: string; // API 端點
  webhook?: string; // Webhook 配置
  usageCount: number;
  lastUsed: number;
  evolution: AuthorityEvolution[];
}

export interface AuthorityEvolution {
  timestamp: number;
  powerDelta: number;
  trigger: string; // 進化觸發原因
  newCapabilities: string[];
}

/**
 * 權能冶煉引擎核心類
 * 負責觀察用戶行為、發現模式、冶煉權能鑰匙
 */
export class AuthorityForge {
  private patterns: Map<string, BehaviorPattern> = new Map();
  private authorityKeys: Map<string, AuthorityKey> = new Map();

  constructor(private memoryPalace: MemoryPalace) {}

  /**
   * 觀察用戶行為
   */
  async observeBehavior(
    userId: string,
    action: string,
    context: string,
    duration: number,
    success: boolean,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const patternKey = this.generatePatternKey(action, context);

    let pattern = this.patterns.get(patternKey);
    if (!pattern) {
      pattern = {
        id: uuidv4(),
        userId,
        pattern: this.extractPattern(action, context),
        frequency: 0,
        complexity: this.calculateComplexity(action, context, metadata),
        timeSpent: 0,
        successRate: 0,
        lastObserved: Date.now(),
        tags: this.extractTags(action, context),
      };
      this.patterns.set(patternKey, pattern);
    }

    // 更新模式統計
    pattern.frequency++;
    pattern.timeSpent =
      (pattern.timeSpent * (pattern.frequency - 1) + duration) / pattern.frequency;
    pattern.successRate =
      (pattern.successRate * (pattern.frequency - 1) + (success ? 1 : 0)) / pattern.frequency;
    pattern.lastObserved = Date.now();

    // 檢查是否需要冶煉權能鑰匙
    if (this.shouldForgeAuthority(pattern)) {
      await this.forgeAuthorityKey(pattern);
    }

    // 存儲行為記錄
    await this.memoryPalace.store({
      type: 'experience',
      content: `Behavior: ${action} in ${context} (${success ? 'success' : 'failed'}, ${duration}ms)`,
      context: `behavior-${userId}`,
      tags: ['behavior', 'observation', ...pattern.tags],
      vectors: [], // 應生成真實向量
      userId,
      connections: [],
      confidence: success ? 0.9 : 0.6,
    });
  }

  /**
   * 獲取用戶的權能鑰匙
   */
  getAuthorityKeys(userId: string): AuthorityKey[] {
    return Array.from(this.authorityKeys.values())
      .filter(key => key.userId === userId)
      .sort((a, b) => b.power - a.power);
  }

  /**
   * 使用權能鑰匙
   */
  async useAuthorityKey(keyId: string, parameters: Record<string, any>): Promise<any> {
    const key = this.authorityKeys.get(keyId);
    if (!key) {
      throw new Error(`Authority key ${keyId} not found`);
    }

    // 執行權能
    let result;
    try {
      result = await this.executeAuthority(key, parameters);
      key.usageCount++;
      key.lastUsed = Date.now();

      // 權能進化
      await this.evolveAuthority(key, 'successful_usage', 2);
    } catch (error) {
      // 失敗時進化 (學習改進)
      await this.evolveAuthority(key, 'usage_failure', -1);
      throw error;
    }

    return result;
  }

  /**
   * 手動冶煉權能鑰匙
   */
  async forgeManualKey(userId: string, patternString: string): Promise<AuthorityKey> {
    const pattern: BehaviorPattern = {
      id: uuidv4(),
      userId,
      pattern: patternString,
      frequency: 10, // 假設高頻
      complexity: 5,
      timeSpent: 5,
      successRate: 1.0,
      lastObserved: Date.now(),
      tags: ['manual', ...this.extractTags(patternString, patternString || '')],
    };
    return await this.forgeAuthorityKey(pattern);
  }

  /**
   * 冶煉權能鑰匙
   */
  private async forgeAuthorityKey(pattern: BehaviorPattern): Promise<AuthorityKey> {
    omniLogger.info(LogCategory.SYSTEM, '[AuthorityForge] Info', { data: `🔨 開始冶煉權能鑰匙: ${pattern.pattern}` });

    const authorityKey: AuthorityKey = {
      id: uuidv4(),
      userId: pattern.userId,
      name: this.generateKeyName(pattern),
      description: this.generateKeyDescription(pattern),
      pattern,
      forgedAt: Date.now(),
      power: this.calculateInitialPower(pattern),
      automationLevel: this.calculateAutomationLevel(pattern),
      usageCount: 0,
      lastUsed: 0,
      evolution: [
        {
          timestamp: Date.now(),
          powerDelta: 0,
          trigger: 'forged',
          newCapabilities: ['basic_execution'],
        },
      ],
    };

    // 生成自動化腳本/API
    authorityKey.script = await this.generateAutomationScript(authorityKey);
    authorityKey.api = this.generateAPIEndpoint(authorityKey);
    authorityKey.webhook = this.generateWebhookConfig(authorityKey);

    this.authorityKeys.set(authorityKey.id, authorityKey);

    // 存儲冶煉記錄
    await this.memoryPalace.store({
      type: 'skill',
      content: `Forged Authority Key: ${authorityKey.name} (Power: ${authorityKey.power})`,
      context: `authority-forge-${pattern.userId}`,
      tags: ['authority', 'forging', 'automation', ...pattern.tags],
      vectors: [],
      userId: pattern.userId,
      connections: [],
      confidence: 0.95,
    });

    omniLogger.info(LogCategory.SYSTEM, '[AuthorityForge] Info', { data: `✨ 權能鑰匙冶煉完成: ${authorityKey.name}` });
    return authorityKey;
  }

  /**
   * 權能進化
   */
  private async evolveAuthority(
    key: AuthorityKey,
    trigger: string,
    powerDelta: number
  ): Promise<void> {
    const oldPower = key.power;
    key.power = Math.max(1, Math.min(100, key.power + powerDelta));

    const evolution: AuthorityEvolution = {
      timestamp: Date.now(),
      powerDelta,
      trigger,
      newCapabilities: powerDelta > 0 ? this.generateNewCapabilities(key) : [],
    };

    key.evolution.push(evolution);

    // 如果權能顯著提升，重新生成更高級的自動化
    if (key.power > oldPower + 10) {
      key.automationLevel = Math.min(10, key.automationLevel + 1);
      key.script = await this.generateAutomationScript(key);
    }

    omniLogger.info(LogCategory.SYSTEM, '[AuthorityForge] Info', { data: `🧬 權能進化: ${key.name} (${oldPower} -> ${key.power})` });
  }

  /**
   * 檢查是否應該冶煉權能
   */
  private shouldForgeAuthority(pattern: BehaviorPattern): boolean {
    // 頻率閾值
    if (pattern.frequency < 5) return false;

    // 複雜度閾值
    if (pattern.complexity < 3) return false;

    // 時間耗費閾值
    if (pattern.timeSpent < 2) return false; // 少於2分鐘的任務不值得自動化

    // 成功率閾值
    if (pattern.successRate < 0.7) return false;

    // 檢查是否已有相似權能
    const existingKeys = Array.from(this.authorityKeys.values()).filter(
      key => key.userId === pattern.userId
    );

    const similarKey = existingKeys.find(
      key => this.calculateSimilarity(key.pattern, pattern) > 0.8
    );

    return !similarKey;
  }

  /**
   * 生成權能鑰匙名稱
   */
  private generateKeyName(pattern: BehaviorPattern): string {
    const actions = pattern.pattern.split(' ').slice(0, 2);
    return `${actions.join(' ')} AuthKey`;
  }

  /**
   * 生成權能描述
   */
  private generateKeyDescription(pattern: BehaviorPattern): string {
    return `自動化 ${pattern.pattern} 行為模式。平均耗時: ${pattern.timeSpent.toFixed(1)} 分鐘，成功率: ${(pattern.successRate * 100).toFixed(1)}%`;
  }

  /**
   * 計算初始權能強度
   */
  private calculateInitialPower(pattern: BehaviorPattern): number {
    let power = 10; // 基礎權能

    // 頻率貢獻
    power += Math.min(pattern.frequency * 2, 30);

    // 複雜度貢獻
    power += pattern.complexity * 3;

    // 成功率貢獻
    power += (pattern.successRate - 0.5) * 40;

    return Math.max(1, Math.min(100, power));
  }

  /**
   * 計算自動化程度
   */
  private calculateAutomationLevel(pattern: BehaviorPattern): number {
    // 基於複雜度和成功率計算自動化潛力
    const automation = (pattern.complexity / 10) * 0.6 + pattern.successRate * 0.4;
    return Math.max(1, Math.min(10, Math.round(automation * 10)));
  }

  /**
   * 生成自動化腳本
   */
  private async generateAutomationScript(key: AuthorityKey): Promise<string> {
    // 根據權能類型生成對應腳本
    const scriptTemplates = {
      'data-analysis': `
# 數據分析自動化腳本
import pandas as pd
from sklearn.model_selection import train_test_split

def analyze_data(data_source, target_metric):
    df = pd.read_csv(data_source)
    # 自動化分析邏輯
    results = {
        'summary': df.describe(),
        'correlations': df.corr()[target_metric],
        'insights': generate_insights(df, target_metric)
    }
    return results
      `,
      'task-automation': `
# 任務自動化腳本
import requests
from datetime import datetime

def automate_task(task_config):
    # 連接外部服務
    response = requests.post(task_config['webhook_url'], json={
        'task': task_config['name'],
        'triggered_by': 'authority_key',
        'timestamp': datetime.now().isoformat()
    })
    return response.json()
      `,
      'report-generation': `
# 報告生成自動化腳本
from jinja2 import Template
import pdfkit

def generate_report(data, template_path):
    template = Template(open(template_path).read())
    html_content = template.render(data=data)
    pdfkit.from_string(html_content, 'report.pdf')
    return 'report.pdf'
      `,
    };

    // 根據模式選擇模板
    const pattern = key.pattern.pattern.toLowerCase();
    let template = scriptTemplates['task-automation']; // 預設

    if (pattern.includes('分析') || pattern.includes('analysis')) {
      template = scriptTemplates['data-analysis'];
    } else if (pattern.includes('報告') || pattern.includes('report')) {
      template = scriptTemplates['report-generation'];
    }

    return template.trim();
  }

  /**
   * 生成 API 端點
   */
  private generateAPIEndpoint(key: AuthorityKey): string {
    return `/api/authority/${key.id}/execute`;
  }

  /**
   * 生成 Webhook 配置
   */
  private generateWebhookConfig(key: AuthorityKey): string {
    return JSON.stringify({
      url: `https://api.jun-ai-key.com/webhook/authority/${key.id}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key.userId}`,
        'Content-Type': 'application/json',
      },
      triggers: key.pattern.tags,
    });
  }

  /**
   * 生成新能力
   */
  private generateNewCapabilities(key: AuthorityKey): string[] {
    const capabilities = [];

    if (key.power > 50) {
      capabilities.push('parallel_execution');
    }

    if (key.automationLevel > 7) {
      capabilities.push('self_optimization');
    }

    if (key.usageCount > 100) {
      capabilities.push('predictive_execution');
    }

    return capabilities;
  }

  /**
   * 執行權能
   */
  private async executeAuthority(key: AuthorityKey, parameters: Record<string, any>): Promise<any> {
    // 模擬權能執行
    omniLogger.info(LogCategory.SYSTEM, '[AuthorityForge] Info', { data: `⚡ 執行權能鑰匙: ${key.name}` });

    // 這裡應該執行對應的自動化腳本或 API 調用
    // 實際實現中會根據 key.script 動態執行

    return {
      success: true,
      result: `Executed ${key.name} with power ${key.power}`,
      timestamp: new Date().toISOString(),
      parameters,
    };
  }

  // 工具方法
  private generatePatternKey(action: string, context: string): string {
    return `${action}:${context}`.toLowerCase().replace(/\s+/g, '-');
  }

  private extractPattern(action: string, context: string): string {
    return `${action} in ${context}`;
  }

  private calculateComplexity(
    action: string,
    context: string,
    metadata: Record<string, any>
  ): number {
    let complexity = 1;

    if (action.includes('analyze') || action.includes('分析')) complexity += 2;
    if (action.includes('create') || action.includes('創建')) complexity += 2;
    if (action.includes('integrate') || action.includes('整合')) complexity += 3;
    if (context.includes('multiple') || context.includes('多個')) complexity += 2;
    if (Object.keys(metadata).length > 3) complexity += 1;

    return Math.min(10, complexity);
  }

  private extractTags(action: string, context: string): string[] {
    const tags = [];

    if (action.includes('分析') || action.includes('analyze')) tags.push('analysis');
    if (action.includes('創建') || action.includes('create')) tags.push('creation');
    if (action.includes('自動化') || action.includes('automation')) tags.push('automation');
    if (context.includes('數據') || context.includes('data')) tags.push('data');
    if (context.includes('任務') || context.includes('task')) tags.push('task');

    return tags;
  }

  private calculateSimilarity(pattern1: BehaviorPattern, pattern2: BehaviorPattern): number {
    // 簡化的相似度計算
    const tagSimilarity =
      pattern1.tags.filter(tag => pattern2.tags.includes(tag)).length /
      Math.max(pattern1.tags.length, pattern2.tags.length);

    const actionSimilarity = pattern1.pattern.includes(pattern2.pattern.split(' ')[0] || '')
      ? 0.5
      : 0;

    return (tagSimilarity + actionSimilarity) / 2;
  }
}
