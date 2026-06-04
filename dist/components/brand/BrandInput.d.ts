import React from 'react';
interface BrandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    fullWidth?: boolean;
}
interface BrandTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: string;
    error?: string;
    fullWidth?: boolean;
}
interface BrandSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    hint?: string;
    error?: string;
    options: {
        value: string;
        label: string;
    }[];
    fullWidth?: boolean;
}
export declare function BrandInput({ label, hint, error, icon, iconRight, fullWidth, className, ...props }: BrandInputProps): React.JSX.Element;
export declare function BrandTextarea({ label, hint, error, fullWidth, className, ...props }: BrandTextareaProps): React.JSX.Element;
export declare function BrandSelect({ label, hint, error, options, fullWidth, className, ...props }: BrandSelectProps): React.JSX.Element;
export default BrandInput;
//# sourceMappingURL=BrandInput.d.ts.map