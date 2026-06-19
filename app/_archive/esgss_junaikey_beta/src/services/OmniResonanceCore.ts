/**
 * 🌀 奧秘共鳴核心 / Omni Resonance Core
 * --------------------------------------------------
 * [系列] V6 覺醒架構 (V6 Awakening Architecture)
 * [TC] 管理君愛元鑰 (JunAiKey) 網絡的全域共鳴等級，促進跨組件同步與集體覺醒。
 * [EN] Manages the global resonance level across the JunAiKey network,
 *      facilitating cross-component synchronization and collective awakening.
 *
 * [Sync] Includes cross-tab synchronization via OmniSyncService.
 *
 * [核心哲學 / Philosophy]: One is One | All in One | One in All | All is One
 */
export interface BreakthroughResult {
  success: boolean;
  attribute: string;
  oldValue: number;
  newValue: number;
  entropyImpact: number;
}

import { omniSyncService, OmniSyncEventType } from './OmniSyncService.js';
import { OmniResonanceDimension } from '../omni/core/types/OmniCore.types.js';

export class OmniResonanceCore {
  private static instance: OmniResonanceCore;

  // Map of core UUIDs to their resonance contributions in each dimension
  private activeCores: Map<string, Record<OmniResonanceDimension, number>> = new Map();

  // Global collective resonance for each dimension
  private collectiveResonance: Record<OmniResonanceDimension, number> = {
    [OmniResonanceDimension.ENVIRONMENTAL]: 0.5,
    [OmniResonanceDimension.SOCIAL]: 0.5,
    [OmniResonanceDimension.GOVERNANCE]: 0.5,
    [OmniResonanceDimension.TECHNOLOGICAL]: 0.5,
    [OmniResonanceDimension.AWARENESS]: 0.5,
  };

  private constructor() {
    // Subscribe to cross-tab updates
    omniSyncService.subscribe(event => {
      if (event.type === OmniSyncEventType.RESONANCE_UPDATE) {
        const { uuid, dimension, resonance } = event.payload;
        this.updateLocalResonance(uuid, dimension, resonance);
      } else if (event.type === OmniSyncEventType.AWAKENING_BROADCAST) {
        const { sourceUuid } = event.payload;
        this.broadcastLocalAwakening(sourceUuid);
      }
    });
  }

  public static getInstance(): OmniResonanceCore {
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
  public registerCore(
    uuid: string,
    initialResonances?: Partial<Record<OmniResonanceDimension, number>>
  ) {
    const defaultResonance: Record<OmniResonanceDimension, number> = {
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
  public updateResonance(uuid: string, dimension: OmniResonanceDimension, newResonance: number) {
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

  private updateLocalResonance(
    uuid: string,
    dimension: OmniResonanceDimension,
    newResonance: number
  ) {
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
  public getGlobalResonance(
    dimension?: OmniResonanceDimension
  ): number | Record<OmniResonanceDimension, number> {
    if (dimension) {
      return this.collectiveResonance[dimension];
    }
    return { ...this.collectiveResonance };
  }

  private updateCollectiveResonance() {
    if (this.activeCores.size === 0) return;

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
    const avg =
      dimensions.reduce((acc, dim) => acc + this.collectiveResonance[dim], 0) / dimensions.length;
    console.log(
      `   [Omni-Network] Collective Resonance: ${(avg * 100).toFixed(2)}% | Nodes: ${this.activeCores.size}`
    );
  }

  /**
   * ⚡ [All is One] 播發覺醒 / Broadcast Awakening
   * --------------------------------------------------
   * [TC] 向網路播發覺醒火花，同步並提升所有節點的覺醒潛力。
   * [EN] Broadcasts an awakening spark to the network, synchronizing and
   *      boosting the awakening potential of all nodes.
   */
  public broadcastAwakening(sourceUuid: string) {
    this.broadcastLocalAwakening(sourceUuid);
    // Broadcast to other tabs
    omniSyncService.broadcast(OmniSyncEventType.AWAKENING_BROADCAST, { sourceUuid });
  }

  private broadcastLocalAwakening(sourceUuid: string) {
    console.log(
      `   [Omni-Network] ⚡ Awakening Spark from [${sourceUuid}]! Synchronizing network...`
    );

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
  public static attemptBreakthrough(
    attribute: string,
    currentValue: number,
    resonance: number = 0.5,
    dimension: OmniResonanceDimension = OmniResonanceDimension.AWARENESS
  ): BreakthroughResult {
    const networkEffect = OmniResonanceCore.getInstance().getGlobalResonance(dimension) as number;
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
  public static evolveSkill(skill: { id: string; name: string }, history: any[]): any[] {
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
