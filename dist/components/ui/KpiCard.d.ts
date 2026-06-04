interface KpiCardProps {
    label: string;
    value: string | number;
    unit?: string;
    trend?: string;
    trendUp?: boolean;
    icon?: React.ReactNode;
    color?: string;
    verified?: boolean;
    formula?: string;
    sources?: string[];
    gri?: string;
    onClick?: () => void;
    className?: string;
}
export declare function KpiCard({ label, value, unit, trend, trendUp, icon, color, verified, formula, sources, gri, onClick, className, }: KpiCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=KpiCard.d.ts.map