'use client';
import { useState } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, BarChart2, Shield, Leaf, Users, Building2, Landmark, Receipt, Scale, ArrowUpRight, CheckCircle2, PieChart, ShieldCheck } from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';

const TCFD_PILLARS = [
  { id: 'governance', title: '治理', icon: <Building2 size={18}/>, desc: '董事會對氣候風險與機會的監督。', completion: 85, items: ['董事會 ESG 審議紀錄', '氣候報告職責'] },
  { id: 'strategy', title: '策略', icon: <TrendingUp size={18}/>, desc: '對業務、策略及財務規劃的實質性影響。', completion: 72, items: ['1.5°C 情境分析', '碳價格影響'] },
  { id: 'risk', title: '風險管理', icon: <AlertTriangle size={18}/>, desc: '組織識別、評估和管理風險的流程。', completion: 90, items: ['物理風險評估', '壓力測試'] },
  { id: 'metrics', title: '指標與目標', icon: <BarChart2 size={18}/>, desc: '用以評估風險與機會的具體指標。', completion: 78, items: ['GRI 305 GHG', 'SBTi 目標'] },
];

const ESG_ROI = [
  { initiative: '太陽能屋頂安裝', investment: 5000000, annualSaving: 800000, carbonReduction: 120, roi: 16, year: 2022 },
  { initiative: 'LED 全面升級', investment: 800000, annualSaving: 200000, carbonReduction: 30, roi: 25, year: 2023 },
  { initiative: '廢水回收系統', investment: 2000000, annualSaving: 350000, carbonReduction: 15, roi: 17.5, year: 2023 },
  { initiative: '綠色供應鏈轉型', investment: 3000000, annualSaving: 500000, carbonReduction: 85, roi: 16.7, year: 2024 },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('tcfd');

  const pageConfig: UniversalPageConfig = {
    id: 'finance-hub',
    title: '永續財務 Finance Hub',
    subtitle: 'TCFD 四大支柱 · ESG ROI 分析 · 碳風險情境：將永續指標轉化為企業財務決策的主權語言。',
    icon: <Landmark size={32} />,
    griReference: 'TCFD / ISSB S2',
    activeT5Tags: ['T1', 'T2', 'T5'],
    primaryActions: [
      { id: 'export', label: '財務影響報告', icon: <BarChart2 size={16}/>, onClick: () => alert('正在生成...') }
    ],
    kpis: [
      { key: 'invest', label: 'ESG 投資總額', value: '1,080', unit: '萬', icon: <DollarSign size={18}/>, color: '#003262' },
      { key: 'save',   label: '年度節省金額', value: '185', unit: '萬', icon: <TrendingUp size={18}/>, color: '#10B981', verified: true },
      { key: 'reduction', label: '碳減量成果', value: '250', unit: 'tCO2e', icon: <Leaf size={18}/>, color: '#3B7EA1', verified: true },
      { key: 'tcfd',   label: 'TCFD 完成率', value: '81', unit: '%', icon: <ShieldCheck size={18}/>, color: '#8B5CF6' },
    ],
    sections: [
      {
        id: 'tabs',
        title: '分析維度',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'tcfd', label: 'TCFD 揭露', icon: <Shield size={16}/> },
              { id: 'roi',  label: 'ROI 分析', icon: <PieChart size={16}/> },
              { id: 'risk', label: '碳風險',   icon: <AlertTriangle size={16}/> },
            ]}
          />
        )
      },
      {
        id: 'content',
        title: activeTab === 'tcfd' ? 'TCFD 四大支柱' : activeTab === 'roi' ? 'ESG 投資回報率' : '碳風險情境評估',
        columns: 12,
        component: (
          <div className="fade-in">
            {activeTab === 'tcfd' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {TCFD_PILLARS.map(p => (
                   <BrandCard key={p.id} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group">
                      <div className="flex items-center gap-4 mb-6">
                         <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003262] group-hover:scale-110 transition-transform shadow-sm">
                            {p.icon}
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-[#003262] uppercase tracking-widest">{p.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Completion {p.completion}%</p>
                         </div>
                      </div>
                      <BrandProgress value={p.completion} size="sm" color={p.completion >= 85 ? 'green' : 'blue'} animated className="mb-6" />
                      <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 line-clamp-2">{p.desc}</p>
                      <div className="space-y-2 pt-4 border-t border-slate-50">
                         {p.items.map((item, i) => (
                           <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                              <CheckCircle2 size={10} className="text-emerald-500" /> {item}
                           </div>
                         ))}
                      </div>
                   </BrandCard>
                 ))}
              </div>
            )}

            {activeTab === 'roi' && (
              <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
                <BrandTable 
                  columns={[
                    { label: 'ESG 投資項目', key: 'initiative' },
                    { label: '投資金額 (NT$)', key: 'investment' },
                    { label: '年度節省 (NT$)', key: 'annualSaving' },
                    { label: '碳減量 (tCO2e)', key: 'carbonReduction' },
                    { label: 'ROI (%)', key: 'roi' },
                    { label: '年度', key: 'year' },
                  ]}
                  data={ESG_ROI.map(r => ({
                    ...r,
                    initiative: <span className="font-bold text-[#003262]">{r.initiative}</span>,
                    investment: <span className="font-mono text-slate-500 font-bold">{r.investment.toLocaleString()}</span>,
                    annualSaving: <span className="font-mono text-emerald-600 font-black">{r.annualSaving.toLocaleString()}</span>,
                    roi: <BrandBadge variant={r.roi >= 20 ? 'success' : 'info'} size="xs" className="font-black">{r.roi}%</BrandBadge>,
                    year: <span className="text-slate-300 font-mono text-[11px] font-black">{r.year}</span>
                  }))}
                />
              </BrandCard>
            )}

            {activeTab === 'risk' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {[
                   { scenario: '1.5°C 情境', impact: '低影響', cost: '120萬/年', risk: '中等', color: '#10B981', note: '符合 SBTi 目標，財務衝擊最小。' },
                   { scenario: '2.0°C 情境', impact: '中度影響', cost: '250萬/年', risk: '高', color: '#FDB515', note: '需加速減碳投資，碳稅支出增加。' },
                   { scenario: '4.0°C 情境', impact: '嚴重影響', cost: '580萬/年', risk: '極高', color: '#EF4444', note: '廠房物理風險、供應鏈斷鏈、碳稅重壓。' },
                 ].map((s, i) => (
                   <BrandCard key={i} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-2xl transition-all duration-500 group">
                      <div className="flex items-center justify-between mb-6">
                         <h4 className="text-xl font-black tracking-tight" style={{ color: s.color }}>{s.scenario}</h4>
                         <BrandBadge variant="outline" size="xs" style={{ color: s.color, borderColor: `${s.color}30` }}>{s.impact}</BrandBadge>
                      </div>
                      <div className="space-y-3 mb-8">
                         {[
                           { label: '碳成本預估', value: s.cost },
                           { label: '轉型風險等級', value: s.risk }
                         ].map((m, j) => (
                           <div key={j} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-transparent group-hover:border-slate-100 transition-all">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                              <span className="text-sm font-black text-[#003262]">{m.value}</span>
                           </div>
                         ))}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium italic p-5 rounded-2xl" style={{ backgroundColor: `${s.color}08` }}>
                         {s.note}
                      </p>
                   </BrandCard>
                 ))}
              </div>
            )}
          </div>
        )
      }
    ],
    features: { useAuditLog: true }
  };

  return <StandardPage config={pageConfig} />;
}
