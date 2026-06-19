import { IOmniKPI, IOmniAtom } from './omni-types';
import { OmniOne } from './omni-one';
import { omniLogger, LogCategory } from './omniLogger';
// import * as crypto from 'crypto'; // Removed for browser compatibility

/**
 * 📊 OmniKPI: Quantitative Metric Measurement
 * "What gets measured, gets sentient"
 */
export class OmniKPI {
    private static instance: OmniKPI;
    private kpis: Map<string, IOmniKPI> = new Map();

    private constructor() { }

    public static getInstance(): OmniKPI {
        if (!OmniKPI.instance) {
            OmniKPI.instance = new OmniKPI();
        }
        return OmniKPI.instance;
    }

    /**
     * 📏 Register: Initialize a new KPI tracker.
     */
    public async registerKPI(data: Omit<IOmniKPI, 'uuid' | 'lastMeasured' | 'trend'>): Promise<IOmniKPI> {
        const uuid = `kpi-${Math.random().toString(36).slice(2, 11)}`;
        const kpi: IOmniKPI = {
            ...data,
            uuid,
            lastMeasured: Date.now(),
            trend: 'Stable'
        };

        this.kpis.set(uuid, kpi);
        omniLogger.info(LogCategory.SYSTEM, `OmniKPI: KPI Registered - ${kpi.name} [${uuid}]`);

        return kpi;
    }

    /**
     * ⚡ Measure: Update KPI with a new value and trigger 5T check.
     */
    public async measure(uuid: string, value: number): Promise<IOmniKPI> {
        const kpi = this.kpis.get(uuid);
        if (!kpi) throw new Error(`KPI not found: ${uuid}`);

        const prevValue = kpi.value;
        kpi.value = value;
        kpi.trend = value > prevValue ? 'Improving' : value < prevValue ? 'Declining' : 'Stable';
        kpi.lastMeasured = Date.now();

        // 🚨 Guard Check
        if (value <= kpi.thresholds.critical) {
            omniLogger.warn(LogCategory.SYSTEM, `🚨 OmniKPI CRITICAL: ${kpi.name} reached ${value}${kpi.unit}`);
        }

        // Trace measurement as an Intelligence Atom
        await OmniOne.manifest({
            intent: `KPI_MEASUREMENT: ${kpi.name}`,
            type: 'Intelligence',
            payload: { uuid: kpi.uuid, value, trend: kpi.trend },
            domainRef: 'Operational_Excellence'
        });

        return kpi;
    }

    public getKPI(uuid: string): IOmniKPI | undefined {
        return this.kpis.get(uuid);
    }
}
