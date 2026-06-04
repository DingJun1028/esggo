import React from 'react';
/**
 * DetailTemplate: Standard Object Detail View following Governance v1.0
 */
export interface DetailTemplateProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: {
        label: string;
        href: string;
    }[];
    statusBadge?: React.ReactNode;
    actions?: React.ReactNode;
    summaryItems: {
        label: string;
        value: string | React.ReactNode;
        icon?: React.ReactNode;
    }[];
    sections: {
        id: string;
        title: string;
        content: React.ReactNode;
    }[];
    sidebar?: React.ReactNode;
}
export declare function DetailTemplate({ title, subtitle, breadcrumbs, statusBadge, actions, summaryItems, sections, sidebar }: DetailTemplateProps): React.JSX.Element;
//# sourceMappingURL=DetailTemplate.d.ts.map