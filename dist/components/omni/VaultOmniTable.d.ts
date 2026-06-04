import React from 'react';
export interface VaultOmniTableRecord {
    id: string;
    data: Record<string, any>;
    timestamp: string;
    author: string;
    zkpHash: string;
    fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
}
interface VaultOmniTableProps {
    columns: {
        key: string;
        label: string;
    }[];
    records: VaultOmniTableRecord[];
    className?: string;
}
export default function VaultOmniTable({ columns, records, className }: VaultOmniTableProps): React.JSX.Element;
export {};
//# sourceMappingURL=VaultOmniTable.d.ts.map