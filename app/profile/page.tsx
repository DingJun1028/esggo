'use client';
import { useState } from 'react';
import { Edit3, Save, Plus, Trash2, Building, Target, Users, Globe, CreditCard, ExternalLink, Zap } from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandCardHeader } from '../../components/brand';

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

  const statusColor = (s: string) => s === 'completed' ? '#22c55e' : s === 'in_progress' ? '#003262' : '#f59e0b';
  const statusLabel = (s: string) => s === 'completed' ? '已完成' : s === 'in_progress' ? '進行中' : '計畫中';

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">企業管理</h1>
          <p className="text-sm text-slate-500 mt-1">Corporate Profile · 基本資料 · ESG 目標管理</p>
        </div>
        {!editing ? (
          <BrandButton onClick={() => { setEditing(true); setEditForm(profile); }}>
            <Edit3 size={14} className="mr-2" /> 編輯資料
          </BrandButton>
        ) : (
          <div className="flex gap-2">
            <BrandButton variant="ghost" onClick={() => setEditing(false)}>取消</BrandButton>
            <BrandButton onClick={handleSave}><Save size={14} className="mr-2" /> 儲存</BrandButton>
          </div>
        )}
      </div>

      {/* Subscription & Billing Section */}
      <BrandCard padding="lg" variant="glass" className="border-[#FDB515]/20 overflow-hidden relative mb-6">
        <div className="absolute top-0 right-0 p-6 opacity-10">
           <Zap size={64} className="text-[#FDB515] rotate-12" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FDB515]/10 flex items-center justify-center text-[#FDB515] shadow-inner">
                 <CreditCard size={28} />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-slate-900">訂閱與方案</h2>
                    <BrandBadge variant="gold" size="sm">PRO PLAN</BrandBadge>
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                    您的企業目前使用的是專業版方案。享有全自動 5T 封印、GRI 2021 AI 撰寫額度以及 BlueCC 雲端集群優先調度權。
                 </p>
              </div>
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <BrandButton variant="primary" className="flex-1 md:flex-none px-6">
                 管理訂閱 <ExternalLink size={14} className="ml-2" />
              </BrandButton>
              <BrandButton variant="ghost" className="flex-1 md:flex-none">
                 查看帳單
              </BrandButton>
           </div>
        </div>
      </BrandCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BrandCard padding="none" className="overflow-hidden">
          <BrandCardHeader title="公司基本資料" icon={<Building size={18} />} />
          <div className="p-6">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">公司名稱</label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-all" value={editForm.company_name} onChange={e => setEditForm(p => ({ ...p, company_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">產業別</label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-all" value={editForm.industry} onChange={e => setEditForm(p => ({ ...p, industry: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">員工人數</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-all" type="number" value={editForm.employee_count} onChange={e => setEditForm(p => ({ ...p, employee_count: +e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">報告年度</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-all" type="number" value={editForm.reporting_year} onChange={e => setEditForm(p => ({ ...p, reporting_year: +e.target.value }))} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {[
                  { label: '公司名稱', value: profile.company_name },
                  { label: '產業別', value: profile.industry },
                  { label: '員工人數', value: `${profile.employee_count.toLocaleString()} 人` },
                  { label: '年營收', value: `NT$ ${(profile.revenue_twd / 1e6).toFixed(0)} 百萬` },
                  { label: '資本額', value: `NT$ ${(profile.capital_twd / 1e6).toFixed(0)} 百萬` },
                  { label: '報告年度', value: `${profile.reporting_year} 年` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b border-slate-50 last:border-0">
                    <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                    <span className="text-sm text-slate-900 font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </BrandCard>

        <BrandCard padding="none" className="overflow-hidden">
          <BrandCardHeader title="願景與使命" icon={<Globe size={18} />} />
          <div className="p-6">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">企業願景</label>
                  <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-all min-h-[120px]" value={editForm.vision} onChange={e => setEditForm(p => ({ ...p, vision: e.target.value }))} rows={4} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">企業使命</label>
                  <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 outline-none transition-all min-h-[120px]" value={editForm.mission} onChange={e => setEditForm(p => ({ ...p, mission: e.target.value }))} rows={4} />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">企業願景 Vision</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium italic border-l-4 border-blue-600 pl-4">{profile.vision}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">企業使命 Mission</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium italic border-l-4 border-[#FDB515] pl-4">{profile.mission}</p>
                </div>
              </div>
            )}
          </div>
        </BrandCard>
      </div>

      <BrandCard padding="none" className="mt-6 overflow-hidden">
        <BrandCardHeader 
          title="ESG 目標管理" 
          icon={<Target size={18} />}
          actions={
            <BrandButton size="xs" onClick={() => setShowAddGoal(!showAddGoal)}>
              <Plus size={14} className="mr-1" /> 新增目標
            </BrandButton>
          }
        />
        <div className="p-6">
          {showAddGoal && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">目標名稱</label>
                <input className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-blue-600 outline-none transition-all" value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} placeholder="目標名稱" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">目標內容</label>
                <input className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-blue-600 outline-none transition-all" value={newGoal.target} onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))} placeholder="具體目標" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">截止日期</label>
                <input className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-blue-600 outline-none transition-all" type="date" value={newGoal.deadline} onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <BrandButton variant="primary" size="sm" onClick={addGoal} className="flex-1">儲存</BrandButton>
                <BrandButton variant="ghost" size="sm" onClick={() => setShowAddGoal(false)}>取消</BrandButton>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {goals.map(goal => (
              <div key={goal.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all hover:shadow-sm group">
                <BrandBadge variant={goal.category === 'E' ? 'success' : goal.category === 'S' ? 'info' : 'warning'} size="sm" className="w-8 h-8 flex items-center justify-center p-0 rounded-lg">{goal.category}</BrandBadge>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-sm mb-0.5">{goal.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{goal.target}</div>
                </div>
                <div className="hidden sm:block text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{goal.deadline}</div>
                <button 
                  onClick={() => cycleStatus(goal.id)}
                  className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                  style={{ background: `${statusColor(goal.status)}10`, color: statusColor(goal.status), border: `1px solid ${statusColor(goal.status)}20` }}
                >
                  {statusLabel(goal.status)}
                </button>
                <button onClick={() => removeGoal(goal.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </BrandCard>
    </div>
  );
}