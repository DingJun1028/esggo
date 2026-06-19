import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { PartnerAffinity, UserProfile } from '../types.js';

// Mock Data Storage for Demo
const STORAGE_KEY_AFFINITY = 'jak_affinity_data';

export interface InteractionResult {
  success: boolean;
  message: string;
  affinityGained: number;
  rewards?: {
    gsc?: number;
    items?: string[];
  };
}

export const PARTNER_IDS = {
  LINGOSTEP: 'p_lingostep',
  ESG_SUNSHINE: 'p_esg_sunshine',
  WANGDAO: 'p_wangdao',
  SAMWELLS: 'p_samwells',
  FREETIME: 'p_freetime',
};

class AffinityService {
  private affinityMap: Map<string, PartnerAffinity> = new Map();

  constructor() {
    this.loadAffinity();
  }

  private loadAffinity() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AFFINITY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.values(data).forEach((entry: any) => {
          this.affinityMap.set(entry.partnerId, entry);
        });
      } else {
        this.initializeDefaults();
      }
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, 'Log from affinityService', {
        data: ['Failed to load affinity data', e],
        source_origin: 'affinityService',
      });
      this.initializeDefaults();
    }
  }

  private initializeDefaults() {
    // Initialize with base affinity
    this.setAffinity(PARTNER_IDS.LINGOSTEP, {
      partnerId: PARTNER_IDS.LINGOSTEP,
      level: 1,
      currentExp: 0,
      maxExp: 100,
      history: [],
    });
    this.setAffinity(PARTNER_IDS.ESG_SUNSHINE, {
      partnerId: PARTNER_IDS.ESG_SUNSHINE,
      level: 1,
      currentExp: 20,
      maxExp: 100,
      history: [],
    });
    this.setAffinity(PARTNER_IDS.WANGDAO, {
      partnerId: PARTNER_IDS.WANGDAO,
      level: 2,
      currentExp: 50,
      maxExp: 200,
      history: [],
    });
    this.setAffinity(PARTNER_IDS.SAMWELLS, {
      partnerId: PARTNER_IDS.SAMWELLS,
      level: 1,
      currentExp: 0,
      maxExp: 100,
      history: [],
    });
    this.setAffinity(PARTNER_IDS.FREETIME, {
      partnerId: PARTNER_IDS.FREETIME,
      level: 1,
      currentExp: 10,
      maxExp: 100,
      history: [],
    });
    this.saveAffinity();
  }

  private setAffinity(partnerId: string, data: PartnerAffinity) {
    this.affinityMap.set(partnerId, data);
  }

  private saveAffinity() {
    try {
      const obj: Record<string, PartnerAffinity> = {};
      this.affinityMap.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem(STORAGE_KEY_AFFINITY, JSON.stringify(obj));
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, 'Log from affinityService', {
        data: ['Failed to save affinity', e],
        source_origin: 'affinityService',
      });
    }
  }

  public getAffinity(partnerId: string): PartnerAffinity | undefined {
    return this.affinityMap.get(partnerId);
  }

  public getAllAffinity(): PartnerAffinity[] {
    return Array.from(this.affinityMap.values());
  }

  // Interactions

  public performInteraction(
    partnerId: string,
    type: 'GIFT' | 'CHAT' | 'QUEST',
    params?: any
  ): InteractionResult {
    const affinity = this.getAffinity(partnerId);
    if (!affinity) return { success: false, message: 'Partner not found', affinityGained: 0 };

    let gained = 0;
    let message = '';
    let rewards = {};

    switch (type) {
      case 'CHAT':
        gained = 5;
        message = 'You had a great conversation! The emotional bond deepened.';
        break;
      case 'GIFT':
        // Assume params.cost exists and user paid (handled in UI for mock)
        const giftValue = params?.value || 10;
        gained = giftValue * 2;
        message = `You gave a gift! The other person seems to like it (+${gained} Affinity)`;
        break;
      case 'QUEST':
        gained = 20;
        message = 'Partner mission completed! Trust has significantly increased.';
        rewards = { gsc: 100 };
        break;
    }

    this.addExperience(partnerId, gained);
    return { success: true, message, affinityGained: gained, rewards };
  }

  private addExperience(partnerId: string, amount: number) {
    const affinity = this.affinityMap.get(partnerId);
    if (!affinity) return;

    affinity.currentExp += amount;
    if (affinity.currentExp >= affinity.maxExp) {
      affinity.level += 1;
      affinity.currentExp -= affinity.maxExp;
      affinity.maxExp = Math.floor(affinity.maxExp * 1.5);
      // Unlock event could trigger here
    }

    // Add history
    affinity.history.push({
      date: new Date().toISOString(),
      action: 'INTERACTION', // Simplified
      change: amount,
    });

    this.saveAffinity();
  }
}

export const affinityService = new AffinityService();
