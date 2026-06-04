import { IComponentCore, ResonanceResult } from '../../lib/core-types';
export declare class ResonanceEngine {
    private gpl;
    private notion;
    private altable;
    calculateResonance(cards: IComponentCore[]): Promise<ResonanceResult>;
    private calculateTemporalResonance;
    private calculateStructuralResonance;
    private calculateContentResonance;
}
export default ResonanceEngine;
//# sourceMappingURL=resonanceEngine.d.ts.map