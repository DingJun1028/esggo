import { IComponentCore } from '../0-domain/contracts/IComponentCore.js';
export interface KnowledgeNode {
  id: string;
  core?: IComponentCore; // 5T Logic Gate Core
  label: string;
  type: 'concept' | 'entity' | 'rule' | 'event' | 'element';
  properties: Record<string, any>;
  confidence: number; // 0.0 - 1.0
  sources: string[];
  lastUpdated: number;
}

export interface Insight {
  id: string;
  sourceId: string; // Agent ID or Legion ID
  type: 'observation' | 'analysis' | 'prediction' | 'feedback' | 'security_analysis';
  content: string;
  confidence: number;
  relatedEntities: string[]; // IDs of related KnowledgeNodes
  timestamp: number;
  impact?: {
    metric: string;
    value: number;
  };
}

export interface KnowledgeGraph {
  nodes: Map<string, KnowledgeNode>;
  edges: Array<{ from: string; to: string; type: string; weight: number }>;
}
