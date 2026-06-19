import { saveToEvidenceVault } from "./ncbdb";
import { ZKPrivacyEngine } from "./zk-privacy-engine";

/**
 * External System Adapter v1.0
 * 
 * Simulated API connectors for ERP (Environmental) and HR (Social) systems.
 * Supports the 5T Protocol by automatically sealing fetched data into the Evidence Vault.
 */

export interface ExternalDataPoint {
    system: 'ERP' | 'HR';
    indicator: string;
    value: number;
    unit: string;
    period: string;
    timestamp: number;
}

const MOCK_ERP_DB: Record<string, ExternalDataPoint> = {
    "2026-Q1-ELEC": {
        system: 'ERP',
        indicator: "Electricity Consumption",
        value: 125430.5,
        unit: "kWh",
        period: "2026-Q1",
        timestamp: Date.now() - 86400000 * 5,
    },
    "2026-Q1-WATER": {
        system: 'ERP',
        indicator: "Water Consumption",
        value: 842.1,
        unit: "m3",
        period: "2026-Q1",
        timestamp: Date.now() - 86400000 * 4,
    }
};

const MOCK_HR_DB: Record<string, ExternalDataPoint> = {
    "2026-Q1-EMP": {
        system: 'HR',
        indicator: "Total Employees",
        value: 452,
        unit: "count",
        period: "2026-Q1",
        timestamp: Date.now() - 86400000 * 10,
    },
    "2026-Q1-TRAIN": {
        system: 'HR',
        indicator: "Avg Training Hours",
        value: 24.5,
        unit: "hours/employee",
        period: "2026-Q1",
        timestamp: Date.now() - 86400000 * 8,
    }
};

export class ExternalAdapter {
    /**
     * Simulated ERP API Call
     */
    static async fetchErp(key: string): Promise<ExternalDataPoint | null> {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 1200));
        return MOCK_ERP_DB[key] || null;
    }

    /**
     * Simulated HR API Call
     */
    static async fetchHr(key: string): Promise<ExternalDataPoint | null> {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 1000));
        return MOCK_HR_DB[key] || null;
    }

    /**
     * Sync and Seal: Fetches from External API and seals into Evidence Vault
     */
    static async syncAndSeal(system: 'ERP' | 'HR', key: string, privacyLevel: 'L1' | 'L2' | 'L3' = 'L2') {
        const data = system === 'ERP' ? await this.fetchErp(key) : await this.fetchHr(key);
        if (!data) throw new Error(`Source data for ${key} not found in ${system}`);

        // 1. ZKP Masking
        const masked = ZKPrivacyEngine.process(data.value, privacyLevel);

        // 2. Wrap in 5T + ZKP Entry
        const entry = {
            id: `ext_${data.system}_${Date.now()}`,
            description: `${data.system} Source Data: ${data.indicator} (${data.period})`,
            publicTrack: {
                maskedValue: masked.maskedValue,
                zkProof: masked.zkProof,
                level: privacyLevel,
                timestamp: Date.now(),
            }
        };

        // 3. Seal into Evidence Vault (NCBDB)
        const sealed = await saveToEvidenceVault(entry, JSON.stringify(data));
        return sealed;
    }
}
