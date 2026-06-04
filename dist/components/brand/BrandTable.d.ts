import React from 'react';
interface Column<T> {
    key: string;
    label: string;
    width?: string;
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
}
interface BrandTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
    rowKey?: (row: T) => string;
    striped?: boolean;
}
export default function BrandTable<T extends Record<string, any>>({ columns, data, loading, emptyMessage, onRowClick, rowKey, striped, }: BrandTableProps<T>): React.JSX.Element;
export {};
//# sourceMappingURL=BrandTable.d.ts.map