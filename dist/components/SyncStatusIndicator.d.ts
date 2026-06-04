import React from 'react';
interface SyncStatusIndicatorProps {
    syncError: boolean;
    loading?: boolean;
    saved?: boolean;
    lastSaved?: Date | null;
}
export declare function SyncStatusIndicator({ syncError, loading, saved, lastSaved }: SyncStatusIndicatorProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=SyncStatusIndicator.d.ts.map