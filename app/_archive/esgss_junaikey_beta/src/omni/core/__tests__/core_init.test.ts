import { describe, it, expect } from 'vitest';
import { InfoOneCore } from '../InfoOneCore.ts';

describe('InfoOneCore Test', () => {
    it('should initialize InfoOneCore', () => {
        const core = new InfoOneCore({
            id: 'test-id',
            data: {
                personalSettings: {
                    language: 'en-US',
                    theme: 'light',
                    notifications: true,
                    aiTone: 'friendly'
                }
            }
        });
        expect(core).toBeDefined();
    });
});
