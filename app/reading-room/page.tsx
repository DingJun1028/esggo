'use client';

import { useState } from 'react';
import ClientLayout from '../ClientLayout';
import { ExternalLink, BookmarkPlus } from 'lucide-react';

const regulations = [
  { id: 1, title: '金管會永續報告書規範', category: '台灣法規', year: 2025, summary: '上市公司永續報告書編製與申報辦法', url: 'https://www.fsc.gov.tw', mandatory: true },
  { id: 2, title: 'GRI Universal Standards 2021', category: '國際標準', year: 2021, summary: 'Global Reporting Initiative 全套揭露準則', url: 'https://www.globalreporting.org', mandatory: false },
  { id: 3, title: 'TCFD 建議框架', category: '國際標準', year: 2023, summary: '氣候相關財務資訊揭露工作組', url: 'https://www.fsb-tcfd.org', mandatory: false },
  { id: 4, title: 'ISSB S1/S2 準則', category: '國際標準', year: 2023, summary: '國際永續準則委員會發布永續揭露標準', url: 'https://www.ifrs.org', mandatory: true },
  { id: 5, title: 'ISSA 5000 確信標準', category: '確信標準', year: 2024, summary: 'ESG 資訊確信全球一致性框架', url: 'https://www.iaasb.org', mandatory: false },
];

const benchmarks = [
  { company: '台積電 TSMC', year: 2023, pages: 287, frameworks: ['GRI', 'TCFD', 'SASB', 'ISSB'], url: 'https://csr.tsmc.com', industry: '半導體' },
  { company: '鴻海 Foxconn', year: 2023, pages: 198, frameworks: ['GRI', 'TCFD', 'SASB'], url: 'https://esg.foxconn.com', industry: '電子製造' },
  { company: '中鋼 CSC', year: 2023, pages: 176, frameworks: ['GRI', 'TCFD'], url: 'https://csr.csc.com.tw', industry: '鋼鐵' },
  { company: '台達電 Delta', year: 2023, pages: 224, frameworks: ['GRI', 'TCFD', 'SASB'], url: 'https://www.deltaww.com', industry: '電子零件' },
  { company: '富邦金控 FuBon', year: 2023, pages: 163, frameworks: ['GRI', 'TCFD'], url: 'https://www.fubon.com', industry: '金融' },
];

const yearbook = [
  { year: 2024, companies: 1850, avgGri: 78, topIssue: 'CBAM 碳邊境調整' },
  { year: 2023, companies: 1720, avgGri: 72, topIssue: 'ISSB S1/S2 揭露' },
  { year: 2022, companies: 1580, avgGri: 65, topIssue: 'TCFD 氣候揭露' },
  { year: 2021, companies: 1340, avgGri: 58, topIssue: 'GRI 2021 更新' },
  { year: 2020, companies: 1190, avgGri: 51, topIssue: '供應鏈韌性' },
];

export default function ReadingRoomPage() {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  return (
    <ClientLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">永續閱覽室 Reading Room</h1>
          <p className="page-subtitle">ESG 法規庫 · 台灣年鑑 · 標竿報告書 · 溯源查閱</p>
        </div>

        <div className="tabs" style={{ marginBottom: 20 }}>
          {[
            { id: 'intelligence', label: '情報中心' },
            { id: 'regulations', label: 'ESG 法規庫' },
            { id: 'yearbook', label: '台灣 ESG 年鑑' },
            { id: 'benchmarks', label: '標竿報告書' },
          ].map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'intelligence' && (
          <div>
            <div className="alert alert-info">
              <span>情報中心整合各大 ESG 法規動態，追蹤最新國際標準更新，協助企業掌握揭露趨勢。</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: '2025 年金管會強制要求第三方確信', date: '2025-05-10', src: '金管會', url: 'https://www.fsc.gov.tw' },
                { title: 'CBAM 2025 年正式計費階段啟動', date: '2025-04-15', src: '歐盟執委會', url: 'https://ec.europa.eu' },
                { title: 'SBTi 企業目標審核機制更新', date: '2025-03-20', src: 'SBTi', url: 'https://sciencebasedtargets.org' },
              ].map((item, i) => (
                <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>來源：{item.src} · {item.date}</div>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <ExternalLink size={12} />查看原文
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'regulations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {regulations.map(r => (
              <div key={r.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span className="badge badge-blue">{r.category}</span>
                      <span className="badge badge-gray">{r.year}</span>
                      {r.mandatory && <span className="badge badge-red">強制揭露</span>}
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700 }}>{r.title}</h3>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-600)' }}>{r.summary}</p>
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <ExternalLink size={12} />查看
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'yearbook' && (
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)' }}>
              <strong>台灣企業 ESG 年鑑 2020-2024</strong>
            </div>
            <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>年度</th>
                    <th>申報企業數</th>
                    <th>平均 GRI 覆蓋率</th>
                    <th>年度重點議題</th>
                    <th>趨勢</th>
                  </tr>
                </thead>
                <tbody>
                  {yearbook.map(y => (
                    <tr key={y.year}>
                      <td style={{ fontWeight: 700, fontSize: 15 }}>{y.year}</td>
                      <td style={{ fontWeight: 600 }}>{y.companies.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${y.avgGri}%` }} />
                          </div>
                          <span style={{ fontSize: 12 }}>{y.avgGri}%</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{y.topIssue}</td>
                      <td><span className="badge badge-green">↑ 成長</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {benchmarks.map((b, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: 15 }}>{b.company}</strong>
                      <span className="badge badge-gray">{b.industry}</span>
                      <span className="badge badge-blue">{b.year}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      {b.frameworks.map(f => <span key={f} className="badge badge-purple">{f}</span>)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                      📄 {b.pages} 頁 · 原始網址：<span style={{ fontFamily: 'monospace', fontSize: 11 }}>{b.url}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexDirection: 'column' }}>
                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      <ExternalLink size={12} />查看報告書
                    </a>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setBookmarks(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      style={{ color: bookmarks.includes(i) ? 'var(--california-gold)' : undefined }}
                    >
                      <BookmarkPlus size={12} />
                      {bookmarks.includes(i) ? '已書籤' : '書籤'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}