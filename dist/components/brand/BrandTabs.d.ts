import React from 'react';
interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number | string;
    disabled?: boolean;
}
interface BrandTabsProps {
    tabs: Tab[];
    defaultTab?: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    variant?: 'line' | 'pill' | 'box';
    children?: (activeTab: string) => React.ReactNode;
}
export default function BrandTabs({ tabs, defaultTab, activeTab: controlledActive, onTabChange, variant, children, }: BrandTabsProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandTabs.d.ts.map