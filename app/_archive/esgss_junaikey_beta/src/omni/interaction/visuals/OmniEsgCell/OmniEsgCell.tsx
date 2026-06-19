/**
 * OmniEsgCell React Component
 *
 * Integrates Omni Proxy + Evolution Engine + JunAiKey Crystal Core.
 */

import React, { useEffect, useState } from 'react';
import { withOmniProxy } from '../../../../core/OmniProxy.tsx';
import { useEvolution } from '../../../../hooks/useEvolution.ts';
import { OmniEsgCellCrystal } from './OmniEsgCellCrystal.ts';
import { useOmniRectification } from '../../../../hooks/useOmniRectification.ts';
import type { OmniLabel, OmniEsgDataLink, OmniEsgColor } from '../../../../types/index.ts';
import { Info, Shield, Zap } from 'lucide-react';

export interface OmniEsgCellProps {
  id?: string;
  mode?: 'card' | 'list' | 'cell' | 'badge' | 'compact';
  label?: string;
  value?: string | number;
  subValue?: string;
  confidence?: 'high' | 'medium' | 'low';
  verified?: boolean;
  loading?: boolean;
  dataLink?: OmniEsgDataLink;
  color?: OmniEsgColor;
  unit?: string;
  icon?: any;
  tags?: string[];
  onAutomationTrigger?: () => void;
  omniLabel?: OmniLabel;
  traits?: string[]; // simplified
  trend?: { value: number; direction: 'up' | 'down' };

  onAiAnalyze?: () => void;
  onClick?: () => void;
  onOpenNote?: (id: string) => void;
}

/**
 * OmniEsgCell Base Component
 */
const OmniEsgCellBase: React.FC<OmniEsgCellProps> = props => {
  const { label = 'Metric', value, mode = 'cell', omniLabel } = props;
  const [crystal] = useState(() => new OmniEsgCellCrystal());
  const [initialized, setInitialized] = useState(false);
  const [uiConfig, setUiConfig] = useState<any>(null);

  // Self-growth mechanism
  const { hotActions, recommendations } = useEvolution('OmniEsgCell');

  // Entropy reduction reinforcement mechanism (Best Practice: Entropy Reduction)
  const {
    value: rectifiedValue,
    isRectified,
    meta: recoveryMeta,
  } = useOmniRectification(value, props.id || label);

  // Initialize crystal
  useEffect(() => {
    crystal.initialize().then(() => {
      setInitialized(true);
    });
  }, [crystal]);

  // Execute data processing
  useEffect(() => {
    if (!initialized) return;

    crystal
      .execute({
        input: {
          label,
          value: rectifiedValue, // Use rectified value
          confidence: props.confidence,
          dataLink: props.dataLink,
          omniLabel,
        },
      })
      .then(result => {
        if (result.success) {
          setUiConfig(result.output);
        }
      });
  }, [initialized, label, rectifiedValue, props.confidence, props.dataLink, omniLabel, crystal]);

  // Loading status
  if (props.loading || !uiConfig) {
    return <div className="animate-pulse bg-white/5 rounded-xl h-32" />;
  }

  // Simplified rendering (actual should render different styles based on mode)
  return (
    <div
      className={`
        p-6 rounded-xl bg-slate-900/40 border transition-all duration-300 relative group
        ${isRectified ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] bg-amber-500/5' : 'border-white/5'}
        hover:bg-white/5 
        ${props.onClick ? 'cursor-pointer' : ''}
      `}
      onClick={props.onClick}
    >
      {/* 4+1 Protocol Status Indicator */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <div title="4+1 Protocol: Traceable" className="text-emerald-500">
          <Shield size={10} />
        </div>
        <div title="4+1 Protocol: Immutable" className="text-blue-500">
          <Zap size={10} />
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-400">{uiConfig.label}</div>
            {isRectified && (
              <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-black border border-amber-500/30 animate-pulse">
                RECTIFIED
              </span>
            )}
          </div>
          <div
            className={`text-2xl font-bold mt-2 ${isRectified ? 'text-amber-400' : 'text-white'}`}
          >
            {uiConfig.value}
            {props.unit && (
              <span className="text-xs ml-1 opacity-50 font-normal">{props.unit}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {props.onAiAnalyze && (
            <button
              onClick={e => {
                e.stopPropagation();
                props.onAiAnalyze?.();
              }}
              className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-400"
              title="AI Analysis"
            >
              ??{' '}
            </button>
          )}
          {isRectified && recoveryMeta && (
            <div
              className="p-2 rounded-lg bg-amber-500/20 text-amber-400 cursor-help"
              title={`Witness: ${recoveryMeta.witnessSignature}\nStrategy: ${recoveryMeta.strategyUsed}`}
            >
              <Info size={14} />
            </div>
          )}
        </div>
      </div>

      {/* 4+1 Protocol Footer Metadata */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-600">
        <span className="truncate max-w-[120px]">
          Origin: {omniLabel?.source_origin || 'system_core'}
        </span>
        <span>UUID: {props.id?.slice(0, 8) || omniLabel?.uuid?.slice(0, 8) || 'AUTO-G'}</span>
      </div>

      {/* Evolution Recommendations (Development Mode) */}
      {process.env.NODE_ENV === 'development' && recommendations.length > 0 && (
        <div className="mt-3 text-[9px] text-gray-500 italic">? {recommendations[0]}</div>
      )}
    </div>
  );
};

/**
 * ??Bolt Optimization: Custom equality check to prevent re-renders when parent passes new object literals
 * (e.g. trend={{...}}) but the content is the same.
 */
const areEsgPropsEqual = (prev: OmniEsgCellProps, next: OmniEsgCellProps): boolean => {
  // 1. Check Primitives & simple refs
  const keys: (keyof OmniEsgCellProps)[] = [
    'id',
    'mode',
    'label',
    'value',
    'subValue',
    'confidence',
    'verified',
    'loading',
    'dataLink',
    'color',
    'unit',
    'icon',
    'onAutomationTrigger',
    'onAiAnalyze',
    'onClick',
    'onOpenNote',
  ];

  for (const key of keys) {
    if (prev[key] !== next[key]) return false;
  }

  // 2. Check OmniLabel (Deep)
  // ⚡Bolt Optimization: Deep check to prevent re-renders on transient objects
  if (JSON.stringify(prev.omniLabel) !== JSON.stringify(next.omniLabel)) return false;

  // 3. Check Trend (Deep)
  const pTrend = prev.trend;
  const nTrend = next.trend;
  if (pTrend !== nTrend) {
    if (!pTrend || !nTrend) return false; // One is null/undefined
    if (pTrend.value !== nTrend.value || pTrend.direction !== nTrend.direction) return false;
  }

  // 4. Check Tags (Array)
  const pTags = prev.tags;
  const nTags = next.tags;
  if (pTags !== nTags) {
    if (!pTags || !nTags) return false;
    if (pTags.length !== nTags.length) return false;
    for (let i = 0; i < pTags.length; i++) {
      if (pTags[i] !== nTags[i]) return false;
    }
  }

  // 5. Traits (Array)
  const pTraits = prev.traits;
  const nTraits = next.traits;
  if (pTraits !== nTraits) {
    if (!pTraits || !nTraits) return false;
    if (pTraits.length !== nTraits.length) return false;
    for (let i = 0; i < pTraits.length; i++) {
      if (pTraits[i] !== nTraits[i]) return false;
    }
  }

  return true;
};

/**
 * Export Omni Proxy enhanced version
 */
const OmniEsgCellProxied = withOmniProxy(OmniEsgCellBase, {
  enableTracking: true,
  enableCircuitBreaker: true,
});

// ??Bolt: Memoize the component with custom comparator
export const OmniEsgCell = React.memo(OmniEsgCellProxied, areEsgPropsEqual);

OmniEsgCell.displayName = 'OmniEsgCell';
