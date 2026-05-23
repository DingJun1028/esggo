'use client';
import { useState } from 'react';
import { AlertTriangle, BookOpen, Bookmark, ExternalLink, Search, BarChart2, Globe, Zap } from 'lucide-react';
import { BrandButton, BrandBadge } from '../../components/brand';

const newsItems = [
  { id: 1, title: '金管會發布上市櫃公司永續報告書新規範，2025年全面適用', category: '法規動態', impact: 'high', date: '2025-05-10', source: '金管會', url: 'https://www.fsc.gov.tw', tags: ['GRI 2021', 'ISSB', '金管會'], summary: '金管會宣布修訂永續報告書指引，要求上市公司依 GRI 2021 及 ISSB S1/S2 雙軌揭露，並需第三方確信。' },
  { id: 2, title: 'CBAM 碳邊境調整機制正式生效，台灣出口商須準備碳足跡文件', category: '碳政策', impact: 'high', date: '2025-05-08', source: '歐盟執委會', url: 'https://taxation-customs.ec.europa.eu', tags: ['CBAM', '碳邊境', 'EU'], summary: 'EU CBAM 第一階段對鋼鐵、鋁、水泥課徵碳關稅，台灣供應商須建立碳足跡追蹤機制。' },
  { id: 3, title: 'SBTi 正式採納 ISSB S2 氣候相關揭露標準', category: '國際標準', impact: 'medium', date: '2025-05-06', source: 'SBTi', url: 'https://sciencebasedtargets.org', tags: ['SBTi', 'ISSB S2', 'Scope 3'], summary: '科學基礎減碳倡議組織宣布與 ISSB S2 接軌，要求企業提供更嚴謹的 Scope 3 排放數據。' },
  { id: 4, title: 'ISSA 5000 永續確信標準發布，強化第三方查證要求', category: '確信標準', impact: 'medium', date: '2025-05-03', source: 'IAASB', url: 'https://www.iaasb.org', tags: ['ISSA 5000', 'ESG 確信'], summary: '國際審計與確信準則委員會發布 ISSA 5000，為 ESG 資訊確信建立全球一致性框架。' },
  { id: 5, title: '台灣 2024 年企業 ESG 評比結果出爐，製造業表現顯著提升', category: '產業動態', impact: 'low', date: '2025-04-28', source: 'TAISE', url: 'https://www.taise.org.tw', tags: ['台灣', 'ESG 評比', 'TAISE'], summary: '台灣永續能源研究基金會發布年度企業永續獎名單，製造業環境績效改善幅度最大。' },
];

const benchmarks = [
  { company: '台積電', industry: '半導體', eScore: 92, sScore: 88, gScore: 94, overall: 91, certified: true },
  { company: '鴻海精密', industry: '電子製造', eScore: 78, sScore: 82, gScore: 85, overall: 82, certified: true },
  { company: '台達電子', industry: '電子零組件', eScore: 88, sScore: 79, gScore: 87, overall: 85, certified: false },
  { company: '中鋼公司', industry: '鋼鐵', eScore: 71, sScore: 84, gScore: 80, overall: 78, certified: false },
];

const riskAlerts = [
  { level: 'critical', title: '漂綠風險預警', desc: '偵測到模糊承諾語句，建議改為具體量化目標', gri: 'GRI 2-22' },
  { level: 'high', title: 'Scope 3 數據缺漏', desc: '供應鏈碳排放尚未納入盤查，2025年強制揭露', gri: 'GRI 305-3' },
  { level: 'medium', title: '第三方確信未完成', desc: '建議完成 ISSA 5000 確信程序', gri: 'ISSA 5000' },
  { level: 'low', title: 'DEI 數據揭露不足', desc: '多元指標揭露僅達 60%，建議補充性別薪酬比', gri: 'GRI 405-2' },
];

const impactColor: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const levelColor: Record<string, string> = { critical: '#7c3aed', high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const categories = ['全部', '法規動態', '碳政策', '國際標準', '確信標準', '產業動態'];

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('news');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('全部');
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const filtered = newsItems.filter(item => {
    const matchS = item.title.includes(searchTerm) || item.summary.includes(searchTerm);
    const matchC = selectedCat === '全部' || item.category === selectedCat;
    return matchS && matchC;
  });
  const toggleBookmark = (id: number) => setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  const stats = [
    { label: '情報總數', value: newsItems.length, color: '#003262' },
    { label: '高衝擊', value: newsItems.filter(n => n.impact === 'high').length, color: '#ef4444' },
    { label: '風險警示', value: riskAlerts.length, color: '#f59e0b' },
    { label: '已書籤', value: bookmarked.length, color: '#22c55e' },
  ];

  return (
    <div className="page-container fade-in pb-6">
      <header className="page-header-bar mb-3">
        <div className="flex items-center gap-3">
          <div className="t5-micro-strip flex-shrink-0">
            {['T1','T2','T3','T4','T5'].map(t => <span key={t} className="t5-dot bg-[#003262]" />)}
          </div>
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-[#003262]/70 flex-shrink-0" />
            <h1 className="page-header-title">商情中心 Intelligence Hub</h1>
          </div>
          <BrandBadge variant="gold" size="xs" className="hidden sm:flex font-black tracking-widest">ESG-INT</BrandBadge>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-white/80 focus:outline-none focus:ring-1 focus:ring-[#003262]/20 w-44"
              placeholder="搜尋情報、法規..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </header>

      <div className="kpi-bar mb-3">
        {stats.map(s => (
          <div key={s.label} className="kpi-bar-cell">
            <span className="kpi-bar-label">{s.label}</span>
            <span className="kpi-bar-value" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="bento">
        {/* Main Content 9 cols */}
        <div className="col-span-12 lg:col-span-9">
          <div className="section-card">
            <div className="section-card-header flex-wrap gap-2">
              <div className="flex items-center gap-1">
                {[{ key: 'news', label: '情報中心', icon: <Globe size={12}/> }, { key: 'benchmark', label: '產業標竿', icon: <BarChart2 size={12}/> }, { key: 'risk', label: '風險預警', icon: <AlertTriangle size={12}/> }].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${activeTab === tab.key ? 'bg-[#003262] text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                    {tab.icon}{tab.label}
                  </button>
                ))}
              </div>
              {activeTab === 'news' && (
                <div className="flex gap-1 flex-wrap">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCat(cat)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all ${selectedCat === cat ? 'bg-[#003262] text-white border-[#003262]' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="section-card-body">
              {activeTab === 'news' && (
                <div className="space-y-2">
                  {filtered.map(item => (
                    <div key={item.id} className="glass-panel p-3 flex gap-3" style={{ borderLeft: `3px solid ${impactColor[item.impact]}` }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded" style={{ background: `${impactColor[item.impact]}15`, color: impactColor[item.impact] }}>
                            {item.impact === 'high' ? '高衝擊' : item.impact === 'medium' ? '中等' : '低'}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                          <span className="text-[9px] text-slate-300 font-mono">{item.date}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 leading-snug mb-1">{item.title}</h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">{item.summary}</p>
                        <div className="flex gap-1 flex-wrap">
                          {item.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] text-slate-500 font-medium">{tag}</span>)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button onClick={() => toggleBookmark(item.id)} className="p-1 rounded hover:bg-slate-100 transition-colors">
                          <Bookmark size={13} fill={bookmarked.includes(item.id) ? '#FDB515' : 'none'} color={bookmarked.includes(item.id) ? '#FDB515' : '#94a3b8'} />
                        </button>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-slate-100 transition-colors">
                          <ExternalLink size={13} className="text-slate-400" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'benchmark' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {['企業', '產業', 'E環境', 'S社會', 'G治理', '綜合'].map(h => (
                          <th key={h} className="pb-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest pr-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarks.map(b => (
                        <tr key={b.company} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-2 pr-3 font-bold text-slate-800">
                            {b.company}
                            {b.certified && <span className="ml-1.5 px-1 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded border border-emerald-100">認證</span>}
                          </td>
                          <td className="py-2 pr-3 text-slate-500">{b.industry}</td>
                          {[{ v: b.eScore, c: '#22c55e' }, { v: b.sScore, c: '#3b7ea1' }, { v: b.gScore, c: '#FDB515' }].map(({ v, c }, i) => (
                            <td key={i} className="py-2 pr-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${v}%`, background: c }} />
                                </div>
                                <span className="font-mono font-bold text-slate-700">{v}</span>
                              </div>
                            </td>
                          ))}
                          <td className="py-2 font-mono font-black text-base text-[#003262]">{b.overall}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'risk' && (
                <div className="space-y-2">
                  {riskAlerts.map((alert, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg" style={{ borderLeft: `3px solid ${levelColor[alert.level]}`, background: `${levelColor[alert.level]}06` }}>
                      <AlertTriangle size={13} style={{ color: levelColor[alert.level], flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-black uppercase" style={{ color: levelColor[alert.level] }}>
                            {alert.level === 'critical' ? '嚴重' : alert.level === 'high' ? '高風險' : alert.level === 'medium' ? '中等' : '低'}
                          </span>
                          <span className="text-[9px] font-black text-[#003262] font-mono">{alert.gri}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 mb-0.5">{alert.title}</h3>
                        <p className="text-[10px] text-slate-500">{alert.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar 3 cols */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          <div className="section-card">
            <div className="section-card-header"><p className="text-sm font-black text-[#003262]">法規雷達</p></div>
            <div className="section-card-body space-y-2">
              {['金管會 2024 新制', 'CBAM 第一階段', 'ISSB S2 生效', 'ISSA 5000 發布'].map((reg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i < 2 ? 'bg-red-400' : 'bg-blue-400'}`} />
                  <span className="text-[10px] text-slate-600 font-medium">{reg}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="section-card">
            <div className="section-card-header">
              <p className="text-sm font-black text-[#003262]">書籤管理</p>
              <BrandBadge variant="default" size="xs">{bookmarked.length}</BrandBadge>
            </div>
            <div className="section-card-body">
              {bookmarked.length === 0 ? (
                <p className="text-[10px] text-slate-400 text-center py-3">尚無書籤</p>
              ) : (
                <div className="space-y-1.5">
                  {newsItems.filter(n => bookmarked.includes(n.id)).map(n => (
                    <div key={n.id} className="text-[10px] text-slate-600 flex items-start gap-1.5">
                      <Bookmark size={10} className="text-[#FDB515] flex-shrink-0 mt-0.5" fill="#FDB515" />
                      <span className="leading-tight line-clamp-2">{n.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="section-card" style={{ background: '#003262' }}>
            <div className="section-card-body">
              <div className="flex items-center gap-1.5 text-[#FDB515] mb-1.5">
                <Zap size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest text-white">Hermes 快報</span>
              </div>
              <p className="text-[10px] text-blue-100/70 leading-relaxed mb-2">偵測到 2 項高衝擊法規需立即回應，建議優先更新 GRI 305 碳排放揭露章節。</p>
              <BrandButton variant="secondary" fullWidth className="h-7 text-[10px] font-black rounded-lg" onClick={() => setActiveTab('risk')}>
                查看風險預警
              </BrandButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}