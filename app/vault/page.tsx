'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, Shield, Eye, X, CheckCircle, Clock, AlertTriangle, Zap, Bot, RefreshCw, Database, Search, Filter, Share2, History, ChevronDown, FileText
} from 'lucide-react';
import { getEvidenceFiles, insertEvidence, sealEvidence, EvidenceFile } from '../../lib/db';
import { scanEvidenceWithVision } from '../../lib/hermes-gateway';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandModal, BrandInput, BrandStatusDot, BrandT5Strip, BrandPageHeader, BrandTooltip, StandardPage
} from '../../components/brand';
import SelectionHouse, { SelectionCategory } from '../../components/ui/SelectionHouse';
import { UniversalPageConfig } from '../../lib/page-config';

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

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const d = await getEvidenceFiles();
    setFiles(d);
    setLoading(false);
  };

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
      setScanResult({ extraction: res.extraction, confidence: res.confidence, gap: res.gapAnalysis });
    } catch {
      alert('AI 掃描失敗');
    } finally {
      setScanningId(null);
    }
  };

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
    title: '證據金庫 Evidence Vault',
    subtitle: '5T 誠信協議 · ZKP 零知識證明 · SHA-256 數位鎖定，確保治理數據真實性。',
    icon: <Database size={32} />,
    griReference: 'Governance Vault',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'upload', label: '上傳佐證', icon: <Upload size={16}/>, onClick: () => setShowUpload(true) }
    ],
    kpis: [
      { key: 'total', label: '總文件數', value: files.length, icon: <FileText size={18}/> },
      { key: 'sealed', label: '已實證封印', value: verifiedCount, icon: <Shield size={18}/>, verified: true },
      { key: 'pending', label: '待處理項', value: files.filter(f => f.status === 'pending').length, icon: <Clock size={18}/> },
      { key: 'coverage', label: '5T 覆蓋率', value: `${Math.round((verifiedCount / (files.length || 1)) * 100)}%`, icon: <Zap size={18}/> },
    ],
    sections: [
      {
        id: 'browser',
        title: '文件清單',
        columns: 12,
        component: (
          <div className="space-y-6">
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeCategory === c ? 'bg-[#003262] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {c === '全部' ? '全部' : `${c} · ${CAT_LABELS[c]}`}
                  </button>
                ))}
             </div>
             <BrandTable 
               loading={loading}
               columns={[{ label: '文件', key: 'file' }, { label: '類別', key: 'cat' }, { label: 'GRI', key: 'gri' }, { label: '5T', key: 'zkp' }, { label: '操作', key: 'actions' }]}
               data={filtered.map(f => ({
                 file: <span className="font-bold">{f.file_name}</span>,
                 cat: <BrandBadge variant="outline" size="xs">{f.category}</BrandBadge>,
                 gri: <BrandBadge variant="info" size="xs">{f.gri_reference || '-'}</BrandBadge>,
                 zkp: f.zkp_proof ? <BrandBadge variant="gold" size="xs">SEALED</BrandBadge> : '—',
                 actions: (
                   <div className="flex gap-1">
                      <BrandButton variant="ghost" size="xs" onClick={() => setSelected(f)}><Eye size={12}/></BrandButton>
                      <BrandButton variant="ghost" size="xs" onClick={() => handleScan(f)} loading={scanningId === f.id}><Bot size={12}/></BrandButton>
                      {f.status !== 'verified' && <BrandButton variant="primary" size="xs" onClick={() => sealFile(f)} loading={sealing === f.id}><Shield size={10}/></BrandButton>}
                   </div>
                 )
               }))}
             />
          </div>
        )
      }
    ],
    features: { useSelectionHouse: true, useProvenance: true, useAuditLog: true }
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />
      <SelectionHouse isOpen={selectionHouse.open && selectionHouse.type === 'category'} onClose={() => setSelectionHouse({ open: false, type: null })} onSelect={(item) => setForm(p => ({ ...p, category: item.tag! }))} categories={catCategories} title="選擇類別" />
      <SelectionHouse isOpen={selectionHouse.open && selectionHouse.type === 'gri'} onClose={() => setSelectionHouse({ open: false, type: null })} onSelect={(item) => setForm(p => ({ ...p, gri_reference: item.tag! }))} categories={griCategories} title="選擇指標" />
      
      {showUpload && (
        <BrandModal open={showUpload} onClose={() => setShowUpload(false)} title="上傳佐證文件" icon={<Upload size={20}/>}>
          <div className="space-y-4">
             <BrandInput label="文件名稱" value={form.file_name} onChange={e => setForm(p => ({ ...p, file_name: e.target.value }))} />
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSelectionHouse({ open: true, type: 'category' })} className="w-full p-3 bg-slate-50 border rounded-xl text-sm">{form.category}</button>
                <button onClick={() => setSelectionHouse({ open: true, type: 'gri' })} className="w-full p-3 bg-slate-50 border rounded-xl text-sm">{form.gri_reference || '選擇指標'}</button>
             </div>
             <BrandButton variant="primary" fullWidth onClick={upload}>確認上傳</BrandButton>
          </div>
        </BrandModal>
      )}
    </div>
  );
}
