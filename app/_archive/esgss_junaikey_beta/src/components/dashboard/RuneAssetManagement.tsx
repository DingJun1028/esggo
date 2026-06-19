import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Shield,
  Hexagon,
  Zap,
  Database,
  Layers,
  Lock,
  Cpu,
  Orbit,
  Activity,
  Box,
  TrendingUp,
  Fingerprint,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button, Progress, Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

// ==================== TYPE DEFINITIONS ====================
interface AssetHexProps {
  readonly title: string;
  readonly value: string;
  readonly unit: string;
  readonly color: string;
  readonly icon: React.ElementType;
  readonly glow: string;
}

interface LedgerItemProps {
  readonly hash: string;
  readonly impact: string;
  readonly type: string;
  readonly timestamp: string;
}

// ==================== SUB-COMPONENTS ====================
const AssetHex = memo<AssetHexProps>(({ title, value, unit, icon: Icon, color, glow }) => {
  const { style } = useTheme();
  const glassClass =
    style === 'glass'
      ? 'liquid-glass bg-black/40 backdrop-blur-md border-white/10'
      : 'minimalist-optics bg-white/5 border-white/10';

  return (
    <article
      className={`relative group cursor-pointer ${glassClass} p-4 rounded-2xl flex flex-col items-center justify-center transition-all hover:-translate-y-1 h-full`}
    >
      <div
        className={`absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500 ${glow}`}
        aria-hidden="true"
      />
      <div className="mb-2 p-2 rounded-full bg-white/5 border border-white/5 text-white/80 group-hover:scale-110 transition-transform relative z-10">
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 relative z-10">
        {title}
      </span>
      <div className="text-lg font-mono font-bold text-white relative z-10">
        {value}
        <span className="text-[10px] ml-1 text-gray-500">{unit}</span>
      </div>
      <div className="mt-2 w-full h-[2px] bg-white/5 overflow-hidden relative z-10">
        <div className="h-full animate-pulse" style={{ width: '70%', backgroundColor: color }} />
      </div>
    </article>
  );
});
AssetHex.displayName = 'AssetHex';

const LedgerItem = memo<LedgerItemProps>(({ hash, impact, type, timestamp }) => (
  <div className="flex items-center justify-between p-2 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded border border-white/10 flex items-center justify-center bg-black">
        <Fingerprint size={12} className="text-[#00FFC8]/50" />
      </div>
      <div>
        <p className="text-[10px] font-mono text-gray-400 hover:text-[#00FFC8] transition-colors">
          {hash}
        </p>
        <time className="text-[8px] text-gray-600 uppercase tracking-tighter">{timestamp}</time>
      </div>
    </div>
    <div className="text-right">
      <div className="text-[10px] font-bold text-[#00FFC8]">+{impact}</div>
      <div className="text-[8px] text-gray-500 uppercase">{type}</div>
    </div>
  </div>
));
LedgerItem.displayName = 'LedgerItem';

// ==================== MAIN COMPONENT ====================
export const RuneAssetManagement = memo(() => {
  const { style } = useTheme();
  const [smeltProgress, setSmeltProgress] = useState(0);
  const [isSmelting, setIsSmelting] = useState(false);

  // Inject spin-slow CSS animation safely (avoids dangerouslySetInnerHTML)
  useEffect(() => {
    const id = 'rune-spin-slow-style';
    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      styleEl.textContent = '@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 8s linear infinite; }';
      document.head.appendChild(styleEl);
    }
    return () => { };
  }, []);

  useEffect(() => {
    if (!isSmelting) return;
    const interval = setInterval(() => {
      setSmeltProgress(prev => {
        if (prev >= 100) {
          setIsSmelting(false);
          return 0;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isSmelting]);

  const handleInitiateInfusion = useCallback(() => setIsSmelting(true), []);

  const glassPanelClass =
    style === 'glass'
      ? 'liquid-glass bg-black/40 backdrop-blur-md border-white/10 shadow-lg'
      : 'minimalist-optics bg-white/5 border-white/10 hover:border-blue-500/30';

  return (
    <div className="h-full w-full p-4 overflow-hidden flex flex-col gap-4">
      {/* Header: Sovereign Maturity */}
      <div
        className={`shrink-0 ${glassPanelClass} rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group`}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00FFC8] to-[#BFAE42]" />
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full border-2 border-[#BFAE42]/20 flex items-center justify-center bg-black/50">
            <Orbit className="text-[#BFAE42] animate-spin-slow" size={20} />
            <span className="absolute -bottom-1 bg-[#BFAE42] text-black text-[8px] font-bold px-1 rounded">
              LVL 4
            </span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white uppercase italic">
              Sovereign Maturity
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest text-[#00FFC8] font-bold">
                NEXT: ORACLE
              </span>
              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00FFC8] to-[#BFAE42] w-[62%]" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Multiplier</p>
            <p className="text-lg font-mono text-[#00FFC8]">1.4x</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">ID</p>
            <p className="text-lg font-mono text-gray-300">#JS-001</p>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Left Col: Vault (3 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 min-h-0">
          <AssetHex
            title="Carbon Credits"
            value="4,250"
            unit="mt"
            color="#00FFC8"
            icon={TrendingUp}
            glow="bg-[#00FFC8]"
          />
          <AssetHex
            title="Social Capital"
            value="1,120"
            unit="pts"
            color="#BFAE42"
            icon={Database}
            glow="bg-[#BFAE42]"
          />
          <AssetHex
            title="Governance"
            value="892"
            unit="GT"
            color="#3b82f6"
            icon={Shield}
            glow="bg-blue-500"
          />
        </div>

        {/* Center Col: Forge (6 cols) */}
        <div
          className={`col-span-12 lg:col-span-6 ${glassPanelClass} rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-0`}
        >
          <div className="absolute top-4 right-4 opacity-10">
            <Cpu size={100} />
          </div>

          <h2 className="text-base font-bold text-white uppercase italic mb-6">
            RUNE Infusion Forge
          </h2>

          {/* Forge Visual */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <div
              className={`absolute inset-0 rounded-full border-4 border-dashed border-[#BFAE42]/20 ${isSmelting ? 'animate-spin-slow' : ''}`}
            />
            <div
              className="absolute inset-4 rounded-full bg-gradient-to-tr from-black to-[#111114] flex items-center justify-center border border-white/10 z-10 hover:scale-105 transition-transform cursor-pointer"
              onClick={handleInitiateInfusion}
            >
              <Zap
                size={48}
                className={`${isSmelting ? 'text-[#BFAE42] drop-shadow-[0_0_20px_#BFAE42]' : 'text-white/10'} transition-all duration-300`}
              />
            </div>
            {isSmelting && (
              <div className="absolute -inset-8 rounded-full border border-[#00FFC8]/30 animate-ping" />
            )}
          </div>

          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
              <span>Integrity</span>
              <span className={smeltProgress > 0 ? 'text-[#00FFC8]' : ''}>{smeltProgress}%</span>
            </div>
            <Progress
              value={smeltProgress}
              className="h-1 bg-white/5"
              indicatorClassName="bg-[#00FFC8] shadow-[0_0_10px_#00FFC8]"
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="p-3 rounded bg-white/5 border border-white/5 text-center">
              <span className="text-[9px] text-gray-500 uppercase">Input Payload</span>
              <div className="text-sm font-mono text-[#00FFC8]">14.2 kWh</div>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5 text-center">
              <span className="text-[9px] text-gray-500 uppercase">Yield</span>
              <div className="text-sm font-mono text-[#BFAE42]">+1.24 RUNE</div>
            </div>
          </div>
        </div>

        {/* Right Col: Ledger (3 cols) */}
        <div
          className={`col-span-12 lg:col-span-3 ${glassPanelClass} rounded-2xl flex flex-col min-h-0`}
        >
          <div className="p-3 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Layers size={12} className="text-[#00FFC8]" /> Ledger
            </h3>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFC8] animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            <LedgerItem
              hash="0x8f...2a4d"
              impact="4.20"
              type="Energy Infusion"
              timestamp="2m ago"
            />
            <LedgerItem
              hash="0x4e...91bc"
              impact="12.5"
              type="Diversity Bonus"
              timestamp="14m ago"
            />
            <LedgerItem hash="0x1a...55fe" impact="0.85" type="Governance" timestamp="1h ago" />
            <LedgerItem hash="0xdd...cc21" impact="25.0" type="Audit" timestamp="3h ago" />
            <LedgerItem hash="0xbc...778a" impact="2.10" type="Infusion" timestamp="5h ago" />
            <LedgerItem hash="0x99...ff33" impact="1.45" type="Solar Feed" timestamp="1d ago" />
            <LedgerItem hash="0x52...11aa" impact="15.2" type="Supply" timestamp="1d ago" />
            <LedgerItem hash="0x11...22bb" impact="3.30" type="Community" timestamp="2d ago" />
          </div>
        </div>
      </div>

      {/* CSS injected via useEffect to avoid dangerouslySetInnerHTML */}
    </div>
  );
});
RuneAssetManagement.displayName = 'RuneAssetManagement';
