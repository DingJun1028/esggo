/**
 * InsideOutEmitter - Radiates data from Inside out via the OmniFormula
 */
import { OmniInfoOneCore } from './OmegaInfoOneCore';
import { OmniInfoNode } from './OmniInfoNode';
import { OmniInfoAura } from './OmniInfoAura';

export class InsideOutEmitter {
  async radiate(core: OmniInfoOneCore) {
    // 1. Inside: lock the origin (Key)
    const key = core.generateKey();
    console.log(`[Inside] Core singularity locked: ${core.uuid}`);

    // 2. For/4: pass through node (The Lock)
    const resonance = await OmniInfoNode.process(core, {
      entropyControl: 0.1,
      healing: true
    });

    // 3. Out/Whole: trigger Aura (The One)
    return OmniInfoAura.manifest({
      resonanceValue: resonance,
      style: 'LiquidGlass',
      action: 'DiffusionRipple'
    });
  }
}

/** OmniFormula: Total_Truth = Σ(OneCore · Rs) */
export const OmniFormula = (core: OmniInfoOneCore, rs: number): number =>
  core.truth.length * rs;