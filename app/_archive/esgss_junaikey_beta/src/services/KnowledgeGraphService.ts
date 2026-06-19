import {
  omniLogger,
  LogCategory,
} from '../../server/services/omni/infrastructure/logging/OmniLogger.js';

export type NodeType = 'COURSE' | 'MARKET_PULSE' | 'METRIC' | 'CONCEPT';
export type EdgeType = 'TEACHES' | 'RELATED_TO' | 'IMPACTS' | 'REQUIRES';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  data?: any;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
}

export class KnowledgeGraphService {
  private static instance: KnowledgeGraphService;
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  private constructor() {
    omniLogger.info(LogCategory.SYSTEM, '🧠 [OmniBrain] Knowledge Graph Initialized.');
    this.seedInitialKnowledge();
  }

  public static getInstance(): KnowledgeGraphService {
    if (!this.instance) {
      this.instance = new KnowledgeGraphService();
    }
    return this.instance;
  }

  private seedInitialKnowledge() {
    // Seed Concepts
    this.addNode({ id: 'con-carbon', type: 'CONCEPT', label: 'Carbon Emissions' });
    this.addNode({ id: 'con-reg', type: 'CONCEPT', label: 'Regulatory Compliance' });

    // Seed Courses
    this.addNode({ id: 'c1', type: 'COURSE', label: 'ESG Fundamentals', data: { xp: 500 } });
    this.addNode({
      id: 'c2',
      type: 'COURSE',
      label: 'Carbon Accounting Masterclass',
      data: { xp: 1200 },
    });

    // Seed Relations
    this.addEdge('c1', 'con-reg', 'TEACHES');
    this.addEdge('c2', 'con-carbon', 'TEACHES');
    this.addEdge('con-carbon', 'con-reg', 'RELATED_TO');
  }

  public addNode(node: GraphNode) {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
    }
  }

  public addEdge(source: string, target: string, type: EdgeType, weight: number = 1) {
    this.edges.push({ source, target, type, weight });
  }

  public findRelated(nodeId: string): { node: GraphNode; edge: GraphEdge }[] {
    return this.edges
      .filter(e => e.source === nodeId || e.target === nodeId)
      .map(e => {
        const relatedId = e.source === nodeId ? e.target : e.source;
        return {
          node: this.nodes.get(relatedId)!,
          edge: e,
        };
      })
      .filter(r => r.node !== undefined);
  }

  public getGraphSnapshot() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }

  // Connect a live market pulse to the graph dynamically
  public ingestPulse(pulseId: string, topic: string) {
    // Simple keyword matching for demo
    const node: GraphNode = { id: pulseId, type: 'MARKET_PULSE', label: topic };
    this.addNode(node);

    if (topic.toLowerCase().includes('carbon')) {
      this.addEdge(pulseId, 'con-carbon', 'IMPACTS', 0.8);
    }
    if (topic.toLowerCase().includes('compliance') || topic.toLowerCase().includes('tax')) {
      this.addEdge(pulseId, 'con-reg', 'IMPACTS', 0.9);
    }
  }
}

export const knowledgeGraphService = KnowledgeGraphService.getInstance();
