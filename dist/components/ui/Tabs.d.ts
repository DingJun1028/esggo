interface Tab {
    key: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
}
interface TabsProps {
    tabs: Tab[];
    active: string;
    onChange: (key: string) => void;
    variant?: 'pills' | 'underline' | 'card';
    className?: string;
}
export declare function Tabs({ tabs, active, onChange, variant, className }: TabsProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Tabs.d.ts.map