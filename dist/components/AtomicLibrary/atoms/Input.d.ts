import React from 'react';
interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number';
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    className?: string;
}
export declare const Input: React.FC<InputProps>;
export {};
//# sourceMappingURL=Input.d.ts.map