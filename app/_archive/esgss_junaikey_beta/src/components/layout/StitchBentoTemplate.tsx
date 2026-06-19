import React from 'react';
import { StitchPageTemplate } from './StitchPageTemplate';
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';
import { View } from '@/types/core';

interface StitchBentoTemplateProps {
    title?: string;
    subtitle?: string;
    id?: string;
    headerIcon?: React.ReactNode;
    children: React.ReactNode; // BentoCards
    activeView?: View;
    className?: string;
    breadcrumbs?: Array<{ label: string; href: string }>;
}

/**
 * StitchBentoTemplate - Specialized for high-density dashboards
 */
export const StitchBentoTemplate: React.FC<StitchBentoTemplateProps> = ({
    title,
    subtitle,
    id,
    headerIcon,
    children,
    activeView,
    className = "",
    breadcrumbs
}) => {
    return (
        <StitchPageTemplate
            id={id}
            title={title}
            subtitle={subtitle}
            headerIcon={headerIcon}
            activeView={activeView}
            className={className}
            breadcrumbs={breadcrumbs}
        >
            <div className="mt-8">
                <BentoGrid className="auto-rows-[160px] md:auto-rows-[180px]">
                    {children}
                </BentoGrid>
            </div>
        </StitchPageTemplate>
    );
};
