import { describe, it, expect, vi } from 'vitest';
import { InfoOneCore } from '../InfoOneCore.ts';
import { PersonalSettings } from '../../../types/esgss_schema.ts';

// Minimal Mocking - Only mock what's strictly necessary to avoid background tasks
vi.mock('../../../services/GlobalPulseService.js', () => ({
    globalPulseService: {
        subscribeToState: vi.fn(() => () => { }),
        subscribeToPulse: vi.fn(() => () => { }),
        getInstance: vi.fn().mockReturnThis()
    }
}));

// Mock OmniResonanceCore to stop the chain before it hits OmniSyncService if possible
vi.mock('../../../services/OmniResonanceCore.js', () => ({
    OmniResonanceCore: {
        getInstance: vi.fn().mockReturnValue({
            broadcastAwakening: vi.fn(),
            registerCore: vi.fn()
        })
    }
}));

describe('Personalization Persistence', () => {
    it('should propagate personal settings from InfoOneCore to IOmniCrystal', async () => {
        const mockSettings: PersonalSettings = {
            language: 'ja-JP',
            theme: 'dark',
            notifications: false,
            aiTone: 'zen',
            customLabels: ['test-label']
        };

        // Instantiate InfoOneCore with mock settings
        const core = new InfoOneCore({
            uuid: 'test-user-core',
            data: {
                personalSettings: mockSettings
            }
        } as any);

        // Verify settings are in core (accessing private property via any for test)
        expect((core as any).personalSettings).toEqual(mockSettings);

        // Trigger Layer 4 optimization (generates omni crystal)
        // We call the private method directly for isolation
        await (core as any).secureEvidenceVault();

        // Verify crystal contains settings
        const crystal = (core as any).omniCrystal;
        expect(crystal).toBeDefined();
        expect(crystal.personalSettings).toEqual(mockSettings);
        expect(crystal.personalSettings?.language).toBe('ja-JP');
    });
});
