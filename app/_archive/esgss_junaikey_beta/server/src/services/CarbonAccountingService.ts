/**
 * CarbonAccountingService.ts
 * --------------------------
 * 溫室氣體盤查核心服務 (ISO 14064-1)
 */

import crypto from 'crypto';

export interface CarbonRecord {
    id: string;
    companyId: string;
    scope: '1' | '2' | '3';
    category: string;
    activityValue: number;
    unit: string;
    factor: number;
    tco2e: number;
    evidenceId?: string;
    status: 'Draft' | 'Verified' | 'Trustworthy';
    hashLock?: string;
    timestamp: number;
}

export class CarbonAccountingService {
    private static instance: CarbonAccountingService;

    // Mock Factors Table
    private readonly emissionFactors: Record<string, number> = {
        'electricity_tw_2023': 0.495, // kgCO2e/kWh
        'gasoline_l': 2.36,          // kgCO2e/L
        'diesel_l': 2.66,            // kgCO2e/L
        'water_m3': 0.16             // kgCO2e/m3
    };

    static getInstance(): CarbonAccountingService {
        if (!CarbonAccountingService.instance) {
            CarbonAccountingService.instance = new CarbonAccountingService();
        }
        return CarbonAccountingService.instance;
    }

    /**
     * 計算排放量
     */
    calculateEmission(value: number, factorKey: string): number {
        const factor = this.emissionFactors[factorKey] || 0;
        return (value * factor) / 1000; // Convert kg to tonnes
    }

    /**
     * 鎖定數據 (Crystallize to Trustworthy)
     */
    async lockRecord(record: CarbonRecord): Promise<CarbonRecord> {
        if (record.status === 'Trustworthy') return record;

        const dataToHash = JSON.stringify({
            id: record.id,
            val: record.activityValue,
            tco2e: record.tco2e,
            evidence: record.evidenceId
        });

        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        return {
            ...record,
            status: 'Trustworthy',
            hashLock: hash,
            timestamp: Date.now()
        };
    }

    /**
     * 獲取排放熱點 (Top 3)
     */
    getHotspots(records: CarbonRecord[]): { category: string, value: number }[] {
        const categoryTotals: Record<string, number> = {};
        records.forEach(r => {
            categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.tco2e;
        });

        return Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([category, value]) => ({ category, value }));
    }
}

export const carbonAccountingService = CarbonAccountingService.getInstance();
