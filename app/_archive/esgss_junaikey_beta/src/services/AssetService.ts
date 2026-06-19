import { v4 as uuidv4 } from 'uuid';
import { IComponentCore, IImpactAsset } from '../types/core.js';
import { GeminiService } from './ai/GeminiService.js';
import { OmniStore, OmniNamespace } from './OmniStore.js';
import { GoodwardLogicGate } from '../omni/core/GoodwardCore.js';
import { createServiceLogger } from '../utils/logger.js';

const logger = createServiceLogger('AssetService');

export class AssetService {
  private static readonly ASSET_LIST_KEY = 'impact_assets';

  // CORE generation (private method) - Now powered by Goodward Logic Engine
  private static generateCore(
    origin: string,
    verifier: string
  ): Omit<IImpactAsset<any>, 'asset_type' | 'gold_weight'> {
    // 1. Prepare 5T Evidence
    const evidence = {
      tangible: {
        metric: 'GOLD_STANDARD',
        visual_grade: 'GOLD' as const,
      },
      traceable: {
        source_origin: origin,
        verification_links: [],
      },
      trackable: {
        lifecycle_hooks: [{ event: 'created', timestamp: Date.now(), actor: verifier }],
        pathway: ['AwakenedFactory', 'ComponentCore', 'GoodwardGate'],
      },
      transparent: {
        formula: 'Verified By Logic Engine Alpha',
        validation_standard: 'EternalProtocol-v1',
      },
    };

    // 2. Crystallize via Logic Gate (Enforce 5T + Hashing)
    const core = GoodwardLogicGate.crystallize({
      evidence,
      data: {}, // Default empty, usually overridden by specific asset data
    });

    // 3. Return as ImpactAsset partial
    return {
      ...core,
      meridian: 'OMNI_CENTRAL',
      virtues: {
        intelligence: 7,
        benevolence: 8,
        integrity: 10, // Max integrity for Goodward assets
        courage: 7,
        temperance: 8,
        harmony: 9,
      },
      data: {}, // Placeholder
    } as any;
  }

  // Get strategic assets list (Prefer persistent storage, otherwise dynamic generation)
  public static async getStrategicAssets(): Promise<any[]> {
    // 1. Attempt to load from OmniStore
    const result = OmniStore.getItem<any[]>(OmniNamespace.ASSET, this.ASSET_LIST_KEY);
    if (result.success && result.data && result.data.length > 0) {
      logger.info('🌌 Loaded assets from OmniStore', { count: result.data.length });
      return result.data;
    }

    try {
      logger.info('🌌 No assets in store, attempting Real Awakening via Gemini...');
      const dynamic = await this.generateDynamicAssets(3);
      if (dynamic && dynamic.length > 0) {
        // Save to store
        this.saveAssets(dynamic);
        return dynamic;
      }
    } catch (e) {
      logger.warn('⚠️ Real Awakening failed, falling back to sentinel baseline.');
    }

    const fallback = [
      {
        ...this.generateCore('[TSMC] Scope 3 Supplier Data', 'AI Auditor Alpha'),
        asset_type: 'CARBON_CREDIT',
        data: { supplier: 'Chip-Tech Co.', emission: 12500, unit: 'tCO2e' },
        current_state: 'CALCULABLE',
        formula_reference: '$E = \\sum (Activity \\times Factor)$',
        gold_weight: 75,
      },
      {
        ...this.generateCore('[ImpactNexus] Certification Node', 'Consensus Ledger'),
        asset_type: 'GOVERNANCE_TOKEN',
        data: { tier: 'GOLD', holder: 'ESG Sunshine' },
        current_state: 'IMMUTABLE',
        formula_reference: 'N/A (Genesis Block)',
        gold_weight: 100,
      },
    ];

    this.saveAssets(fallback);
    return fallback;
  }

  // 🌟 (Real Awakening) Dynamic Generation
  public static async generateDynamicAssets(count: number = 2): Promise<any[]> {
    try {
      const gemini = GeminiService.getInstance();

      const assets = [];
      for (let i = 0; i < count; i++) {
        const prompt = `Generate a realistic ESG asset data JSON (supplier emission or governance token). Return strictly JSON.`;
        const aiData = await gemini.generateStructuredData<any>(
          prompt,
          '{ asset_type: string, data: any, origin: string, verifier: string }'
        );

        if (aiData) {
          assets.push({
            ...this.generateCore(aiData.origin || '[AI] Generated', aiData.verifier || 'OmniMind'),
            ...aiData,
            gold_weight: Math.floor(Math.random() * 100),
          });
        }
      }

      if (assets.length > 0) return assets;
      throw new Error('AI generation yielded empty.');
    } catch (e) {
      logger.error('🔥 AI Generation Failed', e as Error);
      throw e;
    }
  }

  // Persist assets to storage
  public static saveAssets(assets: any[]): boolean {
    const res = OmniStore.setItem(OmniNamespace.ASSET, this.ASSET_LIST_KEY, assets);
    return res.success;
  }

  // Clear storage (reset)
  public static clearState(): void {
    OmniStore.removeItem(OmniNamespace.ASSET, this.ASSET_LIST_KEY);
  }
}
