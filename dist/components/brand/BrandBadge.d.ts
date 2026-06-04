import React from 'react';
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold' | 'blue' | 'purple' | 'outline' | 'sealed' | 'neutral' | 'primary-light' | 'secondary-light' | 'warning-light' | 'error-light' | 'pending' | 'completed' | 'in-progress' | 'canceled' | 'archived';
type BadgeSize = 'xs' | 'sm' | 'md';
interface BrandBadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export default function BrandBadge({ children, variant, size, dot, className, style, }: BrandBadgeProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandBadge.d.ts.map