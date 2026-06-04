import React from 'react';
export type TopologyPhase = 'cause' | 'process' | 'heal' | 'effect';
export type NodeStatus = 'idle' | 'processing' | 'success' | 'failed' | 'healing';
export interface CausalNode {
    id: string;
    phase: TopologyPhase;
    title: string;
    subtitle: string;
    status: NodeStatus;
}
interface CausalTopologyGraphProps {
    taskId?: string;
    executionId?: string;
    agentStatus?: NodeStatus;
    zkpStatus?: NodeStatus;
    vaultStatus?: NodeStatus;
    healingStatus?: NodeStatus;
}
/**
 * 🎨 轉寫章節三：因果律拓樸圖 (Causal Topology Graph)
 * 液態現實 UI (Liquid Reality UI) 的核心組件。
 * 將 Agent 協作、ZKP 校驗與 5T 封印可視化為「因、循、果」的物理流動。
 */
export declare const CausalTopologyGraph: React.FC<CausalTopologyGraphProps>;
export default CausalTopologyGraph;
//# sourceMappingURL=CausalTopologyGraph.d.ts.map