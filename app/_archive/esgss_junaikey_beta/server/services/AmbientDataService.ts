import { omniLogger, LogCategory } from './omni/infrastructure/logging/OmniLogger.js';
import { OmniComponentCoreFactory } from './OmniComponentCore.js';
import { EventEmitter } from 'events';
import { supabase } from '../db/supabaseClient.js';
import dotenv from 'dotenv';

dotenv.config();

export interface AmbientMeasurement {
    type: 'Electricity' | 'Water' | 'HVAC' | 'Logistics' | 'CarbonEmission' | 'SocialSentiment';
    value: number;
    unit: string;
    timestamp: number;
    sensorId: string;
    isAnomaly?: boolean;
    location?: string;
}

/**
 * Phase 20/45: Ambient AI Ingestion (Production Ready)
 * Handles simulated IoT data streams and persists them to ESGSS Database.
 */
export class AmbientDataService extends EventEmitter {
    private ssotCore;
    private interval: NodeJS.Timeout | null = null;
    private anomalyChance: number = 0.05; // 5% chance

    constructor() {
        super();
        this.ssotCore = OmniComponentCoreFactory.create({
            sourceOrigin: 'Ambient Sensor Grid v2.1.0-Reliable',
            rawDataPath: '/vault/ambient/sensor-flux.json',
            verificationMethod: 'Deep-Stream Consciousness',
        });

        omniLogger.info(LogCategory.SYSTEM, 'Ambient Data Ingestion Service v2.1 (Supabase-Connected) initialized.');
    }

    public startSimulation() {
        if (this.interval) return;

        omniLogger.info(LogCategory.SYSTEM, 'Starting Ambient Sensor Simulation Loop...');
        this.interval = setInterval(async () => {
            const measurement = this.generateMockMeasurement();
            this.emit('measurement', measurement);

            // Persist to DB (Reliability Layer Ingestion)
            await this.persistReading(measurement);

            if (measurement.isAnomaly) {
                omniLogger.warn(LogCategory.SYSTEM, `Anomaly Detected in ${measurement.type}: ${measurement.value}${measurement.unit}`);
                this.emit('anomaly', measurement);
            }
        }, 5000); // Pulse every 5 seconds
    }

    public stopSimulation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            omniLogger.info(LogCategory.SYSTEM, 'Ambient Sensor Simulation Stopped.');
        }
    }

    private async persistReading(m: AmbientMeasurement) {
        try {
            const { error } = await supabase
                .from('sensor_readings')
                .insert({
                    sensor_id: m.sensorId,
                    type: 'internal',
                    reading_type: m.type,
                    value: m.value,
                    unit: m.unit,
                    is_anomaly: m.isAnomaly || false,
                    location: m.location || 'Zone-A',
                    metadata: { simulation_version: '2.1' },
                    timestamp: new Date(m.timestamp).toISOString() // Convert to ISO for timestamptz
                });

            if (error) {
                // Gracefully handle RLS policy errors - don't fail the entire service
                if (error.code === '42501') {
                    omniLogger.warn(LogCategory.SYSTEM, `RLS Policy blocked sensor_readings insert for ${m.sensorId}. Data retained in memory buffer.`);
                    // Optionally store in memory buffer as fallback
                    this.memoryBuffer = this.memoryBuffer || [];
                    this.memoryBuffer.push({ ...m, persisted: false });
                    return;
                }
                throw error;
            }

        } catch (err: any) {
            // Only log non-RLS errors as errors
            if (err.code !== '42501') {
                console.error('Failed to persist ambient reading:', err);
                omniLogger.error(LogCategory.SYSTEM, 'DB Persistence Failed', err);
            }
        }
    }

    // Memory buffer fallback for when DB is unavailable
    private memoryBuffer: (AmbientMeasurement & { persisted: boolean })[] = [];

    public getMemoryBuffer() {
        return this.memoryBuffer;
    }

    public calibrate() {
        omniLogger.info(LogCategory.SYSTEM, 'Initiating software-defined sensor calibration...');
        const originalChance = this.anomalyChance;
        this.anomalyChance = 0.00; // Zero anomalies during calibration

        setTimeout(() => {
            this.anomalyChance = originalChance;
            omniLogger.info(LogCategory.SYSTEM, 'Sensor calibration cycle complete. Baseline restored.');
        }, 30000);

        this.emit('calibrated', { timestamp: Date.now() });
    }

    private generateMockMeasurement(): AmbientMeasurement {
        const types: AmbientMeasurement['type'][] = [
            'Electricity', 'Water', 'HVAC', 'Logistics', 'CarbonEmission', 'SocialSentiment'
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        const isAnomaly = Math.random() < this.anomalyChance;

        let value = 0;
        let unit = '';

        switch (type) {
            case 'Electricity': value = Math.random() * 50 + 10; unit = 'kWh'; break;
            case 'Water': value = Math.random() * 10 + 2; unit = 'm3'; break;
            case 'HVAC': value = 18 + Math.random() * 10; unit = 'C'; break;
            case 'Logistics': value = Math.random() * 100; unit = 'km'; break;
            case 'CarbonEmission': value = Math.random() * 20 + 5; unit = 'kgCO2e'; break;
            case 'SocialSentiment': value = 0.5 + Math.random() * 0.5; unit = 'resonance'; break;
        }

        if (isAnomaly) value *= 3; // Clear spike

        return {
            type,
            value,
            unit,
            timestamp: Date.now(),
            sensorId: `SN-${Math.floor(Math.random() * 50).toString().padStart(4, '0')}`, // Smaller pool of sensors to simulate realistic clusters
            isAnomaly,
            location: isAnomaly ? 'Critical-Zone' : 'Standard-Zone'
        };
    }

    public getLiveFlux(): AmbientMeasurement[] {
        return [this.generateMockMeasurement(), this.generateMockMeasurement()];
    }
}

export const ambientDataService = new AmbientDataService();
// Auto-start only if not imported as a test module
if (process.env.NODE_ENV !== 'test') {
    ambientDataService.startSimulation();
}
