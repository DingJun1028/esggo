import React from 'react';
import { cn } from '@/utils/cn'; // Assuming a cn utility exists for class merging

interface AquaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
}

export const AquaButton = React.forwardRef<HTMLButtonElement, AquaButtonProps>(
    ({ className, variant = 'primary', size = 'md', glow = true, children, ...props }, ref) => {
        const baseStyles = 'relative inline-flex items-center justify-center font-display font-medium transition-all duration-300 rounded-button overflow-hidden focus:outline-none focus:ring-2 focus:ring-aqua/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

        const variants = {
            primary: 'bg-aqua text-white shadow-[0_0_15px_rgba(99,166,176,0.5)] hover:bg-aqua-lighter hover:shadow-[0_0_25px_rgba(99,166,176,0.7)]',
            secondary: 'bg-infoOne-gold text-void shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)]',
            ghost: 'bg-transparent text-aqua hover:bg-aqua/10 hover:backdrop-blur-sm',
            outline: 'bg-transparent border border-aqua/50 text-aqua hover:bg-aqua/10 hover:border-aqua hover:shadow-[0_0_15px_rgba(99,166,176,0.3)]',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    glow && variant !== 'ghost' && 'aqua-glow-sm',
                    className
                )}
                {...props}
            >
                <span className="relative z-10">{children}</span>
                {/* Subtle Liquid Overlay Effect */}
                <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </button>
        );
    }
);

AquaButton.displayName = 'AquaButton';
