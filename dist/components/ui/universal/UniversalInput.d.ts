import React from 'react';
export interface UniversalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}
export declare const UniversalInput: React.ForwardRefExoticComponent<UniversalInputProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=UniversalInput.d.ts.map