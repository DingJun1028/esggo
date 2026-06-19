import { v4 as uuidv4 } from 'uuid';
import { INexusCard, IOmniAtom, IVirtueFingerprint, IGameSession } from './omni-types';
import { OmniCard } from '@/lib/ncb-service';

/**
 * ⚔️ OmniNexusEngine (v1.0 Nexus Awakening)
 * 負責將 5T 知識資產轉化為卡牌，並處理對決邏輯。
 */
export class OmniNexusEngine {
    private static instance: OmniNexusEngine;

    private constructor() { }

    public static getInstance(): OmniNexusEngine {
        if (!OmniNexusEngine.instance) {
            OmniNexusEngine.instance = new OmniNexusEngine();
        }
        return OmniNexusEngine.instance;
    }

    /**
     * 🎴 從知識原子鍛造卡牌 (Forge Card From Atom)
     * 遵循「知識即資產」：卡牌數值取決於原子的六德品質。
     */
    public forgeCardFromAtom(atom: IOmniAtom<any>): INexusCard {
        // 根據原子類別決定元素屬性
        const elementMap: Record<string, INexusCard['element']> = {
            'ENVIRONMENT': 'Environment',
            'SOCIAL': 'Social',
            'GOVERNANCE': 'Governance'
        };

        // 安全取得屬性 (從 payload 或 預設)
        const attributes: IVirtueFingerprint = (atom.payload as any)?.virtues || {
            wisdom: 5,
            benevolence: 5,
            courage: 5,
            integrity: 5,
            temperance: 5,
            harmony: 5
        };

        const card: INexusCard = {
            uuid: uuidv4(),
            timestamp: Date.now(),
            version: '1.0.0-nexus',
            originAtomUuid: atom.uuid,
            name: atom.intent?.split('：')[0] || atom.intent || '未知知識卡',
            rarity: this.calculateRarity(atom.quality),
            element: elementMap[atom.domainRef] || 'Nexus',
            attributes,
            abilities: this.generateAbilities(atom),
            isEquipped: false,
            isFrozen: true, // 卡牌一旦鍛造即鎖定元數據
            evidence: {
                origin_id: atom.uuid,
                origin_hash: atom.hash_lock,
                extraction_method: 'Manual'
            },
            lifecycle_events: [
                {
                    event: 'CREATED',
                    actor: 'Nexus_Forge',
                    time: Date.now(),
                    reason: 'Forged from knowledge atom'
                }
            ]
        };

        return card;
    }

    /**
     * 🃏 從資料庫原型轉化為對戰卡牌 (Convert DB Card to Nexus Card)
     */
    public convertDbCardToNexusCard(dbCard: OmniCard): INexusCard {
        // 將 power_score (0-100) 轉化為六德屬性 (1-10)
        const avgAttr = Math.max(1, Math.min(10, Math.floor(dbCard.power_score / 10)));

        const attributes: IVirtueFingerprint = {
            wisdom: avgAttr,
            benevolence: avgAttr,
            courage: avgAttr,
            integrity: avgAttr,
            temperance: avgAttr,
            harmony: avgAttr
        };

        // 根據維度微調屬性
        if (dbCard.esg_dimension === 'E') { attributes.harmony += 2; attributes.temperance += 1; }
        if (dbCard.esg_dimension === 'S') { attributes.benevolence += 2; attributes.harmony += 1; }
        if (dbCard.esg_dimension === 'G') { attributes.integrity += 2; attributes.wisdom += 1; }

        return {
            uuid: dbCard.card_id,
            timestamp: Date.now(),
            version: '1.0.0-nexus',
            originAtomUuid: dbCard.card_id,
            name: dbCard.card_name_zh || dbCard.card_name,
            rarity: dbCard.rarity as INexusCard['rarity'],
            element: this.mapDimensionToElement(dbCard.esg_dimension),
            attributes,
            abilities: [
                {
                    id: uuidv4(),
                    name: dbCard.card_type === 'Knowledge' ? '知識啟蒙' : '效能爆發',
                    description: dbCard.effect_text || '釋放卡牌潛能。',
                    power: dbCard.power_score,
                    cooldown: 3
                }
            ],
            visualUrl: dbCard.image_url || undefined,
            isEquipped: false,
            isFrozen: true,
            evidence: {
                db_id: dbCard.id.toString(),
                framework: dbCard.framework_ref
            },
            lifecycle_events: [
                {
                    event: 'CREATED',
                    actor: 'Nexus_DB_Loader',
                    time: Date.now(),
                    reason: 'Loaded from prototype database'
                }
            ]
        };
    }

    private mapDimensionToElement(dim: string): INexusCard['element'] {
        switch (dim) {
            case 'E': return 'Environment';
            case 'S': return 'Social';
            case 'G': return 'Governance';
            default: return 'Nexus';
        }
    }

    /** ⚔️ 模擬對決 (Simulate Battle) */
    public simulateBattle(userDeck: INexusCard[], opponentId: string): Partial<IGameSession> {
        // 簡易對決邏輯：計算總體影響力分數
        const calculatePower = (deck: INexusCard[]) => {
            return deck.reduce((acc, card) => {
                const attrs = card.attributes;
                return acc + (attrs.wisdom + attrs.courage + attrs.integrity + attrs.harmony);
            }, 0);
        };

        const userPower = calculatePower(userDeck);
        const opponentPower = 50 + Math.random() * 50; // Mock 敵人強度

        const isWinner = userPower > opponentPower;

        return {
            participants: {
                user: 'current-user', // 應從 Auth 獲取
                opponent: opponentId
            },
            deck: userDeck.map(c => c.uuid),
            result: {
                winner: isWinner ? 'user' : opponentId,
                finalImpactScore: userPower,
                virtueGains: {
                    wisdom: isWinner ? 2 : 1,
                    harmony: isWinner ? 1 : 0
                },
                expGain: isWinner ? 100 : 20
            }
        };
    }

    private calculateRarity(quality: number): INexusCard['rarity'] {
        if (quality >= 9) return 'Omni';
        if (quality >= 8) return 'Legendary';
        if (quality >= 6) return 'Epic';
        if (quality >= 4) return 'Rare';
        return 'Common';
    }

    private generateAbilities(atom: IOmniAtom<any>): INexusCard['abilities'] {
        // 根據 DomainRef 生成初始技能
        const baseAbility = {
            id: uuidv4(),
            name: '永續脈衝 (Sustainability Pulse)',
            description: '釋放能量，提升整體影響力。',
            power: 10,
            cooldown: 2
        };

        if (atom.domainRef === 'ENVIRONMENT') {
            return [{ ...baseAbility, name: '碳排護盾 (Carbon Shield)', description: '抵擋負面環境衝擊。', power: 12 }];
        }

        return [baseAbility];
    }
}

export const nexusEngine = OmniNexusEngine.getInstance();
