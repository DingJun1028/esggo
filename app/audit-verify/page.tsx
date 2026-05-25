'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Search, Fingerprint, Lock, 
  CheckCircle2, AlertCircle, Hash, ArrowRight,
  Zap, Database, Server, RefreshCw, FileCheck,
  UserCheck, MessageSquare, ClipboardCheck, Eye, Brain,
  ExternalLink, Download, Clock, Activity
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { StandardPage } from '../../components/brand';
import { BrandTabs } from '../../components/brand';
import { cn } from '../../lib/utils';
import { fadeIn, staggerContainer, slideIn } from '../../lib/animations';

export default function AuditVerifyPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [activeView, setActiveView] = useState<'overview' | 'ocr' | 'lineage'>('overview');

  const handleVerify = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setVerificationStatus('VERIFYING');
    await new Promise(r => setTimeout(r, 1800));
    setVerificationStatus('SUCCESS');
    setIsSearching(false);
  };

  return (
    <StandardPage
      config={{
        id: 'audit-verify',
        title: '遠距稽核與數據治理中心 (Remote Audit Portal)',
        subtitle: 'RBA v8.0 第三方查驗環境 · AI+OCR 佐證資料審核 · 不可篡改稽核留痕。',
        icon: <ClipboardCheck size={24} />,
        griReference: 'RBA Compliance',
        activeT5Tags: ['T1', 'T4', 'T5'],
        primaryActions: [
          { id: 'stamp', label: '簽署查驗章', icon: <UserCheck size={16}/>, onClick: () => alert('已完成第三方查驗簽署...') }
        ],
        sections: []
      }}
    >
      <div className="max-w-6xl mx-auto py-6 space-y-10">
        
        {/* Auditor Header Card */}
        <motion.div variants={fadeIn} initial="initial" animate="animate">
           <Card className="bg-[#003262] text-white p-8 rounded-[32px] border-none shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Auditor Session Active</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">查驗標的：OX-RBA-2024-001</h2>
                    <p className="text-blue-200/70 text-sm font-medium max-w-lg">
                       正在為 **群光電子 (Chicony)** 審核來自供應商的 RBA VAP 實證憑證。此環境已與 5T 聖碑同步，所有查驗動作均會上鏈留痕。
                    </p>
                 </div>
                 <div className="flex flex-col items-end gap-3 self-end md:self-center">
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">Current Auditor</p>
                    <div className="flex items-center gap-3 bg-white/10 p-2 pl-4 rounded-2xl border border-white/10">
                       <span className="text-sm font-bold">BSI_ThirdParty_SGS</span>
                       <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <UserCheck size={20} />
                       </div>
                    </div>
                 </div>
              </div>
              <Brain size={300} className="absolute -bottom-20 -right-20 text-white/5 rotate-12 pointer-events-none" />
           </Card>
        </motion.div>

        {/* Action Tabs */}
        <motion.div variants={fadeIn}>
          <BrandTabs 
            activeTab={activeView}
            onTabChange={(id) => setActiveView(id as any)}
            tabs={[
              { id: 'overview', label: '治理總覽', icon: <Eye size={14}/> },
              { id: 'ocr', label: 'AI+OCR 原始憑證審查', icon: <Brain size={14}/> },
              { id: 'lineage', label: '5T 誠信溯源', icon: <Database size={14}/> },
            ]}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div key="overview" variants={staggerContainer} initial="initial" animate="animate" exit="initial" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Left: Summary Metrics */}
               <div className="lg:col-span-8 space-y-8">
                  <Card className="p-8 space-y-8 bg-white/60 backdrop-blur-md border-white/60">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#003262] uppercase tracking-tight">RBA 關鍵指標核對</h3>
                        <Badge variant="verified">AI PRE-SCREENED</Badge>
                     </div>
                     <div className="space-y-4">
                        {[
                          { label: '強迫勞動 (T1 溯源)', status: 'PASS', detail: '已核對 156 份聘僱合約', score: 100 },
                          { label: '職業健康與安全', status: 'WARNING', detail: '偵測到 2 份檢測報告已逾期', score: 65 },
                          { label: '環境管理系統 ISO 14001', status: 'PASS', detail: '憑證雜湊值完全吻合', score: 98 },
                          { label: '商業道德行為準則', status: 'PASS', detail: '數位簽章驗證通過', score: 92 },
                        ].map(item => (
                          <div key={item.label} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between group hover:bg-white transition-colors">
                             <div className="flex gap-4 items-center">
                                <div className={cn("w-2 h-10 rounded-full", item.status === 'PASS' ? 'bg-emerald-500' : 'bg-amber-500')} />
                                <div>
                                   <p className="text-sm font-bold text-slate-700">{item.label}</p>
                                   <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{item.detail}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <div className="text-right">
                                   <p className="text-xs font-black text-[#003262]">{item.score}%</p>
                                   <p className="text-[8px] text-slate-400 font-black uppercase">Confidence</p>
                                </div>
                                <Button variant="glass" size="sm" className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <ArrowRight size={14} />
                                </Button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </Card>

                  {/* Auditor Notes Section */}
                  <Card className="p-8 space-y-6 bg-white/60 backdrop-blur-md border-white/60">
                     <div className="flex items-center gap-3">
                        <MessageSquare size={20} className="text-[#003262]"/>
                        <h3 className="text-lg font-bold text-[#003262]">稽核員協作筆記</h3>
                     </div>
                     <textarea 
                        className="w-full bg-slate-50/50 border border-slate-200/60 rounded-[24px] p-6 text-sm focus:border-[#003262] outline-none min-h-[150px] shadow-inner"
                        placeholder="請在此輸入您的查驗意見..."
                        defaultValue="針對『職業健康與安全』項目的異常，AI 偵測到之逾期報告為 2023 年度舊件，供應商已於補件區上傳 2024 更新版，待重新掃描..."
                     />
                     <div className="flex justify-end gap-3">
                        <Button variant="glass">暫存草稿</Button>
                        <Button variant="primary">提交審核意見</Button>
                     </div>
                  </Card>
               </div>

               {/* Right: Sidebar Audit Trail */}
               <div className="lg:col-span-4 space-y-8">
                  <Card className="p-8 bg-[#FDB515]/5 border-[#FDB515]/20 backdrop-blur-md">
                     <h4 className="text-[10px] font-black text-[#003262] uppercase tracking-[0.2em] mb-6">治理查驗狀態</h4>
                     <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                           <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                              <span>完成進度</span>
                              <span>75%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <motion.div className="h-full bg-[#003262]" initial={{ width: 0 }} animate={{ width: '75%' }} />
                           </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-[#003262]/10">
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">查驗模式</span>
                              <span className="font-bold text-[#003262]">遠距線上查證</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">共識節點</span>
                              <span className="font-bold text-[#009E9D]">Multi-Sovereign Sync</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">證據透明度</span>
                              <span className="font-bold text-emerald-600">Level 5 (MAX)</span>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <Card className="p-8 space-y-6 bg-white/60 backdrop-blur-md border-white/60">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">查驗留痕 (Audit Trail)</h4>
                     <div className="space-y-6">
                        {[
                          { time: '14:22', user: 'AI_AGENT_EYE', action: '完成 OCR 批次掃描' },
                          { time: '14:25', user: 'SYSTEM', action: '產生 5T 雜湊預覽' },
                          { time: '15:10', user: 'AUDITOR_SGS', action: '開啟遠距環境' },
                        ].map((log, i) => (
                          <div key={i} className="flex gap-4 relative">
                             {i < 2 && <div className="absolute left-[11px] top-6 w-px h-6 bg-slate-100" />}
                             <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#003262]/40" />
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-slate-700">{log.action}</p>
                                <p className="text-[9px] text-slate-400 font-black uppercase">{log.time} · {log.user}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </Card>
               </div>
            </motion.div>
          )}

          {activeView === 'ocr' && (
            <motion.div key="ocr" variants={fadeIn} initial="initial" animate="animate" exit="initial">
               <Card className="p-10 bg-white/60 backdrop-blur-md border-white/60 min-h-[600px] flex flex-col gap-10">
                  <header className="flex justify-between items-center">
                     <div>
                        <h3 className="text-xl font-bold text-[#003262]">AI 憑證視覺分析</h3>
                        <p className="text-sm text-slate-500 font-medium">正在顯示 RBA_VAP_CERT_2024_01.pdf 的 OCR 提取結果</p>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="glass" size="sm"><Download size={14} className="mr-2"/> 原始文件</Button>
                        <Button variant="glass" size="sm"><ExternalLink size={14} className="mr-2"/> 另開檢視</Button>
                     </div>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     {/* OCR Canvas */}
                     <div className="bg-slate-100 rounded-[40px] aspect-[3/4] border-2 border-slate-200 relative overflow-hidden group shadow-inner cursor-zoom-in">
                        <div className="absolute inset-0 p-12 space-y-12">
                           <motion.div 
                              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                              className="w-64 h-12 bg-emerald-500/10 border border-emerald-500 rounded-xl flex items-center justify-between px-4"
                           >
                              <span className="text-[8px] font-black text-emerald-600 uppercase">Supplier: Chicony Partner</span>
                              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><CheckCircle2 size={10}/></div>
                           </motion.div>
                           <motion.div 
                              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                              className="w-full h-32 bg-blue-500/10 border border-blue-500 rounded-xl flex items-center justify-center"
                           >
                              <div className="text-center space-y-2">
                                 <Brain size={32} className="text-blue-500 mx-auto animate-pulse" />
                                 <p className="text-[10px] font-black text-blue-600 uppercase">Extracting GRI 308 Indicators...</p>
                              </div>
                           </motion.div>
                           <motion.div 
                              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                              className="w-48 h-8 bg-red-500/10 border border-red-500 rounded-xl flex items-center justify-between px-4"
                           >
                              <span className="text-[8px] font-black text-red-600 uppercase">Mismatch in Seal ID</span>
                              <AlertCircle size={12} className="text-red-500" />
                           </motion.div>
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                           <p className="text-[10px] text-white font-bold tracking-widest uppercase">Page 1 of 24 · 98% Confidence</p>
                        </div>
                     </div>

                     {/* AI Logic Results */}
                     <div className="space-y-8">
                        <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 shadow-sm">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">AI 信心度評分 (Logic Score)</h4>
                           <div className="space-y-10">
                              {[
                                { label: 'OCR 文字辨識度', score: 98, status: 'Success' },
                                { label: '憑證有效性檢查', score: 42, status: 'Action Required' },
                                { label: '關聯數據一致性', score: 85, status: 'Success' },
                                { label: '防偽印鑑偵測', score: 91, status: 'Success' },
                              ].map(item => (
                                <div key={item.label} className="space-y-3">
                                   <div className="flex justify-between items-end">
                                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                      <span className={cn("text-[10px] font-black uppercase tracking-widest", item.score > 80 ? 'text-emerald-500' : 'text-red-500')}>{item.status}</span>
                                   </div>
                                   <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                                      <motion.div 
                                        className="h-full bg-[#003262]" 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${item.score}%` }}
                                        style={{ backgroundColor: item.score > 80 ? '#10B981' : item.score > 50 ? '#FDB515' : '#EF4444' }}
                                      />
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>

                        <Card className="p-8 bg-blue-50 border-blue-100 rounded-[32px] flex items-start gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                              <UserCheck size={28} />
                           </div>
                           <div className="space-y-2">
                              <p className="text-sm font-bold text-[#003262]">查驗員介入建議</p>
                              <p className="text-xs text-blue-800/70 leading-relaxed">
                                 「AI 偵測到『憑證有效性檢查』分數較低，主因為檔案中的數位封印與 T5 聖碑之原始 Hash 不匹配。請稽核員手動開啟佐證資料庫進行深度核對。」
                              </p>
                           </div>
                        </Card>
                     </div>
                  </div>
               </Card>
            </motion.div>
          )}

          {activeView === 'lineage' && (
            <motion.div key="lineage" variants={fadeIn} initial="initial" animate="animate" exit="initial">
               <Card className="p-10 bg-white/60 backdrop-blur-md border-white/60 min-h-[400px] flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-20 h-20 rounded-[32px] bg-[#009E9D]/10 text-[#009E9D] flex items-center justify-center border border-[#009E9D]/20 shadow-xl">
                     <Database size={40} />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-2xl font-bold text-[#003262]">5T 誠信溯源聖碑 (Eternal Lineage)</h3>
                     <p className="text-slate-400 max-w-lg mx-auto font-medium">
                        正在載入分散式共識網路中的雜湊軌跡。此畫面顯示數據從產生、AI 稽核、到主權封印的完整生命週期。
                     </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                     {[
                       { icon: <Lock />, title: 'T4 Trustworthy', desc: 'SHA-256 Hash Lock 固定。' },
                       { icon: <Clock />, title: 'T5 Trackable', desc: '不可篡改之時間戳記。' },
                       { icon: <ShieldCheck />, title: 'ZKP Verified', desc: '隱私保護下之完整性驗證。' },
                     ].map((t, i) => (
                       <Card key={i} className="p-6 bg-slate-50/50 border-slate-100 flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#009E9D]">
                             {React.cloneElement(t.icon as React.ReactElement, { size: 20 })}
                          </div>
                          <h5 className="text-xs font-black text-[#003262] uppercase tracking-widest">{t.title}</h5>
                          <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{t.desc}</p>
                       </Card>
                     ))}
                  </div>
                  <Button variant="primary" size="lg" className="rounded-2xl px-10 h-14 font-black shadow-xl shadow-[#009E9D]/20 bg-[#009E9D] hover:bg-[#007E7D] border-none">
                     開啟圖譜溯源 (Graph Engine)
                  </Button>
               </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </StandardPage>
  );
}
