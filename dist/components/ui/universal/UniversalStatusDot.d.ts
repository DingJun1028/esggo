import React from 'react';
export interface UniversalStatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
    status?: 'active' | 'inactive' | 'warning' | 'error';
    label?: string;
    pulse?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
export declare const UniversalStatusDot: React.ForwardRefExoticComponent<UniversalStatusDotProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=UniversalStatusDot.d.ts.map