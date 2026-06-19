import React from 'react';
import { cn } from '@/utils/cn';

interface AquaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const AquaInput = React.forwardRef<HTMLInputElement, AquaInputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="flex flex-col space-y-2 w-full">
                {label && (
                    <label className="text-sm font-display font-medium text-aqua-lighter/80 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-aqua/50 group-focus-within:text-aqua transition-colors duration-300">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full bg-glass border border-aqua/20 rounded-input px-4 py-3 text-white placeholder:text-white/20",
                            "backdrop-blur-md transition-all duration-300",
                            "focus:outline-none focus:border-aqua focus:shadow-[0_0_15px_rgba(99,166,176,0.3)]",
                            "disabled:opacity-50 disabled:bg-transparent",
                            icon && "pl-10",
                            error && "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
                            className
                        )}
                        {...props}
                    />
                    {/* Subtle Glow Overlay */}
                    <div className="absolute inset-0 -z-10 bg-aqua/5 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
                </div>
                {error && (
                    <span className="text-xs text-red-400/80 mt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

AquaInput.displayName = 'AquaInput';
