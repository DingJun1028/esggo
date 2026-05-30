'use client';

import React, { useState } from 'react';
import { Database, Server, RefreshCw, CheckCircle, DatabaseZap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import StandardPage from '@/components/brand/StandardPage';
import { UniversalPageConfig } from '@/lib/page-config';

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
        body: JSON.stringify({ task: 'TRANSFER_TO_NCBDB' })
      });
      const data = await res.json();
      setSyncResult(data);
    } catch (err: unknown) {
      setSyncResult({ success: false, error: err.message });
    } finally {
      setIsSyncing(false);
    }
  };

  const pageConfig: UniversalPageConfig = {
    id: 'data-connect',
    title: 'Data Connect (NCBDB/Supabase) 深度同步',
    subtitle: 'Nocodebackend (NCBDB) 與 Supabase 的雙向數據同步樞紐。',
    icon: <DatabaseZap size={32} className="text-berkeley-blue" />,
    griReference: 'Data / oX',
    activeT5Tags: ['T1', 'T2', 'T5'],
    isOXModule: true,
    
    sections: [
      {
        id: 'sync-hub',
        title: '同步樞紐 (Sync Hub)',
        columns: 12,
        component: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 bg-white/60 shadow-glass border-t-4 border-t-emerald-400">
                <div className="flex items-center gap-4 mb-4">
                  <Database size={24} className="text-emerald-500" />
                  <h3 className="text-xl font-black text-slate-800">Supabase (主庫)</h3>
                  <Badge variant="verified" className="ml-auto">Connected</Badge>
                </div>
                <p className="text-sm text-slate-500 font-medium">儲存原始憑證、使用者身份、ZKP 紀錄與 5T 完整性簽章資料。</p>
              </Card>

              <Card className="p-8 bg-white/60 shadow-glass border-t-4 border-t-blue-400">
                <div className="flex items-center gap-4 mb-4">
                  <Server size={24} className="text-blue-500" />
                  <h3 className="text-xl font-black text-slate-800">NCBDB (代理分析庫)</h3>
                  <Badge variant="verified" className="ml-auto">Connected</Badge>
                </div>
                <p className="text-sm text-slate-500 font-medium">Nocodebackend 視覺化資料庫，用於 Agent 取用、報表生成與外部 API 查詢。</p>
              </Card>
            </div>

            <Card className="p-8 bg-berkeley-blue text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black mb-2">執行全區深度同步 (Global Deep Sync)</h3>
                <p className="text-sm text-blue-100/70">將 Supabase 內的最新 ESG 報告與實證數據，完整對齊至 NCBDB 視覺化管理後台。</p>
              </div>
              <Button 
                variant="primary" 
                className="w-full md:w-auto h-14 px-8 rounded-xl bg-white text-berkeley-blue hover:bg-slate-100 font-black shadow-lg"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <><RefreshCw size={20} className="mr-3 animate-spin" /> 同步中 (Syncing...)</>
                ) : (
                  <><RefreshCw size={20} className="mr-3" /> 啟動同步 (Start Sync)</>
                )}
              </Button>
            </Card>

            {syncResult && (
              <Card className="p-8 bg-slate-900 text-emerald-400 font-mono text-sm overflow-auto max-h-[300px]">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <span className="font-bold">同步結果</span>
                </div>
                <pre>{JSON.stringify(syncResult, null, 2)}</pre>
              </Card>
            )}
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
