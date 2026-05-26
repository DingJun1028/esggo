/**
 * ESG GO | Memory Graph Engine (Causal Analytics)
 * Connects discrete 5T integrity points into a semantic knowledge web.
 */

import { IComponentCore } from '../types/omni-core';
import { DocFragment } from './agent/rag-engine';
import { RegulatoryPolicy } from './policy-engine';
import { ResonanceResult } from './governance-engine';

export type NodeType = 'EVIDENCE' | 'POLICY' | 'MEMORY' | 'STAKEHOLDER_EXPECTATION' | 'SIMULATION';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  value?: any;
  status?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string; // e.g., 'requires', 'verified_by', 'impacts'
  strength: number; // 0-1
}

export interface MemoryGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export class MemoryGraphEngine {
  private static instance: MemoryGraphEngine;

  static getInstance(): MemoryGraphEngine {
    if (!MemoryGraphEngine.instance) {
      MemoryGraphEngine.instance = new MemoryGraphEngine();
    }
    return MemoryGraphEngine.instance;
  }

  /**
   * Automatically builds a lineage graph for a specific ESG metric.
   */
  async buildLineageGraph(
    component: IComponentCore, 
    policy?: RegulatoryPolicy,
    resonance?: ResonanceResult
  ): Promise<MemoryGraph> {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // 1. Evidence Node (The Core)
    const evidenceId = component.uuid;
    nodes.push({
      id: evidenceId,
      type: 'EVIDENCE',
      label: component.evidence[0]?.tangible_metric || 'Unknown',
      status: component.status
    });

    // 2. Policy Node
    if (policy) {
      const policyNodeId = `policy-${policy.id}`;
      nodes.push({
        id: policyNodeId,
        type: 'POLICY',
        label: policy.name,
        status: 'ACTIVE'
      });
      edges.push({
        id: `e-${evidenceId}-${policyNodeId}`,
        source: evidenceId,
        target: policyNodeId,
        label: 'verified_against',
        strength: 0.9
      });
    }

    // 3. Stakeholder Resonance Node
    if (resonance) {
      const resNodeId = `res-${resonance.topicId}`;
      nodes.push({
        id: resNodeId,
        type: 'STAKEHOLDER_EXPECTATION',
        label: `利害關係人期望: ${resonance.label}`,
        value: resonance.stakeholderPriority
      });
      edges.push({
        id: `e-${evidenceId}-${resNodeId}`,
        source: evidenceId,
        target: resNodeId,
        label: 'aligns_with',
        strength: resonance.resonance / 100
      });
    }

    // 4. Memory Node (Consolidated Wisdom)
    const memoryNodeId = `mem-${component.uuid}`;
    nodes.push({
      id: memoryNodeId,
      type: 'MEMORY',
      label: '永恆記憶存檔',
      status: 'CONSOLIDATED'
    });
    edges.push({
      id: `e-${evidenceId}-${memoryNodeId}`,
      source: evidenceId,
      target: memoryNodeId,
      label: 'archived_to',
      strength: 1.0
    });

    return { nodes, edges };
  }
}

export const memoryGraphEngine = MemoryGraphEngine.getInstance();
