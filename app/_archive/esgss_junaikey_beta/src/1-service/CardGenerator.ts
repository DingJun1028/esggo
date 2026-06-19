import { IComponentCore, ImpactNexusCard, IMeritProfile10, MeridianFlow } from '@/types/core';
import { VirtueEngine10 } from '../omni/core/VirtueEngine10';

/**
 * 🃏 善向紀元卡牌生成器 (Card Generator)
 * --------------------------------------------------
 * [核心功能]
 * 1. 將 5T 協議合規的數位資產轉化為卡牌
 * 2. 映射公司類別、稀有度、能量消耗
 * 3. 處理 ESG 知識點結合
 */
export class CardGenerator {
  /**
   * 將組件心核晶粹化為卡牌
   */
  public static generateCard(
    component: IComponentCore,
    company: ImpactNexusCard['company'],
    ability: { name: string; description: string; mp_cost: number },
    knowledge_points: string[] = []
  ): ImpactNexusCard {
    const virtues = component.virtues || {
      intelligence: 5,
      benevolence: 5,
      integrity: 5,
      courage: 5,
      temperance: 5,
      harmony: 5,
    };
    const meridian = component.meridian || 'INWARD_REN';

    const stats = VirtueEngine10.calculateCardStats(virtues);
    const adjustedStats = VirtueEngine10.applyMeridianBonus(stats, meridian);

    return {
      id: component.uuid || 'unknown',
      name: `Impact Nexus: ${(component.uuid || 'unknown').substring(0, 8)}`,
      company,
      rarity:
        component.evidence.tangible?.visual_grade ??
        component.evidence.manifest?.visual_grade ??
        'GOLD',
      meridian,
      stats: adjustedStats,
      virtues: { ...virtues },
      ability,
      knowledge_points,
    };
  }

  /**
   * 範例：生成山衛科技 (SHAN_WEI) 的史詩卡牌
   */
  public static async generateEpicShanWei(id: string): Promise<ImpactNexusCard> {
    const mockComponent: IComponentCore = {
      uuid: id,
      version: '7.0.0',
      timestamp: Date.now(),
      status: 'Trustworthy',
      meridian: 'OUTWARD_DU', // 督脈 - 守護與外顯
      virtues: {
        intelligence: 9, // 智：高技術力
        benevolence: 7, // 仁
        integrity: 10, // 誠：數據真實存證 (關鍵)
        courage: 8, // 勇
        temperance: 6, // 節
        harmony: 8, // 和
      },
      evidence: {
        tangible: {
          metric: 'Automotive Reliability Proof',
          visual_grade: 'PLATINUM',
          timestamp: Date.now(),
        },
        traceable: {
          source_origin: 'ShanWei_Reliability_Lab',
          verification_links: [],
        },
        trackable: {
          lifecycle_hooks: [],
          pathway: ['Reliability_Testing'],
        },
        transparent: {
          formula: 'Verified_via_NIST_Standards',
          validation_standard: 'NIST-800-123',
        },
        trustworthy: {
          hash_lock: 'shanwei-hash-lock-epic',
          is_frozen: true,
        },
        verified_at: Date.now(),
      },
      data: { subject: 'Automotive Reliability Proof' },
    };

    return this.generateCard(
      mockComponent,
      'SHAN_WEI',
      {
        name: '真實存證之光 (Proof of Truth)',
        description: '大幅提升我方全體防禦力，並鎖定對方一回合內無法進行偽造。',
        mp_cost: 40,
      },
      ['數據真實性', 'Reliability Engineering', '4T/5T 存證']
    );
  }
}
