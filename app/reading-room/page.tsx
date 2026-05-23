'use client';

import { useState } from 'react';
import { 
  ExternalLink, BookmarkPlus, BookOpen, Newspaper, Landmark, FileText, Globe, Sparkles, RefreshCw, X, ArrowUpRight, CheckCircle2, BookmarkCheck, Search
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandProgress, StandardPage, BrandCardHeader 
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';
import { motion, AnimatePresence } from 'framer-motion';

const regulations = [
  { id: 1, title: '金管會永續報告書規範', category: '台灣法規', year: 2025, summary: '上市公司永續報告書編製與申報辦法', url: 'https://www.fsc.gov.tw', mandatory: true },
  { id: 2, title: 'GRI Universal Standards 2021', category: '國際標準', year: 2021, summary: 'Global Reporting Initiative 全套揭露準則', url: 'https://www.globalreporting.org', mandatory: false },
  { id: 3, title: 'TCFD 建議框架', category: '國際標準', year: 2023, summary: '氣候相關財務資訊揭露工作組', url: 'https://www.fsb-tcfd.org', mandatory: false },
  { id: 4, title: 'ISSB S1/S2 準則', category: '國際標準', year: 2023, summary: '國際永續準則委員會發布永續揭露標準', url: 'https://www.ifrs.org', mandatory: true },
];

const benchmarks = [
  { company: '台積電 TSMC', year: 2023, pages: 287, frameworks: ['GRI', 'TCFD', 'SASB', 'ISSB'], industry: '半導體' },
  { company: '鴻海 Foxconn', year: 2023, pages: 198, frameworks: ['GRI', 'TCFD', 'SASB'], industry: '電子製造' },
  { company: '台達電 Delta', year: 2023, pages: 224, frameworks: ['GRI', 'TCFD', 'SASB'], industry: '電子零件' },
];

const yearbook = [
  { year: 2024, companies: 1850, avgGri: 78, topIssue: 'CBAM 碳邊境調整' },
  { year: 2023, companies: 1720, avgGri: 72, topIssue: 'ISSB S1/S2 揭露' },
  { year: 2022, companies: 1580, avgGri: 65, topIssue: 'TCFD 氣候揭露' },
];

export default function ReadingRoomPage() {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const pageConfig: UniversalPageConfig = {
    id: 'reading-room',
    title: '永續閱覽室 Reading Room',
    subtitle: 'ESG 法規庫 · 台灣年鑑 · 標竿報告書：集中管理永續治理的全球知識產權與合規基準。',
    icon: <BookOpen size={32} />,
    griReference: 'Governance / Knowledge',
    activeT5Tags: ['T1', 'T2'],
    primaryActions: [
      { id: 'search', label: '搜尋全庫', icon: <Search size={16}/>, onClick: () => alert('搜尋中...') }
    ],
    kpis: [
      { key: 'regs', label: '法規標準', value: '154', unit: '項', icon: <Landmark size={18}/>, color: '#003262' },
      { key: 'reports', label: '標竿報告', value: '500', unit: '+', icon: <FileText size={18}/>, color: '#10B981', verified: true },
      { key: 'news', label: '今日情報', value: '12', unit: '條', icon: <Newspaper size={18}/>, color: '#3B7EA1' },
      { key: 'bookmarks', label: '我的收藏', value: bookmarks.length, icon: <BookmarkCheck size={18}/>, color: '#FDB515' },
    ],
    sections: [
      {
        id: 'tabs',
        title: '知識維度',
        columns: 12,
        component: (
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'intelligence', label: '情報中心', icon: <Newspaper size={16}/> },
              { id: 'regulations',  label: '法規庫',   icon: <Landmark size={16}/> },
              { id: 'yearbook',     label: '年鑑統計', icon: <RefreshCw size={16}/> },
              { id: 'benchmarks',   label: '標竿案例', icon: <Globe size={16}/> },
            ]}
          />
        )
      },
      {
        id: 'main',
        title: activeTab === 'intelligence' ? '最新 ESG 情報' : activeTab === 'regulations' ? '合規法規清單' : activeTab === 'yearbook' ? '台灣企業 ESG 年鑑' : '標竿報告書檢索',
        columns: 12,
        component: (
          <div className="fade-in">
             {activeTab === 'intelligence' && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: '2025 年金管會強制第三方確信', date: '2025-05-10', src: '金管會', content: '提升揭露品質，所有上市公司需具備 T5 等級確信報告。' },
                    { title: 'CBAM 正式計費階段啟動', date: '2025-04-15', src: '歐盟執委會', content: '出口導向企業需加速碳排量化與溯源。' },
                    { title: 'SBTi 目標審核機制更新', date: '2025-03-20', src: 'SBTi', content: '1.5°C 路徑成為唯一合規選擇，需即時追蹤進度。' },
                  ].map((item, i) => (
                    <BrandCard key={i} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group">
                       <div className="flex items-center justify-between mb-4">
                          <BrandBadge variant="info" size="xs" className="opacity-60">{item.src}</BrandBadge>
                          <span className="text-[10px] font-bold text-slate-300 font-mono">{item.date}</span>
                       </div>
                       <h4 className="text-lg font-black text-[#003262] mb-3 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h4>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">{item.content}</p>
                       <BrandButton variant="ghost" size="xs" className="w-full justify-between h-10 px-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-100 transition-all">
                          <span className="text-[10px] font-black uppercase tracking-widest">Read_Full_Article</span>
                          <ArrowUpRight size={14}/>
                       </BrandButton>
                    </BrandCard>
                  ))}
               </div>
             )}

             {activeTab === 'regulations' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {regulations.map(r => (
                    <BrandCard key={r.id} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group border-l-4 border-l-[#003262]">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-2">
                             <BrandBadge variant="outline" size="xs" className="opacity-40">{r.category}</BrandBadge>
                             <BrandBadge variant="info" size="xs" className="font-mono">{r.year}</BrandBadge>
                             {r.mandatory && <BrandBadge variant="warning" size="xs" className="font-black">MANDATORY</BrandBadge>}
                          </div>
                       </div>
                       <h4 className="text-xl font-black text-[#003262] mb-2">{r.title}</h4>
                       <p className="text-xs text-slate-500 font-medium mb-8 italic">「{r.summary}」</p>
                       <BrandButton variant="primary" size="sm" className="rounded-xl h-12 font-black" onClick={() => window.open(r.url)}>
                          查看完整條文庫 <ExternalLink size={14} className="ml-2" />
                       </BrandButton>
                    </BrandCard>
                  ))}
               </div>
             )}

             {activeTab === 'yearbook' && (
               <BrandCard padding="none" className="glass-panel border-none shadow-premium overflow-hidden">
                  <BrandTable 
                    columns={[
                      { label: '年度', key: 'year' },
                      { label: '申報企業數', key: 'companies' },
                      { label: 'GRI 覆蓋率', key: 'gri' },
                      { label: '年度重點', key: 'issue' },
                      { label: '主權趨勢', key: 'trend' },
                    ]}
                    data={yearbook.map(y => ({
                      year: <span className="text-2xl font-black text-[#003262] font-mono">{y.year}</span>,
                      companies: <span className="font-bold text-slate-500">{y.companies.toLocaleString()} 家</span>,
                      gri: (
                        <div className="flex items-center gap-3 w-40">
                           <BrandProgress value={y.avgGri} size="xs" color="blue" className="flex-1" />
                           <span className="font-mono text-xs font-black">{y.avgGri}%</span>
                        </div>
                      ),
                      issue: <span className="text-xs font-bold text-slate-600">{y.topIssue}</span>,
                      trend: <BrandBadge variant="success" size="xs" className="font-black">UP_TRENDING</BrandBadge>
                    }))}
                  />
               </BrandCard>
             )}

             {activeTab === 'benchmarks' && (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {benchmarks.map((b, i) => (
                    <BrandCard key={i} padding="lg" className="glass-panel border-none shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform"><FileText size={100} /></div>
                       <h4 className="text-xl font-black text-[#003262] mb-1">{b.company}</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{b.industry} · {b.year} REPORT</p>
                       <div className="flex flex-wrap gap-2 mb-8">
                          {b.frameworks.map(f => <BrandBadge key={f} variant="outline" size="xs" className="opacity-60">{f}</BrandBadge>)}
                       </div>
                       <div className="flex gap-3">
                          <BrandButton variant="primary" className="flex-1 rounded-xl h-12 font-black">View PDF</BrandButton>
                          <BrandButton variant="ghost" className="w-12 h-12 p-0 rounded-xl bg-slate-50 border border-slate-100 hover:text-amber-500" onClick={() => setBookmarks(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}>
                             {bookmarks.includes(i) ? <BookmarkCheck size={20} className="text-amber-500" /> : <BookmarkPlus size={20} />}
                          </BrandButton>
                       </div>
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