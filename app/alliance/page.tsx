'use client';
import { useState } from 'react';
import {
  Shield, CheckCircle, Lock, Globe, Fingerprint, Plus,
  Copy, Eye, EyeOff, Zap, Users, AlertTriangle, Network, ArrowUpRight, Bot, Sparkles, RefreshCw, X, Landmark, Terminal, History, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

interface AllianceMember {
  id: string;
  partner_name: string;
  organization: string;
  clearance_level: 'L1' | 'L2' | 'L3';
  token: string;
  status: 'active' | 'pending' | 'revoked';
  webhook_url?: string;
  zkp_calls: number;
  last_access?: string;
  created_at: string;
}

const SEED_MEMBERS: AllianceMember[] = [
  { id: '1', partner_name: 'TSMC 供應鏈管理', organization: '台積電', clearance_level: 'L3', token: 'token-tsmc-2026', status: 'active', zkp_calls: 87, created_at: '2026-04-01' },
  { id: '2', partner_name: '善向永續 Win-Sustainability', organization: '善向永續', clearance_level: 'L2', token: 'token-win-2026', status: 'active', zkp_calls: 34, created_at: '2026-04-15' },
  { id: '3', partner_name: '王道商業聯盟', organization: '王道協會', clearance_level: 'L2', token: 'token-wang-dao-2026', status: 'active', zkp_calls: 12, created_at: '2026-05-01' },
];

const CLEARANCE_META = {
  L1: { label: 'L1 — 公開揭露', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  L2: { label: 'L2 — 聯盟共享', color: '#3B7EA1', bg: 'rgba(59, 126, 161, 0.1)' },
  L3: { label: 'L3 — 核心廠級', color: '#FDB515', bg: 'rgba(253, 181, 21, 0.1)' },
};

export default function AlliancePage() {
  const [members, setMembers] = useState<AllianceMember[]>(SEED_MEMBERS);
  const [activeTab, setActiveTab] = useState('members');
  const [showAdd, setShowAdd] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!verifyToken.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    await new Promise(r => setTimeout(r, 2000));
    const found = members.find(m => m.token === verifyToken.trim());
    setVerifyResult(found ? { valid: true, ...found } : { valid: false });
    setVerifying(false);
  };

  const pageConfig: UniversalPageConfig = {
    id: 'alliance-protocol',
    title: '王道聯盟數據信託',
    subtitle: 'Alliance Data Sharing Protocol：基於 ZKP 零知識證明與 5T 協議的跨組織誠信主權網絡。',
    icon: <Network size={32} />,
    griReference: 'Alliance Protocol v1.0',
    activeT5Tags: ['T4', 'T5'],
    primaryActions: [
      { id: 'verify', label: '進入驗證艙', icon: <Fingerprint size={16}/>, onClick: () => setActiveTab('verify') },
      { id: 'add', label: '新增成員', icon: <Plus size={16}/>, onClick: () => setShowAdd(true) }
    ],
    kpis: [
      { key: 'members', label: '聯盟成員', value: members.length, icon: <Users size={18}/>, color: '#003262' },
      { key: 'active',  label: '活躍節點', value: members.filter(m => m.status === 'active').length, icon: <Zap size={18}/>, color: '#10B981', verified: true },
      { key: 'zkp',     label: 'ZKP 總調用', value: '133', unit: '次', icon: <ShieldCheck size={18}/>, color: '#3B7EA1', verified: true },
      { key: 'l3',      label: 'L3 核心廠', value: '1', icon: <Landmark size={18}/>, color: '#FDB515' },
    ],
    sections: [
      {
        id: 'tabs',
        title: '管理維度',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'members', label: '成員管理', icon: <Users size={16}/> },
              { id: 'verify',  label: 'ZKP 驗證',  icon: <Fingerprint size={16}/> },
              { id: 'protocol', label: '共榮協定', icon: <Shield size={16}/> },
            ]}
          />
        )
      },
      {
        id: 'main',
        title: activeTab === 'members' ? '聯盟節點名冊' : activeTab === 'verify' ? 'ZKP 液態玻璃驗證艙' : '聯盟數據共享協定',
        columns: 12,
        component: (
          <div className="fade-in">
            {activeTab === 'members' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {members.map(m => (
                   <BrandCard key={m.id} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#003262]/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform" style={{ backgroundColor: CLEARANCE_META[m.clearance_level].bg, color: CLEARANCE_META[m.clearance_level].color }}>
                            <Fingerprint size={28} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black text-[#003262] uppercase tracking-widest truncate">{m.partner_name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{m.organization}</p>
                         </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                         <BrandBadge variant="outline" size="xs" style={{ color: CLEARANCE_META[m.clearance_level].color, borderColor: `${CLEARANCE_META[m.clearance_level].color}30` }}>{CLEARANCE_META[m.clearance_level].label}</BrandBadge>
                         <BrandBadge variant="info" size="xs" className="font-mono">{m.zkp_calls} ZKP_CALLS</BrandBadge>
                      </div>
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-300 uppercase">Token Status</span>
                         <BrandStatusDot status={m.status === 'active' ? 'active' : 'warning'} label={m.status.toUpperCase()} size="sm" />
                      </div>
                   </BrandCard>
                 ))}
              </div>
            )}

            {activeTab === 'verify' && (
              <div className="max-w-2xl mx-auto space-y-8">
                 <BrandCard padding="lg" className="glass-panel border-none shadow-premium text-center">
                    <div className="w-16 h-16 rounded-[24px] bg-[#003262] flex items-center justify-center text-white shadow-xl mx-auto mb-6"><Terminal size={32}/></div>
                    <h3 className="text-xl font-black text-[#003262] mb-2 uppercase tracking-tight">執行零知識證明驗算</h3>
                    <p className="text-xs text-slate-500 font-medium mb-8">請輸入聯盟成員 Token 進行去中心化誠信驗算。</p>
                    <div className="flex gap-3 mb-8">
                       <input 
                        className="flex-1 h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                        placeholder="token-xxxx-xxxx-2026"
                        value={verifyToken}
                        onChange={e => setVerifyToken(e.target.value)}
                       />
                       <BrandButton variant="primary" className="rounded-2xl h-14 px-8 font-black" onClick={handleVerify} loading={verifying}>
                          啟動驗算
                       </BrandButton>
                    </div>
                    
                    <AnimatePresence>
                       {verifyResult && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-8 rounded-[32px] border text-left ${verifyResult.valid ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                            <div className="flex items-center gap-4 mb-6">
                               {verifyResult.valid ? <CheckCircle2 size={32} className="text-emerald-500" /> : <AlertTriangle size={32} className="text-rose-500" />}
                               <div>
                                  <h4 className="text-lg font-black text-slate-800 tracking-tight">{verifyResult.valid ? '驗證通過 — 數據信託有效' : '驗證失敗 — 憑證無效'}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{verifyResult.valid ? 'ZKP Verification Successful' : 'Invalid or Revoked Token'}</p>
                               </div>
                            </div>
                            {verifyResult.valid && (
                               <div className="space-y-4 pt-4 border-t border-emerald-100/50">
                                  <div className="flex justify-between items-center text-xs">
                                     <span className="font-black text-emerald-800/60 uppercase">Partner</span>
                                     <span className="font-bold text-emerald-900">{verifyResult.partner_name}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                     <span className="font-black text-emerald-800/60 uppercase">Clearance</span>
                                     <span className="font-bold text-emerald-900">{verifyResult.clearance_level}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                     <span className="font-black text-emerald-800/60 uppercase">Hash Anchor</span>
                                     <code className="text-[10px] font-mono text-emerald-700 bg-white/50 px-2 py-1 rounded">sha256:f7a2...8b1c</code>
                                  </div>
                               </div>
                            )}
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </BrandCard>
              </div>
            )}

            {activeTab === 'protocol' && (
              <div className="space-y-8">
                 <BrandCard padding="none" className="bg-[#003262] border-none shadow-extreme rounded-[40px] overflow-hidden group">
                    <div className="p-12 lg:p-16 relative">
                       <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]"><Network size={300} color="#fff" /></div>
                       <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">聯盟共榮數據共享協定 v1.0</h3>
                       <p className="text-blue-200/60 font-bold uppercase tracking-[0.3em] mb-12">Alliance Sovereign Protocol</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                          {[
                            '零知識傳輸：所有數據交換採用 ZKP 分級脫敏。',
                            '不可篡改錨定：傳輸數據附帶 5T Hash Lock 證明。',
                            '生命週期追蹤：所有流轉皆刻印至主權鏈式日誌。',
                            '透明驗算：演算法完全公開，支持零幻覺治理驗算。'
                          ].map((c, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                               <CheckCircle2 size={24} className="text-[#FDB515] flex-shrink-0" />
                               <span className="text-sm text-blue-50 font-medium leading-relaxed">{c}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </BrandCard>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {[
                      { level: 'L1', name: '公開揭露層', desc: '一般大眾可存取的摘要資訊。', color: '#10B981' },
                      { level: 'L2', name: '聯盟共享層', desc: '聯盟夥伴共享的指標數據。', color: '#3B7EA1' },
                      { level: 'L3', name: '核心廠級', desc: '僅供最高權限核心廠存取。', color: '#FDB515' },
                    ].map(tier => (
                      <BrandCard key={tier.level} padding="lg" className="glass-panel border-none shadow-sm hover:-translate-y-2 transition-all duration-500">
                         <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center shadow-inner" style={{ backgroundColor: `${tier.color}15`, color: tier.color }}><Lock size={20}/></div>
                         <h4 className="text-lg font-black text-slate-800 mb-2">{tier.level} · {tier.name}</h4>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">{tier.desc}</p>
                      </BrandCard>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-xl w-full overflow-hidden">
              <header className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-lg"><Network size={20} /></div><h3 className="text-2xl font-black text-[#003262] uppercase tracking-tight">新增聯盟節點</h3></div>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"><X size={20} /></button>
              </header>
              <div className="space-y-6 mb-10 relative z-10 text-left">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner Name</label><input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clearance Level</label><select className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white outline-none transition-all"><option value="L1">L1 - Public</option><option value="L2">L2 - Shared</option><option value="L3">L3 - Core</option></select></div>
              </div>
              <div className="flex gap-4"><BrandButton variant="ghost" className="flex-1 rounded-2xl h-14" onClick={() => setShowAdd(false)}>取消</BrandButton><BrandButton variant="primary" className="flex-[2] rounded-2xl h-14 font-black shadow-xl" onClick={() => setShowAdd(false)}>建立聯盟節點</BrandButton></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}