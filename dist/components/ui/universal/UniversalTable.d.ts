import React from 'react';
export interface UniversalTableColumn<T> {
    key: string;
    label: React.ReactNode;
    render?: (value: any, row: T) => React.ReactNode;
}
export interface UniversalTableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
    columns: UniversalTableColumn<T>[];
    data: T[];
    compact?: boolean;
    loading?: boolean;
}
export declare function UniversalTable<T extends {
    id?: string | number;
}>({ columns, data, compact, loading, className, ...props }: UniversalTableProps<T>): React.JSX.Element;
//# sourceMappingURL=UniversalTable.d.ts.map