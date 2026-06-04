import React from 'react';
interface TimelineItem {
    id: string;
    title: string;
    description?: string;
    time: string;
    icon?: React.ReactNode;
    color?: string;
    badge?: React.ReactNode;
}
interface BrandTimelineProps {
    items: TimelineItem[];
    className?: string;
}
export default function BrandTimeline({ items, className }: BrandTimelineProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandTimeline.d.ts.map