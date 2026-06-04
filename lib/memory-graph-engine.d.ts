/**
 * ESG GO | Memory Graph Engine (Causal Analytics)
 * Connects discrete 5T integrity points into a semantic knowledge web.
 */
import { IComponentCore } from '../src/shared/types';
import { RegulatoryPolicy } from './policy-engine';
import { ResonanceResult } from './governance-engine';
export type NodeType = 'EVIDENCE' | 'POLICY' | 'MEMORY' | 'STAKEHOLDER_EXPECTATION' | 'SIMULATION';
export interface GraphNode {
    id: string;
    type: NodeType;
    label: string;
    value?: unknown;
    status?: string;
    hash_lock?: string;
}
export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label: string;
    strength: number;
}
export interface MemoryGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}
export declare class MemoryGraphEngine {
    private static instance;
    static getInstance(): MemoryGraphEngine;
    /**
     * Automatically builds a lineage graph for a specific ESG metric.
     */
    buildLineageGraph(component: IComponentCore, policy?: RegulatoryPolicy, resonance?: ResonanceResult): Promise<MemoryGraph>;
}
export declare const memoryGraphEngine: MemoryGraphEngine;
//# sourceMappingURL=memory-graph-engine.d.ts.map