import { v4 as uuidv4 } from 'uuid';
import { esgKnowledgeDatabase } from '../data/esgKnowledgeDatabase.js';
import { omniKeyService } from './OmniKeyService.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';
import { globalPulseService } from './GlobalPulseService';
import { IImpactNexusState, IImpactCard, IVillageNode } from '../types/impact-nexus';
import { IComponentCore, IEvidenceMap } from '../0-domain/contracts/IComponentCore';

/**
 * 🛠️ [5T] Integrity Vault: SHA-256 Hash Generation
 */
async function generateHash(data: object): Promise<string> {
    const content = JSON.stringify({ ...data, timestamp: Date.now(), nonce: uuidv4() });
    const msgBuffer = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class SustainabilityVillageService {
    private static instance: SustainabilityVillageService;
    private state: IImpactNexusState;
    private listeners: ((state: IImpactNexusState) => void)[] = [];
    private readonly STORAGE_KEY = 'impact_nexus_state_v8';
    private userId: string | null = null;
    private readonly API_BASE = '/api/game';
    private entropyInterval: NodeJS.Timeout | null = null;

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '[SYSTEM] 🌌 [Impact Nexus] Core Engine Initializing...');

        const defaultState: IImpactNexusState = {
            playerSoul: {
                xp: 0,
                level: 1,
                resonance: 50,
                mana: 100,
                rank: 'NEOPHYTE',
            },
            village: {
                nodes: [
                    { id: 'node-mana-1', name: 'Mana World Pillar', type: 'MANA', level: 10, health: 100, entropyLevel: 0, isCorrupted: false, position: { x: 0, y: 0, z: 0 } },
                    { id: 'node-energy-1', name: 'Solar Spire', type: 'ENERGY', level: 1, health: 80, entropyLevel: 10, isCorrupted: false, position: { x: 150, y: 150, z: 0 } },
                    { id: 'node-nature-1', name: 'Bio-Sync Grove', type: 'NATURE', level: 1, health: 90, entropyLevel: 5, isCorrupted: false, position: { x: -150, y: 150, z: 0 } },
                    { id: 'node-social-1', name: 'Empathy Plaza', type: 'SOCIAL', level: 1, health: 70, entropyLevel: 25, isCorrupted: false, position: { x: -150, y: -150, z: 0 } },
                    { id: 'node-tech-1', name: 'Quantum Nexus', type: 'TECH', level: 1, health: 85, entropyLevel: 15, isCorrupted: false, position: { x: 150, y: -150, z: 0 } },
                    { id: 'decor-rock-1', name: '護念石', type: 'DECOR', level: 1, health: 100, entropyLevel: 0, isCorrupted: false, position: { x: 50, y: 80, z: 0 } },
                    { id: 'decor-rock-2', name: '守誠岩', type: 'DECOR', level: 1, health: 100, entropyLevel: 0, isCorrupted: false, position: { x: -60, y: -90, z: 0 } },
                    { id: 'decor-flower-1', name: '上善花', type: 'DECOR', level: 1, health: 100, entropyLevel: 0, isCorrupted: false, position: { x: 120, y: -40, z: 0 } },
                    { id: 'decor-flower-2', name: '若水草', type: 'DECOR', level: 1, health: 100, entropyLevel: 0, isCorrupted: false, position: { x: -100, y: 40, z: 0 } },
                ],
                globalHealth: 85,
                entropyPressure: 10,
                playerPos: { x: 0, y: 120, z: 10 },
                playerDirection: 'S',
            },
            deck: [],
            playerHand: [],
            activeEvents: [],
            activeQuests: [],
            entropy: 10,
            timestamp: Date.now().toString()
        };

        this.state = this.restoreFromStorage() || defaultState;
        if (this.state.deck.length === 0) {
            this.state.deck = this.generateInitialDeck();
        }

        if (typeof window !== 'undefined') {
            this.startEntropyLoop();
        }
    }

    public static getInstance(): SustainabilityVillageService {
        if (!this.instance) {
            this.instance = new SustainabilityVillageService();
        }
        return this.instance;
    }

    private startEntropyLoop() {
        if (this.entropyInterval) return;
        this.entropyInterval = setInterval(() => {
            this.entropyDevourerCycle();
        }, 10000);
    }

    private entropyDevourerCycle() {
        let hasChanges = false;
        this.state.village.nodes.forEach(node => {
            if (node.health < 100 && !node.isCorrupted) {
                if (Math.random() < 0.1) {
                    node.entropyLevel = Math.min(100, node.entropyLevel + 5);
                    node.health = Math.max(0, node.health - 2);
                    hasChanges = true;
                    if (node.entropyLevel > 50) {
                        node.isCorrupted = true;
                        globalPulseService.emitPulse({
                            type: 'Policy',
                            source: 'EntropyDevourer',
                            intensity: 0.8,
                            message: `⚠️ Entropy Spike detected at ${node.name}!`
                        });
                    }
                }
            }
        });

        if (hasChanges) {
            this.setState({});
        }
    }

    public stopEntropyLoop() {
        if (this.entropyInterval) {
            clearInterval(this.entropyInterval);
            this.entropyInterval = null;
        }
    }

    public setUserId(userId: string): void {
        this.userId = userId;
        omniLogger.info(LogCategory.SYSTEM, `[SYSTEM] 🌌 [Impact Nexus] User Identity Linked: ${userId}`);
        this.restoreRemoteState();
    }

    private async restoreRemoteState(): Promise<void> {
        if (!this.userId) return;
        try {
            const response = await fetch(`${this.API_BASE}/state/${this.userId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.state) {
                    omniLogger.info(LogCategory.SYSTEM, '[SYSTEM] 🌌 [Impact Nexus] Remote State Synced');
                    // Potential merge logic here
                }
            }
        } catch (e) {
            console.warn('Failed to restore remote state', e);
        }
    }

    public movePlayer(direction: 'N' | 'S' | 'E' | 'W'): void {
        const state = this.getState();
        const MOVE_SPEED = 15;
        let dx = 0, dy = 0;
        switch (direction) {
            case 'N': dy = -1; break;
            case 'S': dy = 1; break;
            case 'W': dx = -1; break;
            case 'E': dx = 1; break;
        }
        let newX = state.village.playerPos.x + dx * MOVE_SPEED;
        let newY = state.village.playerPos.y + dy * MOVE_SPEED;
        const BOUNDS = 280;
        newX = Math.max(-BOUNDS, Math.min(BOUNDS, newX));
        newY = Math.max(-BOUNDS, Math.min(BOUNDS, newY));

        this.setState({
            village: {
                ...state.village,
                playerPos: { ...state.village.playerPos, x: newX, y: newY },
                playerDirection: direction
            }
        });
    }

    public async talkToNPC(npcId: string): Promise<string> {
        omniLogger.info(LogCategory.SYSTEM, `[USER_ACTION] 🗣️ Talking to NPC: ${npcId}`);
        const dialogues: Record<string, string> = {
            'npc-thoth': '永續不僅是數據，更是萬物共生的藝術。你感受到了嗎？',
            'npc-junaikey': '我能感覺到你的心流正在與全域脈動同步。',
            'npc-lingo': '讓我們用正確的敘事，點燃改變的火花。',
        };
        const response = dialogues[npcId] || '願永續之光指引你。';
        this.addXP(10, `First conversation with ${npcId}`);
        return response;
    }

    public acceptQuest(questId: string): void {
        const state = this.getState();
        if (state.activeQuests.find(q => q.id === questId)) return;
        const questTemplates: Record<string, any> = {
            'quest-1': { id: 'quest-1', title: '初試啼聲', description: '修復一個受損的能源節點', reward: { xp: 200, tokens: 50 }, status: 'ACTIVE' },
            'quest-2': { id: 'quest-2', title: '知識傳承', description: '與三位聯盟夥伴對話', reward: { xp: 150, tokens: 30 }, status: 'ACTIVE' },
        };
        const newQuest = questTemplates[questId];
        if (newQuest) {
            state.activeQuests.push(newQuest);
            this.setState({ activeQuests: state.activeQuests });
            omniLogger.info(LogCategory.SYSTEM, `[USER_ACTION] 📜 Quest Accepted: ${newQuest.title}`);
            this.state.activeEvents.unshift({
                type: 'Social',
                message: `[QUEST] Accepted: ${newQuest.title}`,
                timestamp: Date.now()
            });
        }
    }

    public getState(): IImpactNexusState {
        return this.state;
    }

    public async setState(patch: Partial<IImpactNexusState>) {
        this.state = {
            ...this.state,
            ...patch,
            village: patch.village ? { ...this.state.village, ...patch.village } : this.state.village,
            timestamp: Date.now().toString()
        };

        try {
            const signature = await omniKeyService.signData({
                timestamp: this.state.timestamp,
                entropy: this.state.entropy,
                stats: this.state.playerSoul
            });
            this.state.signature = signature;
            this.state.publicKey = (await omniKeyService.getPublicKeyString()) || undefined;
        } catch (e) {
            console.error('Signing failed', e);
        }

        this.saveToStorage();
        this.notify();
    }

    public subscribe(listener: (state: IImpactNexusState) => void) {
        this.listeners.push(listener);
        listener(this.state);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l(this.state));
    }

    private generateInitialDeck(): IImpactCard[] {
        const baseDeck: IImpactCard[] = [
            {
                uuid: uuidv4(),
                rarity: 'COMMON',
                impactCategory: 'ENVIRONMENTAL',
                resonance: { base: 10, current: 10, potential: 100 },
                entropyImpact: 5,
                isLocked: false,
                teachingPoint: 'Reforestation restoration follows nature sync algorithms.',
                stats: { E: 20, S: 10, G: 0 },
                metadata: {
                    title: 'Eco-Reforestation',
                    subTitle: 'Nature Harmony',
                    visualStyle: 'Liquid Glass / Nature Sync',
                },
                category: 'Location',
                logicGate: {
                    source_origin: 'preset/reforestation',
                    lifecycle_hooks: [],
                    formula_ref: 'ISO-14064'
                },
                hash_lock: 'preset_hash_1',
                version: '1.0',
                timestamp: Date.now().toString()
            },
            {
                uuid: uuidv4(),
                rarity: 'RARE',
                impactCategory: 'ENVIRONMENTAL',
                resonance: { base: 30, current: 30, potential: 200 },
                entropyImpact: 10,
                isLocked: false,
                teachingPoint: 'Quantum optimization minimizes entropy in energy distribution.',
                stats: { E: 10, S: 0, G: 20 },
                metadata: {
                    title: 'Quantum Energy Grid',
                    subTitle: 'Lossless power distribution',
                    visualStyle: 'Electric Blue / Tech Glass',
                },
                category: 'Location',
                logicGate: {
                    source_origin: 'preset/energy_grid',
                    lifecycle_hooks: [],
                    formula_ref: 'ISO-50001'
                },
                hash_lock: 'preset_hash_2',
                version: '1.0',
                timestamp: Date.now().toString()
            }
        ];

        const knowledgeCards: IImpactCard[] = esgKnowledgeDatabase.map(nexus => ({
            uuid: uuidv4(),
            rarity: (nexus.corporateCase?.impactLevel || 0) > 90 ? 'LEGENDARY' : 'RARE',
            impactCategory: nexus.knowledgePoint?.category === 'E' ? 'ENVIRONMENTAL' : nexus.knowledgePoint?.category === 'S' ? 'SOCIAL' : 'GOVERNANCE',
            resonance: { base: 20, current: 20, potential: 100 },
            entropyImpact: nexus.corporateCase?.impactLevel || 30,
            isLocked: false,
            teachingPoint: nexus.knowledgePoint?.content,
            learningNexus: nexus,
            stats: {
                E: nexus.knowledgePoint?.category === 'E' ? 10 : 5,
                S: nexus.knowledgePoint?.category === 'S' ? 10 : 5,
                G: nexus.knowledgePoint?.category === 'G' ? 10 : 5
            },
            metadata: {
                title: nexus.knowledgePoint?.title || 'ESG Mystery Card',
                subTitle: nexus.corporateCase?.company || 'ESG Knowledge Insight',
                visualStyle: nexus.knowledgePoint?.category === 'E' ? 'Liquid Cyan' : nexus.knowledgePoint?.category === 'S' ? 'Vital Amber' : 'Governance Gold',
            },
            category: 'Skill',
            logicGate: {
                source_origin: `db/nexus/${nexus.knowledgePoint?.title}`,
                lifecycle_hooks: [],
                formula_ref: nexus.knowledgePoint?.standard || 'GRI'
            },
            hash_lock: `hash_${uuidv4()}`,
            version: '1.0',
            timestamp: Date.now().toString()
        }));

        return [...baseDeck, ...knowledgeCards];
    }

    public async drawInitialHand(): Promise<void> {
        this.state.playerHand = [];
        for (let i = 0; i < 5; i++) {
            await this.drawCard();
        }
        this.saveToStorage();
    }

    public async drawCard(): Promise<void> {
        if (this.state.deck.length === 0) return;
        const randomIndex = Math.floor(Math.random() * this.state.deck.length);
        const [card] = this.state.deck.splice(randomIndex, 1);
        if (card) {
            try {
                card.signature = await omniKeyService.signData(card.uuid);
                card.publicKey = (await omniKeyService.getPublicKeyString()) || undefined;
            } catch (e) {
                console.warn('Card signing failed', e);
            }
            this.state.playerHand.push(card);
            await this.setState({
                playerHand: this.state.playerHand,
                deck: this.state.deck
            });
        }
    }

    public resetGame(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
            window.location.reload();
        }
    }

    public async playCard(cardId: string): Promise<boolean> {
        const cardIndex = this.state.playerHand.findIndex(c => c.uuid === cardId);
        const node = this.state.village.nodes.find(n => !n.isCorrupted) || this.state.village.nodes[0];
        if (cardIndex === -1 || !node) return false;

        const [card] = this.state.playerHand.splice(cardIndex, 1);
        if (!card) return false;

        node.health = Math.min(100, node.health + (card.stats.E + card.stats.S + card.stats.G) / 10);
        node.entropyLevel = Math.max(0, node.entropyLevel - card.entropyImpact);
        this.addXP(50, `Played ${card.metadata.title}`);
        await this.drawCard();
        await this.setState({
            playerHand: this.state.playerHand,
            village: this.state.village
        });

        globalPulseService.emitPulse({
            type: 'Environmental',
            source: `ImpactNexus_PlayCard_${cardId}`,
            intensity: 0.5,
            message: `Card ${card.metadata.title} resonated with ${node.name}`,
        });

        return true;
    }

    private addXP(amount: number, source: string) {
        this.state.playerSoul.xp += amount;
        if (this.state.playerSoul.xp >= this.state.playerSoul.level * 1000) {
            this.state.playerSoul.level++;
            this.state.playerSoul.rank = this.getNextRank();
            omniLogger.info(LogCategory.SYSTEM, `[SYSTEM] 🌌 [Soul Ascension] Level Up! Rank: ${this.state.playerSoul.rank}`);
        }
        omniLogger.info(LogCategory.SYSTEM, `[USER_ACTION] ✨ [XP] +${amount} from ${source}`);
    }

    private getNextRank(): string {
        const ranks = ['NEOPHYTE', 'INITIATE', 'STREWARD', 'CHAMPION', 'GUARDIAN', 'SOVEREIGN'];
        return ranks[Math.min(this.state.playerSoul.level - 1, ranks.length - 1)] || 'NEOPHYTE';
    }

    public async crystallizeSession(): Promise<IComponentCore> {
        const hashLock = await generateHash(this.state);
        const crystalProof: IComponentCore = {
            uuid: uuidv4(),
            version: '1.0.0',
            timestamp: Date.now(),
            status: 'Sealed',
            evidence: {
                trustworthy: {
                    hash_lock: hashLock,
                    is_frozen: true,
                    locked_at: Date.now()
                },
                verified_at: Date.now()
            },
            data: {
                state: this.state
            }
        };

        if (this.userId) {
            fetch(`${this.API_BASE}/crystallize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId, sessionData: crystalProof })
            }).catch(e => console.error('Crystallization Sync Failed', e));
        }

        globalPulseService.emitPulse({
            type: 'Social',
            source: 'CrystallizationRitual',
            intensity: 1.0,
            message: `💎 SESSION CRYSTALLIZED | HASH: ${hashLock.substring(0, 8)}...`
        });

        return crystalProof;
    }

    public async triggerAwakeningInstantWin(): Promise<void> {
        if (!this.userId) return;
        try {
            const response = await fetch(`${this.API_BASE}/awaken/instant-win`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId })
            });
            if (response.ok) {
                const result = await response.json();
                this.addXP(result.rewards.xp || 9999, 'Non-Action Virtue');
                globalPulseService.emitPulse({
                    type: 'Social',
                    source: 'Awakening_InstantWin',
                    intensity: 1.0,
                    message: `🌟 ${result.message}`
                });
            }
        } catch (error) {
            console.error('Awakening Trigger Failed', error);
        }
    }

    private restoreFromStorage(): IImpactNexusState | null {
        if (typeof window === 'undefined') return null;
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    }

    private saveToStorage(): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
        if (this.userId) {
            fetch(`${this.API_BASE}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.userId, state: this.state })
            }).catch(e => console.warn('Background sync failed', e));
        }
    }
}

export const sustainabilityVillageService = SustainabilityVillageService.getInstance();
