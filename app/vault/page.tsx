'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, Shield, Eye, X, CheckCircle, Clock, AlertTriangle, Zap, Bot, RefreshCw, Database, Search, Filter, Share2, History, ChevronDown, FileText, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { getEvidenceFiles, insertEvidence, sealEvidence, type EvidenceFile } from '../../lib/db';
import { scanEvidenceWithVision } from '../../lib/hermes-gateway';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandModal, BrandInput, BrandStatusDot, BrandT5Strip, BrandPageHeader, BrandTooltip, StandardPage, BrandCardHeader
} from '../../components/brand';
import SelectionHouse, { SelectionCategory } from '../../components/ui/SelectionHouse';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['全部', 'E', 'S', 'G', 'T'];
const CAT_LABELS: Record<string, string> = { 'E': '環境', 'S': '社會', 'G': '治理', 'T': '資安' };

export default function VaultPage() {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<EvidenceFile | null>(null);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [form, setForm] = useState({ file_name: '', category: 'E', gri_reference: '', uploader: '' });
  const [selectionHouse, setSelectionHouse] = useState<{ open: boolean, type: 'category' | 'gri' | null }>({ open: false, type: null });

  const load = async () => {
    setLoading(true);
    try { const d = await getEvidenceFiles(); setFiles(d); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const sealFile = async (file: EvidenceFile) => {
    setSealingId(file.id!);
    await new Promise(r => setTimeout(r, 1500));
    await sealEvidence(file.id!);
    await load();
    setSealingId(null);
  };

  const handleScan = async (file: EvidenceFile) => {
    setScanningId(file.id!);
    try {
      await scanEvidenceWithVision(file.id!, 'image/pdf');
      alert('AI 掃描完成，已提取關鍵指標。');
    } catch {
      alert('AI 掃描失敗');
    } finally {
      setScanningId(null);
    }
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
    subtitle: '5T 誠信協議 · ZKP 零知識證明 · SHA-256 數位鎖定：建立企業永續治理的「誠信主權」。',
    icon: <Database size={32} />,
    griReference: 'Governance Vault',
    activeT5Tags: ['T1', 'T2', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
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
                   <input 
                    placeholder="搜尋檔名、GRI 指標..."
                    className="w-full h-12 bg-white rounded-2xl border border-slate-100 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                   />
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
                <BrandTable 
                  loading={loading}
                  columns={[
                    { label: '檔案名稱', key: 'name' },
                    { label: '類別', key: 'cat' },
                    { label: 'GRI', key: 'gri' },
                    { label: '5T 封印', key: 'zkp' },
                    { label: '操作', key: 'actions' }
                  ]}
                  data={filtered.map(f => ({
                    name: (
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#003262] shadow-sm"><FileText size={16} /></div>
                         <span className="font-bold text-[#003262]">{f.file_name}</span>
                      </div>
                    ),
                    cat: <BrandBadge variant="outline" size="xs" className="opacity-60">{CAT_LABELS[f.category || 'E']}</BrandBadge>,
                    gri: <BrandBadge variant="info" size="xs" className="font-mono">{f.gri_reference || '-'}</BrandBadge>,
                    zkp: f.zkp_proof ? <BrandBadge variant="gold" size="xs" className="font-black">T5_SEALED</BrandBadge> : <span className="text-[10px] font-black text-slate-300">UNSEALED</span>,
                    actions: (
                      <div className="flex gap-2">
                         <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => setSelected(f)}><Eye size={14}/></BrandButton>
                         <BrandButton variant="ghost" size="xs" className="w-8 h-8 p-0" onClick={() => handleScan(f)} loading={scanningId === f.id}><Bot size={14}/></BrandButton>
                         {f.status !== 'verified' && (
                           <BrandButton variant="primary" size="xs" className="h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest" onClick={() => sealFile(f)} loading={sealingId === f.id}>
                              Seal_5T
                           </BrandButton>
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
              <div className="w-24 h-24 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-8 text-slate-300 group hover:border-[#003262] hover:text-[#003262] transition-all cursor-pointer">
                 <Upload size={40} className="group-hover:-translate-y-2 transition-transform duration-500" />
              </div>
              <h3 className="text-2xl font-black text-[#003262] uppercase tracking-tight mb-3">上傳治理憑證</h3>
              <div className="space-y-6 mb-10 text-left">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Name</label>
                    <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all" value={form.file_name} onChange={e => setForm({...form, file_name: e.target.value})} placeholder="例如：2024Q3電力單據.pdf" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setSelectionHouse({ open: true, type: 'category' })} className="h-14 bg-white border border-slate-100 rounded-2xl px-6 flex items-center justify-between text-sm font-bold text-slate-700">{form.category} <ChevronDown size={14} /></button>
                    <button onClick={() => setSelectionHouse({ open: true, type: 'gri' })} className="h-14 bg-white border border-slate-100 rounded-2xl px-6 flex items-center justify-between text-sm font-bold text-slate-700">{form.gri_reference || '選擇指標'} <ChevronDown size={14} /></button>
                 </div>
              </div>
              <div className="flex gap-4">
                 <BrandButton variant="ghost" className="flex-1 rounded-2xl h-14" onClick={() => setShowUpload(false)}>取消</BrandButton>
                 <BrandButton variant="primary" className="flex-[2] rounded-2xl h-14 font-black shadow-xl" onClick={async () => { await insertEvidence({...form, status: 'pending', zkp_proof: false}); setShowUpload(false); load(); }}>確認上傳</BrandButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
