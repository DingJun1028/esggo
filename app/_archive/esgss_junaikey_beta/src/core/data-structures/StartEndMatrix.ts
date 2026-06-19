/**
 * Start-End Matrix 數據結構
 * 三元一體設計概念的核心數據模型
 * 
 * 概念：
 * - Start: 起始點，代表用戶旅程的開始
 * - End: 終點，代表用戶旅程的結束
 * - Matrix: 矩陣，代表中間的轉換和處理過程
 * 
 * 三元一體：
 * 1. 數據層 (Data Layer) - Start
 * 2. 邏輯層 (Logic Layer) - Matrix
 * 3. 展示層 (Presentation Layer) - End
 */

// ============================================================================
// 類型定義
// ============================================================================

/**
 * UUID 類型 - 使用嚴格的 UUID 格式
 */
export type UUID = string & { readonly __brand: unique symbol };

/**
 * UUID 驗證和生成工具
 */
export class UUIDUtil {
  /**
   * 生成新的 UUID v4
   */
  static generate(): UUID {
    return crypto.randomUUID() as UUID;
  }

  /**
   * 驗證 UUID 格式
   */
  static isValid(uuid: string): uuid is UUID {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * 格式化 UUID 顯示
   */
  static format(uuid: UUID, options: {
    short?: boolean;
    uppercase?: boolean;
  } = {}): string {
    const { short = false, uppercase = false } = options;
    let result = uuid;

    if (uppercase) {
      result = result.toUpperCase();
    }

    if (short) {
      return result.split('-')[0];
    }

    return result;
  }
}

/**
 * 矩陣節點類型
 */
export enum MatrixNodeType {
  DATA = 'data',
  LOGIC = 'logic',
  PRESENTATION = 'presentation',
  TRANSITION = 'transition',
  VALIDATION = 'validation',
}

/**
 * 矩陣節點狀態
 */
export enum MatrixNodeState {
  IDLE = 'idle',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ERROR = 'error',
  SKIPPED = 'skipped',
}

/**
 * 矩陣節點接口
 */
export interface MatrixNode<T = any> {
  id: UUID;
  type: MatrixNodeType;
  state: MatrixNodeState;
  data: T;
  metadata: {
    timestamp: number;
    duration?: number;
    error?: Error;
  };
  dependencies: UUID[];
}

/**
 * Start-End Matrix 接口
 */
export interface StartEndMatrix<T = any, R = any> {
  id: UUID;
  name: string;
  description?: string;
  
  // Start 節點 - 數據輸入
  start: MatrixNode<T>;
  
  // Matrix 節點 - 邏輯處理
  matrix: MatrixNode<any>[];
  
  // End 節點 - 結果輸出
  end: MatrixNode<R>;
  
  // 元數據
  metadata: {
    createdAt: number;
    updatedAt: number;
    version: string;
    language: 'zh-TW' | 'en';
  };
}

/**
 * 矩陣轉換函數類型
 */
export type MatrixTransform<T, R> = (input: T) => Promise<R> | R;

/**
 * 矩陣驗證函數類型
 */
export type MatrixValidator<T> = (input: T) => boolean | Promise<boolean>;

// ============================================================================
// Start-End Matrix 實現類
// ============================================================================

/**
 * Start-End Matrix 構建器
 * 使用建造者模式創建矩陣
 */
export class StartEndMatrixBuilder<T = any, R = any> {
  private id: UUID;
  private name: string = '';
  private description?: string;
  private startNode?: MatrixNode<T>;
  private matrixNodes: MatrixNode<any>[] = [];
  private endNode?: MatrixNode<R>;
  private language: 'zh-TW' | 'en' = 'zh-TW';

  constructor() {
    this.id = UUIDUtil.generate();
  }

  /**
   * 設置矩陣名稱
   */
  setName(name: string): this {
    this.name = name;
    return this;
  }

  /**
   * 設置矩陣描述
   */
  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  /**
   * 設置語言
   */
  setLanguage(language: 'zh-TW' | 'en'): this {
    this.language = language;
    return this;
  }

  /**
   * 添加 Start 節點
   */
  withStart(data: T, metadata?: Partial<MatrixNode<T>['metadata']>): this {
    this.startNode = {
      id: UUIDUtil.generate(),
      type: MatrixNodeType.DATA,
      state: MatrixNodeState.IDLE,
      data,
      metadata: {
        timestamp: Date.now(),
        ...metadata,
      },
      dependencies: [],
    };
    return this;
  }

  /**
   * 添加 Matrix 節點
   */
  withMatrixNode<TNode = any>(
    type: MatrixNodeType,
    data: TNode,
    dependencies: UUID[] = [],
    metadata?: Partial<MatrixNode<TNode>['metadata']>
  ): this {
    const node: MatrixNode<TNode> = {
      id: UUIDUtil.generate(),
      type,
      state: MatrixNodeState.IDLE,
      data,
      metadata: {
        timestamp: Date.now(),
        ...metadata,
      },
      dependencies,
    };
    this.matrixNodes.push(node);
    return this;
  }

  /**
   * 添加 End 節點
   */
  withEnd(data: R, dependencies: UUID[] = [], metadata?: Partial<MatrixNode<R>['metadata']>): this {
    this.endNode = {
      id: UUIDUtil.generate(),
      type: MatrixNodeType.PRESENTATION,
      state: MatrixNodeState.IDLE,
      data,
      metadata: {
        timestamp: Date.now(),
        ...metadata,
      },
      dependencies,
    };
    return this;
  }

  /**
   * 構建矩陣
   */
  build(): StartEndMatrix<T, R> {
    if (!this.startNode) {
      throw new Error('Start node is required');
    }
    if (!this.endNode) {
      throw new Error('End node is required');
    }

    const now = Date.now();
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      start: this.startNode,
      matrix: this.matrixNodes,
      end: this.endNode,
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: '1.0.0',
        language: this.language,
      },
    };
  }
}

/**
 * Start-End Matrix 執行器
 * 負責執行矩陣中的轉換和驗證
 */
export class StartEndMatrixExecutor {
  /**
   * 執行矩陣轉換
   */
  static async execute<T, R>(
    matrix: StartEndMatrix<T, R>,
    transforms: Map<UUID, MatrixTransform<any, any>>,
    validators?: Map<UUID, MatrixValidator<any>>
  ): Promise<StartEndMatrix<T, R>> {
    const result = { ...matrix };
    const startTime = Date.now();

    try {
      // 執行 Start 節點驗證
      if (validators?.has(result.start.id)) {
        const validator = validators.get(result.start.id)!;
        const isValid = await validator(result.start.data);
        if (!isValid) {
          result.start.state = MatrixNodeState.ERROR;
          result.start.metadata.error = new Error('Start node validation failed');
          return result;
        }
      }
      result.start.state = MatrixNodeState.COMPLETED;

      // 執行 Matrix 節點
      for (let i = 0; i < result.matrix.length; i++) {
        const node = result.matrix[i];
        const nodeStartTime = Date.now();

        // 檢查依賴
        const dependenciesMet = node.dependencies.every(depId => {
          if (depId === result.start.id) {
            return result.start.state === MatrixNodeState.COMPLETED;
          }
          const depNode = result.matrix.find(n => n.id === depId);
          return depNode?.state === MatrixNodeState.COMPLETED;
        });

        if (!dependenciesMet) {
          node.state = MatrixNodeState.SKIPPED;
          continue;
        }

        // 執行驗證
        if (validators?.has(node.id)) {
          const validator = validators.get(node.id)!;
          const isValid = await validator(node.data);
          if (!isValid) {
            node.state = MatrixNodeState.ERROR;
            node.metadata.error = new Error('Node validation failed');
            continue;
          }
        }

        // 執行轉換
        if (transforms.has(node.id)) {
          node.state = MatrixNodeState.ACTIVE;
          const transform = transforms.get(node.id)!;
          node.data = await transform(node.data);
        }

        node.state = MatrixNodeState.COMPLETED;
        node.metadata.duration = Date.now() - nodeStartTime;
      }

      // 執行 End 節點
      const endDependenciesMet = result.end.dependencies.every(depId => {
        if (depId === result.start.id) {
          return result.start.state === MatrixNodeState.COMPLETED;
        }
        const depNode = result.matrix.find(n => n.id === depId);
        return depNode?.state === MatrixNodeState.COMPLETED;
      });

      if (endDependenciesMet) {
        if (validators?.has(result.end.id)) {
          const validator = validators.get(result.end.id)!;
          const isValid = await validator(result.end.data);
          if (!isValid) {
            result.end.state = MatrixNodeState.ERROR;
            result.end.metadata.error = new Error('End node validation failed');
            return result;
          }
        }

        if (transforms.has(result.end.id)) {
          result.end.state = MatrixNodeState.ACTIVE;
          const transform = transforms.get(result.end.id)!;
          result.end.data = await transform(result.end.data);
        }

        result.end.state = MatrixNodeState.COMPLETED;
      } else {
        result.end.state = MatrixNodeState.SKIPPED;
      }

      result.metadata.updatedAt = Date.now();
      return result;

    } catch (error) {
      // 設置錯誤狀態
      result.end.state = MatrixNodeState.ERROR;
      result.end.metadata.error = error as Error;
      return result;
    }
  }

  /**
   * 獲取矩陣執行統計
   */
  static getStats(matrix: StartEndMatrix<any, any>) {
    const totalNodes = 1 + matrix.matrix.length + 1; // start + matrix + end
    const completedNodes = [
      matrix.start,
      ...matrix.matrix,
      matrix.end,
    ].filter(n => n.state === MatrixNodeState.COMPLETED).length;
    const errorNodes = [
      matrix.start,
      ...matrix.matrix,
      matrix.end,
    ].filter(n => n.state === MatrixNodeState.ERROR).length;
    const skippedNodes = [
      matrix.start,
      ...matrix.matrix,
      matrix.end,
    ].filter(n => n.state === MatrixNodeState.SKIPPED).length;

    const totalDuration = [
      matrix.start,
      ...matrix.matrix,
      matrix.end,
    ].reduce((sum, node) => sum + (node.metadata.duration || 0), 0);

    return {
      totalNodes,
      completedNodes,
      errorNodes,
      skippedNodes,
      totalDuration,
      successRate: totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0,
    };
  }
}

// ============================================================================
// 導出
// ============================================================================

export default {
  UUIDUtil,
  StartEndMatrixBuilder,
  StartEndMatrixExecutor,
  MatrixNodeType,
  MatrixNodeState,
};
