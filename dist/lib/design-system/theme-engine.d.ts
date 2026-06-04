/**
 * 🎨 Theme Engine V2 - Multi-Theme & Layered Mode
 * v2.0 | #BenevolentClassic #BerkeleyAcademy #ExtremeMinimalist #BestPractice
 */
import { UniversalThemeId, ModeLayer } from './atomic-core';
export interface AtomicThemeVars {
    '--at-bg-primary': string;
    '--at-bg-card': string;
    '--at-bg-glass': string;
    '--at-text-main': string;
    '--at-text-sub': string;
    '--at-accent': string;
    '--at-accent-glow': string;
    '--at-border': string;
    '--at-shadow': string;
    '--at-glass-blur': string;
    '--at-glass-opacity': string;
}
export declare const UNIVERSAL_THEMES: Record<UniversalThemeId, Record<Exclude<ModeLayer, 'system'>, AtomicThemeVars>>;
/**
 * Apply the selected theme and mode to the document
 */
export declare function applyAtomicTheme(themeId: UniversalThemeId, mode: ModeLayer): void;
//# sourceMappingURL=theme-engine.d.ts.map