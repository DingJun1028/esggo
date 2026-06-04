/**
 * InsideOutEmitter - Radiates data from Inside out via the OmniFormula
 */
import { OmniInfoOneCore } from './OmegaInfoOneCore';
export declare class InsideOutEmitter {
    radiate(core: OmniInfoOneCore): Promise<string>;
}
/** OmniFormula: Total_Truth = Σ(OneCore · Rs) */
export declare const OmniFormula: (core: OmniInfoOneCore, rs: number) => number;
//# sourceMappingURL=InsideOutEmitter.d.ts.map