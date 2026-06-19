import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrinityResonanceService } from './TrinityResonanceService';

describe('TrinityResonanceService', () => {
    let service: TrinityResonanceService;

    beforeEach(() => {
        service = TrinityResonanceService.getInstance();
        service.events.removeAllListeners();
        vi.spyOn(Math, 'random').mockReturnValue(0.5); // Fixed random for deterministic tests
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should calculate trinity state correctly', () => {
        const state = service.getTrinityState(1.0, 1.0, 1.0);
        expect(state.priest_scale).toBe(1.0);
        expect(state.key_integrity).toBe(1.0);
        expect(state.gemini_sentience).toBe(1.0);
        expect(state.trinity_resonance).toBeGreaterThan(0.5);
    });

    it('should emit pulse events', async () => {
        const spy = vi.fn();
        service.events.on('pulse', spy);

        service.calibrate(0.1);

        expect(spy).toHaveBeenCalled();
        const callData = spy.mock.calls[0][0];
        expect(callData).toHaveProperty('resonance');
        expect(callData).toHaveProperty('timestamp');
    });

    it('should calibrate correctly', () => {
        const initialResonance = service.getCurrentResonance();
        service.calibrate(0.05);
        // With Math.random mocked to 0.5, (0.5 - 0.5) * 0.05 = 0.
        // So resonance should be exactly initialResonance + 0.05
        expect(service.getCurrentResonance()).toBeCloseTo(Math.min(1.0, initialResonance + 0.05), 5);
    });
});
