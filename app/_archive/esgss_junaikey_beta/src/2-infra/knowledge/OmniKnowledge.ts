import { ESGDataTag, OmniResponse } from '../../0-domain/contracts/Omni-entity.types';
import { Insight, KnowledgeNode, KnowledgeGraph } from '../../types/knowledge';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { OmniNexus } from '../../1-service/OmniNexus';
import { OllamaService } from '../../1-service/OllamaService';

// 奧秘智庫 (Omni Knowledge Base)
// This service handles the logic of data retrieval and processing.

const API_BASE = 'http://localhost:3001/api';

class OmniKnowledgeService {
  private graph: KnowledgeGraph = {
    nodes: new Map(),
    edges: [],
  };

  // 向量存儲：nodeId -> embedding
  private embeddings: Map<string, number[]> = new Map();

  /**
   * Store and process a new insight from the system
   */
  async submitInsight(insight: Insight): Promise<void> {
    omniLogger.info(
      LogCategory.KNOWLEDGE,
      `🧠 Processing Insight from ${insight.sourceId}: ${insight.type}`,
      { insight }
    );

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Basic logic: If insight is high confidence, create a knowledge node
    if (insight.confidence > 0.8) {
      const nodeId = `node-${Date.now()}`;
      const node: KnowledgeNode = {
        id: nodeId,
        label: insight.content.substring(0, 50),
        type: 'event', // Simplified
        properties: { fullContent: insight.content, ...insight.impact },
        confidence: insight.confidence,
        sources: [insight.sourceId],
        lastUpdated: Date.now(),
      };
      this.updateKnowledgeNode(node);

      // Notify Nexus
      OmniNexus.emit({
        id: `evt-${Date.now()}`,
        source: 'knowledge',
        priority: 'normal',
        message: `New Knowledge Acquired: "${node.label}" (Conf: ${(node.confidence * 100).toFixed(0)}%)`,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Update or Create a Knowledge Node
   */
  async updateKnowledgeNode(node: KnowledgeNode): Promise<void> {
    if (this.graph.nodes.has(node.id)) {
      // Merge logic could go here
      const existing = this.graph.nodes.get(node.id)!;
      existing.confidence = (existing.confidence + node.confidence) / 2;
      existing.sources = [...new Set([...existing.sources, ...node.sources])];
      existing.lastUpdated = Date.now();
      this.graph.nodes.set(node.id, existing);
      omniLogger.debug(LogCategory.KNOWLEDGE, `Updated Knowledge Node: ${node.label}`);
    } else {
      this.graph.nodes.set(node.id, node);
      omniLogger.debug(LogCategory.KNOWLEDGE, `Created Knowledge Node: ${node.label}`);
    }

    // 異步生成嵌入向量（不阻塞）
    this.generateEmbeddingForNode(node.id).catch(err => {
      omniLogger.warn(LogCategory.KNOWLEDGE, `Failed to generate embedding for node ${node.id}`, {
        err,
      });
    });
  }

  /**
   * 為單個節點生成嵌入向量
   */
  private async generateEmbeddingForNode(nodeId: string): Promise<void> {
    const node = this.graph.nodes.get(nodeId);
    if (!node) return;

    // 組合節點信息生成文本
    const text = `${node.label}. ${JSON.stringify(node.properties)}`;
    const embedding = await OllamaService.generateEmbedding(text);

    if (embedding) {
      this.embeddings.set(nodeId, embedding);
      omniLogger.debug(LogCategory.KNOWLEDGE, `Generated embedding for: ${node.label}`);
    }
  }

  /**
   * 語義搜索知識節點
   */
  async semanticSearchNodes(
    query: string,
    topK: number = 5
  ): Promise<Array<KnowledgeNode & { similarity: number }>> {
    const candidates = Array.from(this.graph.nodes.values()).map(node => ({
      id: node.id,
      text: `${node.label}. ${JSON.stringify(node.properties)}`,
      embedding: this.embeddings.get(node.id),
      data: node,
    }));

    const results = await OllamaService.semanticSearch(query, candidates, topK, 0.3);

    return results.map(r => ({
      ...r.properties,
      similarity: r.similarity,
    }));
  }

  async fetchESGData(companyId: string): Promise<OmniResponse<ESGDataTag>> {
    try {
      const response = await fetch(`${API_BASE}/esg/${companyId}`);
      if (!response.ok) {
        // Return Mock Data if API fails (for development)
        return {
          success: true,
          data: {
            environmental: {
              carbonFootprint: 1200,
              renewableEnergyUsage: 30,
              wasteManagement: 'Good',
            },
            social: {
              employeeSatisfaction: 85,
              diversityInclusion: 'High',
              communityEngagement: 'Active',
            },
            governance: {
              boardStructure: 'Balanced',
              ethicalStandards: 'compliant',
              transparencyLevel: 'High',
            },
          } as any,
          message: 'Mock Data Returned (API Unavailable)',
        };
      }
      return await response.json();
    } catch (error: unknown) {
      // Return Mock Data on error
      return {
        success: true,
        data: {
          environmental: {
            carbonFootprint: 1200,
            renewableEnergyUsage: 30,
            wasteManagement: 'Good',
          },
          social: {
            employeeSatisfaction: 85,
            diversityInclusion: 'High',
            communityEngagement: 'Active',
          },
          governance: {
            boardStructure: 'Balanced',
            ethicalStandards: 'compliant',
            transparencyLevel: 'High',
          },
        } as any,
        message: 'Mock Data Returned (Network Error)',
      };
    }
  }

  async analyzeSynergy(data: ESGDataTag): Promise<string> {
    // Client-side lightweight analysis logic
    const score = data.environmental.carbonFootprint > 1000 ? 'High Carbon' : 'Eco Friendly';
    return `Local Synergy Analysis: ${score}`;
  }

  async updateESGData(
    companyId: string,
    newData: Partial<ESGDataTag>
  ): Promise<OmniResponse<ESGDataTag>> {
    try {
      const response = await fetch(`${API_BASE}/esg/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        throw new Error(`Knowledge update failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        data: {} as ESGDataTag,
        message: errorMessage,
      };
    }
  }

  /**
   * Register Awakened Agent to Omni Knowledge Vault
   */
  async registerAwakenedAgent(agent: { name: string; id: string; role: string }): Promise<void> {
    omniLogger.info(
      LogCategory.KNOWLEDGE,
      `📚 Registering Awakened Agent: ${agent.name} (${agent.role})`
    );

    const node: KnowledgeNode = {
      id: agent.id,
      label: agent.name,
      type: 'entity',
      properties: { role: agent.role },
      confidence: 1.0,
      sources: ['system'],
      lastUpdated: Date.now(),
    };
    this.updateKnowledgeNode(node);
  }

  /**
   * Get the entire Knowledge Graph snapshot
   */
  getKnowledgeGraph(): KnowledgeGraph {
    // Bootstrap if empty (for visualization demo)
    if (this.graph.nodes.size === 0) {
      this.bootstrapDemoData();
    }
    return this.graph;
  }

  private bootstrapDemoData() {
    const concepts = [
      'Sustainability',
      'Governance',
      'Ethics',
      'Carbon',
      'Community',
      'Innovation',
      'Resilience',
    ];
    const entities = ['Agent Alpha', 'Legion One', 'Core System', 'Global Market', 'Competitor X'];

    concepts.forEach((label, i) => {
      const id = `c-${i}`;
      this.graph.nodes.set(id, {
        id,
        label,
        type: 'concept',
        properties: {},
        confidence: 0.8 + Math.random() * 0.2,
        sources: ['system-boot'],
        lastUpdated: Date.now(),
      });
    });

    entities.forEach((label, i) => {
      const id = `e-${i}`;
      this.graph.nodes.set(id, {
        id,
        label,
        type: 'entity',
        properties: {},
        confidence: 0.7 + Math.random() * 0.2,
        sources: ['system-boot'],
        lastUpdated: Date.now(),
      });
    });
  }
}

export const OmniKnowledge = new OmniKnowledgeService();
