/**
 * ⚡ Batch Tool Execution - MCP Tool Batch Processing
 * --------------------------------------------------
 * [Function] Parallel execution, result aggregation, error isolation
 * [Goal] Increase throughput by 10x
 */

import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger.js';

// ============================================================================
// Types
// ============================================================================

export interface BatchExecutionOptions {
  parallel: boolean; // Parallel execution
  maxConcurrency: number; // Max concurrency
  failFast: boolean; // Fail fast (stop immediately on error)
  aggregateResults: boolean; // Aggregate results
  timeout?: number; // Overall timeout (ms)
}

export interface BatchToolCall {
  id?: string; // Optional unique ID
  name: string; // Tool name
  args: Record<string, any>; // Tool arguments
}

export interface BatchToolResult {
  id?: string;
  toolName: string;
  result: any;
  error?: string;
  executionTime: number;
  status: 'success' | 'failed';
}

export interface BatchResult {
  successful: BatchToolResult[];
  failed: BatchToolResult[];
  totalTime: number;
  successRate: number;
  totalCalls: number;
}

// ============================================================================
// Semaphore for Concurrency Control
// ============================================================================

class Semaphore {
  private permits: number;
  private queue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    const resolve = this.queue.shift();
    if (resolve) {
      this.permits--;
      resolve();
    }
  }
}

// ============================================================================
// Batch Executor
// ============================================================================

export class BatchExecutor {
  /**
   * Execute batch tool calls
   */
  async execute(
    tools: BatchToolCall[],
    executor: (toolName: string, args: Record<string, any>) => Promise<any>,
    options: Partial<BatchExecutionOptions> = {}
  ): Promise<BatchResult> {
    const config: BatchExecutionOptions = {
      parallel: options.parallel !== false,
      maxConcurrency: options.maxConcurrency || 5,
      failFast: options.failFast || false,
      aggregateResults: options.aggregateResults !== false,
      timeout: options.timeout,
    };

    omniLogger.info(LogCategory.AI, 'Batch execution started', {
      source_origin: 'BatchExecutor',
      totalTools: tools.length,
      config,
    });

    const startTime = Date.now();
    const successful: BatchToolResult[] = [];
    const failed: BatchToolResult[] = [];

    try {
      if (config.parallel) {
        await this.executeParallel(tools, executor, config, successful, failed);
      } else {
        await this.executeSequential(tools, executor, config, successful, failed);
      }
    } catch (error: any) {
      omniLogger.error(LogCategory.AI, 'Batch execution error', {
        error: error.message,
      });
    }

    const totalTime = Date.now() - startTime;
    const totalCalls = successful.length + failed.length;
    const successRate = totalCalls > 0 ? (successful.length / totalCalls) * 100 : 0;

    const result: BatchResult = {
      successful,
      failed,
      totalTime,
      successRate: Math.round(successRate * 100) / 100,
      totalCalls,
    };

    omniLogger.info(LogCategory.AI, 'Batch execution completed', {
      source_origin: 'BatchExecutor',
      ...result,
    });

    return result;
  }

  /**
   * Parallel execution
   */
  private async executeParallel(
    tools: BatchToolCall[],
    executor: (toolName: string, args: Record<string, any>) => Promise<any>,
    config: BatchExecutionOptions,
    successful: BatchToolResult[],
    failed: BatchToolResult[]
  ): Promise<void> {
    const semaphore = new Semaphore(config.maxConcurrency);
    const promises: Promise<void>[] = [];

    for (const tool of tools) {
      const promise = (async () => {
        await semaphore.acquire();
        try {
          const result = await this.executeSingleTool(tool, executor);
          if (result.status === 'success') {
            successful.push(result);
          } else {
            failed.push(result);
            if (config.failFast) {
              throw new Error(`Tool ${tool.name} failed: ${result.error}`);
            }
          }
        } finally {
          semaphore.release();
        }
      })();

      promises.push(promise);
    }

    if (config.timeout) {
      await Promise.race([
        Promise.all(promises),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Batch execution timeout')), config.timeout)
        ),
      ]);
    } else {
      await Promise.all(promises);
    }
  }

  /**
   * Sequential execution
   */
  private async executeSequential(
    tools: BatchToolCall[],
    executor: (toolName: string, args: Record<string, any>) => Promise<any>,
    config: BatchExecutionOptions,
    successful: BatchToolResult[],
    failed: BatchToolResult[]
  ): Promise<void> {
    for (const tool of tools) {
      const result = await this.executeSingleTool(tool, executor);

      if (result.status === 'success') {
        successful.push(result);
      } else {
        failed.push(result);
        if (config.failFast) {
          throw new Error(`Tool ${tool.name} failed: ${result.error}`);
        }
      }
    }
  }

  /**
   * Execute single tool
   */
  private async executeSingleTool(
    tool: BatchToolCall,
    executor: (toolName: string, args: Record<string, any>) => Promise<any>
  ): Promise<BatchToolResult> {
    const startTime = Date.now();

    try {
      const result = await executor(tool.name, tool.args);
      const executionTime = Date.now() - startTime;

      return {
        id: tool.id,
        toolName: tool.name,
        result,
        executionTime,
        status: 'success',
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        id: tool.id,
        toolName: tool.name,
        result: null,
        error: error.message,
        executionTime,
        status: 'failed',
      };
    }
  }

  /**
   * Aggregate results (by tool type)
   */
  aggregateResults(results: BatchToolResult[]): Record<string, any[]> {
    const aggregated: Record<string, any[]> = {};

    for (const result of results) {
      if (result.status === 'success') {
        if (result.toolName) {
          const list = (aggregated[result.toolName] ||= []);
          list.push(result.result);
        }
      }
    }

    return aggregated;
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const batchExecutor = new BatchExecutor();
export default batchExecutor;
