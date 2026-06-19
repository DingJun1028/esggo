import { omniSyncService, OmniSyncEventType } from './OmniSyncService.js';
import { OmniResonanceDimension } from '../omni/core/types/OmniCore.types.js';
export class OmniResonanceCore {
    static instance;
    // Map of core UUIDs to their resonance contributions in each dimension
    activeCores = new Map();
    // Global collective resonance for each dimension
    collectiveResonance = {
        [OmniResonanceDimension.ENVIRONMENTAL]: 0.5,
        [OmniResonanceDimension.SOCIAL]: 0.5,
        [OmniResonanceDimension.GOVERNANCE]: 0.5,
        [OmniResonanceDimension.TECHNOLOGICAL]: 0.5,
        [OmniResonanceDimension.AWARENESS]: 0.5,
    };
    constructor() {
        // Subscribe to cross-tab updates
        omniSyncService.subscribe(event => {
            if (event.type === OmniSyncEventType.RESONANCE_UPDATE) {
                const { uuid, dimension, resonance } = event.payload;
                this.updateLocalResonance(uuid, dimension, resonance);
            }
            else if (event.type === OmniSyncEventType.AWAKENING_BROADCAST) {
                const { sourceUuid } = event.payload;
                this.broadcastLocalAwakening(sourceUuid);
            }
        });
    }
    static getInstance() {
        if (!OmniResonanceCore.instance) {
            OmniResonanceCore.instance = new OmniResonanceCore();
        }
        return OmniResonanceCore.instance;
    }
    /**
     * 📥 [One in All] 註冊節點 / Register Core
     * --------------------------------------------------
     * [TC] 將新心核註冊至君愛元鑰網路。
     * [EN] Registers a new core to the JunAiKey network.
     */
    registerCore(uuid, initialResonances) {
        const defaultResonance = {
            [OmniResonanceDimension.ENVIRONMENTAL]: 0.1,
            [OmniResonanceDimension.SOCIAL]: 0.1,
            [OmniResonanceDimension.GOVERNANCE]: 0.1,
            [OmniResonanceDimension.TECHNOLOGICAL]: 0.1,
            [OmniResonanceDimension.AWARENESS]: 0.1,
        };
        this.activeCores.set(uuid, { ...defaultResonance, ...initialResonances });
        this.updateCollectiveResonance();
    }
    /**
     * 🔄 [All in One] 更新共鳴 / Update Resonance
     * --------------------------------------------------
     * [TC] 更新特定心核的共鳴貢獻度，觸發網路重校準。
     * [EN] Updates the resonance contribution of a specific core, triggering
     *      network recalibration.
     */
    updateResonance(uuid, dimension, newResonance) {
        if (this.activeCores.has(uuid)) {
            this.updateLocalResonance(uuid, dimension, newResonance);
            // Broadcast to other tabs
            omniSyncService.broadcast(OmniSyncEventType.RESONANCE_UPDATE, {
                uuid,
                dimension,
                resonance: newResonance,
            });
        }
    }
    updateLocalResonance(uuid, dimension, newResonance) {
        const coreResonance = this.activeCores.get(uuid);
        if (coreResonance) {
            coreResonance[dimension] = newResonance;
            this.updateCollectiveResonance();
        }
    }
    /**
     * 🌐 [One is One] 獲取全域共鳴 / Get Global Resonance
     * --------------------------------------------------
     * [TC] 取得當前君愛網路的集體共鳴等級。
     * [EN] Retrieves the current collective resonance level of the JunAiKey network.
     */
    getGlobalResonance(dimension) {
        if (dimension) {
            return this.collectiveResonance[dimension];
        }
        return { ...this.collectiveResonance };
    }
    updateCollectiveResonance() {
        if (this.activeCores.size === 0)
            return;
        const dimensions = Object.values(OmniResonanceDimension);
        dimensions.forEach(dim => {
            let total = 0;
            this.activeCores.forEach(core => {
                total += core[dim];
            });
            const rawAvg = total / this.activeCores.size;
            this.collectiveResonance[dim] = Math.min(0.999, 0.5 + rawAvg * 0.499);
        });
        // Log average resonance
        const avg = dimensions.reduce((acc, dim) => acc + this.collectiveResonance[dim], 0) / dimensions.length;
        console.log(`   [Omni-Network] Collective Resonance: ${(avg * 100).toFixed(2)}% | Nodes: ${this.activeCores.size}`);
    }
    /**
     * ⚡ [All is One] 播發覺醒 / Broadcast Awakening
     * --------------------------------------------------
     * [TC] 向網路播發覺醒火花，同步並提升所有節點的覺醒潛力。
     * [EN] Broadcasts an awakening spark to the network, synchronizing and
     *      boosting the awakening potential of all nodes.
     */
    broadcastAwakening(sourceUuid) {
        this.broadcastLocalAwakening(sourceUuid);
        // Broadcast to other tabs
        omniSyncService.broadcast(OmniSyncEventType.AWAKENING_BROADCAST, { sourceUuid });
    }
    broadcastLocalAwakening(sourceUuid) {
        console.log(`   [Omni-Network] ⚡ Awakening Spark from [${sourceUuid}]! Synchronizing network...`);
        const dimensions = Object.values(OmniResonanceDimension);
        for (const [uuid, coreResonances] of this.activeCores.entries()) {
            if (uuid !== sourceUuid) {
                dimensions.forEach(dim => {
                    // Boost others by 2% of the potential gap in each dimension
                    const boost = (1.0 - coreResonances[dim]) * 0.02;
                    coreResonances[dim] += boost;
                });
            }
        }
        this.updateCollectiveResonance();
    }
    // --- Legacy / Individual Growth Methods (Evolved) ---
    /**
     * 💎 個體突破 / Individual Breakthrough
     * [TC] 計算單一屬性的突破機率，受全域共鳴度影響。
     * [EN] Calculates breakthrough probability for a single attribute,
     *      influenced by global resonance.
     */
    static attemptBreakthrough(attribute, currentValue, resonance = 0.5, dimension = OmniResonanceDimension.AWARENESS) {
        const networkEffect = OmniResonanceCore.getInstance().getGlobalResonance(dimension);
        const totalResonance = (resonance + networkEffect) / 2;
        const baseSuccessRate = 0.3 + totalResonance * 0.2;
        const rand = Math.random();
        const success = rand < baseSuccessRate;
        const entropyImpact = success ? 0.02 : 0.1;
        const multiplier = success ? 1.3 : 1.0;
        const newValue = Math.floor(currentValue * multiplier);
        return { success, attribute, oldValue: currentValue, newValue, entropyImpact };
    }
    /**
     * 🧬 技能演化 / Skill Evolution
     * [TC] 根據歷史數據演化技能屬性。
     * [EN] Evolves skill attributes based on history data.
     */
    static evolveSkill(skill, history) {
        // Simple evolution logic: boost skills based on history length for now
        const resonanceLevel = history.length > 5 ? 'Resonant' : 'Stable';
        return [
            {
                ...skill,
                status: resonanceLevel,
                powerLevel: Math.min(10, 5 + Math.floor(history.length / 2)),
            },
        ];
    }
}
// Export as alias for backward compatibility
export const QuantumResonanceCore = OmniResonanceCore;
