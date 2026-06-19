import React, { useState } from 'react';
import { OmniIcon } from './icons';

interface AiAnalysisTriggerProps {
    onAnalyze: () => Promise<void>;
    isAnalyzing?: boolean;
}

export const AiAnalysisTrigger: React.FC<AiAnalysisTriggerProps> = ({
    onAnalyze,
    isAnalyzing: externalIsAnalyzing
}) => {
    const [internalIsAnalyzing, setInternalIsAnalyzing] = useState(false);
    const isAnalyzing = externalIsAnalyzing ?? internalIsAnalyzing;

    const handleClick = async () => {
        if (isAnalyzing) return;
        setInternalIsAnalyzing(true);
        try {
            await onAnalyze();
        } finally {
            setInternalIsAnalyzing(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isAnalyzing}
            className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300
        ${isAnalyzing
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 cursor-wait'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300'}
      `}
        >
            <OmniIcon
                name="Bot"
                size={14}
                className={isAnalyzing ? 'animate-spin' : ''}
            />
            <span className="text-xs font-semibold tracking-wide uppercase">
                {isAnalyzing ? 'Analyzing...' : 'AI Insights'}
            </span>
        </button>
    );
};
