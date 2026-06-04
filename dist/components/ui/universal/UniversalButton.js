import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../../lib/utils';
import { Loader2 } from 'lucide-react';
export const UniversalButton = React.forwardRef(({ className, variant = 'primary', size = 'md', loading = false, isLoading = false, fullWidth = false, leftIcon, rightIcon, icon, children, disabled, ...props }, ref) => {
    // We use strict CSS custom properties that map to the themes defined in globals.css
    // theme.primary -> var(--theme-primary)
    // theme.surface -> var(--theme-surface)
    // We rely on arbitrary tailwind variants with strict inline colors for high fidelity.
    const variants = {
        primary: 'bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white shadow-sm border border-[var(--theme-primary)]',
        secondary: 'bg-[var(--theme-surface)] hover:bg-[var(--theme-border)] text-[var(--theme-text)] border border-[var(--theme-border)] shadow-sm',
        outline: 'bg-transparent hover:bg-[var(--theme-surface)] text-[var(--theme-primary)] border border-[var(--theme-primary)]',
        ghost: 'bg-transparent hover:bg-[var(--theme-surface)] text-[var(--theme-text)]',
    };
    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 justify-center p-0',
    };
    const isBtnLoading = loading || isLoading;
    const actualLeftIcon = leftIcon || icon;
    return (_jsxs("button", { ref: ref, disabled: disabled || isBtnLoading, className: cn('inline-flex items-center justify-center font-medium rounded-lg transition-all duration-normal ease-spring focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:ring-offset-2', variants[variant], sizes[size], fullWidth ? 'w-full' : '', (disabled || isBtnLoading) && 'opacity-60 cursor-not-allowed', className), ...props, children: [isBtnLoading && _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), !isBtnLoading && actualLeftIcon && _jsx("span", { className: "mr-2", children: actualLeftIcon }), children, !isBtnLoading && rightIcon && _jsx("span", { className: "ml-2", children: rightIcon })] }));
});
UniversalButton.displayName = 'UniversalButton';
//# sourceMappingURL=UniversalButton.js.map