import React from 'react';
interface BrandSearchBarProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
    className?: string;
}
export default function BrandSearchBar({ value, onChange, onSearch, placeholder, fullWidth, className }: BrandSearchBarProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandSearchBar.d.ts.map