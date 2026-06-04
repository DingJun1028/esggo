import React from 'react';
export interface OmniKpiCardProps {
    title: string;
    value: string | number;
    unit?: string;
    trend?: number;
    trendLabel?: string;
    fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
    icon?: React.ReactNode;
    dataSource?: string;
    className?: string;
}
export default function OmniKpiCard({ title, value, unit, trend, trendLabel, fiveTStatus, icon, dataSource, className }: OmniKpiCardProps): React.JSX.Element;
//# sourceMappingURL=OmniKpiCard.d.ts.map