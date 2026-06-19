import { describe, it, expect } from 'vitest';
import { OmniRosetta } from '../omni-rosetta';

describe('OmniRosetta', () => {
    describe('isMojibake', () => {
        it('should detect Unicode replacement characters', () => {
            expect(OmniRosetta.isMojibake('Hello \uFFFD')).toBe(true);
            expect(OmniRosetta.isMojibake('Broken ï¿½ text')).toBe(true);
        });

        it('should detect triple question mark patterns', () => {
            expect(OmniRosetta.isMojibake('?? (Strength)')).toBe(true);
            expect(OmniRosetta.isMojibake('??? Unknown')).toBe(true);
        });

        it('should detect characteristic Mojibake patterns', () => {
            // "ç¹" (0xC3 0xB9) followed by high-bit chars
            expect(OmniRosetta.isMojibake('?刻')).toBe(true);
            expect(OmniRosetta.isMojibake('?')).toBe(true);
        });

        it('should NOT flag normal Traditional Chinese text', () => {
            expect(OmniRosetta.isMojibake('繁體中文測試')).toBe(false);
            expect(OmniRosetta.isMojibake('上善若水')).toBe(false);
        });
    });

    describe('repairLiteral', () => {
        it('should fix known literal patterns', () => {
            expect(OmniRosetta.repairLiteral('?? (Strength)')).toBe('力量 (Strength)');
            expect(OmniRosetta.repairLiteral('?? (Mana)')).toBe('靈能 (Mana)');
        });
    });
});
