export declare const BrandTokens: {
    readonly colors: {
        readonly berkeleyBlue: "#003262";
        readonly californiaGold: "#FDB515";
        readonly deepBlue: "#001F3F";
        readonly midBlue: "#005DAA";
        readonly lightBlue: "#3B7EA1";
        readonly skyBlue: "#D4E4F7";
        readonly successGreen: "#22c55e";
        readonly warningAmber: "#f59e0b";
        readonly errorRed: "#ef4444";
        readonly infoTeal: "#0ea5e9";
        readonly neutralWhite: "#FFFFFF";
        readonly neutralLight: "#F8FAFC";
        readonly neutralBorder: "#E2E8F0";
        readonly neutralMid: "#94A3B8";
        readonly neutralDark: "#1E293B";
        readonly textPrimary: "#0F172A";
        readonly textSecondary: "#475569";
        readonly textMuted: "#94A3B8";
    };
    readonly typography: {
        readonly fontFamily: "'Inter', 'Noto Sans TC', system-ui, sans-serif";
        readonly fontSizeXs: "0.75rem";
        readonly fontSizeSm: "0.875rem";
        readonly fontSizeMd: "1rem";
        readonly fontSizeLg: "1.125rem";
        readonly fontSizeXl: "1.25rem";
        readonly fontSize2xl: "1.5rem";
        readonly fontSize3xl: "1.875rem";
        readonly fontWeightNormal: "400";
        readonly fontWeightMedium: "500";
        readonly fontWeightSemibold: "600";
        readonly fontWeightBold: "700";
    };
    readonly spacing: {
        readonly xs: "0.25rem";
        readonly sm: "0.5rem";
        readonly md: "1rem";
        readonly lg: "1.5rem";
        readonly xl: "2rem";
        readonly '2xl': "3rem";
        readonly '3xl': "4rem";
    };
    readonly borderRadius: {
        readonly sm: "0.375rem";
        readonly md: "0.5rem";
        readonly lg: "0.75rem";
        readonly xl: "1rem";
        readonly full: "9999px";
    };
    readonly shadows: {
        readonly sm: "0 1px 2px rgba(0,50,98,0.06)";
        readonly md: "0 4px 12px rgba(0,50,98,0.08)";
        readonly lg: "0 8px 24px rgba(0,50,98,0.12)";
        readonly xl: "0 16px 40px rgba(0,50,98,0.16)";
        readonly gold: "0 4px 20px rgba(253,181,21,0.3)";
        readonly blue: "0 4px 20px rgba(0,50,98,0.25)";
    };
    readonly transitions: {
        readonly fast: "150ms ease";
        readonly normal: "250ms ease";
        readonly slow: "350ms ease";
    };
    readonly t5Colors: {
        readonly traceable: "#3B7EA1";
        readonly transparent: "#22c55e";
        readonly tangible: "#FDB515";
        readonly trustworthy: "#ef4444";
        readonly trackable: "#8b5cf6";
    };
};
export type BrandColor = keyof typeof BrandTokens.colors;
export type T5Protocol = 'traceable' | 'transparent' | 'tangible' | 'trustworthy' | 'trackable';
//# sourceMappingURL=brand-tokens.d.ts.map