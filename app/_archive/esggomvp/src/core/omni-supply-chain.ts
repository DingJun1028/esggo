/**
 * 🔗 Omni Supply Chain Manager
 * 供應鏈管理與永續性追蹤
 * 
 * 職責：
 * - 管理供應商網絡
 * - 追蹤供應鏈碳足跡
 * - 評估供應商 ESG 表現
 * - 識別供應鏈風險
 */

import { v4 as uuidv4 } from 'uuid';

export type SupplierTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';
export type SupplierRating = 'A' | 'B' | 'C' | 'D' | 'F';

export interface ISupplier {
    id: string;
    name: string;
    tier: SupplierTier;
    location: {
        country: string;
        region: string;
    };
    category: string;
    esgRating?: SupplierRating;
    carbonFootprint?: number; // tonnes CO2e
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    certifications: string[];
    contact: {
        email: string;
        phone?: string;
    };
    createdAt: number;
    updatedAt: number;
}

export interface ISupplyChainMetrics {
    totalSuppliers: number;
    averageEsgScore: number;
    totalCarbonFootprint: number;
    riskDistribution: Record<string, number>;
    tierDistribution: Record<string, number>;
}

export interface ISupplyChainRisk {
    id: string;
    type: 'climate' | 'geopolitical' | 'financial' | 'compliance' | 'operational';
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedSuppliers: string[];
    description: string;
    mitigation?: string;
    detectedAt: number;
}

/**
 * 供應鏈風險評估器
 */
class SupplyChainRiskEngine {
    /**
     * 評估供應商風險
     */
    static assessSupplierRisk(supplier: ISupplier): 'low' | 'medium' | 'high' | 'critical' {
        let riskScore = 0;

        // 基於 tier 評估
        if (supplier.tier === 'tier3' || supplier.tier === 'tier4') {
            riskScore += 2;
        } else if (supplier.tier === 'tier2') {
            riskScore += 1;
        }

        // 基於位置
        const highRiskCountries = ['CN', 'IN', 'BR', 'RU', 'UA'];
        if (highRiskCountries.includes(supplier.location.country)) {
            riskScore += 2;
        }

        // 基於 ESG 評級
        if (supplier.esgRating === 'F') {
            riskScore += 3;
        } else if (supplier.esgRating === 'D') {
            riskScore += 2;
        } else if (supplier.esgRating === 'C') {
            riskScore += 1;
        }

        // 基於認證
        if (supplier.certifications.length === 0) {
            riskScore += 2;
        }

        // 轉換為風險等級
        if (riskScore >= 6) return 'critical';
        if (riskScore >= 4) return 'high';
        if (riskScore >= 2) return 'medium';
        return 'low';
    }

    /**
     * 檢測供應鏈風險
     */
    static detectRisks(suppliers: ISupplier[]): ISupplyChainRisk[] {
        const risks: ISupplyChainRisk[] = [];

        // 檢查地理集中度風險
        const locationGroups = suppliers.reduce((acc, s) => {
            acc[s.location.country] = (acc[s.location.country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        Object.entries(locationGroups).forEach(([country, count]) => {
            if (count > suppliers.length * 0.5) {
                risks.push({
                    id: uuidv4(),
                    type: 'geopolitical',
                    severity: 'high',
                    affectedSuppliers: suppliers.filter(s => s.location.country === country).map(s => s.id),
                    description: `過度依賴 ${country} 供應商 (${count}/${suppliers.length})`,
                    mitigation: '考慮多元化供應來源',
                    detectedAt: Date.now()
                });
            }
        });

        // 檢查 ESG 風險
        const lowRated = suppliers.filter(s => 
            s.esgRating === 'D' || s.esgRating === 'F' || !s.esgRating
        );
        if (lowRated.length > suppliers.length * 0.3) {
            risks.push({
                id: uuidv4(),
                type: 'compliance',
                severity: 'medium',
                affectedSuppliers: lowRated.map(s => s.id),
                description: `${lowRated.length} 個供應商 ESG 評級較低`,
                mitigation: '要求供應商改善 ESG 表現',
                detectedAt: Date.now()
            });
        }

        // 檢查碳足跡風險
        const highCarbon = suppliers.filter(s => (s.carbonFootprint || 0) > 1000);
        if (highCarbon.length > 0) {
            risks.push({
                id: uuidv4(),
                type: 'climate',
                severity: 'medium',
                affectedSuppliers: highCarbon.map(s => s.id),
                description: `${highCarbon.length} 個供應商碳足跡較高`,
                mitigation: '鼓勵供應商設定減排目標',
                detectedAt: Date.now()
            });
        }

        return risks;
    }
}

/**
 * Omni Supply Chain Manager 主類別
 */
export class OmniSupplyChainManager {
    private static instance: OmniSupplyChainManager;
    private suppliers: Map<string, ISupplier> = new Map();
    private risks: Map<string, ISupplyChainRisk> = new Map();

    private constructor() {}

    static getInstance(): OmniSupplyChainManager {
        if (!OmniSupplyChainManager.instance) {
            OmniSupplyChainManager.instance = new OmniSupplyChainManager();
        }
        return OmniSupplyChainManager.instance;
    }

    /**
     * 添加供應商
     */
    addSupplier(supplierData: Omit<ISupplier, 'id' | 'createdAt' | 'updatedAt' | 'riskLevel'>): ISupplier {
        const id = uuidv4();
        const now = Date.now();
        
        const supplier: ISupplier = {
            ...supplierData,
            id,
            riskLevel: SupplyChainRiskEngine.assessSupplierRisk(supplierData as ISupplier),
            createdAt: now,
            updatedAt: now
        };

        this.suppliers.set(id, supplier);
        
        // 重新評估風險
        this.refreshRisks();

        return supplier;
    }

    /**
     * 更新供應商
     */
    updateSupplier(id: string, updates: Partial<ISupplier>): ISupplier | null {
        const supplier = this.suppliers.get(id);
        if (!supplier) return null;

        const updated: ISupplier = {
            ...supplier,
            ...updates,
            updatedAt: Date.now()
        };

        // 重新評估風險
        updated.riskLevel = SupplyChainRiskEngine.assessSupplierRisk(updated);

        this.suppliers.set(id, updated);
        
        // 重新評估風險
        this.refreshRisks();

        return updated;
    }

    /**
     * 刪除供應商
     */
    deleteSupplier(id: string): boolean {
        const result = this.suppliers.delete(id);
        if (result) {
            this.refreshRisks();
        }
        return result;
    }

    /**
     * 獲取供應商
     */
    getSupplier(id: string): ISupplier | undefined {
        return this.suppliers.get(id);
    }

    /**
     * 獲取所有供應商
     */
    getAllSuppliers(tier?: SupplierTier): ISupplier[] {
        const all = Array.from(this.suppliers.values());
        if (tier) {
            return all.filter(s => s.tier === tier);
        }
        return all;
    }

    /**
     * 刷新風險評估
     */
    private refreshRisks(): void {
        const suppliers = Array.from(this.suppliers.values());
        const newRisks = SupplyChainRiskEngine.detectRisks(suppliers);
        
        this.risks.clear();
        newRisks.forEach(r => this.risks.set(r.id, r));
    }

    /**
     * 獲取風險
     */
    getRisks(severity?: ISupplyChainRisk['severity']): ISupplyChainRisk[] {
        const all = Array.from(this.risks.values());
        if (severity) {
            return all.filter(r => r.severity === severity);
        }
        return all;
    }

    /**
     * 獲取供應鏈指標
     */
    getMetrics(): ISupplyChainMetrics {
        const suppliers = Array.from(this.suppliers.values());

        const tierDist = suppliers.reduce((acc, s) => {
            acc[s.tier] = (acc[s.tier] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const riskDist = suppliers.reduce((acc, s) => {
            acc[s.riskLevel] = (acc[s.riskLevel] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // 計算平均 ESG 分數
        const ratedSuppliers = suppliers.filter(s => s.esgRating);
        const ratingMap: Record<SupplierRating, number> = { 'A': 90, 'B': 75, 'C': 60, 'D': 40, 'F': 20 };
        const avgScore = ratedSuppliers.length > 0
            ? ratedSuppliers.reduce((acc, s) => acc + (ratingMap[s.esgRating!] || 50), 0) / ratedSuppliers.length
            : 0;

        return {
            totalSuppliers: suppliers.length,
            averageEsgScore: avgScore,
            totalCarbonFootprint: suppliers.reduce((acc, s) => acc + (s.carbonFootprint || 0), 0),
            riskDistribution: riskDist,
            tierDistribution: tierDist
        };
    }

    /**
     * 搜索供應商
     */
    searchSuppliers(query: string): ISupplier[] {
        const q = query.toLowerCase();
        return Array.from(this.suppliers.values()).filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.location.country.toLowerCase().includes(q)
        );
    }

    /**
     * 獲取高風險供應商
     */
    getHighRiskSuppliers(): ISupplier[] {
        return Array.from(this.suppliers.values())
            .filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical')
            .sort((a, b) => {
                const order = { critical: 0, high: 1, medium: 2, low: 3 };
                return order[a.riskLevel] - order[b.riskLevel];
            });
    }
}

export default OmniSupplyChainManager;
