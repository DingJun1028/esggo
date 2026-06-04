import React from 'react';
export interface ProvenanceStep {
    id: string;
    type: 'source' | 'processing' | 'review' | 'result';
    title: string;
    description: string;
    actor: string;
    timestamp: string;
    details?: string;
    link?: string;
}
interface ProvenanceDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    steps: ProvenanceStep[];
    currentValue?: string;
    unit?: string;
}
export default function ProvenanceDrawer({ isOpen, onClose, title, steps, currentValue, unit }: ProvenanceDrawerProps): React.JSX.Element | null;
export {};
//# sourceMappingURL=ProvenanceDrawer.d.ts.map