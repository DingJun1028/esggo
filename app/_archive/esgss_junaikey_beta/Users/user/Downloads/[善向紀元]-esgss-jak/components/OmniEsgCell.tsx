
import React, { useState, useMemo } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Minus, LucideIcon,
  Activity, Puzzle, Tag, HelpCircle, ShieldCheck, Sparkles, Info,
  ShieldAlert, RefreshCw, Flame, Zap
} from 'lucide-react';
import {
  OmniEsgTrait, OmniEsgDataLink, OmniEsgMode, OmniEsgConfidence,
  OmniEsgColor, UniversalLabel, LogicWitness
} from '../types';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { GLOBAL_GLOSSARY } from '../constants';
import { universalIntelligence } from '../services/evolutionEngine';
import { useCompany } from './providers/CompanyProvider';
import { useTheme } from '../contexts/ThemeContext';

// 引入 JunAiKey v5.0 免疫系統
import { useEntropyForge, EntropyLevel, HealingStrategy } from '../src/core/rectification/EntropyForge';

import { DataLinkIndicator } from './minimal/DataLinkIndicator';
import { ConfidenceIndicator } from './minimal/ConfidenceIndicator';
import { QuantumAiTrigger } from './minimal/QuantumAiTrigger';
import { QuantumValueEditor } from './minimal/QuantumValueEditor';
import { InsightTooltip } from './minimal/InsightTooltip';

const THEMES = {
  emerald: { border: 'group-hover:border-emerald-500/40', glow: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-500/10', gradient: 'from-emerald-500/20' },
  gold: { border: 'group-hover:border-amber-500/40', glow: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-500/10', gradient: 'from-amber-500/20' },
  purple: { border: 'group-hover:border-purple-500/40', glow: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-500/10', gradient: 'from-purple-500/20' },
  blue: { border: 'group-hover:border-blue-500/40', glow: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-500/10', gradient: 'from-blue-500/20' },
  slate: { border: 'group-hover:border-slate-400/40', glow: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400', iconBg: 'bg-slate-500/10', gradient: 'from-slate-500/20' },
  rose: { border: 'group-hover:border-rose-500/40', glow: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', iconBg: 'bg-rose-500/10', gradient: 'from-rose-500/20' },
  cyan: { border: 'group-hover:border-cyan-500/40', glow: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', iconBg: 'bg-cyan-500/10', gradient: 'from-cyan-500/20' },
};

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const getTheme = (color: OmniEsgColor) => THEMES[color] || THEMES.emerald;

interface OmniEsgCellBaseProps {
  id?: string;
  mode: OmniEsgMode;
  label?: string | UniversalLabel;
  value?: string | number;
  subValue?: string;
  confidence?: OmniEsgConfidence;
  verified?: boolean;
  loading?: boolean;
  dataLink?: OmniEsgDataLink;
  traits?: OmniEsgTrait[];
  tags?: string[];
  icon?: LucideIcon;
  color?: OmniEsgColor;
  className?: string;
  witness?: LogicWitness;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  onAiAnalyze?: () => void;
  onClick?: () => void;
  // JunAiKey v5.0 新增：自動化觸發
  onAutomationTrigger?: () => void;
}

type OmniEsgCellProps = OmniEsgCellBaseProps & InjectedProxyProps;

const resolveLabel = (label: string | UniversalLabel): UniversalLabel => {
  if (typeof label === 'object') return label;
  if (GLOBAL_GLOSSARY[label]) {
    const entry = GLOBAL_GLOSSARY[label];
    return {
      text: label,
      definition: entry.definition,
      ...(entry.formula ? { formula: entry.formula } : {}),
      ...(entry.rationale ? { rationale: entry.rationale } : {})
    };
  }
  return { text: label };
};

const OmniEsgCellBase: React.FC<OmniEsgCellProps> = React.memo((props) => {
  const {
    componentId,
    mode, label, value: rawValue, subValue, confidence = 'high', verified = false,
    loading = false, dataLink, traits = [], tags = [], icon: Icon, color = 'emerald',
    className = '', trend, onClick, onAiAnalyze, onAutomationTrigger, witness,
    adaptiveTraits = [], trackInteraction, isHighFrequency, isAgentActive,
    growth, isCircuitOpen
  } = props;

  // JunAiKey v5.0：整合 EntropyForge 免疫系統
  const { value, isRectified, entropy, strategy, confidence: healConfidence, witnessSignature } =
    useEntropyForge(rawValue, componentId || 'unknown');

  // 驗證必填屬性
  if (!mode) {
    console.error('OmniEsgCell: mode is required');
    return null;
  }

  // 驗證 mode 值
  const validModes = ['card', 'list', 'compact', 'cell', 'badge'];
  if (!validModes.includes(mode)) {
    console.error(`OmniEsgCell: Invalid mode "${mode}". Valid modes:`, validModes);
    return null;
  }

  const { language } = useCompany();
  const { resolvedTheme } = useTheme();
  const isZh = language === 'zh-TW';
  const isDark = resolvedTheme === 'dark';
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const resolvedLabel = useMemo(() => resolveLabel(label || 'Unknown'), [label]);
  const labelText = resolvedLabel.text;
  const isRichLabel = !!(resolvedLabel.definition || resolvedLabel.formula || resolvedLabel.rationale);
  const theme = getTheme(color);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  if (loading) return <div className={`h-24 w-full bg-slate-200 dark:bg-white/5 animate-pulse rounded-3xl ${className}`} />;

  // 核心視覺邏輯切換
  // JunAiKey v5.0：整合免疫系統視覺效果
  const isHealed = isRectified && entropy !== 'ZERO';
  const healGlowClass = isHealed && isDark ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-500/50' : '';

  const wrapperClasses = `
    group relative overflow-visible transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-celestial-purple/30
    ${isDark
      ? `backdrop-blur-3xl bg-slate-900/40 border-white/5 hover:bg-white/10 shadow-xl ${healGlowClass}`
      : `bg-white border-slate-200 hover:border-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ${isHealed ? 'border-amber-300/50 shadow-amber-100' : ''}`}
    ${theme.border}
    ${isHighFrequency && isDark ? 'ring-1 ring-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.1)]' : ''}
    ${isCircuitOpen ? 'border-rose-500/50 grayscale-[0.5]' : ''}
    ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
    ${className}
  `;

  const EvolutionStars = (
    <div className="flex gap-1 absolute top-3 right-4 z-20">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-1000
                    ${i < (growth?.evolutionLevel || 1) ? theme.glow + (isDark ? ' shadow-[0_0_8px_currentColor]' : '') : (isDark ? 'bg-gray-800' : 'bg-slate-200')}
                `}
        />
      ))}
    </div>
  );

  const TrendIndicator = trend ? (
    <div className="absolute top-2 left-4 z-20 flex items-center gap-1">
      {(() => {
        const Icon = TREND_ICONS[trend.direction];
        const isPositive = trend.direction === 'up';
        const isNegative = trend.direction === 'down';
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Icon className={`w-3 h-3 ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`} />
            <span className={`text-[9px] font-black tracking-widest uppercase ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`}>
              {Math.abs(trend.value)}%
            </span>
          </div>
        );
      })()}
    </div>
  ) : null;

  const HeatWave = isHighFrequency && isDark ? (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-0">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-emerald-500/5 opacity-20 animate-ai-pulse" />
    </div>
  ) : null;

  const LabelWithIcon = (
    <div
      className={`flex items-center gap-2 relative select-none max-w-full overflow-hidden p-0.5 ${isRichLabel ? 'cursor-help' : ''}`}
      onMouseEnter={() => isRichLabel && setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <span className={`text-[11px] font-black tracking-[0.15em] transition-all duration-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis 
            ${isDark ? 'text-gray-500 group-hover:text-gray-300' : 'text-slate-400 group-hover:text-slate-600'}
            ${isRichLabel ? 'border-b border-dotted border-celestial-gold/50' : ''}`}>
        {labelText}
      </span>
      {isRichLabel && (
        <div className={`p-0.5 rounded-lg shadow-lg border ${isDark ? 'bg-celestial-gold/10 text-celestial-gold border-celestial-gold/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
          <Info className="w-3 h-3" />
        </div>
      )}
      <InsightTooltip label={resolvedLabel} isVisible={isTooltipVisible} />
    </div>
  );

  if (isCircuitOpen) {
    return (
      <div className={`${wrapperClasses} p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center animate-fade-in`}>
        <div className="relative mb-4">
          <ShieldAlert className="w-10 h-10 text-rose-500 animate-pulse relative z-10" />
          {isDark && <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 animate-pulse" />}
        </div>
        <div className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em]">Logic Breach Protection</div>
        <p className="text-[10px] text-gray-500 mt-2 font-light italic leading-relaxed">High data density detected.</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            universalIntelligence.agentUpdate(componentId, { growth: { ...growth, circuitStatus: 'CLOSED', heat: 0 } });
          }}
          className="mt-6 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black transition-all active:scale-95 shadow-xl uppercase tracking-widest"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2 inline-block" /> Re-sync Node
        </button>
      </div>
    );
  }

  if (mode === 'compact') {
    return (
      <div
        className={`${wrapperClasses} p-3 rounded-xl flex items-center gap-3 border shadow-sm`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={onClick ? "button" : "region"}
        tabIndex={onClick ? 0 : undefined}
      >
        {EvolutionStars}
        {HeatWave}
        <div className={`p-2 rounded-lg ${isDark ? theme.iconBg + ' ' + theme.text + ' border-white/5' : 'bg-slate-50 ' + theme.text + ' border-slate-100'} border shrink-0 relative transition-transform duration-500 group-hover:scale-110`}>
          {Icon ? <Icon className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          {witness && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-celestial-gold rounded-full border border-white dark:border-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-1.5 h-1.5 text-slate-900 dark:text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {LabelWithIcon}
            {trend && (() => {
              const Icon = TREND_ICONS[trend.direction];
              const isPositive = trend.direction === 'up';
              const isNegative = trend.direction === 'down';
              return <Icon className={`w-3 h-3 ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`} />;
            })()}
          </div>
          <div className={`text-sm font-black font-mono tracking-tighter ${theme.text} transition-all duration-500 group-hover:scale-105`}>{value}</div>
        </div>
        <ConfidenceIndicator level={confidence} verified={verified} compact />
      </div>
    );
  }

  if (mode === 'card') {
    return (
      <div
        className={`${wrapperClasses} rounded-[2.5rem] overflow-hidden group border`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={onClick ? "button" : "region"}
        tabIndex={onClick ? 0 : undefined}
      >
        {EvolutionStars}
        {TrendIndicator}
        {HeatWave}
        <div className="relative z-10 p-7 flex flex-col h-full justify-between gap-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {LabelWithIcon}
                <QuantumAiTrigger onClick={onAiAnalyze} label={labelText} />
              </div>
              <div className="flex flex-wrap gap-2">
                {dataLink && <DataLinkIndicator type={dataLink} />}
                {traits && traits.length > 0 && traits.map((trait, index) => (
                  <div key={index} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                       ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200'}`}>
                    <Puzzle className="w-2.5 h-2.5" />
                    {trait}
                  </div>
                ))}
                {tags && tags.length > 0 && tags.map((tag, index) => (
                  <div key={index} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                       ${isDark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'border-white/5 ' + theme.iconBg + ' ' + theme.text : 'border-slate-100 bg-slate-50 ' + theme.text} transition-all duration-700 shrink-0 ml-3 group-hover:scale-110 group-hover:rotate-6 relative`}>
              {Icon ? <Icon className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
              {witness && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-celestial-gold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <ShieldCheck className="w-2 h-2 text-slate-900 dark:text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            <QuantumValueEditor value={value || 0} theme={theme} />
          </div>

          <div className="flex items-end justify-between border-t border-slate-100 dark:border-white/[0.03] pt-4">
            <div className="truncate flex-1 mr-3">
              {subValue && <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase truncate tracking-widest">{subValue}</p>}
              {isHighFrequency && isDark && (
                <div className="flex items-center gap-2 mt-3 text-[9px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                  <Activity className="w-3 h-3" /> Peak Performance
                </div>
              )}
            </div>
            <ConfidenceIndicator level={confidence} verified={verified} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div
        className={`${wrapperClasses} p-4 rounded-2xl flex items-center justify-between border shadow-sm`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={onClick ? "button" : "listitem"}
        tabIndex={onClick ? 0 : undefined}
      >
        {EvolutionStars}
        {HeatWave}
        <div className="flex items-center gap-5 min-w-0 flex-1 relative z-10">
          <div className={`p-3 rounded-xl ${isDark ? theme.iconBg + ' ' + theme.text + ' border-white/5' : 'bg-slate-50 ' + theme.text + ' border-slate-100'} border shrink-0 relative transition-transform duration-700 group-hover:scale-110`}>
            {Icon ? <Icon className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            {isAgentActive && isDark && <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-white animate-pulse" />}
            {witness && (
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-celestial-gold rounded-full border border-white dark:border-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-1.5 h-1.5 text-slate-900 dark:text-white" />
              </div>
            )}
          </div>
          <div className="leading-tight min-w-0 flex-1">
            <div className="flex items-center gap-3 overflow-hidden mb-1">
              {LabelWithIcon}
              <QuantumAiTrigger onClick={onAiAnalyze} label={labelText} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {subValue && <span className="text-slate-400 dark:text-gray-600 font-bold uppercase text-[9px] tracking-widest truncate">{subValue}</span>}
              {traits && traits.length > 0 && traits.slice(0, 2).map((trait, index) => (
                <span key={index} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border
                          ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200'}`}>
                  <Puzzle className="w-2 h-2" />
                  {trait}
                </span>
              ))}
              {tags && tags.length > 0 && tags.slice(0, 2).map((tag, index) => (
                <span key={index} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border
                          ${isDark ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right px-2 shrink-0 ml-5 relative z-10">
          <div className="flex items-center gap-2">
            <div className={`text-lg font-black font-mono tracking-tighter whitespace-nowrap transition-all duration-700 group-hover:scale-110 ${theme.text}`}>{value}</div>
            {trend && (() => {
              const Icon = TREND_ICONS[trend.direction];
              const isPositive = trend.direction === 'up';
              const isNegative = trend.direction === 'down';
              return <Icon className={`w-4 h-4 ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'} transition-all duration-300`} />;
            })()}
          </div>
          <div className="mt-0.5 flex justify-end">
            <ConfidenceIndicator level={confidence} verified={verified} compact />
          </div>
        </div>
      </div>
    );
  }

  // === MODE: CELL ===
  if (mode === 'cell') {
    const cellInteractiveProps = onClick ? {
      role: 'button',
      tabIndex: 0,
      onKeyDown: handleKeyDown,
      'aria-label': `${label || 'Metric'}, value is ${value}`
    } : {};

    return (
      <div className={`${wrapperClasses} p-4 rounded-xl flex flex-col justify-between h-full`} onClick={onClick} {...cellInteractiveProps}>
        <div className="flex justify-between items-start">
          {LabelWithIcon}
          <QuantumAiTrigger onClick={onAiAnalyze} label={labelText} />
        </div>
        <div className={`text-xl font-bold text-white mt-2 ${theme.text} transition-all duration-500 group-hover:scale-105`}>
          {value}
        </div>
        {trend && (
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1 text-[10px]">
            {(() => {
              const Icon = TREND_ICONS[trend.direction];
              const isPositive = trend.direction === 'up';
              const isNegative = trend.direction === 'down';
              return (
                <>
                  <Icon className={`w-3 h-3 ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span className={`${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`}>
                    {Math.abs(trend.value)}%
                  </span>
                </>
              );
            })()}
          </div>
        )}
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        <div className="flex justify-end mt-2">
          <ConfidenceIndicator level={confidence} verified={verified} compact />
        </div>
      </div>
    );
  }

  return null;
});

export const OmniEsgCell = withUniversalProxy(OmniEsgCellBase);
