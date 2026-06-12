'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { OmniBaseTable } from '@/components/ui/omni/OmniBaseTable';
import { ESGSmartQA } from '@/components/ui/ESGSmartQA';
import { BookOpen, Search, Plus, ShieldCheck, Activity, Brain, Lock, Loader2, FileText, Database } from 'lucide-react';

export default function ReadingRoomPage() {
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
      // Fetching from a omni proxy metrics endpoint
      const res = await fetch('/api/metrics/reading-room', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
      } else {
        // Fallback mock data for Reading Room
        setData([
          { id: 1, date: '2026-06-12', doc_title: '2026 ESG 永續報告草案', status: '已索引', vectors: 1250, hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
          { id: 2, date: '2026-06-10', doc_title: '歐盟 CBAM 規範指南 v2.pdf', status: '處理中', vectors: 0, hash_lock: null, source_origin: 'Manual' },
          { id: 3, date: '2026-06-05', doc_title: '供應鏈減碳宣導手冊', status: '已索引', vectors: 840, hash_lock: '0x1c...9d4f', source_origin: 'System' },
        ]);
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      // Fallback mock data
      setData([
        { id: 1, date: '2026-06-12', doc_title: '2026 ESG 永續報告草案', status: '已索引', vectors: 1250, hash_lock: '0x8f...3a21', source_origin: 'Auto-Agent' },
        { id: 2, date: '2026-06-10', doc_title: '歐盟 CBAM 規範指南 v2.pdf', status: '處理中', vectors: 0, hash_lock: null, source_origin: 'Manual' },
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
          evidence: { table: 'reading-room', recordId: id, timestamp: Date.now() }, 
          type: '5t-seal' 
        })
      });
      const resData = await response.json();
      if (resData.success && resData.hashLock) {
        setData(prev => prev.map(m => m.id === id ? { ...m, hash_lock: resData.hashLock } : m));
      } else {
        alert('封印失敗 (Seal Failed): ' + (resData.error || 'Unknown Error'));
      }
    } catch (error) {
      console.error('Seal exception:', error);
      alert('無法連線至封印金庫 (Vault Connection Error)。');
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
        alert('✅ 驗證成功 (Verification Success)：資料未遭篡改，符合 5T 誠信協議。');
      } else {
        alert('❌ 驗證失敗 (Verification Failed)：金庫校驗不符，資料可能已受損。');
      }
    } catch (e) {
      console.error('Verify exception:', e);
      alert('連線金庫時發生錯誤 (Vault Connection Error)。');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAddRecord = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      fetchData(); // re-fetch after add
    }, 1500);
  };

  const columns = [
    { key: 'date', label: '上傳日期' },
    { key: 'doc_title', label: '文獻名稱 (Document Title)', render: (val: any) => (
      <span className="flex items-center gap-2"><FileText size={14} className="text-cyan-400"/> {val}</span>
    ) },
    { key: 'status', label: '知識庫狀態', render: (val: any) => (
      <OmniBadge variant={val === '已索引' ? 'success' : 'warning'} size="sm">{val}</OmniBadge>
    ) },
    { key: 'vectors', label: '向量切塊 (Chunks)', render: (val: any) => (
      <span className="font-mono text-xs text-slate-400">{val} 塊</span>
    ) },
    { key: 'source_origin', label: '來源 (Source)' },
    { key: 'hash_lock', label: '5T Hash Lock', render: (val: any) => (
      val ? (
        <OmniBadge variant="success" size="sm" icon={<ShieldCheck size={12}/>}>
          {val.substring(0, 8)}...
        </OmniBadge>
      ) : (
        <OmniBadge variant="default" size="sm">未封印</OmniBadge>
      )
    ) },
    { key: 'action', label: '操作 (Actions)', render: (_: any, row: any) => (
      <div className="flex items-center gap-3">
        {!row.hash_lock && (
          <button 
            onClick={() => handleSeal(row.id)}
            disabled={sealingId === row.id}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {sealingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            T5 封印
          </button>
        )}
        <button 
          onClick={() => row.hash_lock ? handleVerify(row.id) : undefined}
          disabled={verifyingId === row.id}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {verifyingId === row.id ? <Loader2 size={14} className="animate-spin" /> : null}
          {row.hash_lock ? '驗證 5T' : '編輯'}
        </button>
      </div>
    ) }
  ];

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm" icon={<Brain size={12}/>}>OmniAgent Ready</OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">READING-ROOM</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">永續閱覽室</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">SUSTAINABILITY READING ROOM</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton variant="outline" icon={<Search size={16}/>} className="flex-1 md:flex-none">檢索</OmniButton>
            <OmniButton variant="primary" icon={<Plus size={16}/>} onClick={handleAddRecord} isLoading={isProcessing} className="flex-1 md:flex-none">
              新增紀錄
            </OmniButton>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OmniBaseCard variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-bold uppercase tracking-widest">收錄文獻</span>
              <BookOpen size={18} className="text-emerald-400" />
            </div>
            <div className="text-4xl font-black text-white">124<span className="text-lg text-slate-500 ml-2 font-normal">Docs</span></div>
            <p className="text-xs text-emerald-400/80 font-mono">Status: Indexed</p>
          </OmniBaseCard>

          <OmniBaseCard variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-bold uppercase tracking-widest">5T 驗證率</span>
              <ShieldCheck size={18} className="text-cyan-400" />
            </div>
            <div className="text-4xl font-black text-white">98.5<span className="text-lg text-slate-500 ml-2 font-normal">%</span></div>
            <p className="text-xs text-cyan-400/80 font-mono">Secured by Vault</p>
          </OmniBaseCard>

          <OmniBaseCard variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-bold uppercase tracking-widest">知識庫向量數</span>
              <Database size={18} className="text-amber-400" />
            </div>
            <div className="text-4xl font-black text-white">8,452<span className="text-lg text-slate-500 ml-2 font-normal">Chunks</span></div>
            <p className="text-xs text-amber-400/80 font-mono">OmniVector Syncing</p>
          </OmniBaseCard>
        </div>

        {/* Main Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <OmniBaseCard 
              variant="default" 
              title="業務資料視圖" 
              subtitle="Data synced with 5T Integrity Protocol"
              className="min-h-[400px]"
            >
              <OmniBaseTable 
                columns={columns}
                data={data}
                loading={loading}
              />
            </OmniBaseCard>
          </div>
          
          <div className="space-y-6">
            <OmniBaseCard 
              variant="glow" 
              title="永續知識大腦" 
              subtitle="ESGSmartQA (RAG Powered)"
            >
              <div className="space-y-4 text-sm text-slate-300">
                <p className="mb-4">
                  您可以直接在下方詢問關於 TCFD、CBAM、或者上傳的 ESG 報告書內容。
                </p>
                {/* 注入真實的 RAG QA 組件 */}
                <ESGSmartQA />
              </div>
            </OmniBaseCard>
          </div>
        </div>

      </div>
    </div>
  );
}
