// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { Database, Server, RefreshCw, CheckCircle, DatabaseZap } from 'lucide-react';

export default function DataConnectDashboard() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/omni-agent-api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'TRANSFER_TO_NCBDB' }),
      });
      const data = await res.json();
      setSyncResult(data);
    } catch (err) {
      setSyncResult({ success: false, error: err instanceof Error ? err.message : 'Sync failed' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex items-center gap-4 pb-6 border-b border-neutral-200">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
            <DatabaseZap size={20} className="text-neutral-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Data Connect 深度同步
            </h1>
            <p className="text-sm text-neutral-500">NCBDB 與 Supabase 雙向數據同步樞紐</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <Database size={20} className="text-emerald-600" />
              <h3 className="text-base font-bold text-neutral-900">Supabase (主庫)</h3>
              <Badge variant="success" size="sm">
                Connected
              </Badge>
            </div>
            <p className="text-sm text-neutral-500">
              儲存原始憑證、使用者身份、ZKP 紀錄與 5T 完整性簽章資料。
            </p>
          </Card>

          <Card variant="default" padding="md">
            <div className="flex items-center gap-3 mb-3">
              <Server size={20} className="text-blue-600" />
              <h3 className="text-base font-bold text-neutral-900">NCBDB (代理分析庫)</h3>
              <Badge variant="success" size="sm">
                Connected
              </Badge>
            </div>
            <p className="text-sm text-neutral-500">
              Nocodebackend 視覺化資料庫，用於 Agent 取用、報表生成與外部 API 查詢。
            </p>
          </Card>
        </div>

        <Card variant="default" padding="md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">執行全區深度同步</h3>
              <p className="text-sm text-neutral-500">
                將 Supabase 內的最新 ESG 報告與實證數據，完整對齊至 NCBDB 視覺化管理後台。
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleSync}
              loading={isSyncing}
              icon={<RefreshCw size={16} />}
            >
              {isSyncing ? '同步中...' : '啟動同步'}
            </Button>
          </div>
        </Card>

        {syncResult && (
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-neutral-900">同步結果</span>
            </div>
            <pre className="text-xs text-neutral-600 bg-neutral-50 p-4 rounded-lg overflow-auto max-h-[300px]">
              {JSON.stringify(syncResult, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
