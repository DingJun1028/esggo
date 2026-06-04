import React from 'react';
export interface AtomicSelectOption {
    label: string;
    value: string;
}
export interface AtomicSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: AtomicSelectOption[];
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
}
export declare const AtomicSelect: React.FC<AtomicSelectProps>;
//# sourceMappingURL=AtomicSelect.d.ts.map