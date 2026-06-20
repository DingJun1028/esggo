// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { StatusDot } from '@/components/ui/v2/StatusDot';
import { Progress } from '@/components/ui/v2/Progress';
import {
  Grid3X3,
  ShieldCheck,
  Activity,
  Lock,
  Globe,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  Database,
  RefreshCw,
  FileBarChart,
  Loader2,
  Zap,
  History,
  Fingerprint,
  Waves,
  Bot,
} from 'lucide-react';

const STAGES = ['ORIGIN', 'EXTRACTION', 'VERIFICATION', 'SEALING', 'REPORTING', 'ARCHIVING'];
const GATES = ['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'];
const STAGE_LABELS: Record<string, string> = {
  ORIGIN: '源起 (Origin)',
  EXTRACTION: '提取 (Transmute)',
  VERIFICATION: '驗證 (Dialectics)',
  SEALING: '封印 (Immutable)',
  REPORTING: '發布 (Manifest)',
  ARCHIVING: '歸檔 (Eternal)',
};

function getStatusColor(status: string) {
  if (status === 'PASS') return 'bg-emerald-500';
  if (status === 'FAIL') return 'bg-red-500';
  if (status === 'LOCKED') return 'bg-neutral-700';
  return 'bg-neutral-200';
}

export default function EndToEndMatrixPage() {
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ stage: string; gate: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-neutral-500 uppercase">
                Semantic Governance v1.1
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              英標繁博 · 終始矩陣
            </h1>
            <p className="text-neutral-500 mt-2 text-sm max-w-xl">
              語義治理規範 — 英標為骨，繁博為魂。全域數據生命週期追蹤。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success">熵減秩序值 94%</Badge>
            <Badge variant="info">12 封印節點</Badge>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: '熵減秩序值',
              value: '94',
              unit: '%',
              icon: Waves,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              label: '不可磨滅印記',
              value: '12',
              unit: 'Nodes',
              icon: Fingerprint,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              label: '溯源日誌',
              value: '1,284',
              unit: 'Entries',
              icon: History,
              color: 'text-neutral-600 bg-neutral-100',
            },
            {
              label: '活躍代理',
              value: '7',
              unit: 'Agents',
              icon: Bot,
              color: 'text-emerald-600 bg-emerald-50',
            },
          ].map((kpi) => (
            <Card key={kpi.label} variant="default" padding="md">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <kpi.icon size={16} className={kpi.color.split(' ')[0]} />
                </div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  {kpi.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-neutral-900">{kpi.value}</span>
                <span className="text-sm text-neutral-400">{kpi.unit}</span>
              </div>
            </Card>
          ))}
        </div>

        <Card variant="default" padding="none" className="overflow-hidden">
          <SectionHeader
            title="語義治理結構矩陣"
            subtitle="Semantic Governance Grid — 6 階段 × 5T 門"
          />
          {loading ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3">
              <Loader2 size={24} className="text-neutral-400 animate-spin" />
              <span className="text-sm text-neutral-400">載入矩陣資料...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      階段 \ 5T
                    </th>
                    {GATES.map((gate) => (
                      <th
                        key={gate}
                        className="px-4 py-3 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {gate}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STAGES.map((stage) => (
                    <tr key={stage} className="border-b border-neutral-100">
                      <td className="px-4 py-4 min-w-[160px]">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-8 bg-neutral-200 rounded-full" />
                          <div>
                            <p className="text-xs font-bold text-neutral-900">
                              {STAGE_LABELS[stage]}
                            </p>
                            <p className="text-[9px] text-neutral-400">Lifecycle Transmutation</p>
                          </div>
                        </div>
                      </td>
                      {GATES.map((gate) => {
                        const isActive = hoveredCell?.stage === stage && hoveredCell?.gate === gate;
                        const statuses: Record<string, string> = {
                          ORIGIN: 'PASS',
                          EXTRACTION: 'PASS',
                          VERIFICATION: 'PASS',
                          SEALING: 'LOCKED',
                          REPORTING: 'PASS',
                          ARCHIVING: 'PASS',
                        };
                        const status = statuses[stage] || 'PASS';
                        return (
                          <td key={gate} className="px-2 py-2">
                            <div
                              onMouseEnter={() => setHoveredCell({ stage, gate })}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={`h-28 rounded-xl border-2 p-3 cursor-pointer transition-all ${
                                isActive
                                  ? 'border-neutral-900 bg-white shadow-md z-10'
                                  : 'border-neutral-100 bg-white hover:border-neutral-200'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStatusColor(
                                    status
                                  )}`}
                                >
                                  {status === 'LOCKED' ? (
                                    <Lock size={12} className="text-amber-400" />
                                  ) : (
                                    <CheckCircle2 size={12} className="text-white" />
                                  )}
                                </div>
                                <span className="text-[8px] font-bold text-neutral-300 uppercase">
                                  {status}
                                </span>
                              </div>
                              <p className="text-[9px] font-bold text-neutral-700 uppercase">
                                {gate}
                              </p>
                              <div className="h-0.5 w-3 bg-amber-400 mt-1 mb-2" />
                              <p className="text-[9px] text-neutral-400 line-clamp-2 italic">
                                {status === 'LOCKED'
                                  ? '誠信刻印：真理哈希已鎖定'
                                  : '辯證中：秩序建立中'}
                              </p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card variant="default" padding="lg" className="lg:col-span-2">
            <SectionHeader title="溯源真理日誌" subtitle="數據之起始，不可磨滅之印記" />
            <div className="space-y-3 mt-4">
              {[
                {
                  action: '資料源驗證',
                  gate: 'T1',
                  desc: 'ERP_System_A 數據源已通過 5T 驗證',
                  time: '10:30',
                },
                {
                  action: '雜湊封印',
                  gate: 'T5',
                  desc: 'Scope 1 Direct Emissions 已完成 SHA-256 封印',
                  time: '09:15',
                },
                {
                  action: '稽核確認',
                  gate: 'T3',
                  desc: '第三方稽核員確認數據完整性',
                  time: '08:00',
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100 hover:border-neutral-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-neutral-900">{log.action}</p>
                        <Badge variant="info" size="xs">
                          {log.gate}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-500">{log.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{log.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="default" padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Zap size={20} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900">萬能元件心核</h4>
                <p className="text-[10px] text-neutral-400">Node Intelligence</p>
              </div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 mb-4">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">
                演化路徑
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed italic">
                {hoveredCell
                  ? `目前檢視：${STAGE_LABELS[hoveredCell.stage]} × ${hoveredCell.gate}`
                  : '將游標懸浮於節點之上，以嗅探組件之靈魂演化軌跡。'}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 mb-4">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Lock size={10} /> 哈希鎖定狀態
              </p>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                {hoveredCell
                  ? '0x' + Math.random().toString(16).substring(2, 10) + '...SEALED'
                  : 'UNSEALED_GATE'}
              </span>
            </div>
            <Button variant="primary" fullWidth icon={<ShieldCheck size={16} />}>
              啟動溯源真理驗證
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
