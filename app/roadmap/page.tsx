'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, X, CheckCircle, Map, TrendingDown, ShieldCheck, Flag, ArrowUpRight, Sparkles, Bot, Clock, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { getRoadmapMilestones, upsertRoadmapMilestone, updateMilestoneStatus, type RoadmapMilestone } from '../../lib/db';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

const carbonTrend = [
  { year: 2020, actual: 3200, sbti: 3200 },
  { year: 2021, actual: 3050, sbti: 3104 },
  { year: 2022, actual: 2890, sbti: 3008 },
  { year: 2023, actual: 2640, sbti: 2912 },
  { year: 2024, actual: 2140, sbti: 2816 },
  { year: 2025, actual: null, sbti: 2720 },
  { year: 2026, actual: null, sbti: 2624 },
  { year: 2030, actual: null, sbti: 1728 },
];

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Partial<RoadmapMilestone>>({ title: '', target_year: 2030, category: 'Carbon', status: 'planned', sbti_aligned: true });

  const load = async () => {
    setLoading(true);
    const d = await getRoadmapMilestones();
    setMilestones(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const cycleStatus = async (m: RoadmapMilestone) => {
    const statuses = ['planned', 'in_progress', 'achieved'] as const;
    const idx = statuses.indexOf((m.status as any) || 'planned');
    const next = statuses[(idx + 1) % statuses.length] as typeof statuses[number];
    await updateMilestoneStatus(m.id!, next);
    setMilestones(prev => prev.map(ms => ms.id === m.id ? { ...ms, status: next } : ms));
  };

  const addMilestone = async () => {
    if (!newMilestone.title) return;
    const result = await upsertRoadmapMilestone(newMilestone as RoadmapMilestone);
    if (result) setMilestones(prev => [...prev, result]);
    setShowAdd(false);
    setNewMilestone({ title: '', target_year: 2030, category: 'Carbon', status: 'planned', sbti_aligned: true });
  };

  const pageConfig: UniversalPageConfig = {
    id: 'net-zero-roadmap',
    title: '淨零路線圖 Net-Zero',
    subtitle: 'SBTi 減碳里程碑 · 碳排趨勢預測 · GRI 305 合規：引領企業邁向 2050 氣候主權目標。',
    icon: <Map size={32} />,
    griReference: 'GRI 305 / SBTi',
    activeT5Tags: ['T1', 'T3', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: load, loading },
      { id: 'add', label: '新增里程碑', icon: <Plus size={16}/>, onClick: () => setShowAdd(true) }
    ],
    kpis: [
      { key: 'total', label: '總里程碑', value: milestones.length, icon: <Flag size={18}/>, color: '#003262' },
      { key: 'achieved', label: '已達成', value: milestones.filter(m => m.status === 'achieved').length, icon: <CheckCircle2 size={18}/>, color: '#10B981', verified: true },
      { key: 'active', label: '推進中', value: milestones.filter(m => m.status === 'in_progress').length, icon: <RefreshCw size={18}/>, color: '#3B7EA1' },
      { key: 'sbti', label: 'SBTi 對齊', value: milestones.filter(m => m.sbti_aligned).length, icon: <ShieldCheck size={18}/>, color: '#8B5CF6', verified: true },
    ],
    sections: [
      {
        id: 'trend',
        title: '碳排趨勢與 SBTi 1.5°C 路徑',
        columns: 12,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium p-8 lg:p-10 h-full overflow-hidden">
            <div className="h-[360px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={carbonTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003262" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#003262" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                    />
                    <ReferenceLine x={2024} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="8 8" label={{ value: 'NOW', position: 'top', fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                    <Area type="monotone" dataKey="actual" stroke="#003262" strokeWidth={4} fillOpacity={1} fill="url(#actualGrad)" name="實際排放量" />
                    <Area type="monotone" dataKey="sbti" stroke="#FDB515" strokeWidth={2} strokeDasharray="5 5" fill="none" name="SBTi 1.5°C 目標" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 flex items-center justify-center gap-10">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#003262]" />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Actual Tracking</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 border-2 border-dashed border-[#FDB515] rounded-full" />
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">SBTi Pathway</span>
               </div>
            </div>
          </BrandCard>
        )
      },
      {
        id: 'milestones',
        title: '戰略里程碑時間軸',
        columns: 12,
        component: (
          <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
             <BrandTable 
               loading={loading}
               columns={[
                 { label: '里程碑事項', key: 'title' },
                 { label: '類別', key: 'category' },
                 { label: '目標年', key: 'year' },
                 { label: '關鍵指標', key: 'target' },
                 { label: '狀態', key: 'status' },
                 { label: 'SBTi 認證', key: 'sbti' },
                 { label: '操作', key: 'actions' },
               ]}
               data={milestones.map(m => ({
                 title: <span className="font-bold text-[#003262]">{m.title}</span>,
                 category: <BrandBadge variant="outline" size="xs" className="opacity-60">{m.category}</BrandBadge>,
                 year: <span className="font-mono text-sm font-black text-[#003262]">{m.target_year}</span>,
                 target: <span className="text-xs font-bold text-slate-500">{m.target_value ? `${m.target_value} ${m.unit || ''}` : '-'}</span>,
                 status: (
                   <BrandBadge 
                    variant={m.status === 'achieved' ? 'success' : m.status === 'in_progress' ? 'info' : 'outline'} 
                    size="xs" className="font-black"
                   >
                     {m.status?.toUpperCase().replace('_', ' ')}
                   </BrandBadge>
                 ),
                 sbti: m.sbti_aligned ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <div className="h-4 w-4 rounded-full border border-slate-100 mx-auto" />,
                 actions: (
                   <BrandButton variant="ghost" size="xs" className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest" onClick={() => cycleStatus(m)}>
                      Next_Stage
                   </BrandButton>
                 )
               }))}
             />
          </BrandCard>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return (
    <>
      <StandardPage config={pageConfig} />
      
      {/* Refined Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 lg:p-12">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowAdd(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white/95 backdrop-blur-2xl rounded-[40px] border border-white shadow-extreme p-10 lg:p-14 max-w-xl w-full overflow-hidden"
            >
              <header className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-lg"><Flag size={20} /></div>
                   <h3 className="text-2xl font-black text-[#003262] uppercase tracking-tight">新增淨零里程碑</h3>
                </div>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all"><X size={20} /></button>
              </header>

              <div className="space-y-6 mb-10 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Milestone Title</label>
                    <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" value={newMilestone.title} onChange={e => setNewMilestone({...newMilestone, title: e.target.value})} placeholder="例：範疇二排放較基準年減少 50%..." />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Year</label>
                       <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white transition-all outline-none font-mono" type="number" value={newMilestone.target_year} onChange={e => setNewMilestone({...newMilestone, target_year: +e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                       <select className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white transition-all outline-none" value={newMilestone.category} onChange={e => setNewMilestone({...newMilestone, category: e.target.value})}>
                          {['Carbon', 'Energy', 'Water', 'Social', 'Governance'].map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <BrandButton variant="ghost" className="flex-1 rounded-2xl h-14" onClick={() => setShowAdd(false)}>取消</BrandButton>
                 <BrandButton variant="primary" className="flex-[2] rounded-2xl h-14 font-black shadow-xl" onClick={addMilestone}>建立里程碑</BrandButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}