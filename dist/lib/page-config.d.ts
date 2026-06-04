import React from 'react';
export type T5Level = 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
export interface PageAction {
    id: string;
    label: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'glass';
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
}
export interface PageKpi {
    key: string;
    label: string;
    value: string | number;
    unit?: string;
    trend?: string;
    trendUp?: boolean;
    icon?: React.ReactNode;
    verified?: boolean;
    gri?: string;
    formula?: string;
    color?: string;
}
export interface PageSection {
    id: string;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    columns: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 12;
    component: React.ReactNode;
    actions?: PageAction[];
    hidden?: boolean;
}
export interface UniversalPageConfig {
    id: string;
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    griReference?: string;
    activeT5Tags: T5Level[];
    primaryActions?: PageAction[];
    kpis?: PageKpi[];
    sections: PageSection[];
    features?: {
        useSelectionHouse?: boolean;
        useProvenance?: boolean;
        useVoiceInput?: boolean;
        useAuditLog?: boolean;
    };
    theme?: 'berkeley' | 'dark-navy' | 'minimal-blue';
    isOXModule?: boolean;
}
/**
 * Standard mapping for 5T Integrity Descriptions
 */
export declare const T5_LABELS: Record<T5Level, {
    label: string;
    desc: string;
    color: string;
}>;
//# sourceMappingURL=page-config.d.ts.map