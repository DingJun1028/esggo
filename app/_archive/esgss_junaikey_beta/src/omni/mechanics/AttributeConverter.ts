
import { IAttributeConverter } from '@/types/omni-mechanics.ts';
import { IMeritProfile10 } from '@/types/esgss_schema.ts';
import { PartnerAttributes } from '@/types/aiPartner.ts';

/**
 * 🔄 Attribute Converter
 * Transforms abstract Virtues (IMeritProfile10) into concrete Battle Stats (PartnerAttributes).
 */
export class AttributeConverter implements IAttributeConverter {

    // 智 (Intelligence) -> 🔮 MP Max & 運算精準度
    // Formula: Base 50 + (Intelligence * 10)
    public calculateMaxMP(intelligence: number): number {
        return 50 + (intelligence * 10);
    }

    // 仁 (Benevolence) -> ❤️ HP Max & 容錯率
    // Formula: Base 100 + (Benevolence * 20)
    public calculateMaxHP(benevolence: number): number {
        return 100 + (benevolence * 20);
    }

    // 勇 (Courage) -> ⚔️ ATK & 執行速度
    // Formula: Base 10 + (Courage * 2)
    public calculateATK(courage: number): number {
        return 10 + (courage * 2);
    }

    // 誠 (Integrity) -> 🛡️ DEF & 幻覺抵抗 (Integrity used as Defense/Resistance)
    public calculateDEF(integrity: number): number {
        return 5 + (integrity * 1.5);
    }

    // 和 (Harmony) -> 🍀 Luck / Synergy rate
    public calculateSPD(harmony: number): number {
        return 10 + harmony;
    }

    /**
     * Compute full stats from a merit profile
     */
    public computePartnerStats(virtues: IMeritProfile10): PartnerAttributes {
        return {
            // Combat Stats
            hp: this.calculateMaxHP(virtues.benevolence),
            maxHp: this.calculateMaxHP(virtues.benevolence),
            mp: this.calculateMaxMP(virtues.intelligence),
            maxMp: this.calculateMaxMP(virtues.intelligence),
            attack: this.calculateATK(virtues.courage),
            defense: this.calculateDEF(virtues.integrity),
            speed: this.calculateSPD(virtues.harmony),

            // Base Virtues
            intelligence: virtues.intelligence,
            benevolence: virtues.benevolence,
            integrity: virtues.integrity,
            courage: virtues.courage,
            temperance: virtues.temperance,
            harmony: virtues.harmony,

            // Extended Attributes (Derived or Default)
            wisdom: virtues.wisdom || 0,
            creativity: virtues.creativity || 0,

            // Secondary Mappings
            precision: virtues.temperance * 5 + (virtues.wisdom || 0),
            empathy: virtues.benevolence * 8,
            efficiency: virtues.intelligence * 5 + virtues.courage * 3,
            luck: virtues.harmony * 5,
            charisma: virtues.harmony * 4 + virtues.benevolence * 4,
        };
    }
}
