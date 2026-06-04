import React from 'react';
export interface UniversalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}
export declare function UniversalModal({ isOpen, onClose, title, children, className }: UniversalModalProps): React.ReactPortal | null;
//# sourceMappingURL=UniversalModal.d.ts.map