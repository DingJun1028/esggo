import React from 'react';
import {
  OmniComponent,
  OmniLabel,
  OmniIndicator,
  OmniBoundary,
  OmniCell,
  OmniESGcell,
} from '@/components/ui';
import { motion } from 'framer-motion';

/**
 * 🎨 奧秘系列展示頁面 / Omni Series Showcase
 * --------------------------------------------------
 * [TC] 展示奧秘系列（Omni Series）核心組件的視覺效果與架構功能。
 * [EN] Demonstrates the visuals and architectural features of the Omni Series components.
 */
export const OmniSeriesShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#02040a] p-10 space-y-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black text-[#0df2ee] tracking-tight mb-2">
          奧秘系列 / Omni Series
        </h1>
        <h2 className="text-xl font-bold text-white/40 tracking-[0.2em] uppercase mb-4">
          君愛元鑰 | JunAiKey Semantic Matrix
        </h2>
        <p className="text-slate-400 max-w-2xl">
          基於 V6 覺醒架構開發的高級 UI 元件庫。遵循 5T 協議，提供液態玻璃動態美學與雙向語言支持。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Flagship: OmniComponent */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Flagship Component
          </h2>
          <OmniComponent title="Resonance" resonance={0.88} status="RESONATING">
            <p className="text-sm text-slate-300 leading-relaxed">
              這是奧秘系列的核心元件。它封裝了共鳴偵測、自動修復狀態以及雙語術語映射。
            </p>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5 text-[10px] font-mono text-cyan-400">
              HASH: 0x88...FF01_V6
            </div>
          </OmniComponent>
        </div>

        {/* Boundary & Indicators */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Boundary & Status
          </h2>
          <OmniBoundary title="Governance" status="LOCKED">
            <div className="space-y-4">
              <OmniIndicator type="GOVERNANCE" level={0.95} />
              <div className="h-20 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                <span className="text-[10px] text-slate-600 uppercase font-black">
                  Content Area
                </span>
              </div>
            </div>
          </OmniBoundary>
        </div>

        {/* Labels & Localization */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Semantic Labeling
          </h2>
          <div className="glass-panel-premium p-6 space-y-6">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-slate-500 uppercase">Localized Terms:</span>
              <OmniLabel term="Omni" size="lg" />
              <OmniLabel term="Resonance" size="md" className="text-cyan-400" />
              <OmniLabel term="Crystal" size="sm" className="text-purple-400" />
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-slate-500 italic">
                * Labels are automatically generated via OmniI18nEngine.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* High Density Units: Cells */}
      <div className="space-y-6">
        <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          High Density Units (Cells)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <OmniCell
            label="Throughput"
            value="1.2k"
            subValue="req/sec"
            trend="UP"
            trendValue="12%"
          />
          <OmniCell label="Latency" value="42ms" status="SYNCING" trend="DOWN" trendValue="4ms" />
          <OmniESGcell type="ENVIRONMENTAL" value="0.92" trend="UP" trendValue="0.05" />
          <OmniESGcell type="SOCIAL" value="88" status="LOCKED" />
          <OmniESGcell type="GOVERNANCE" value="99%" trend="NEUTRAL" trendValue="Stable" />
          <OmniCell
            label="Uptime"
            value="99.9"
            subValue="Target: 100"
            onClick={() => alert('Omni Cell Interacted')}
          />
        </div>
      </div>

      {/* Decorative Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 text-center">
        <div className="inline-block px-4 py-1 rounded-full bg-[#0df2ee]/10 border border-[#0df2ee]/20">
          <span className="text-[10px] font-black text-[#0df2ee] tracking-widest uppercase">
            One in All | All in One
          </span>
        </div>
      </motion.div>
    </div>
  );
};
