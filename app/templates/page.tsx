'use client';
import { useState } from 'react';
import ClientLayout from '../ClientLayout';
import { Layers, ChevronRight, FileText, Calculator, CheckCircle } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'ifrs-s2',
    title: 'IFRS S2 氣候財務衝擊模板',
    gri: 'IFRS S2 / TCFD',
    standard: '2026 財務揭露標準',
    category: 'E',
    isFutureReady: true,
    fields: [
      { name: '過渡風險估值 (碳稅/法規)', unit: 'TWD', formula: 'Σ(排放量 × 預估碳價 2026)' },
      { name: '實體風險資產佔比', unit: '%', formula: '受極端天氣影響資產 ÷ 總資產' },
      { name: '氣候機會投資收益', unit: 'TWD', formula: '低碳產品營收 + 節能專案節省' },
    ],
    docs: ['氣候風險財務評估報告', '資產地理清冊', '碳價情境分析表'],
  },
  {
    id: 'scope3-granular',
    title: '範疇三：供應鏈深度細分',
    gri: 'GRI 305-3 (v2026)',
    standard: 'ISO 14064-1:2018',
    category: 'E',
    isFutureReady: true,
    fields: [
      { name: '類別 1: 購買商品與服務', unit: 'tCO₂e', formula: '採購金額 × 行業平均係數' },
      { name: '類別 4: 上游運輸與配送', unit: 'tCO₂e', formula: '貨運噸公里 × 運輸工具係數' },
      { name: '類別 6: 商務差旅 (高精度)', unit: 'tCO₂e', formula: '飛行里程 × 艙等係數' },
    ],
    docs: ['供應商碳足跡聲明', '物流運輸日誌', '差旅管理系統導出'],
  },
  {
    id: 'ghg',
    title: 'GHG 溫室氣體盤查模板',
    gri: 'GRI 305-1~305-5',
    standard: 'ISO 14064-1',
    category: 'E',
    fields: [
      { name: '範疇一直接排放量', unit: 'tCO₂e', formula: 'Σ(活動量 × 排放係數)' },
      { name: '範疇二間接排放量', unit: 'tCO₂e', formula: '用電量(kWh) × 台電排放係數(0.494)' },
      { name: '範疇三其他間接排放', unit: 'tCO₂e', formula: '依 WRI/WBCSD 方法學' },
    ],
    docs: ['ISO 14064-1 盤查清冊', '查證聲明書', '冷媒填充紀錄', '台電帳單'],
  },
  {
    id: 'governance',
    title: '治理架構：主權合規 v2',
    gri: 'GRI 2-9~2-21',
    standard: '2026 TWSE 治理規範',
    category: 'G',
    isFutureReady: true,
    fields: [
      { name: '董事會獨立性評分', unit: 'pt', formula: '獨立董事權重係數分析' },
      { name: '資安委員會運作頻率', unit: '次/年', formula: '會議紀錄計數' },
      { name: '永續連結薪酬佔比', unit: '%', formula: 'ESG KPI 連結獎金 ÷ 總獎金' },
    ],
    docs: ['董事會名冊', '資安管理規範', '酬金委員會報告'],
  },
];

export default function TemplatesPage() {
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('全部');

  const filtered = TEMPLATES.filter(t => filter === '全部' || t.category === filter);
  const CAT_COLORS: Record<string, string> = { E: '#10B981', S: '#3B7EA1', G: '#8B5CF6' };

  return (
    <ClientLayout>
      <div className="page-header">
        <div className="flex items-center gap-4 mb-2">
           <div className="w-12 h-12 rounded-2xl bg-[#003262] flex items-center justify-center shadow-lg">
              <Layers size={24} className="text-[#FDB515]" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-[#003262] tracking-tight uppercase italic">Sovereign_Compliance_Templates</h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.25em]">2026 Ready · IFRS S1/S2 Integration · 5T Verified</p>
           </div>
        </div>
        <div className="page-header-meta mt-6">
          <span className="px-3 py-1 bg-[#FDB515]/10 text-[#FDB515] border border-[#FDB515]/20 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
             System Evolution Active
          </span>
          <span className="badge badge-blue">{TEMPLATES.length} 核心模板</span>
        </div>
      </div>

      {!selected ? (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-8">
            {['全部', 'E', 'S', 'G'].map(c => (
              <button 
                key={c} 
                className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all border ${filter === c ? 'bg-[#003262] text-white border-[#003262] shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'}`} 
                onClick={() => setFilter(c)}
              >
                {c === '全部' ? 'ALL_MODULES' : `${c}_CATEGORY`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <div 
                key={t.id} 
                className="group bg-white/70 backdrop-blur-xl border border-white p-6 rounded-[32px] shadow-premium hover:shadow-extreme hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden" 
                onClick={() => setSelected(t)}
              >
                {t.isFutureReady && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-l from-[#FDB515] to-[#f4a100] text-[#003262] text-[9px] font-black uppercase tracking-widest rounded-bl-2xl shadow-sm">
                    2026_Ready
                  </div>
                )}
                
                <div className="flex gap-4 mb-6">
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: CAT_COLORS[t.category] + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={22} style={{ color: CAT_COLORS[t.category] }} />
                  </div>
                  <div>
                    <div className="font-black text-slate-800 leading-tight mb-1">{t.title}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.standard}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-400">{t.gri}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black" style={{ background: CAT_COLORS[t.category] + '15', color: CAT_COLORS[t.category] }}>{t.category}</span>
                </div>

                <div className="text-[11px] font-bold text-slate-500 mb-6 flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-slate-300" /> {t.fields.length} INDICATORS
                   <div className="w-1 h-1 rounded-full bg-slate-300" /> {t.docs.length} EVIDENCE_DOCS
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="inline-flex items-center gap-1.5 text-[#10B981] text-[10px] font-black uppercase tracking-tighter">
                     <CheckCircle size={12} /> Auto_Compute_Active
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#003262] group-hover:text-[#FDB515] transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-400 hover:text-[#003262] hover:border-blue-200 transition-all mb-8 shadow-sm" 
            onClick={() => setSelected(null)}
          >
            <ChevronRight size={14} className="rotate-180" /> BACK_TO_SOVEREIGN_REGISTRY
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 backdrop-blur-2xl border border-white p-10 rounded-[48px] shadow-extreme">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-[#003262] mb-1">{selected.title}</h2>
                    <span className="px-3 py-1 bg-[#003262]/5 border border-[#003262]/10 rounded-lg text-[10px] font-black text-[#003262] uppercase tracking-widest">{selected.gri}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol_Status</p>
                    <div className="flex items-center gap-2 text-[#10B981] font-black text-sm">
                       <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> SEAL_READY
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {selected.fields.map((f, i) => (
                    <div key={i} className="group">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                        {f.name} <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-400 ml-2">{f.unit}</span>
                      </label>
                      <div className="relative">
                         <input 
                           className="w-full bg-slate-50/50 border border-slate-100 p-5 rounded-2xl text-base font-black text-[#003262] focus:bg-white focus:border-[#003262] focus:ring-8 focus:ring-blue-500/5 transition-all outline-none" 
                           value={formValues[f.name] || ''} 
                           onChange={e => setFormValues(p => ({ ...p, [f.name]: e.target.value }))} 
                           placeholder="0.00" 
                         />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm text-[10px] font-black text-slate-400">
                            <Calculator size={12} className="text-blue-500" />
                            <code className="opacity-60">{f.formula}</code>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-10 border-t border-slate-50 flex gap-4">
                  <button className="flex-1 h-14 bg-[#003262] text-[#FDB515] rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                    Apply_to_SustainWrite
                  </button>
                  <button className="px-8 h-14 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
                    Export_CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
                <h3 className="text-[#FDB515] font-black text-xs uppercase tracking-[0.3em] mb-8">Verification_Evidence</h3>
                <div className="space-y-4">
                  {selected.docs.map((d, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FDB515] group-hover:scale-110 transition-transform flex-shrink-0">
                         <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white text-xs font-bold leading-tight mb-1 truncate">{d}</div>
                        <div className="flex items-center gap-2">
                           <span className="px-1.5 py-0.5 bg-[#FDB515]/20 text-[#FDB515] rounded text-[8px] font-black uppercase">Required</span>
                           <span className="text-white/20 text-[8px] font-black">T2_Protocol</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl">
                   <p className="text-blue-300 text-[10px] font-black leading-relaxed">
                      💡 提示：上傳以上文件後，系統將自動啟動 5T 封印流程。根據 2026 IFRS 規範，所有氣候財務數據必須具備此密碼學誠信證明。
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
    </ClientLayout>
  );
}