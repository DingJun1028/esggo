import React from 'react';
import { cn } from '@/utils/cn';

interface BentoCardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    onClick?: () => void;
    hoverGlow?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
    children,
    title,
    subtitle,
    className,
    onClick,
    hoverGlow = true,
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative rounded-card overflow-hidden bg-glass border border-aqua/10 backdrop-blur-xl transition-all duration-500",
                hoverGlow && "hover:border-aqua/30 hover:shadow-[0_0_30px_rgba(99,166,176,0.1)] hover:-translate-y-1",
                onClick && "cursor-pointer active:scale-[0.98]",
                className
            )}
        >
            {/* Liquid Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col">
                {(title || subtitle) && (
                    <div className="mb-4">
                        {title && (
                            <h3 className="text-lg font-display font-semibold text-white aqua-text-glow">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-xs font-sans text-aqua-lighter/60 uppercase tracking-wider mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                <div className="flex-1">
                    {children}
                </div>
            </div>

            {/* Subtle Scanline Animation (optional, controlled by CSS) */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-aqua/20 opacity-0 hover:opacity-100 animate-scan pointer-events-none" />
        </div>
    );
};
