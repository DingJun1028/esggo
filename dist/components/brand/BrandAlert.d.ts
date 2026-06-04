import React from 'react';
type AlertVariant = 'success' | 'warning' | 'error' | 'info';
interface BrandAlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    dismissible?: boolean;
    className?: string;
}
export default function BrandAlert({ variant, title, children, dismissible, className }: BrandAlertProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=BrandAlert.d.ts.map