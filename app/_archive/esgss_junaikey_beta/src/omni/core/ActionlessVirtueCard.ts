/**
 * 🎴 ActionlessVirtueCard: 善向紀元卡牌鍛造服務
 * --------------------------------------------------
 * [Philosophy] 知識具象化 — Transform awakening achievements into tangible card assets
 * [Mechanism] VirtueEngine10 crystallization → Combat stats → Meridian bonus → Rarity → Seal
 * [Protocol] 5T verified, credential-bound, eternally sealed knowledge asset cards
 *
 * "Each card is not merely a game piece, but a crystallized proof
 *  of the holder's journey through the Six Virtues." — 善向紀元
 */

import {
    CardRarity,
    type IImpactNexusCard,
    type ICardCombatStats,
    type ICardAura,
} from './types/ImpactNexusCard.types.ts';
import type { IAwakeningCredential } from './types/AwakeningCredential.types.ts';
import type { IEvidenceMap, IMeritProfile10 } from '../../0-domain/contracts/IComponentCore.ts';
import { VirtueEngine10, type IRawESGData } from './VirtueEngine10.ts';
import { EvidenceVaultService } from './EvidenceVaultService.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

/** Aqua cyan palette for card aura (上善若水 #63a6b0) */
const AURA_PALETTE: Record<CardRarity, ICardAura> = {
    [CardRarity.COMMON]: {
        glowColor: '#A0C4C8',
        glowIntensity: 20,
        borderStyle: 'solid 2px #A0C4C8',
        particleEffect: 'none',
    },
    [CardRarity.RARE]: {
        glowColor: '#63A6B0',
        glowIntensity: 40,
        borderStyle: 'solid 2px #63A6B0',
        particleEffect: 'sparkle',
    },
    [CardRarity.EPIC]: {
        glowColor: '#4A8A94',
        glowIntensity: 60,
        borderStyle: 'double 3px #4A8A94',
        particleEffect: 'ripple',
    },
    [CardRarity.LEGENDARY]: {
        glowColor: '#FFD700',
        glowIntensity: 80,
        borderStyle: 'ridge 3px #FFD700',
        particleEffect: 'aurora',
    },
    [CardRarity.MYTHIC_ACTIONLESS]: {
        glowColor: '#63A6B0',
        glowIntensity: 100,
        borderStyle: 'double 4px #FFD700',
        particleEffect: 'liquid-glass',
    },
};

export class ActionlessVirtueCard {
    private evidenceVault: EvidenceVaultService;

    constructor() {
        this.evidenceVault = new EvidenceVaultService();
    }

    /**
     * 🔨 Forge Card
     * --------------------------------------------------
     * Crystallizes an InfoOne's current state into an Impact Nexus Card.
     *
     * Pipeline: Raw ESG Data → VirtueEngine10.crystallize() → calculateCardStats()
     *          → applyMeridianBonus() → determineRarity() → SHA-256 seal
     */
    public async forgeCard(
        forgerUuid: string,
        evidence: IEvidenceMap,
        rawData: IRawESGData,
        credential?: IAwakeningCredential
    ): Promise<IImpactNexusCard> {
        omniLogger.info(LogCategory.SYSTEM, `[ActionlessCard] 🔨 Forging card for ${forgerUuid}...`);

        // 1. Crystallize virtues via VirtueEngine10
        const virtues = VirtueEngine10.crystallize(rawData);

        // 2. Calculate base combat stats
        const baseStats = VirtueEngine10.calculateCardStats(virtues);

        // 3. Determine meridian
        const meridian = VirtueEngine10.getMeridian(virtues);

        // 4. Apply meridian bonus
        const stats: ICardCombatStats = VirtueEngine10.applyMeridianBonus(baseStats, meridian);

        // 5. Count 5T gates
        const fiveT_completionRate = this.count5TGates(evidence);

        // 6. Determine rarity
        const rarity = this.determineRarity(virtues, fiveT_completionRate, credential);

        // 7. Build card payload
        const cardPayload = {
            name: this.generateCardName(rarity, meridian),
            description: this.generateDescription(rarity, virtues),
            rarity,
            meridian,
            stats,
            fiveT_completionRate,
            credentialId: credential?.credentialId,
            forgedAt: Date.now(),
            forgedBy: forgerUuid,
            esg: {
                environmental: Math.round(rawData.carbonReduction * 100),
                social: Math.round(rawData.socialImpactRatio * 100),
                governance: Math.round((rawData.hashLockVerified ? 1.0 : (rawData.dataQuality / 3)) * 100),
                totalScore: Math.round(((rawData.carbonReduction + rawData.socialImpactRatio + (rawData.hashLockVerified ? 1.0 : (rawData.dataQuality / 3))) / 3) * 100)
            }
        };

        // 8. Seal with SHA-256
        const sealHash = await this.evidenceVault.anchorEvidence(forgerUuid, cardPayload);

        const card: IImpactNexusCard = {
            cardId: `CARD-${sealHash.substring(0, 8).toUpperCase()}`,
            ...cardPayload,
            aura: AURA_PALETTE[rarity],
            sealHash,
        };

        omniLogger.info(
            LogCategory.SYSTEM,
            `[ActionlessCard] 🎴 Forged: ${card.cardId} | ${card.name} | ${rarity} | ATK:${stats.ATK} DEF:${stats.DEF} MP:${stats.MP} HP:${stats.HP}`
        );

        return Object.freeze(card);
    }

    /**
     * 💎 Determine Rarity
     * --------------------------------------------------
     * Based on virtue total, 5T completion, and credential binding.
     */
    public determineRarity(
        virtues: IMeritProfile10,
        fiveT_completionRate: number,
        credential?: IAwakeningCredential
    ): CardRarity {
        const total = virtues.intelligence + virtues.benevolence + virtues.integrity +
            virtues.courage + virtues.temperance + virtues.harmony;

        // MYTHIC_ACTIONLESS: credential bound with ACTIONLESS_VIRTUE rank + full 5T + high virtues
        if (
            credential?.rank === 'ACTIONLESS_VIRTUE' &&
            fiveT_completionRate === 5 &&
            total >= 48
        ) {
            return CardRarity.MYTHIC_ACTIONLESS;
        }

        // LEGENDARY: Full 5T + total >= 40
        if (fiveT_completionRate === 5 && total >= 40) {
            return CardRarity.LEGENDARY;
        }

        // EPIC: 4+ gates + total >= 30
        if (fiveT_completionRate >= 4 && total >= 30) {
            return CardRarity.EPIC;
        }

        // RARE: 3+ gates + total >= 20
        if (fiveT_completionRate >= 3 && total >= 20) {
            return CardRarity.RARE;
        }

        return CardRarity.COMMON;
    }

    /**
     * 🔗 Bind Credential to Card
     * --------------------------------------------------
     * Creates a new card version with credential binding (returns new frozen card).
     */
    public async bindCredential(
        card: IImpactNexusCard,
        credential: IAwakeningCredential
    ): Promise<IImpactNexusCard> {
        omniLogger.info(
            LogCategory.SYSTEM,
            `[ActionlessCard] 🔗 Binding credential ${credential.credentialId} to card ${card.cardId}`
        );

        const boundPayload = {
            ...card,
            credentialId: credential.credentialId,
        };

        // Re-seal with new credential binding
        const sealHash = await this.evidenceVault.anchorEvidence(card.forgedBy, boundPayload);

        const boundCard: IImpactNexusCard = {
            ...boundPayload,
            cardId: `CARD-${sealHash.substring(0, 8).toUpperCase()}-BOUND`,
            sealHash,
        };

        return Object.freeze(boundCard);
    }

    // ─── Private Helpers ───

    private count5TGates(evidence: IEvidenceMap): number {
        return [
            !!evidence.tangible,
            !!evidence.traceable?.source_origin,
            !!evidence.trackable?.lifecycle_hooks,
            !!evidence.transparent?.formula,
            !!evidence.trustworthy?.is_frozen,
        ].filter(Boolean).length;
    }

    private generateCardName(rarity: CardRarity, meridian: 'INWARD_REN' | 'OUTWARD_DU'): string {
        const prefix = meridian === 'INWARD_REN' ? '仁' : '義';
        const names: Record<CardRarity, string> = {
            [CardRarity.COMMON]: `${prefix}·初心之光`,
            [CardRarity.RARE]: `${prefix}·精修之輝`,
            [CardRarity.EPIC]: `${prefix}·宗師之焰`,
            [CardRarity.LEGENDARY]: `${prefix}·超越之耀`,
            [CardRarity.MYTHIC_ACTIONLESS]: `${prefix}·無作妙德`,
        };
        return names[rarity];
    }

    private generateDescription(rarity: CardRarity, virtues: IMeritProfile10): string {
        if (rarity === CardRarity.MYTHIC_ACTIONLESS) {
            return '透過 5T 誠信閉環，達成跨平台數據之自然共振。此卡牌為覺醒者最高果證之具象化，體現「無通自通」之本質。';
        }
        const total = virtues.intelligence + virtues.benevolence + virtues.integrity +
            virtues.courage + virtues.temperance + virtues.harmony;
        return `六德總分 ${total}/60，承載永續知識之力。服務即教學，知識即資產。`;
    }
}
