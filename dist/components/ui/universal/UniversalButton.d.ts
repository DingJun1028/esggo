import React from 'react';
export interface UniversalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    loading?: boolean;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    icon?: React.ReactNode;
}
export declare const UniversalButton: React.ForwardRefExoticComponent<UniversalButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=UniversalButton.d.ts.map