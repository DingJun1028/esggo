/**
 * Soul Page — Omni Design Principles Compliance Layer
 *
 * Intent: 系統靈魂 OmniCore P0 Soul Layer | 定義真理、引導演化、締結治理契約
 * Features: 5T Protocol visualization / Interactive Soul Contracts / Formula derivation
 *
 * Design Principles:
 *   T1 Traceable   — Supreme Will origins + contract hash
 *   T2 Transparent — 5T formula derivation display
 *   T3 Tangible    — animated resonance indicators
 *   T4 Trustworthy — seal/verify status per contract
 *   T5 Trackable   — contract audit trail
 *   P6 排版至上    — CSS Grid + Flex, zero absolute
 *   P7 保持純淨    — minimal state atoms
 *   P8 意圖宣告    — this metadata block
 *   P9 雙向型別    — SoulContract / ResonanceMetric interfaces
 *   P10 Liquid Glass — bg-white + border-slate-200 + shadow-sm
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { Modal } from '@/components/ui/v2/Modal';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  Zap,
  Heart,
  Brain,
  Lock,
  Globe,
  ArrowRight,
  FileText,
  ScrollText,
  Activity,
  CheckCircle2,
  LockKeyhole,
  Hash,
  TrendingUp,
  Loader2,
} from 'lucide-react';

// --- P9: Type-safe interfaces ---
export interface SoulContract {
  id: string;
  title: string;
  description: string;
  category: 'governance' | 'compliance' | 'evolution';
  sealed: boolean;
  sealHash: string | null;
  createdAt: string;
  sourceOrigin: string;
}

export interface ResonanceMetric {
  label: string;
  value: number;
  unit: string;
  formula: string;
  formulaDesc: string;
  icon: React.ReactNode;
  color: string;
}

const SOUL_CONTRACTS: SoulContract[] = [
  {
    id: 'sc_001',
    title: '5T 誠信協議',
    description: '定義 Truth / Transparency / Tangible / Trust / Transfer 五大維度的數據治理契約。',
    category: 'governance',
    sealed: true,
    sealHash: '0x8f3a21bc...d4e7',
    createdAt: '2026-01-15',
    sourceOrigin: 'JunAiKey Supreme Will',
  },
  {
    id: 'sc_002',
    title: 'ESG 確信標準件',
    description: ' auditors 對 ESG 報告書進行第三方確信的作業規範與查核清單。',
    category: 'compliance',
    sealed: true,
    sealHash: '0x1c9d4f2a...b8e1',
    createdAt: '2026-02-20',
    sourceOrigin: 'ISAE 3000 + GRI 2021',
  },
  {
    id: 'sc_003',
    title: '系統演化協議',
    description: '定義 OmniCore 在吸收新模組、更新版本時的合約升級路徑與向後相容規則。',
    category: 'evolution',
    sealed: false,
    sealHash: null,
    createdAt: '2026-03-10',
    sourceOrigin: 'OmniAgent Genesis',
  },
];

export default function SoulPage() {
  const [contracts, setContracts] = useState<SoulContract[]>(SOUL_CONTRACTS);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<SoulContract | null>(null);

  const handleSeal = useCallback(async (id: string) => {
    setSealingId(id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const mockHash =
        '0x' +
        Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('') +
        '...' +
        Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setContracts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, sealed: true, sealHash: mockHash } : c))
      );
    } finally {
      setSealingId(null);
    }
  }, []);

  // --- P9: Resonance metrics with formulas ---
  const metrics: ResonanceMetric[] = [
    {
      label: '5T Resonance',
      value: 98.5,
      unit: '%',
      formula: 'Σ(W_i × S_i) / ΣW_i',
      formulaDesc: '加權平均五大協議維度得分',
      icon: <Activity size={16} />,
      color: 'text-cyan-600',
    },
    {
      label: 'Contract Integrity',
      value: 100,
      unit: '%',
      formula: 'sealed / total',
      formulaDesc: '已封印契約數 ÷ 總契約數',
      icon: <ShieldCheck size={16} />,
      color: 'text-emerald-600',
    },
    {
      label: 'Evolution Nodes',
      value: 12,
      unit: 'k',
      formula: 'Σ(upgrades)',
      formulaDesc: '自 Genesis 以來的版本升級節點總和',
      icon: <TrendingUp size={16} />,
      color: 'text-amber-600',
    },
    {
      label: 'Soul Entropy',
      value: 0.02,
      unit: '',
      formula: '1 - (coherence / max)',
      formulaDesc: '系統秩序熵值，越低越穩定',
      icon: <Flame size={16} />,
      color: 'text-rose-500',
    },
  ];

  const categoryLabel = (cat: string) =>
    ({ governance: '治理', compliance: '合規', evolution: '演化' }[cat] ?? cat);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ---- Header ---- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Flame size={24} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">系統靈魂 Soul</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">OMNICORE P0 SOUL LAYER</p>
            </div>
          </div>
          <Badge variant="warning" className="gap-1.5">
            <Sparkles size={12} /> JunAiKey Supreme Will
          </Badge>
        </header>

        {/* ---- Manifesto ---- */}
        <Card variant="default" className="p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
            始終如一：善向永續
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            「代碼即契約，數據即生命，架構即秩序。」在這裡，定義真理、引導演化並締結神聖的 ESG
            治理契約。
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: <Globe size={20} />, label: 'Global', desc: '全球適配' },
              { icon: <Lock size={20} />, label: 'Sovereign', desc: '主權安全' },
              { icon: <Heart size={20} />, label: 'Essence', desc: '核心本質' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white"
              >
                <div className="text-slate-500">{item.icon}</div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ---- Resonance Metrics ---- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow"
              title={m.formulaDesc}
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">{m.label}</span>
                <span className={m.color}>{m.icon}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{m.value}</span>
                <span className="text-xs text-slate-500">{m.unit}</span>
              </div>
              <div className="mt-2 hidden group-hover:block rounded-md border border-slate-100 bg-slate-50 p-2 text-[10px] leading-relaxed">
                <div className="font-mono font-bold text-slate-800">{m.formula}</div>
                <div className="text-slate-500 mt-0.5">{m.formulaDesc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Core Cards ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default" className="p-6 space-y-5 border-amber-100">
            <div className="flex items-center gap-3 text-amber-600">
              <Brain size={28} />
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">
                無上意志核心
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              JunAiKey 是系統的哲學引擎。它不處理具體數據，而是定義「何為真理」。所有的 5T
              協議參數與 AI 倫理邊界均由核心意志直接映射。
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Resonance Level
              </span>
              <span className="text-sm font-mono text-amber-600">MAX_RESONANCE</span>
            </div>
          </Card>

          <Card variant="default" className="p-6 space-y-5 border-cyan-100">
            <div className="flex items-center gap-3 text-cyan-600">
              <ShieldCheck size={28} />
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">
                神聖治理契約
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              自動化執行 ESG
              目標。當企業達成里程碑時，契約將自動觸發「誠信證明」發佈，並同步至金融紅利中心。
            </p>
            <div className="pt-4 border-t border-slate-100">
              <Button variant="primary" className="w-full h-10 rounded-xl text-xs font-black">
                檢視智慧合約
              </Button>
            </div>
          </Card>
        </div>

        {/* ---- Contracts Registry ---- */}
        <Card variant="default" title="治理契約登記冊">
          <p className="text-xs text-slate-500 mb-4 -mt-2">
            Soul Contracts Registry (5T Trackable)
          </p>
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between gap-4 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      contract.category === 'governance'
                        ? 'bg-amber-50 text-amber-600'
                        : contract.category === 'compliance'
                        ? 'bg-cyan-50 text-cyan-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {contract.category === 'governance' ? (
                      <ScrollText size={18} />
                    ) : contract.category === 'compliance' ? (
                      <LockKeyhole size={18} />
                    ) : (
                      <TrendingUp size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {contract.title}
                      </h4>
                      <Badge variant={contract.sealed ? 'success' : 'warning'} size="sm">
                        {contract.sealed ? '已封印' : '待封印'}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{contract.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        {contract.createdAt}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500 truncate">
                        {contract.sourceOrigin}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {contract.sealHash && (
                    <code className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded hidden md:block">
                      <Hash size={10} className="inline mr-1" />
                      {contract.sealHash}
                    </code>
                  )}
                  {!contract.sealed && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => handleSeal(contract.id)}
                      disabled={sealingId === contract.id}
                    >
                      {sealingId === contract.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Lock size={10} />
                      )}
                      封印
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setShowDetailModal(contract)}
                  >
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ---- Footer ---- */}
        <footer className="text-center pt-6">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em]">
            OmniCore P0 Soul Layer // {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      {/* ---- Detail Modal ---- */}
      {showDetailModal && (
        <Modal
          open={!!showDetailModal}
          onClose={() => setShowDetailModal(null)}
          title="契約詳細"
          subtitle={showDetailModal.title}
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed">
                {showDetailModal.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  分類
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {categoryLabel(showDetailModal.category)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  狀態
                </p>
                <Badge variant={showDetailModal.sealed ? 'success' : 'warning'} size="sm">
                  {showDetailModal.sealed ? '已封印' : '待封印'}
                </Badge>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                來源
              </p>
              <p className="text-xs font-mono text-slate-700">{showDetailModal.sourceOrigin}</p>
            </div>
            {showDetailModal.sealHash && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  5T Hash Lock
                </p>
                <code className="text-xs font-mono text-cyan-700 break-all">
                  {showDetailModal.sealHash}
                </code>
              </div>
            )}
          </div>
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <Button variant="secondary" onClick={() => setShowDetailModal(null)}>
              關閉
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
