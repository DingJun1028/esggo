import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Zap,
    ShieldCheck,
    Cpu,
    Layers,
    Lightbulb,
    Activity,
    Lock,
    Eye,
    Leaf,
    Globe,
    Shield
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Tooltip } from '../primitives/Tooltip';
import { ConfidenceIndicator } from '../ConfidenceIndicator';
import { DataLinkIndicator } from '../DataLinkIndicator';
import { QuantumValueEditor } from '../QuantumValueEditor';
import { QuantumAiTrigger } from '../QuantumAiTrigger';
import { AutomationNode, AutomationStatus } from '../AutomationNode';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { useOmniTraits } from '../../../hooks/useOmniTraits';

/** 💠 Sentient Data Atom State */
interface SentientDataState {
    entropy: number;
    harmony: number;
    resonance: number;
    phase: string;
}

export type EvolutionaryTrait =
    | 'optimization'
    | 'gap-filling'
    | 'tagging'
    | 'performance'
    | 'learning'
    | 'evolution'
    | 'bridging'
    | 'seamless';

interface OmniEsgCellProps {
    mode?: 'card' | 'list' | 'cell' | 'badge';
    id: string;
    label?: string;      // V2
    title?: string;      // V1 fallback
    value: string | number;
    subValue?: string;   // V2
    unit?: string;       // V1 fallback
    confidence?: number;
    dataLinks?: Array<{ id: string; label: string; type: 'live' | 'ai' | 'blockchain' | 'manual'; url?: string }>;
    dataSource?: 'live' | 'ai' | 'blockchain' | 'manual'; // V1 fallback
    traits?: EvolutionaryTrait[];
    status?: 'idle' | 'processing' | 'success' | 'error';
    onUpdate?: (id: string, newValue: string) => void;
    onAiAction?: (id: string) => void;
    className?: string;

    // Backward Compatibility Props for OmniDashboard
    category?: 'environmental' | 'social' | 'governance';
    icon?: string;
    lastUpdated?: string;
    trend?: number;

    // Sentient State for Phase 3 Morphing
    sentientState?: SentientDataState;
    onClick?: () => void;
}

/**
 * OmniEsgCell V2.0
 * A universal ESG data component following the "Service as Teaching" & "Knowledge as Asset" principles.
 * Features: Liquid Glass aesthetics (via LiquidGlassContainer), Evolutionary Traits, Quantum Interactions, and Self-Growth Logic.
 */
export const OmniEsgCell: React.FC<OmniEsgCellProps> = ({
    mode = 'card',
    id,
    label,
    title,
    value,
    subValue,
    unit,
    confidence = 85,
    dataLinks = [],
    dataSource,
    traits = [],
    status = 'idle',
    onUpdate,
    onAiAction,
    className,

    // Fallback props
    category,
    icon,
    lastUpdated,
    trend,
    sentientState,
    onClick
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // Sentient Morphing Hook
    const { traits: derivedTraits, auraEffect, glowColor } = useOmniTraits(sentientState, traits);

    // Resolution of V1 vs V2 props
    const displayLabel = label || title || "Untitled Factor";
    const displaySubValue = subValue || unit;

    // Self-Growth Logic: Adjust padding and scale based on content complexity
    const growthMetrics = useMemo(() => {
        const valueStr = String(value);
        const subValueStr = displaySubValue || "";
        const complexity = (valueStr.length + subValueStr.length) / 20;
        const paddingScale = Math.min(1 + complexity * 0.1, 1.5);
        const fontScale = Math.max(0.9, 1.1 - complexity * 0.05);
        return { paddingScale, fontScale };
    }, [value, displaySubValue]);

    const handleSave = (newValue: string) => {
        setLocalValue(newValue);
        setIsEditing(false);
        onUpdate?.(id, newValue);
    };

    const traitIcons: Record<EvolutionaryTrait, React.ReactNode> = {
        optimization: <Zap className="w-3 h-3 text-[#63a6b0]" />,
        'gap-filling': <Cpu className="w-3 h-3 text-[#ffd700]" />,
        tagging: <Layers className="w-3 h-3 text-blue-500" />,
        performance: <TrendingUp className="w-3 h-3 text-emerald-500" />,
        learning: <Lightbulb className="w-3 h-3 text-[#ffd700]" />,
        evolution: <Activity className="w-3 h-3 text-purple-500" />,
        bridging: <Minus className="w-3 h-3 text-[#63a6b0]" />,
        seamless: <ShieldCheck className="w-3 h-3 text-teal-500" />
    };

    const renderTraits = () => {
        const finalTraits = [...derivedTraits];
        if (finalTraits.length === 0) {
            if (category === 'environmental') finalTraits.push('optimization');
            if (trend && trend > 0) finalTraits.push('performance');
            if (dataSource === 'ai') finalTraits.push('learning');
        }

        return (
            <div className="flex -space-x-1 overflow-hidden">
                {finalTraits.map((trait, idx) => (
                    <Tooltip key={`${trait}-${idx}`} content={`Trait: ${trait.replace('-', ' ')}`}>
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-omni-glass-border bg-omni-surface shadow-sm">
                            {traitIcons[trait] || <Activity className="w-3 h-3 text-omni-text-muted" />}
                        </div>
                    </Tooltip>
                ))}
            </div>
        );
    };

    const mergedDataLinks = useMemo(() => {
        const links = [...dataLinks];
        if (dataSource && links.length === 0) {
            links.push({ id: 'ds-legacy', label: dataSource.toUpperCase(), type: dataSource });
        }
        return links;
    }, [dataLinks, dataSource]);

    const automationStatus: AutomationStatus = {
        state: status === 'processing' ? 'processing' : status === 'idle' ? 'idle' : status
    };

    if (mode === 'badge') {
        return (
            <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-omni-glass-border bg-omni-primary-muted backdrop-blur-md",
                className
            )}>
                <span className="text-[10px] uppercase tracking-wider text-omni-text-muted">{displayLabel}:</span>
                <span className="text-sm font-medium text-omni-text-main">{value}</span>
                {renderTraits()}
            </div>
        );
    }

    if (mode === 'cell') {
        return (
            <div className={cn(
                "flex items-center justify-between p-3 rounded-xl border border-omni-glass-border bg-omni-surface-2 hover:bg-omni-primary-muted transition-all cursor-pointer group",
                className
            )} onClick={() => setIsEditing(true)}>
                <div className="flex flex-col">
                    <span className="text-[10px] text-omni-text-muted uppercase tracking-tighter">{displayLabel}</span>
                    <span className="text-sm font-mono text-omni-primary">{value}</span>
                </div>
                {renderTraits()}
            </div>
        );
    }

    return (
        <LiquidGlassContainer
            className={cn(
                "relative group transition-all duration-500",
                mode === 'list' ? "flex flex-row items-center p-4 gap-6" : "p-6 flex flex-col gap-4",
                auraEffect === 'flicker' && "border-red-500/30",
                auraEffect === 'pulse-gold' && "ring-1 ring-omni-accent/10",
                auraEffect === 'breathe-aqua' && "ring-1 ring-omni-primary/10",
                className
            )}
            style={{
                boxShadow: auraEffect !== 'none' ? `0 0 15px ${glowColor}22` : (sentientState?.resonance ? `0 0 ${sentientState.resonance / 2}px #63a6b033` : undefined)
            }}
            onClick={onClick}
        >
            <div
                className="flex flex-col gap-4 w-full h-full"
                style={{
                    padding: mode === 'list' ? '0' : `${growthMetrics.paddingScale * 1}rem`
                }}
            >
                <div className={cn("flex justify-between items-start w-full", mode === 'list' && "w-1/3")}>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            {icon === 'Leaf' && <Leaf className="w-3 h-3 text-emerald-500 opacity-60" />}
                            {icon === 'Globe' && <Globe className="w-3 h-3 text-blue-500 opacity-60" />}
                            <span className="text-xs font-semibold text-omni-text-muted tracking-widest uppercase">{displayLabel}</span>
                            {renderTraits()}
                        </div>
                        {isEditing ? (
                            <div className="mt-2 min-w-[200px]">
                                <QuantumValueEditor
                                    value={String(localValue)}
                                    label={displayLabel}
                                    onSave={handleSave}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <h3
                                    onClick={() => setIsEditing(true)}
                                    className="text-2xl font-black text-omni-text-main cursor-pointer hover:text-omni-primary transition-colors"
                                    style={{ fontSize: `${growthMetrics.fontScale * 1.5}rem` }}
                                >
                                    {localValue}
                                </h3>
                                {(displaySubValue || trend !== undefined) && (
                                    <div className="flex items-center gap-2">
                                        {displaySubValue && <span className="text-xs text-omni-text-sub italic">{displaySubValue}</span>}
                                        {trend !== undefined && (
                                            <span className={cn("text-[10px] font-bold", trend > 0 ? "text-emerald-500" : "text-rose-500")}>
                                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {lastUpdated && <span className="text-[8px] text-omni-text-muted uppercase mt-1">Updated {lastUpdated}</span>}
                    </div>
                </div>

                <div className={cn("flex flex-wrap items-center gap-4", mode === 'list' ? "w-2/3 justify-end" : "mt-auto")}>
                    {confidence !== undefined && (
                        <ConfidenceIndicator value={confidence} size={mode === 'list' ? 'sm' : 'md'} />
                    )}

                    <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

                    <div className="flex items-center gap-3">
                        <QuantumAiTrigger
                            onClick={() => onAiAction?.(id)}
                            status={status === 'processing' ? 'analyzing' : status}
                        />
                        <AutomationNode
                            status={automationStatus}
                            onTrigger={() => console.log('Automation triggered')}
                        />
                    </div>
                </div>

                {mergedDataLinks.length > 0 && (
                    <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                        {mergedDataLinks.map((link, idx) => (
                            <DataLinkIndicator
                                key={link.id || idx}
                                type={link.type}
                                label={link.label}
                            />
                        ))}
                    </div>
                )}
            </div>
        </LiquidGlassContainer>
    );
};
