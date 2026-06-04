import React from 'react';
export interface AtomicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    glassIntensity?: 'low' | 'medium' | 'high';
    hoverEffect?: 'none' | 'glow' | 'lift';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}
export declare const AtomicCard: React.ForwardRefExoticComponent<AtomicCardProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=AtomicCard.d.ts.map