import React from 'react';
/**
 * ListTemplate: Standard List View following Governance v1.0
 */
export interface ListTemplateProps<T> {
    title: string;
    description?: string;
    primaryAction?: React.ReactNode;
    filterBar?: React.ReactNode;
    columns: {
        key: string;
        label: string;
        width?: string;
    }[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;
    emptyState?: React.ReactNode;
    pagination?: React.ReactNode;
    loading?: boolean;
}
export declare function ListTemplate<T>({ title, description, primaryAction, filterBar, columns, data, renderRow, emptyState, pagination, loading }: ListTemplateProps<T>): React.JSX.Element;
//# sourceMappingURL=ListTemplate.d.ts.map