/**
 * 🔮 Predictive Intent Engine
 * --------------------------------------------------
 * [Core] Predictive Intent Recognition
 * [Function] Real-time intent prediction while typing, proactively provides solutions
 */

import { omniLogger, LogCategory } from './omniLogger.js';

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
   * Real-time intent prediction (called while typing)
   */
  async predictIntent(
    partialInput: string,
    context: ConversationContext
  ): Promise<PredictiveIntent> {
    // Record typing pattern
    const typing_pattern = this.analyzeTypingPattern(partialInput);

    // Extract context clues
    const context_clues = this.extractContextClues(partialInput, context);

    // Predict intent
    const predicted_intent = this.inferIntent(partialInput, context_clues);

    // Calculate confidence
    const confidence = this.calculateConfidence(partialInput, context_clues);

    // Generate suggested actions
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
   * Analyze typing pattern
   */
  private analyzeTypingPattern(input: string): TypingPattern {
    const now = Date.now();
    const timeDiff = this.lastTypingTime > 0 ? now - this.lastTypingTime : 0;

    this.typingHistory.push(input);
    this.lastTypingTime = now;

    return {
      speed: timeDiff > 0 ? 1000 / timeDiff : 0,
      pauses: [], // Should actually record pause positions
      corrections: 0, // Should actually detect correction count
    };
  }

  /**
   * Extract context clues
   */
  private extractContextClues(input: string, context: ConversationContext): string[] {
    const clues: string[] = [];

    // Time clues
    const hour = new Date().getHours();
    if (hour < 12) clues.push('morning');
    else if (hour < 18) clues.push('afternoon');
    else clues.push('evening');

    // Keyword clues
    if (input.includes('tomorrow')) clues.push('future_time');
    if (input.includes('meeting')) clues.push('meeting');
    if (input.includes('remind')) clues.push('reminder');
    if (input.includes('analyze')) clues.push('analysis');

    return clues;
  }

  /**
   * Infer intent
   */
  private inferIntent(input: string, clues: string[]): string {
    // Infer based on keywords and clues
    if (clues.includes('meeting') && clues.includes('future_time')) {
      return 'create_meeting';
    }
    if (clues.includes('reminder')) {
      return 'set_reminder';
    }
    if (clues.includes('analysis')) {
      return 'analyze_data';
    }

    // Default intent
    return 'general_query';
  }

  /**
   * Calculate confidence
   */
  private calculateConfidence(input: string, clues: string[]): number {
    let confidence = 0.5;

    // Input length impact
    if (input.length > 10) confidence += 0.2;
    if (input.length > 20) confidence += 0.1;

    // Clue count impact
    confidence += Math.min(clues.length * 0.1, 0.3);

    return Math.min(confidence, 1.0);
  }

  /**
   * Generate suggested actions
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
          title: 'Create Meeting',
          description: 'Based on your input, create a meeting event',
          action: () => omniLogger.info(LogCategory.AI, 'Creating meeting'),
          confidence: 0.8,
        });
        suggestions.push({
          id: 'view-calendar',
          title: 'View Calendar',
          description: "View tomorrow's schedule",
          action: () => omniLogger.info(LogCategory.AI, 'Viewing calendar'),
          confidence: 0.6,
        });
        break;

      case 'set_reminder':
        suggestions.push({
          id: 'set-reminder',
          title: 'Set Reminder',
          description: 'Create reminder item',
          action: () => omniLogger.info(LogCategory.AI, 'Setting reminder'),
          confidence: 0.9,
        });
        break;

      case 'analyze_data':
        suggestions.push({
          id: 'analyze',
          title: 'Data Analysis',
          description: 'Analyze relevant data',
          action: () => omniLogger.info(LogCategory.AI, 'Analyzing data'),
          confidence: 0.7,
        });
        break;
    }

    return suggestions;
  }
}

export const predictiveIntentEngine = new PredictiveIntentEngine();
