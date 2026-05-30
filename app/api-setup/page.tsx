'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalStatusDot } from '@/components/ui/universal/UniversalStatusDot';
import { Cable, Radio, Key, Globe, ShieldCheck, Activity, RefreshCw, Plus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_CONNECTORS = [
  { id: 'erp-001', name: 'SAP ERP Connector', type: 'ERP', status: 'online', lastSync: '2 mins ago', health: 98 },
  { id: 'bems-002', name: 'BEMS Energy Monitor', type: 'IoT', status: 'online', lastSync: '5 mins ago', health: 100 },
  { id: 'hr-003', name: 'HR Management System', type: 'HCM', status: 'offline', lastSync: '1 day ago', health: 0 },
  { id: 'custom-004', name: 'Custom Data Gateway', type: 'API', status: 'warning', lastSync: '10 mins ago', health: 65 },
];

const MOCK_WEBHOOKS = [
  { id: 'wh-001', url: 'https://api.esggo.com/hooks/data-in', event: 'data.received', status: 'active' },
  { id: 'wh-002', url: 'https://api.esggo.com/hooks/audit-alert', event: 'audit.failed', status: 'active' },
];

export default function APISetupPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="⚡">
              旅程 I. 初始導入與配置
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Cable className="text-cyan-core" /> 整合中心 API Setup
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              串接外部系統，打通資料孤島。監控 API 連接器狀態、Webhook 活動與環境變數健康度。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} /> 重新整理
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              <Plus size={16} /> 新增連接器
            </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status Area */}
          <div className="lg:col-span-2 space-y-8">
            <UniversalCard title="API 連接器狀態 Connectors" variant="glow">
              <div className="divide-y divide-white/5">
                {MOCK_CONNECTORS.map((conn) => (
                  <div key={conn.id} className="py-4 flex items-center justify-between group hover:bg-white/5 transition-colors px-2 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-core/10 rounded-xl text-cyan-core">
                        <Cable size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white/90">{conn.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span className="bg-white/5 px-1.5 py-0.5 rounded uppercase">{conn.type}</span>
                          <span>•</span>
                          <span>Last Sync: {conn.lastSync}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-white/40 uppercase font-black">Health</p>
                        <p className={`text-sm font-mono ${conn.health > 80 ? 'text-emerald-400' : conn.health > 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {conn.health}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <UniversalStatusDot status={conn.status as any} pulse={conn.status === 'online'} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{conn.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </UniversalCard>

            <UniversalCard title="Webhook 監控活動 Events" variant="bordered">
              <div className="space-y-4">
                {MOCK_WEBHOOKS.map((wh) => (
                  <div key={wh.id} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio size={16} className="text-cyan-core" />
                        <span className="text-sm font-bold text-white/80">{wh.event}</span>
                      </div>
                      <UniversalBadge variant={wh.status === 'active' ? 'success' : 'warning'}>
                        {wh.status}
                      </UniversalBadge>
                    </div>
                    <code className="block text-xs bg-black/40 p-2 rounded text-cyan-core/70 truncate">
                      {wh.url}
                    </code>
                  </div>
                ))}
              </div>
            </UniversalCard>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <UniversalCard title="環境變數健康度 ENV" variant="glass">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">SUPABASE_URL</span>
                  <UniversalBadge variant="success">Set</UniversalBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">GEMINI_API_KEY</span>
                  <UniversalBadge variant="success">Set</UniversalBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">NCBDB_TOKEN</span>
                  <UniversalBadge variant="warning">Expiring</UniversalBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">RESEND_API_KEY</span>
                  <UniversalBadge variant="error">Missing</UniversalBadge>
                </div>
                <hr className="border-white/5" />
                <UniversalButton variant="secondary" className="w-full text-xs">
                  驗證所有變數
                </UniversalButton>
              </div>
            </UniversalCard>

            <UniversalCard title="安全性認證 Security" variant="default">
              <div className="space-y-4 text-center py-4">
                <ShieldCheck size={48} className="mx-auto text-emerald-400 opacity-50" />
                <p className="text-sm text-white/60">所有資料交換均受 RLS 與 5T 誠信協議保護。</p>
                <div className="pt-2">
                  <UniversalButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                    <Key size={14} /> 管理存取權杖
                  </UniversalButton>
                </div>
              </div>
            </UniversalCard>

            <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-[2rem] border border-cyan-500/30 backdrop-blur-xl">
              <Activity className="text-cyan-core mb-4" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">系統健康概覽</h3>
              <p className="text-sm text-white/60 mb-4">目前 4 個連接器中，3 個運作正常，1 個需要手動檢查。</p>
              <UniversalButton variant="primary" className="w-full">
                查看詳細日誌
              </UniversalButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
