/**
 * UIRenderer - Render LiquidGlass UI based on resonance
 */
export interface RenderParams {
    resonanceValue: number;
    style: string;
    action: string;
}
/**
 * Render the aura as a UI string
 */
export declare class UIRenderer {
    render(params: RenderParams): string;
}
//# sourceMappingURL=UIRenderer.d.ts.map