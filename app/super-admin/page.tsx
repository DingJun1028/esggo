// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { StatusDot } from '@/components/ui/v2/StatusDot';
import {
  Shield,
  Server,
  Activity,
  Database,
  Cpu,
  Settings,
  Terminal,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Play,
  Trash2,
  User,
  Key,
  BarChart,
} from 'lucide-react';

export default function SuperAdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'database' | 'audit'>(
    'overview'
  );
  const [logs, setLogs] = useState<string[]>([
    '[11:00:12] [SYSTEM] OmniCore Engine initialized successfully.',
    '[11:01:05] [GATEWAY] WebSocket connection established on port 3001.',
    '[11:02:44] [AUDIT] 5T compliance check passed for component Registry.',
    '[11:04:19] [AGENT] OmniAgent Evolved agent synchronized state.',
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [metrics] = useState({
    cpu: '12%',
    ram: '1.4GB / 4.0GB',
    dbConnections: '18 active',
    trustScore: '99.8%',
    activeSessions: '52',
    apiLatency: '45ms',
  });

  const addLog = (message: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 19)]);
  };

  const tabs = [
    { id: 'overview' as const, label: '總覽', icon: BarChart },
    { id: 'agents' as const, label: '代理管理', icon: Cpu },
    { id: 'database' as const, label: '資料庫', icon: Database },
    { id: 'audit' as const, label: '稽核日誌', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Shield className="text-amber-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                超級管理員控制台
              </h1>
              <p className="text-sm text-neutral-500">
                系統監控 · 代理管理 · 資料庫維護 · 稽核日誌
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={() => {
                setIsSyncing(true);
                addLog('[ADMIN] Manual sync triggered');
                setTimeout(() => setIsSyncing(false), 2000);
              }}
              loading={isSyncing}
            >
              同步
            </Button>
            <Button variant="secondary" size="sm" icon={<Settings size={14} />}>
              設定
            </Button>
          </div>
        </header>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'CPU 使用率', value: metrics.cpu, icon: Cpu, status: 'active' as const },
                { label: '記憶體', value: metrics.ram, icon: Server, status: 'active' as const },
                {
                  label: 'DB 連線',
                  value: metrics.dbConnections,
                  icon: Database,
                  status: 'active' as const,
                },
                {
                  label: '信任評分',
                  value: metrics.trustScore,
                  icon: Shield,
                  status: 'active' as const,
                },
                {
                  label: '活躍會話',
                  value: metrics.activeSessions,
                  icon: User,
                  status: 'active' as const,
                },
                {
                  label: 'API 延遲',
                  value: metrics.apiLatency,
                  icon: Activity,
                  status: 'active' as const,
                },
              ].map((m) => (
                <Card key={m.label} variant="default" padding="md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      {m.label}
                    </span>
                    <StatusDot status={m.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <m.icon size={16} className="text-neutral-400" />
                    <span className="text-lg font-black text-neutral-900">{m.value}</span>
                  </div>
                </Card>
              ))}
            </div>

            <Card variant="default" padding="md">
              <SectionHeader title="系統終端機" subtitle="即時日誌輸出" />
              <div className="bg-neutral-900 rounded-lg p-4 font-mono text-xs text-neutral-300 max-h-60 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.includes('ERROR')
                        ? 'text-red-400'
                        : log.includes('WARN')
                        ? 'text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'OmniAgent Core',
              'Sentinel Guard',
              'Data Analyst',
              'Report Writer',
              'Audit Verifier',
              'Gateway Bridge',
            ].map((agent) => (
              <Card key={agent} variant="default" padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                      <Cpu size={18} className="text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{agent}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusDot status="active" size="xs" />
                        <span className="text-[10px] text-neutral-400">運行中</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="xs" icon={<Play size={10} />} />
                    <Button variant="ghost" size="xs" icon={<Trash2 size={10} />} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-4">
            <Card variant="default" padding="md">
              <SectionHeader title="資料庫狀態" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {[
                  { table: 'esg_records', rows: '1,284', size: '2.4 MB' },
                  { table: 'evidence_vault', rows: '567', size: '1.8 MB' },
                  { table: 'reading_room_documents', rows: '32', size: '0.5 MB' },
                  { table: 'users', rows: '156', size: '0.2 MB' },
                ].map((t) => (
                  <div key={t.table} className="p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs font-bold text-neutral-900">{t.table}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      {t.rows} rows · {t.size}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <Card variant="default" padding="md">
              <SectionHeader title="資料表操作" />
              <div className="flex gap-2 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<RefreshCw size={14} />}
                  onClick={() => addLog('[DB] Schema sync completed')}
                >
                  同步 Schema
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Database size={14} />}
                  onClick={() => addLog('[DB] Backup initiated')}
                >
                  備份
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 size={14} />}
                  onClick={() => addLog('[DB] Cache cleared')}
                >
                  清除快取
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'audit' && (
          <Card variant="default" padding="md">
            <SectionHeader title="稽核日誌" subtitle="5T 合規性檢查記錄" />
            <div className="space-y-2 mt-4">
              {[
                {
                  time: '2026-06-22 11:04',
                  action: '5T 合規檢查',
                  result: '通過',
                  detail: 'Component Registry 驗證完成',
                },
                {
                  time: '2026-06-22 10:30',
                  action: '資料封印',
                  result: '成功',
                  detail: 'Scope 1 Emissions 已封印',
                },
                {
                  time: '2026-06-22 09:15',
                  action: '使用者登入',
                  result: '成功',
                  detail: 'Admin 從 192.168.1.1 登入',
                },
                {
                  time: '2026-06-22 08:00',
                  action: '系統備份',
                  result: '完成',
                  detail: '每日自動備份完成',
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot
                      status={
                        log.result === '通過' || log.result === '成功' || log.result === '完成'
                          ? 'active'
                          : 'warning'
                      }
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{log.action}</p>
                      <p className="text-[10px] text-neutral-400">{log.detail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        log.result === '通過' || log.result === '成功' || log.result === '完成'
                          ? 'success'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {log.result}
                    </Badge>
                    <p className="text-[9px] text-neutral-400 mt-0.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
