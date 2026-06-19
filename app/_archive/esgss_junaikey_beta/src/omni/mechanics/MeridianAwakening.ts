
import { AIPartner } from '@/types/aiPartner.ts';
import { UltimateEffect } from '@/types/omni-mechanics.ts';

/**
 * 🧘 脈絡覺醒控制器 (Meridian Awakening)
 * Handles Ultimate triggers based on Ren (Inward) or Du (Outward) Meridians.
 */
export class MeridianAwakening {
    public static trigger(partner: AIPartner): UltimateEffect {
        // Summing all virtues
        // Assuming virtues are flattened in `attributes` in AIPartner or need to access a dedicated object
        // Using `attributes` as the primary source based on `AttributeConverter` logic
        const attrs = partner.attributes;
        const totalVirtuePoints =
            (attrs.intelligence || 0) +
            (attrs.benevolence || 0) +
            (attrs.courage || 0) +
            (attrs.integrity || 0) +
            (attrs.temperance || 0) +
            (attrs.harmony || 0);

        // Check Meridian Type. Assuming it's a field on AIPartner or derived.
        // I will mock it here or check if AIPartner has it.
        // If not present, default to INWARD_REN for safety.
        const meridianType = (partner as any).meridian || 'INWARD_REN';

        if (meridianType === 'OUTWARD_DU') {
            return {
                type: 'DU_BURST',
                power: totalVirtuePoints * 1.5,
                description: '龍抬頭：對全場敵人造成毁滅性邏輯衝擊，並粉碎所有防護罩。'
            };
        } else {
            return {
                type: 'REN_RESTORE',
                power: totalVirtuePoints * 1.0,
                description: '水德載物：恢復全體友方 Credibility，並進入 3 回合「絕對真理」狀態。'
            };
        }
    }
}
