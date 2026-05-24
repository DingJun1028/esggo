'use client';
import { useState, useEffect } from 'react';
import { 
  Edit3, Save, Palette, CheckCircle, RefreshCw, Eye, Sparkles, Building, 
  Target, Users, Globe, CreditCard, ExternalLink, Zap, ArrowUpRight, MapPin, Landmark, X, ArrowRight 
} from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton, BrandCardHeader, BrandStatusDot } from '../../components/brand';
import { dcGetCompanyProfile, dcUpsertCompanyProfile } from '../../lib/dataconnect-services';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const PRESET_PALETTES = [
  { name: 'Berkeley Blue', primary: '#003262', accent: '#FDB515', secondary: '#3B7EA1' },
  { name: 'Emerald Trust', primary: '#064E3B', accent: '#10B981', secondary: '#059669' },
  { name: 'Deep Ocean', primary: '#1E3A8A', accent: '#3B82F6', secondary: '#60A5FA' },
  { name: 'Crimson Honor', primary: '#7F1D1D', accent: '#EF4444', secondary: '#DC2626' },
  { name: 'Amethyst Zen', primary: '#4C1D95', accent: '#8B5CF6', secondary: '#A78BFA' },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePalette, setActivePalette] = useState(PRESET_PALETTES[0]);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const data = await dcGetCompanyProfile('550e8400-e29b-41d4-a716-446655440000');
      if (data) {
        setProfile(data);
        setEditForm(data);
        const config = (data as any).brand_config;
        if (config) {
          setActivePalette(config);
          applyBrandPalette(config);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const applyBrandPalette = (palette: typeof PRESET_PALETTES[0]) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--secondary', palette.secondary);
    root.style.setProperty('--primary-50', `${palette.primary}08`);
    root.style.setProperty('--primary-100', `${palette.primary}15`);
    root.style.setProperty('--accent-light', `${palette.accent}15`);
  };

  const handleSave = async () => {
    const updatedForm = { ...editForm, brand_config: activePalette };
    await dcUpsertCompanyProfile(updatedForm);
    setProfile(updatedForm);
    setEditing(false);
  };

  if (loading || !profile) return <div className="p-20 text-center animate-pulse">Loading Corporate Identity...</div>;

  return (
    <div className="max-w-[1500px] mx-auto p-8 lg:p-12 space-y-12 pb-24 fade-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-[#FDB515]/10">BRAND_SOVEREIGNTY v8.5</BrandBadge>
             <div className="flex items-center gap-2.5 bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/60 shadow-sm">
                <Palette size={14} style={{ color: activePalette.primary }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: activePalette.primary }}>Corporate Brand Live</span>
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight leading-none uppercase" style={{ color: activePalette.primary }}>企業品牌管理</h1>
            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">定義您的品牌樣貌。所有的 5T 報告、主控台與自動預警將會根據此調色盤動態改變。</p>
          </div>
        </div>
        {!editing ? (
          <BrandButton variant="primary" className="h-16 px-10 rounded-2xl shadow-2xl" style={{ backgroundColor: activePalette.primary }} onClick={() => setEditing(true)}>
            <Edit3 size={18} className="mr-3" /> 修改品牌樣貌
          </BrandButton>
        ) : (
          <div className="flex gap-4">
            <BrandButton variant="ghost" className="h-16 px-8 rounded-2xl" onClick={() => setEditing(false)}>取消</BrandButton>
            <BrandButton variant="primary" className="h-16 px-10 rounded-2xl shadow-xl" style={{ backgroundColor: activePalette.primary }} onClick={handleSave}><Save size={18} className="mr-3" /> 儲存並套用</BrandButton>
          </div>
        )}
      </header>

      {editing && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
           <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100"><Palette size={20} className="text-slate-400" /></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">品牌調色盤設定</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {PRESET_PALETTES.map(p => (
                <button key={p.name} onClick={() => { setActivePalette(p); applyBrandPalette(p); }} className={cn("p-6 rounded-[2.5rem] border-2 transition-all duration-500 text-center space-y-4 group", activePalette.name === p.name ? "bg-white shadow-extreme" : "bg-slate-50 border-transparent hover:border-slate-200")} style={{ borderColor: activePalette.name === p.name ? p.primary : 'transparent' }}>
                   <div className="flex justify-center -space-x-3"><div className="w-10 h-10 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: p.primary }} /><div className="w-10 h-10 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: p.accent }} /><div className="w-10 h-10 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: p.secondary }} /></div>
                   <p className="text-[11px] font-black uppercase tracking-widest">{p.name}</p>
                   {activePalette.name === p.name && (<motion.div layoutId="check" className="mx-auto w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle size={10} className="text-white" /></motion.div>)}
                </button>
              ))}
           </div>
        </motion.section>
      )}

      {/* Brand Preview Showcase */}
      <section className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8">
           <BrandCard padding="none" className="glass-panel border-none shadow-extreme overflow-hidden relative min-h-[400px]">
              <div className="p-10 border-b border-slate-50 bg-white/40 flex items-center justify-between"><div><h3 className="text-xl font-black uppercase tracking-tight" style={{ color: activePalette.primary }}>品牌即時預覽</h3><p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Real-time Visual Feedback</p></div><BrandBadge variant="gold" size="xs">PRO_IDENTITY</BrandBadge></div>
              <div className="p-14 flex flex-col items-center justify-center space-y-12">
                 <div className="flex gap-6 items-center"><div className="w-24 h-24 rounded-[32px] flex items-center justify-center text-white shadow-2xl rotate-3" style={{ backgroundColor: activePalette.primary }}><Building size={48} /></div><div className="space-y-1"><h2 className="text-4xl font-black tracking-tighter" style={{ color: activePalette.primary }}>{profile.company_name}</h2><p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">{profile.industry} Governance Node</p></div></div>
                 <div className="flex flex-wrap justify-center gap-4"><button className="px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105" style={{ backgroundColor: activePalette.primary }}>Primary_Action</button><button className="px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg border-2 transition-all" style={{ borderColor: activePalette.accent, color: activePalette.accent }}>Accent_Logic</button><button className="px-10 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md border-2 border-transparent" style={{ backgroundColor: `${activePalette.secondary}15`, color: activePalette.secondary }}>Secondary_Insight</button></div>
                 <div className="w-full max-w-lg space-y-3"><div className="flex justify-between items-end"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Governance Integrity</span><span className="text-lg font-black font-mono" style={{ color: activePalette.primary }}>94%</span></div><div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50"><motion.div className="h-full rounded-full" style={{ backgroundColor: activePalette.primary }} initial={{ width: 0 }} animate={{ width: '94%' }} /></div></div>
              </div>
           </section>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <BrandCard padding="lg" className="glass-panel border-none shadow-premium bg-white/60 text-center"><div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner"><CheckCircle size={32} /></div><h4 className="font-black text-[#003262] uppercase tracking-tight">樣貌一致性檢查</h4><p className="text-[11px] text-slate-500 font-medium">系統已自動將您的 **{activePalette.name}** 調色盤延伸至所有的 5T 標籤。</p></BrandCard>
           <BrandCard padding="lg" className="glass-panel border-none shadow-premium relative overflow-hidden group"><div className="relative z-10 space-y-4"><h4 className="text-sm font-black uppercase tracking-widest text-slate-400">AI 品牌顧問建議</h4><p className="text-sm font-bold italic text-slate-700 leading-relaxed">「基於您的產業別，使用 **{activePalette.name}** 系列能有效建立專業感。」</p><button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: activePalette.primary }}>獲取更多品牌洞察 <ArrowRight size={14} /></button></div><Sparkles size={100} className="absolute -top-10 -right-10 opacity-5 rotate-12" /></BrandCard>
        </div>
      </section>
    </div>
  );
}
