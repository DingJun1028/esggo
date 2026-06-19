import React from 'react';
import { motion } from 'framer-motion';
import { StitchPageTemplate } from './StitchPageTemplate';
import { Bot, Sparkles } from 'lucide-react';
import { useStitchTheme } from '@/contexts/StitchThemeContext';

interface StitchConversationTemplateProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode; // Chat messages/content
    inputComponent?: React.ReactNode; // Input area
    sidebarContent?: React.ReactNode; // Optional sidebar (e.g., knowledge nodes)
    className?: string;
}

/**
 * StitchConversationTemplate - Specialized for AI chat and guidance
 */
export const StitchConversationTemplate: React.FC<StitchConversationTemplateProps> = ({
    title,
    subtitle,
    children,
    inputComponent,
    sidebarContent,
    className = ""
}) => {
    const { resolvedMode } = useStitchTheme();
    const isDark = resolvedMode === 'dark';

    return (
        <StitchPageTemplate
            title={title || "Omni-Mind Synthesis"}
            subtitle={subtitle || "AI SENTIENT GUIDANCE"}
            headerIcon={<Bot size={32} />}
            className={className}
        >
            <div className="flex flex-col lg:flex-row gap-8 mt-8 h-[60vh] lg:h-[70vh]">
                {/* Main Chat Area */}
                <div className={`flex-1 flex flex-col rounded-4xl border overflow-hidden ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-100'} shadow-2xl relative`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#63a6b0] to-amber-500" />

                    {/* Message Stream */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {children}
                    </div>

                    {/* Input Container */}
                    {inputComponent && (
                        <div className={`p-6 border-t ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50'}`}>
                            {inputComponent}
                        </div>
                    )}
                </div>

                {/* Optional Guidance Sidebar */}
                {sidebarContent && (
                    <div className="w-full lg:w-80 space-y-6 overflow-y-auto scrollbar-hide h-full">
                        <div className={`p-6 rounded-4xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'} shadow-xl`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={16} className="text-amber-500" />
                                <h5 className="text-xs font-black uppercase tracking-widest opacity-60">Knowledge Insights</h5>
                            </div>
                            {sidebarContent}
                        </div>
                    </div>
                )}
            </div>
        </StitchPageTemplate>
    );
};
