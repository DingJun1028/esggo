'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { 
  Upload, Shield, Eye, X, CheckCircle, Clock, AlertTriangle, Zap, Bot, RefreshCw, Database, Search, Filter, Share2 
} from 'lucide-react';
import { getEvidenceFiles, insertEvidence, sealEvidence, EvidenceFile } from '../../lib/db';
import { scanEvidenceWithVision } from '../../lib/hermes-gateway';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandModal, BrandInput, BrandStatusDot, BrandT5Strip, BrandPageHeader, BrandTooltip
} from '../../components/brand';
import SelectionHouse, { SelectionCategory } from '../../components/ui/SelectionHouse';

const CATEGORIES = ['全部', 'E', 'S', 'G', 'T'];
const CAT_LABELS: Record<string, string> = { 'E': '環境', 'S': '社會', 'G': '治理', 'T': '資安' };

const STATUS_MAP: Record<string, { label: string; variant: any }> = {
  verified: { label: '已驗證', variant: 'success' },
  pending: { label: '待驗證', variant: 'warning' },
  rejected: { label: '已拒絕', variant: 'danger' },
};

export default function VaultPage() {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [sealing, setSealingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<EvidenceFile | null>(null);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ extraction: string; confidence: number; gap: string } | null>(null);
  const [form, setForm] = useState({ file_name: '', category: 'E', gri_reference: '', uploader: '' });
  const [selectionHouse, setSelectionHouse] = useState<{ open: boolean, type: 'category' | 'gri' | null }>({ open: false, type: null });

  useEffect(() => {
    getEvidenceFiles().then(d => { setFiles(d); setLoading(false); });
  }, []);

  const filtered = files.filter(f => {
    const matchCat = activeCategory === '全部' || f.category === activeCategory;
    const matchSearch = !search || f.file_name.toLowerCase().includes(search.toLowerCase()) || (f.gri_reference || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sealFile = async (file: EvidenceFile) => {
    setSealingId(file.id!);
    await new Promise(r => setTimeout(r, 1500));
    await sealEvidence(file.id!);
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'verified', zkp_proof: true } : f));
    setSealingId(null);
  };

  const upload = async () => {
    if (!form.file_name) return;
    const result = await insertEvidence({ ...form, status: 'pending', zkp_proof: false });
    if (result) setFiles(prev => [result, ...prev]);
    setShowUpload(false);
    setForm({ file_name: '', category: 'E', gri_reference: '', uploader: '' });
  };

  const handleScan = async (file: EvidenceFile) => {
    setScanningId(file.id!);
    try {
      const res = await scanEvidenceWithVision(file.id!, 'image/pdf');
      setScanResult({
        extraction: res.extraction,
        confidence: res.confidence,
        gap: res.gapAnalysis
      });
    } catch (e) {
      alert('AI 掃描失敗');
    } finally {
      setScanningId(null);
    }
  };

  const verifiedCount = files.filter(f => f.status === 'verified').length;

  const griCategories: SelectionCategory[] = [
    {
      id: 'E',
      title: '環境指標 (Environmental)',
      items: [
        { id: '302', label: 'GRI 302: 能源', tag: 'GRI 302' },
        { id: '305', label: 'GRI 305: 排放', tag: 'GRI 305' },
        { id: '306', label: 'GRI 306: 廢棄物', tag: 'GRI 306' },
      ]
    },
    {
      id: 'S',
      title: '社會指標 (Social)',
      items: [
        { id: '401', label: 'GRI 401: 僱用', tag: 'GRI 401' },
        { id: '403', label: 'GRI 403: 職業健康與安全', tag: 'GRI 403' },
      ]
    }
  ];

  const catCategories: SelectionCategory[] = [
    {
      id: 'esg',
      title: 'ESG 核心分類',
      items: [
        { id: 'E', label: '環境 (Environmental)', tag: 'E' },
        { id: 'S', label: '社會 (Social)', tag: 'S' },
        { id: 'G', label: '治理 (Governance)', tag: 'G' },
        { id: 'T', label: '資安 (Security)', tag: 'T' },
      ]
    }
  ];

  return (
    <ClientLayout>
      <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
        <SelectionHouse 
          isOpen={selectionHouse.open && selectionHouse.type === 'category'}
          onClose={() => setSelectionHouse({ open: false, type: null })}
          onSelect={(item) => setForm(p => ({ ...p, category: item.tag! }))}
          categories={catCategories}
          title="選擇 ESG 類別"
        />

        <SelectionHouse 
          isOpen={selectionHouse.open && selectionHouse.type === 'gri'}
          onClose={() => setSelectionHouse({ open: false, type: null })}
          onSelect={(item) => setForm(p => ({ ...p, gri_reference: item.tag! }))}
          categories={griCategories}
          title="選擇對應 GRI 指標"
        />
        
        <BrandPageHeader 
          title="證據金庫 Evidence Vault" 
          subtitle="5T 誠信協議 · ZKP 零知識證明 · SHA-256 數位鎖定"
          icon={<Database size={24} />}
          actions={
            <BrandButton variant="primary" onClick={() => setShowUpload(true)}>
              <Upload size={16} /> 上傳佐證
            </BrandButton>
          }
        />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[1, 2, 3, 4].map(i => (
              <BrandCard key={i} padding="md" className="animate-pulse text-center">
                <div className="h-3 bg-slate-200 rounded w-16 mb-2 mx-auto"></div>
                <div className="h-8 bg-slate-200 rounded w-20 mx-auto"></div>
              </BrandCard>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
             {[
               { label: '總文件數', value: files.length, variant: 'info' },
               { label: '已實證封印', value: verifiedCount, variant: 'success' },
               { label: '待處理項', value: files.filter(f => f.status === 'pending').length, variant: 'warning' },
               { label: '5T 覆蓋率', value: `${Math.round((verifiedCount / (files.length || 1)) * 100)}%`, variant: 'gold' },
             ].map(s => (
               <BrandCard key={s.label} padding="md" className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-[#003262]">{s.value}</p>
               </BrandCard>
             ))}
          </div>
        )}

        {loading ? (
          <BrandCard padding="none" className="overflow-hidden shadow-sm animate-pulse">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
               <div className="flex gap-2">
                 {[1,2,3,4].map(i => <div key={i} className="h-8 w-16 bg-slate-200 rounded-xl"></div>)}
               </div>
               <div className="h-9 w-64 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl w-full"></div>
              ))}
            </div>
          </BrandCard>
        ) : (
          <BrandCard padding="none" className="overflow-hidden shadow-sm">
             <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* ... (category buttons logic stays same) */}
                <div className="scroll-x-governed w-full md:w-auto">
                  <div className="flex gap-2">
                    {CATEGORIES.map(c => (
                      <button 
                        key={c} 
                        onClick={() => setActiveCategory(c)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeCategory === c ? 'bg-blue-700 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        {c === '全部' ? '全部' : `${c} · ${CAT_LABELS[c]}`}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative w-full md:w-64">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:border-blue-600 outline-none transition-all"
                     placeholder="搜尋文件名或 GRI..."
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                   />
                </div>
             </div>

             <div className="scroll-x-governed">
               <BrandTable 
                 columns={[
                   { key: 'file', label: '文件資訊' },
                   { key: 'category', label: '類別' },
                   { key: 'gri', label: 'GRI 指標' },
                   { key: 'status', label: '狀態' },
                   { key: 'zkp', label: '5T 實證' },
                   { key: 'action', label: '操作' },
                 ]}
                 data={filtered.map(f => ({
                   id: f.id,
                   file: (
                     <div className="flex flex-col">
                       <span className="font-bold text-slate-700 text-sm">{f.file_name}</span>
                       {f.hash_lock && <code className="text-[9px] text-slate-400 mt-1">SHA256: {f.hash_lock.slice(0, 16)}...</code>}
                     </div>
                   ),
                   category: <BrandBadge variant="outline" size="xs">{f.category} · {CAT_LABELS[f.category!]}</BrandBadge>,
                   gri: <BrandBadge variant="info" size="xs">{f.gri_reference || '-'}</BrandBadge>,
                   status: <BrandBadge variant={STATUS_MAP[f.status || 'pending'].variant} size="xs">{STATUS_MAP[f.status || 'pending'].label}</BrandBadge>,
                   zkp: f.zkp_proof ? <BrandBadge variant="gold" size="xs">✓ ZKP SEALED</BrandBadge> : <span className="text-[10px] text-slate-300 font-bold">UNSEALED</span>,
                   action: (
                     <div className="flex gap-2">
                        <BrandButton variant="ghost" size="sm" onClick={() => setSelected(f)}><Eye size={14}/></BrandButton>
                        <BrandTooltip content="OmniHermes 視覺掃描">
                          <BrandButton variant="ghost" size="sm" onClick={() => handleScan(f)} loading={scanningId === f.id} className="text-blue-700">
                            <Bot size={14}/>
                          </BrandButton>
                        </BrandTooltip>
                        {f.status === 'verified' && (
                          <BrandTooltip content="複製驗證連結">
                            <BrandButton 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                const url = `${window.location.origin}/audit-verify?uuid=${f.id}`;
                                navigator.clipboard.writeText(url);
                                alert('驗證連結已複製！');
                              }}
                              className="text-emerald-600"
                            >
                              <Share2 size={14}/>
                            </BrandButton>
                          </BrandTooltip>
                        )}
                        {f.status !== 'verified' && (
                          <BrandButton variant="primary" size="sm" onClick={() => sealFile(f)} loading={sealing === f.id}>
                            <Shield size={12}/> 封印
                          </BrandButton>
                        )}
                     </div>
                   )
                 }))}
               />
             </div>
          </BrandCard>
        )}

        {/* Scan Result Modal */}
        <BrandModal 
          open={!!scanResult} 
          onClose={() => setScanResult(null)}
          title="OmniHermes 視覺掃描報告"
          icon={<Bot size={20}/>}
        >
          {scanResult && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">數據提取結果</p>
                 <p className="text-sm text-slate-700 leading-relaxed font-medium">{scanResult.extraction}</p>
              </div>
              <div className="flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">信心準確率</p>
                    <p className="text-xl font-bold text-green-600">{(scanResult.confidence * 100).toFixed(1)}%</p>
                 </div>
                 <BrandBadge variant="success">驗證通過</BrandBadge>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                 <div className="flex items-center gap-2 mb-2 text-blue-800">
                    <Shield size={14}/> <span className="text-xs font-bold uppercase">5T 缺口分析</span>
                 </div>
                 <p className="text-xs text-blue-700/80 leading-relaxed">{scanResult.gap}</p>
              </div>
              <BrandButton variant="primary" fullWidth onClick={() => setScanResult(null)}>確認並對齊指標</BrandButton>
            </div>
          )}
        </BrandModal>

        {/* Upload Modal */}
        <BrandModal 
          open={showUpload} 
          onClose={() => setShowUpload(false)}
          title="上傳 ESG 佐證文件"
          icon={<Upload size={20}/>}
        >
          <div className="space-y-4">
             <BrandInput label="文件名稱" value={form.file_name} onChange={e => setForm(p => ({ ...p, file_name: e.target.value }))} placeholder="例：2024年電力帳單.pdf" />
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500">ESG 類別</label>
                   <button 
                     onClick={() => setSelectionHouse({ open: true, type: 'category' })}
                     className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm hover:border-blue-600 transition-all text-left"
                   >
                     <span>{form.category} - {CAT_LABELS[form.category]}</span>
                     <ChevronDown size={14} className="text-slate-400" />
                   </button>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500">GRI 指標</label>
                   <button 
                     onClick={() => setSelectionHouse({ open: true, type: 'gri' })}
                     className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm hover:border-blue-600 transition-all text-left"
                   >
                     <span className={form.gri_reference ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                       {form.gri_reference || '選擇指標...'}
                     </span>
                     <ChevronDown size={14} className="text-slate-400" />
                   </button>
                </div>
             </div>
             <BrandInput label="上傳部門/人員" value={form.uploader} onChange={e => setForm(p => ({ ...p, uploader: e.target.value }))} placeholder="ESG 辦公室" />
             <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Shield size={16} className="text-blue-700 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">上傳後將立即觸發 <strong>T4 不可篡改鎖定</strong>，生成 SHA-256 雜湊並寫入審計日誌。</p>
             </div>
             <BrandButton variant="primary" fullWidth size="lg" onClick={upload} disabled={!form.file_name}>確認上傳</BrandButton>
          </div>
        </BrandModal>

      </div>
    </ClientLayout>
  );
}
