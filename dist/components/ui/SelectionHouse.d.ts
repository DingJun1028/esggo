import React from 'react';
export interface SelectionItem {
    id: string;
    label: string;
    sub?: string;
    category?: string;
    tag?: string;
    color?: string;
}
export interface SelectionCategory {
    id: string;
    title: string;
    icon?: React.ReactNode;
    items: SelectionItem[];
}
interface SelectionHouseProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: SelectionItem) => void;
    categories: SelectionCategory[];
    title?: string;
    placeholder?: string;
}
export default function SelectionHouse({ isOpen, onClose, onSelect, categories, title, placeholder }: SelectionHouseProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=SelectionHouse.d.ts.map