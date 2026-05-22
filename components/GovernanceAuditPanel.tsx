'use client';
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, X, ChevronDown, ChevronRight, CheckCircle,
  AlertTriangle, XCircle, MinusCircle, BarChart3, Clipboard,
  RefreshCw, Eye, Filter, Download
} from 'lucide-react';
import {
  AUDIT_RULES, PAGE_REGISTRY, calculateAuditScore,
  getScoreColor, getScoreLabel,
  type AuditRule, type AuditResult, type AuditStatus, type AuditCategory
} from '../lib/governance-audit';

const CATEGORY_LABELS: Record<AuditCategory, { label: string; color: string }> = {
  visual:        { label: '視覺', color: '#3B7EA1' },
  interaction:   { label: '互動', color: '#22c55e' },
  structure:     { label: '結構', color: '#FDB515' },
  engineering:   { label: '工程', color: '#ef4444' },
  accessibility: { label: '無障礙', color: '#8b5cf6' },
  rwd:           { label: 'RWD', color: '#f97316' },
};

const STATUS_ICONS: Record<AuditStatus, React.ReactNode> = {
  pass: <CheckCircle size={14} className="text-green-500" />,
  warn: <AlertTriangle size={14} className="text-amber-500" />,
  fail: <XCircle size={14} className="text-red-500" />,
  skip: <MinusCircle size={14} className="text-slate-400" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-50 text-red-700 border-red-200',
  high:     'bg-amber-50 text-amber-700 border-amber-200',
  medium:   'bg-blue-50 text-blue-700 border-blue-200',
  low:      'bg-slate-50 text-slate-600 border-slate-200',
};

interface RuleItemProps {
  rule: AuditRule;
  result?: AuditResult;
  onSetStatus: (ruleId: string, status: AuditStatus) => void;
}

function RuleItem({ rule, result, onSetStatus }: RuleItemProps) {
  const [expanded, setExpanded] = useState(false);
  const currentStatus = result?.status ?? 'skip';

  return (
    <div
      className={`border border-slate-100 rounded-lg overflow-hidden transition-all ${
        currentStatus === 'fail' ? 'border-red-200 bg-red-50/30' :
        currentStatus === 'warn' ? 'border-amber-200 bg-amber-50/20' :
        currentStatus === 'pass' ? 'border-green-200 bg-green-50/20' : ''
      }`}
    >
      <button
        className="w-full flex items-center gap-2 p-3 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex-shrink-0">{STATUS_ICONS[currentStatus]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400">{rule.id}</span>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[rule.priority]}`}
            >
              {rule.priority}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">{rule.title}</p>
        </div>
        {expanded ? <ChevronDown size={12} className="text-slate-400 flex-shrink-0" /> :
                    <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-xs text-slate-500">{rule.description}</p>
          <div className="flex gap-1.5 flex-wrap">
            {(['pass', 'warn', 'fail', 'skip'] as AuditStatus[]).map(s => (
              <button
                key={s}
                onClick={() => onSetStatus(rule.id, s)}
                className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                  currentStatus === s
                    ? s === 'pass' ? 'bg-green-500 text-white border-green-500' :
                      s === 'warn' ? 'bg-amber-500 text-white border-amber-500' :
                      s === 'fail' ? 'bg-red-500 text-white border-red-500' :
                      'bg-slate-500 text-white border-slate-500'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                }`}
              >
                {STATUS_ICONS[s]}
                {s === 'pass' ? '通過' : s === 'warn' ? '警告' : s === 'fail' ? '失敗' : '跳過'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScoreRingProps { score: number; size?: number }
function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="14" fontWeight="700" fill={color}>
        {score}
      </text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" dominantBaseline="middle"
        fontSize="7" fill="#94a3b8">
        {getScoreLabel(score)}
      </text>
    </svg>
  );
}

export default function GovernanceAuditPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'pages' | 'rules'>('audit');
  const [results, setResults] = useState<Record<string, AuditStatus>>({});
  const [filterCat, setFilterCat] = useState<AuditCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<AuditStatus | 'all'>('all');
  const [savedAt, setSavedAt] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('esggo_audit_results');
      if (saved) setResults(JSON.parse(saved));
      const ts = localStorage.getItem('esggo_audit_ts');
      if (ts) setSavedAt(ts);
    } catch { /**/ }
  }, []);

  const setStatus = (ruleId: string, status: AuditStatus) => {
    setResults(prev => {
      const next = { ...prev, [ruleId]: status };
      localStorage.setItem('esggo_audit_results', JSON.stringify(next));
      const ts = new Date().toLocaleString('zh-TW');
      setSavedAt(ts);
      localStorage.setItem('esggo_audit_ts', ts);
      return next;
    });
  };

  const resetAll = () => {
    if (!confirm('確定清除所有稽核結果？')) return;
    setResults({});
    localStorage.removeItem('esggo_audit_results');
    setSavedAt('');
  };

  const exportReport = () => {
    const data = {
      exportAt: new Date().toISOString(),
      platform: 'ESG GO 善向永續',
      results: AUDIT_RULES.map(r => ({
        id: r.id, category: r.category, title: r.title,
        priority: r.priority, status: results[r.id] ?? 'skip',
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `esggo-audit-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const auditResults: AuditResult[] = AUDIT_RULES.map(r => ({
    ruleId: r.id,
    status: results[r.id] ?? 'skip',
    timestamp: new Date().toISOString(),
  }));
  const score = calculateAuditScore(auditResults);

  const categoryStats = Object.entries(CATEGORY_LABELS).map(([cat, meta]) => {
    const rules = AUDIT_RULES.filter(r => r.category === cat as AuditCategory);
    const rs = rules.map(r => ({ ruleId: r.id, status: results[r.id] ?? 'skip', timestamp: '' }));
    return { cat, ...meta, score: calculateAuditScore(rs), total: rules.length };
  });

  const filteredRules = AUDIT_RULES.filter(r => {
    if (filterCat !== 'all' && r.category !== filterCat) return false;
    if (filterStatus !== 'all' && (results[r.id] ?? 'skip') !== filterStatus) return false;
    return true;
  });

  const passCount = auditResults.filter(r => r.status === 'pass').length;
  const failCount = auditResults.filter(r => r.status === 'fail').length;
  const warnCount = auditResults.filter(r => r.status === 'warn').length;

  return (
    <>
      {/* FAB */}
      <button
        className="audit-fab"
        onClick={() => setOpen(!open)}
        aria-label="開啟 UIUX 治理稽核面板"
        title="UIUX 治理稽核"
      >
        <ShieldCheck size={22} />
        {failCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ background: '#ef4444', color: '#fff' }}
          >
            {failCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[149] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div className={`audit-panel ${open ? 'open' : ''}`} role="dialog" aria-label="UIUX 治理稽核">
        {/* Header */}
        <div
          className="sticky top-0 z-10 border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: '#fff' }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: '#003262' }} />
            <div>
              <p className="text-sm font-bold text-slate-800">UIUX 治理稽核</p>
              <p className="text-[10px] text-slate-400">Anti-Collapse Spec v1.0</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={exportReport}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              title="匯出稽核報告"
            >
              <Download size={14} />
            </button>
            <button
              onClick={resetAll}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              title="重置所有結果"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="px-4 py-4 border-b border-slate-100" style={{ background: '#f8fafc' }}>
          <div className="flex items-center gap-4">
            <ScoreRing score={score} size={80} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-600 mb-2">稽核統計</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: passCount, l: '通過', c: '#22c55e' },
                  { v: warnCount, l: '警告', c: '#f59e0b' },
                  { v: failCount, l: '失敗', c: '#ef4444' },
                ].map(s => (
                  <div key={s.l} className="bg-white rounded-lg p-2 text-center border border-slate-100">
                    <p className="text-lg font-bold" style={{ color: s.c }}>{s.v}</p>
                    <p className="text-[10px] text-slate-400">{s.l}</p>
                  </div>
                ))}
              </div>
              {savedAt && (
                <p className="text-[10px] text-slate-400 mt-1.5">
                  上次儲存：{savedAt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2">
          {([
            { id: 'audit', label: '規則稽核', icon: <ShieldCheck size={12}/> },
            { id: 'pages', label: '頁面清單', icon: <Eye size={12}/> },
            { id: 'rules', label: '類別分析', icon: <BarChart3 size={12}/> },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-all -mb-px ${
                activeTab === t.id
                  ? 'border-[#003262] text-[#003262]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="p-3 space-y-3">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value as any)}
                className="text-xs border border-slate-200 rounded-lg px-2 h-8 focus:outline-none focus:ring-1 focus:ring-[#003262]"
              >
                <option value="all">全部類別</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="text-xs border border-slate-200 rounded-lg px-2 h-8 focus:outline-none focus:ring-1 focus:ring-[#003262]"
              >
                <option value="all">全部狀態</option>
                <option value="pass">通過</option>
                <option value="warn">警告</option>
                <option value="fail">失敗</option>
                <option value="skip">跳過</option>
              </select>
              <span className="text-[11px] text-slate-400 self-center">
                {filteredRules.length} 條規則
              </span>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              {filteredRules.map(rule => (
                <RuleItem
                  key={rule.id}
                  rule={rule}
                  result={auditResults.find(r => r.ruleId === rule.id)}
                  onSetStatus={setStatus}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="p-3 space-y-2">
            <p className="text-xs text-slate-400 px-1">
              {PAGE_REGISTRY.length} 個已登錄頁面
            </p>
            {PAGE_REGISTRY.map(page => (
              <div
                key={page.id}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-slate-700 truncate">{page.name}</span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                      style={{
                        background: page.priority === 'core' ? '#EBF2FA' :
                                    page.priority === 'high' ? '#fef3c7' : '#f1f5f9',
                        color: page.priority === 'core' ? '#003262' :
                               page.priority === 'high' ? '#92400e' : '#64748b',
                      }}
                    >
                      {page.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">{page.path}</span>
                    <span
                      className="text-[9px] px-1 py-0.5 rounded"
                      style={{ background: '#f1f5f9', color: '#64748b' }}
                    >
                      {page.template}
                    </span>
                  </div>
                </div>
                <span
                  className="text-[9px] font-medium px-2 py-1 rounded-full"
                  style={{
                    background: '#EBF2FA',
                    color: '#003262',
                    flexShrink: 0,
                  }}
                >
                  {page.module}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Category Analysis Tab */}
        {activeTab === 'rules' && (
          <div className="p-3 space-y-3">
            {categoryStats.map(cat => (
              <div key={cat.cat} className="bg-white border border-slate-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: cat.color }}
                    />
                    <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{cat.total} 條</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: getScoreColor(cat.score) }}
                    >
                      {cat.score}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.score}%`, background: cat.color }}
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  {(['pass', 'warn', 'fail', 'skip'] as AuditStatus[]).map(s => {
                    const count = AUDIT_RULES
                      .filter(r => r.category === cat.cat as AuditCategory)
                      .filter(r => (results[r.id] ?? 'skip') === s)
                      .length;
                    if (!count) return null;
                    return (
                      <div key={s} className="flex items-center gap-1">
                        {STATUS_ICONS[s]}
                        <span className="text-[11px] text-slate-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Governance Principles */}
            <div className="bg-[#EBF2FA] border border-[#D4E4F7] rounded-xl p-3 mt-4">
              <p className="text-xs font-bold text-[#003262] mb-2 flex items-center gap-1.5">
                <Clipboard size={12} /> 治理核心原則
              </p>
              <ul className="space-y-1.5">
                {[
                  '一致性 > 局部炫技',
                  '可理解性 > 裝飾性',
                  '主任務 > 次要資訊',
                  '模板化 > 自由拼接',
                  '狀態完整性 > 靜態美觀',
                  '工程可實作 > 抽象概念',
                ].map((p, i) => (
                  <li key={i} className="text-[11px] text-[#005DAA] flex items-start gap-1.5">
                    <span className="text-[#FDB515] font-bold mt-0.5">→</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}