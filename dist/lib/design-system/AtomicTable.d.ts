import React from 'react';
export interface AtomicTableColumn<T> {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
}
export interface AtomicTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
    columns: AtomicTableColumn<T>[];
    data: T[];
    loading?: boolean;
    emptyText?: string;
    caption?: string;
    getRowEvidenceUuid?: (row: T) => string | undefined;
}
export declare function AtomicTable<T>({ columns, data, loading, emptyText, caption, className, getRowEvidenceUuid, // Destructure new prop
...props }: AtomicTableProps<T>): React.JSX.Element;
//# sourceMappingURL=AtomicTable.d.ts.map