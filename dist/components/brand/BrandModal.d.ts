import React from 'react';
interface BrandModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: React.ReactNode;
}
export default function BrandModal({ open, onClose, title, subtitle, children, footer, size, icon, }: BrandModalProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=BrandModal.d.ts.map