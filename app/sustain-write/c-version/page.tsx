'use client';

import { useState, useEffect } from 'react';

interface Company {
  id: string;
  name: string;
  shortName: string;
  industry: string;
}

interface ReportChapter {
  id: string;
  title: string;
  fiveTGate: string;
  content: string;
  wordCount: number;
}

interface FiveTStatus {
  traceable: boolean;
  transparent: boolean;
  tangible: boolean;
  trustworthy: boolean;
  trackable: boolean;
}

interface Report {
  companyId: string;
  companyName: string;
  totalWords: number;
  fiveTStatus: FiveTStatus;
  chapters: ReportChapter[];
  generatedAt: string;
}

const GATE_INFO: Record<string, { name: string; icon: string; color: string }> = {
  traceable: { name: '真', icon: '🔗', color: '#009EB0' },
  transparent: { name: '善', icon: '👁', color: '#219EBC' },
  tangible: { name: '美', icon: '🎨', color: '#D4AF37' },
  trustworthy: { name: '信', icon: '🔒', color: '#FF4D6D' },
  trackable: { name: '通', icon: '📡', color: '#3b82f6' },
};

export default function CVersionReportPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [activeChapter, setActiveChapter] = useState<number>(0);

  useEffect(() => {
    fetch('/api/sustain-write/c-version')
      .then(r => r.json())
      .then(data => {
        if (data.success) setCompanies(data.companies);
      })
      .catch(() => {});
  }, []);

  const generateReport = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const res = await fetch('/api/sustain-write/c-version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: selectedCompany, format: 'html' }),
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.error || '報告生成失敗');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '網路錯誤');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (format: 'html' | 'markdown') => {
    if (!selectedCompany) return;
    window.open(`/api/sustain-write/c-version/download?companyId=${selectedCompany}&format=${format}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-secondary border-b border-borderColor sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold text-textPrimary">ESGGO 永續報告 ∞ Evolution</h1>
              <p className="text-xs text-textSecondary">5T 協議 · OmniTag 萬能標籤 · v3.7</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-accentTeal/10 text-accentTeal border border-accentTeal/30">
              真 → 善 → 美 → 信 → 通
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* 控制面板 */}
        <div className="bg-secondary rounded-2xl shadow-sm border border-borderColor p-6 mb-8">
          <h2 className="text-xl font-bold text-textPrimary mb-4">
            📊 報告生成器
          </h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-textPrimary mb-2">
                選擇企業（10家擬真公司）
              </label>
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-borderColor bg-primary text-textPrimary focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">請選擇公司...</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}（{c.industry}）
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateReport}
              disabled={!selectedCompany || loading}
              className="px-6 py-3 rounded-lg bg-accentTeal text-white font-semibold hover:bg-accentTeal hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '生成中...' : '⚡ 生成報告'}
            </button>
            {report && (
              <div className="flex gap-2">
                <button
                  onClick={() => downloadReport('html')}
                  className="px-4 py-3 rounded-lg border-2 border-accentTeal text-accentTeal font-semibold hover:bg-accentTeal/10 transition-colors"
                >
                  📄 HTML
                </button>
                <button
                  onClick={() => downloadReport('markdown')}
                  className="px-4 py-3 rounded-lg border-2 border-accentTeal text-accentTeal font-semibold hover:bg-accentTeal/10 transition-colors"
                >
                  📝 Markdown
                </button>
              </div>
            )}
          </div>
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* 載入中 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-accentTeal/30 border-t-teal-600 rounded-full animate-spin mb-4"></div>
            <p className="text-textSecondary">正在通過 5T 檢驗門，生成專業報告中...</p>
            <div className="flex justify-center gap-2 mt-4">
              {['真', '善', '美', '信', '通'].map((gate, i) => (
                <span key={gate} className="px-3 py-1 rounded-full text-xs bg-primary border border-borderColor text-textSecondary animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                  {gate}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 報告內容 */}
        {report && !loading && (
          <div className="space-y-6">
            {/* 5T 狀態概覽 */}
            <div className="bg-secondary rounded-2xl shadow-sm border border-borderColor p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-textPrimary">
                  5T 協議合規狀態 — {report.companyName}
                </h3>
                <span className="text-sm text-textSecondary">
                  總字數：{report.totalWords.toLocaleString()} 字
                </span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(report.fiveTStatus).map(([key, passed]) => {
                  const info = GATE_INFO[key];
                  return (
                    <div
                      key={key}
                      className={`text-center p-4 rounded-xl border-2 transition-all ${
                        passed
                          ? 'border-current bg-opacity-5'
                          : 'border-borderColor bg-primary opacity-50'
                      }`}
                      style={{ borderColor: passed ? info.color : undefined }}
                    >
                      <div className="text-2xl mb-1">{info.icon}</div>
                      <div className="font-bold text-lg" style={{ color: passed ? info.color : '#94a3b8' }}>
                        {info.name}
                      </div>
                      <div className="text-xs text-textSecondary mt-1">
                        {passed ? '已通過' : '待驗證'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 章節導航 */}
            <div className="bg-secondary rounded-2xl shadow-sm border border-borderColor p-4">
              <div className="flex gap-2 overflow-x-auto">
                {report.chapters.map((ch, i) => {
                  const info = GATE_INFO[ch.fiveTGate];
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChapter(i)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        activeChapter === i
                          ? 'text-white shadow-md'
                          : 'bg-primary border border-borderColor text-textSecondary hover:bg-secondary border border-borderColor'
                      }`}
                      style={{
                        backgroundColor: activeChapter === i ? info.color : undefined,
                      }}
                    >
                      {info.name} {ch.title.replace(/第[一二三四五六七八九十]+章：/, '').split('（')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 章節內容 */}
            {report.chapters[activeChapter] && (
              <div className="bg-secondary rounded-2xl shadow-sm border border-borderColor p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: GATE_INFO[report.chapters[activeChapter].fiveTGate].color }}
                  >
                    {GATE_INFO[report.chapters[activeChapter].fiveTGate].name}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-textPrimary">
                      {report.chapters[activeChapter].title}
                    </h2>
                    <p className="text-sm text-textSecondary">
                      {report.chapters[activeChapter].wordCount} 字 · OmniTag 已驗證
                    </p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  {report.chapters[activeChapter].content.split('\n\n').map((para, pi) => {
                    if (para.startsWith('### ')) {
                      return <h3 key={pi} className="text-lg font-bold text-textPrimary mt-6 mb-3">{para.replace('### ', '')}</h3>;
                    }
                    if (para.startsWith('[OmniTag:')) {
                      const text = para.replace(/\[OmniTag:[^\]]+\]\s*/, '');
                      return (
                        <p key={pi} className="mb-4 text-textPrimary leading-relaxed">
                          <span className="inline-block bg-secondary text-accentTeal px-2 py-0.5 rounded text-xs font-mono mr-2">
                            {para.match(/\[OmniTag:([^\]]+)\]/)?.[1].substring(0, 8)}
                          </span>
                          {text}
                        </p>
                      );
                    }
                    if (para.startsWith('- [x]')) {
                      const items = para.split('\n');
                      return (
                        <div key={pi} className="bg-green-50 border border-green-200 rounded-xl p-4 my-4">
                          <ul className="space-y-1">
                            {items.filter(i => i.trim()).map((item, ii) => (
                              <li key={ii} className="text-sm text-green-800 flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                {item.replace('- [x] ', '')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    if (para.trim()) {
                      return <p key={pi} className="mb-4 text-textPrimary leading-relaxed text-justify">{para}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* 頁腳 */}
            <div className="text-center py-6 text-sm text-textSecondary">
              <p>報告生成時間：{report.generatedAt}</p>
              <p className="mt-1">ESGGO 善向永續 · C版專業永續報告系統 v3.7 · 5T 真善美信通</p>
            </div>
          </div>
        )}

        {/* 空狀態 */}
        {!report && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">選擇企業開始生成報告</h3>
            <p className="text-textSecondary max-w-md mx-auto">
              本系統包含 10 家擬真企業的完整 ESG 資料，涵蓋 140 題專業題庫與 1400 筆高擬真填答。
              選擇企業後，系統將自動通過 5T 檢驗（真→善→美→信→通），生成專業永續報告。
            </p>
          </div>
        )}
      </main>
    </div>
  );
}