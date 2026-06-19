import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { MeshNode, MeshMessage, MeshMessageType, MeshHandshakePayload, IMeshConnector } from './MeshProtocol';
import { QuantumEncryption } from '@/core/security/QuantumEncryption';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from '@/utils/EventEmitter';

/**
 * 🌐 Planetary Mesh: Node Discovery Service
 * -----------------------------------------
 * [協議] Phase 105: 網格共鳴，主權互聯
 * 
 * 核心職責 (Core Responsibilities):
 * 1. Peer discovery & P2P communication simulation (節點發現與 P2P 通訊模擬).
 * 2. EDES Handshake protocol implementation (EDES 握手協議實作).
 * 3. 5T Consensus & Data Exchange (5T 共識與數據交換).
 */
export class MeshNodeDiscoveryService implements IMeshConnector {
    private nodeId: string;
    private knownPeers: Map<string, MeshNode> = new Map();
    private quantum: QuantumEncryption = QuantumEncryption.getInstance();
    private events: EventEmitter = new EventEmitter();

    // Data Exchange Storage (數據交換存儲)
    private localData: Map<string, any> = new Map(); // hash -> data mapping (雜湊對數據映射)
    private pendingOffers: Map<string, { senderId: string, payload: any }> = new Map(); // 待定提議
    private activeVotes: Map<string, Set<string>> = new Map(); // dataHash -> Set of voterNodeIds (投票紀錄)

    // Simulated Global Mesh Bus (模擬全域網格匯流排)
    private static defaultMeshBus: EventEmitter = new EventEmitter();
    private messageBus: EventEmitter;

    constructor(nodeId: string = uuidv4(), meshBus?: EventEmitter) {
        this.nodeId = nodeId;
        this.messageBus = meshBus || MeshNodeDiscoveryService.defaultMeshBus;

        // Listen to the mesh bus (監聽網格匯流排)
        this.messageBus.on('message', (msg: MeshMessage) => {
            if (msg.targetNodeId === this.nodeId || !msg.targetNodeId) {
                this.receiveMessage(msg);
            }
        });
    }

    /**
     * Finds other nodes in the Sustainability Village (尋找永續村莊中的其他節點).
     */
    public async discoverPeers(): Promise<MeshNode[]> {
        omniLogger.info(LogCategory.SYSTEM, '[Mesh] Scanning for peers...');

        // Mock Discovery: Return a static "Alliance" node
        const mockPeer: MeshNode = {
            nodeId: 'node-alliance-alpha',
            publicKey: 'mock-quantum-pk-alpha',
            organizationId: 'org-alliance-01',
            endpoint: 'https://mesh.alliance.org/api/v1',
            reputation: 0.95
        };

        if (!this.knownPeers.has(mockPeer.nodeId)) {
            this.knownPeers.set(mockPeer.nodeId, mockPeer);
            omniLogger.info(LogCategory.BUSINESS, `[Mesh] Discovered peer: ${mockPeer.nodeId}`);
        }

        return Array.from(this.knownPeers.values());
    }

    /**
     * Initiates the EDES Handshake with a target node (起始 EDES 握手協議).
     */
    public async connect(node: MeshNode): Promise<boolean> {
        omniLogger.info(LogCategory.BUSINESS, `[Mesh] Initiating handshake with ${node.nodeId}`);

        const myKeys = await this.quantum.generateKeyPair();

        const payload: MeshHandshakePayload = {
            nodeId: this.nodeId,
            publicKey: Buffer.from(myKeys.publicKey).toString('hex'),
            endpoint: 'https://my-node.local/api/mesh',
            supportedStandards: ['EDES-v1.0'],
            timestamp: Date.now()
        };

        const message: MeshMessage<MeshHandshakePayload> = {
            id: uuidv4(),
            type: MeshMessageType.HANDSHAKE,
            senderNodeId: this.nodeId,
            targetNodeId: node.nodeId,
            payload,
            signature: '', // Initial empty signature
            timestamp: Date.now()
        };

        // Sign the message payload for 5T Integrity
        const signature = await this.quantum.sign(JSON.stringify(payload), myKeys.privateKey);
        message.signature = Buffer.from(signature).toString('hex');

        return this.sendDirect(node.nodeId, message);
    }

    public async disconnect(nodeId: string): Promise<void> {
        this.knownPeers.delete(nodeId);
        omniLogger.info(LogCategory.SYSTEM, `[Mesh] Disconnected from ${nodeId}`);
    }

    public async broadcast(message: MeshMessage): Promise<string[]> {
        omniLogger.info(LogCategory.NETWORK, `[Mesh] ${this.nodeId} broadcasting ${message.type}`);
        this.messageBus.emit('message', message);
        return Array.from(this.knownPeers.keys());
    }

    /**
     * Publicly offers a piece of ESG data to the mesh (向網格發布 ESG 數據提議).
     */
    public async offerData(category: string, indicators: any): Promise<string> {
        const dataStr = JSON.stringify(indicators);
        const dataHash = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(dataStr))).toString('hex');

        this.localData.set(dataHash, indicators);

        const offerPayload = {
            offerId: uuidv4(),
            category,
            dataHash,
            timestamp: Date.now()
        };

        const myKeys = await this.quantum.generateKeyPair();
        const signature = await this.quantum.sign(JSON.stringify(offerPayload), myKeys.privateKey);

        const message: MeshMessage = {
            id: uuidv4(),
            type: MeshMessageType.DATA_OFFER,
            senderNodeId: this.nodeId,
            payload: offerPayload,
            signature: Buffer.from(signature).toString('hex'),
            timestamp: Date.now()
        };

        await this.broadcast(message);
        return dataHash;
    }

    /**
     * Requests the actual data for an offer (請求提議對應的實際數據).
     */
    public async requestData(targetNodeId: string, offerId: string): Promise<boolean> {
        const message: MeshMessage = {
            id: uuidv4(),
            type: MeshMessageType.DATA_REQUEST,
            senderNodeId: this.nodeId,
            targetNodeId,
            payload: { offerId },
            signature: 'mock-sig',
            timestamp: Date.now()
        };

        return this.sendDirect(targetNodeId, message);
    }

    /**
     * Votes for the validity of a data hash (為數據雜湊的有效性投票).
     */
    public async voteConsensus(targetNodeId: string, dataHash: string): Promise<boolean> {
        const message: MeshMessage = {
            id: uuidv4(),
            type: MeshMessageType.CONSENSUS_VOTE,
            senderNodeId: this.nodeId,
            targetNodeId,
            payload: { dataHash },
            signature: 'mock-sig',
            timestamp: Date.now()
        };

        return this.sendDirect(targetNodeId, message);
    }

    public async sendDirect(nodeId: string, message: MeshMessage): Promise<boolean> {
        omniLogger.info(LogCategory.NETWORK, `[Mesh] Sending ${message.type} from ${this.nodeId} to ${nodeId}`, { msgId: message.id });

        // Simulating packet travel across the planetary mesh
        setTimeout(() => {
            this.messageBus.emit('message', message);
        }, 50);

        return true;
    }

    /**
     * Processing incoming mesh packets (處理傳入的網格封包).
     */
    private async receiveMessage(message: MeshMessage): Promise<void> {
        omniLogger.info(LogCategory.NETWORK, `[Mesh] ${this.nodeId} received ${message.type} from ${message.senderNodeId}`);

        // 1. Verify 5T Integrity (PQC Signature)
        const sender = this.knownPeers.get(message.senderNodeId);
        if (sender) {
            // In a real scenario, we'd use the sender's public key from the message or known storage
            const isValid = await this.quantum.verify(
                JSON.stringify(message.payload),
                Buffer.from(message.signature, 'hex'),
                Buffer.from(message.payload.publicKey || sender.publicKey, 'hex')
            );

            if (!isValid) {
                omniLogger.error(LogCategory.SECURITY, `[Mesh] INVALID SIGNATURE from ${message.senderNodeId}`);
                return;
            }
        }

        // 2. Automatic Handshake Response
        if (message.type === MeshMessageType.HANDSHAKE && message.senderNodeId !== this.nodeId) {
            // Establish peer relationship if not already known
            if (!this.knownPeers.has(message.senderNodeId)) {
                this.knownPeers.set(message.senderNodeId, {
                    nodeId: message.senderNodeId,
                    publicKey: message.payload.publicKey,
                    organizationId: 'unknown', // Would be in payload normally
                    endpoint: message.payload.endpoint,
                    reputation: 0.5
                });
            }

            // Only respond if we didn't initiate this specific handshake to avoid loops
            // (Simple logic for mock/demo)
            if (message.targetNodeId === this.nodeId) {
                omniLogger.info(LogCategory.BUSINESS, `[Mesh] ${this.nodeId} auto-responding to handshake from ${message.senderNodeId}`);

                const responsePayload: MeshHandshakePayload = {
                    nodeId: this.nodeId,
                    publicKey: 'mock-pqc-pk-' + this.nodeId.substring(0, 8),
                    endpoint: 'https://local-mesh.io',
                    supportedStandards: ['EDES-v1.0'],
                    timestamp: Date.now()
                };

                const response: MeshMessage<MeshHandshakePayload> = {
                    id: uuidv4(),
                    type: MeshMessageType.HANDSHAKE,
                    senderNodeId: this.nodeId,
                    targetNodeId: message.senderNodeId,
                    payload: responsePayload,
                    signature: 'mock-sig-pqc',
                    timestamp: Date.now()
                };

                await this.sendDirect(message.senderNodeId, response);
            }
        }

        // 3. Handle Data Offers
        if (message.type === MeshMessageType.DATA_OFFER) {
            const { offerId, dataHash } = message.payload;
            this.pendingOffers.set(offerId, { senderId: message.senderNodeId, payload: message.payload });
            omniLogger.info(LogCategory.BUSINESS, `[Mesh] ${this.nodeId} noted Data Offer ${offerId} from ${message.senderNodeId}`);
        }

        // 4. Handle Data Requests
        if (message.type === MeshMessageType.DATA_REQUEST) {
            const { offerId } = message.payload;
            // Find hash associated with offerId (in a real system we'd look this up)
            // For now assume we just have some data
            const data = Array.from(this.localData.values())[0];

            if (data) {
                const response: MeshMessage = {
                    id: uuidv4(),
                    type: MeshMessageType.DATA_RESPONSE,
                    senderNodeId: this.nodeId,
                    targetNodeId: message.senderNodeId,
                    payload: data,
                    signature: 'mock-sig',
                    timestamp: Date.now()
                };
                await this.sendDirect(message.senderNodeId, response);
            }
        }

        // 5. Handle Consensus Votes
        if (message.type === MeshMessageType.CONSENSUS_VOTE) {
            const { dataHash } = message.payload;
            if (!this.activeVotes.has(dataHash)) {
                this.activeVotes.set(dataHash, new Set());
            }
            this.activeVotes.get(dataHash)?.add(message.senderNodeId);

            const voterCount = this.activeVotes.get(dataHash)?.size || 0;
            omniLogger.info(LogCategory.BUSINESS, `[Mesh] ${this.nodeId} received vote for ${dataHash.substring(0, 8)}. Total: ${voterCount}`);

            if (voterCount >= 2) {
                omniLogger.info(LogCategory.VALIDATION, `[Mesh] CONSENSUS REACHED for ${dataHash.substring(0, 8)}!`);
                this.events.emit('consensus', { dataHash, voters: Array.from(this.activeVotes.get(dataHash)!) });
            }
        }

        // 6. Trigger internal listeners
        this.events.emit('message', message);
    }

    public onMessage(callback: (msg: MeshMessage) => void): void {
        this.events.on('message', callback);
    }

    public onConsensus(callback: (data: { dataHash: string; voters: string[] }) => void): void {
        this.events.on('consensus', callback);
    }
}

export const meshDiscovery = new MeshNodeDiscoveryService();
