// OmniKnowledgeFlow Service - Natural Knowledge Circulation
// Implements Wu-Tong Zi-Tong (無通自通) for knowledge flow
// [Compliance] 4+1 Protocol (Traceable, Trackable, Calculable, Immutable)

import { omniLogger, LogCategory, LogLevel } from '../2-infra/logging/OmniLogger';

/**
 * 知識節點 (Knowledge Node)
 * Represents a piece of knowledge that can flow through the system
 */
export interface KnowledgeNode {
  id: string;
  content: unknown;
  type: 'insight' | 'pattern' | 'anomaly' | 'solution' | 'metric';
  sourceService: string;
  resonanceScore: number; // 0-1, how well it resonates with system
  connections: string[]; // IDs of naturally connected nodes
  lastAccessed: Date;
  createdAt: Date;
  accessCount: number;
  tags: string[];
}

/**
 * 知識流動事件 (Knowledge Flow Event)
 */
export interface KnowledgeFlowEvent {
  timestamp: Date;
  fromNode: string;
  toNode: string;
  flowType: 'natural' | 'facilitated' | 'emergent';
  resonanceStrength: number; // 0-1
}

/**
 * [WAVE] OmniKnowledgeFlow - 知識自然流動服務
 *
 * Implements knowledge circulation based on Wu-Tong principles:
 * - Knowledge flows naturally to where it's needed
 * - No forced knowledge transfer
 * - Connections emerge organically based on resonance
 * - Self-organizing knowledge graph
 */
export class OmniKnowledgeFlow {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private flowEvents: KnowledgeFlowEvent[] = [];
  private logger = omniLogger;
  private readonly MAX_CONNECTIONS = 10;
  private readonly RESONANCE_THRESHOLD = 0.7;

  constructor() {
    // Logger initialized via singleton
  }

  /**
   * 添加知識節點 (Add Knowledge Node)
   */
  addKnowledge(
    content: unknown,
    type: KnowledgeNode['type'],
    sourceService: string,
    tags: string[] = []
  ): string {
    const id = `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const node: KnowledgeNode = {
      id,
      content,
      type,
      sourceService,
      resonanceScore: 1.0,
      connections: [],
      lastAccessed: new Date(),
      createdAt: new Date(),
      accessCount: 0,
      tags,
    };

    this.nodes.set(id, node);

    // Allow natural connections to emerge
    this.facilitateNaturalConnections(id);

    this.logger.info('DATA', `Knowledge node created: ${type}`, {
      nodeId: id,
      sourceService,
      tags,
    });

    return id;
  }

  /**
   * 促進自然連結 (Facilitate Natural Connections)
   * Allows connections to emerge based on resonance, not forced
   */
  private facilitateNaturalConnections(nodeId: string): void {
    const newNode = this.nodes.get(nodeId);
    if (!newNode) return;

    // Find nodes with similar tags or from same service
    for (const [existingId, existingNode] of this.nodes.entries()) {
      if (existingId === nodeId) continue;
      if (existingNode.connections.length >= this.MAX_CONNECTIONS) continue;

      const resonance = this.calculateResonance(newNode, existingNode);

      if (resonance >= this.RESONANCE_THRESHOLD) {
        // Natural connection emerges
        newNode.connections.push(existingId);
        existingNode.connections.push(nodeId);

        this.flowEvents.push({
          timestamp: new Date(),
          fromNode: existingId,
          toNode: nodeId,
          flowType: 'emergent',
          resonanceStrength: resonance,
        });

        this.logger.debug('DATA', `Natural connection emerged between nodes`, {
          from: existingId,
          to: nodeId,
          resonance,
        });
      }
    }
  }

  /**
   * 計算共鳴 (Calculate Resonance)
   * Measures how well two knowledge nodes resonate with each other
   */
  private calculateResonance(node1: KnowledgeNode, node2: KnowledgeNode): number {
    let resonance = 0;

    // Same service = higher resonance
    if (node1.sourceService === node2.sourceService) {
      resonance += 0.3;
    }

    // Shared tags = higher resonance
    const sharedTags = node1.tags.filter(tag => node2.tags.includes(tag));
    resonance += (sharedTags.length / Math.max(node1.tags.length, node2.tags.length, 1)) * 0.4;

    // Similar type = higher resonance
    if (node1.type === node2.type) {
      resonance += 0.3;
    }

    return Math.min(1, resonance);
  }

  /**
   * 訪問知識 (Access Knowledge)
   * Returns knowledge and records the access for flow tracking
   */
  accessKnowledge(nodeId: string): KnowledgeNode | null {
    const node = this.nodes.get(nodeId);
    if (!node) return null;

    node.lastAccessed = new Date();
    node.accessCount++;

    return { ...node }; // Return copy
  }

  /**
   * 查詢相關知識 (Query Related Knowledge)
   * Find knowledge that naturally resonates with given criteria
   */
  queryRelatedKnowledge(
    criteria: {
      tags?: string[];
      type?: KnowledgeNode['type'];
      sourceService?: string;
    },
    limit: number = 10
  ): KnowledgeNode[] {
    const results: Array<{ node: KnowledgeNode; score: number }> = [];

    for (const node of this.nodes.values()) {
      let score = 0;

      if (criteria.tags) {
        const matchingTags = node.tags.filter(tag => criteria.tags!.includes(tag));
        score += (matchingTags.length / criteria.tags.length) * 0.5;
      }

      if (criteria.type && node.type === criteria.type) {
        score += 0.3;
      }

      if (criteria.sourceService && node.sourceService === criteria.sourceService) {
        score += 0.2;
      }

      if (score > 0) {
        results.push({ node, score });
      }
    }

    // Sort by score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => ({ ...r.node }));
  }

  /**
   * 獲取知識流動分析 (Get Knowledge Flow Analytics)
   */
  getFlowAnalytics() {
    const totalNodes = this.nodes.size;
    const totalConnections =
      Array.from(this.nodes.values()).reduce((sum, node) => sum + node.connections.length, 0) / 2; // Divide by 2 because connections are bidirectional

    const avgConnectionsPerNode = totalNodes > 0 ? totalConnections / totalNodes : 0;

    const flowVelocity =
      this.flowEvents.length > 0
        ? this.flowEvents.filter(e => {
          const age = Date.now() - e.timestamp.getTime();
          return age < 60000; // Last minute
        }).length
        : 0;

    return {
      totalNodes,
      totalConnections,
      avgConnectionsPerNode,
      flowVelocity, // Connections per minute
      emergentFlows: this.flowEvents.filter(e => e.flowType === 'emergent').length,
      naturalFlows: this.flowEvents.filter(e => e.flowType === 'natural').length,
    };
  }

  /**
   * 清理舊知識 (Cleanup Old Knowledge)
   * Remove stale knowledge that hasn't been accessed
   */
  cleanupStaleKnowledge(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let removed = 0;

    for (const [id, node] of this.nodes.entries()) {
      const age = now - node.lastAccessed.getTime();
      if (age > maxAgeMs && node.accessCount < 5) {
        this.nodes.delete(id);
        removed++;
      }
    }

    if (removed > 0) {
      this.logger.info('DATA', `Cleaned up ${removed} stale knowledge nodes`);
    }

    return removed;
  }
}

// Singleton instance
export const omniKnowledgeFlow = new OmniKnowledgeFlow();
