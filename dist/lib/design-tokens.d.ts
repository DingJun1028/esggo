export declare const designTokens: {
    readonly colors: {
        readonly berkeleyBlue: "#003262";
        readonly deepBlue: "#001F3F";
        readonly midBlue: "#005DAA";
        readonly lightBlue: "#3B7EA1";
        readonly skyBlue: "#D4E4F7";
        readonly bgBase: "#EBF2FA";
        readonly californiaGold: "#FDB515";
        readonly goldLight: "#FEF3C7";
        readonly successGreen: "#22c55e";
        readonly successLight: "#dcfce7";
        readonly warningAmber: "#f59e0b";
        readonly warningLight: "#fef3c7";
        readonly errorRed: "#ef4444";
        readonly errorLight: "#fee2e2";
        readonly infoBlue: "#3b82f6";
        readonly infoLight: "#dbeafe";
        readonly textPrimary: "#0F172A";
        readonly textSecondary: "#475569";
        readonly textMuted: "#94a3b8";
        readonly borderDefault: "#e2e8f0";
        readonly borderStrong: "#cbd5e1";
        readonly surfaceWhite: "#ffffff";
        readonly surfaceGray: "#f8fafc";
        readonly surfaceMid: "#f1f5f9";
        readonly t1Color: "#3B7EA1";
        readonly t2Color: "#22c55e";
        readonly t3Color: "#FDB515";
        readonly t4Color: "#ef4444";
        readonly t5Color: "#8b5cf6";
    };
    readonly typography: {
        readonly fontFamily: "'Inter', 'Noto Sans TC', system-ui, -apple-system, sans-serif";
        readonly fontSizes: {
            readonly xs: "0.75rem";
            readonly sm: "0.875rem";
            readonly base: "1rem";
            readonly lg: "1.125rem";
            readonly xl: "1.25rem";
            readonly '2xl': "1.5rem";
            readonly '3xl': "1.875rem";
            readonly '4xl': "2.25rem";
        };
        readonly fontWeights: {
            readonly normal: "400";
            readonly medium: "500";
            readonly semibold: "600";
            readonly bold: "700";
        };
        readonly lineHeights: {
            readonly tight: "1.25";
            readonly normal: "1.5";
            readonly relaxed: "1.75";
        };
    };
    readonly spacing: {
        readonly '1': "0.25rem";
        readonly '2': "0.5rem";
        readonly '3': "0.75rem";
        readonly '4': "1rem";
        readonly '5': "1.25rem";
        readonly '6': "1.5rem";
        readonly '8': "2rem";
        readonly '10': "2.5rem";
        readonly '12': "3rem";
        readonly '16': "4rem";
        readonly '20': "5rem";
    };
    readonly radius: {
        readonly sm: "0.25rem";
        readonly md: "0.5rem";
        readonly lg: "0.75rem";
        readonly xl: "1rem";
        readonly '2xl': "1.25rem";
        readonly full: "9999px";
    };
    readonly shadows: {
        readonly sm: "0 1px 3px rgba(0,50,98,0.06)";
        readonly md: "0 4px 12px rgba(0,50,98,0.08)";
        readonly lg: "0 8px 24px rgba(0,50,98,0.12)";
        readonly xl: "0 16px 40px rgba(0,50,98,0.16)";
    };
    readonly breakpoints: {
        readonly sm: "640px";
        readonly md: "768px";
        readonly lg: "1024px";
        readonly xl: "1280px";
        readonly '2xl': "1536px";
    };
    readonly motion: {
        readonly fast: "150ms";
        readonly normal: "250ms";
        readonly slow: "350ms";
        readonly easing: "cubic-bezier(0.4, 0, 0.2, 1)";
    };
    readonly zIndex: {
        readonly base: "0";
        readonly raised: "10";
        readonly overlay: "100";
        readonly modal: "200";
        readonly toast: "300";
        readonly tooltip: "400";
    };
};
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type RadiusToken = keyof typeof designTokens.radius;
//# sourceMappingURL=design-tokens.d.ts.map