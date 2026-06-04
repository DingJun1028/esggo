import React from 'react';
interface ResponsiveDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    side?: 'left' | 'right';
    size?: 'sm' | 'md' | 'lg';
    overlayClassName?: string;
}
export default function ResponsiveDrawer({ isOpen, onClose, children, title, side, size, overlayClassName, }: ResponsiveDrawerProps): React.JSX.Element;
export {};
//# sourceMappingURL=ResponsiveDrawer.d.ts.map