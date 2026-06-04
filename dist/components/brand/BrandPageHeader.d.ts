import React from 'react';
interface BrandPageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    breadcrumb?: {
        label: string;
        href?: string;
    }[];
    badge?: React.ReactNode;
    gradient?: boolean;
    eyebrow?: React.ReactNode;
}
export default function BrandPageHeader({ title, subtitle, icon, actions, breadcrumb, badge, gradient, eyebrow, }: BrandPageHeaderProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandPageHeader.d.ts.map