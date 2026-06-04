import React from 'react';
import { ProtocolGateCode } from '@/src/shared/types';
interface T5Item {
    code: ProtocolGateCode;
    active?: boolean;
}
interface BrandT5StripProps {
    items?: T5Item[];
    compact?: boolean;
    className?: string;
    animate?: boolean;
}
export default function BrandT5Strip({ items, compact, className, animate, }: BrandT5StripProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandT5Strip.d.ts.map