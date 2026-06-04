import React from 'react';
type StatusType = 'active' | 'inactive' | 'warning' | 'error' | 'pending' | 'verified';
interface BrandStatusDotProps {
    status?: StatusType;
    label?: string;
    pulse?: boolean;
    size?: 'xs' | 'sm' | 'md';
    colorClassName?: string;
    sizeClassName?: string;
    borderClassName?: string;
    shadowClassName?: string;
    labelClassName?: string;
    dotOnly?: boolean;
}
export default function BrandStatusDot({ status, label, pulse, size, colorClassName, sizeClassName, borderClassName, shadowClassName, labelClassName, dotOnly, }: BrandStatusDotProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandStatusDot.d.ts.map