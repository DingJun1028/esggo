'use client';
import { useState, useMemo } from 'react';
import {
  Users, Plus, Send, BarChart3, CheckCircle, Clock,
  AlertTriangle, Download, Search, ChevronDown, X,
  Mail, Globe, Building2, Star, TrendingUp, PieChart
} from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  organization: string;
  type: 'internal' | 'external' | 'supplier' | 'investor' | 'community' | 'regulator';
  email: string;
  influence: number;
  concern: number;
  surveyStatus: 'sent' | 'completed' | 'pending' | 'declined';
  responseDate?: string;
  responses?: Record<string, number>;
}

interface SurveyQuestion {
  id: string;
  topic: string;
  topicZh: string;
  category: 'E' | 'S' | 'G';
  griReference: string;
  question: string;
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
  { id: 'q1', topic: 'Climate Change', topicZh: '氣候變遷', category: 'E', griReference: 'GRI 201-2', question: '氣候相關風險對本公司業務影響的關注程度' },
  { id: 'q2', topic: 'GHG Emissions', topicZh: '溫室氣體排放', category: 'E', griReference: 'GRI 305', question: '溫室氣體排放減量目標設定的重要性' },
  { id: 'q3', topic: 'Energy Management', topicZh: '能源管理', category: 'E', griReference: 'GRI 302', question: '再生能源採用與節能措施的優先程度' },
  { id: 'q4', topic: 'Water & Waste', topicZh: '水資源與廢棄物', category: 'E', griReference: 'GRI 303/306', question: '水資源管理與廢棄物減量的重要性' },
  { id: 'q5', topic: 'Employee Wellbeing', topicZh: '員工福祉', category: 'S', griReference: 'GRI 401', question: '員工薪酬公平性與福利完善度的重要性' },
  { id: 'q6', topic: 'Occupational Safety', topicZh: '職業安全衛生', category: 'S', griReference: 'GRI 403', question: '職場安全衛生管理的重要性' },
  { id: 'q7', topic: 'Human Rights', topicZh: '人權', category: 'S', griReference: 'GRI 408-414', question: '供應鏈人權盡職調查的迫切性' },
  { id: 'q8', topic: 'Community Impact', topicZh: '社區影響', category: 'S', griReference: 'GRI 413', question: '企業對在地社區貢獻的重要性' },
  { id: 'q9', topic: 'Anti-Corruption', topicZh: '反貪腐', category: 'G', griReference: 'GRI 205', question: '反貪腐政策與合規管理的重要性' },
  { id: 'q10', topic: 'Data Security', topicZh: '資訊安全', category: 'G', griReference: 'GRI 418', question: '資訊安全與個人資料保護的優先程度' },
  { id: 'q11', topic: 'Supply Chain ESG', topicZh: '供應鏈 ESG', category: 'G', griReference: 'GRI 308/414', question: '供應商 ESG 評核與管理的必要性' },
  { id: 'q12', topic: 'Transparency', topicZh: '資訊透明度', category: 'G', griReference: 'GRI 2-22', question: '永續報告書揭露完整性的重要性' },
];

const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: '1', name: '陳建宏', organization: '台灣碳盤查協會', type: 'external', email: 'chen@esg.org.tw', influence: 4, concern: 5, surveyStatus: 'completed', responseDate: '2026-05-15', responses: { q1: 5, q2: 5, q3: 4, q4: 4, q5: 3, q6: 4, q7: 5, q8: 3, q9: 4, q10: 4, q11: 5, q12: 5 } },
  { id: '2', name: '林雅婷', organization: '永續投資基金', type: 'investor', email: 'lin@fund.com', influence: 5, concern: 5, surveyStatus: 'completed', responseDate: '2026-05-17', responses: { q1: 5, q2: 4, q3: 3, q4: 3, q5: 4, q6: 3, q7: 4, q8: 2, q9: 5, q10: 5, q11: 4, q12: 5 } },
  { id: '3', name: '王文成', organization: '供應商A公司', type: 'supplier', email: 'wang@supplier.com', influence: 3, concern: 3, surveyStatus: 'sent', responses: {} },
  { id: '4', name: '張美玲', organization: '人資部', type: 'internal', email: 'chang@company.com', influence: 3, concern: 4, surveyStatus: 'completed', responseDate: '2026-05-18', responses: { q1: 3, q2: 3, q3: 4, q4: 3, q5: 5, q6: 5, q7: 4, q8: 4, q9: 3, q10: 4, q11: 3, q12: 4 } },
  { id: '5', name: '李政委', organization: '環保主管機關', type: 'regulator', email: 'li@gov.tw', influence: 5, concern: 4, surveyStatus: 'pending', responses: {} },
  { id: '6', name: '社區代表', organization: '在地社區聯盟', type: 'community', email: 'community@local.org', influence: 2, concern: 4, surveyStatus: 'declined', responses: {} },
];

const TYPE_CFG: Record<string, { label: string; color: string; bg: string }> = {
  internal: { label: '內部', color: '#003262', bg: '#dbeafe' },
  external: { label: '外部', color: '#16a34a', bg: '#dcfce7' },
  supplier: { label: '供應商', color: '#d97706', bg: '#fef3c7' },
  investor: { label: '投資人', color: '#7c3aed', bg: '#ede9fe' },
  community: { label: '社區', color: '#0369a1', bg: '#e0f2fe' },
  regulator: { label: '主管機關', color: '#dc2626', bg: '#fef2f2' },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  completed: { label: '已回覆', color: '#16a34a', bg: '#dcfce7' },
  sent: { label: '已發送', color: '#2563eb', bg: '#eff6ff' },
  pending: { label: '待發送', color: '#d97706', bg: '#fef3c7' },
  declined: { label: '婉拒', color: '#9ca3af', bg: '#f3f4f6' },
};

export default function StakeholderSurveyPage() {
  const [stakeholders] = useState<Stakeholder[]>(MOCK_STAKEHOLDERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'results' | 'matrix'>('overview');
  const [search, setSearch] = useState('');
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  const completed = stakeholders.filter(s => s.surveyStatus === 'completed');
  const responseRate = Math.round((completed.length / stakeholders.length) * 100);

  const topicScores = useMemo(() => {
    return SURVEY_QUESTIONS.map(q => {
      const responses = completed
        .map(s => s.responses?.[q.id])
        .filter((v): v is number => v !== undefined);
      const avg = responses.length > 0
        ? responses.reduce((a, b) => a + b, 0) / responses.length
        : 0;
      return { ...q, avgScore: Math.round(avg * 10) / 10, responseCount: responses.length };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [completed]);

  const filtered = stakeholders.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q);
  });

  const tabs = [
    { id: 'overview', label: '問卷總覽' },
    { id: 'list', label: '利害關係人清單' },
    { id: 'results', label: '重大議題結果' },
    { id: 'matrix', label: '影響力矩陣' },
  ] as const;

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003262, #1a4d7a)', borderRadius: '18px', padding: '26px 28px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(253,181,21,0.07)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} color="#FDB515" />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, color: 'white', lineHeight: 1 }}>利害關係人問卷系統</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Stakeholder Survey · GRI 2-29 · 3-1/3-2 重大性評估</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: '利害關係人', value: stakeholders.length, sub: '位', color: 'white' },
              { label: '已回覆', value: completed.length, sub: '位', color: '#86efac' },
              { label: '回覆率', value: `${responseRate}%`, sub: '', color: '#FDB515' },
              { label: '重大議題', value: SURVEY_QUESTIONS.length, sub: '項', color: '#93c5fd' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}{s.sub && <span style={{ fontSize: '12px', marginLeft: '2px' }}>{s.sub}</span>}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '4px', borderRadius: '10px', marginBottom: '20px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 18px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: activeTab === t.id ? 'white' : 'transparent', color: activeTab === t.id ? '#003262' : '#6b7280', boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 總覽 ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Progress */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>問卷回覆進度</h2>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#374151' }}>整體回覆率</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#003262' }}>{responseRate}%</span>
              </div>
              <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${responseRate}%`, background: 'linear-gradient(90deg, #003262, #3b7ea1)', borderRadius: '5px', transition: 'width 1s ease' }} />
              </div>
            </div>
            {Object.entries(STATUS_CFG).map(([k, v]) => {
              const count = stakeholders.filter(s => s.surveyStatus === k).length;
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.color }} />
                    {v.label}
                  </span>
                  <span style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, background: v.bg, color: v.color }}>{count} 位</span>
                </div>
              );
            })}
          </div>

          {/* Top Topics */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>Top 5 重大議題（平均分數）</h2>
            {topicScores.slice(0, 5).map((q, i) => (
              <div key={q.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', width: '16px' }}>#{i + 1}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{q.topicZh}</span>
                    <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: q.category === 'E' ? '#dcfce7' : q.category === 'S' ? '#ede9fe' : '#fef3c7', color: q.category === 'E' ? '#16a34a' : q.category === 'S' ? '#7c3aed' : '#d97706' }}>{q.category}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#003262' }}>{q.avgScore}</span>
                </div>
                <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(q.avgScore / 5) * 100}%`, background: `linear-gradient(90deg, ${q.category === 'E' ? '#16a34a' : q.category === 'S' ? '#7c3aed' : '#d97706'}, #003262)`, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Type Distribution */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>利害關係人類型分布</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Object.entries(TYPE_CFG).map(([k, v]) => {
                const count = stakeholders.filter(s => s.type === k).length;
                const completed_count = stakeholders.filter(s => s.type === k && s.surveyStatus === 'completed').length;
                return (
                  <div key={k} style={{ flex: '1 1 160px', padding: '14px 16px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700, background: v.bg, color: v.color }}>{v.label}</span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>{count}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{completed_count} 位已回覆</div>
                    <div style={{ marginTop: '6px', height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${count > 0 ? (completed_count / count) * 100 : 0}%`, background: v.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 清單 ── */}
      {activeTab === 'list' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋姓名或機構…" style={{ width: '100%', paddingLeft: '32px', padding: '9px 12px 9px 32px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: '#003262', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={13} />新增
            </button>
          </div>
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #e5e7eb' }}>
                  {['姓名 / 機構', '類型', '影響力', '關注度', '問卷狀態', '操作'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const tCfg = TYPE_CFG[s.type];
                  const stCfg = STATUS_CFG[s.surveyStatus];
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>{s.name}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Building2 size={10} />{s.organization}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: tCfg.bg, color: tCfg.color }}>{tCfg.label}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} style={{ width: '10px', height: '10px', borderRadius: '2px', background: n <= s.influence ? '#003262' : '#e5e7eb' }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} style={{ width: '10px', height: '10px', borderRadius: '2px', background: n <= s.concern ? '#FDB515' : '#e5e7eb' }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => setSelectedStakeholder(s)} style={{ padding: '5px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#374151', fontWeight: 600 }}>
                          {s.surveyStatus === 'completed' ? '查看回覆' : '發送問卷'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 結果 ── */}
      {activeTab === 'results' && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1.5px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e' }}>重大性議題評分結果</span>
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af' }}>基於 {completed.length} 份有效回覆</span>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#003262', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              <Download size={12} />匯出 GRI 3-1
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #e5e7eb' }}>
                {['排名', '重大議題', '類別', 'GRI', '平均分數', '分數分布', '判定'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topicScores.map((q, i) => {
                const isHigh = q.avgScore >= 4;
                const isMed = q.avgScore >= 3 && q.avgScore < 4;
                return (
                  <tr key={q.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: i < 3 ? '#d97706' : '#9ca3af' }}>#{i + 1}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{q.topicZh}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{q.topic}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '11px', fontWeight: 700, background: q.category === 'E' ? '#dcfce7' : q.category === 'S' ? '#ede9fe' : '#fef3c7', color: q.category === 'E' ? '#16a34a' : q.category === 'S' ? '#7c3aed' : '#d97706' }}>{q.category}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>{q.griReference}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: isHigh ? '#16a34a' : isMed ? '#d97706' : '#6b7280' }}>{q.avgScore}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>/5</span>
                    </td>
                    <td style={{ padding: '12px 14px', minWidth: '100px' }}>
                      <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(q.avgScore / 5) * 100}%`, background: isHigh ? '#16a34a' : isMed ? '#d97706' : '#9ca3af', borderRadius: '4px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: isHigh ? '#dcfce7' : isMed ? '#fef3c7' : '#f3f4f6', color: isHigh ? '#16a34a' : isMed ? '#d97706' : '#9ca3af' }}>
                        {isHigh ? '高重大性' : isMed ? '中重大性' : '低重大性'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 矩陣 ── */}
      {activeTab === 'matrix' && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', marginBottom: '20px' }}>影響力 × 關注度矩陣</h2>
          <div style={{ position: 'relative', height: '340px', background: '#f9fafb', borderRadius: '12px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
            {/* Axes */}
            <div style={{ position: 'absolute', bottom: '32px', left: '28px', right: '16px', height: '1px', background: '#d1d5db' }} />
            <div style={{ position: 'absolute', left: '44px', top: '16px', bottom: '32px', width: '1px', background: '#d1d5db' }} />
            <div style={{ position: 'absolute', bottom: '8px', left: '50%', fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>影響力 →</div>
            <div style={{ position: 'absolute', left: '6px', top: '50%', fontSize: '11px', color: '#9ca3af', fontWeight: 600, transform: 'rotate(-90deg)', transformOrigin: 'center' }}>關注度 ↑</div>
            {/* Quadrant labels */}
            <div style={{ position: 'absolute', right: '12px', top: '18px', fontSize: '10px', color: '#d97706', fontWeight: 700, background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>高影響 × 高關注 ⭐</div>
            {/* Stakeholder dots */}
            {stakeholders.map(s => {
              const tCfg = TYPE_CFG[s.type];
              const x = (s.influence / 5) * 85 + 8;
              const y = 100 - ((s.concern / 5) * 85 + 8);
              return (
                <div
                  key={s.id}
                  title={`${s.name} — ${s.organization}`}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    background: tCfg.color,
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '10px', fontWeight: 800, color: 'white',
                    zIndex: 2,
                  }}
                  onClick={() => setSelectedStakeholder(s)}
                >
                  {s.name.slice(0, 1)}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
            {Object.entries(TYPE_CFG).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: v.color }} />
                {v.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedStakeholder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedStakeholder(null)}>
          <div style={{ background: 'white', borderRadius: '18px', width: '100%', maxWidth: '540px', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #003262, #1a4d7a)', borderRadius: '18px 18px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{selectedStakeholder.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>{selectedStakeholder.organization}</div>
              </div>
              <button onClick={() => setSelectedStakeholder(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', color: 'white', fontSize: '16px' }}>×</button>
            </div>
            <div style={{ padding: '22px 24px' }}>
              {selectedStakeholder.surveyStatus === 'completed' && selectedStakeholder.responses ? (
                <>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px' }}>問卷回覆結果</div>
                  {SURVEY_QUESTIONS.map(q => {
                    const score = selectedStakeholder.responses?.[q.id] ?? 0;
                    return (
                      <div key={q.id} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#374151' }}>{q.topicZh}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#003262' }}>{score}/5</span>
                        </div>
                        <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(score / 5) * 100}%`, background: score >= 4 ? '#16a34a' : score >= 3 ? '#d97706' : '#9ca3af', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                  <Send size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>尚未收到回覆</div>
                  <button style={{ marginTop: '16px', padding: '9px 24px', background: '#003262', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    發送問卷邀請
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}