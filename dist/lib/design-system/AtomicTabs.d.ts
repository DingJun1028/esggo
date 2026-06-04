import React from 'react';
export interface AtomicTabItem {
    id: string;
    label: React.ReactNode;
}
export interface AtomicTabsProps {
    tabs: AtomicTabItem[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}
export declare const AtomicTabs: React.FC<AtomicTabsProps>;
//# sourceMappingURL=AtomicTabs.d.ts.map