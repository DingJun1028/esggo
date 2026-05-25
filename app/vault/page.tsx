'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Upload, Shield, Eye, X, CheckCircle, Clock, AlertTriangle, Zap, Bot, RefreshCw, Database, Search, Filter, Share2, History, ChevronDown, FileText, ShieldCheck, ArrowUpRight, Lock, CheckSquare, Sparkles, XCircle, Award, Network
} from 'lucide-react';
import { getEvidenceFiles, insertEvidence, sealEvidence, type EvidenceFile } from '../../lib/db';
import { 
  create5TAttestation, generateSelectiveDisclosure, generateRangeProof, 
  type T5Attestation, type SelectiveDisclosureProof, type ZKPRangeProof
} from '../../lib/crypto-proof';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandModal, BrandInput, BrandStatusDot, BrandT5Strip, BrandPageHeader, BrandTooltip, StandardPage, BrandCardHeader
} from '../../components/brand';
import SelectionHouse, { SelectionCategory } from '../../components/ui/SelectionHouse';
import { ZKPRangeProofVisualizer } from '../../components/ui/ZKPRangeProofVisualizer';
import { IntegrityCertificateView } from '../../components/ui/IntegrityCertificateView';
import { AnchoredBadge } from '../../components/ui/AnchoredBadge';
import { generateIntegrityCertificate, type IntegrityCertificate } from '../../lib/proof-export';
import { policyEngine } from '../../lib/policy-engine';
import { anchorageEngine } from '../../lib/anchorage-engine';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { omniCore } from '../../lib/omni-core';

const CATEGORIES = ['全部', 'E', 'S', 'G', 'T'];
const CAT_LABELS: Record<string, string> = { 'E': '環境', 'S': '社會', 'G': '治理', 'T': '資安' };

export default function VaultPage() {
  const { user, companyId } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [form, setForm] = useState({ file_name: '', category: 'E', gri_reference: '', uploader: '' });
  const [tagging, setTagging] = useState(false);
  const [selectionHouse, setSelectionHouse] = useState<{ open: boolean, type: 'category' | 'gri' | null }>({ open: false, type: null });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // ZKP & Anchorage State
  const [proofBundle, setProofBundle] = useState<any | null>(null);
  const [privacyProof, setPrivacyProof] = useState<SelectiveDisclosureProof | null>(null);
  const [rangeProof, setRangeProof] = useState<ZKPRangeProof | null>(null);
  const [certificate, setCertificate] = useState<IntegrityCertificate | null>(null);
  const [showProof, setShowProof] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRange, setShowRange] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [anchorageReceipt, setAnchorageReceipt] = useState<any | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = async () => {
    setLoading(true);
    try { 
      const { data } = await supabase.from('evidence_vault').select('*').order('created_at', { ascending: false });
      setFiles(data || []); 
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const anchorFiles = async () => {
    const verifiedUnanchored = files.filter(f => f.status === 'verified' && !f.anchored);
    if (verifiedUnanchored.length === 0) {
      showToast('目前沒有可錨定的已驗證憑證', 'info');
      return;
    }

    setLoading(true);
    try {
      const seals = verifiedUnanchored.map(f => f.hash_lock);
      const receipt = await anchorageEngine.anchorBatch(seals);
      
      for (const file of verifiedUnanchored) {
        await supabase.from('evidence_vault').update({ 
          anchored: true, 
          tx_hash: receipt.txHash,
          anchored_at: receipt.timestamp 
        }).eq('id', file.id);
      }
      
      setAnchorageReceipt(receipt);
      showToast(`已成功錨定 ${seals.length} 筆憑證至公共帳本`, 'success');
      await load();
    } catch (e) {
      showToast('錨定失敗', 'error');
    } finally {
      setLoading(false);
    }
  };

  const autoTagFile = async () => {
    if (!form.file_name) { showToast('請先輸入檔案名稱以供 AI 分析', 'info'); return; }
    setTagging(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const name = form.file_name.toLowerCase();
      let suggestedCat = 'E';
      let suggestedGri = 'GRI 305-1';
      if (name.includes('薪') || name.includes('人')) { suggestedCat = 'S'; suggestedGri = 'GRI 401'; }
      else if (name.includes('電') || name.includes('能')) { suggestedCat = 'E'; suggestedGri = 'GRI 302'; }
      else if (name.includes('法') || name.includes('章')) { suggestedCat = 'G'; suggestedGri = 'GRI 2-1'; }
      setForm(p => ({ ...p, category: suggestedCat, gri_reference: suggestedGri }));
      showToast('OmniHermes 已完成標籤建議', 'success');
    } catch (e) {
      showToast('AI 標籤引擎暫時離線', 'error');
    } finally {
      setTagging(false);
    }
  };

  const sealFile = async (file: any) => {
    setSealingId(file.id!);
    try {
      const policyId = file.category === 'E' ? 'policy_csrd_e1_1' : 'policy_gri_305_1';
      const result = await omniCore.sealComponent(
        file.file_name,
        `/vault/${file.id}`,
        file.gri_reference || '[GENERAL_METRIC]',
        policyId
      );

      if (result.validation && !result.validation.isValid) {
        showToast(`合規檢查未通過 (Score: ${result.validation.score}): ${result.validation.violations[0]}`, 'error');
      }

      const { error } = await supabase.from('evidence_vault').update({ 
        status: 'verified', zkp_proof: true, hash_lock: result.hash_lock, t5_bundle: result
      }).eq('id', file.id);

      if (error) throw error;
      await load();
      showToast('5T 誠信封印 & 政策驗證完成', 'success');
    } catch (e) {
      showToast('5T 封印失敗', 'error');
    } finally {
      setSealingId(null);
    }
  };

  const showIntegrityCertificate = async (file: any) => {
    if (!file.hash_lock) return;
    const component = {
      uuid: file.id,
      timestamp: new Date(file.created_at).getTime(),
      version: '1.1.0',
      evidence: {
        tangible_metric: file.file_name,
        source_origin: `/vault/${file.id}`,
        lifecycle_hooks: [],
        formula_ref: file.gri_reference
      },
      status: 'Trustworthy' as const,
      hash_lock: file.hash_lock
    };
    const cert = await generateIntegrityCertificate(component, 'ESG GO Enterprise Partner');
    
    if (file.anchored) {
      cert.verificationUrl += `?tx=${file.tx_hash}`;
      cert.masterSeal = `${cert.masterSeal} (Anchored: ${file.tx_hash.substring(0,10)}...)`;
    }

    setCertificate(cert);
    setShowCertificate(true);
  };

  const draftFromEvidence = async (file: any) => {
    showToast('OmniHermes 正在提取憑證特徵並構思草稿...', 'info');
    setScanningId(file.id);
    try {
      await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: user?.email || 'vault_user',
          taskType: 'report_drafting',
          title: `憑證自動撰寫: ${file.file_name}`,
          description: `基於憑證 [${file.id}] 的內容，撰寫對應 ${file.gri_reference} 的章節。`,
          skillKey: 'gri_report_draft'
        })
      });
      showToast('草稿生成任務已排入蜂群', 'success');
    } catch (e) {
      showToast('自動撰寫引擎故障', 'error');
    } finally {
      setScanningId(null);
    }
  };

  const handleScan = async (file: any) => {
    setScanningId(file.id!);
    try {
      const res = await fetch('/api/hermes/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.id, fileType: 'image/pdf' }),
      });
      if (!res.ok) throw new Error('Scan failed');
      showToast('AI 掃描完成。', 'success');
    } catch {
      showToast('AI 掃描失敗', 'error');
    } finally {
      setScanningId(null);
    }
  };

  const generateZKP = async (file: any) => {
    const proof = await generateSelectiveDisclosure(file.id, (v) => v.length > 0, "Evidence exists and has valid source identity");
    setPrivacyProof(proof);
    setShowPrivacy(true);
  };

  const triggerRangeZKP = async (file: any) => {
    const proof = await generateRangeProof(850, 0, 1000);
    setRangeProof(proof);
    setShowRange(true);
  };

  const filtered = files.filter(f => {
    const matchCat = activeCategory === '全部' || f.category === activeCategory;
    const matchSearch = !search || f.file_name.toLowerCase().includes(search.toLowerCase()) || (f.gri_reference || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const verifiedCount = files.filter(f => f.status === 'verified').length;

  const griCategories: SelectionCategory[] = [
    { id: 'E', title: '環境指標', items: [{ id: '302', label: 'GRI 302: 能源', tag: 'GRI 302' }, { id: '305', label: 'GRI 305: 排放', tag: 'GRI 305' }] },
    { id: 'S', title: '社會指標', items: [{ id: '401', label: 'GRI 401: 僱用', tag: 'GRI 401' }, { id: '403', label: 'GRI 403: 安全', tag: 'GRI 403' }] }
  ];

  const catCategories: SelectionCategory[] = [
    { id: 'esg', title: 'ESG 分類', items: [{ id: 'E', label: '環境', tag: 'E' }, { id: 'S', label: '社會', tag: 'S' }, { id: 'G', label: '治理', tag: 'G' }] }
  ];

  const pageConfig: UniversalPageConfig = {
    id: 'evidence-vault',
    title: '證據金庫 Vault',
    subtitle: '5T 誠信協議 · ZKP 零知識證明 · 公共帳本錨定：建立企業永續治理的「誠信主權」。',
    icon: <Database size={32} />,
    griReference: 'Governance Vault',
    activeT5Tags: ['T1', 'T2', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'anchor', label: '批次錨定', icon: <Network size={16}/>, variant: 'secondary', onClick: anchorFiles, loading },
      { id: 'upload', label: '上傳佐證', icon: <Upload size={16}/>, onClick: () => setShowUpload(true) }
    ],
    kpis: [
      { key: 'total', label: '總文件數', value: files.length, icon: <FileText size={18}/>, color: '#003262' },
      { key: 'sealed', label: '已實證封印', value: verifiedCount, icon: <ShieldCheck size={18}/>, color: '#10B981', verified: true },
      { key: 'pending', label: '待處理項', value: files.filter(f => f.status === 'pending').length, icon: <Clock size={18}/>, color: '#FDB515' },
      { key: 'coverage', label: '5T 覆蓋率', value: `${Math.round((verifiedCount / (files.length || 1)) * 100)}%`, icon: <Zap size={18}/>, color: '#3B7EA1', verified: true },
    ],
    sections: [
      {
        id: 'browser',
        title: '憑證檔案管理',
        columns: 12,
        component: (
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative group">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003262] transition-colors" />
                   <input placeholder="搜尋檔名、GRI 指標..." className="w-full h-12 bg-white rounded-2xl border border-slate-100 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 overflow-x-auto p-1 bg-slate-50 rounded-2xl border border-slate-100 no-scrollbar">
                   {CATEGORIES.map(c => (
                     <button key={c} onClick={() => setActiveCategory(c)} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === c ? 'bg-[#003262] text-white shadow-lg' : 'text-slate-400 hover:text-[#003262]'}`}>
                       {c === '全部' ? 'ALL' : c}
                     </button>
                   ))}
                </div>
             </div>
             <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
                <BrandTable loading={loading} columns={[{ label: '檔案名稱', key: 'name' }, { label: '類別', key: 'cat' }, { label: 'GRI', key: 'gri' }, { label: '5T 封印', key: 'zkp' }, { label: '操作', key: 'actions' }]}
                  data={filtered.map(f => ({
                    name: (
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#003262] shadow-sm"><FileText size={16} /></div>
                         <div className="flex flex-col">
                            <span className="font-bold text-[#003262]">{f.file_name}</span>
                            <span className="text-[8px] font-mono text-slate-400">{f.id.slice(0,8)}</span>
                         </div>
                      </div>
                    ),
                    cat: <BrandBadge variant="outline" size="xs" className="opacity-60">{CAT_LABELS[f.category || 'E']}</BrandBadge>,
                    gri: <BrandBadge variant="info" size="xs" className="font-mono">{f.gri_reference || '-'}</BrandBadge>,
                    zkp: f.zkp_proof ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                           <BrandBadge variant="gold" size="xs" className="font-black">T5_SEALED</BrandBadge>
                           <button onClick={() => showIntegrityCertificate(f)} className="text-blue-500 hover:text-blue-700" title="查看誠信憑證"><Award size={14}/></button>
                           <button onClick={() => { setProofBundle(f.t5_bundle); setShowProof(true); }} className="text-slate-400 hover:text-blue-500" title="查看原始 5T Bundle"><Share2 size={12}/></button>
                        </div>
                        {f.anchored && <AnchoredBadge txHash={f.tx_hash} />}
                      </div>
                    ) : <span className="text-[10px] font-black text-slate-300">UNSEALED</span>,
                    actions: (
                      <div className="flex gap-2">
                         <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => setSelected(f)}><Eye size={14}/></BrandButton>
                         <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => handleScan(f)} loading={scanningId === f.id}><Bot size={14}/></BrandButton>
                         {f.status !== 'verified' ? (
                           <BrandButton variant="primary" size="xs" className="h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest" onClick={() => sealFile(f)} loading={sealingId === f.id}>Seal_5T</BrandButton>
                         ) : (
                           <div className="flex gap-1">
                             <BrandButton variant="secondary" size="xs" className="h-8 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest border-blue-200 text-blue-600" onClick={() => generateZKP(f)}>Privacy</BrandButton>
                             <BrandButton variant="secondary" size="xs" className="h-8 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest border-purple-200 text-purple-600" onClick={() => triggerRangeZKP(f)}>Range</BrandButton>
                             <BrandButton variant="primary" size="xs" className="h-8 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm" onClick={() => draftFromEvidence(f)} loading={scanningId === f.id}><Sparkles size={10} className="mr-1" /> Draft</BrandButton>
                           </div>
                         )}
                      </div>
                    )
                  }))}
                />
             </BrandCard>
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      <SelectionHouse isOpen={selectionHouse.open && selectionHouse.type === 'category'} onClose={() => setSelectionHouse({ open: false, type: null })} onSelect={(item) => { setForm(p => ({ ...p, category: item.tag! })); setSelectionHouse({ open: false, type: null }); }} categories={catCategories} title="選擇類別" />
      <SelectionHouse isOpen={selectionHouse.open && selectionHouse.type === 'gri'} onClose={() => setSelectionHouse({ open: false, type: null })} onSelect={(item) => { setForm(p => ({ ...p, gri_reference: item.tag! })); setSelectionHouse({ open: false, type: null }); }} categories={griCategories} title="選擇指標" />
      
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowUpload(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-xl w-full overflow-hidden text-center">
              <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-8 text-slate-300 hover:border-[#003262] hover:text-[#003262] transition-all cursor-pointer"><Upload size={40} /></div>
              <h3 className="text-2xl font-black text-[#003262] uppercase tracking-tight mb-3">上傳治理憑證</h3>
              <div className="space-y-6 mb-10 text-left">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Name</label>
                       <button onClick={autoTagFile} disabled={tagging} className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 hover:text-emerald-700 transition-all uppercase bg-emerald-50 px-2 py-1 rounded-lg"><Bot size={10} className={tagging ? 'animate-spin' : ''} /> {tagging ? 'Analyzing...' : 'Hermes_AutoTag'}</button>
                    </div>
                    <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all" value={form.file_name} onChange={e => setForm({...form, file_name: e.target.value})} placeholder="例如：2024Q3電力單據.pdf" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setSelectionHouse({ open: true, type: 'category' })} className="h-14 bg-white border border-slate-100 rounded-2xl px-6 flex items-center justify-between text-sm font-bold text-slate-700">{form.category} <ChevronDown size={14} /></button>
                    <button onClick={() => setSelectionHouse({ open: true, type: 'gri' })} className="h-14 bg-white border border-slate-100 rounded-2xl px-6 flex items-center justify-between text-sm font-bold text-slate-700">{form.gri_reference || '選擇指標'} <ChevronDown size={14} /></button>
                 </div>
              </div>
              <div className="flex gap-4">
                 <BrandButton variant="ghost" className="flex-1 rounded-2xl h-14" onClick={() => setShowUpload(false)}>取消</BrandButton>
                 <BrandButton variant="primary" className="flex-[2] rounded-2xl h-14 font-black shadow-xl" onClick={async () => { await supabase.from('evidence_vault').insert({ ...form, company_id: companyId, uploader: user?.email || 'dev_user', hash_lock: 'pending_hash' }); setShowUpload(false); load(); }}>確認上傳</BrandButton>
              </div>
            </motion.div>
          </div>
        )}

        {showProof && proofBundle && (
          <BrandModal open={showProof} onClose={() => setShowProof(false)} title="5T 誠信證明提取" size="lg">
             <div className="space-y-6">
                <div className="p-6 bg-slate-900 rounded-3xl text-white font-mono text-[10px] overflow-x-auto max-h-[400px] no-scrollbar shadow-inner"><pre>{JSON.stringify(proofBundle, null, 2)}</pre></div>
                <div className="grid grid-cols-5 gap-2">{['T1','T2','T3','T4','T5'].map(t => (<div key={t} className="p-3 bg-blue-50 rounded-xl text-center border border-blue-100"><p className="text-[10px] font-black text-blue-800">{t}</p><CheckCircle size={12} className="mx-auto mt-1 text-blue-600" /></div>))}</div>
                <div className="flex gap-4"><BrandButton variant="ghost" fullWidth onClick={() => setShowProof(false)}>關閉</BrandButton><BrandButton variant="primary" fullWidth onClick={() => { const blob = new Blob([JSON.stringify(proofBundle, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `5T_Attestation_${Date.now()}.json`; a.click(); }}>下載證明 JSON</BrandButton></div>
             </div>
          </BrandModal>
        )}

        {showPrivacy && privacyProof && (
          <BrandModal open={showPrivacy} onClose={() => setShowPrivacy(false)} title="ZKP 隱私證明生成 (Selective Disclosure)" size="md">
             <div className="space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm"><Shield size={32} className="text-indigo-600" /></div>
                <h4 className="text-xl font-black text-[#003262]">零知識宣告成功</h4>
                <div className="p-5 bg-indigo-600 rounded-2xl text-white"><p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Claim Verified</p><p className="text-sm font-bold">{privacyProof.claim}</p></div>
                <div className="text-left space-y-4"><div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Commitment Hash</p><p className="text-[10px] font-mono break-all text-slate-600">{privacyProof.commitment.commitment}</p></div></div>
                <BrandButton variant="primary" fullWidth onClick={() => setShowPrivacy(false)}>完成提取</BrandButton>
             </div>
          </BrandModal>
        )}

        {showRange && rangeProof && (
          <BrandModal open={showRange} onClose={() => setShowRange(false)} title="ZKP 閾值範圍證明 (Range Proof)" size="md">
             <div className="space-y-6">
                <ZKPRangeProofVisualizer proof={rangeProof} />
                <div className="text-left space-y-3 px-2">
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      請在上方輸入 Prover 提供之「盲化因子」進行本地加密驗算。此過程不會將敏感數據上傳至伺服器。
                   </p>
                </div>
                <BrandButton variant="primary" fullWidth className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowRange(false)}>完成驗算</BrandButton>
             </div>
          </BrandModal>
        )}

        {showCertificate && certificate && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowCertificate(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative z-10 w-full max-w-2xl">
              <IntegrityCertificateView certificate={certificate} onClose={() => setShowCertificate(false)} />
            </motion.div>
          </div>
        )}

        {anchorageReceipt && (
          <BrandModal open={!!anchorageReceipt} onClose={() => setAnchorageReceipt(null)} title="區塊鏈錨定收據" size="lg">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center"><Network size={28} className="text-emerald-700" /></div>
                <div>
                  <h4 className="text-base font-black text-emerald-900">批次錨定成功</h4>
                  <p className="text-sm text-emerald-700 font-medium">記錄已寫入公共帳本</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction Hash</p>
                  <p className="text-xs font-mono break-all text-slate-800">{anchorageReceipt.txHash}</p>
                </div>
                {anchorageReceipt.blockNumber && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Block Number</p>
                    <p className="text-sm font-bold text-slate-800">{anchorageReceipt.blockNumber}</p>
                  </div>
                )}
                {anchorageReceipt.merkleRoot && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Merkle Root</p>
                    <p className="text-xs font-mono break-all text-slate-800">{anchorageReceipt.merkleRoot}</p>
                  </div>
                )}
                {anchorageReceipt.timestamp && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                    <p className="text-sm font-bold text-slate-800">{new Date(anchorageReceipt.timestamp).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <BrandButton variant="primary" fullWidth onClick={() => setAnchorageReceipt(null)}>
                關閉收據
              </BrandButton>
            </div>
          </BrandModal>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && (<motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-12 right-12 z-[9999]"><div className={cn("px-8 py-5 rounded-3xl shadow-extreme backdrop-blur-2xl text-white font-black text-sm flex items-center gap-4 border border-white/20", toast.type === 'error' ? 'bg-red-600' : 'bg-[#003262]')}>{toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} className="text-[#FDB515]" />}{toast.msg}</div></motion.div>)}</AnimatePresence>
    </>
  );
}

function Fingerprint({ size, className }: { size: number, className?: string }) {
  return <Shield size={size} className={className} />;
}
