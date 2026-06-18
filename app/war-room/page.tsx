'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Users,
  Leaf,
  Building2,
  Factory,
  Truck,
  Zap,
  Droplets,
  Flame,
  Eye,
  Target,
  ArrowRight,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';

/* ─── Types ─── */
interface RiskNode {
  id: string;
  name: string;
  type: 'supplier' | 'facility' | 'logistics' | 'energy';
  risk: 'low' | 'medium' | 'high' | 'critical';
  x: number;
  y: number;
  connections: string[];
  details: {
    co2: number;
    compliance: number;
    lastAudit: string;
    issues: string[];
  };
}

interface PestelFactor {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  score: number;
  trend: 'up' | 'down' | 'stable';
  factors: { name: string; impact: number; description: string }[];
}

/* ─── Mock Data ─── */
const RISK_NODES: RiskNode[] = [
  {
    id: 'n1',
    name: '供應商 A',
    type: 'supplier',
    risk: 'high',
    x: 20,
    y: 30,
    connections: ['n2', 'n3'],
    details: {
      co2: 1250,
      compliance: 65,
      lastAudit: '2025-11-15',
      issues: ['Scope 3 數據缺失', '未通過 4T 驗證'],
    },
  },
  {
    id: 'n2',
    name: '工廠 B',
    type: 'facility',
    risk: 'medium',
    x: 50,
    y: 20,
    connections: ['n1', 'n4'],
    details: { co2: 3400, compliance: 82, lastAudit: '2026-01-10', issues: ['能源效率待改善'] },
  },
  {
    id: 'n3',
    name: '物流 C',
    type: 'logistics',
    risk: 'low',
    x: 80,
    y: 40,
    connections: ['n1', 'n4'],
    details: { co2: 890, compliance: 95, lastAudit: '2026-01-15', issues: [] },
  },
  {
    id: 'n4',
    name: '能源 D',
    type: 'energy',
    risk: 'critical',
    x: 65,
    y: 65,
    connections: ['n2', 'n3'],
    details: {
      co2: 5600,
      compliance: 45,
      lastAudit: '2025-09-20',
      issues: ['煤炭依賴過高', '未制定轉型計劃', 'ZKP 驗證過期'],
    },
  },
];

const PESTEL_FACTORS: PestelFactor[] = [
  {
    id: 'political',
    name: '政治',
    icon: Building2,
    score: 72,
    trend: 'up',
    factors: [
      { name: 'CBAM 碳邊境稅', impact: 85, description: '歐盟 CBAM 申報期程異動，需加速準備' },
      { name: '台灣碳費制度', impact: 70, description: '2025 年碳費徵收上路' },
    ],
  },
  {
    id: 'economic',
    name: '經濟',
    icon: TrendingUp,
    score: 65,
    trend: 'stable',
    factors: [
      { name: '綠色融資', impact: 75, description: 'ESG 評級影響融資成本' },
      { name: '供應鏈成本', impact: 60, description: '原材料價格波動' },
    ],
  },
  {
    id: 'social',
    name: '社會',
    icon: Users,
    score: 80,
    trend: 'up',
    factors: [
      { name: '勞工權益', impact: 85, description: '供應鏈勞工標準要求提高' },
      { name: '社區關係', impact: 70, description: '在地社區對環境影響關注' },
    ],
  },
  {
    id: 'technological',
    name: '科技',
    icon: Zap,
    score: 55,
    trend: 'up',
    factors: [
      { name: 'AI 碳排監測', impact: 80, description: '新技術可提升數據準確度' },
      { name: '區塊鏈溯源', impact: 65, description: '供應鏈透明度技術成熟' },
    ],
  },
  {
    id: 'environmental',
    name: '環境',
    icon: Leaf,
    score: 45,
    trend: 'down',
    factors: [
      { name: '氣候風險', impact: 90, description: '極端天氣影響供應鏈穩定性' },
      { name: '水資源壓力', impact: 75, description: '生產據點水資源風險' },
    ],
  },
  {
    id: 'legal',
    name: '法規',
    icon: ShieldCheck,
    score: 70,
    trend: 'up',
    factors: [
      { name: 'ISSB 準則', impact: 85, description: '國際永續準則委員會新規' },
      { name: '金管會要求', impact: 70, description: '上市櫃公司永續報告書要求' },
    ],
  },
];

/* ─── Components ─── */

function RiskMap() {
  const riskColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-rose-500',
  };

  const riskGlow = {
    low: '',
    medium: 'breathing-glow-amber',
    high: 'breathing-glow',
    critical: '',
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <React.Fragment key={i}>
            <div
              className="absolute top-0 bottom-0 w-px bg-slate-400"
              style={{ left: `${(i + 1) * 10}%` }}
            />
            <div
              className="absolute left-0 right-0 h-px bg-slate-400"
              style={{ top: `${(i + 1) * 10}%` }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {RISK_NODES.map((node) =>
          node.connections.map((targetId) => {
            const target = RISK_NODES.find((n) => n.id === targetId);
            if (!target) return null;
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={node.risk === 'critical' ? '#EF4444' : '#94A3B8'}
                strokeWidth={node.risk === 'critical' ? 2 : 1}
                strokeDasharray={node.risk === 'low' ? '4,4' : 'none'}
                opacity={0.5}
              />
            );
          })
        )}
      </svg>

      {/* Risk Nodes */}
      {RISK_NODES.map((node) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative group cursor-pointer">
            {/* Pulse Ring for Critical */}
            {node.risk === 'critical' && (
              <span className="absolute -inset-2 rounded-full bg-rose-500/20 pulse-ring" />
            )}
            {/* Node Dot */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg',
                riskColors[node.risk],
                riskGlow[node.risk]
              )}
            >
              {node.name.charAt(0)}
            </div>
            {/* Label */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white rounded-lg px-2 py-1 shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <p className="text-[10px] font-bold text-[#003262]">{node.name}</p>
              <p className="text-[9px] text-slate-400">{node.details.co2} tCO₂e</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-slate-100">
        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">風險等級</p>
        <div className="flex gap-2">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1">
              <div className={cn('w-2 h-2 rounded-full', color)} />
              <span className="text-[9px] text-slate-500 capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PestelWheel() {
  const [activeFactor, setActiveFactor] = useState<string | null>(null);
  const centerX = 200;
  const centerY = 200;
  const radius = 120;

  return (
    <div className="relative">
      <svg viewBox="0 0 400 400" className="w-full h-[400px]">
        {/* Center Circle */}
        <circle cx={centerX} cy={centerY} r={40} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={1} />
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-[10px] font-bold"
          fill="#003262"
        >
          PESTEL
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          className="text-[8px]"
          fill="#94A3B8"
        >
          風險分析
        </text>

        {/* Factor Segments */}
        {PESTEL_FACTORS.map((factor, i) => {
          const angle = (i * 60 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const isActive = activeFactor === factor.id;

          return (
            <g
              key={factor.id}
              onClick={() => setActiveFactor(isActive ? null : factor.id)}
              className="cursor-pointer"
            >
              {/* Connection Line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth={1}
                opacity={0.5}
              />
              {/* Factor Circle */}
              <circle
                cx={x}
                cy={y}
                r={isActive ? 35 : 30}
                fill={isActive ? '#003262' : '#FFFFFF'}
                stroke="#E2E8F0"
                strokeWidth={2}
                className="transition-all duration-300"
              />
              {/* Score */}
              <text
                x={x}
                y={y - 5}
                textAnchor="middle"
                className={cn('text-sm font-black', isActive ? 'fill-white' : 'fill-[#003262]')}
              >
                {factor.score}
              </text>
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                className={cn('text-[8px] font-bold', isActive ? 'fill-white' : 'fill-[#94A3B8]')}
              >
                {factor.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Factor Detail Panel */}
      {activeFactor && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          {PESTEL_FACTORS.filter((f) => f.id === activeFactor).map((factor) => (
            <OmniBaseCard key={factor.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-50 rounded-lg">
                  <factor.icon size={16} className="text-cyan-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#003262]">{factor.name}因素</h4>
                  <p className="text-[10px] text-slate-400">風險分數: {factor.score}/100</p>
                </div>
              </div>
              <div className="space-y-2">
                {factor.factors.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-600">{f.name}</p>
                      <p className="text-[10px] text-slate-400">{f.description}</p>
                    </div>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          f.impact >= 80
                            ? 'bg-rose-500'
                            : f.impact >= 60
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        )}
                        style={{ width: `${f.impact}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </OmniBaseCard>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function RiskAlertCard({ node }: { node: RiskNode }) {
  const riskConfig = {
    low: {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      label: '低風險',
    },
    medium: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: '中風險',
    },
    high: {
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      label: '高風險',
    },
    critical: {
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      label: '危急',
    },
  };
  const config = riskConfig[node.risk];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn('bg-white rounded-xl border p-4 transition-all', config.border)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', config.bg, 'breathing-glow')} />
          <span className="text-sm font-bold text-[#003262]">{node.name}</span>
        </div>
        <span
          className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', config.bg, config.color)}
        >
          {config.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <span className="text-slate-400">CO₂</span>
          <p className="font-mono font-bold text-[#003262]">{node.details.co2} t</p>
        </div>
        <div>
          <span className="text-slate-400">合規</span>
          <p
            className={cn(
              'font-mono font-bold',
              node.details.compliance >= 80
                ? 'text-emerald-600'
                : node.details.compliance >= 60
                ? 'text-amber-600'
                : 'text-rose-600'
            )}
          >
            {node.details.compliance}%
          </p>
        </div>
      </div>
      {node.details.issues.length > 0 && (
        <div className="space-y-1">
          {node.details.issues.map((issue) => (
            <div key={issue} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <AlertTriangle size={10} className={config.color} />
              {issue}
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 pt-2 border-t border-slate-50 text-[9px] text-slate-400">
        最後稽核: {node.details.lastAudit}
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function WarRoomPage() {
  const [activeTab, setActiveTab] = useState<'map' | 'pestel' | 'alerts'>('map');

  const criticalNodes = RISK_NODES.filter((n) => n.risk === 'critical' || n.risk === 'high');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <Globe size={24} className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">戰情室</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  War Room · 供應鏈風險與 PESTEL 分析
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {criticalNodes.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full">
                  <AlertTriangle size={12} className="text-rose-500" />
                  <span className="text-xs font-bold text-rose-600">
                    {criticalNodes.length} 個高風險節點
                  </span>
                </div>
              )}
              <button className="px-3 py-1.5 bg-[#003262] text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                <Eye size={12} />
                實時監控
              </button>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'map' as const, label: '供應鏈風險地圖', icon: Globe },
            { id: 'pestel' as const, label: 'PESTEL 分析', icon: Target },
            { id: 'alerts' as const, label: '風險警示', icon: AlertTriangle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OmniBaseCard className="p-5">
                <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                  <Globe size={16} className="text-orange-500" />
                  供應鏈風險地圖
                </h3>
                <RiskMap />
              </OmniBaseCard>
            </div>
            <div className="space-y-4">
              <OmniBaseCard className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-3">風險摘要</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['critical', 'high', 'medium', 'low'] as const).map((level) => {
                    const count = RISK_NODES.filter((n) => n.risk === level).length;
                    return (
                      <div key={level} className="text-center py-2 bg-slate-50 rounded-lg">
                        <p className="text-lg font-black text-[#003262]">{count}</p>
                        <p className="text-[9px] text-slate-400 capitalize">{level}</p>
                      </div>
                    );
                  })}
                </div>
              </OmniBaseCard>
              <OmniBaseCard className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-3">關鍵指標</h3>
                <div className="space-y-3">
                  {[
                    { label: '總碳排', value: '11,140 tCO₂e', icon: Flame, color: 'text-rose-500' },
                    {
                      label: '供應鏈節點',
                      value: String(RISK_NODES.length),
                      icon: Factory,
                      color: 'text-blue-500',
                    },
                    {
                      label: '平均合規率',
                      value: '72%',
                      icon: ShieldCheck,
                      color: 'text-amber-500',
                    },
                    {
                      label: '待處理事項',
                      value: String(
                        RISK_NODES.reduce((sum, n) => sum + n.details.issues.length, 0)
                      ),
                      icon: AlertTriangle,
                      color: 'text-orange-500',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon size={12} className={item.color} />
                        <span className="text-xs text-slate-500">{item.label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#003262]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </OmniBaseCard>
            </div>
          </div>
        )}

        {activeTab === 'pestel' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OmniBaseCard className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                <Target size={16} className="text-orange-500" />
                PESTEL 風險輪盤
              </h3>
              <p className="text-xs text-slate-400 mb-4">點擊各因素查看详细風險分析</p>
              <PestelWheel />
            </OmniBaseCard>
            <OmniBaseCard className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4">因素總覽</h3>
              <div className="space-y-3">
                {PESTEL_FACTORS.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
                  >
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <factor.icon size={14} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#003262]">{factor.name}</span>
                        <span className="text-xs font-mono font-bold text-[#003262]">
                          {factor.score}
                        </span>
                      </div>
                      <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            factor.score >= 80
                              ? 'bg-rose-500'
                              : factor.score >= 60
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          )}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </OmniBaseCard>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RISK_NODES.map((node) => (
              <RiskAlertCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
