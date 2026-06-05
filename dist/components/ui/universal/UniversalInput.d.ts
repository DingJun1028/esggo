import React from 'react';
export interface UniversalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}
export declare const UniversalInput: React.ForwardRefExoticComponent<UniversalInputProps & React.RefAttributes<HTMLInputElement>>;
export interface UniversalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    children?: React.ReactNode;
}
export declare const UniversalSelect: React.ForwardRefExoticComponent<UniversalSelectProps & React.RefAttributes<HTMLSelectElement>>;
export interface UniversalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}
export declare const UniversalTextarea: React.ForwardRefExoticComponent<UniversalTextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
//# sourceMappingURL=UniversalInput.d.ts.map