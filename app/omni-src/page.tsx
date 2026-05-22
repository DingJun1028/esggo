'use client';
import { useState, useEffect } from 'react';
import {
  FileText, Zap, BarChart3, CheckCircle, AlertTriangle,
  Clock, Download, Play, RefreshCw, ChevronRight, Star,
  BookOpen, Shield, Leaf, Users, Building, TrendingUp,
  Search, Filter, Eye, Lock, Unlock, Globe, Award,
  Target, Calendar, Bell, Info, ChevronDown, ChevronUp,
  Layers, Database, Cpu, Activity, ArrowRight, Hash
} from 'lucide-react';

const GRI_CHAPTERS = [
  { id: 1, code: 'GRI 2', title: '一般揭露', pages: 45, status: 'ready', coverage: 92 },
  { id: 2, code: 'GRI 3', title: '重大主題', pages: 28, status: 'ready', coverage: 88 },
  { id: 3, code: 'GRI 201', title: '經濟績效', pages: 32, status: 'ready', coverage: 85 },
  { id: 4, code: 'GRI 202', title: '市場地位', pages: 18, status: 'in_progress', coverage: 72 },
  { id: 5, code: 'GRI 203', title: '間接經濟衝擊', pages: 22, status: 'ready', coverage: 90 },
  { id: 6, code: 'GRI 301', title: '原物料', pages: 25, status: 'ready', coverage: 87 },
  { id: 7, code: 'GRI 302', title: '能源', pages: 38, status: 'ready', coverage: 95 },
  { id: 8, code: 'GRI 303', title: '水資源', pages: 30, status: 'ready', coverage: 83 },
  { id: 9, code: 'GRI 304', title: '生物多樣性', pages: 20, status: 'in_progress', coverage: 65 },
  { id: 10, code: 'GRI 305', title: '排放', pages: 42, status: 'ready', coverage: 96 },
  { id: 11, code: 'GRI 306', title: '廢棄物', pages: 28, status: 'ready', coverage: 89 },
  { id: 12, code: 'GRI 401', title: '就業', pages: 35, status: 'ready', coverage: 91 },
  { id: 13, code: 'GRI 403', title: '職業安全衛生', pages: 40, status: 'ready', coverage: 94 },
  { id: 14, code: 'GRI 404', title: '訓練與教育', pages: 25, status: 'in_progress', coverage: 78 },
  { id: 15, code: 'GRI 405', title: '多元化與平等機會', pages: 22, status: 'ready', coverage: 86 },
  { id: 16, code: 'GRI 413', title: '當地社區', pages: 20, status: 'in_progress', coverage: 70 },
  { id: 17, code: 'GRI 418', title: '客戶隱私', pages: 18, status: 'ready', coverage: 82 },
];

const FRAMEWORKS = [
  { id: 'gri', name: 'GRI 2021', color: '#003262', icon: Globe, coverage: 94, indicators: 97 },
  { id: 'sasb', name: 'SASB 2.0', color: '#3b7ea1', icon: BarChart3, coverage: 78, indicators: 45 },
  { id: 'tcfd', name: 'TCFD', color: '#b9d9eb', icon: TrendingUp, coverage: 85, indicators: 11 },
  { id: 'ifrs_s1', name: 'IFRS S1', color: '#FDB515', icon: Shield, coverage: 72, indicators: 24 },
  { id: 'ifrs_s2', name: 'IFRS S2', color: '#00a651', icon: Leaf, coverage: 68, indicators: 32 },
  { id: 'sdg', name: 'SDGs', color: '#e74c3c', icon: Target, coverage: 81, indicators: 17 },
];

const COMPLIANCE_SCHEDULE = [
  { stage: 1, title: '資料盤點期', deadline: '2025-09-30', status: 'completed', desc: '完成 97 項 ESG 指標資料收集' },
  { stage: 2, title: '初稿撰寫期', deadline: '2025-11-15', status: 'completed', desc: '完成各章節內容初稿' },
  { stage: 3, title: '內部審查期', deadline: '2025-12-31', status: 'current', desc: '董事會及各部門審閱確認' },
  { stage: 4, title: '第三方確信', deadline: '2026-02-28', status: 'pending', desc: 'KPMG/PWC 等機構查證' },
  { stage: 5, title: '主管機關申報', deadline: '2026-04-30', status: 'pending', desc: '依金管會規定正式申報' },
  { stage: 6, title: '公開揭露', deadline: '2026-05-31', status: 'pending', desc: '官網及公開平台發布' },
];

const DEFECTS = [
  { id: 1, type: 'critical', title: 'GRI 305-1 範疇一排放計算基礎年未說明', gri: 'GRI 305-1', risk: '高', status: 'open' },
  { id: 2, type: 'critical', title: 'TCFD 情境分析缺乏 1.5°C 路徑評估', gri: 'TCFD', risk: '高', status: 'open' },
  { id: 3, type: 'warning', title: 'GRI 2-7 員工分類方法未與國際標準對齊', gri: 'GRI 2-7', risk: '中', status: 'fixing' },
  { id: 4, type: 'warning', title: 'GRI 403 職業安全疾病率定義不一致', gri: 'GRI 403-2', risk: '中', status: 'fixing' },
  { id: 5, type: 'info', title: 'GRI 204 供應商本地採購比例定義需細化', gri: 'GRI 204-1', risk: '低', status: 'review' },
  { id: 6, type: 'info', title: 'SASB 員工薪酬中位數未揭露', gri: 'SASB HC-101', risk: '低', status: 'review' },
  { id: 7, type: 'info', title: 'SDG 貢獻說明缺乏量化指標連結', gri: 'SDGs', risk: '低', status: 'pending' },
];

const BENCHMARKS = [
  { company: '台積電 TSMC', score: 98, rank: 1, highlight: 'GRI 完整度、氣候目標設定最佳實踐' },
  { company: '台達電', score: 96, rank: 2, highlight: '供應鏈管理、碳排抵銷策略標竿' },
  { company: '富邦金控', score: 94, rank: 3, highlight: '社會責任投資、利害關係人溝通標竿' },
  { company: '中鋼', score: 91, rank: 4, highlight: '環境管理體系、ISO 14064 最佳實踐' },
  { company: '您的企業', score: 78, rank: null, highlight: '對標分析中 — 缺口集中於 E 類指標', isSelf: true },
];

const AI_TOOLS = [
  { id: 'benchmark', icon: BarChart3, title: '標竿分析', desc: '與產業前 5 大標竿企業對比', color: '#003262' },
  { id: 'narrative', icon: FileText, title: '智能敘事生成', desc: 'SPIRIT Persona 三視角 AI 織稿', color: '#3b7ea1' },
  { id: 'validation', icon: Shield, title: '數據合成驗證', desc: 'ZKP 零幻覺跨表格數據核驗', color: '#22c55e' },
  { id: 'compliance', icon: CheckCircle, title: '多準則合規檢查', desc: '6 大框架 97 指標自動比對', color: '#FDB515' },
  { id: 'assembly', icon: Layers, title: '報告組裝引擎', desc: 'A4 版面自動排版 1000+ 頁', color: '#8b5cf6' },
];

type TabType = 'overview' | 'chapters' | 'compliance' | 'defects' | 'benchmark' | 'generate';
type DefectType = 'critical' | 'warning' | 'info';

export default function OmniSRCPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [defectFilter, setDefectFilter] = useState('all');
  const [expandedDefect, setExpandedDefect] = useState<number | null>(null);
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [activeFramework, setActiveFramework] = useState('gri');

  const totalPages = GRI_CHAPTERS.reduce((s, c) => s + c.pages, 0);
  const avgCoverage = Math.round(GRI_CHAPTERS.reduce((s, c) => s + c.coverage, 0) / GRI_CHAPTERS.length);
  const readyChapters = GRI_CHAPTERS.filter(c => c.status === 'ready').length;

  const startGeneration = () => {
    setGenerating(true);
    setProgress(0);
    setGenerationLog([]);
    const logs = [
      '⚡ 啟動萬能報告中心 (Omni-SRC)...',
      '📊 載入 97 項 ESG 指標定義庫...',
      '🔍 執行標竿分析 — 對標台積電、台達電...',
      '🤖 SPIRIT AI 織稿引擎啟動 (合規守衛模式)...',
      '✍️ 生成 GRI 2 一般揭露章節 (45頁)...',
      '✍️ 生成 GRI 305 排放章節 (42頁)...',
      '✍️ 生成 GRI 403 職安衛章節 (40頁)...',
      '🛡️ ZKP 數據合成驗證中...',
      '📐 A4 版面自動排版引擎啟動...',
      '🔏 5T Hash Lock 封印中...',
      '✅ 報告生成完成！共 1,247 頁',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setGenerationLog(prev => [...prev, logs[i]]);
        setProgress(Math.round(((i + 1) / logs.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        setGenerating(false);
      }
    }, 600);
  };

  const toggleChapter = (id: number) => {
    setSelectedChapters(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filteredDefects = DEFECTS.filter(d => {
    if (defectFilter !== 'all' && d.type !== defectFilter) return false;
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const defectColors: Record<DefectType, string> = {
    critical: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  const tabs = [
    { id: 'overview', label: '報告總覽', icon: Activity },
    { id: 'chapters', label: '章節管理', icon: BookOpen },
    { id: 'compliance', label: '合規時程', icon: Calendar },
    { id: 'defects', label: '缺失偵測', icon: AlertTriangle },
    { id: 'benchmark', label: '標竿分析', icon: Award },
    { id: 'generate', label: 'AI 生成', icon: Zap },
  ] as const;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #003262 0%, #1a4f8a 60%, #3b7ea1 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '300px', height: '100%',
          background: 'radial-gradient(ellipse at right, rgba(253,181,21,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(253,181,21,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={24} color="#FDB515" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>萬能報告中心 Omni-SRC</h1>
            <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>AI 織稿 · 1000+ 頁國際級永續報告書 · 2 小時完成</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { label: '報告頁數', value: `${totalPages}+`, sub: '預計頁數' },
            { label: '平均覆蓋率', value: `${avgCoverage}%`, sub: 'GRI 覆蓋率' },
            { label: '就緒章節', value: `${readyChapters}/${GRI_CHAPTERS.length}`, sub: '可生成章節' },
            { label: 'AI 速度', value: '< 2h', sub: '完整報告生成' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '12px 20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              minWidth: '120px',
            }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#FDB515' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '24px',
        background: 'var(--bg-secondary)', borderRadius: '12px', padding: '6px',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap',
                background: activeTab === tab.id ? '#003262' : 'transparent',
                color: activeTab === tab.id ? '#FDB515' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Frameworks */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>
                六大框架合規覆蓋率
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {FRAMEWORKS.map(fw => {
                  const Icon = fw.icon;
                  return (
                    <div key={fw.id} onClick={() => setActiveFramework(fw.id)}
                      style={{
                        padding: '16px', borderRadius: '12px', cursor: 'pointer',
                        border: `2px solid ${activeFramework === fw.id ? fw.color : 'var(--border-color)'}`,
                        background: activeFramework === fw.id ? `${fw.color}10` : 'var(--bg-secondary)',
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Icon size={16} color={fw.color} />
                        <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{fw.name}</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: fw.color }}>{fw.coverage}%</div>
                      <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px', marginTop: '8px' }}>
                        <div style={{ height: '100%', width: `${fw.coverage}%`, background: fw.color, borderRadius: '2px', transition: 'width 0.6s' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{fw.indicators} 項指標</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Tools */}
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>
              五大 AI 工具箱
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {AI_TOOLS.map(tool => {
                const Icon = tool.icon;
                return (
                  <div key={tool.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: `${tool.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={16} color={tool.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{tool.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{tool.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Structure */}
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>
              報告書結構預覽
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { section: '扉頁 & 目錄', pages: 8, color: '#003262' },
                { section: '公司概述', pages: 24, color: '#3b7ea1' },
                { section: '治理架構 (GRI 2)', pages: 45, color: '#003262' },
                { section: '環境績效 (E)', pages: 185, color: '#22c55e' },
                { section: '社會影響 (S)', pages: 165, color: '#f59e0b' },
                { section: '公司治理 (G)', pages: 98, color: '#8b5cf6' },
                { section: '附錄 & 索引', pages: 42, color: '#6b7280' },
              ].map(item => (
                <div key={item.section} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-primary)' }}>{item.section}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.pages}頁</div>
                  <div style={{
                    width: '60px', height: '4px', background: 'var(--border-color)', borderRadius: '2px',
                  }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (item.pages / 200) * 100)}%`, background: item.color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: '8px', padding: '10px', background: '#003262', borderRadius: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>合計頁數</span>
                <span style={{ color: '#FDB515', fontWeight: 700, fontSize: '16px' }}>567+ 頁</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chapters' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                placeholder="搜尋章節..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px 8px 32px', borderRadius: '8px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                  fontSize: '13px', color: 'var(--text-primary)', width: '220px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedChapters(GRI_CHAPTERS.map(c => c.id))}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid #003262',
                  background: 'transparent', color: '#003262', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                }}
              >全選</button>
              <button
                onClick={() => setSelectedChapters([])}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px',
                }}
              >清除</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {GRI_CHAPTERS.filter(c =>
              !searchQuery || c.title.includes(searchQuery) || c.code.includes(searchQuery)
            ).map(chapter => (
              <div
                key={chapter.id}
                onClick={() => toggleChapter(chapter.id)}
                style={{
                  padding: '16px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${selectedChapters.includes(chapter.id) ? '#003262' : 'var(--border-color)'}`,
                  background: selectedChapters.includes(chapter.id) ? '#003262' + '08' : 'var(--bg-card)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#003262' }}>{chapter.code}</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{chapter.title}</div>
                  </div>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    border: `2px solid ${selectedChapters.includes(chapter.id) ? '#003262' : 'var(--border-color)'}`,
                    background: selectedChapters.includes(chapter.id) ? '#003262' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {selectedChapters.includes(chapter.id) && <CheckCircle size={12} color="#FDB515" />}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                      background: chapter.status === 'ready' ? '#22c55e20' : '#f59e0b20',
                      color: chapter.status === 'ready' ? '#22c55e' : '#f59e0b',
                    }}>
                      {chapter.status === 'ready' ? '就緒' : '進行中'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{chapter.pages}頁</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: chapter.coverage >= 85 ? '#22c55e' : '#f59e0b' }}>
                    {chapter.coverage}%
                  </div>
                </div>
                <div style={{ height: '3px', background: 'var(--border-color)', borderRadius: '99px', marginTop: '8px' }}>
                  <div style={{
                    height: '100%', borderRadius: '99px',
                    width: `${chapter.coverage}%`,
                    background: chapter.coverage >= 85 ? '#22c55e' : '#f59e0b',
                    transition: 'width 0.5s',
                  }} />
                </div>
              </div>
            ))}
          </div>
          {selectedChapters.length > 0 && (
            <div style={{
              position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
              background: '#003262', color: '#fff', padding: '14px 28px', borderRadius: '99px',
              display: 'flex', alignItems: 'center', gap: '12px', zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,50,98,0.4)',
            }}>
              <CheckCircle size={16} color="#FDB515" />
              <span style={{ fontWeight: 600 }}>已選 {selectedChapters.length} 章節</span>
              <button
                onClick={() => setActiveTab('generate')}
                style={{
                  padding: '6px 16px', borderRadius: '99px', border: 'none',
                  background: '#FDB515', color: '#003262', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
                }}
              >
                AI 生成 →
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'compliance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '800px' }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px' }}>
              六階段申報時程追蹤器
            </h3>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '28px', top: '0', bottom: '0', width: '2px',
                background: 'var(--border-color)',
              }} />
              {COMPLIANCE_SCHEDULE.map((stage, idx) => (
                <div key={stage.stage} style={{
                  display: 'flex', gap: '20px', marginBottom: '28px', position: 'relative',
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: stage.status === 'completed' ? '#003262'
                      : stage.status === 'current' ? '#FDB515'
                        : 'var(--bg-secondary)',
                    border: `2px solid ${stage.status === 'completed' ? '#003262'
                      : stage.status === 'current' ? '#FDB515'
                        : 'var(--border-color)'}`,
                    fontWeight: 700, fontSize: '16px', zIndex: 1,
                    color: stage.status === 'completed' ? '#FDB515'
                      : stage.status === 'current' ? '#003262'
                        : 'var(--text-secondary)',
                  }}>
                    {stage.status === 'completed' ? <CheckCircle size={22} /> : stage.stage}
                  </div>
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>
                        第 {stage.stage} 階段：{stage.title}
                      </div>
                      <span style={{
                        padding: '2px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                        background: stage.status === 'completed' ? '#22c55e20'
                          : stage.status === 'current' ? '#FDB51520'
                            : '#6b728020',
                        color: stage.status === 'completed' ? '#22c55e'
                          : stage.status === 'current' ? '#b8860b'
                            : '#6b7280',
                      }}>
                        {stage.status === 'completed' ? '已完成' : stage.status === 'current' ? '進行中' : '待執行'}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{stage.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <Calendar size={12} color="#003262" />
                      <span style={{ color: '#003262', fontWeight: 600 }}>截止日期：{stage.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'defects' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                placeholder="搜尋缺失項目..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                  fontSize: '13px', color: 'var(--text-primary)', boxSizing: 'border-box',
                }}
              />
            </div>
            {['all', 'critical', 'warning', 'info'].map(f => (
              <button
                key={f}
                onClick={() => setDefectFilter(f)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                  background: defectFilter === f ? '#003262' : 'var(--bg-secondary)',
                  color: defectFilter === f ? '#FDB515' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                }}
              >
                {f === 'all' ? '全部' : f === 'critical' ? '高風險' : f === 'warning' ? '中風險' : '低風險'}
                <span style={{ marginLeft: '6px', background: 'rgba(255,255,255,0.2)', padding: '1px 6px', borderRadius: '99px' }}>
                  {f === 'all' ? DEFECTS.length : DEFECTS.filter(d => d.type === f).length}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredDefects.map(defect => {
              const color = defectColors[defect.type as DefectType];
              return (
                <div key={defect.id} style={{
                  borderRadius: '12px', border: `1px solid ${color}30`,
                  background: 'var(--bg-card)', overflow: 'hidden',
                }}>
                  <div
                    onClick={() => setExpandedDefect(expandedDefect === defect.id ? null : defect.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: color, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {defect.title}
                    </div>
                    <span style={{
                      padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                      background: color + '20', color, flexShrink: 0,
                    }}>{defect.gri}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                      background: defect.status === 'open' ? '#ef444420' : defect.status === 'fixing' ? '#f59e0b20' : '#6b728020',
                      color: defect.status === 'open' ? '#ef4444' : defect.status === 'fixing' ? '#f59e0b' : '#6b7280',
                      flexShrink: 0,
                    }}>
                      {defect.status === 'open' ? '待處理' : defect.status === 'fixing' ? '修正中' : '審閱中'}
                    </span>
                    {expandedDefect === defect.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  {expandedDefect === defect.id && (
                    <div style={{
                      padding: '0 16px 16px', borderTop: `1px solid ${color}20`,
                      background: color + '05',
                    }}>
                      <div style={{ padding: '12px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>風險等級</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color }}>⚠️ {defect.risk}風險</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>對應標準</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#003262' }}>{defect.gri}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>AI 修正建議</div>
                          <div style={{
                            padding: '10px 12px', borderRadius: '8px',
                            background: 'var(--bg-secondary)', fontSize: '13px', color: 'var(--text-primary)',
                          }}>
                            建議參照 {defect.gri} 準則第 3.2 章節，補充基礎年份說明、計算方法論及第三方查證聲明書，
                            確保數據完整性符合國際確信標準 ISSA 5000 要求。
                          </div>
                        </div>
                        <button style={{
                          padding: '8px 16px', borderRadius: '8px', border: 'none',
                          background: '#003262', color: '#FDB515', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                        }}>
                          AI 自動修正
                        </button>
                        <button style={{
                          padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                          background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px',
                        }}>
                          標記已知悉
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'benchmark' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="card">
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', fontSize: '15px' }}>
                產業標竿對比分析 (台灣 ESG 前四大)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {BENCHMARKS.map((company, idx) => (
                  <div key={company.company} style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
                    borderRadius: '10px', background: company.isSelf ? '#FDB51510' : 'var(--bg-secondary)',
                    border: `1px solid ${company.isSelf ? '#FDB515' : 'var(--border-color)'}`,
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: company.isSelf ? '#FDB515' : company.rank === 1 ? '#FFD700' : company.rank === 2 ? '#C0C0C0' : '#CD7F32',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '14px', color: company.isSelf ? '#003262' : '#fff',
                    }}>
                      {company.isSelf ? '我' : company.rank}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{company.company}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{company.highlight}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: company.isSelf ? '#FDB515' : '#003262' }}>{company.score}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ESG 評分</div>
                    </div>
                    <div style={{ width: '80px', flexShrink: 0 }}>
                      <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px' }}>
                        <div style={{
                          height: '100%', width: `${company.score}%`, borderRadius: '3px',
                          background: company.isSelf ? '#FDB515' : '#003262', transition: 'width 0.8s',
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: '16px', padding: '14px', borderRadius: '10px',
                background: '#003262', color: '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={16} color="#FDB515" />
                  <span style={{ fontWeight: 700 }}>AI 差距分析報告</span>
                </div>
                <div style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
                  您的企業目前 ESG 評分為 <strong style={{ color: '#FDB515' }}>78分</strong>，與產業標竿台積電 (98分) 差距約
                  <strong style={{ color: '#FDB515' }}> 20分</strong>。主要缺口集中在：
                  環境指標 E 覆蓋率偏低 (-15%)、氣候財務風險揭露 (TCFD) 不完整、
                  供應鏈永續承諾書簽署比例不足。建議優先補強 GRI 305、GRI 308 及 TCFD 章節。
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>
              AI 報告生成設定
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  選擇 AI 人格 (SPIRIT Persona)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'compliance', label: '合規守衛', color: '#003262', icon: Shield },
                    { id: 'harmony', label: '共榮引導', color: '#22c55e', icon: Users },
                    { id: 'innovation', label: '創新先行', color: '#8b5cf6', icon: Zap },
                  ].map(persona => {
                    const Icon = persona.icon;
                    return (
                      <button key={persona.id} style={{
                        padding: '10px 8px', borderRadius: '8px', border: `2px solid ${persona.color}`,
                        background: `${persona.color}10`, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      }}>
                        <Icon size={16} color={persona.color} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: persona.color }}>{persona.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  報告語言
                </label>
                <select style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                  fontSize: '13px', color: 'var(--text-primary)', boxSizing: 'border-box',
                }}>
                  <option>繁體中文</option>
                  <option>English</option>
                  <option>繁中 + English 雙語</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  已選章節：{selectedChapters.length > 0 ? selectedChapters.length : '全部'} 章節
                </label>
                <div style={{
                  padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-secondary)',
                }}>
                  {selectedChapters.length > 0
                    ? `GRI ${selectedChapters.join(', GRI ')} 等 ${selectedChapters.length} 章節`
                    : '全部 17 章節 (推薦完整生成)'}
                </div>
              </div>

              <button
                onClick={startGeneration}
                disabled={generating}
                style={{
                  padding: '14px 24px', borderRadius: '10px', border: 'none',
                  background: generating ? '#6b7280' : 'linear-gradient(135deg, #003262, #3b7ea1)',
                  color: '#FDB515', cursor: generating ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.2s',
                }}
              >
                {generating ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Zap size={18} />}
                {generating ? `生成中 (${progress}%)...` : '⚡ 啟動 AI 生成引擎'}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', fontSize: '15px' }}>
              AI 生成日誌
            </h3>
            {generating && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>生成進度</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#003262' }}>{progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px' }}>
                  <div style={{
                    height: '100%', width: `${progress}%`, borderRadius: '3px',
                    background: 'linear-gradient(90deg, #003262, #FDB515)', transition: 'width 0.4s',
                  }} />
                </div>
              </div>
            )}
            <div style={{
              minHeight: '200px', maxHeight: '320px', overflowY: 'auto',
              background: '#0a0a0a', borderRadius: '8px', padding: '12px',
              fontFamily: 'monospace', fontSize: '12px',
            }}>
              {generationLog.length === 0 ? (
                <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
                  等待啟動 AI 生成引擎...
                </div>
              ) : (
                generationLog.map((log, idx) => (
                  <div key={idx} style={{ color: '#22c55e', marginBottom: '4px', lineHeight: 1.5 }}>
                    <span style={{ color: '#6b7280', marginRight: '8px' }}>[{String(idx + 1).padStart(2, '0')}]</span>
                    {log}
                  </div>
                ))
              )}
            </div>
            {!generating && generationLog.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button style={{
                  flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                  background: '#003262', color: '#FDB515', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <Download size={14} /> 下載 PDF 報告
                </button>
                <button style={{
                  flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)',
                  background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <Eye size={14} /> 預覽報告
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}