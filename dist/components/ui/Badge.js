import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/ui/Badge.tsx
import { cn } from '@/lib/utils';
export function Badge({ status, variant, children, className, style }) {
    const v = variant || status || 'default';
    return (_jsxs("span", { style: style, className: cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors', {
            'bg-verified/10 text-verified border border-verified/20': v === 'verified' || v === 'success',
            'bg-draft/10 text-draft border border-draft/20': v === 'draft' || v === 'default',
            'bg-warning/10 text-warning border border-warning/20': v === 'warning',
            'bg-error/10 text-error border border-error/20': v === 'error',
            'bg-primary-500/10 text-primary-600 border border-primary-500/20': v === 'primary',
            'bg-gray-500/10 text-gray-600 border border-gray-500/20': v === 'neutral' || v === 'archived',
            'bg-gray-200/10 text-gray-300 border border-gray-200/20': v === 'primary-light',
            'bg-sky-500/10 text-sky-600 border border-sky-500/20': v === 'secondary-light',
            'bg-amber-200/10 text-amber-300 border border-amber-200/20': v === 'warning-light',
            'bg-red-200/10 text-red-300 border border-red-200/20': v === 'error-light',
            'bg-violet-500/10 text-violet-600 border border-violet-500/20': v === 'pending',
            'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20': v === 'completed',
            'bg-teal-600/10 text-teal-700 border border-teal-600/20': v === 'in-progress',
            'bg-rose-600/10 text-rose-600 border border-rose-600/20': v === 'canceled',
            'bg-berkeley-blue/10 text-berkeley-blue border border-berkeley-blue/20': v === 'secondary' || v === 'info',
            'bg-california-gold/10 text-california-gold border border-california-gold/20': v === 'gold',
            'bg-transparent border border-white/20': v === 'outline',
        }, className), children: [_jsx("span", { className: cn('w-1.5 h-1.5 rounded-full mr-1.5', {
                    'bg-verified': v === 'verified' || v === 'success',
                    'bg-draft': v === 'draft' || v === 'default',
                    'bg-warning': v === 'warning',
                    'bg-error': v === 'error',
                    'bg-primary-500': v === 'primary',
                    'bg-neutral-500': v === 'neutral',
                    'bg-primary-200': v === 'primary-light',
                    'bg-secondary-200': v === 'secondary-light',
                    'bg-warning-200': v === 'warning-light',
                    'bg-error-200': v === 'error-light',
                    'bg-pending-500': v === 'pending',
                    'bg-completed-500': v === 'completed',
                    'bg-in-progress-500': v === 'in-progress',
                    'bg-canceled-500': v === 'canceled',
                    'bg-archived-500': v === 'archived',
                    'bg-berkeley-blue': v === 'secondary' || v === 'info',
                    'bg-california-gold': v === 'gold',
                    'bg-transparent': v === 'outline',
                }) }), children] }));
}
//# sourceMappingURL=Badge.js.map