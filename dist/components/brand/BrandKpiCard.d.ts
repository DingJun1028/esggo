import React from 'react';
interface BrandKpiCardProps {
    label: string;
    value: string | number;
    unit?: string;
    trend?: string;
    trendUp?: boolean;
    icon?: React.ReactNode;
    color?: string;
    verified?: boolean;
    sealed?: boolean;
    formula?: string;
    sources?: string[];
    description?: string;
    className?: string;
    onClick?: () => void;
}
export default function BrandKpiCard({ label, value, unit, trend, trendUp, icon, color, verified, sealed, formula, sources, description, className, onClick, }: BrandKpiCardProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandKpiCard.d.ts.map