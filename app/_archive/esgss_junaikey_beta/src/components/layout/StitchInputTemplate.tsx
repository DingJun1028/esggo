import React from 'react';
import { StitchPageTemplate } from './StitchPageTemplate';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';
import { useStitchTheme } from '@/contexts/StitchThemeContext';

interface StitchInputTemplateProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode; // Form fields
    actionButton?: React.ReactNode; // Submit button
    securityInfo?: string; // Information about encryption/5T binding
    footerContent?: React.ReactNode;
    className?: string;
}

/**
 * StitchInputTemplate - Specialized for secure forms and data entry
 */
export const StitchInputTemplate: React.FC<StitchInputTemplateProps> = ({
    title,
    subtitle,
    children,
    actionButton,
    securityInfo,
    footerContent,
    className = ""
}) => {
    const { resolvedMode } = useStitchTheme();
    const isDark = resolvedMode === 'dark';

    return (
        <StitchPageTemplate
            title={title || "Secure Input Port"}
            subtitle={subtitle || "OMNI-KEY ENCRYPTED SESSION"}
            headerIcon={<Lock size={32} />}
            className={className}
        >
            <div className="max-w-2xl mx-auto mt-12 w-full">
                <div className={`rounded-4xl border overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'} backdrop-blur-3xl`}>
                    {/* Security Header Banner */}
                    <div className={`px-8 py-4 flex items-center justify-between border-b ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                                5T_TRUSTWORTHY_BY_DEFAULT
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-mono opacity-50">E2EE ACTIVE</span>
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        {children}

                        {actionButton && (
                            <div className="pt-6">
                                {actionButton}
                            </div>
                        )}

                        {securityInfo && (
                            <div className={`p-4 rounded-2xl text-[10px] font-mono opacity-50 border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                {securityInfo}
                            </div>
                        )}
                    </div>
                </div>

                {footerContent && (
                    <div className="mt-8 text-center">
                        {footerContent}
                    </div>
                )}
            </div>
        </StitchPageTemplate>
    );
};
