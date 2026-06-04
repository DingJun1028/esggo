import React from 'react';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'outline' | 'glass';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    fullWidth?: boolean;
    hoverBgClassName?: string;
}
export default function BrandButton({ children, variant, size, loading, icon, iconRight, fullWidth, className, disabled, hoverBgClassName, // Destructure new prop
...props }: BrandButtonProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandButton.d.ts.map