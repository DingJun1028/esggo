/**
 * 🔄 Adaptive Retry Strategy - Intelligent Error Handling
 * --------------------------------------------------
 * [Function] Exponential Backoff, Circuit Breaker, Error Classification
 * [Goal] Enhance system resilience to 99.9%
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

// ============================================================================
// Types
// ============================================================================

export enum ErrorCategory {
  TRANSIENT = 'transient', // Retryable (Network error)
  PERMANENT = 'permanent', // Non-retryable (Param error)
  RATE_LIMIT = 'rate_limit', // Rate limit
  TIMEOUT = 'timeout', // Timeout
  UNKNOWN = 'unknown', // Unknown error
}

export interface RetryConfig {
  baseDelay: number; // Base delay (ms)
  maxDelay: number; // Max delay (ms)
  maxAttempts: number; // Max attempts
  backoffMultiplier: number; // Backoff multiplier
  jitter: boolean; // Add random jitter
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Failure threshold
  successThreshold: number; // Success threshold (Half-open status)
  timeout: number; // Open circuit timeout (ms)
}

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

// ============================================================================
// Error Classifier
// ============================================================================

export class ErrorClassifier {
  /**
   * Classify error types
   */
  static classify(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();

    // Network related errors
    if (
      message.includes('network') ||
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('etimedout')
    ) {
      return ErrorCategory.TRANSIENT;
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out')) {
      return ErrorCategory.TIMEOUT;
    }

    // Rate limit
    if (
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('429')
    ) {
      return ErrorCategory.RATE_LIMIT;
    }

    // Param errors (non-retryable)
    if (
      message.includes('invalid') ||
      message.includes('bad request') ||
      message.includes('400') ||
      message.includes('404')
    ) {
      return ErrorCategory.PERMANENT;
    }

    // Default to transient error
    return ErrorCategory.TRANSIENT;
  }

  /**
   * Determine if retryable
   */
  static isRetryable(category: ErrorCategory): boolean {
    return category !== ErrorCategory.PERMANENT;
  }
}

// ============================================================================
// Circuit Breaker
// ============================================================================

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = 0;
  private config: CircuitBreakerConfig;
  private name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      successThreshold: config.successThreshold || 2,
      timeout: config.timeout || 60000, // 1 minute
    };
  }

  /**
   * Execute function (with circuit breaker protection)
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker is OPEN for ${this.name}`);
      }
      // Attempt half-open
      this.state = 'HALF_OPEN';
      omniLogger.info(LogCategory.SYSTEM, 'Circuit breaker transitioning to HALF_OPEN', {
        source_origin: 'CircuitBreaker',
        name: this.name,
      });
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Success callback
   */
  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        omniLogger.info(LogCategory.SYSTEM, 'Circuit breaker CLOSED', {
          source_origin: 'CircuitBreaker',
          name: this.name,
        });
      }
    }
  }

  /**
   * Failure callback
   */
  private onFailure(): void {
    this.failureCount++;
    this.successCount = 0;

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.config.timeout;

      omniLogger.warn(LogCategory.SYSTEM, 'Circuit breaker OPEN', {
        source_origin: 'CircuitBreaker',
        name: this.name,
        failureCount: this.failureCount,
        nextAttempt: new Date(this.nextAttempt).toISOString(),
      });
    }
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = 0;

    omniLogger.info(LogCategory.SYSTEM, 'Circuit breaker reset', {
      source_origin: 'CircuitBreaker',
      name: this.name,
    });
  }

  /**
   * Get state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      nextAttempt: this.nextAttempt,
    };
  }
}

// ============================================================================
// Adaptive Retry Strategy
// ============================================================================

export class AdaptiveRetryStrategy {
  private config: RetryConfig;
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      baseDelay: config.baseDelay || 1000,
      maxDelay: config.maxDelay || 30000,
      maxAttempts: config.maxAttempts || 3,
      backoffMultiplier: config.backoffMultiplier || 2,
      jitter: config.jitter !== false,
    };
  }

  /**
   * Execute function with retry
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    context: { name: string; category?: ErrorCategory }
  ): Promise<T> {
    const circuitBreaker = this.getOrCreateCircuitBreaker(context.name);

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await circuitBreaker.execute(fn);
      } catch (error: any) {
        const category = context.category || ErrorClassifier.classify(error);

        omniLogger.warn(LogCategory.SYSTEM, `Attempt ${attempt} failed`, {
          source_origin: 'AdaptiveRetryStrategy',
          name: context.name,
          category,
          error: error.message,
        });

        // Direct throw for non-retryable errors
        if (!ErrorClassifier.isRetryable(category)) {
          throw error;
        }

        // Last attempt, throw error
        if (attempt >= this.config.maxAttempts) {
          throw error;
        }

        // Calculate delay
        const delay = this.calculateDelay(attempt, category);
        omniLogger.debug(LogCategory.SYSTEM, `Retrying after ${delay}ms`, {
          source_origin: 'AdaptiveRetryStrategy',
          attempt,
          delay,
        });

        await this.sleep(delay);
      }
    }

    throw new Error('Max retry attempts exceeded');
  }

  /**
   * Calculate retry delay
   */
  private calculateDelay(attempt: number, category: ErrorCategory): number {
    let delay: number;

    switch (category) {
      case ErrorCategory.RATE_LIMIT:
        // Rate limit: fixed delay
        delay = 60000; // 60s
        break;

      case ErrorCategory.TIMEOUT:
        // Timeout: linear increase
        delay = this.config.baseDelay * attempt;
        break;

      case ErrorCategory.TRANSIENT:
      default:
        // Transient error: exponential backoff
        delay = Math.min(
          this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1),
          this.config.maxDelay
        );
        break;
    }

    // Add random jitter (avoid thundering herd effect)
    if (this.config.jitter) {
      const jitterAmount = delay * 0.1; // 10% jitter
      delay += Math.random() * jitterAmount - jitterAmount / 2;
    }

    return Math.floor(delay);
  }

  /**
   * Get or create circuit breaker
   */
  private getOrCreateCircuitBreaker(name: string): CircuitBreaker {
    if (!this.circuitBreakers.has(name)) {
      this.circuitBreakers.set(name, new CircuitBreaker(name));
    }
    return this.circuitBreakers.get(name)!;
  }

  /**
   * Sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers(): void {
    this.circuitBreakers.forEach(cb => cb.reset());
  }

  /**
   * Get all circuit breaker stats
   */
  getAllCircuitBreakerStats() {
    const stats: Record<string, any> = {};
    this.circuitBreakers.forEach((cb, name) => {
      stats[name] = cb.getStats();
    });
    return stats;
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const adaptiveRetryStrategy = new AdaptiveRetryStrategy();
export default adaptiveRetryStrategy;
