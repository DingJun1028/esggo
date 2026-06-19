import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface BentoCardProps {
    children?: React.ReactNode;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    rowSpan?: 1 | 2 | 3 | 4 | 5 | 6; // Limit rows to avoid too tall cards
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onGuidanceClick?: () => void;
    onClick?: () => void;
    className?: string;
}

/**
 * BentoCard
 * ---------
 * Standard module container for the Bento Grid.
 * Includes "Service as Teaching" guidance triggers.
 */
export const BentoCard: React.FC<BentoCardProps> = ({
    children,
    colSpan = 3, // Default 1/4 width on desktop
    rowSpan = 2,
    title,
    subtitle,
    icon,
    onGuidanceClick,
    onClick,
    className = ''
}) => {
    // Calculate grid styles based on props
    // Note: Tailwind doesn't support dynamic class construction well for JIT, 
    // so we use inline styles for grid-area or rely on standard col-span classes if pre-defined.
    // For safety with Tailwind JIT, we'll map to specific classes or use style.

    const getColSpanClass = (span: number) => {
        // Mobile is always col-span-1 (handled by grid container)
        // Desktop classes:
        switch (span) {
            case 12: return 'xl:col-span-12';
            case 8: return 'xl:col-span-8';
            case 6: return 'xl:col-span-6';
            case 4: return 'xl:col-span-4';
            case 3: return 'xl:col-span-3';
            case 2: return 'xl:col-span-2';
            default: return 'xl:col-span-3';
        }
    };

    const getRowSpanClass = (span: number) => {
        switch (span) {
            case 4: return 'xl:row-span-4';
            case 3: return 'xl:row-span-3';
            case 2: return 'xl:row-span-2';
            default: return 'xl:row-span-2';
        }
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            onClick={onClick}
            className={`bento-card relative p-5 ${getColSpanClass(colSpan)} ${getRowSpanClass(rowSpan)} ${className}`}
        >
            {/* Header Section */}
            {(title || icon) && (
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {icon && <div className="text-cyan-400">{icon}</div>}
                        <div>
                            {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
                            {subtitle && <p className="text-[10px] text-cyan-400/70 uppercase tracking-widest">{subtitle}</p>}
                        </div>
                    </div>

                    {/* Sherpa Trigger */}
                    {onGuidanceClick && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onGuidanceClick(); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full text-cyan-500/50 hover:text-cyan-400"
                            title="Explain this view"
                        >
                            <HelpCircle size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="flex-1 overflow-auto custom-scrollbar relative z-0">
                {children}
            </div>

            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 p-20 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none -z-10" />
        </motion.div>
    );
};
