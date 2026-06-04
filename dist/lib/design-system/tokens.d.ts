export declare const colorPrimitive: {
    readonly blue: {
        readonly 50: "#EBF2FA";
        readonly 100: "#D4E4F7";
        readonly 200: "#A8C9EF";
        readonly 300: "#7BAEE0";
        readonly 400: "#4E93D1";
        readonly 500: "#3B7EA1";
        readonly 600: "#005DAA";
        readonly 700: "#003262";
        readonly 800: "#001F3F";
        readonly 900: "#000F20";
    };
    readonly gold: {
        readonly 50: "#FFFBEB";
        readonly 100: "#FEF3C7";
        readonly 200: "#FDE68A";
        readonly 300: "#FCD34D";
        readonly 400: "#FBBF24";
        readonly 500: "#FDB515";
        readonly 600: "#D97706";
        readonly 700: "#B45309";
        readonly 800: "#92400E";
        readonly 900: "#78350F";
    };
    readonly green: {
        readonly 50: "#F0FDF4";
        readonly 100: "#DCFCE7";
        readonly 200: "#BBF7D0";
        readonly 300: "#86EFAC";
        readonly 400: "#4ADE80";
        readonly 500: "#22C55E";
        readonly 600: "#16A34A";
        readonly 700: "#15803D";
        readonly 800: "#166534";
        readonly 900: "#14532D";
    };
    readonly amber: {
        readonly 50: "#FFFBEB";
        readonly 100: "#FEF3C7";
        readonly 200: "#FDE68A";
        readonly 300: "#FCD34D";
        readonly 400: "#FBBF24";
        readonly 500: "#F59E0B";
        readonly 600: "#D97706";
        readonly 700: "#B45309";
        readonly 800: "#92400E";
        readonly 900: "#78350F";
    };
    readonly red: {
        readonly 50: "#FFF1F2";
        readonly 100: "#FFE4E6";
        readonly 200: "#FECDD3";
        readonly 300: "#FDA4AF";
        readonly 400: "#FB7185";
        readonly 500: "#F43F5E";
        readonly 600: "#E11D48";
        readonly 700: "#BE123C";
        readonly 800: "#9F1239";
        readonly 900: "#881337";
    };
    readonly neutral: {
        readonly 0: "#FFFFFF";
        readonly 50: "#F8FAFC";
        readonly 100: "#F1F5F9";
        readonly 200: "#E2E8F0";
        readonly 300: "#CBD5E1";
        readonly 400: "#94A3B8";
        readonly 500: "#64748B";
        readonly 600: "#475569";
        readonly 700: "#334155";
        readonly 800: "#1E293B";
        readonly 900: "#0F172A";
    };
};
export declare const semanticTokens: {
    readonly color: {
        readonly text: {
            readonly primary: "#0F172A";
            readonly secondary: "#475569";
            readonly tertiary: "#94A3B8";
            readonly inverse: "#FFFFFF";
            readonly disabled: "#94A3B8";
            readonly link: "#003262";
        };
        readonly surface: {
            readonly page: "#F8FAFC";
            readonly card: "#FFFFFF";
            readonly section: "#F1F5F9";
            readonly overlay: "rgba(0,0,0,0.45)";
            readonly disabled: "#F1F5F9";
        };
        readonly border: {
            readonly default: "#E2E8F0";
            readonly strong: "#CBD5E1";
            readonly subtle: "#F1F5F9";
            readonly focus: "#003262";
            readonly error: "#F43F5E";
        };
        readonly action: {
            readonly primary: {
                readonly bg: "#003262";
                readonly text: "#FFFFFF";
                readonly hover: "#001F3F";
                readonly active: "#001F3F";
            };
            readonly secondary: {
                readonly bg: "#EBF2FA";
                readonly text: "#003262";
                readonly hover: "#D4E4F7";
            };
            readonly danger: {
                readonly bg: "#E11D48";
                readonly text: "#FFFFFF";
                readonly hover: "#BE123C";
            };
        };
        readonly status: {
            readonly success: {
                readonly bg: "#DCFCE7";
                readonly text: "#15803D";
                readonly border: "#BBF7D0";
            };
            readonly warning: {
                readonly bg: "#FEF3C7";
                readonly text: "#B45309";
                readonly border: "#FDE68A";
            };
            readonly danger: {
                readonly bg: "#FFE4E6";
                readonly text: "#BE123C";
                readonly border: "#FECDD3";
            };
            readonly info: {
                readonly bg: "#EBF2FA";
                readonly text: "#003262";
                readonly border: "#D4E4F7";
            };
            readonly neutral: {
                readonly bg: "#F1F5F9";
                readonly text: "#475569";
                readonly border: "#E2E8F0";
            };
        };
        readonly colorDrop: {
            readonly issued: {
                readonly bg: "#FEF3C7";
                readonly text: "#B45309";
                readonly border: "#FDE68A";
            };
            readonly verified: {
                readonly bg: "#DCFCE7";
                readonly text: "#15803D";
                readonly border: "#BBF7D0";
            };
            readonly pending: {
                readonly bg: "#F1F5F9";
                readonly text: "#475569";
                readonly border: "#E2E8F0";
            };
        };
    };
    readonly typography: {
        readonly pageTitle: {
            readonly fontSize: "1.875rem";
            readonly fontWeight: "700";
            readonly lineHeight: "1.25";
        };
        readonly sectionTitle: {
            readonly fontSize: "1.125rem";
            readonly fontWeight: "600";
            readonly lineHeight: "1.4";
        };
        readonly cardTitle: {
            readonly fontSize: "1rem";
            readonly fontWeight: "600";
            readonly lineHeight: "1.5";
        };
        readonly body: {
            readonly fontSize: "0.875rem";
            readonly fontWeight: "400";
            readonly lineHeight: "1.6";
        };
        readonly label: {
            readonly fontSize: "0.8125rem";
            readonly fontWeight: "500";
            readonly lineHeight: "1.5";
        };
        readonly helper: {
            readonly fontSize: "0.75rem";
            readonly fontWeight: "400";
            readonly lineHeight: "1.5";
        };
        readonly caption: {
            readonly fontSize: "0.6875rem";
            readonly fontWeight: "400";
            readonly lineHeight: "1.4";
        };
        readonly metric: {
            readonly fontSize: "2rem";
            readonly fontWeight: "700";
            readonly lineHeight: "1";
        };
        readonly tableHeader: {
            readonly fontSize: "0.75rem";
            readonly fontWeight: "600";
            readonly lineHeight: "1.3";
        };
        readonly button: {
            readonly fontSize: "0.875rem";
            readonly fontWeight: "500";
            readonly lineHeight: "1";
        };
    };
    readonly spacing: {
        readonly inline: {
            readonly xs: "0.25rem";
            readonly s: "0.5rem";
            readonly m: "0.75rem";
            readonly l: "1rem";
            readonly xl: "1.5rem";
        };
        readonly stack: {
            readonly xs: "0.25rem";
            readonly s: "0.5rem";
            readonly m: "1rem";
            readonly l: "1.5rem";
            readonly xl: "2rem";
        };
        readonly section: {
            readonly s: "1.5rem";
            readonly m: "2rem";
            readonly l: "3rem";
        };
        readonly card: {
            readonly padding: "1.25rem";
        };
        readonly form: {
            readonly groupGap: "1.5rem";
            readonly fieldGap: "1rem";
            readonly labelGap: "0.375rem";
        };
        readonly table: {
            readonly cellX: "1rem";
            readonly cellY: "0.75rem";
        };
    };
    readonly radius: {
        readonly none: "0";
        readonly xs: "0.25rem";
        readonly s: "0.375rem";
        readonly m: "0.5rem";
        readonly l: "0.75rem";
        readonly xl: "1rem";
        readonly '2xl': "1.25rem";
        readonly pill: "9999px";
    };
    readonly shadow: {
        readonly none: "none";
        readonly xs: "0 1px 2px rgba(0,50,98,0.04)";
        readonly s: "0 1px 3px rgba(0,50,98,0.06), 0 1px 2px rgba(0,50,98,0.04)";
        readonly m: "0 4px 12px rgba(0,50,98,0.08), 0 2px 4px rgba(0,50,98,0.04)";
        readonly l: "0 8px 24px rgba(0,50,98,0.12), 0 4px 8px rgba(0,50,98,0.06)";
        readonly overlay: "0 16px 40px rgba(0,50,98,0.18), 0 8px 16px rgba(0,50,98,0.08)";
    };
    readonly motion: {
        readonly duration: {
            readonly fast: "150ms";
            readonly normal: "250ms";
            readonly slow: "350ms";
        };
        readonly easing: {
            readonly standard: "cubic-bezier(0.4,0,0.2,1)";
            readonly enter: "cubic-bezier(0,0,0.2,1)";
            readonly exit: "cubic-bezier(0.4,0,1,1)";
        };
    };
    readonly template: {
        readonly dashboard: {
            readonly maxWidth: "1440px";
            readonly sectionGap: "2rem";
            readonly cardGap: "1rem";
            readonly metricCardMinHeight: "100px";
            readonly alertZoneGap: "1.5rem";
        };
        readonly list: {
            readonly maxWidth: "1440px";
            readonly toolbarGap: "1rem";
            readonly filterGap: "0.75rem";
            readonly tableHeaderHeight: "44px";
            readonly rowMinHeight: "56px";
        };
        readonly detail: {
            readonly maxWidth: "1200px";
            readonly headerGap: "1.5rem";
            readonly sectionGap: "2rem";
            readonly sidebarWidth: "320px";
            readonly metaGap: "0.75rem";
        };
        readonly form: {
            readonly maxWidth: "800px";
            readonly sectionGap: "2rem";
            readonly fieldGap: "1rem";
            readonly labelGap: "0.375rem";
            readonly stickyActionBarHeight: "72px";
        };
        readonly report: {
            readonly maxWidth: "960px";
            readonly chapterGap: "3rem";
            readonly paragraphGap: "1.5rem";
            readonly chartGap: "2rem";
            readonly tocWidth: "240px";
        };
    };
};
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'gold';
export type ButtonSize = 'xs' | 's' | 'm' | 'l';
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'gold' | 'blue' | 'purple';
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';
export type ToastTone = 'success' | 'warning' | 'danger' | 'info';
//# sourceMappingURL=tokens.d.ts.map