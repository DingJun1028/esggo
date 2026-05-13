'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Globe, 
  Plus,
  ArrowRight,
  MousePointer2,
  Save,
  ShieldCheck
} from 'lucide-react';

const initialIssues = [
  { id: 1, name: '氣候變遷與碳管理', impact: 9.5, concern: 9.0, category: 'E' },
  { id: 2, name: '資訊安全與隱私', impact: 8.8, concern: 9.5, category: 'G' },
  { id: 3, name: '職業健康與安全', impact: 7.5, concern: 8.5, category: 'S' },
  { id: 4, name: '供應鏈人權管理', impact: 6.8, concern: 7.2, category: 'S' },
  { id: 5, name: '循環經濟與廢棄物', impact: 8.2, concern: 6.5, category: 'E' },
];

export default function MaterialityContent() {
  const [issues, setIssues] = useState(initialIssues);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className=\"p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg\">
              <Target size={24} />
            </div>
            <h1 className=\"text-3xl font-black text-slate-900 tracking-tighter\">重大性評估 Hub</h1>
          </div>
          <p className=\"text-slate-500 font-medium text-sm mt-1\">定義利害關係人關注度與對組織衝擊的核心議題</p>
        </div>
        <div className=\"flex gap-3\">
           <button className=\"px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm\">
              <Save size={16} /> 保存當前矩陣
           </button>
           <button className=\"px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10\">
              <Plus size={16} /> 問卷調查
           </button>
        </div>
      </header>

      <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-10\">
        <div className=\"lg:col-span-8\">
          <div className=\"bg-white p-12 rounded-[4rem] border border-slate-200 shadow-soft-xl relative aspect-square lg:aspect-auto lg:h-[700px] overflow-hidden group\">
            <div className=\"absolute inset-24 border-l-2 border-b-2 border-slate-200 transition-all group-hover:border-slate-300\">
              {/* Labels */}
              <div className=\"absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3\">
                Impact on Organization <ArrowRight size={14} className=\"text-indigo-400\" />
              </div>
              <div className=\"absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3\">
                Stakeholder Concern <ArrowRight size={14} className=\"text-indigo-400\" />
              </div>

              {/* Data Points */}
              {issues.map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  className={`absolute w-10 h-10 rounded-full border-4 border-white shadow-xl cursor-pointer flex items-center justify-center text-[10px] font-black text-white ${
                    issue.category === 'E' ? 'bg-emerald-500' : issue.category === 'S' ? 'bg-blue-500' : 'bg-indigo-500'
                  }`}
                  style={{
                    left: `${issue.impact * 10}%`,
                    bottom: `${issue.concern * 10}%`,
                    transform: 'translate(-50%, 50%)'
                  }}
                >
                  {issue.category}
                  <div className=\"absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-2xl z-50\">
                    {issue.name}
                  </div>
                </motion.div>
              ))}

              {/* High Materiality Zone */}
              <div className=\"absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-50/30 rounded-bl-[5rem] -z-10 border-l border-b border-indigo-100/50 backdrop-blur-sm\" />
            </div>
          </div>
        </div>

        <div className=\"lg:col-span-4 space-y-6\">
          <div className=\"bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden\">
            <h3 className=\"text-xl font-black mb-8 flex items-center gap-3\">
              <ShieldCheck className=\"text-emerald-400\" size={24} /> 5T 重大性實證
            </h3>
            <div className=\"space-y-5 relative z-10\">
               {issues.sort((a, b) => (b.impact + b.concern) - (a.impact + a.concern)).slice(0, 3).map((issue, i) => (
                 <div key={issue.id} className=\"p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all\">
                    <div className=\"flex justify-between items-center mb-1\">
                       <span className=\"text-sm font-bold\">{issue.name}</span>
                       <span className=\"text-[10px] font-black text-indigo-400\">#{i+1}</span>
                    </div>
                    <div className=\"flex items-center gap-2 mt-2\">
                       <div className=\"w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]\" />
                       <span className=\"text-[9px] font-black text-slate-500 uppercase tracking-widest\">Evidence Base: 124 Surveys</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className=\"w-full mt-10 py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg\">
               匯出重大性分析報告
            </button>
          </div>

          <div className=\"bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100\">
             <div className=\"flex items-center gap-2 mb-4\">
                <Users className=\"text-indigo-600\" size={20} />
                <h4 className=\"font-black text-xs text-indigo-900 uppercase tracking-widest\">利害關係人覆蓋率</h4>
             </div>
             <p className=\"text-xs text-indigo-700 leading-relaxed font-medium mb-4\">\n               當前問卷回收已達 82%\uff0c建議增加「供應商」類別的樣本數以提升矩陣公信力。\n             </p>\n             <div className=\"h-2 bg-indigo-200/50 rounded-full overflow-hidden\">\n                <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className=\"h-full bg-indigo-600\" />\n             </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}\n