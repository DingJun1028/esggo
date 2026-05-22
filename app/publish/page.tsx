'use client';

import { useState } from 'react';
import ClientLayout from '../ClientLayout';
import { Download, Shield, FileText, CheckCircle, Clock, X } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  year: number;
  status: 'draft' | 'reviewing' | 'published';
  framework: string[];
  pageCount: number;
  griCoverage: number;
  zkpVerified: boolean;
  createdAt: string;
}

const mockReports: Report[] = [
  { id: '1', title: '2024 永續報告書', year: 2024, status: 'draft', framework: ['GRI 2021', 'TCFD', 'SASB'], pageCount: 156, griCoverage: 78, zkpVerified: false, createdAt: new Date().toISOString() },
  { id: '2', title: '2023 永續報告書', year: 2023, status: 'published', framework: ['GRI 2021', 'TCFD'], pageCount: 143, griCoverage: 71, zkpVerified: true, createdAt: new Date(Date.now() - 31536000000).toISOString() },
];

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  draft: { label: '草稿', badge: 'badge-gray' },
  reviewing: { label: '審核中', badge: 'badge-gold' },
  published: { label: '已發布', badge: 'badge-green' },
};

const CHAPTERS = [
  { id: '1', title: '一、組織概況', ready: true },
  { id: '2', title: '二、治理架構', ready: true },
  { id: '3', title: '三、重大性評估', ready: true },
  { id: '4', title: '四、環境績效', ready: false },
  { id: '5', title: '五、社會績效', ready: false },
  { id: '6', title: '六、公司治理', ready: true },
  { id: '7', title: '七、前瞻展望', ready: false },
];

export default function PublishPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [activeTab, setActiveTab] = useState('list');
  const [sealing, setSealing] = useState<string | null>(null);
  const [sealProgress, setSealProgress] = useState(0);
  const [selected, setSelected] = useState<Report | null>(null);

  const sealReport = async (r: Report) => {
    setSealing(r.id);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(res => setTimeout(res, 150));
      setSealProgress(i);
    }
    setReports(prev => prev.map(rep => rep.id === r.id ? { ...rep, zkpVerified: true, status: 'reviewing' } : rep));
    setSealing(null);
    setSealProgress(0);
  };

  const readyCount = CHAPTERS.filter(c => c.ready).length;

  return (
    <ClientLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">報告發布 Report Publisher</h1>
          <p className="page-subtitle">永續報告書生成 · ZKP 認證 · 5T 完整性封印</p>
        </div>

        <div className="tabs" style={{ marginBottom: 20 }}>
          {[
            { id: 'list', label: '報告列表' },
            { id: 'chapters', label: '章節進度' },
            { id: 'preview', label: 'A4 預覽' },
          ].map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reports.map(r => {
              const status = STATUS_MAP[r.status];
              return (
                <div key={r.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{r.title}</h3>
                        <span className={`badge ${status.badge}`}>{status.label}</span>
                        {r.zkpVerified && <span className="badge badge-purple">ZKP ✓</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                        {r.framework.map(f => <span key={f} className="badge badge-blue">{f}</span>)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', gap: 16 }}>
                        <span>📄 {r.pageCount} 頁</span>
                        <span>GRI 覆蓋率 {r.griCoverage}%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(r); setActiveTab('preview'); }}>
                        <FileText size={12} />預覽
                      </button>
                      {!r.zkpVerified && (
                        <button
                          className="btn btn-gold btn-sm"
                          onClick={() => sealReport(r)}
                          disabled={sealing === r.id}
                        >
                          {sealing === r.id ? <Clock size={12} /> : <Shield size={12} />}
                          {sealing === r.id ? `封印中 ${sealProgress}%` : 'ZKP 封印'}
                        </button>
                      )}
                      {r.status === 'reviewing' && (
                        <button className="btn btn-primary btn-sm">
                          <CheckCircle size={12} />發布
                        </button>
                      )}
                      {r.zkpVerified && (
                        <button className="btn btn-outline btn-sm">
                          <Download size={12} />下載
                        </button>
                      )}
                    </div>
                  </div>
                  {sealing === r.id && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 6 }}>ZKP 零知識證明封印中...</div>
                      <div className="progress-bar">
                        <div className="progress-fill gold" style={{ width: `${sealProgress}%`, transition: 'width 0.1s' }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'chapters' && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">章節就緒度</h3>
              <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{readyCount}/{CHAPTERS.length} 章節已完成</span>
            </div>
            <div className="progress-bar" style={{ marginBottom: 20 }}>
              <div className="progress-fill green" style={{ width: `${(readyCount / CHAPTERS.length) * 100}%` }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CHAPTERS.map(ch => (
                <div key={ch.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 8,
                  border: `1px solid ${ch.ready ? 'var(--success)' : 'var(--gray-200)'}`,
                }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{ch.title}</span>
                  <span className={`badge ${ch.ready ? 'badge-green' : 'badge-gold'}`}>
                    {ch.ready ? '✓ 完成' : '進行中'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 595, background: 'white', boxShadow: 'var(--shadow-lg)', minHeight: 842,
              fontFamily: 'Inter, sans-serif', border: '1px solid var(--gray-200)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              {/* Cover */}
              <div style={{ background: 'var(--berkeley-blue)', padding: '60px 50px', color: 'white', minHeight: 280 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.7, marginBottom: 20, textTransform: 'uppercase' }}>
                  Berkeley Haas × TSISDA · 5T 誠信協議 · GRI 2021
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, margin: '0 0 16px' }}>
                  善向永續<br />2024 永續報告書
                </h1>
                <div style={{ fontSize: 13, opacity: 0.8 }}>Sustainability Report</div>
                <div style={{ marginTop: 40, padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { k: '報告範疇', v: 'GRI 2021 全套框架' },
                      { k: '確信等級', v: 'Limited Assurance' },
                      { k: '基準年', v: '2020' },
                      { k: '報告年度', v: '2024' },
                    ].map(item => (
                      <div key={item.k}>
                        <div style={{ opacity: 0.6, fontSize: 10 }}>{item.k}</div>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                  {['GRI 2021', 'TCFD', 'SASB', 'ISSB'].map(f => (
                    <span key={f} style={{ padding: '3px 8px', background: 'var(--california-gold)', color: 'var(--berkeley-blue)', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: '40px 50px' }}>
                <h2 style={{ color: 'var(--berkeley-blue)', fontSize: 18, borderBottom: '2px solid var(--california-gold)', paddingBottom: 8 }}>目錄</h2>
                {CHAPTERS.map(ch => (
                  <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 13 }}>
                    <span>{ch.title}</span>
                    <span style={{ color: 'var(--gray-400)' }}>── {Math.floor(Math.random() * 20) + 10}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}