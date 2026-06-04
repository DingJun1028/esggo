import React from 'react';
interface BrandCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    border?: boolean;
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'default' | 'glass' | 'liquid' | 'hologram';
    onClick?: () => void;
    style?: React.CSSProperties;
}
interface BrandCardHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    badge?: React.ReactNode;
    className?: string;
}
interface BrandCardSectionProps {
    children: React.ReactNode;
    className?: string;
    divider?: boolean;
}
export declare function BrandCardHeader({ title, subtitle, icon, action, badge, className }: BrandCardHeaderProps): React.JSX.Element;
export declare function BrandCardSection({ children, className, divider }: BrandCardSectionProps): React.JSX.Element;
export default function BrandCard({ children, className, hover, padding, border, shadow, variant, onClick, style, }: BrandCardProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandCard.d.ts.map