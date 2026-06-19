/**
 * Jun.AI.Key - 永久記憶庫 (Memory Palace)
 * 記憶宮殿：知識的聖殿中，經驗不斷累積，驅動代理世代傳承，光速前行
 */

import { v4 as uuidv4 } from 'uuid';

export interface MemoryNode {
  id: string;
  type: 'experience' | 'knowledge' | 'skill' | 'decision' | 'outcome';
  content: string;
  context: string;
  tags: string[];
  vectors: number[]; // 向量嵌入
  timestamp: number;
  userId: string;
  connections: string[]; // 關聯節點ID
  confidence: number;
  accessCount: number;
  lastAccessed: number;
}

export interface MemoryQuery {
  userId: string;
  query: string;
  context?: string;
  type?: MemoryNode['type'];
  tags?: string[];
  limit?: number;
  minConfidence?: number;
}

export interface MemoryResult {
  node: MemoryNode;
  relevance: number;
  path: string[]; // 記憶路徑
}

/**
 * 記憶宮殿核心類
 * 負責知識的結構化存儲、檢索與關聯
 */
export class MemoryPalace {
  private memories: Map<string, MemoryNode> = new Map();
  private vectorIndex: Map<string, MemoryNode[]> = new Map();

  /**
   * 存儲記憶節點
   */
  async store(node: Omit<MemoryNode, 'id' | 'timestamp' | 'accessCount' | 'lastAccessed'>): Promise<string> {
    const memoryNode: MemoryNode = {
      ...node,
      id: uuidv4(),
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    this.memories.set(memoryNode.id, memoryNode);

    // 建立向量索引
    this.updateVectorIndex(memoryNode);

    // 建立關聯
    await this.buildConnections(memoryNode);

    return memoryNode.id;
  }

  /**
   * 檢索記憶
   */
  async retrieve(query: MemoryQuery): Promise<MemoryResult[]> {
    const candidates = this.findCandidates(query);
    const results = await this.rankAndFilter(candidates, query);

    // 更新訪問統計
    results.forEach(result => {
      const node = this.memories.get(result.node.id);
      if (node) {
        node.accessCount++;
        node.lastAccessed = Date.now();
      }
    });

    return results;
  }

  /**
   * 強化記憶連接
   */
  async reinforce(nodeId: string, relatedNodes: string[]): Promise<void> {
    const node = this.memories.get(nodeId);
    if (!node) return;

    // 增加連接強度
    relatedNodes.forEach(relatedId => {
      if (!node.connections.includes(relatedId)) {
        node.connections.push(relatedId);
      }
    });

    // 更新向量索引
    this.updateVectorIndex(node);
  }

  /**
   * 記憶遺忘 (清理低價值記憶)
   */
  async forget(criteria: {
    olderThan?: number;
    accessCountLessThan?: number;
    confidenceLessThan?: number;
  }): Promise<string[]> {
    const toForget: string[] = [];

    for (const [id, node] of this.memories) {
      let shouldForget = false;

      if (criteria.olderThan && node.timestamp < criteria.olderThan) {
        shouldForget = true;
      }

      if (criteria.accessCountLessThan && node.accessCount < criteria.accessCountLessThan) {
        shouldForget = true;
      }

      if (criteria.confidenceLessThan && node.confidence < criteria.confidenceLessThan) {
        shouldForget = true;
      }

      if (shouldForget) {
        toForget.push(id);
      }
    }

    // 執行遺忘
    toForget.forEach(id => {
      this.memories.delete(id);
    });

    return toForget;
  }

  /**
   * 獲取記憶統計
   */
  getStats(userId?: string): {
    total: number;
    byType: Record<string, number>;
    avgConfidence: number;
    avgAccessCount: number;
  } {
    let nodes = Array.from(this.memories.values());
    if (userId) {
      nodes = nodes.filter(node => node.userId === userId);
    }

    const byType = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgConfidence = nodes.reduce((sum, node) => sum + node.confidence, 0) / nodes.length;
    const avgAccessCount = nodes.reduce((sum, node) => sum + node.accessCount, 0) / nodes.length;

    return {
      total: nodes.length,
      byType,
      avgConfidence: avgConfidence || 0,
      avgAccessCount: avgAccessCount || 0,
    };
  }

  private findCandidates(query: MemoryQuery): MemoryNode[] {
    let candidates = Array.from(this.memories.values());

    // 過濾用戶
    candidates = candidates.filter(node => node.userId === query.userId);

    // 過濾類型
    if (query.type) {
      candidates = candidates.filter(node => node.type === query.type);
    }

    // 過濾標籤
    if (query.tags && query.tags.length > 0) {
      candidates = candidates.filter(node =>
        query.tags!.some(tag => node.tags.includes(tag))
      );
    }

    // 過濾信心度
    if (query.minConfidence) {
      candidates = candidates.filter(node => node.confidence >= query.minConfidence);
    }

    return candidates;
  }

  private async rankAndFilter(candidates: MemoryNode[], query: MemoryQuery): Promise<MemoryResult[]> {
    // 簡化的相關性計算 (實際應使用向量相似度)
    const results: MemoryResult[] = candidates.map(node => ({
      node,
      relevance: this.calculateRelevance(node, query),
      path: [node.id], // 簡化路徑
    }));

    // 排序並限制數量
    results.sort((a, b) => b.relevance - a.relevance);

    const limit = query.limit || 10;
    return results.slice(0, limit);
  }

  private calculateRelevance(node: MemoryNode, query: MemoryQuery): number {
    let relevance = 0;

    // 內容匹配
    if (node.content.toLowerCase().includes(query.query.toLowerCase())) {
      relevance += 0.4;
    }

    // 上下文匹配
    if (query.context && node.context.toLowerCase().includes(query.context.toLowerCase())) {
      relevance += 0.3;
    }

    // 標籤匹配
    if (query.tags) {
      const tagMatches = query.tags.filter(tag => node.tags.includes(tag)).length;
      relevance += (tagMatches / query.tags.length) * 0.2;
    }

    // 近期訪問加權
    const daysSinceAccess = (Date.now() - node.lastAccessed) / (1000 * 60 * 60 * 24);
    const recencyBonus = Math.max(0, 1 - daysSinceAccess / 30) * 0.1;
    relevance += recencyBonus;

    return Math.min(relevance, 1);
  }

  private updateVectorIndex(node: MemoryNode): void {
    // 簡化的向量索引更新
    const key = node.userId;
    if (!this.vectorIndex.has(key)) {
      this.vectorIndex.set(key, []);
    }

    const userNodes = this.vectorIndex.get(key)!;
    const existingIndex = userNodes.findIndex(n => n.id === node.id);

    if (existingIndex >= 0) {
      userNodes[existingIndex] = node;
    } else {
      userNodes.push(node);
    }
  }

  private async buildConnections(node: MemoryNode): Promise<void> {
    // 查找相關節點並建立連接
    const relatedNodes = Array.from(this.memories.values())
      .filter(n => n.id !== node.id && n.userId === node.userId)
      .filter(n => this.areRelated(n, node))
      .slice(0, 5); // 限制連接數量

    node.connections = relatedNodes.map(n => n.id);
  }

  private areRelated(node1: MemoryNode, node2: MemoryNode): boolean {
    // 檢查標籤重疊
    const tagOverlap = node1.tags.filter(tag => node2.tags.includes(tag)).length;
    if (tagOverlap > 0) return true;

    // 檢查內容相似性
    const words1 = node1.content.toLowerCase().split(/\s+/);
    const words2 = node2.content.toLowerCase().split(/\s+/);
    const wordOverlap = words1.filter(word => words2.includes(word)).length;

    return wordOverlap > 2; // 至少3個共同詞
  }
}