import React from 'react';
export interface AtomicModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footerActions?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}
export declare const AtomicModal: React.FC<AtomicModalProps>;
//# sourceMappingURL=AtomicModal.d.ts.map