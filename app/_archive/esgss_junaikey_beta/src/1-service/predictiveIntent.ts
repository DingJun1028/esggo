/**
 * 🔮 Predictive Intent Engine
 * --------------------------------------------------
 * [核心] 預測性意圖識別
 * [功能] 打字時即時預測意圖，主動提供解決方案
 */

import { omniLogger, LogCategory } from './omniLogger';

export interface PredictiveIntent {
  predicted_intent: string;
  confidence: number;
  suggested_actions: SuggestedAction[];
  context_clues: string[];
  typing_pattern: TypingPattern;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  action: () => void;
  confidence: number;
}

export interface TypingPattern {
  speed: number;
  pauses: number[];
  corrections: number;
}

export interface ConversationContext {
  recent_messages: any[];
  user_behavior: any;
  current_page: string;
  time_of_day: string;
  pending_tasks: any[];
}

class PredictiveIntentEngine {
  private typingHistory: string[] = [];
  private lastTypingTime: number = 0;

  /**
   * 即時預測意圖（打字時調用）
   */
  async predictIntent(
    partialInput: string,
    context: ConversationContext
  ): Promise<PredictiveIntent> {
    // 記錄打字模式
    const typing_pattern = this.analyzeTypingPattern(partialInput);

    // 提取上下文線索
    const context_clues = this.extractContextClues(partialInput, context);

    // 預測意圖
    const predicted_intent = this.inferIntent(partialInput, context_clues);

    // 計算信心度
    const confidence = this.calculateConfidence(partialInput, context_clues);

    // 生成建議操作
    const suggested_actions = await this.generateSuggestions(
      predicted_intent,
      partialInput,
      context
    );

    omniLogger.info(LogCategory.SYSTEM, 'PredictiveEngine', 'Intent predicted', {
      predicted_intent,
      confidence,
      actions_count: suggested_actions.length,
    });

    return {
      predicted_intent,
      confidence,
      suggested_actions,
      context_clues,
      typing_pattern,
    };
  }

  /**
   * 分析打字模式
   */
  private analyzeTypingPattern(input: string): TypingPattern {
    const now = Date.now();
    const timeDiff = this.lastTypingTime > 0 ? now - this.lastTypingTime : 0;

    this.typingHistory.push(input);
    this.lastTypingTime = now;

    return {
      speed: timeDiff > 0 ? 1000 / timeDiff : 0,
      pauses: [], // 實際應該記錄停頓位置
      corrections: 0, // 實際應該檢測修正次數
    };
  }

  /**
   * 提取上下文線索
   */
  private extractContextClues(input: string, context: ConversationContext): string[] {
    const clues: string[] = [];

    // 時間線索
    const hour = new Date().getHours();
    if (hour < 12) clues.push('morning');
    else if (hour < 18) clues.push('afternoon');
    else clues.push('evening');

    // 關鍵詞線索
    if (input.includes('明天') || input.includes('tomorrow')) clues.push('future_time');
    if (input.includes('會議') || input.includes('meeting')) clues.push('meeting');
    if (input.includes('提醒') || input.includes('remind')) clues.push('reminder');
    if (input.includes('分析') || input.includes('analyze')) clues.push('analysis');

    return clues;
  }

  /**
   * 推斷意圖
   */
  private inferIntent(input: string, clues: string[]): string {
    // 基於關鍵詞和線索推斷
    if (clues.includes('meeting') && clues.includes('future_time')) {
      return 'create_meeting';
    }
    if (clues.includes('reminder')) {
      return 'set_reminder';
    }
    if (clues.includes('analysis')) {
      return 'analyze_data';
    }

    // 預設意圖
    return 'general_query';
  }

  /**
   * 計算信心度
   */
  private calculateConfidence(input: string, clues: string[]): number {
    let confidence = 0.5;

    // 輸入長度影響
    if (input.length > 10) confidence += 0.2;
    if (input.length > 20) confidence += 0.1;

    // 線索數量影響
    confidence += Math.min(clues.length * 0.1, 0.3);

    return Math.min(confidence, 1.0);
  }

  /**
   * 生成建議操作
   */
  private async generateSuggestions(
    intent: string,
    input: string,
    context: ConversationContext
  ): Promise<SuggestedAction[]> {
    const suggestions: SuggestedAction[] = [];

    switch (intent) {
      case 'create_meeting':
        suggestions.push({
          id: 'create-meeting',
          title: '創建會議',
          description: '根據您的輸入創建會議活動',
          action: () => omniLogger.info(LogCategory.AI, 'Creating meeting'),
          confidence: 0.8,
        });
        suggestions.push({
          id: 'view-calendar',
          title: '查看行事曆',
          description: '查看明天的行程',
          action: () => omniLogger.info(LogCategory.AI, 'Viewing calendar'),
          confidence: 0.6,
        });
        break;

      case 'set_reminder':
        suggestions.push({
          id: 'set-reminder',
          title: '設定提醒',
          description: '創建提醒事項',
          action: () => omniLogger.info(LogCategory.AI, 'Setting reminder'),
          confidence: 0.9,
        });
        break;

      case 'analyze_data':
        suggestions.push({
          id: 'analyze',
          title: '數據分析',
          description: '分析相關數據',
          action: () => omniLogger.info(LogCategory.AI, 'Analyzing data'),
          confidence: 0.7,
        });
        break;
    }

    return suggestions;
  }
}

export const predictiveIntentEngine = new PredictiveIntentEngine();
