'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileEdit, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Layout, 
  Save, 
  Lock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Database,
  History,
  Plus
} from 'lucide-react';
import { expertTemplates, ESGTemplate } from '@/lib/templates-data';

export default function EditorContent() {
  const [selectedTemplate, setSelectedTemplate] = useState<ESGTemplate | null>(expertTemplates[0]);
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState(0);
  const [isSealed, setIsSealed] = useState(false);

  // 模擬即時合規偵測邏輯
  useEffect(() => {
    if (content.length > 50) {
      setScore(Math.min(100, Math.floor(content.length / 10)));
    } else {
      setScore(0);
    }
  }, [content]);

  const handleSeal = () => {
    setIsSealed(true);
    setTimeout(() => {
      alert('5T 誠信封印已套用：內容已由 SHA-256 哈希鎖定。');
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg">
              <FileEdit size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">SustainWrite™ \u7de8\u8f2f\u5668</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">AI \u5354\u4f5c\u64b0\u5beb | GRI \u5373\u6642\u5408\u898f\u6aa2\u6e2c | 5T \u8aa0\u4fe1\u5c01\u5370</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <History size={16} /> \u7248\u672c\u6b77\u53f2
          </button>
          <button 
            onClick={handleSeal}
            disabled={isSealed}
            className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl ${isSealed ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-95'}`}
          >
            {isSealed ? <CheckCircle2 size={16} /> : <Lock size={16} />} 
            {isSealed ? '5T \u5df2\u5c01\u5370' : '\u57f7\u884c 5T \u5c01\u5370'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* \u5de6\u5074\u6a21\u677f\u9078\u64c7 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">\u5c08\u5bb6\u6a21\u677f\u5eab</h3>
            <div className="space-y-2">
              {expertTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`w-full text-left p-4 rounded-2xl transition-all group ${selectedTemplate?.id === t.id ? 'bg-emerald-50 border-emerald-100 ring-1 ring-emerald-200' : 'hover:bg-slate-50'}`}
                >
                  <p className={`text-[10px] font-black uppercase tracking-tighter ${selectedTemplate?.id === t.id ? 'text-emerald-600' : 'text-slate-400'}`}>{t.code}</p>
                  <p className={`text-xs font-bold truncate ${selectedTemplate?.id === t.id ? 'text-emerald-900' : 'text-slate-700'}`}>{t.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                <h4 className="text-sm font-black uppercase tracking-widest">AI \u5408\u898f\u8a55\u5206</h4>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-emerald-400 tabular-nums">{score}</span>
                <span className="text-xs font-bold text-slate-500 mb-2">/ 100</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                {score < 50 ? '\u63ed\u9732\u5167\u5bb9\u5c1a\u4e0d\u8db3\uff0c\u8acb\u53c3\u7167\u5de6\u5074\u6a21\u677f\u8981\u6c42\u88dc\u5145\u6578\u64da\u3002' : '\u5167\u5bb9\u5df2\u9054\u57fa\u672c\u5408\u898f\uff0c\u5efa\u8b70\u9023\u7d50 5T \u4f5c\u8b49\u3002'}
              </p>
            </div>
          </div>
        </aside>

        {/* \u4e3b\u7de8\u8f2f\u5340 */}
        <main className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-soft-xl overflow-hidden flex flex-col h-[700px]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedTemplate?.category}</span>
                <h2 className="font-bold text-slate-800">{selectedTemplate?.code} \u63ed\u9732\u64b0\u5beb</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase">Live Proofing Active</span>
              </div>
            </div>
            
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="\u958b\u59cb\u64b0\u5beb\u60a8\u7684\u6c38\u7e8c\u62ab\u9732\u5167\u5bb9..."
              className="flex-1 p-12 outline-none text-slate-700 leading-relaxed font-serif text-lg resize-none placeholder:text-slate-200"
            />

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div className="flex gap-4">
                <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 transition-all"><Database size={18} /></button>
                <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-500 transition-all"><Search size={18} /></button>
              </div>
              <button className="btn-premium flex items-center gap-2 px-8">
                <Save size={16} /> \u66ab\u5b58\u8349\u7a3f
              </button>
            </div>
          </div>
        </main>

        {/* \u53f3\u5074\u6307\u5f15\u8207\u4f5c\u8b49 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">\u6a21\u677f\u63ed\u9732\u8981\u6c42</h4>
              <ul className="space-y-4">
                {selectedTemplate?.requirements.map((req, i) => (
                  <li key={i} className="flex gap-3 text-xs font-bold text-slate-600 leading-relaxed">
                    <ChevronRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">\u5efa\u8b70\u4f5c\u8b49\u6587\u4ef6</h4>
              <div className="space-y-3">
                {selectedTemplate?.suggestedEvidence.map((ev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all">
                    <span className="text-[10px] font-black text-slate-500">{ev}</span>
                    <Plus size={14} className="text-slate-300 group-hover:text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
               <AlertCircle size={20} />
               <h4 className="font-black text-xs uppercase tracking-widest">Sector Benchmark</h4>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed font-bold italic">
              &quot;{selectedTemplate?.benchmark}&quot;
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
