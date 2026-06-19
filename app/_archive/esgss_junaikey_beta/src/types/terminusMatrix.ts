/**
 * Terminus Matrix: The core operational fabric of the JunAiKey Metaphysical Engine.
 * Follows the Axiom of Unified Terminus & Origin.
 */

export enum MatrixNodeType {
    AGENT = 'agent',
    DATA = 'data',
    KNOWLEDGE = 'knowledge',
    USER = 'user',
    EVENT = 'event',
    RISK = 'risk',
    INTENT = 'intent',
    ENERGY = 'energy',
    EXTERNAL_SERVICE = 'external_service',
    CONCEPT = 'concept',
    RULE = 'rule',
    STATE = 'state',
    TIME = 'time',
    SPACE = 'space',
    CONSCIOUSNESS = 'consciousness',
    CREATIVITY = 'creativity',
    ETHICS = 'ethics',
    TRUST = 'trust',
    COLLABORATION = 'collaboration'
}

export enum EnergyType {
    COMPUTE = 'compute',
    DATA = 'data',
    KNOWLEDGE = 'knowledge',
    VALUE = 'value', // Optimization Credit Points
    ENTROPY = 'entropy',
    METAPHYSICAL = 'metaphysical'
}

export enum MatrixConnectionType {
    DATA_FLOW = 'data_flow',
    CONTROL_FLOW = 'control_flow',
    RELATIONSHIP = 'relationship',
    INFLUENCE = 'influence'
}

export interface MatrixNode {
    id: string;
    type: MatrixNodeType;
    label: string;
    description?: string;
    state: Record<string, any>;
    energyValue?: number;
    energyType?: EnergyType;
    trustLevel: number; // 0 to 1
    position?: { x: number; y: number; z: number }; // For 3D/2D visualization
    metadata?: Record<string, any>;
    lastUpdated: string;
}

export interface MatrixConnection {
    id: string;
    sourceId: string;
    targetId: string;
    type: MatrixConnectionType;
    strength: number; // For "Omni-Gravity" effects
    flowRate?: number; // For Data/Energy flow
    label?: string;
    metadata?: Record<string, any>;
}

export interface TerminusMatrix {
    nodes: MatrixNode[];
    connections: MatrixConnection[];
    totalEnergy: Record<EnergyType, number>;
    entropyLevel: number;
    version: string;
}
