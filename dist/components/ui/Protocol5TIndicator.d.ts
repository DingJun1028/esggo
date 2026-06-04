import React from 'react';
export type T5Status = {
    t1: boolean;
    t2: boolean;
    t3: boolean;
    t4: boolean;
    t5: boolean;
};
interface Protocol5TIndicatorProps {
    status: T5Status;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}
export declare function Protocol5TIndicator({ status, className, size }: Protocol5TIndicatorProps): React.JSX.Element;
export {};
//# sourceMappingURL=Protocol5TIndicator.d.ts.map