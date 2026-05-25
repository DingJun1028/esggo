'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Shield, FileText, CheckCircle, Clock, 
  Eye, Layers, Share2, FileDown, Lock, ShieldCheck,
  ChevronRight, ArrowRight, Database
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  BrandTabs, BrandT5Strip 
} from '../../components/brand';
import { cn } from '../../lib/utils';
import { fadeIn, staggerContainer, slideIn } from '../../lib/animations';

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Background Liquid Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#003262]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#009E9D]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        className="page-container max-w-6xl mx-auto p-6 space-y-6 relative z-10"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.header 
          variants={fadeIn}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-xl shadow-[#003262]/20 border border-white/10">
              <Layers size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#003262] tracking-tight">報告發布中心</h1>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <Shield size={14} className="text-[#009E9D]"/> 數位封印 · ZKP 確信 · 5T 完整性報告輸出
              </p>
            </div>
          </div>
        </motion.header>

        <motion.div variants={fadeIn}>
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
            tabs={[
              { id: 'list', label: '報告列表', icon: <FileText size={14}/> },
              { id: 'chapters', label: '章節進度', icon: <Layers size={14}/> },
              { id: 'preview', label: 'A4 即時預覽', icon: <Eye size={14}/> },
            ]}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'list' && (
                <motion.div 
                  key="list"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  className="space-y-4"
                >
                  {reports.map((r, idx) => (
                    <motion.div key={r.id} variants={slideIn} custom={idx}>
                      <Card hoverEffect className="relative overflow-hidden group border-slate-200/60 bg-white/60 backdrop-blur-md">
                        <AnimatePresence>
                          {sealing === r.id && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 z-20 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center p-8"
                            >
                               <div className="w-full max-w-xs space-y-6 text-center">
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-[#003262] uppercase tracking-[0.3em] animate-pulse">ZKP Zero-Knowledge Proof Generating...</p>
                                    <h4 className="text-sm font-bold text-slate-800">正在建立加密確信封印</h4>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <motion.div 
                                        className="h-full bg-gradient-to-r from-[#009E9D] to-[#00C2A8]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${sealProgress}%` }}
                                     />
                                  </div>
                                  <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">
                                     <span>SHARD_{Math.floor(sealProgress/10)}</span>
                                     <span>{sealProgress}% COMPLETE</span>
                                  </div>
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-1">
                          <div className="space-y-3">
                             <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-[#003262]">{r.title}</h3>
                                <Badge variant={r.status === 'published' ? 'verified' : r.status === 'reviewing' ? 'warning' : 'draft'}>
                                   {r.status.toUpperCase()}
                                </Badge>
                                {r.zkpVerified && (
                                   <div className="flex items-center gap-1.5 text-[#8B5CF6] font-bold text-[10px] bg-[#8B5CF6]/5 px-2.5 py-1 rounded-full border border-[#8B5CF6]/10 shadow-sm">
                                      <ShieldCheck size={12}/> ZKP SEALED
                                   </div>
                                )}
                             </div>
                             <div className="flex gap-2">
                                {r.framework.map(f => (
                                   <Badge key={f} variant="draft" className="text-slate-400 bg-slate-50 border-slate-200 text-[10px]">{f}</Badge>
                                ))}
                             </div>
                             <div className="flex items-center gap-6 pt-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                <span className="flex items-center gap-1.5"><FileText size={14} className="text-slate-300"/> {r.pageCount} Pages</span>
                                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#009E9D]"/> {r.griCoverage}% GRI Coverage</span>
                             </div>
                          </div>

                          <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                             <Button variant="glass" size="sm" onClick={() => setActiveTab('preview')}>
                                <Eye size={14} className="mr-2"/> 預覽
                             </Button>
                             {!r.zkpVerified ? (
                                <Button variant="primary" size="sm" onClick={() => sealReport(r)}>
                                   <Lock size={14} className="mr-2"/> ZKP 封印
                                </Button>
                             ) : (
                                <div className="flex gap-2">
                                   <Button 
                                      variant="glass" 
                                      size="sm" 
                                      onClick={() => {
                                        const url = `${window.location.origin}/audit-verify?hash=${r.hash}`;
                                        navigator.clipboard.writeText(url);
                                        alert('驗證連結已複製！');
                                      }}
                                   >
                                      <Share2 size={14} className="mr-2"/> 連結
                                   </Button>
                                   <Button 
                                      variant="primary" 
                                      size="sm" 
                                      className="bg-[#10B981] hover:bg-[#059669] border-none shadow-lg shadow-emerald-500/20"
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
                                      <FileDown size={14} className="mr-2"/> 匯出 PDF
                                   </Button>
                                </div>
                             )}
                          </div>
                        </div>
                        
                        {r.hash && (
                          <div className="mt-5 pt-4 border-t border-slate-100/60 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Hash</span>
                                <code className="text-[10px] text-[#009E9D] bg-[#009E9D]/5 px-2.5 py-1 rounded-lg font-mono border border-[#009E9D]/10">{r.hash}</code>
                             </div>
                             <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-[#003262] hover:bg-[#003262]/5 uppercase tracking-widest">
                                Verify on Ledger <ArrowRight size={10} className="ml-1"/>
                             </Button>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'preview' && (
                <motion.div 
                  key="preview"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  className="flex flex-col items-center space-y-6"
                >
                   <div className="w-full max-w-[595px] flex justify-end gap-3 bg-white/40 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-sm">
                      <Button variant="glass" size="sm" className="text-xs"><Share2 size={14} className="mr-2"/> 分享預覽</Button>
                      <Button variant="primary" size="sm" className="text-xs"><Download size={14} className="mr-2"/> 下載當前版本</Button>
                   </div>
                   <motion.div 
                    variants={slideIn}
                    className="w-full max-w-[595px] aspect-[1/1.414] bg-white shadow-[0_32px_64px_rgba(0,50,98,0.12)] border border-slate-200 rounded-sm overflow-hidden flex flex-col relative"
                   >
                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg]">
                         <span className="text-9xl font-bold text-[#003262]">PREVIEW</span>
                      </div>

                      {/* Digital A4 Cover */}
                      <div className="bg-[#003262] p-12 text-white h-[42%] flex flex-col justify-between relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Shield size={200} className="text-white"/>
                         </div>
                         <div className="relative z-10">
                            <div className="text-[10px] font-bold tracking-[0.4em] text-[#FDB515] mb-8 uppercase">Berkeley Haas × ESG GO Partner</div>
                            <h2 className="text-5xl font-bold leading-tight tracking-tight">2024 <br/>Sustainability <br/>Report</h2>
                         </div>
                         <div className="flex justify-between items-end relative z-10">
                            <div className="space-y-1.5">
                               <p className="text-sm font-bold text-[#FDB515]">善向永續股份有限公司</p>
                               <p className="text-[10px] opacity-60 font-mono tracking-widest">5T INTEGRITY PROTOCOL v8.5.0</p>
                            </div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20">
                               <Shield size={32} className="text-[#FDB515]" />
                            </div>
                         </div>
                      </div>
                      <div className="flex-1 p-14 space-y-10 bg-white relative z-10">
                         <div className="border-b-2 border-[#FDB515] pb-5">
                            <h3 className="text-2xl font-bold text-[#003262] tracking-tight">Table of Contents 目錄</h3>
                         </div>
                         <div className="space-y-5">
                            {CHAPTERS.map((ch, i) => (
                              <div key={ch.id} className="flex justify-between items-center text-sm group cursor-default">
                                 <div className="flex gap-6 items-center">
                                    <span className="font-mono text-slate-300 text-xs">0{i+1}</span>
                                    <span className="text-slate-600 font-bold group-hover:text-[#003262] transition-colors">{ch.title}</span>
                                 </div>
                                 <div className="flex-1 mx-4 border-b border-dotted border-slate-200 mb-1" />
                                 <span className="font-mono text-[#009E9D] font-bold">{10 + (i * 12)}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                </motion.div>
              )}

              {activeTab === 'chapters' && (
                 <motion.div 
                  key="chapters"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                 >
                   <Card className="border-slate-200/60 bg-white/60 backdrop-blur-md p-8">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h2 className="text-xl font-bold text-[#003262]">報告章節完整度</h2>
                          <p className="text-sm text-slate-500 font-medium">自動檢核 GRI 與 SASB 指標覆蓋狀況</p>
                        </div>
                        <Badge variant="verified">100% SECURE</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         {CHAPTERS.map((ch, idx) => (
                           <motion.div 
                            key={ch.id} 
                            variants={slideIn}
                            custom={idx}
                            className={cn(
                              "p-5 rounded-2xl border transition-all duration-300",
                              ch.ready 
                                ? "bg-emerald-50/40 border-emerald-100/60 shadow-sm" 
                                : "bg-slate-50/60 border-slate-200/60"
                            )}
                           >
                              <div className="flex justify-between items-center mb-4">
                                 <div className="flex items-center gap-3">
                                   <div className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center",
                                      ch.ready ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-200/50 text-slate-400"
                                   )}>
                                      {ch.ready ? <CheckCircle size={18}/> : <Clock size={18}/>}
                                   </div>
                                   <span className="text-sm font-bold text-slate-700">{ch.title}</span>
                                 </div>
                                 <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                  ch.ready ? "text-emerald-600 bg-emerald-100/50" : "text-amber-600 bg-amber-100/50"
                                 )}>
                                  {ch.ready ? 'READY' : 'PENDING'}
                                 </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden mb-3 shadow-inner">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: ch.ready ? '100%' : '45%' }}
                                    className={cn(
                                      "h-full transition-all duration-700",
                                      ch.ready ? "bg-emerald-500" : "bg-amber-400"
                                    )} 
                                  />
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <Database size={10} className="text-slate-300"/> {ch.items} EVIDENCE ITEMS LINKED
                              </p>
                           </motion.div>
                         ))}
                      </div>
                   </Card>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Controls */}
          <motion.div variants={slideIn} className="lg:col-span-4 space-y-6">
             <Card className="bg-[#003262]/5 border-[#003262]/10 backdrop-blur-xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield size={80} />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 border-b border-[#003262]/10 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#003262] text-white flex items-center justify-center">
                      <Lock size={16}/>
                    </div>
                    <h3 className="text-lg font-bold text-[#003262]">發布配置</h3>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">5T 確信協議版本</p>
                        <BrandT5Strip compact />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-500 font-medium">確信等級</span>
                           <span className="font-bold text-[#003262] bg-[#003262]/5 px-2 py-0.5 rounded">ISAE 3000 Limited</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-500 font-medium">報告語言</span>
                           <span className="font-bold text-[#003262] bg-[#003262]/5 px-2 py-0.5 rounded">繁體中文 (ZH-TW)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-500 font-medium">數據主權</span>
                           <span className="font-bold text-[#009E9D] bg-[#009E9D]/5 px-2 py-0.5 rounded">On-Chain Vault</span>
                        </div>
                     </div>
                     <Button variant="glass" size="sm" className="w-full bg-white/40 border-white/60">
                        <Share2 size={14} className="mr-2"/> 配置 Webhook 推送
                     </Button>
                  </div>
                </div>
             </Card>

             <Card className="p-8 space-y-6 border-slate-200/60 bg-white/60 backdrop-blur-md">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">法規遵循掃描 Compliance</h4>
                <div className="space-y-4">
                   <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/60 transition-colors hover:bg-emerald-50"
                   >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900">金管會 2024 新制</p>
                        <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">檢核通過 SECURED</p>
                      </div>
                   </motion.div>

                   <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-100/60 transition-colors hover:bg-amber-50"
                   >
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-900">GRI 305-1 揭露</p>
                        <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">數據待更新 PENDING</p>
                      </div>
                   </motion.div>
                </div>
             </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
