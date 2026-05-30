'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
    <div className="min-h-screen bg-slate-50 text-slate-600 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-4">
            <Badge variant="success">
              ⚡ 旅程 I. 初始導入與配置
            </Badge>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Cable className="text-cyan-600" /> 整合中心 <span className="text-slate-400 font-light">| API Setup</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl font-medium">
              串接外部系統，打通資料孤島。監控 API 連接器狀態、Webhook 活動與環境變數健康度。
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleRefresh} className="flex items-center gap-2 bg-white/50 border-slate-200">
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} /> 重新整理
            </Button>
            <Button variant="primary" className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-100">
              <Plus size={16} /> 新增連接器
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status Area */}
          <div className="lg:col-span-2 space-y-8">
            <UniversalCard title="API 連接器狀態 Connectors" variant="glow" className="bg-white/80 backdrop-blur-xl border-white shadow-sm">
              <div className="divide-y divide-slate-100">
                {MOCK_CONNECTORS.map((conn) => (
                  <div key={conn.id} className="py-5 flex items-center justify-between group hover:bg-slate-50 transition-all px-4 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600 border border-cyan-100 shadow-sm">
                        <Cable size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{conn.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{conn.type}</span>
                          <span>•</span>
                          <span>Last Sync: {conn.lastSync}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Health</p>
                        <p className={`text-sm font-mono font-bold ${conn.health > 80 ? 'text-emerald-600' : conn.health > 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {conn.health}%
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                        <UniversalStatusDot status={conn.status as any} pulse={conn.status === 'online'} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{conn.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </UniversalCard>

            <UniversalCard title="Webhook 監控活動 Events" variant="bordered" className="bg-white/70 backdrop-blur-xl border-slate-100 shadow-sm">
              <div className="space-y-4">
                {MOCK_WEBHOOKS.map((wh) => (
                  <div key={wh.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 hover:border-cyan-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio size={16} className="text-cyan-600" />
                        <span className="text-sm font-bold text-slate-800">{wh.event}</span>
                      </div>
                      <Badge variant={wh.status === 'active' ? 'success' : 'warning'}>
                        {wh.status}
                      </Badge>
                    </div>
                    <code className="block text-[11px] bg-white p-3 rounded-xl text-cyan-700/70 truncate border border-slate-100 font-mono shadow-inner">
                      {wh.url}
                    </code>
                  </div>
                ))}
              </div>
            </UniversalCard>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <UniversalCard title="環境變數健康度 ENV" variant="glass" className="bg-white/80 backdrop-blur-xl border-white shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">SUPABASE_URL</span>
                  <Badge variant="success">Set</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">GEMINI_API_KEY</span>
                  <Badge variant="success">Set</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">NCBDB_TOKEN</span>
                  <Badge variant="warning">Expiring</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">RESEND_API_KEY</span>
                  <Badge variant="error">Missing</Badge>
                </div>
                <hr className="border-slate-100" />
                <Button variant="secondary" className="w-full text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-200">
                  驗證所有變數
                </Button>
              </div>
            </UniversalCard>

            <UniversalCard title="安全性認證 Security" variant="default" className="bg-white/60 backdrop-blur-xl border-slate-100 shadow-sm">
              <div className="space-y-4 text-center py-4">
                <ShieldCheck size={48} className="mx-auto text-emerald-500 opacity-40" />
                <p className="text-sm text-slate-500 font-medium">所有資料交換均受 RLS 與 5T 誠信協議保護。</p>
                <div className="pt-2">
                  <Button variant="secondary" className="w-full flex items-center justify-center gap-2 bg-white border-slate-200 shadow-sm">
                    <Key size={14} /> 管理存取權杖
                  </Button>
                </div>
              </div>
            </UniversalCard>

            <div className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[2.5rem] border border-cyan-100 backdrop-blur-xl shadow-lg shadow-cyan-100/50">
              <Activity className="text-cyan-600 mb-4" />
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-2">系統健康概覽</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">目前 4 個連接器中，3 個運作正常，1 個需要手動檢查。</p>
              <Button variant="primary" className="w-full bg-cyan-600 hover:bg-cyan-700 shadow-md shadow-cyan-100">
                查看詳細日誌
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
