export type ThemeId = 'minimal-blue' | 'dark-navy' | 'water-zen' | 'berkeley';
export interface ThemeConfig {
    id: ThemeId;
    name: string;
    nameEn: string;
    description: string;
    emoji: string;
    vars: Record<string, string>;
}
export declare const THEMES: ThemeConfig[];
export declare function applyTheme(themeId: ThemeId): void;
export declare function getSavedTheme(): ThemeId;
export declare function getFavoriteThemes(): ThemeId[];
export declare function saveFavoriteTheme(themeId: ThemeId): void;
export declare function removeFavoriteTheme(themeId: ThemeId): void;
//# sourceMappingURL=theme-config.d.ts.map