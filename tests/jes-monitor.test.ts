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

    it('在高負載 (High Load) 下，應能快速偵測衝突並維持 HEAL 觸發效能', () => {
        // 模擬高負載：快速注入 10,000 筆資料
        const startInject = performance.now();
        for (let i = 0; i < 10000; i++) {
            monitor.addData({
                timestamp: new Date(),
                service: i % 2 === 0 ? 'test-service' : 'other-service',
                energyConsumption: 150,
                carbonEmission: i % 2 === 0 ? 120 : 80 // test-service 超標 (120 > 100)
            });
        }
        const endInject = performance.now();
        expect(endInject - startInject).toBeLessThan(500); // 注入應在 500ms 內完成

        // 偵測衝突效能
        const startDetect = performance.now();
        const conflicts = monitor.detectConflicts();
        const endDetect = performance.now();
        
        expect(endDetect - startDetect).toBeLessThan(100); // 偵測應在 100ms 內完成
        expect(conflicts.length).toBeGreaterThan(0);
        
        // 模擬轉換為 HEAL 信號
        const healSignals = conflicts.map(c => ({
            type: 'HEAL',
            payload: { reason: `High Energy Load detected: ${c.difference}kgCO2e excess`, service: c.service }
        }));
        
        expect(healSignals.length).toBeGreaterThan(0);
        expect(healSignals[0].payload.service).toBe('test-service');
    });
});