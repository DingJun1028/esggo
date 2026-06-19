/**
 * OmniEsgCell 晶體核心
 *
 * 繼承 JunAiKey,實現 ESG 數據的奧秘展示與交互
 */

import { Omnicrystal, CrystalContext, CrystalResult } from '@domain';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { DateTime } from '@/types/omni';
import type { Context, Result, Evolution, Feedback, OmniLabel } from '@/types';

interface OmniEsgCellConfig {
  defaultColor: string;
  cacheEnabled: boolean;
  adaptiveLayout: boolean;
}

interface OmniEsgCellContext extends Context {
  input: {
    label?: string;
    value?: string | number;
    confidence?: 'high' | 'medium' | 'low';
    dataLink?: 'live' | 'ai' | 'blockchain';
    omniLabel?: OmniLabel;
  };
}

/**
 * OmniEsgCell 晶體 (Omnicrystal)
 *
 * 元件即代理,代理即元件 (奧秘同一律)
 * [心核] 奧秘元件核心心核
 */
export class OmniEsgCellCrystal extends Omnicrystal {
  private config: OmniEsgCellConfig = {
    defaultColor: 'emerald',
    cacheEnabled: true,
    adaptiveLayout: true,
  };
  private renderCache: Map<string, unknown> = new Map();

  constructor() {
    super('OmniEsgCell'); // 初始為 OmniEsgCell 模式
  }

  /**
   * 初始化 - 從永恆宮殿獲取配置
   */
  protected async onInitialize(): Promise<void> {
    omniLogger.info(LogCategory.UI, '[OmniEsgCell] Initializing...');

    // 從終焉永憶查詢最佳實踐
    const response = await this.memoryLink.query({
      type: 'best-practices',
      params: { query: 'optimal-esg-cell-config' },
    });

    if (response.success && response.data) {
      this.config = response.data as OmniEsgCellConfig;
      omniLogger.info(LogCategory.UI, '[OmniEsgCell] Config loaded from Eternal Palace');
    } else {
      // 使用預設配置
      this.config = {
        defaultColor: 'emerald',
        cacheEnabled: true,
        adaptiveLayout: true,
      };
    }
  }

  /**
   * 執行 - 處理數據並生成 UI
   */
  protected async onExecute(context: CrystalContext): Promise<CrystalResult> {
    const { input } = context as any;

    try {
      // 檢查快取
      const cacheKey = JSON.stringify(input);
      if (this.config.cacheEnabled && this.renderCache.has(cacheKey)) {
        return {
          success: true,
          output: this.renderCache.get(cacheKey),
        };
      }

      // 處理數據
      const processedData = this.processData(input);

      // 生成 UI 配置
      const uiConfig = this.generateUIConfig(processedData);

      // 快取結果
      if (this.config.cacheEnabled) {
        this.renderCache.set(cacheKey, uiConfig);
      }

      return {
        success: true,
        output: uiConfig,
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        error: error as Error,
      };
    }
  }

  /**
   * 演化 - 基於用戶反饋優化
   */
  protected async onEvolve(feedback: Feedback): Promise<Evolution> {
    const optimizations: string[] = [];

    // 基於成功率調整配置
    if (feedback.success) {
      if (feedback.metrics?.renderTime && feedback.metrics.renderTime < 50) {
        optimizations.push('performance-optimal');
      }
    } else {
      // 失敗時的降級策略
      this.config.cacheEnabled = false;
      optimizations.push('cache-disabled');
    }

    // 記錄到永憶
    return {
      optimizations,
      confidence: 0.85,
      improvements: {
        performance: feedback.success ? 'optimized' : 'pending',
        cacheEfficiency: this.config.cacheEnabled ? 'high' : 'off',
      },
    } as any;
  }

  /**
   * 數據處理
   */
  private processData(input: OmniEsgCellContext['input']): OmniEsgCellContext['input'] {
    // 應用奧秘標籤規則
    if (input.omniLabel) {
      const label = input.omniLabel;

      // 驗證
      if (label.validation?.pattern && input.value) {
        const regex = new RegExp(label.validation.pattern);
        if (!regex.test(String(input.value))) {
          throw new Error(label.validation.errorMessage || 'Validation failed');
        }
      }

      // PII 遮罩
      if (label.pii && input.value) {
        input.value = this.maskPII(String(input.value));
      }
    }

    return input;
  }

  /**
   * 生成 UI 配置
   */
  private generateUIConfig(data: OmniEsgCellContext['input']): Record<string, unknown> {
    let displayColor = this.config.defaultColor;
    let icon = null;
    let tooltipMessage = '';

    // Adaptive logic based on data confidence
    if (data.confidence === 'low') {
      displayColor = 'red';
      icon = 'AlertTriangle'; // Example icon
      tooltipMessage += 'Low confidence data. Verification recommended. ';
    } else if (data.confidence === 'medium') {
      displayColor = 'orange';
      icon = 'Info'; // Example icon
      tooltipMessage += 'Medium confidence data. ';
    } else if (data.confidence === 'high') {
      displayColor = 'green';
      icon = 'CheckCircle'; // Example icon
      tooltipMessage += 'High confidence data. ';
    }

    // Adaptive logic based on data link type
    if (data.dataLink === 'blockchain') {
      displayColor = 'blue'; // Blockchain often associated with blue
      icon = 'Link'; // Example icon for blockchain
      tooltipMessage += 'Blockchain Verified. ';
    } else if (data.dataLink === 'ai') {
      if (!icon) icon = 'Brain'; // If no confidence icon, use AI icon
      tooltipMessage += 'AI Generated Insight. ';
    } else if (data.dataLink === 'live') {
      if (!icon) icon = 'Activity'; // If no confidence icon, use Live icon
      tooltipMessage += 'Real-time data stream. ';
    }

    // Default to an icon if none selected yet for consistency
    if (!icon) icon = 'Circle';

    return {
      mode: this.crystalType === 'OmniEsgCell' ? 'card' : 'list',
      label: data.label,
      value: data.value,
      confidence: data.confidence || 'high',
      dataLink: data.dataLink,
      color: displayColor,
      icon, // Pass the chosen icon
      tooltip: tooltipMessage.trim(), // Pass the generated tooltip
    };
  }

  /**
   * PII 遮罩
   */
  private maskPII(value: string): string {
    if (value.length <= 4) return '***';
    return value.slice(0, 2) + '***' + value.slice(-2);
  }

  /**
   * 切換為 Agent 模式 (主動獲取數據)
   */
  async switchToAgentMode(): Promise<void> {
    this.switchMode('OmniAgent');
    omniLogger.info(LogCategory.UI, '[OmniEsgCell] Switched to OmniAgent mode');
    // Agent 模式下可主動調用 API
  }

  /**
   * 清理快取
   */
  clearCache(): void {
    this.renderCache.clear();
    omniLogger.info(LogCategory.UI, '[OmniEsgCell] Cache cleared');
  }

  /**
   * 銷毀心核 (Resilience Hardening)
   */
  override async destroy(): Promise<void> {
    this.clearCache();
    await super.destroy();
    omniLogger.info(LogCategory.UI, `[OmniEsgCell] ${this.crystalId} destroyed`);
  }
}
