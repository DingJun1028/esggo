"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIRenderer = void 0;
/**
 * Render the aura as a UI string
 */
class UIRenderer {
    render(params) {
        const { resonanceValue, style, action } = params;
        const transparency = Math.round(resonanceValue * 100);
        return `LiquidGlass UI [${action}]: style=${style}, transparency=${transparency}%`;
    }
}
exports.UIRenderer = UIRenderer;
const renderer = new UIRenderer();
console.log(renderer.render({ resonanceValue: 0.85, style: 'LiquidGlass', action: 'DiffusionRipple' }));
//# sourceMappingURL=UIRenderer.js.map