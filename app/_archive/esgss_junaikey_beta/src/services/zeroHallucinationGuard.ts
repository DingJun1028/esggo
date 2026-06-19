/**
 * ✅ Zero-Hallucination Guard
 * --------------------------------------------------
 * [Core] Zero-Hallucination Guard System
 * [Function] Verify response authenticity, refuse to answer when uncertain
 */

import { omniLogger } from './omniLogger.js';
import { LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';

export interface ICitation {
  [key: string]: unknown;
}

export interface VerificationResult {
  is_verified: boolean;
  confidence: number;
  issues: string[];
  suggestions: string[];
}

export interface FactCheckResult {
  claim: string;
  is_factual: boolean;
  evidence: string[];
  confidence: number;
}

class ZeroHallucinationGuard {
  private readonly MIN_CONFIDENCE = 0.7; // Minimum confidence threshold

  /**
   * Verify response
   */
  async verify(response: string, citations: ICitation[]): Promise<VerificationResult> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 1. Check for citations
    if (citations.length === 0) {
      issues.push('Missing source citations');
      suggestions.push('Please provide verifiable sources');
    }

    // 2. Check for uncertainty keywords
    const uncertainPhrases = ['possibly', 'maybe', 'perhaps', 'likely', 'potential'];
    const hasUncertainty = uncertainPhrases.some(phrase => response.toLowerCase().includes(phrase));

    if (hasUncertainty) {
      issues.push('Response contains uncertain phrases');
    }

    // 3. Check for absolute keywords (potential hallucination)
    const absolutePhrases = ['absolute', 'certain', 'inevitable', 'must', 'definitely'];
    const hasAbsolute = absolutePhrases.some(phrase => response.toLowerCase().includes(phrase));

    if (hasAbsolute && citations.length < 2) {
      issues.push('Absolute statements lack sufficient evidence');
      suggestions.push('Please provide more supporting sources');
    }

    // 4. Calculate overall confidence
    const confidence = this.calculateOverallConfidence(citations, issues);

    const is_verified = confidence >= this.MIN_CONFIDENCE && issues.length === 0;

    omniLogger.info(LogCategory.SYSTEM, 'ZeroHallucination: Response verification', {
      is_verified,
      confidence,
      issues_count: issues.length,
    });

    return {
      is_verified,
      confidence,
      issues,
      suggestions,
    };
  }

  /**
   * Fact check
   */
  async checkFact(claim: string): Promise<FactCheckResult> {
    // This should call an external fact-check API
    // Temporarily return basic check results

    const evidence: string[] = [];
    const is_factual = true;
    let confidence = 0.5;

    // Check for numbers (numeric claims require stronger evidence)
    const hasNumbers = /\d+/.test(claim);
    if (hasNumbers) {
      confidence = 0.3; // Lower confidence, needs more evidence
    }

    return {
      claim,
      is_factual,
      evidence,
      confidence,
    };
  }

  /**
   * Determine if answer should be refused
   */
  shouldRefuse(confidence: number, verification: VerificationResult): boolean {
    // Confidence too low
    if (confidence < this.MIN_CONFIDENCE) {
      return true;
    }

    // Significant issues detected
    if (verification.issues.length > 2) {
      return true;
    }

    return false;
  }

  /**
   * Generate refusal message
   */
  generateRefusalMessage(language: 'zh-TW' | 'en' = 'zh-TW'): string {
    if (language === 'zh-TW') {
      return (
        "I apologize, but I don't have sufficient confidence to provide an accurate answer. To avoid misinformation, I suggest:\n" +
        '1. Provide more context\n' +
        '2. Consult reliable sources\n' +
        '3. Seek expert advice'
      );
    } else {
      return (
        "I apologize, but I don't have sufficient confidence to provide an accurate answer. " +
        'To avoid misinformation, I suggest:\n' +
        '1. Provide more context\n' +
        '2. Consult reliable sources\n' +
        '3. Seek expert advice'
      );
    }
  }

  /**
   * Calculate overall confidence
   */
  private calculateOverallConfidence(citations: ICitation[], issues: string[]): number {
    let confidence = 1.0;

    // Adjust based on citation count
    if (citations.length === 0) {
      confidence *= 0.3;
    } else if (citations.length === 1) {
      confidence *= 0.6;
    } else {
      confidence *= 0.9;
    }

    // Adjust based on identified issues
    confidence *= Math.max(0.1, 1 - issues.length * 0.2);

    return Math.max(0, Math.min(1, confidence));
  }
}

// Singleton instance
export const zeroHallucinationGuard = new ZeroHallucinationGuard();
