import React from 'react';
export interface AtomicProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'error';
    showLabel?: boolean;
    label?: string;
}
export declare const AtomicProgress: React.FC<AtomicProgressProps>;
//# sourceMappingURL=AtomicProgress.d.ts.map