'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Layout, 
  Database, 
  ShieldCheck, 
  FileText,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { expertTemplates } from '@/lib/templates-data';
import Link from 'next/link';

export default function TemplatesContent() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveType] = useState<'All' | 'GRI' | 'SASB' | 'TCFD'>('All');

  const filtered = expertTemplates.filter(t => 
    (activeTab === 'All' || t.standard === activeTab) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
              <Layout size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">專家模板庫 Templates</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 2026 / SASB 2.0 | 預定義合規數據點與佐證要求</p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           {['All', 'GRI', 'SASB', 'TCFD'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveType(tab as any)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </header>

      <div className="relative group max-w-2xl">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
         <input 
           type="text" 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           placeholder="搜尋準則編號或關鍵字... (如: GRI 302)"
           className="w-full bg-white border border-slate-200 rounded-[2rem] px-16 py-5 text-sm font-bold shadow-soft-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 transition-all"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((t, idx) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col hover:border-emerald-200 hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                  {t.standard} Standard
               </div>
               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <FileText size={20} />
               </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">{t.code}</h3>
            <p className="text-sm font-bold text-slate-500 mb-8 flex-1">{t.title}</p>

            <div className="space-y-4 pt-6 border-t border-slate-50">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Disclosure Items</span>
                  <span className="text-slate-900">{t.requirements.length} Items</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Evidence Required</span>
                  <span className="text-emerald-600">5T Sealed</span>
               </div>
            </div>

            <Link href={`/editor?template=${t.id}`} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
               Apply Template <ArrowRight size={14} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}