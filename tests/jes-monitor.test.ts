import { describe, it, expect, beforeEach } from 'vitest';
import { JESMonitor } from '../lib/jes-monitor';

describe('JESMonitor (Energy Flow Conflict)', () => {
    let monitor: JESMonitor;

    beforeEach(() => {
        // 初始化設定：假定 test-service 的目標碳排為 100 kgCO2e
        const targets = new Map([['test-service', 100]]);
        monitor = new JESMonitor({ targetEmissions: targets });
    });

    it('當碳排放超過目標時，應正確偵測出衝突', () => {
        monitor.addData({
            timestamp: new Date(),
            service: 'test-service',
            energyConsumption: 200,
            carbonEmission: 150
        });

        const conflicts = monitor.detectConflicts();
        expect(conflicts.length).toBe(1);
        expect(conflicts[0].service).toBe('test-service');
        expect(conflicts[0].difference).toBe(50); // 150 - 100 = 50
        expect(conflicts[0].severity).toBe('high');
    });

    it('當碳排放未超過目標時，不應產生衝突', () => {
        monitor.addData({
            timestamp: new Date(),
            service: 'test-service',
            energyConsumption: 120,
            carbonEmission: 90
        });

        const conflicts = monitor.detectConflicts();
        expect(conflicts.length).toBe(0);
    });
});