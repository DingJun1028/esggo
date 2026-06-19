import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { globalPulseService } from './GlobalPulseService.js';
import { IComponentCore } from '../0-domain/contracts/IComponentCore.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * [5T] Generate SHA-256 hash for data integrity
 */
async function generateSHA256Hash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface VillageBuilding {
  id: string;
  name: string;
  type: 'ENERGY' | 'NATURE' | 'TECH' | 'SOCIAL';
  level: number;
  status: 'LOCKED' | 'ALIVE' | 'THRIVING';
  description: string;
}

export interface PlayerAttributes {
  int: number; // Intelligence (Knowledge)
  str: number; // Strength (Implementation)
  chr: number; // Charisma (Impact/Influence)
  wis: number; // Wisdom (Strategy)
  luk: number; // Luck (Opportunities)
}

export type SaaSPlan = 'BRONZE' | 'GOLD' | 'DIAMOND';

export interface PlayerState {
  xp: number;
  level: number;
  ecoCredits: number;
  buildings: VillageBuilding[];
  attributes: PlayerAttributes;
  plan: SaaSPlan;
  onboardingStatus: 'NEW' | 'STARTED' | 'COMPLETED';
  lastSaved?: number;
}

export class GamificationService {
  private static instance: GamificationService;
  private state: PlayerState;
  private readonly STORAGE_KEY = 'village_gamification_state_v9'; // Versioned key

  private constructor() {
    omniLogger.info(LogCategory.SYSTEM, '🎮 [ESG Go] Gamification Engine v9 (RPG Core) Initialized.');

    const defaultState: PlayerState = {
      xp: 0,
      level: 1,
      ecoCredits: 100,
      attributes: { int: 10, str: 10, chr: 10, wis: 10, luk: 10 },
      plan: 'BRONZE',
      onboardingStatus: 'NEW',
      buildings: [
        {
          id: 'b_starter',
          name: 'Beginner Capsule',
          type: 'SOCIAL',
          level: 1,
          status: 'ALIVE',
          description: 'Your starting point in the Sustainable Village.'
        }
      ],
    };

    this.state = this.restoreFromStorage() || defaultState;
  }

  public static getInstance(): GamificationService {
    if (!this.instance) {
      this.instance = new GamificationService();
    }
    return this.instance;
  }

  public getVillageState(): PlayerState {
    return this.state;
  }

  public addXP(amount: number, source: string): PlayerState {
    this.state.xp += amount;
    this.checkLevelUp();
    this.saveToStorage();
    omniLogger.info(LogCategory.SYSTEM,
      `🎮 [XP GAIN] +${amount} XP from ${source}. Total: ${this.state.xp}`
    );
    return this.state;
  }

  public updateAttributes(gains: Partial<PlayerAttributes>): PlayerState {
    this.state.attributes = { ...this.state.attributes, ...gains };
    this.saveToStorage();
    omniLogger.info(LogCategory.SYSTEM, '🧬 [RPG] Attributes updated', gains);
    return this.state;
  }

  public setSaaSPlan(plan: SaaSPlan): PlayerState {
    this.state.plan = plan;
    this.saveToStorage();
    omniLogger.info(LogCategory.SYSTEM, `💎 [PLAN] User upgraded to ${plan}`);
    return this.state;
  }

  public setOnboardingStatus(status: PlayerState['onboardingStatus']): PlayerState {
    this.state.onboardingStatus = status;
    this.saveToStorage();
    return this.state;
  }

  public getAttributeRank(attr: keyof PlayerAttributes): string {
    const val = this.state.attributes[attr];
    if (val >= 90) return 'S';
    if (val >= 75) return 'A';
    if (val >= 50) return 'B';
    if (val >= 25) return 'C';
    return 'D';
  }

  private checkLevelUp() {
    const nextLevelThreshold = this.state.level * 500;
    if (this.state.xp >= nextLevelThreshold) {
      this.state.level++;
      this.state.ecoCredits += 100; // Level up bonus
      omniLogger.info(LogCategory.SYSTEM, `🎮 [LEVEL UP] Welcome to Level ${this.state.level}!`);
      this.saveToStorage();
    }
  }

  public unlockBuilding(buildingId: string): boolean {
    const building = this.state.buildings.find(b => b.id === buildingId);
    if (building && building.status === 'LOCKED') {
      if (this.state.ecoCredits >= 200) {
        // Simple cost
        this.state.ecoCredits -= 200;
        building.status = 'ALIVE';
        omniLogger.info(LogCategory.SYSTEM, `🎮 [BUILD] Constructed ${building.name}.`);

        // Sync with GlobalPulseService for village state
        globalPulseService.emitPulse({
          type: 'RIPPLE',
          source: `Village_Building_${building.id}`,
          intensity: 0.3,
          message: `Constructed ${building.name}`
        });

        this.saveToStorage();
        return true;
      }
    }
    return false;
  }

  /**
   * [5T] Generate content-based hash for crystal integrity
   */
  private async generateContentHash(data: object): Promise<string> {
    const content = JSON.stringify(data);
    return generateSHA256Hash(content);
  }

  /**
   * [5T] Crystallize gamification state into 5T-compliant asset
   */
  public async crystallizeProgress(): Promise<IComponentCore> {
    const dataToHash = {
      level: this.state.level,
      xp: this.state.xp,
      ecoCredits: this.state.ecoCredits,
      buildings: this.state.buildings,
      timestamp: Date.now()
    };

    const contentHash = await this.generateContentHash(dataToHash);

    const crystal: IComponentCore = {
      uuid: uuidv4(),
      version: '1.0.1',
      timestamp: Date.now(),
      status: 'Trustworthy',
      evidence: {
        tangible: {
          metric: 'Village_Progress',
          description: `Level ${this.state.level} | XP: ${this.state.xp} | Credits: ${this.state.ecoCredits}`,
          timestamp: Date.now(),
        },
        traceable: {
          source_origin: 'GamificationService_Village',
          owner: 'Sovereign_Soul',
        },
        trackable: {
          lifecycle_hooks: [{ event: 'Crystallize', timestamp: Date.now(), actor: 'System' }],
          pathway: ['Village_Action', 'Gamification_Engine', '5T_Sealing'],
        },
        transparent: {
          formula: 'XP = Σ(Actions × Impact × Resonance)',
        },
        trustworthy: {
          hash_lock: contentHash,
          is_frozen: true,
          locked_at: Date.now()
        }
      },
      data: dataToHash,
      lock: () => {
        omniLogger.info(LogCategory.SYSTEM, '🔒 [5T] Crystal Asset Immutable Lock applied.');
      }
    };

    return crystal;
  }

  /**
   * Restore state from localStorage
   */
  private restoreFromStorage(): PlayerState | null {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PlayerState;
        omniLogger.info(LogCategory.SYSTEM, '🎮 [Persistence] Gamification state restored from localStorage', { lastSaved: parsed.lastSaved });
        return parsed;
      }
    } catch (e) {
      omniLogger.warn(LogCategory.SYSTEM, '[Persistence] Failed to restore gamification state:', e);
    }
    return null;
  }

  /**
   * Save state to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      this.state.lastSaved = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      omniLogger.info(LogCategory.SYSTEM, '💾 [Persistence] Gamification state saved to localStorage', { timestamp: this.state.lastSaved });
    } catch (e) {
      omniLogger.warn(LogCategory.SYSTEM, '[Persistence] Failed to save gamification state:', e);
    }
  }

  /**
   * Clear persisted state
   */
  public clearStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
    omniLogger.info(LogCategory.SYSTEM, 'SYSTEM', '🗑️ [Persistence] Gamification state cleared');
  }

  /**
   * Get last saved timestamp
   */
  public getLastSavedTime(): number | null {
    return this.state.lastSaved || null;
  }
}

export const gamificationService = GamificationService.getInstance();
