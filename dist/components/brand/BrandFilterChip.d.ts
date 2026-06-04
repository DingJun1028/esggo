import React from 'react';
interface FilterOption {
    value: string;
    label: string;
    count?: number;
}
interface BrandFilterChipProps {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}
export default function BrandFilterChip({ options, value, onChange, className }: BrandFilterChipProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandFilterChip.d.ts.map