import React from 'react';
export interface AtomicToggleProps extends Omit<React.InputHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange'> {
    label?: string;
    isToggled: boolean;
    onToggle: (checked: boolean) => void;
    evidenceUuid?: string;
}
export declare const AtomicToggle: React.FC<AtomicToggleProps>;
//# sourceMappingURL=AtomicToggle.d.ts.map