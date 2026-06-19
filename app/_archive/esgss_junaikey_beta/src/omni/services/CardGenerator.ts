import { IComponentCore, ImpactNexusCard, IMeritProfile10, MeridianFlow } from '@/types/core.ts';
import { VirtueEngine10 } from '../core/VirtueEngine10.ts';
import { OmniCard, CardType, PartnerRarity } from '@/types/aiPartner.ts';
import { InfoOneCore } from '@/omni/core/InfoOneCore.ts';

/**
 * 🃏 Impact Nexus Card Generator
 * --------------------------------------------------
 * [Core Functions]
 * 1. Convert 5T protocol compliant digital assets into cards
 * 2. Map company categories, rarity, and energy (MP) costs
 * 3. Handle ESG knowledge point integration
 */
export class CardGenerator {
  /**
   * Crystallizes the core essence of a component into a card
   */
  public static generateCard(
    component: IComponentCore,
    company: ImpactNexusCard['company'],
    ability: { name: string; description: string; mp_cost: number },
    knowledge_points: string[] = []
  ): ImpactNexusCard {
    const defaultVirtues: IMeritProfile10 = {
      intelligence: 5,
      benevolence: 5,
      integrity: 5,
      courage: 5,
      temperance: 5,
      harmony: 5,
    };

    const stats = VirtueEngine10.calculateCardStats(component.virtues || defaultVirtues);
    const adjustedStats = VirtueEngine10.applyMeridianBonus(
      stats,
      component.meridian || 'INWARD_REN'
    );

    return {
      id: component.uuid || 'unknown',
      name: `Impact Nexus: ${(component.uuid || 'unknown').substring(0, 8)}`, // Default name
      company,
      rarity: component.evidence.tangible?.visual_grade || 'GOLD',
      meridian: component.meridian || 'INWARD_REN',
      stats: adjustedStats,
      virtues: { ...(component.virtues || defaultVirtues) },
      ability,
      knowledge_points,
    };
  }

  /**
   * Example: Generate an Epic Card for ShanWei Technology
   */
  public static async generateEpicShanWei(id: string): Promise<ImpactNexusCard> {
    const mockComponent: IComponentCore = {
      uuid: id,
      version: '7.0.0',
      timestamp: Date.now(),
      status: 'Trustworthy',
      formula: 'Verified_via_NIST_Standards',
      impactMetric: 'Reliability_Score',
      meridian: 'OUTWARD_DU', // Du Meridian - Protection and Externalization
      virtues: {
        intelligence: 9, // Intelligence: High technical capability
        benevolence: 7, // Benevolence
        integrity: 10, // Integrity: Authentic data evidentiary proof (Crucial)
        courage: 8, // Courage
        temperance: 6, // Temperance
        harmony: 8, // Harmony
      },
      evidence: {
        tangible: {
          description: 'Automotive Reliability Proof',
          metric: 'Reliability: 99.9%',
          timestamp: Date.now(),
          visual_grade: 'PLATINUM',
        },
        traceable: {
          source_origin: 'ShanWei_Reliability_Lab',
          verification_links: []
        },
        trackable: {
          lifecycle_hooks: [],
          pathway: []
        },
        transparent: {
          formula: 'Verified_via_NIST_Standards',
          validation_standard: 'NIST'
        },
        trustworthy: {
          hash_lock: 'shanwei-hash-lock-epic',
          is_frozen: true,
        },
      },
      data: { subject: 'Automotive Reliability Proof' },
      lock: () => { },
    };

    return this.generateCard(
      mockComponent,
      'SHAN_WEI',
      {
        name: 'Proof of Truth',
        description:
          'Significantly boosts defense for all allies and prevents the opponent from forging for one turn.',
        mp_cost: 40,
      },
      ['Data Authenticity', 'Reliability Engineering', '4T/5T Evidence']
    );
  }

  /**
   * 🃏 Generate OmniCard from Learning Alchemy Asset
   */
  /**
  /**
   * 🃏 Generate OmniCard from Learning Alchemy Asset
   * [Definition Refined]
   * Primary: ESG Knowledge Point (Core Subject)
   * Auxiliary: Real Company Case (Traceable Evidence)
   *
   * @param core The InfoOneCore instance
   * @param t Optional translation function for i18n
   */
  public static generateAlchemyCard(core: InfoOneCore, t?: (key: string) => string): OmniCard {
    const virtues = core.virtues || { integrity: 0, intelligence: 0, benevolence: 0, courage: 0, temperance: 0, harmony: 0 };
    const totalScore = Object.values(virtues).reduce((sum, v) => sum + v, 0);

    let rarity = PartnerRarity.COMMON;
    if (totalScore > 30) rarity = PartnerRarity.UNCOMMON;
    if (totalScore > 50) rarity = PartnerRarity.RARE;
    if (totalScore > 80) rarity = PartnerRarity.EPIC;
    if (totalScore > 100) rarity = PartnerRarity.LEGENDARY;

    // Primary: Knowledge Point (Tangible)
    const knowledgeTitle = (core.evidence.tangible as any).description || 'Unknown Knowledge';

    // Auxiliary: Company Case (Traceable) Reference
    const caseStudyRef = (core.evidence.traceable as any).source_origin || 'General Theory';
    const hasRealCase = caseStudyRef !== 'Pending Input';

    // Helper for safe translation with fallback
    const translate = (key: string, defaultText: string) => {
      if (!t) return defaultText;
      const res = t(key);
      return res === key ? defaultText : res;
    };

    // Description Construction
    const descTemplate = translate('alchemy.card.desc', `[ESG Knowledge Module]\nSubject: {title}\n\nVerified by: {ref}. \nCore concept crystallized into a usable service module.`);
    const description = descTemplate.replace('{title}', knowledgeTitle).replace('{ref}', hasRealCase ? caseStudyRef : (t ? t('alchemy.concept.tangible') : 'Theoretical Model'));
    // Note: fallback for 'Theoretical Model' is simplified

    // Flavor Text Construction
    let flavorText = '';
    if (hasRealCase) {
      const tmpl = translate('alchemy.card.flavor.case', `Theory proven by the footprints of {ref}.`);
      flavorText = tmpl.replace('{ref}', caseStudyRef);
    } else {
      flavorText = translate('alchemy.card.flavor.theory', `Pure theory, awaiting the weight of reality.`);
    }

    // Effects i18n
    const unlockText = translate('alchemy.card.effect.unlock', 'Unlocks feature: {title}').replace('{title}', knowledgeTitle);
    const boostText = translate('alchemy.card.effect.boost', 'Increases resonance by {value}.').replace('{value}', Math.floor(totalScore / 10).toString());

    return {
      id: `CARD-${core.uuid}`,
      name: knowledgeTitle, // Main Subject (User Input, usually kept as is)
      type: CardType.SERVICE, // Unlocks Service
      rarity,
      artwork: '/assets/cards/alchemy_knowledge.webp',
      description,
      flavorText,
      effects: [
        { type: 'ServiceUnlock', value: 1, description: unlockText },
        { type: 'VirtueBoost', value: Math.floor(totalScore / 10), description: boostText }
      ],

      isEquipped: false
    };
  }
}

