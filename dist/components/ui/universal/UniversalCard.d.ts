import React from 'react';
export interface UniversalCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'default' | 'glass' | 'outline' | 'glow' | 'bordered';
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
}
export declare const UniversalCard: React.ForwardRefExoticComponent<UniversalCardProps & React.RefAttributes<HTMLDivElement>>;
export declare function UniversalCardHeader({ title, subtitle, action, className }: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}): React.JSX.Element;
//# sourceMappingURL=UniversalCard.d.ts.map