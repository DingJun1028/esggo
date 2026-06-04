import React from 'react';
interface BrandProgressProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    color?: 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'auto';
    animated?: boolean;
    className?: string;
}
export default function BrandProgress({ value, max, label, showValue, size, color, animated, className, }: BrandProgressProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandProgress.d.ts.map