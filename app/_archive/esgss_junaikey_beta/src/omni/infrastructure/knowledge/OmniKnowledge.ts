import { ESGDataTag, OmniResponse } from '../types/Omni-entity.types.ts';
import { Insight, KnowledgeNode, KnowledgeGraph } from '../../../types/knowledge.ts';
import { OmniElement } from '../../core/types/OmniElement.ts';
import { omniLogger, LogCategory } from '../../../services/omniLogger.ts';
import { OmniNexus } from '../../../services/OmniNexus.ts';
import { OllamaService } from '../../../services/OllamaService.ts';
import { IComponentCore } from '../../../0-domain/contracts/IComponentCore.ts';
import { lockComponent } from '../../core/GoodwardCore.ts';
import { vectorService } from '../../../1-service/VectorEmbeddingService.ts';

// Omni Knowledge Base
// This service handles the logic of data retrieval and processing.

const API_BASE = 'http://localhost:3001/api';

class OmniKnowledgeService {
  private graph: KnowledgeGraph = {
    nodes: new Map(),
    edges: [],
  };

  // Vector Storage: nodeId -> embedding
  private embeddings: Map<string, number[]> = new Map();

  // Omni Knowledge Vault (Trinity Elements)
  private omniElements: Map<string, OmniElement> = new Map();

  /**
   * Store a Trinity Element (OmniElement) into the Knowledge Warehouse.
   */
  async storeElement(element: OmniElement): Promise<void> {
    this.omniElements.set(element.uid, element);

    // Also project it into the Knowledge Graph for visualization/search
    const node: KnowledgeNode = {
      id: element.uid,
      label: typeof element.label === 'string' ? element.label : 'OmniElement',
      type: 'element',
      properties: element.attrs,
      confidence: 1.0,
      sources: [element.predecessor ? `derived-from:${element.predecessor}` : 'origin'],
      lastUpdated: Date.now(),
      // Core locking would happen here
    };
    await this.updateKnowledgeNode(node);

    omniLogger.info(
      LogCategory.KNOWLEDGE,
      `[Trinity] Stored Element: ${element.label} (${element.uid})`
    );
  }

  /**
   * Retrieve a Trinity Element by UID.
   */
  async retrieveElement(uid: string): Promise<OmniElement | undefined> {
    return this.omniElements.get(uid);
  }

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
        // Goodward 5T Core Initialization
        core: lockComponent({
          uuid: nodeId,
          status: 'Trustworthy',
          evidence: {
            logicGate: {
              tangible: insight.impact
                ? `Impact: ${JSON.stringify(insight.impact)}`
                : 'Insight-Observation',
              traceable: `Source: ${insight.sourceId}`,
              trackable: `Insight-ID: ${insight.id}`,
              transparent: 'OmniKnowledge-Processing-v1',
              trustworthy: `Hash-Lock-${Date.now()}`,
            },
            timestamp: Date.now(),
            hash: 'pending-hash-calculation',
          },
        }),
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

    // Asynchronous generation of embedding vectors (non-blocking)
    this.generateEmbeddingForNode(node.id).catch(err => {
      omniLogger.warn(LogCategory.KNOWLEDGE, `Failed to generate embedding for node ${node.id}`, {
        err,
      });
    });

    // Invalidate Search Cache
    this.cachedCandidates = null;
  }

  /**
   * Generate embedding vector for a single node
   */
  private async generateEmbeddingForNode(nodeId: string): Promise<void> {
    const node = this.graph.nodes.get(nodeId);
    if (!node) return;

    // Combine node information to generate text
    const text = `${node.label}. ${JSON.stringify(node.properties)}`;
    // Use simulated vector service instead of mock Ollama
    const embedding = await vectorService.generateEmbedding(text);

    if (embedding) {
      this.embeddings.set(nodeId, embedding);
      omniLogger.debug(LogCategory.KNOWLEDGE, `Generated embedding for: ${node.label}`);
    }
  }

  private cachedCandidates: Array<any> | null = null;
  private lastCacheTime: number = 0;

  /**
   * Semantic search for knowledge nodes
   */
  async semanticSearchNodes(
    query: string,
    topK: number = 5
  ): Promise<Array<KnowledgeNode & { similarity: number }>> {
    // Check if cache rebuild is needed (only if nodes changed significantly or first run)
    // For now, we invalidate simple if explicit update logic is added, or check logic here.
    // Given the previous updateKnowledgeNode doesn't flag dirty, we'll do a simple check or use the cached if recent.
    // Actually, let's just use the cachedCandidates if valid, and updating nodes invalidates it.

    if (!this.cachedCandidates || this.graph.nodes.size !== this.cachedCandidates.length) {
      this.cachedCandidates = Array.from(this.graph.nodes.values()).map(node => ({
        id: node.id,
        text: `${node.label}. ${JSON.stringify(node.properties)}`,
        embedding: this.embeddings.get(node.id),
        data: node,
      }));
      this.lastCacheTime = Date.now();
    }

    const candidates = this.cachedCandidates;

    // 1. Generate Query Embedding locally
    const queryEmbedding = await vectorService.generateEmbedding(query);

    // 2. Perform Cosine Similarity Search
    const results = candidates
      .map(candidate => ({
        ...candidate,
        similarity: candidate.embedding
          ? vectorService.calculateSimilarity(queryEmbedding, candidate.embedding)
          : 0,
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return results.map(r => ({
      ...r.data,
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
      core: lockComponent({
        uuid: agent.id,
        status: 'Trustworthy',
        evidence: {
          logicGate: {
            tangible: `Agent-Type: ${agent.role}`,
            traceable: 'System-Boot-Registration',
            trackable: `Agent-ID: ${agent.id}`,
            transparent: 'System-Registration-Protocol',
            trustworthy: `Hash-Lock-${Date.now()}`,
          },
          timestamp: Date.now(),
          hash: 'system-verified-hash',
        },
      }),
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
