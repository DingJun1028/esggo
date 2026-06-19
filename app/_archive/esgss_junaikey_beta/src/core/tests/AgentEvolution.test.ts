import { describe, it, expect, vi } from 'vitest';
import { AgentDiagnostics } from '../evolution/AgentSelfDiagnosis';

describe('AgentDiagnostics', () => {
    it('should be a singleton', () => {
        const instance1 = AgentDiagnostics.getInstance();
        const instance2 = AgentDiagnostics.getInstance();
        expect(instance1).toBe(instance2);
    });

    it('should perform a health scan', async () => {
        const diagnostics = AgentDiagnostics.getInstance();
        const metrics = await diagnostics.performHealthScan();

        expect(metrics).toHaveProperty('heapUsed');
        expect(metrics).toHaveProperty('heapTotal');
        expect(metrics).toHaveProperty('uptime');
        expect(metrics).toHaveProperty('consciousnessLevel');
        expect(metrics).toHaveProperty('complexityIndex');

        expect(metrics.consciousnessLevel).toBeGreaterThanOrEqual(0);
        expect(metrics.consciousnessLevel).toBeLessThanOrEqual(1);
    });

    it('should generate an evolution report', async () => {
        const diagnostics = AgentDiagnostics.getInstance();
        const report = await diagnostics.generateEvolutionReport();

        expect(report).toContain('[EVOLUTION_LOG]');
        expect(report).toContain('C_LVL');
    });
});
