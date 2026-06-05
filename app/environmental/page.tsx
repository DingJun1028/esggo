'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalTable } from '@/components/ui/universal/UniversalTable';
import { UniversalModal } from '@/components/ui/universal/UniversalModal';
import { UniversalForm, FormField } from '@/components/ui/universal/UniversalForm';
import { Leaf, Search, Plus, ShieldCheck, Activity, Brain, Lock, Loader2, X } from 'lucide-react';

export default function EnvironmentalPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sealingId, setSealingId] = useState<number | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetching from a universal proxy metrics endpoint
      const res = await fetch('/api/metrics/environmental', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
      } else {
        // Fallback mock data for Trinity UIUX demonstration if API fails
        setData([
          { id: 1, date: '2026-06-01', metric_name: 'Sample Metric Alpha', metric_value: 1200, unit: 'mÁ≥?, hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
          { id: 2, date: '2026-06-02', metric_name: 'Sample Metric Beta', metric_value: 350, unit: 'unit', hash_lock: null, source_origin: 'Manual' },
          { id: 3, date: '2026-06-03', metric_name: 'Sample Metric Gamma', metric_value: 98.5, unit: '%', hash_lock: '0x1c...9d4f', source_origin: 'System' },
        ]);
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      // Fallback mock data
      setData([
        { id: 1, date: '2026-06-01', metric_name: 'Sample Metric Alpha', metric_value: 1200, unit: 'mÁ≥?, hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
        { id: 2, date: '2026-06-02', metric_name: 'Sample Metric Beta', metric_value: 350, unit: 'unit', hash_lock: null, source_origin: 'Manual' },
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
          evidence: { table: 'environmental', recordId: id, timestamp: Date.now() }, 
          type: '5t-seal' 
        })
      });
      const resData = await response.json();
      if (resData.success && resData.hashLock) {
        setData(prev => prev.map(m => m.id === id ? { ...m, hash_lock: resData.hashLock } : m));
      } else {
        alert('?†Óºª?¢ÊÜ≠?? (Seal Failed): ' + (resData.error || 'Unknown Error'));
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
        body: JSON.stringify({ recordId: id, type: '5t-seal' })
      });
      const resData = await response.json();
      if (resData.success && resData.valid) {
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

  const handleAddRecord = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    setIsProcessing(true);
    // Simulate API call and state update
    setTimeout(() => {
      const newRecord = {
        id: Date.now(),
        date: formData.date || new Date().toISOString().split('T')[0],
        metric_name: formData.metric_name,
        metric_value: Number(formData.metric_value),
        unit: formData.unit,
        hash_lock: null,
        source_origin: 'Manual (UniversalForm)'
      };
      setData(prev => [newRecord, ...prev]);
      setIsProcessing(false);
      setIsModalOpen(false);
    }, 800);
  };

  const formFields: FormField[] = [
    { name: 'date', label: '?•Ê? (Date)', type: 'date', required: true },
    { name: 'metric_name', label: '?áÊ??çÁ®± (Metric Name)', type: 'text', placeholder: 'e.g. ??ÜÊº≤?ÆË???Èß?', required: true },
    { name: 'metric_value', label: '?∏ÂÄ?(Value)', type: 'number', placeholder: 'e.g. 1500', required: true },
    { name: 'unit', label: '?Æ‰? (Unit)', type: 'enum', options: ['??, 'Â∫?, 'kWh', '%', '??], required: true },
  ];

  const columns = [
    { key: 'date', label: '?•Ê? (Date)' },
    { key: 'metric_name', label: '?áÊ??çÁ®± (Metric Name)' },
    { key: 'metric_value', label: '?∏ÂÄ?(Value)', render: (val: any, row: any) => (
      <span>{val} <span className="text-xs text-slate-500 ml-1">{row.unit}</span></span>
    ) },
    { key: 'source_origin', label: '‰æÜÊ? (Source)' },
    { key: 'hash_lock', label: '5T Hash Lock', render: (val: any) => (
      val ? (
        <UniversalBadge variant="success" size="sm" icon={<ShieldCheck size={12}/>}>
          {val.substring(0, 8)}...
        </UniversalBadge>
      ) : (
        <UniversalBadge variant="default" size="sm">?™Â?Ë£?/UniversalBadge>
      )
    ) },
    { key: 'action', label: '?ç‰? (Actions)', render: (_: any, row: any) => (
      <div className="flex items-center gap-3">
        {!row.hash_lock && (
          <button 
            onClick={() => handleSeal(row.id)}
            disabled={sealingId === row.id}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {sealingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            T5 ?†Óºª??
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
    ) }
  ];

  
  const p = {
    id: `ESG-${"OMN"}`,
    title: 'Environmental',
    sub: 'Environmental Management'
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Leaf className="text-cyan-400 relative z-10" size={28} />
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
            <UniversalButton variant="outline" icon={<Search size={16}/>} className="flex-1 md:flex-none">?ºÔºπ??/UniversalButton>
            <UniversalButton variant="primary" icon={<Plus size={16}/>} onClick={handleAddRecord} isLoading={isProcessing} className="flex-1 md:flex-none">
              ????ù¬Ä??            </UniversalButton>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UniversalCard variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-bold uppercase tracking-widest">Ê¥ªË?ÁØÄÈª?/span>
              <Activity size={18} className="text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-white">3<span className="text-lg text-slate-500 ml-2 font-normal">Nodes</span></div>
            <p className="text-xs text-emerald-400/80 font-mono">Status: Optimal</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-bold uppercase tracking-widest">5T ?ΩÓ???</span>
              <ShieldCheck size={18} className="text-cyan-400" />
            </div>
            <div className="text-4xl font-black text-white">98.5<span className="text-lg text-slate-500 ml-2 font-normal">%</span></div>
            <p className="text-xs text-cyan-400/80 font-mono">Secured by Vault</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-bold uppercase tracking-widest">Ê•≠Â??èËºØ</span>
              <Brain size={18} className="text-amber-400" />
            </div>
            <div className="text-4xl font-black text-white">100<span className="text-lg text-slate-500 ml-2 font-normal">%</span></div>
            <p className="text-xs text-amber-400/80 font-mono">Trinity UIUX Compliant</p>
          </UniversalCard>
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <UniversalCard 
              variant="default" 
              title="Ê•≠Â?Ë≥áÊ??êË¶Ω" 
              subtitle="Data synced with 5T Integrity Protocol"
              className="min-h-[400px]"
            >
              <UniversalTable 
                columns={columns}
                data={data}
                loading={loading}
              />
            </UniversalCard>
          </div>
          
          <div className="space-y-6">
            <UniversalCard 
              variant="glow" 
              title="OmniAgent ?∏Â?"
              subtitle="AI ?ΩÂ?‰∏≠Â?"
            >
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  Ê≠§Â?Ê°àÂÖ∑??<strong>?®Á´Ø?∫ËÉΩ?∏Â?</strong>ÔºåÁ¨¶?àÂö¥??TypeScript Ê®ôÊ???
                </p>
                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <h4 className="font-bold text-cyan-400 mb-2">?ÆÂ???Ó∏? (Trinity UIUX)</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                    <li>?∞Ôº∏?óÊ??? (Customer Experience)</li>
                    <li>?ÜÂ????¥Êë© (Business Logic)</li>
                    <li>?ÜË??∏Ëù¢?îÈ? (Liquid Glass Cyan)</li>
                  </ul>
                </div>
              </div>
            </UniversalCard>
          </div>
        </div>

      </div>

      <UniversalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="?∞Â? ESG ?∞Â??∏Ê?"
      >
        <div className="mb-4 text-sm text-slate-400">
          ?∞Â??ÑÁí∞Â¢ÉÊï∏?öÂ??™Â?Á¥Ä?ÑÁÇ∫‰∫∫Â∑•Ëº∏ÂÖ•Ôºå‰∏¶Á¨¶Â? 5T ?îË≠∞??
        </div>
        <UniversalForm 
          fields={formFields} 
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          submitLabel={isProcessing ? "?????.." : "?ñÊÄ†ÔÖØ?àÔã™?"}
        />
      </UniversalModal>
    </div>
  );
}

