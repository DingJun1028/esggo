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
    } catch (err) {
      const syncError = err instanceof Error ? err.message : 'Sync failed';
      setSyncResult({ success: false, error: syncError });
    } finally {
      setIsSyncing(false);
    }
  };

  const pageConfig: UniversalPageConfig = {
    id: 'data-connect',
    title: 'Data Connect (NCBDB/Supabase) Ê∑±Â∫¶?åÊ≠•',
    subtitle: 'Nocodebackend (NCBDB) ??Supabase ?ÑÈ??ëÊï∏?öÂ?Ê≠•Ê?Á¥ê„Ä?,
    icon: <DatabaseZap size={32} className="text-berkeley-blue" />,
    griReference: 'Data / oX',
    activeT5Tags: ['T1', 'T2', 'T5'],
    isOXModule: true,
    
    sections: [
      {
        id: 'sync-hub',
        title: '?åÊ≠•Ê®ûÁ? (Sync Hub)',
        columns: 12,
        component: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 bg-white/60 shadow-glass border-t-4 border-t-emerald-400">
                <div className="flex items-center gap-4 mb-4">
                  <Database size={24} className="text-emerald-500" />
                  <h3 className="text-xl font-black text-slate-800">Supabase (‰∏ªÂ∫´)</h3>
                  <Badge variant="verified" className="ml-auto">Connected</Badge>
                </div>
                <p className="text-sm text-slate-500 font-medium">?≤Â??üÂ??ëË??Å‰Ωø?®ËÄÖË∫´‰ªΩ„ÄÅZKP Á¥Ä?ÑË? 5T ÂÆåÊï¥?ßÁ∞ΩÁ´†Ë??ô„Ä?/p>
              </Card>

              <Card className="p-8 bg-white/60 shadow-glass border-t-4 border-t-blue-400">
                <div className="flex items-center gap-4 mb-4">
                  <Server size={24} className="text-blue-500" />
                  <h3 className="text-xl font-black text-slate-800">NCBDB (‰ª???ÜÊ?Â∫?</h3>
                  <Badge variant="verified" className="ml-auto">Connected</Badge>
                </div>
                <p className="text-sm text-slate-500 font-medium">Nocodebackend Ë¶ñË¶∫?ñË??ôÂ∫´ÔºåÁî®??Agent ?ñÁî®?ÅÂ†±Ë°®Á??êË?Â§ñÈÉ® API ?•Ë©¢??/p>
              </Card>
            </div>

            <Card className="p-8 bg-berkeley-blue text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black mb-2">?∑Ë??®Â?Ê∑±Â∫¶?åÊ≠• (Global Deep Sync)</h3>
                <p className="text-sm text-blue-100/70">Â∞?Supabase ?ßÁ??Ä??ESG ?±Â??áÂØ¶Ë≠âÊï∏?öÔ?ÂÆåÊï¥Â∞çÈ???NCBDB Ë¶ñË¶∫?ñÁÆ°?ÜÂ??∞„Ä?/p>
              </div>
              <Button 
                variant="primary" 
                className="w-full md:w-auto h-14 px-8 rounded-xl bg-white text-berkeley-blue hover:bg-slate-100 font-black shadow-lg"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <><RefreshCw size={20} className="mr-3 animate-spin" /> ?åÊ≠•‰∏?(Syncing...)</>
                ) : (
                  <><RefreshCw size={20} className="mr-3" /> ?üÂ??åÊ≠• (Start Sync)</>
                )}
              </Button>
            </Card>

            {syncResult && (
              <Card className="p-8 bg-slate-900 text-emerald-400 font-mono text-sm overflow-auto max-h-[300px]">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={20} className="text-emerald-500" />
                  <span className="font-bold">?åÊ≠•ÁµêÊ?</span>
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
