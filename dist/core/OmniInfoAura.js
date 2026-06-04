"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniInfoAura = void 0;
/**
 * OmniInfoAura - Macro layer manifesting as Liquid Glass UI (Out/Whole)
 */
class OmniInfoAura {
    /**
     * Manifest the aura with given resonance and style
     * @param params - Manifest parameters
     * @returns Render description
     */
    static manifest(params) {
        const { resonanceValue, style, action } = params;
        const transparency = Math.round(resonanceValue * 100);
        return `LiquidGlass UI ${style} [${action}]: transparency=${transparency}%`;
    }
}
exports.OmniInfoAura = OmniInfoAura;
//# sourceMappingURL=OmniInfoAura.js.map