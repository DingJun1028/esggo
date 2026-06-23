'use client';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Award,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Zap,
  Droplets,
  Factory,
  Star,
  Lock,
  Eye,
  Target,
  CheckCircle2,
  Clock,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';

/* ─── Types ─── */
interface AwakeningPillar {
  id: string;
  name: string;
  nameEn: string;
  score: number;
  maxScore: number;
  icon: any;
  color: string;
  description: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/* ─── Mock Data ─── */
const AWAKENING_PILLARS: AwakeningPillar[] = [
  {
    id: 'self-awareness',
    name: '自覺',
    nameEn: 'Self-Awareness',
    score: 85,
    maxScore: 100,
    icon: Eye,
    color: 'text-cyan-600',
    description: '對自身 ESG 影響的認知與覺察',
  },
  {
    id: 'enlightenment',
    name: '覺他',
    nameEn: 'Enlightenment',
    score: 72,
    maxScore: 100,
    icon: Star,
    color: 'text-amber-600',
    description: '影響並啟發他人參與永續行動',
  },
  {
    id: 'self-reliance',
    name: '自立',
    nameEn: 'Self-Reliance',
    score: 90,
    maxScore: 100,
    icon: ShieldCheck,
    color: 'text-emerald-600',
    description: '獨立完成 ESG 目標的能力',
  },
  {
    id: 'altruism',
    name: '利他',
    nameEn: 'Altruism',
    score: 68,
    maxScore: 100,
    icon: Leaf,
    color: 'text-green-600',
    description: '為社會與環境創造正面影響',
  },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-001',
    name: '碳盤查新手',
    description: '完成首次碳盤查計算',
    icon: '🌱',
    unlocked: true,
    unlockedAt: '2025-06-15',
    rarity: 'common',
  },
  {
    id: 'ach-002',
    name: '5T 驗證者',
    description: '通過所有 5T 協議驗證',
    icon: '🛡️',
    unlocked: true,
    unlockedAt: '2025-08-20',
    rarity: 'rare',
  },
  {
    id: 'ach-003',
    name: '供應鏈大師',
    description: '管理超過 50 個供應鏈節點',
    icon: '🔗',
    unlocked: true,
    unlockedAt: '2025-10-05',
    rarity: 'epic',
  },
  {
    id: 'ach-004',
    name: '零碳先鋒',
    description: '實現範疇一淨零排放',
    icon: '🏆',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'ach-005',
    name: 'GRI 專家',
    description: '完成 GRI G4 完整報告',
    icon: '📊',
    unlocked: true,
    unlockedAt: '2025-11-30',
    rarity: 'rare',
  },
  {
    id: 'ach-006',
    name: 'ZKP 封印師',
    description: '執行 100 次 ZKP 驗證',
    icon: '🔐',
    unlocked: false,
    rarity: 'epic',
  },
];

const ESG_METRICS = [
  {
    label: '碳排放量',
    value: '1,284',
    unit: 'tCO₂e',
    trend: -5.2,
    icon: Factory,
    color: 'text-rose-500',
  },
  { label: '能源效率', value: '92.5', unit: '%', trend: 3.1, icon: Zap, color: 'text-amber-500' },
  {
    label: '水資源',
    value: '8,205',
    unit: 'm³',
    trend: -1.8,
    icon: Droplets,
    color: 'text-blue-500',
  },
  {
    label: '合規評分',
    value: '87',
    unit: '/100',
    trend: 5.5,
    icon: ShieldCheck,
    color: 'text-emerald-500',
  },
];

/* ─── Components ─── */

function AwakeningRadar() {
  const size = 280;
  const center = size / 2;
  const maxRadius = 100;
  const levels = 5;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const points = AWAKENING_PILLARS.map((p, i) => getPoint(i, p.score));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px]">
        {/* Grid Levels */}
        {Array.from({ length: levels }).map((_, i) => {
          const r = ((i + 1) / levels) * maxRadius;
          const polygonPoints = AWAKENING_PILLARS.map((_, j) => {
            const angle = (Math.PI * 2 * j) / 4 - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon
              key={i}
              points={polygonPoints}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}

        {/* Axis Lines */}
        {AWAKENING_PILLARS.map((_, i) => {
          const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="#E2E8F0"
              strokeWidth={1}
            />
          );
        })}

        {/* Data Area */}
        <motion.path
          d={pathData}
          fill="rgba(6, 182, 212, 0.15)"
          stroke="#06B6D4"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill="#06B6D4"
            stroke="#FFFFFF"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="breathing-glow"
          />
        ))}

        {/* Labels */}
        {AWAKENING_PILLARS.map((pillar, i) => {
          const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
          const labelRadius = maxRadius + 30;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-bold"
              fill="#003262"
            >
              {pillar.name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {AWAKENING_PILLARS.map((pillar) => (
          <div key={pillar.id} className="flex items-center gap-1.5">
            <div className={cn('w-2 h-2 rounded-full', pillar.color.replace('text-', 'bg-'))} />
            <span className="text-[10px] text-slate-500">{pillar.name}</span>
            <span className="text-[10px] font-mono font-bold text-[#003262]">{pillar.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const rarityConfig = {
    common: {
      color: 'text-slate-500',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      label: '普通',
    },
    rare: { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: '稀有' },
    epic: {
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      label: '史詩',
    },
    legendary: {
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: '傳說',
    },
  };
  const config = rarityConfig[achievement.rarity];

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={cn(
        'rounded-xl border p-4 transition-all relative overflow-hidden',
        achievement.unlocked
          ? `${config.border} bg-white`
          : 'border-slate-100 bg-slate-50/50 opacity-60'
      )}
    >
      {achievement.unlocked && (
        <div
          className={cn(
            'absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 blur-xl',
            config.bg
          )}
        />
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{achievement.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-[#003262] truncate">{achievement.name}</h4>
            <span
              className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', config.bg, config.color)}
            >
              {config.label}
            </span>
          </div>
          {achievement.unlocked && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">{achievement.description}</p>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-[9px] text-slate-300 mt-2 flex items-center gap-1">
            <Clock size={8} />
            {achievement.unlockedAt}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function UserPassportPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'metrics'>('overview');

  const overallScore = Math.round(AWAKENING_PILLARS.reduce((sum, p) => sum + p.score, 0) / 4);
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg breathing-glow">
                ES
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">用戶護照</h1>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                  已驗證
                </span>
              </div>
              <p className="text-sm text-slate-500">ESG 覺醒之旅 · 永續影響力檔案</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-black text-[#003262]">{overallScore}</p>
                  <p className="text-[9px] text-slate-400">覺醒分數</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className="text-lg font-black text-[#003262]">
                    {unlockedAchievements}/{ACHIEVEMENTS.length}
                  </p>
                  <p className="text-[9px] text-slate-400">成就解鎖</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className="text-lg font-black text-[#003262]">Lv.12</p>
                  <p className="text-[9px] text-slate-400">覺醒等級</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'overview' as const, label: '覺醒概覽', icon: User },
            { id: 'achievements' as const, label: '成就系統', icon: Award },
            { id: 'metrics' as const, label: 'ESG 指標', icon: BarChart3 },
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OmniBaseCard className="p-6">
              <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                <Target size={16} className="text-cyan-500" />
                覺醒雷達圖
              </h3>
              <p className="text-xs text-slate-400 mb-4">四大支柱評分（0-100）</p>
              <AwakeningRadar />
            </OmniBaseCard>

            <div className="space-y-4">
              {AWAKENING_PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn('p-2 rounded-lg bg-slate-50')}>
                      <pillar.icon size={16} className={pillar.color} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#003262]">
                          {pillar.name}{' '}
                          <span className="text-xs font-normal text-slate-400">
                            ({pillar.nameEn})
                          </span>
                        </h4>
                        <span className="text-sm font-mono font-bold text-[#003262]">
                          {pillar.score}/{pillar.maxScore}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{pillar.description}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pillar.score}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className={cn('h-full rounded-full', pillar.color.replace('text-', 'bg-'))}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#003262]">成就系統</h3>
                <p className="text-xs text-slate-400">
                  已解鎖 {unlockedAchievements} / {ACHIEVEMENTS.length} 個成就
                </p>
              </div>
              <div className="flex gap-2">
                {(['common', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
                  const count = ACHIEVEMENTS.filter(
                    (a) => a.rarity === rarity && a.unlocked
                  ).length;
                  const total = ACHIEVEMENTS.filter((a) => a.rarity === rarity).length;
                  return (
                    <span key={rarity} className="text-[10px] font-bold text-slate-400">
                      {count}/{total} {rarity}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ESG_METRICS.map((metric, i) => {
                const Icon = metric.icon;
                const isPositive = metric.trend && metric.trend > 0;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={16} className={metric.color} />
                      {metric.trend !== undefined && (
                        <span
                          className={cn(
                            'text-[10px] font-bold',
                            isPositive ? 'text-emerald-600' : 'text-rose-600'
                          )}
                        >
                          {isPositive ? '↑' : '↓'} {Math.abs(metric.trend)}%
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-black text-[#003262]">
                      {metric.value}
                      {metric.unit && (
                        <span className="text-sm text-slate-400 ml-1">{metric.unit}</span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{metric.label}</p>
                  </motion.div>
                );
              })}
            </div>

            <OmniBaseCard className="p-5">
              <h3 className="text-base font-bold text-[#003262] mb-4">5T 協議狀態</h3>
              <div className="max-w-lg">
                <Protocol5TStrip status={[true, true, true, true, true]} showLabels size="lg" />
              </div>
            </OmniBaseCard>
          </div>
        )}
      </div>
    </div>
  );
}
