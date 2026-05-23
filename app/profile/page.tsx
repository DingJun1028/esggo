'use client';
import { useState } from 'react';
import { Edit3, Save, Plus, Trash2, Building, Target, Users, Globe, CreditCard, ExternalLink, Zap, ArrowUpRight, Sparkles, MapPin, Landmark, X } from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandCardHeader, BrandStatusDot } from '../../components/brand';
import { motion, AnimatePresence } from 'framer-motion';

const defaultProfile = {
  company_name: '善向永續股份有限公司',
  industry: '永續科技服務業',
  employee_count: 250,
  revenue_twd: 150000000,
  capital_twd: 50000000,
  locations: ['台北市', '新竹市', '台中市'],
  reporting_year: 2024,
  vision: '成為台灣中小企業永續治理的最佳夥伴，透過科技與誠信實現 2030 淨零目標。',
  mission: '提供符合 GRI 2021 與 ISSB 標準的一站式 ESG 解決方案，讓每一家企業都能實踐負責任的商業模式。',
};

const defaultGoals = [
  { id: 1, title: '2030 碳中和目標', category: 'E', target: '碳排放較 2020 基準年減少 46%', deadline: '2030-12-31', status: 'in_progress' },
  { id: 2, title: '再生能源比例提升', category: 'E', target: '再生能源佔比達 60%', deadline: '2027-12-31', status: 'in_progress' },
  { id: 3, title: '女性管理職比例', category: 'S', target: '女性管理職比例達 40%', deadline: '2026-12-31', status: 'planned' },
  { id: 4, title: 'GRI 全面揭露', category: 'G', target: '完成 GRI 2021 全套揭露', deadline: '2025-12-31', status: 'completed' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [goals, setGoals] = useState(defaultGoals);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(defaultProfile);
  const [newGoal, setNewGoal] = useState({ title: '', category: 'E', target: '', deadline: '', status: 'planned' });
  const [showAddGoal, setShowAddGoal] = useState(false);

  const handleSave = () => {
    setProfile(editForm);
    setEditing(false);
  };

  const addGoal = () => {
    if (!newGoal.title) return;
    setGoals(prev => [...prev, { ...newGoal, id: Date.now() }]);
    setNewGoal({ title: '', category: 'E', target: '', deadline: '', status: 'planned' });
    setShowAddGoal(false);
  };

  const removeGoal = (id: number) => setGoals(prev => prev.filter(g => g.id !== id));

  const cycleStatus = (id: number) => {
    const statuses = ['planned', 'in_progress', 'completed'];
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: statuses[(statuses.indexOf(g.status) + 1) % statuses.length] } : g));
  };

  const statusColor = (s: string) => s === 'completed' ? '#10B981' : s === 'in_progress' ? '#003262' : '#F59E0B';
  const statusLabel = (s: string) => s === 'completed' ? 'COMPLETED' : s === 'in_progress' ? 'ACTIVE' : 'PLANNED';

  return (
    <div className="max-w-[1500px] mx-auto p-8 lg:p-12 space-y-12 pb-24 fade-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-[#FDB515]/10">CORPORATE_IDENTITY v8.5</BrandBadge>
             <div className="flex items-center gap-2.5 bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/60 shadow-sm">
                <Landmark size={14} className="text-[#003262]" />
                <span className="text-[10px] font-black text-[#003262] uppercase tracking-widest">Legal Entity Validated</span>
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-[#003262] tracking-tight leading-none uppercase">
              企業管理
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
              維護企業基本資料、願景使命與長期 ESG 目標。這是您 **數位分身 (Digital Twin)** 的核心參數。
            </p>
          </div>
        </div>
        {!editing ? (
          <BrandButton variant="primary" className="h-16 px-10 rounded-2xl shadow-2xl shadow-[#003262]/20" onClick={() => { setEditing(true); setEditForm(profile); }}>
            <Edit3 size={18} className="mr-3" /> 編輯資料
          </BrandButton>
        ) : (
          <div className="flex gap-4">
            <BrandButton variant="ghost" className="h-16 px-8 rounded-2xl" onClick={() => setEditing(false)}>取消</BrandButton>
            <BrandButton variant="primary" className="h-16 px-10 rounded-2xl shadow-xl shadow-[#003262]/20" onClick={handleSave}><Save size={18} className="mr-3" /> 儲存變更</BrandButton>
          </div>
        )}
      </header>

      {/* Subscription & Billing Section */}
      <BrandCard padding="none" className="glass-panel border-none overflow-hidden relative shadow-extreme p-10 lg:p-14 group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
           <Sparkles size={300} color="#FDB515" strokeWidth={0.5} />
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative z-10">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[28px] bg-[#FDB515]/10 flex items-center justify-center text-[#FDB515] shadow-inner backdrop-blur-md border border-[#FDB515]/20">
                 <CreditCard size={40} />
              </div>
              <div className="space-y-2">
                 <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-[#003262] tracking-tight">訂閱方案</h2>
                    <BrandBadge variant="gold" size="sm" className="font-black px-4">PRO_ENTERPRISE</BrandBadge>
                 </div>
                 <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                    您目前使用的是 **專業版**。享有全自動 5T 封印、GRI AI 撰寫額度以及 BlueCC 雲端集群優先調度權。
                 </p>
              </div>
           </div>
           <div className="flex gap-4 w-full lg:w-auto">
              <BrandButton variant="secondary" className="flex-1 lg:flex-none h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-black/10">
                 管理訂閱 <ExternalLink size={18} className="ml-2" />
              </BrandButton>
           </div>
        </div>
      </BrandCard>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-7">
           <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden h-full">
             <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-black text-[#003262] tracking-tight uppercase">公司基本資料</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Legal Identity & Performance</p>
             </div>
             <div className="p-10">
               {editing ? (
                 <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                          <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" value={editForm.company_name} onChange={e => setEditForm(p => ({ ...p, company_name: e.target.value }))} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry</label>
                          <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" value={editForm.industry} onChange={e => setEditForm(p => ({ ...p, industry: e.target.value }))} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employees</label>
                          <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" type="number" value={editForm.employee_count} onChange={e => setEditForm(p => ({ ...p, employee_count: +e.target.value }))} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reporting Year</label>
                          <input className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" type="number" value={editForm.reporting_year} onChange={e => setEditForm(p => ({ ...p, reporting_year: +e.target.value }))} />
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                   {[
                     { label: '公司名稱', value: profile.company_name, icon: <Building size={14}/> },
                     { label: '產業別', value: profile.industry, icon: <Target size={14}/> },
                     { label: '員工人數', value: `${profile.employee_count.toLocaleString()} 人`, icon: <Users size={14}/> },
                     { label: '年營收', value: `NT$ ${(profile.revenue_twd / 1e6).toFixed(0)} 百萬`, icon: <Landmark size={14}/> },
                     { label: '資本額', value: `NT$ ${(profile.capital_twd / 1e6).toFixed(0)} 百萬`, icon: <CreditCard size={14}/> },
                     { label: '主要據點', value: profile.locations.join(', '), icon: <MapPin size={14}/> },
                   ].map(item => (
                     <div key={item.label} className="flex items-center justify-between py-5 border-b border-slate-50 last:border-0 group">
                        <div className="flex items-center gap-3">
                           <div className="text-slate-300 group-hover:text-[#003262] transition-colors">{item.icon}</div>
                           <span className="text-sm text-slate-400 font-bold uppercase tracking-tight">{item.label}</span>
                        </div>
                        <span className="text-base text-[#003262] font-black tracking-tight">{item.value}</span>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </BrandCard>
        </div>

        <div className="col-span-12 lg:col-span-5">
           <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden h-full flex flex-col">
             <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-black text-[#003262] tracking-tight uppercase">主權願景與使命</h3>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Sovereign Vision & Mission</p>
             </div>
             <div className="p-10 space-y-12 flex-1">
               {editing ? (
                 <div className="space-y-8 h-full">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vision Statement</label>
                       <textarea className="w-full bg-slate-50 border border-slate-100 rounded-[28px] p-8 text-base font-medium text-slate-700 leading-relaxed italic focus:bg-white focus:ring-8 focus:ring-blue-500/5 transition-all outline-none resize-none min-h-[160px]" value={editForm.vision} onChange={e => setEditForm(p => ({ ...p, vision: e.target.value }))} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Statement</label>
                       <textarea className="w-full bg-slate-50 border border-slate-100 rounded-[28px] p-8 text-base font-medium text-slate-700 leading-relaxed italic focus:bg-white focus:ring-8 focus:ring-blue-500/5 transition-all outline-none resize-none min-h-[160px]" value={editForm.mission} onChange={e => setEditForm(p => ({ ...p, mission: e.target.value }))} />
                    </div>
                 </div>
               ) : (
                 <div className="space-y-12">
                    <div className="group">
                       <div className="flex items-center gap-3 mb-5">
                          <Globe size={18} className="text-[#003262]" />
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">企業願景 Vision</h4>
                       </div>
                       <p className="text-lg text-[#003262] leading-relaxed font-bold italic border-l-[6px] border-[#FDB515] pl-8 py-2 bg-[#FDB515]/5 rounded-r-3xl transition-all group-hover:bg-[#FDB515]/10">{profile.vision}</p>
                    </div>
                    <div className="group">
                       <div className="flex items-center gap-3 mb-5">
                          <Target size={18} className="text-[#003262]" />
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">企業使命 Mission</h4>
                       </div>
                       <p className="text-lg text-[#003262] leading-relaxed font-bold italic border-l-[6px] border-[#003262] pl-8 py-2 bg-[#003262]/5 rounded-r-3xl transition-all group-hover:bg-[#003262]/10">{profile.mission}</p>
                    </div>
                 </div>
               )}
             </div>
           </BrandCard>
        </div>
      </div>

      <section className="space-y-8">
         <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl bg-[#003262] flex items-center justify-center text-white shadow-2xl shadow-[#003262]/20">
                  <Target size={28} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-[#003262] tracking-tight uppercase">ESG 核心目標管理</h3>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Strategic Roadmap Tracking</p>
               </div>
            </div>
            <BrandButton variant="ghost" className="rounded-xl h-12 font-black uppercase text-[11px] tracking-widest border-slate-100" onClick={() => setShowAddGoal(!showAddGoal)}>
               <Plus size={16} className="mr-2" /> New_Goal
            </BrandButton>
         </div>

         <AnimatePresence>
           {showAddGoal && (
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
               <BrandCard padding="lg" className="glass-panel border-blue-200/50 bg-blue-50/20 mb-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Goal Title</label>
                        <input className="w-full h-12 bg-white rounded-xl border border-slate-100 px-4 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} placeholder="目標名稱" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Details</label>
                        <input className="w-full h-12 bg-white rounded-xl border border-slate-100 px-4 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" value={newGoal.target} onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))} placeholder="具體描述" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Date</label>
                        <input className="w-full h-12 bg-white rounded-xl border border-slate-100 px-4 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" type="date" value={newGoal.deadline} onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))} />
                     </div>
                     <div className="flex gap-3 h-12">
                        <BrandButton variant="primary" className="flex-1 rounded-xl shadow-lg" onClick={addGoal}>儲存目標</BrandButton>
                        <BrandButton variant="ghost" className="px-4 rounded-xl" onClick={() => setShowAddGoal(false)}><X size={16}/></BrandButton>
                     </div>
                  </div>
               </BrandCard>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goals.map(goal => (
              <BrandCard key={goal.id} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-110 ${goal.category === 'E' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : goal.category === 'S' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                      {goal.category}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                         <h4 className="font-black text-[#003262] text-lg tracking-tight">{goal.title}</h4>
                         <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">{goal.deadline}</span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{goal.target}</p>
                   </div>
                   <div className="flex flex-col items-end gap-3">
                      <button 
                        onClick={() => cycleStatus(goal.id)}
                        className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-sm"
                        style={{ background: `${statusColor(goal.status)}08`, color: statusColor(goal.status), border: `1px solid ${statusColor(goal.status)}20` }}
                      >
                         {statusLabel(goal.status)}
                      </button>
                      <button onClick={() => removeGoal(goal.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              </BrandCard>
            ))}
         </div>
      </section>
    </div>
  );
}