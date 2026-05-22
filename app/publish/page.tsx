'use client';

import { useState } from 'react';
import { 
  Download, Shield, FileText, CheckCircle, Clock, 
  Eye, Layers, Share2, FileDown, Lock, ShieldCheck
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandTabs, BrandBadge, BrandCardHeader, 
  BrandStatusDot, BrandT5Strip 
} from '../../components/brand';

interface Report {
  id: string;
  title: string;
  year: number;
  status: 'draft' | 'reviewing' | 'published';
  framework: string[];
  pageCount: number;
  griCoverage: number;
  zkpVerified: boolean;
  hash?: string;
}

const mockReports: Report[] = [
  { id: '1', title: '2024 永續報告書 (Q2 草案)', year: 2024, status: 'draft', framework: ['GRI 2021', 'TCFD'], pageCount: 156, griCoverage: 78, zkpVerified: false },
  { id: '2', title: '2023 永續報告書 (正式版)', year: 2023, status: 'published', framework: ['GRI 2021', 'TCFD', 'SASB'], pageCount: 143, griCoverage: 100, zkpVerified: true, hash: '0x3a4b...e92d' },
];

const CHAPTERS = [
  { id: '1', title: '一、組織概況與治理', ready: true, items: 12 },
  { id: '2', title: '二、利害關係人溝通', ready: true, items: 8 },
  { id: '3', title: '三、重大性議題分析', ready: true, items: 15 },
  { id: '4', title: '四、環境績效盤查', ready: false, items: 24 },
  { id: '5', title: '五、社會共融與勞工', ready: false, items: 18 },
  { id: '6', title: '六、公司治理與誠信', ready: true, items: 10 },
];

export default function PublishPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'preview' | 'chapters'>('list');
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [sealing, setSealing] = useState<string | null>(null);
  const [sealProgress, setSealProgress] = useState(0);

  const sealReport = async (r: Report) => {
    setSealing(r.id);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(res => setTimeout(res, 80));
      setSealProgress(i);
    }
    setReports(prev => prev.map(rep => rep.id === r.id ? { ...rep, zkpVerified: true, status: 'reviewing', hash: 'SHA256:' + Math.random().toString(36).substring(7).toUpperCase() } : rep));
    setSealing(null);
    setSealProgress(0);
  };

  return (
    <div className="page-container max-w-6xl mx-auto p-6 space-y-6 fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-lg shadow-[#003262]/20">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#003262]">報告發布中心</h1>
            <p className="text-slate-500 text-sm font-medium">數位封印 · ZKP 確信 · 5T 完整性報告輸出</p>
          </div>
        </div>
      </header>

      <BrandTabs 
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as any)}
        tabs={[
          { id: 'list', label: '報告列表', icon: <FileText size={14}/> },
          { id: 'chapters', label: '章節進度', icon: <Layers size={14}/> },
          { id: 'preview', label: 'A4 即時預覽', icon: <Eye size={14}/> },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'list' && (
            <div className="space-y-4">
              {reports.map(r => (
                <BrandCard key={r.id} padding="lg" hover className="relative overflow-hidden group">
                  {sealing === r.id && (
                    <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 transition-all">
                       <div className="w-full max-w-xs space-y-4 text-center">
                          <p className="text-[10px] font-bold text-[#003262] uppercase tracking-[0.2em] animate-pulse">ZKP Zero-Knowledge Proof Generating...</p>
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-[#009E9D] to-[#00C2A8] transition-all duration-300" style={{ width: `${sealProgress}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                             <span>SHARD_{Math.floor(sealProgress/10)}</span>
                             <span>{sealProgress}%</span>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-800">{r.title}</h3>
                          <BrandBadge variant={r.status === 'published' ? 'success' : r.status === 'reviewing' ? 'warning' : 'default'} size="xs">
                             {r.status.toUpperCase()}
                          </BrandBadge>
                          {r.zkpVerified && (
                             <div className="flex items-center gap-1 text-[#8B5CF6] font-bold text-[10px] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                                <ShieldCheck size={10}/> ZKP SEALED
                             </div>
                          )}
                       </div>
                       <div className="flex gap-2">
                          {r.framework.map(f => (
                             <BrandBadge key={f} variant="outline" size="xs" className="text-slate-400 border-slate-200">{f}</BrandBadge>
                          ))}
                       </div>
                       <div className="flex items-center gap-4 pt-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><FileText size={12}/> {r.pageCount} Pages</span>
                          <span className="flex items-center gap-1"><CheckCircle size={12}/> {r.griCoverage}% GRI Coverage</span>
                       </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <BrandButton variant="ghost" size="sm" onClick={() => setActiveTab('preview')}>
                          <Eye size={14} className="mr-1.5"/> 預覽
                       </BrandButton>
                       {!r.zkpVerified ? (
                          <BrandButton variant="primary" size="sm" onClick={() => sealReport(r)}>
                             <Lock size={14} className="mr-1.5"/> ZKP 封印
                          </BrandButton>
                       ) : (
                          <div className="flex gap-2">
                             <BrandButton 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  const url = `${window.location.origin}/audit-verify?hash=${r.hash}`;
                                  navigator.clipboard.writeText(url);
                                  alert('驗證連結已複製！');
                                }}
                             >
                                <Share2 size={14} className="mr-1.5"/> 連結
                             </BrandButton>
                             <BrandButton 
                                variant="primary" 
                                size="sm" 
                                className="bg-[#10B981] border-none shadow-lg shadow-emerald-500/20"
                                onClick={() => {
                                  const content = `ESG GO 5T INTEGRITY REPORT\n\nTitle: ${r.title}\nYear: ${r.year}\nMaster Hash: ${r.hash}\nStatus: PUBLISHED\n\nVerified by ZKP Proof Engine.`;
                                  const blob = new Blob([content], { type: 'text/plain' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${r.title.replace(/\s/g, '_')}_5T_Report.txt`;
                                  a.click();
                                }}
                             >
                                <FileDown size={14} className="mr-1.5"/> 匯出 PDF
                             </BrandButton>
                          </div>
                       )}
                    </div>
                  </div>
                  
                  {r.hash && (
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Hash</span>
                          <code className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-mono">{r.hash}</code>
                       </div>
                       <BrandButton variant="ghost" size="sm" className="h-6 text-[10px] text-blue-600">Verify on Ledger</BrandButton>
                    </div>
                  )}
                </BrandCard>
              ))}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="flex flex-col items-center space-y-6">
               <div className="w-full max-w-[595px] flex justify-end gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 backdrop-blur-md">
                  <BrandButton variant="ghost" size="sm" className="text-xs h-8"><Share2 size={14} className="mr-1.5"/> 分享</BrandButton>
                  <BrandButton variant="primary" size="sm" className="text-xs h-8"><Download size={14} className="mr-1.5"/> 下載當前預覽</BrandButton>
               </div>
               <div className="w-full max-w-[595px] aspect-[1/1.414] bg-white shadow-[0_24px_48px_rgba(0,0,0,0.06)] border border-slate-100 rounded-sm overflow-hidden flex flex-col">
                  {/* Digital A4 Cover */}
                  <div className="bg-[#003262] p-12 text-white h-[40%] flex flex-col justify-between">
                     <div>
                        <div className="text-[10px] font-bold tracking-[0.3em] opacity-40 mb-8">BERKELEY HAAS × TSISDA ACADEMIC PARTNER</div>
                        <h2 className="text-4xl font-bold leading-tight">2024 <br/>Sustainability <br/>Report</h2>
                     </div>
                     <div className="flex justify-between items-end">
                        <div className="space-y-1">
                           <p className="text-xs font-bold text-[#FDB515]">善向永續股份有限公司</p>
                           <p className="text-[10px] opacity-40">5T INTEGRITY PROTOCOL v8.5</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center backdrop-blur-lg">
                           <Shield size={24} className="text-[#FDB515] opacity-80" />
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 p-12 space-y-8">
                     <div className="border-b-2 border-[#FDB515] pb-4">
                        <h3 className="text-xl font-bold text-[#003262]">Table of Contents 目錄</h3>
                     </div>
                     <div className="space-y-4">
                        {CHAPTERS.map((ch, i) => (
                          <div key={ch.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                             <div className="flex gap-4">
                                <span className="font-mono text-slate-300">0{i+1}</span>
                                <span className="text-slate-600 font-medium">{ch.title}</span>
                             </div>
                             <span className="font-mono text-slate-400">{10 + (i * 12)}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'chapters' && (
             <BrandCard padding="lg">
                <BrandCardHeader title="報告章節完整度" subtitle="自動檢核 GRI 與 SASB 指標覆蓋狀況" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                   {CHAPTERS.map(ch => (
                     <div key={ch.id} className={`p-4 rounded-lg border transition-all ${ch.ready ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-sm font-bold text-slate-700">{ch.title}</span>
                           <BrandStatusDot status={ch.ready ? 'active' : 'inactive'} size="sm" label={ch.ready ? 'READY' : 'PENDING'} />
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                           <div className={`h-full transition-all duration-500 ${ch.ready ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: ch.ready ? '100%' : '45%' }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{ch.items} EVIDENCE ITEMS LINKED</p>
                     </div>
                   ))}
                </div>
             </BrandCard>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
           <BrandCard padding="lg" className="bg-[#003262]/5 border-[#003262]/10 backdrop-blur-xl">
              <BrandCardHeader title="發布配置" icon={<Lock size={16}/>} />
              <div className="space-y-6 mt-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">5T 確信協議版本</p>
                    <BrandT5Strip compact />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-500">確信等級</span>
                       <span className="font-bold text-slate-700">ISAE 3000 Limited</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-500">報告語言</span>
                       <span className="font-bold text-slate-700">繁體中文 (ZH-TW)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-500">數據主權</span>
                       <span className="font-bold text-blue-600">On-Chain Vault</span>
                    </div>
                 </div>
                 <BrandButton variant="outline" fullWidth size="sm">
                    <Share2 size={14} className="mr-2"/> 配置 Webhook 推送
                 </BrandButton>
              </div>
           </BrandCard>

           <BrandCard padding="lg">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">法規遵循掃描</h4>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-700">金管會 2024 新制檢核通過</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-xs font-bold text-amber-700">GRI 305-1 數據待更新</span>
                 </div>
              </div>
           </BrandCard>
        </div>

      </div>
    </div>
  );
}
