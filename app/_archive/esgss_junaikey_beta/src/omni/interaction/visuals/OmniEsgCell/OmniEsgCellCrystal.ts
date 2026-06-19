/**
 * OmniEsgCell Crystal Core
 *
 * Inherits JunAiKey, implementing Omni ESG data display and interaction.
 */

import { JunAiKey } from '../../../core/OmniCrystal.ts';
import { omniLogger, LogCategory } from '../../../infrastructure/logging/OmniLogger.ts';
import { DateTime } from '../../../../types/omni/index.ts';
import type { Context, Result, Evolution, Feedback, OmniLabel } from '../../../../types/index.ts';

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
 * OmniEsgCell Crystal
 *
 * Component is Proxy, Proxy is Component (Omni-Identity Law)
 */
export class OmniEsgCellCrystal extends JunAiKey {
  private config: OmniEsgCellConfig = {
    defaultColor: 'emerald',
    cacheEnabled: true,
    adaptiveLayout: true,
  };
  private renderCache: Map<string, unknown> = new Map();

  constructor() {
    super('OmniEsgCell'); // Initially in OmniEsgCell mode
  }

  /**
   * Initialization - get configuration from Eternal Palace
   */
  protected async onInitialize(): Promise<void> {
    omniLogger.info(LogCategory.UI, '[OmniEsgCell] Initializing...');

    // Query best practices from Eternal Memory
    const response = await this.memoryLink.query({
      type: 'best-practices',
      params: { query: 'optimal-esg-cell-config' },
    });

    if (response.success && response.data) {
      this.config = response.data as OmniEsgCellConfig;
      omniLogger.info(LogCategory.UI, '[OmniEsgCell] Config loaded from Eternal Palace');
    } else {
      // Use default configuration
      this.config = {
        defaultColor: 'emerald',
        cacheEnabled: true,
        adaptiveLayout: true,
      };
    }
  }

  /**
   * Execution - Process data and generate UI
   */
  protected async onExecute(context: OmniEsgCellContext): Promise<Result> {
    const { input } = context;

    try {
      // Check cache
      const cacheKey = JSON.stringify(input);
      if (this.config.cacheEnabled && this.renderCache.has(cacheKey)) {
        return {
          success: true,
          output: this.renderCache.get(cacheKey),
        };
      }

      // Process data
      const processedData = this.processData(input);

      // Generate UI configuration
      const uiConfig = this.generateUIConfig(processedData);

      // Cache result
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
        error: error as Error,
      };
    }
  }

  /**
   * Evolution - Optimize based on user feedback
   */
  protected async onEvolve(feedback: Feedback): Promise<Evolution> {
    const optimizations: string[] = [];

    // Adjust configuration based on success rate
    if (feedback.success) {
      if (feedback.metrics?.renderTime && feedback.metrics.renderTime < 50) {
        optimizations.push('performance-optimal');
      }
    } else {
      // Degradation strategy on failure
      this.config.cacheEnabled = false;
      optimizations.push('cache-disabled');
    }

    // Record to Eternal Memory
    await this.memoryLink.recordEvolution({
      type: 'evolution',
      timestamp: new DateTime(),
      data: { feedback, optimizations } as Record<string, unknown>,
    });

    return {
      optimizations,
      confidence: 0.85,
      improvements: {
        performance: feedback.success ? 'optimized' : 'pending',
        cacheEfficiency: this.config.cacheEnabled ? 'high' : 'off',
      },
    };
  }

  /**
   * Data Processing
   */
  private processData(input: OmniEsgCellContext['input']): OmniEsgCellContext['input'] {
    // Apply Omni Label rules
    if (input.omniLabel) {
      const label = input.omniLabel;

      // Verification
      if (label.validation?.pattern && input.value) {
        const regex = new RegExp(label.validation.pattern);
        if (!regex.test(String(input.value))) {
          throw new Error(label.validation.errorMessage || 'Validation failed');
        }
      }

      // PII Masking
      if (label.pii && input.value) {
        input.value = this.maskPII(String(input.value));
      }
    }

    return input;
  }

  /**
   * Generate UI Configuration
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
   * PII Masking
   */
  private maskPII(value: string): string {
    if (value.length <= 4) return '***';
    return value.slice(0, 2) + '***' + value.slice(-2);
  }

  /**
   * Switch to Agent mode (proactively obtain data)
   */
  async switchToAgentMode(): Promise<void> {
    this.switchMode('OmniAgent');
    omniLogger.info(LogCategory.UI, '[OmniEsgCell] Switched to OmniAgent mode');
    // In Agent mode, API calls can be actively made
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.renderCache.clear();
    omniLogger.info(LogCategory.UI, '[OmniEsgCell] Cache cleared');
  }

  /**
   * Destroy Crystal Core (Resilience Hardening)
   */
  override async destroy(): Promise<void> {
    this.clearCache();
    await super.destroy();
    omniLogger.info(LogCategory.UI, `[OmniEsgCell] ${this.crystalId} destroyed`);
  }
}
