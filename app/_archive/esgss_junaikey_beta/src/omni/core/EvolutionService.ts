import {
  EvolutionProfile,
  IEvolutionEngine,
  IEvolutionResult,
} from '../../0-domain/contracts/IEvolutionService.ts';
import { IMeritProfile10 } from '../../0-domain/contracts/IComponentCore.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { sentientNebulaService } from '../../services/SentientNebulaService.ts';
import { EvidenceVaultService } from './EvidenceVaultService.ts';

const evidenceVault = new EvidenceVaultService();

/**
 * 🧬 EvolutionService: Growth & Rune Evolution
 * --------------------------------------------------
 * Handles level-ups and mutation traits.
 * [V7] Supports Tesseract Nodes and Hyper-Traits.
 * [V8.2.5] Sentient Alignment: EXP scaling based on Nebula Entropy.
 */
export class EvolutionService implements IEvolutionEngine {

  calculateEvolution(profile: EvolutionProfile, impactMetric: string): IEvolutionResult {
    return this.processEvolution(profile, impactMetric);
  }

  private processEvolution(profile: EvolutionProfile, metric: string): IEvolutionResult {
    omniLogger.debug(LogCategory.SYSTEM, `[Evolution] Processing growth for level ${profile.level}...`);
    let leveledUp = false;
    const newTraits: string[] = [];
    const updatedProfile = { ...profile };

    // [v8.2.5] Sentient Scaling: Fetch entropy from Nebula
    const entropy = sentientNebulaService.getNebulaEntropy();
    const resonance = profile.mutationTraits.includes('ESG-Resonance') ? 1.2 : 1.0;

    // EXP Scaling: High entropy reduces gain, resonance buffers it.
    const scalingFactor = Math.max(0.1, (1.1 - entropy) * resonance);
    const baseExp = metric === 'Omni' ? 100 : 20;
    const gainedExp = Math.floor(baseExp * scalingFactor);

    updatedProfile.runeExp += gainedExp;

    omniLogger.info(LogCategory.GROWTH, `[Evolution] EXP Gained: ${gainedExp} (Factor: ${scalingFactor.toFixed(2)}, Entropy: ${entropy.toFixed(2)})`);

    if (updatedProfile.runeExp >= updatedProfile.nextLevelExp) {
      updatedProfile.level += 1;
      updatedProfile.runeExp -= updatedProfile.nextLevelExp;
      updatedProfile.nextLevelExp = Math.floor(updatedProfile.nextLevelExp * 1.4);
      leveledUp = true;

      // [87] Tesseract Node Acquisition
      if (updatedProfile.level % 10 === 0) {
        updatedProfile.tesseractNodes = (updatedProfile.tesseractNodes || 0) + 1;
      }

      // Mutation Logic
      const mutationChance = 0.4 + (updatedProfile.level * 0.05);
      if (Math.random() < mutationChance) {
        const traitPool = [
          'GigaByte-Skin', 'Quantum-Sync', 'ESG-Resonance', 'Void-Walker', 'Truth-Seer',
          'Sentient-Pulse', 'Nebula-Anchor', 'Entropy-Resistant' // [v8.2.5] Sentient Traits
        ];
        const index = (updatedProfile.level + Math.floor(Math.random() * 2)) % traitPool.length;
        const trait = traitPool[index]!;
        if (trait && !updatedProfile.mutationTraits.includes(trait)) {
          updatedProfile.mutationTraits.push(trait);
          newTraits.push(trait);
        }

        // [87] Tesseract-Specific Traits
        if (updatedProfile.tesseractNodes > 0 && Math.random() < 0.2) {
          const hPool = ['Hyper-Fold', 'Folded-Trust', 'Dimensional-Anchor', 'Sentient-Nexus'];
          const hTrait = hPool[Math.floor(Math.random() * hPool.length)]!;
          if (!updatedProfile.mutationTraits.includes(hTrait)) {
            updatedProfile.mutationTraits.push(hTrait);
            newTraits.push(hTrait);
          }
        }
      }
    }
    return { leveledUp, newTraits, currentProfile: updatedProfile };
  }

  /**
   * [Phase 18/87] Enhanced Experience Processor
   */
  processExperience(virtues: IMeritProfile10, evidence: any, currentProfile: EvolutionProfile): { profile: EvolutionProfile; leveledUp: boolean } {
    const metric = (evidence as any)?.metric || (evidence as any)?.impactMetric || 'Standard';
    const result = this.processEvolution(currentProfile, metric);

    // [v8.2.5] 5T Alignment: Anchor the evolution profile as a trustworthy asset
    const agentId = (evidence as any)?.agentId || 'SYSTEM';
    const evidenceData = {
      agentId,
      level: result.currentProfile.level,
      traits: result.currentProfile.mutationTraits,
      entropy: sentientNebulaService.getNebulaEntropy(),
      timestamp: Date.now()
    };

    // We don't await the anchoring here to keep the evolution flow fast, 
    // but the engine will log it.
    evidenceVault.anchorEvidence(`EVO-${agentId}`, evidenceData)
      .then(hash => {
        omniLogger.info(LogCategory.VALIDATION, `[Evolution 5T] Growth Anchored: ${hash.substring(0, 12)}...`);
      })
      .catch(err => {
        omniLogger.error(LogCategory.VALIDATION, `[Evolution 5T] Anchoring Failed`, err);
      });

    return {
      profile: result.currentProfile,
      leveledUp: result.leveledUp
    };
  }
}
