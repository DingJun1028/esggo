import { AuraProfile } from './NeuroAuraService.js';

export interface EmotionallyTunedContent {
  tone: string;
  narrative: string;
  intensity: number;
}

class EmotionalNarrativeService {
  /**
   * Tunes a narrative section based on the Neuro-Aura profile.
   */
  public async tuneNarrative(
    baseNarrative: string,
    aura: AuraProfile
  ): Promise<EmotionallyTunedContent> {
    let tone = 'Objective & Transparent';
    let narrative = baseNarrative;
    const intensity = aura.resonance;

    if (aura.resonance > 90) {
      tone = 'Visionary & Resonant (共鳴敘事)';
      narrative = `[Neuro-Aura Radiant] ${baseNarrative} 此成果不僅是數據的達成，更是我們與利益關係人靈魂共鳴的見證。`;
    } else if (aura.harmony > 90) {
      tone = 'Resolute & Balanced (穩健敘事)';
      narrative = `[Neuro-Aura Harmonic] ${baseNarrative} 誠信（Trustworthy）作為核芯，驅動著每一條價值鏈的穩健演進。`;
    }

    return { tone, narrative, intensity };
  }
}

export const emotionalNarrativeService = new EmotionalNarrativeService();
