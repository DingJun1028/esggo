import React from 'react';
export interface UniversalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success' | 'warning' | 'error' | 'info' | 'default';
    size?: 'xs' | 'sm' | 'md';
    dot?: boolean;
    icon?: React.ReactNode;
}
export declare const UniversalBadge: React.ForwardRefExoticComponent<UniversalBadgeProps & React.RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=UniversalBadge.d.ts.map