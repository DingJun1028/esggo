import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * 熔斷器 (Circuit Breaker)
 *
 * 基於奧秘元件定義報告 V1.2 第五章
 * 防止級聯故障,實現優雅降級
 */

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitStats {
  state: CircuitState;
  failures: number;
  lastFailure: number;
  resetTimeout: number;
}

/**
 * 熔斷器管理器 (精簡版)
 */
class CircuitBreakerManager {
  private circuits = new Map<string, CircuitStats>();
  private readonly threshold = 5; // 5次失敗觸發熔斷
  private readonly timeout = 30000; // 30秒冷卻

  /**
   * 檢查熔斷器是否斷開
   */
  isOpen(key: string): boolean {
    const circuit = this.getCircuit(key);

    if (circuit.state === 'OPEN') {
      // 檢查是否可進入半開狀態
      if (Date.now() - circuit.lastFailure > this.timeout) {
        circuit.state = 'HALF_OPEN';
        omniLogger.info(LogCategory.SYSTEM, '[CircuitBreaker] Info', { data: `⚡ Circuit HALF_OPEN: ${key}` });
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * 記錄失敗
   */
  recordFailure(key: string): void {
    const circuit = this.getCircuit(key);
    circuit.failures++;
    circuit.lastFailure = Date.now();

    if (circuit.failures >= this.threshold) {
      circuit.state = 'OPEN';
      omniLogger.error(LogCategory.SYSTEM, '[CircuitBreaker] Error', { error: `🚫 Circuit OPEN: ${key} (${circuit.failures} failures)` });
    }
  }

  /**
   * 記錄成功
   */
  recordSuccess(key: string): void {
    const circuit = this.getCircuit(key);

    if (circuit.state === 'HALF_OPEN') {
      circuit.state = 'CLOSED';
      circuit.failures = 0;
      omniLogger.info(LogCategory.SYSTEM, '[CircuitBreaker] Info', { data: `✅ Circuit CLOSED: ${key}` });
    } else if (circuit.failures > 0) {
      circuit.failures = Math.max(0, circuit.failures - 1); // 逐步恢復
    }
  }

  /**
   * 獲取或創建熔斷器
   */
  private getCircuit(key: string): CircuitStats {
    if (!this.circuits.has(key)) {
      this.circuits.set(key, {
        state: 'CLOSED',
        failures: 0,
        lastFailure: 0,
        resetTimeout: this.timeout,
      });
    }
    return this.circuits.get(key)!;
  }

  /**
   * 獲取所有熔斷器狀態 (用於監控)
   */
  getStats(): Record<string, CircuitStats> {
    const stats: Record<string, CircuitStats> = {};
    this.circuits.forEach((value, key) => {
      stats[key] = { ...value };
    });
    return stats;
  }
}

export const CircuitBreaker = new CircuitBreakerManager();
