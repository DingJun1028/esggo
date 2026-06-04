import React from 'react';
interface Column<T> {
    key: keyof T | string;
    header: string;
    width?: string;
    sortable?: boolean;
    render?: (value: unknown, row: T) => React.ReactNode;
}
interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
    rowKey?: (row: T) => string;
    onRowClick?: (row: T) => void;
    className?: string;
}
export declare function DataTable<T extends object>({ columns, data, loading, searchable, searchPlaceholder, emptyMessage, rowKey, onRowClick, className, }: DataTableProps<T>): React.JSX.Element;
export {};
//# sourceMappingURL=DataTable.d.ts.map