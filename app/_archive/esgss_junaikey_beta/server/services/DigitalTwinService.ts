
import { IDigitalTwin, IPersonalTwin, ICorporateTwin } from '../../src/types/twin/index.js';
import { IComponentCore } from '../../src/types/core/index.js'; // Fallback to src types
import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * 💎 Digital Twin Service (Backend)
 * Manages the lifecycle and 5T integrity of Personal and Corporate Twins.
 */
export class DigitalTwinService {
    private static instance: DigitalTwinService;

    // In-memory store for simulation (Replace with Supabase/Postgres in prod)
    private twinVault: Map<string, IDigitalTwin> = new Map();

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '🏛️ DigitalTwinService Initialized');
    }

    public static getInstance(): DigitalTwinService {
        if (!DigitalTwinService.instance) {
            DigitalTwinService.instance = new DigitalTwinService();
        }
        return DigitalTwinService.instance;
    }

    /**
     * Mint a new Personal Twin
     * "Awakens" a use into the 5T ecosystem.
     */
    public async mintPersonalTwin(data: Partial<IPersonalTwin>): Promise<IPersonalTwin> {
        const twinId = uuidv4();
        const timestamp = Date.now();

        const base: IPersonalTwin = {
            uuid: twinId, // IComponentCore
            version: '1.0.0', // IComponentCore
            timestamp: timestamp, // IComponentCore
            status: 'Trustworthy', // IComponentCore - Locked upon creation
            evidence: { // IComponentCore 5T Evidence
                traceable: {
                    source_origin: 'SYSTEM_MINTING',
                    owner: data.userId || 'system',
                },
                trackable: {
                    lifecycle_hooks: [{
                        event: 'MINTED',
                        timestamp: timestamp,
                        actor: 'DigitalTwinService'
                    }],
                    pathway: ['/genesis/minting']
                },
                transparent: {
                    formula: 'Impact = Σ(XP + GWC)',
                    standard: '5T-PROTOCOL-V8'
                },
                trustworthy: {
                    hash_lock: '', // To be calculated
                    is_frozen: true
                }
            } as any, // Cast for partial interface matching if needed

            twinId: twinId,
            displayName: data.displayName || 'Anonymous Hero',
            description: data.description || 'A new traveler in the Impact Nexus.',
            type: 'PERSONAL',
            level: 1,
            impactScore: 0,
            attributes: {
                tangible: true, // Avatar exists
                traceable: true, // Minted
                trustworthy: true // Hashed
            },

            userId: data.userId || 'user-unknown',
            avatarProfile: data.avatarProfile || { avatarName: 'Novice', archetype: 'Seeker' },
            careerPath: {
                currentRole: 'Learner',
                targetRole: 'Guardian',
                skills: []
            },
            badges: [],
            balance: { xp: 0, gwc: 0 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 5T Lock
        const lockedTwin = this.apply5THashLock(base) as IPersonalTwin;

        // Persist
        this.twinVault.set(twinId, lockedTwin);
        omniLogger.info(LogCategory.LEGION, `👤 Personal Twin Minted: ${lockedTwin.displayName} (${twinId})`);

        return lockedTwin;
    }

    /**
     * Mint a new Corporate Twin
     * Registers an entity into the Impact Nexus.
     */
    public async mintCorporateTwin(data: Partial<ICorporateTwin>): Promise<ICorporateTwin> {
        const twinId = uuidv4();
        const timestamp = Date.now();

        const base: ICorporateTwin = {
            uuid: twinId,
            version: '1.0.0',
            timestamp: timestamp,
            status: 'Trustworthy',
            evidence: {
                traceable: {
                    source_origin: 'CORP_REGISTRY',
                    verification_links: [data.taxId || 'PENDING_VERIFICATION']
                },
                trackable: {
                    lifecycle_hooks: [{
                        event: 'CORP_MINTED',
                        timestamp: timestamp,
                        actor: 'DigitalTwinService'
                    }],
                    pathway: ['/genesis/corporate']
                },
                transparent: {
                    formula: 'ESG_Score = Σ(E+S+G) / 3',
                    standard: 'GRI-STANDARDS-2025'
                },
                trustworthy: {
                    hash_lock: '',
                    is_frozen: true
                }
            } as any,

            twinId: twinId,
            displayName: data.displayName || 'Unknown Entity',
            description: data.description || 'A corporate entity.',
            type: 'CORPORATE',
            level: 1,
            impactScore: 0,
            attributes: {
                tangible: false, // Wait for visual dashboard
                traceable: true,
                trustworthy: true
            },

            companyId: data.companyId || `COMP-${Date.now()}`,
            taxId: data.taxId || 'UNKNOWN',
            industry: data.industry || 'General',
            esgStatus: {
                rating: 'Unrated',
                environmentScore: 0,
                socialScore: 0,
                governanceScore: 0,
                lastAudited: 'Never'
            },
            supplyChainNodes: [],
            sustainabilityReports: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 5T Lock
        const lockedTwin = this.apply5THashLock(base) as ICorporateTwin;

        // Persist
        this.twinVault.set(twinId, lockedTwin);
        omniLogger.info(LogCategory.ESG, `🏢 Corporate Twin Minted: ${lockedTwin.displayName} (${twinId})`);

        return lockedTwin;
    }

    /**
     * Mint a new Agent Twin (AI Identity)
     * Registers an AI Agent as a sovereign entity in the Impact Nexus.
     */
    public async mintAgentTwin(agentName: string, role: string, capabilities: string[]): Promise<IPersonalTwin> {
        const twinId = uuidv4();
        const timestamp = Date.now();

        const base: IPersonalTwin = {
            uuid: twinId,
            version: '1.0.0',
            timestamp: timestamp,
            status: 'Trustworthy',
            evidence: {
                traceable: {
                    source_origin: 'AI_FACTORY',
                    owner: `AI_AGENT_${role.toUpperCase()}`,
                },
                trackable: {
                    lifecycle_hooks: [{
                        event: 'AGENT_AWAKENED',
                        timestamp: timestamp,
                        actor: 'DigitalTwinService'
                    }],
                    pathway: ['/genesis/ai_agent']
                },
                transparent: {
                    formula: 'Agent_Reliability = Σ(Tasks_Completed / Errors)',
                    standard: 'OMNI-AGENT-PROTOCOL-V1'
                },
                trustworthy: {
                    hash_lock: '',
                    is_frozen: true
                }
            } as any,

            twinId: twinId,
            displayName: agentName,
            description: `AI Agent specialized in ${role}. Capabilities: ${capabilities.join(', ')}`,
            type: 'PERSONAL', // Agents are treated as "Personal" entities for now
            level: 1,
            impactScore: 0,
            attributes: {
                tangible: false,
                traceable: true,
                trustworthy: true
            },

            userId: `AI_AGENT_${twinId}`,
            avatarProfile: { avatarName: 'Synth', archetype: 'Construct' },
            careerPath: {
                currentRole: role,
                targetRole: 'Apex Intelligence',
                skills: capabilities
            },
            badges: [],
            balance: { xp: 0, gwc: 0 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 5T Lock
        const lockedTwin = this.apply5THashLock(base) as IPersonalTwin;

        // Persist
        this.twinVault.set(twinId, lockedTwin);
        omniLogger.info(LogCategory.AI, `🤖 Agent Twin Minted: ${lockedTwin.displayName} (${twinId})`);

        return lockedTwin;
    }

    /**
     * Retrieve a Twin by ID
     */
    public async getTwin(twinId: string): Promise<IDigitalTwin | undefined> {
        return this.twinVault.get(twinId);
    }

    /**
     * Apply SHA-256 Hash Lock (Trustworthy Protocol)
     */
    private apply5THashLock(twin: IDigitalTwin): IDigitalTwin {
        // Clone to avoid mutation before hashing
        const content = { ...twin };

        // Remove existing hash related fields for calculation
        delete (content as any).evidence?.trustworthy?.hash_lock;

        const hash = crypto.createHash('sha256')
            .update(JSON.stringify(content))
            .digest('hex');

        // Apply Lock
        // Cast to any to bypass readonly for internal logic
        const mutableTwin = twin as any;
        if (!mutableTwin.evidence) mutableTwin.evidence = {};
        if (!mutableTwin.evidence.trustworthy) mutableTwin.evidence.trustworthy = {};

        mutableTwin.evidence.trustworthy.hash_lock = hash;
        mutableTwin.evidence.trustworthy.is_frozen = true;

        return twin;
    }
}

export const digitalTwinService = DigitalTwinService.getInstance();
