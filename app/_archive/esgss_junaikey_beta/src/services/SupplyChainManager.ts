/**
 * 🔗 SupplyChainManager: Unity Bridge & Partner Registry
 * --------------------------------------------------
 * Manages cross-organizational ESG data exchange and multi-tier tracking.
 * Implements the "Unity Bridge" protocol for Scope 3 emissions.
 */

import { IComponentCore } from '../types/esgss_schema.js';
import { bidirectionalSyncService } from './bidirectionalSync.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { InfoOneCore } from '@/omni/core/InfoOneCore.js';
import { GeminiService } from './ai/GeminiService.js';
import { v4 as uuidv4 } from 'uuid';

export interface Supplier {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  category: 'Logistics' | 'Manufacturing' | 'Energy' | 'Software';
  location: string;
  integrityScore: number;
  carbonIntensity: number; // tCO2e / $1M revenue
  syncStatus: 'stable' | 'warning' | 'disconnected';
  lastAuditAt: string;
  isCompliance5T: boolean;
  dataModel?: IComponentCore;
}

const HIGH_SCORE_THRESHOLD = 80;

export class SupplyChainManager {
  private static instance: SupplyChainManager;
  private suppliers: Supplier[] = [];
  private gemini: GeminiService;

  private constructor() {
    this.gemini = GeminiService.getInstance();
    this.initializeMockSuppliers();
  }

  static getInstance(): SupplyChainManager {
    if (!SupplyChainManager.instance) {
      SupplyChainManager.instance = new SupplyChainManager();
    }
    return SupplyChainManager.instance;
  }

  private createSupplierCore(
    id: string,
    name: string,
    score: number,
    carbon: number,
    category: string
  ): IComponentCore {
    const core = new InfoOneCore({
      uuid: `UCC-${id}`,
      version: '2.4.0',
      timestamp: Date.now(),
      formula: 'ISO-14064-1:Scope3',
      impactMetric: `${carbon} tCO2e`,
      evidence: {
        tangible: {
          metric: 'Carbon Footprint',
          visual_grade: score > HIGH_SCORE_THRESHOLD ? 'SOVEREIGN' : 'GOLD',
          glow_intensity: score,
        },
        traceable: {
          source_origin: `Partner Portal: ${name}`,
          verification_links: [`https://verify.goodward.com/partner/${id}`],
        },
        trackable: {
          lifecycle_hooks: [{ event: 'created', timestamp: Date.now(), actor: 'Unity Bridge' }],
          pathway: ['Source Extraction', 'Material Processing', 'Final Assembly'],
        },
        transparent: {
          formula: 'E = Activity Data * Emission Factor',
          validation_standard: 'GHG Protocol',
        },
        trustworthy: {
          hash_lock: '',
          is_frozen: false,
        },
      },
    });
    core.lock();
    return core;
  }

  private initializeMockSuppliers() {
    const s1 = {
      id: 'SUP-001',
      name: 'Nexus Electronics',
      tier: 1 as const,
      category: 'Manufacturing' as const,
      location: 'Shenzhen, CN',
      integrityScore: 92,
      carbonIntensity: 120,
      syncStatus: 'stable' as const,
      lastAuditAt: new Date().toISOString(),
      isCompliance5T: true,
    };

    const s2 = {
      id: 'SUP-002',
      name: 'GreenLogistics Global',
      tier: 1 as const,
      category: 'Logistics' as const,
      location: 'Rotterdam, NL',
      integrityScore: 85,
      carbonIntensity: 350,
      syncStatus: 'stable' as const,
      lastAuditAt: new Date().toISOString(),
      isCompliance5T: true,
    };

    const s3 = {
      id: 'SUP-003',
      name: 'Titanium Castings Ltd',
      tier: 2 as const,
      category: 'Manufacturing' as const,
      location: 'Bhubaneswar, IN',
      integrityScore: 64,
      carbonIntensity: 890,
      syncStatus: 'warning' as const,
      lastAuditAt: new Date().toISOString(),
      isCompliance5T: false,
    };

    this.suppliers = [
      {
        ...s1,
        dataModel: this.createSupplierCore(
          s1.id,
          s1.name,
          s1.integrityScore,
          s1.carbonIntensity,
          s1.category
        ),
      },
      {
        ...s2,
        dataModel: this.createSupplierCore(
          s2.id,
          s2.name,
          s2.integrityScore,
          s2.carbonIntensity,
          s2.category
        ),
      },
      {
        ...s3,
        dataModel: this.createSupplierCore(
          s3.id,
          s3.name,
          s3.integrityScore,
          s3.carbonIntensity,
          s3.category
        ),
      },
    ];
  }

  public getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public async syncPartnerData(supplierId: string): Promise<boolean> {
    omniLogger.info(LogCategory.DATA, `Bridging data for supplier: ${supplierId}`);
    const success = await bidirectionalSyncService.executeBridgeSync(`${supplierId}_bridge`);

    if (success) {
      const supplier = this.suppliers.find(s => s.id === supplierId);
      if (supplier) {
        supplier.lastAuditAt = new Date().toISOString();
        supplier.syncStatus = 'stable';
      }
    }
    return success;
  }

  public calculateScope3Emissions(): { total: number; breakdown: Record<string, number> } {
    let total = 0;
    const breakdown: Record<string, number> = {};

    this.suppliers.forEach(s => {
      total += s.carbonIntensity;
      breakdown[s.category] = (breakdown[s.category] || 0) + s.carbonIntensity;
    });

    return { total, breakdown };
  }

  public getAtRiskPartners(): Supplier[] {
    return this.suppliers.filter(s => s.integrityScore < 70 || !s.isCompliance5T);
  }

  /**
   * 🏭 AI Supplier Discovery
   * Finds or generates potential suppliers based on ESG criteria.
   */
  public async discoverSuppliers(category: string): Promise<Supplier[]> {
    const prompt = `Generate a list of 3 realistic but fictional suppliers for the category: ${category}. 
    Include name, location, a realistic ESG score (0-100), and a primary ESG risk.`;

    const schema = `Array<{ name: string, location: string, esgScore: number, primaryRisk: string }>`;

    try {
      const aiSuppliers = await this.gemini.generateStructuredData<any[]>(prompt, schema);

      if (!aiSuppliers) throw new Error('AI failed to generate suppliers');

      const discovered = aiSuppliers.map(s => {
        const id = `SUP-${uuidv4().slice(0, 8)}`;
        const carbonIntensity = Math.floor(Math.random() * 500) + 50;
        return {
          id,
          name: s.name,
          tier: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
          category: category as any,
          location: s.location,
          integrityScore: s.esgScore,
          carbonIntensity,
          syncStatus: 'stable' as const,
          lastAuditAt: new Date().toISOString(),
          isCompliance5T: s.esgScore > 80,
          dataModel: this.createSupplierCore(id, s.name, s.esgScore, carbonIntensity, category),
        };
      });

      return discovered;
    } catch (e) {
      omniLogger.error(LogCategory.AI, `AI Discovery failed for category: ${category}`);
      return [];
    }
  }

  public addSuppliers(newSuppliers: Supplier[]) {
    this.suppliers = [...this.suppliers, ...newSuppliers];
    omniLogger.info(
      LogCategory.DATA,
      `Added ${newSuppliers.length} discovered partners to registry.`
    );
  }
}

export const supplyChainManager = SupplyChainManager.getInstance();
