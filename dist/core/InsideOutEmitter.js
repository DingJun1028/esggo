"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniFormula = exports.InsideOutEmitter = void 0;
const OmniInfoNode_1 = require("./OmniInfoNode");
const OmniInfoAura_1 = require("./OmniInfoAura");
class InsideOutEmitter {
    async radiate(core) {
        // 1. Inside: lock the origin (Key)
        const key = core.generateKey();
        console.log(`[Inside] Core singularity locked: ${core.uuid}`);
        // 2. For/4: pass through node (The Lock)
        const resonance = await OmniInfoNode_1.OmniInfoNode.process(core, {
            entropyControl: 0.1,
            healing: true
        });
        // 3. Out/Whole: trigger Aura (The One)
        return OmniInfoAura_1.OmniInfoAura.manifest({
            resonanceValue: resonance,
            style: 'LiquidGlass',
            action: 'DiffusionRipple'
        });
    }
}
exports.InsideOutEmitter = InsideOutEmitter;
/** OmniFormula: Total_Truth = Σ(OneCore · Rs) */
const OmniFormula = (core, rs) => core.truth.length * rs;
exports.OmniFormula = OmniFormula;
//# sourceMappingURL=InsideOutEmitter.js.map