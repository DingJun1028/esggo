/**
 * MeshProtocol.ts
 * 
 * Part of the "Planetary Mesh" initiative (v9.0 Preview).
 * Defines the ESG Data Exchange Standard (EDES) for specific cross-organization communication.
 * 
 * @layer Network
 * @status Draft
 */

export interface MeshNode {
    nodeId: string;
    publicKey: string; // Quantum-resistant public key
    organizationId: string;
    endpoint: string;
    reputation: number; // 0.0 - 1.0 Trust Score (5T Protocol)
}

export enum MeshMessageType {
    HANDSHAKE = 'MESH_HANDSHAKE',
    DATA_OFFER = 'MESH_DATA_OFFER',
    DATA_REQUEST = 'MESH_DATA_REQUEST',
    DATA_RESPONSE = 'MESH_DATA_RESPONSE',
    VERIFICATION_CHALLENGE = 'MESH_VERIFICATION_CHALLENGE',
    CONSENSUS_VOTE = 'MESH_CONSENSUS_VOTE'
}

export interface EDESPayload {
    specification: 'EDES-v1.0';
    category: 'GRI' | 'SASB' | 'TCFD' | 'CUSTOM';
    indicators: Record<string, number | string | boolean>;
    evidenceHashes: string[];
    timestamp: number;
}

export interface MeshHandshakePayload {
    nodeId: string;
    publicKey: string;
    endpoint: string;
    supportedStandards: string[];
    timestamp: number;
}

export interface MeshMessage<T = any> {
    id: string;
    type: MeshMessageType;
    senderNodeId: string;
    targetNodeId?: string; // Broadcast if undefined
    payload: T;
    signature: string; // PQC Signature
    timestamp: number;
}

/**
 * Interface for a Planetary Mesh Connector.
 */
export interface IMeshConnector {
    connect(node: MeshNode): Promise<boolean>;
    disconnect(nodeId: string): Promise<void>;
    broadcast(message: MeshMessage): Promise<string[]>; // Returns list of received node IDs
    sendDirect(nodeId: string, message: MeshMessage): Promise<boolean>;

    // Event Handlers
    onMessage(callback: (msg: MeshMessage) => void): void;
}
