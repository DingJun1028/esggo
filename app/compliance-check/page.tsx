'use client';
import { useState } from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, Shield, Globe,
  BarChart3, TrendingUp, Leaf, Target, FileText,
  Search, Filter, ChevronDown, ChevronUp, Info,
  Clock, Star, Award, Activity, Zap, Eye, Download
} from 'lucide-react';

const INDICATORS = [
  { id: 1, code: 'GRI 2-1', title: '組織詳情', framework: 'GRI', category: 'G', status: 'pass', score: 98, type: 'core' },
  { id: 2, code: 'GRI 2-7', title: '員工數量', framework: 'GRI', category: 'S', status: 'pass', score: 95, type: 'core' },
  { id: 3, code: 'GRI 2-9', title: '治理架構', framework: 'GRI', category: 'G', status: 'pass', score: 90, type: 'core' },
  { id: 4, code: 'GRI 3-1', title: '重大主題流程', framework: 'GRI', category: 'G', status: 'pass', score: 88, type: 'core' },
  { id: 5, code: 'GRI 201-1', title: '創造並分配直接經濟價值', framework: 'GRI', category: 'G', status: 'pass', score: 92, type: 'core' },
  { id: 6, code: 'GRI 302-1', title: '組織內部能源消耗', framework: 'GRI', category: 'E', status: 'pass', score: 96, type: 'core' },
  { id: 7, code: 'GRI 302-4', title: '減少能源消耗', framework: 'GRI', category: 'E', status: 'warning', score: 74, type: 'core' },
  { id: 8, code: 'GRI 303-1', title: '作為共享資源的水資源交互作用', framework: 'GRI', category: 'E', status: 'pass', score: 85, type: 'core' },
  { id: 9, code: 'GRI 305-1', title: '直接溫室氣體排放 (範疇一)', framework: 'GRI', category: 'E', status: 'pass', score: 97, type: 'core' },
  { id: 10, code: 'GRI 305-2', title: '能源間接溫室氣體排放 (範疇二)', framework: 'GRI', category: 'E', status: 'pass', score: 94, type: 'core' },
  { id: 11, code: 'GRI 305-3', title: '其他間接溫室氣體排放 (範疇三)', framework: 'GRI', category: 'E', status: 'warning', score: 68, type: 'extended' },
  { id: 12, code: 'GRI 306-3', title: '廢棄物產生', framework: 'GRI', category: 'E', status: 'pass', score: 89, type: 'core' },
  { id: 13, code: 'GRI 401-1', title: '新進員工及人員流動', framework: 'GRI', category: 'S', status: 'pass', score: 91, type: 'core' },
  { id: 14, code: 'GRI 403-2', title: '危害識別、風險評估及事故調查', framework: 'GRI', category: 'S', status: 'warning', score: 76, type: 'core' },
  { id: 15, code: 'GRI 404-1', title: '每位員工每年平均受訓時數', framework: 'GRI', category: 'S', status: 'pass', score: 88, type: 'core' },
  { id: 16, code: 'GRI 405-1', title: '治理機構成員及員工多元化', framework: 'GRI', category: 'G', status: 'pass', score: 87, type: 'core' },
  { id: 17, code: 'GRI 413-1', title: '地方社區業務', framework: 'GRI', category: 'S', status: 'warning', score: 71, type: 'extended' },
  { id: 18, code: 'GRI 418-1', title: '已提出且有關客戶隱私遭違反的投訴', framework: 'GRI', category: 'G', status: 'pass', score: 83, type: 'extended' },
  { id: 19, code: 'TCFD-Gov', title: '氣候相關治理', framework: 'TCFD', category: 'G', status: 'pass', score: 90, type: 'core' },
  { id: 20, code: 'TCFD-Str', title: '氣候相關策略', framework: 'TCFD', category: 'G', status: 'warning', score: 72, type: 'core' },
  { id: 21, code: 'TCFD-RM', title: '氣候相關風險管理', framework: 'TCFD', category: 'G', status: 'pass', score: 85, type: 'core' },
  { id: 22, code: 'TCFD-Met', title: '指標與目標', framework: 'TCFD', category: 'E', status: 'warning', score: 65, type: 'core' },
  { id: 23, code: 'SASB-HC', title: '勞動力多元化與融合', framework: 'SASB', category: 'S', status: 'pass', score: 86, type: 'core' },
  { id: 24, code: 'SASB-ENV', title: '環境法規合規', framework: 'SASB', category: 'E', status: 'pass', score: 93, type: 'core' },
  { id: 25, code: 'IFRS-S1', title: '永續相關財務資訊揭露一般規定', framework: 'IFRS', category: 'G', status: 'warning', score: 69, type: 'core' },
  { id: 26, code: 'IFRS-S2', title: '氣候相關揭露', framework: 'IFRS', category: 'E', status: 'fail', score: 45, type: 'core' },
  { id: 27, code: 'SDG-7', title: 'SDG 7 可負擔且清潔的能源', framework: 'SDG', category: 'E', status: 'pass', score: 88, type: 'extended' },
  { id: 28, code: 'SDG-13', title: 'SDG 13 氣候行動', framework: 'SDG', category: 'E', status: 'warning', score: 73, type: 'extended' },
  { id: 29, code: 'TWREG-1', title: '金管會永續報告書申報', framework: 'TW', category: 'G', status: 'pass', score: 95, type: 'core' },
  { id: 30, code: 'TWREG-2', title: '確信機構管理要點', framework: 'TW', category: 'G', status: 'warning', score: 78, type: 'core' },
];

const FRAMEWORKS_LIST = ['全部', 'GRI', 'TCFD', 'SASB', 'IFRS', 'SDG', 'TW'];
const CATEGORIES = ['全部', 'E', 'S', 'G'];
const STATUS_OPTIONS = ['全部', 'pass', 'warning', 'fail'];

type StatusType = 'pass' | 'warning' | 'fail';

export default function ComplianceCheckPage() {
  const [selectedFramework, setSelectedFramework] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const filtered = INDICATORS.filter(ind => {
    if (selectedFramework !== '全部' && ind.framework !== selectedFramework) return false;
    if (selectedCategory !== '全部' && ind.category !== selectedCategory) return false;
    if (selectedStatus !== '全部' && ind.status !== selectedStatus) return false;
    if (searchQuery && !ind.title.includes(searchQuery) && !ind.code.includes(searchQuery)) return false;
    return true;
  });

  const passCount = INDICATORS.filter(i => i.status === 'pass').length;
  const warnCount = INDICATORS.filter(i => i.status === 'warning').length;
  const failCount = INDICATORS.filter(i => i.status === 'fail').length;
  const overallScore = Math.round(INDICATORS.reduce((s, i) => s + i.score, 0) / INDICATORS.length);

  const statusConfig: Record<StatusType, { color: string; label: string; icon: any }> = {
    pass: { color: '#22c55e', label: '合規', icon: CheckCircle },
    warning: { color: '#f59e0b', label: '待改善', icon: AlertTriangle },
    fail: { color: '#ef4444', label: '不合規', icon: XCircle },
  };

  const categoryColors: Record<string, string> = { E: '#22c55e', S: '#3b7ea1', G: '#8b5cf6' };

  const startScan = () => {
    setScanning(true);
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        setScanProgress(100);
        setScanning(false);
        clearInterval(interval);
      } else {
        setScanProgress(Math.round(p));
      }
    }, 200);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a3d 0%, #2d1b69 60%, #4c1d95 100%)',
        borderRadius: '16px', padding: '28px', marginBottom: '24px',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '200px', height: '100%',
          background: 'radial-gradient(ellipse at right, rgba(139,92,246,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={24} color="#a78bfa" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>全方位合規檢核系統</h1>
            <p style={{ fontSize: '13px', opacity: 0.75, margin: 0 }}>GRI · SASB · TCFD · IFRS S1/S2 · SDGs · 台灣法規 · 97 項指標定義 · 7 大常見缺失偵測</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: '整體合規分數', value: `${overallScore}`, unit: '分', color: overallScore >= 80 ? '#22c55e' : '#f59e0b' },
            { label: '通過項目', value: passCount, unit: '項', color: '#22c55e' },
            { label: '待改善', value: warnCount, unit: '項', color: '#f59e0b' },
            { label: '不合規', value: failCount, unit: '項', color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 18px',
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: stat.color }}>{stat.value}<span style={{ fontSize: '14px', marginLeft: '2px' }}>{stat.unit}</span></div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>{stat.label}</div>
            </div>
          ))}
          <button
            onClick={startScan}
            disabled={scanning}
            style={{
              padding: '12px 20px', borderRadius: '10px', border: 'none',
              background: scanning ? 'rgba(255,255,255,0.1)' : 'rgba(139,92,246,0.6)',
              color: '#fff', cursor: scanning ? 'not-allowed' : 'pointer',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
              marginLeft: 'auto', fontSize: '13px',
            }}
          >
            <Activity size={16} style={{ animation: scanning ? 'pulse 1s infinite' : 'none' }} />
            {scanning ? `掃描中 ${scanProgress}%` : '🔍 立即掃描'}
          </button>
        </div>
        {scanning && (
          <div style={{ marginTop: '12px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
            <div style={{
              height: '100%', width: `${scanProgress}%`, borderRadius: '2px',
              background: 'linear-gradient(90deg, #a78bfa, #22c55e)', transition: 'width 0.3s',
            }} />
          </div>
        )}
      </div>

      {/* Compliance Rings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { fw: 'GRI 2021', pct: 94, color: '#003262' },
          { fw: 'TCFD', pct: 85, color: '#3b7ea1' },
          { fw: 'SASB 2.0', pct: 78, color: '#FDB515' },
          { fw: 'IFRS S1', pct: 72, color: '#8b5cf6' },
          { fw: 'IFRS S2', pct: 57, color: '#ef4444' },
          { fw: 'SDGs', pct: 81, color: '#22c55e' },
          { fw: 'TW 法規', pct: 87, color: '#0ea5e9' },
        ].map(fw => (
          <div key={fw.fw} className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ margin: '0 auto 8px' }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-color)" strokeWidth="6" />
              <circle cx="32" cy="32" r="26" fill="none" stroke={fw.color} strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26 * fw.pct / 100} ${2 * Math.PI * 26}`}
                strokeLinecap="round" transform="rotate(-90 32 32)" style={{ transition: 'stroke-dasharray 1s' }} />
              <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill={fw.color}>{fw.pct}%</text>
            </svg>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{fw.fw}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: '12px', padding: '16px',
        marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            placeholder="搜尋指標..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px',
              border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
              fontSize: '13px', color: 'var(--text-primary)', boxSizing: 'border-box',
            }}
          />
        </div>
        {[
          { label: '框架', options: FRAMEWORKS_LIST, value: selectedFramework, setter: setSelectedFramework },
          { label: 'E/S/G', options: CATEGORIES, value: selectedCategory, setter: setSelectedCategory },
          { label: '狀態', options: STATUS_OPTIONS, value: selectedStatus, setter: setSelectedStatus },
        ].map(filter => (
          <div key={filter.label} style={{ display: 'flex', gap: '4px' }}>
            {filter.options.map(opt => (
              <button
                key={opt}
                onClick={() => filter.setter(opt)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)',
                  background: filter.value === opt ? '#003262' : 'var(--bg-secondary)',
                  color: filter.value === opt ? '#FDB515' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                }}
              >
                {opt === 'pass' ? '合規' : opt === 'warning' ? '待改善' : opt === 'fail' ? '不合規' : opt}
              </button>
            ))}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
          顯示 {filtered.length} / {INDICATORS.length} 項
        </div>
      </div>

      {/* Indicators Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: '#003262', color: '#fff' }}>
                {['狀態', '指標代碼', '指標名稱', '框架', 'E/S/G', '合規分數', '操作'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '12px',
                    fontWeight: 600, whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ind, idx) => {
                const cfg = statusConfig[ind.status as StatusType];
                const Icon = cfg.icon;
                return (
                  <>
                    <tr
                      key={ind.id}
                      onClick={() => setExpandedId(expandedId === ind.id ? null : ind.id)}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        background: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <Icon size={16} color={cfg.color} />
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '13px', color: '#003262' }}>
                        {ind.code}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        {ind.title}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                          background: '#00326215', color: '#003262',
                        }}>{ind.framework}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                          background: (categoryColors[ind.category] || '#6b7280') + '20',
                          color: categoryColors[ind.category] || '#6b7280',
                        }}>{ind.category}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '50px', height: '4px', background: 'var(--border-color)', borderRadius: '2px' }}>
                            <div style={{
                              height: '100%', width: `${ind.score}%`, borderRadius: '2px',
                              background: ind.score >= 85 ? '#22c55e' : ind.score >= 65 ? '#f59e0b' : '#ef4444',
                            }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: ind.score >= 85 ? '#22c55e' : ind.score >= 65 ? '#f59e0b' : '#ef4444' }}>
                            {ind.score}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button style={{
                          padding: '4px 10px', borderRadius: '6px', border: 'none',
                          background: '#00326215', color: '#003262', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                        }}>
                          {expandedId === ind.id ? '收起' : '詳情'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === ind.id && (
                      <tr key={`exp-${ind.id}`}>
                        <td colSpan={7} style={{
                          padding: '16px', background: cfg.color + '06',
                          borderBottom: '1px solid var(--border-color)',
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>合規狀態</div>
                              <div style={{ fontWeight: 600, color: cfg.color }}>{cfg.label} — {ind.score}分</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>指標類型</div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {ind.type === 'core' ? '🔴 核心指標 (必揭露)' : '🟡 擴充指標 (建議揭露)'}
                              </div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>改善建議</div>
                              <div style={{
                                padding: '10px', borderRadius: '8px',
                                background: 'var(--bg-secondary)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6,
                              }}>
                                {ind.status === 'pass'
                                  ? `✅ 此指標目前符合 ${ind.framework} 標準要求。建議持續維護數據品質並進行年度更新驗證。`
                                  : ind.status === 'warning'
                                    ? `⚠️ 此指標部分符合要求，建議補充完整的量化基礎年份資料、計算方法論說明，並附上第三方查證聲明書以提升可信度。`
                                    : `❌ 此指標目前不符合 ${ind.framework} 標準。需立即重新盤查數據來源，補充必要揭露欄位，並建議聘請專業顧問進行合規輔導。`
                                }
                              </div>
                            </div>
                            <button style={{
                              padding: '8px 16px', borderRadius: '8px', border: 'none',
                              background: '#003262', color: '#FDB515', cursor: 'pointer', fontWeight: 600, fontSize: '12px',
                              display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                              <Zap size={13} /> AI 自動補充
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}