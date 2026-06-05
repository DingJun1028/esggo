'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { PenTool, Search, Plus, ShieldCheck, Activity, Brain, Lock, Loader2 } from 'lucide-react';
import VaultOmniTable from '@/components/omni/VaultOmniTable';
import OmniKpiCard from '@/components/omni/OmniKpiCard';

export default function EditorPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sealingId, setSealingId] = useState<number | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ?Ä?Ä 1. ?™Â??óË©¶Âæ?Blue.cc ?âÂ??üÂØ¶Ë≥áÊ? ?Ä?Ä
      const blueRes = await fetch('/api/bluecc/records', { cache: 'no-store' });
      if (blueRes.ok) {
        const blueJson = await blueRes.json();
        if (blueJson.ok && blueJson.records?.length > 0) {
          // Â∞?Blue.cc records ËΩâÊ???editor ?ÄË¶ÅÁ??ºÂ?
          const mapped = blueJson.records.map((rec: any, idx: number) => ({
            id: rec.id || idx + 1,
            date: rec.updatedAt ? rec.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            metric_name: rec.title || `Record ${idx + 1}`,
            metric_value: rec.customFields?.value ?? rec.customFields?.metric_value ?? '-',
            unit: rec.customFields?.unit ?? '',
            hash_lock: rec.customFields?.zkp_hash || rec.customFields?.hash_lock || null,
            source_origin: rec.status || 'Blue.cc',
          }));
          setData(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (blueErr) {
      console.warn('[Editor] Blue.cc fetch failed, falling back:', blueErr);
    }

    // ?Ä?Ä 2. Fallback: ?óË©¶?¨Âú∞ metrics API ?Ä?Ä
    try {
      const res = await fetch('/api/metrics/editor', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
      } else {
        setData([
          { id: 1, date: '2026-06-01', metric_name: 'Sample Metric Alpha', metric_value: 1200, unit: 'm¬≥', hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
          { id: 2, date: '2026-06-02', metric_name: 'Sample Metric Beta', metric_value: 350, unit: '??, hash_lock: null, source_origin: 'Manual' },
          { id: 3, date: '2026-06-03', metric_name: 'Sample Metric Gamma', metric_value: 98.5, unit: '%', hash_lock: '0x1c...9d4f', source_origin: 'System' },
        ]);
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      setData([
        { id: 1, date: '2026-06-01', metric_name: 'Sample Metric Alpha', metric_value: 1200, unit: 'm¬≥', hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
        { id: 2, date: '2026-06-02', metric_name: 'Sample Metric Beta', metric_value: 350, unit: '??, hash_lock: null, source_origin: 'Manual' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeal = async (id: number) => {
    setSealingId(id);
    try {
      const response = await fetch('/api/vault/seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          evidenceUuid: id,
          sealType: '5t',
          sourceOrigin: 'blue-cc-sync'
        })
      });
      const resData = await response.json();
      if (resData.success && resData.hashLock) {
        setData(prev => prev.map(m => m.id === id ? { ...m, hash_lock: resData.hashLock } : m));
      } else {
        alert('Â∞ÅÂç∞Â§±Ê? (Seal Failed): ' + (resData.error || 'Unknown Error'));
      }
    } catch (error) {
      console.error('Seal exception:', error);
      alert('Vault Connection Error');
    } finally {
      setSealingId(null);
    }
  };

  const handleVerify = async (id: number) => {
    setVerifyingId(id);
    try {
      const response = await fetch('/api/vault/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: id })
      });
      const resData = await response.json();
      // Adjust according to the API's actual response structure (resData.data.isValid)
      if (resData.success && resData.data?.isValid) {
        alert('Verification Success: 5T Protocol Compliant');
      } else {
        alert('Verification Failed: Invalid Hash Lock');
      }
    } catch (e) {
      console.error('Verify exception:', e);
      alert('Vault Connection Error');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAddRecord = async () => {
    setIsProcessing(true);
    try {
      // ?åÊ≠•Âª∫Á? Blue.cc Á¥Ä??      await fetch('/api/bluecc/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `New ESG Record ${new Date().toISOString().split('T')[0]}`,
          customFields: { source: 'esggo-editor', created_at: new Date().toISOString() },
        }),
      });
    } catch (e) {
      console.warn('[Editor] Blue.cc create failed:', e);
    } finally {
      setIsProcessing(false);
      fetchData();
    }
  };

  const vaultColumns = [
    { key: 'metric_name', label: '?áÊ??çÁ®± (Metric Name)' },
    { key: 'metric_value', label: '?∏ÂÄ?(Value)' },
    { key: 'action', label: '?ç‰? (Actions)' }
  ];

  const vaultRecords = data.map(row => ({
    id: row.id.toString(),
    timestamp: row.date,
    author: row.source_origin,
    zkpHash: row.hash_lock || 'UNSEALED_PENDING_ZKP',
    fiveTStatus: row.hash_lock 
      ? [true, true, true, true, true] as [boolean, boolean, boolean, boolean, boolean]
      : [true, true, false, false, false] as [boolean, boolean, boolean, boolean, boolean],
    data: {
      metric_name: row.metric_name,
      metric_value: (
        <span className="font-bold text-slate-200">
          {row.metric_value} <span className="text-xs text-slate-500 font-normal ml-1">{row.unit}</span>
        </span>
      ),
      action: (
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {!row.hash_lock && (
            <button 
              onClick={() => handleSeal(row.id)}
              disabled={sealingId === row.id}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {sealingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              T5 Â∞ÅÂç∞
            </button>
          )}
          <button 
            onClick={() => row.hash_lock ? handleVerify(row.id) : undefined}
            disabled={verifyingId === row.id}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {verifyingId === row.id ? <Loader2 size={14} className="animate-spin" /> : null}
            {row.hash_lock ? 'È©óË? 5T' : 'Á∑®ËºØ'}
          </button>
        </div>
      )
    }
  }));

  const p = {
    id: `ESG-EDI`,
    title: 'Editor',
    sub: 'Editor Management'
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <PenTool className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="primary" size="sm" icon={<Brain size={12}/>}>OmniAgent Ready</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{p.id}</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">{p.title}</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">{p.sub}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <UniversalButton variant="outline" icon={<Search size={16}/>} className="flex-1 md:flex-none">Ê™¢Á¥¢</UniversalButton>
            <UniversalButton variant="primary" icon={<Plus size={16}/>} onClick={handleAddRecord} isLoading={isProcessing} className="flex-1 md:flex-none">
              ?∞Â?Á¥Ä??            </UniversalButton>
          </div>
        </header>

        {/* Dashboard Grid using OmniKpiCard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OmniKpiCard
            title="Ê¥ªË?‰ª??"
            value="3"
            unit="Nodes"
            trend={12.5}
            trendLabel="Optimal Status"
            fiveTStatus={[true, true, true, true, true]}
            icon={<Activity size={20} />}
          />

          <OmniKpiCard
            title="5T È©óË???
            value="98.5"
            unit="%"
            trend={5.2}
            trendLabel="Secured by Vault"
            fiveTStatus={[true, true, true, true, true]}
            icon={<ShieldCheck size={20} />}
          />

          <OmniKpiCard
            title="Ê•≠Â??èËºØË¶ÜË?"
            value="100"
            unit="%"
            fiveTStatus={[true, true, true, false, false]}
            trendLabel="Trinity UIUX Compliant"
            icon={<Brain size={20} />}
          />
        </div>

        {/* Main Workspace Area using VaultOmniTable */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
             <VaultOmniTable 
                columns={vaultColumns}
                records={vaultRecords}
                className="min-h-[400px]"
             />
          </div>
          
          <div className="space-y-6">
            <UniversalCard 
              variant="glow" 
              title="OmniAgent ?∏Â?"
              subtitle="AI ?ΩÂ?‰∏≠Â?"
            >
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  Ê≠§Â?Ê°àÂÖ∑??<strong>?®Á´Ø?∫ËÉΩ?∏Â?</strong>ÔºåÁ¨¶?àÂö¥??TypeScript Ê®ôÊ???                </p>
                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <h4 className="font-bold text-cyan-400 mb-2">Ë®≠Ë??üÂ? (Trinity UIUX)</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                    <li>ÂÆ¢Êà∂È´îÈ? (Customer Experience)</li>
                    <li>Ê•≠Â??èËºØ (Business Logic)</li>
                    <li>Ê•µËá¥ÁæéÂ≠∏ (Liquid Glass Cyan)</li>
                  </ul>
                </div>
              </div>
            </UniversalCard>
          </div>
        </div>

      </div>
    </div>
  );
}
