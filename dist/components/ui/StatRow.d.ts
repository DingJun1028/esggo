interface Stat {
    label: string;
    value: string | number;
    color?: string;
}
interface StatRowProps {
    stats: Stat[];
    className?: string;
}
export declare function StatRow({ stats, className }: StatRowProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=StatRow.d.ts.map