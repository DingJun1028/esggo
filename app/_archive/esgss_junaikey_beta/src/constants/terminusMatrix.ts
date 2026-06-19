import { TerminusMatrix, MatrixNodeType, EnergyType, MatrixConnectionType } from '../types/terminusMatrix';

export const INITIAL_TERMINUS_MATRIX: TerminusMatrix = {
    nodes: [
        // Energy Nodes
        {
            id: 'energy-compute-1',
            type: MatrixNodeType.ENERGY,
            energyType: EnergyType.COMPUTE,
            label: '計算核心能量串流',
            energyValue: 850,
            trustLevel: 0.99,
            state: { active: true },
            lastUpdated: new Date().toISOString()
        },
        {
            id: 'energy-value-points',
            type: MatrixNodeType.ENERGY,
            energyType: EnergyType.VALUE,
            label: '優化信用點儲備 (OCP)',
            energyValue: 15420,
            trustLevel: 1.0,
            state: { currency: 'OCP' },
            lastUpdated: new Date().toISOString()
        },
        {
            id: 'energy-entropy-1',
            type: MatrixNodeType.ENERGY,
            energyType: EnergyType.ENTROPY,
            label: '遺留技術債 (熵能量)',
            energyValue: 120,
            trustLevel: 0.2,
            state: { toxicity: 'medium' },
            lastUpdated: new Date().toISOString()
        },
        // Agent Nodes
        {
            id: 'agent-aegis',
            type: MatrixNodeType.AGENT,
            label: '秩序守衛者 (Aegis)',
            description: '矩陣安全防禦與風險巡檢代理',
            trustLevel: 0.98,
            state: { status: 'patrolling' },
            lastUpdated: new Date().toISOString()
        },
        {
            id: 'agent-alchemist',
            type: MatrixNodeType.AGENT,
            label: '熵減煉金師 (Alchemist)',
            description: '將技術債轉化為知識能量的演化代理',
            trustLevel: 0.95,
            state: { status: 'refining' },
            lastUpdated: new Date().toISOString()
        },
        // Data & Knowledge
        {
            id: 'data-nexus',
            type: MatrixNodeType.DATA,
            label: '萬能數據樞紐',
            trustLevel: 0.9,
            state: { vol: '4.2TB' },
            lastUpdated: new Date().toISOString()
        },
        {
            id: 'knowledge-epic',
            type: MatrixNodeType.KNOWLEDGE,
            label: '創世章節聖典',
            trustLevel: 1.0,
            state: { version: 'Final' },
            lastUpdated: new Date().toISOString()
        }
    ],
    connections: [
        {
            id: 'conn-1',
            sourceId: 'energy-compute-1',
            targetId: 'agent-alchemist',
            type: MatrixConnectionType.CONTROL_FLOW,
            strength: 0.8,
            flowRate: 50
        },
        {
            id: 'conn-2',
            sourceId: 'energy-entropy-1',
            targetId: 'agent-alchemist',
            type: MatrixConnectionType.DATA_FLOW,
            strength: 0.9,
            flowRate: 15
        },
        {
            id: 'conn-3',
            sourceId: 'agent-alchemist',
            targetId: 'energy-value-points',
            type: MatrixConnectionType.DATA_FLOW,
            strength: 0.7,
            label: '煉金價值產出'
        },
        {
            id: 'conn-4',
            sourceId: 'agent-aegis',
            targetId: 'energy-entropy-1',
            type: MatrixConnectionType.INFLUENCE,
            strength: 0.6,
            label: '風險鎖定'
        }
    ],
    totalEnergy: {
        [EnergyType.COMPUTE]: 5000,
        [EnergyType.DATA]: 8000,
        [EnergyType.KNOWLEDGE]: 12000,
        [EnergyType.VALUE]: 15420,
        [EnergyType.ENTROPY]: 120,
        [EnergyType.METAPHYSICAL]: 100
    },
    entropyLevel: 0.042,
    version: 'Terminus-V1'
};

export const MATRIX_NODE_CONFIG = {
    [MatrixNodeType.ENERGY]: { color: '#fbbf24', icon: 'Zap' },
    [MatrixNodeType.AGENT]: { color: '#6366f1', icon: 'Cpu' },
    [MatrixNodeType.DATA]: { color: '#3b82f6', icon: 'Database' },
    [MatrixNodeType.KNOWLEDGE]: { color: '#10b981', icon: 'Book' },
    [MatrixNodeType.USER]: { color: '#f43f5e', icon: 'User' },
    [MatrixNodeType.EVENT]: { color: '#8b5cf6', icon: 'Activity' },
    [MatrixNodeType.RISK]: { color: '#ef4444', icon: 'ShieldAlert' },
    [MatrixNodeType.INTENT]: { color: '#f97316', icon: 'Target' }
};
