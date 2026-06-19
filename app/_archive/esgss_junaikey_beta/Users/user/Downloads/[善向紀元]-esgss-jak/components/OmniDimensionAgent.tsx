import React, { useMemo, useState, useEffect } from 'react';
import { 
    Zap, ShieldCheck, Brain, Database, TrendingUp, DollarSign, 
    Scale, Heart, BarChart3, Fingerprint, Search, Sparkles,
    AlertTriangle, Loader2, Code2, Activity
} from 'lucide-react';
import { DimensionID, OmniEsgColor, UniversalLabel, LogicWitness } from '../types';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';

// 12A 維度圖標映射
const DIMENSION_ICONS: Record<DimensionID, any> = {
    A1: Sparkles,    // Awakening
    A2: Code2,       // Bridging
    A3: Brain,       // Cognition
    A4: ShieldCheck, // Defense
    A5: TrendingUp,  // Entropy
    A6: DollarSign,  // Finance
    A7: Scale,       // Governance
    A8: Heart,       // Harmony
    A9: BarChart3,   // Impact
    A10: Fingerprint, // Justice
    A11: Database,   // Knowledge
    A12: Zap         // Light
};

interface OmniDimensionAgentBaseProps {
    id: string;
    label: string | UniversalLabel;
    value?: string | number;
    subValue?: string;
    color?: OmniEsgColor;
    dimensions: DimensionID[];
    witness?: LogicWitness;
    loading?: boolean;
    onClick?: () => void;
    // Fix: Added optional className prop
    className?: string;
}

type OmniDimensionAgentProps = OmniDimensionAgentBaseProps & InjectedProxyProps;

const OmniDimensionAgentBase: React.FC<OmniDimensionAgentProps> = (props) => {
    const { 
        id, label, value, subValue, color = 'emerald', dimensions, 
        witness, loading, onClick, adaptiveTraits = [], trackInteraction, isAgentActive,
        // Fix: Destructure className
        className = ''
    } = props;

    const [isHovered, setIsHovered] = useState(false);
    const resolvedLabel = typeof label === 'string' ? { text: label } : label;

    // A12 Dimension: 光譜渲染邏輯
    const themeColors = {
        emerald: 'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-400',
        gold: 'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/30 text-amber-400',
        purple: 'from-purple-500/20 via-purple-500/5 to-transparent border-purple-500/30 text-purple-400',
        blue: 'from-blue-500/20 via-blue-500/5 to-transparent border-blue-500/30 text-blue-400',
        cyan: 'from-cyan-500/20 via-cyan-500/5 to-transparent border-cyan-500/30 text-cyan-400',
        rose: 'from-rose-500/20 via-rose-500/5 to-transparent border-rose-500/30 text-rose-400',
        slate: 'from-slate-500/20 via-slate-500/5 to-transparent border-slate-500/30 text-slate-400',
    };

    const currentTheme = themeColors[color];
    const isOptimizing = adaptiveTraits.includes('optimization');

    if (loading) {
        return (
            <div className="h-32 w-full bg-slate-900/50 rounded-2xl border border-white/5 animate-pulse flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-gray-700 animate-spin" />
            </div>
        );
    }

    return (
        <div 
            className={`
                relative group overflow-hidden transition-all duration-500 cursor-pointer
                glass-panel p-5 rounded-3xl border bg-gradient-to-br
                ${currentTheme}
                ${isHovered ? 'scale-[1.02] -translate-y-1 shadow-2xl' : ''}
                ${isAgentActive ? 'ring-1 ring-white/20' : ''}
                ${className}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                trackInteraction?.('click', { id });
                onClick?.();
            }}
        >
            {/* Neural Surge Overlay (A1 Dimension) */}
            {isAgentActive && (
                <div className="absolute inset-0 bg-white/5 animate-ai-pulse pointer-events-none z-0" />
            )}

            {/* Scanning Line (A5 Dimension) */}
            {isOptimizing && (
                <div className="absolute inset-0 w-full h-[2px] bg-white/20 animate-[scan_3s_linear_infinite] z-20 pointer-events-none" />
            )}

            {/* A4 Dimension: 防禦背景特效 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
            
            {/* A7 Dimension: 稽核見證標籤 */}
            {witness && (
                <div className="absolute top-4 right-4 z-20" title={`Verified by ${witness.witnessHash}`}>
                    <ShieldCheck className="w-4 h-4 text-emerald-500/80 drop-shadow-[0_0_5px_#10b981]" />
                </div>
            )}

            {/* A12 Dimension: 核心圖標 */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2 rounded-xl bg-black/40 border transition-all ${isAgentActive ? 'border-white/40' : 'border-white/10 group-hover:border-white/20'}`}>
                    {isAgentActive ? (
                        <Activity className="w-5 h-5 text-white animate-pulse" />
                    ) : (
                        React.createElement(DIMENSION_ICONS[dimensions[0] || 'A1'], { 
                            className: `w-5 h-5 ${currentTheme.split(' ').pop()}` 
                        })
                    )}
                </div>
                
                {/* 12A 維度格點矩陣 (迷你預覽) */}
                <div className="grid grid-cols-6 gap-1">
                    {dimensions.map(d => (
                        <div key={d} title={d} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isAgentActive ? 'bg-white scale-125' : 'bg-current opacity-30 group-hover:opacity-100'}`} />
                    ))}
                </div>
            </div>

            {/* 數據主體 */}
            <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1 group-hover:opacity-80 transition-opacity">
                    {resolvedLabel.text}
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-white tracking-tighter">
                        {value || '--'}
                    </span>
                    {subValue && (
                        <span className="text-[10px] font-medium text-gray-500 uppercase">
                            {subValue}
                        </span>
                    )}
                </div>
            </div>

            {/* A3 Dimension: 智慧洞察線 (動態裝飾) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <div 
                    className={`h-full bg-current transition-all duration-1000 ${isAgentActive ? 'opacity-100 shadow-[0_0_10px_white]' : 'opacity-50'}`}
                    style={{ width: isHovered || isAgentActive ? '100%' : '20%' }} 
                />
            </div>
        </div>
    );
};

export const OmniDimensionAgent = withUniversalProxy(OmniDimensionAgentBase);