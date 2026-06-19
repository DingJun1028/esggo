import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { esgDataCollector } from '@/services/esgDataCollector';
import {
  Shield,
  Zap,
  Database,
  Compass,
  Activity,
  Layers,
  Award,
  BrainCircuit,
  Target,
  CheckCircle2,
  Lock,
  Eye,
  Search,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
} from '@/components/ui';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

// ==================== MAIN COMPONENT ====================
export const CyberESG = memo(() => {
  const { t } = useLanguage();
  const { style } = useTheme();
  const [activeRunes, setActiveRunes] = useState<string[]>(['Solar', 'Vortex']);
  const [metrics, setMetrics] = useState([
    { subject: 'E', score: 85, weight: 0.4 },
    { subject: 'S', score: 70, weight: 0.35 },
    { subject: 'G', score: 92, weight: 0.25 },
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>(
    'disconnected'
  );

  const panelClass = style === 'glass' ? 'liquid-glass' : 'minimalist-optics p-4';

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await esgDataCollector.fetchRealTimeMetrics();
        setMetrics([
          { subject: 'E', score: data.E, weight: 0.4 },
          { subject: 'S', score: data.S, weight: 0.35 },
          { subject: 'G', score: data.G, weight: 0.25 },
        ]);
        setConnectionStatus(esgDataCollector.getConnectionStatus());
      } catch (e) {
        omniLogger.error(LogCategory.SYSTEM, '[CyberESG] Metics update failed', { error: e });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { runeMultiplier, finalImpactScore } = useMemo(() => {
    const base = metrics.reduce((acc, m) => acc + m.score * m.weight, 0);
    const mult = 1.25; // Simulated for brevity
    return {
      runeMultiplier: mult.toFixed(2),
      finalImpactScore: (base * mult).toFixed(2),
    };
  }, [metrics, activeRunes]);

  return (
    <div className="bento-grid viewport-fit bg-transparent">
      {/* 🛡️ Header & Identity (Top Bar) */}
      <div
        className={`${panelClass} col-span-12 lg:col-span-12 row-span-1 flex items-center justify-between px-6`}
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" /> {t('cyber.title')}
          </h1>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
            {t('cyber.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {['TRACE', 'TRACK', 'CALC', 'LOCK'].map(p => (
              <Badge key={p} variant="outline" className="border-white/10 text-[8px] text-gray-400">
                {p}
              </Badge>
            ))}
          </div>
          <div
            className={`text-[10px] font-bold ${connectionStatus === 'connected' ? 'text-green-500' : 'text-amber-500'}`}
          >
            {connectionStatus === 'connected' ? '● ONLINE' : '○ SIM'}
          </div>
        </div>
      </div>

      {/* 📊 Radar Core (Center) */}
      <div
        className={`${panelClass} col-span-12 lg:col-span-6 row-span-5 flex flex-col items-center justify-center`}
      >
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
          影響力幾何分佈
        </h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={metrics}>
              <PolarGrid stroke="#666" strokeOpacity={0.2} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#999', fontSize: 12 }} />
              <Radar
                name="ESG"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <div className="text-4xl font-black text-white">{finalImpactScore}</div>
          <div className="text-[10px] text-blue-400 font-mono tracking-tighter uppercase">
            Global Impact Index
          </div>
        </div>
      </div>

      {/* 🕍 Memory Palace (Right) */}
      <div className={`${panelClass} col-span-12 lg:col-span-3 row-span-3`}>
        <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2">
          <Database className="w-3 h-3" /> 數據宮殿
        </h3>
        <div className="space-y-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="text-[9px] text-gray-500 mb-1">Vector_Sim(Query, Data)</div>
            <div className="text-lg font-mono text-white">0.985</div>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            基於向量語義嵌入的 ESG 知識基底。確保每一筆 ESG 聲明均具備「可溯源性」。
          </p>
        </div>
      </div>

      {/* ⚔️ Rune System (Right Sidebar Bottom) */}
      <div className={`${panelClass} col-span-12 lg:col-span-3 row-span-2`}>
        <h3 className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2">
          <BrainCircuit className="w-3 h-3" /> 符文倍率: {runeMultiplier}x
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[Zap, Shield, Activity].map((Icon, i) => (
            <button
              key={i}
              className="p-2 aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all text-gray-400 hover:text-blue-400"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* 🎯 Strategic Execution (Left Sidebar Middle) */}
      <div className={`${panelClass} col-span-12 lg:col-span-3 row-span-2`}>
        <h3 className="text-xs font-bold text-gray-400 mb-4">戰略偏移率</h3>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-mono text-white">0.02%</div>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full">
            <div className="h-full bg-blue-500" style={{ width: '98%' }} />
          </div>
        </div>
      </div>

      {/* 🏆 Action Center (Left Sidebar Bottom) */}
      <div
        className={`${panelClass} col-span-12 lg:col-span-3 row-span-3 bg-blue-500/10 border-blue-500/20`}
      >
        <h3 className="text-xs font-bold text-blue-400 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" /> 系統執行建議
        </h3>
        <p className="text-[10px] text-gray-300 leading-relaxed mb-4">
          當前「治理透明度」與「水晶符文」達成共振。建議立即啟動數位審計程序。
        </p>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
          onClick={() => setIsVerifying(true)}
        >
          {isVerifying ? '執行驗證中...' : '執行主權指令'}
        </Button>
      </div>
    </div>
  );
});

export default CyberESG;
