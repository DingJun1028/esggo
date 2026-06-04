import React from 'react';
export interface AtomicAlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
}
export declare const AtomicAlert: React.FC<AtomicAlertProps>;
//# sourceMappingURL=AtomicAlert.d.ts.map