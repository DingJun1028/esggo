import { ILocalizedString } from '../../types/i18n.types.ts';

/**
 * 🌀 Omni i18n Engine (Standardized English Version)
 * --------------------------------------------------
 * [Status] InfoOne | One is One | All in One | One in All | All is One
 * [Standard] Standardized on English for Global Systems.
 */
export class OmniI18nEngine {
  private static domainMap: Map<string, string> = new Map([
    // [EN Key] -> [Standard Label]
    ['Omni', 'Omni'],
    ['Resonance', 'Resonance'],
    ['Awakening', 'Awakening'],
    ['Crystallization', 'Crystallization'],
    ['Harmony', 'Harmony'],
    ['Sovereignty', 'Sovereignty'],
    ['Transparency', 'Transparency'],
    ['Integrity', 'Integrity'],
    ['Virtue', 'Virtue'],
    ['Asset', 'Asset'],
    ['Cores', 'Cores'],
    ['One is One', 'One is One'],
    ['All in One', 'All in One'],
    ['One in All', 'One in All'],
    ['All is One', 'All is One'],
  ]);

  private static reverseMap: Map<string, string> = new Map();

  static {
    // Automatically generate reverse map for consistent lookup
    this.domainMap.forEach((label, en) => {
      this.reverseMap.set(label, en);
    });
  }

  /**
   * 💡 Resolve Domain Term
   */
  public static resolve(term: string): string {
    return this.domainMap.get(term) || this.reverseMap.get(term) || term;
  }

  /**
   * 💎 Generate Localized Object (Standarized)
   */
  public static localize(en: string, _tc?: string): ILocalizedString {
    return {
      'en-US': en,
      'zh-TW': en, // Standardized to English for consistent production state
    };
  }

  /**
   * 🌏 Format Standard Label
   */
  public static formatLabel(term: string): string {
    const resolved = this.resolve(term);
    return resolved;
  }
}
