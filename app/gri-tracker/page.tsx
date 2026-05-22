'use client';
import { useState, useMemo } from 'react';
import {
  CheckCircle, Circle, AlertCircle, Search, Filter,
  ChevronDown, ChevronRight, Shield, Hash, FileText,
  Download, BarChart3, Leaf, Users, Building2, Globe
} from 'lucide-react';

interface GRIItem {
  code: string;
  title: string;
  titleZh: string;
  category: 'universal' | 'environmental' | 'social' | 'governance';
  required: boolean;
  status: 'completed' | 'in_progress' | 'pending' | 'na';
  completeness: number;
  dataPoints: string[];
  evidenceRequired: string[];
  formula?: string;
  unit?: string;
  notes: string;
}

const GRI_ITEMS: GRIItem[] = [
  // Universal Standards
  { code: 'GRI 2-1', title: 'Organizational details', titleZh: '組織詳情', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['法定名稱', '所有權性質', '法律型態', '總部所在地'], evidenceRequired: ['公司登記證明', '年報封面'], notes: '已完成' },
  { code: 'GRI 2-2', title: 'Entities included in the organization\'s sustainability reporting', titleZh: '永續報告涵蓋實體', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['合併報告範疇', '子公司清單', '排除說明'], evidenceRequired: ['組織架構圖', '子公司清單'], notes: '' },
  { code: 'GRI 2-3', title: 'Reporting period, frequency and contact point', titleZh: '報告期間、頻率與聯絡點', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['報告期間', '發布日期', '聯絡資訊'], evidenceRequired: ['報告書封面'], notes: '' },
  { code: 'GRI 2-4', title: 'Restatements of information', titleZh: '資訊更正說明', category: 'universal', required: false, status: 'na', completeness: 0, dataPoints: ['更正原因', '更正內容', '影響說明'], evidenceRequired: [], notes: '首次發布，無需更正' },
  { code: 'GRI 2-5', title: 'External assurance', titleZh: '外部確信', category: 'universal', required: true, status: 'in_progress', completeness: 60, dataPoints: ['確信機構名稱', '確信範圍', '確信聲明'], evidenceRequired: ['第三方查證報告'], notes: '等待查證機構回覆' },
  { code: 'GRI 2-6', title: 'Activities, value chain and other business relationships', titleZh: '活動、價值鏈及其他業務關係', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['主要業務', '供應鏈描述', '主要市場'], evidenceRequired: ['年報'], notes: '' },
  { code: 'GRI 2-7', title: 'Employees', titleZh: '員工', category: 'universal', required: true, status: 'in_progress', completeness: 75, dataPoints: ['全職員工數', '兼職員工數', '男性員工數', '女性員工數'], evidenceRequired: ['人資系統報表', '薪資冊'], formula: '員工總數 = 全職人數 + 兼職人數', unit: '人', notes: '兼職數據待確認' },
  { code: 'GRI 2-9', title: 'Governance structure and composition', titleZh: '治理結構與組成', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['董事會人數', '獨立董事比例', '女性董事比例'], evidenceRequired: ['董事會名冊', '公司章程'], notes: '' },
  { code: 'GRI 2-22', title: 'Statement on sustainable development strategy', titleZh: '永續發展策略聲明', category: 'universal', required: true, status: 'pending', completeness: 0, dataPoints: ['CEO/董事長簽署聲明'], evidenceRequired: ['高階主管簽署函'], notes: '待高階主管審閱簽署' },
  { code: 'GRI 2-23', title: 'Policy commitments', titleZh: '政策承諾', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['人權政策', '環境政策', '反腐敗政策'], evidenceRequired: ['各項政策文件'], notes: '' },
  { code: 'GRI 2-29', title: 'Approach to stakeholder engagement', titleZh: '利害關係人議合方式', category: 'universal', required: true, status: 'in_progress', completeness: 50, dataPoints: ['識別方法', '選擇依據', '議合活動'], evidenceRequired: ['利害關係人調查問卷', '議合紀錄'], notes: '問卷設計中' },
  { code: 'GRI 3-1', title: 'Process to determine material topics', titleZh: '重大議題決定過程', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['評估方法', '利害關係人意見', '審查結果'], evidenceRequired: ['重大性評估報告'], notes: '' },
  { code: 'GRI 3-2', title: 'List of material topics', titleZh: '重大議題清單', category: 'universal', required: true, status: 'completed', completeness: 100, dataPoints: ['重大議題名稱', '範圍說明', '邊界描述'], evidenceRequired: ['重大性矩陣'], notes: '' },
  // Environmental
  { code: 'GRI 302-1', title: 'Energy consumption within the organization', titleZh: '組織內部能源消耗', category: 'environmental', required: true, status: 'in_progress', completeness: 80, dataPoints: ['非再生燃料(GJ)', '再生燃料(GJ)', '電力消耗(GJ)', '總能源(GJ)'], evidenceRequired: ['台電帳單', '燃料採購發票'], formula: '總能源消耗(GJ) = 燃料能源 + 外購電力(kWh × 0.0036)', unit: 'GJ', notes: '12月數據待補' },
  { code: 'GRI 302-3', title: 'Energy intensity', titleZh: '能源密度', category: 'environmental', required: false, status: 'pending', completeness: 0, dataPoints: ['能源密度比率', '選用基準值'], evidenceRequired: ['302-1 數據', '營業額'], formula: '能源密度 = 總能源消耗(GJ) / 營收(百萬元)', unit: 'GJ/百萬元', notes: '' },
  { code: 'GRI 303-1', title: 'Interactions with water as a shared resource', titleZh: '水資源作為共有資源的互動', category: 'environmental', required: true, status: 'pending', completeness: 20, dataPoints: ['取水區域', '水資源壓力評估', '用水影響'], evidenceRequired: ['水權狀', '水質檢測報告'], notes: '環安衛部門提供中' },
  { code: 'GRI 305-1', title: 'Direct (Scope 1) GHG emissions', titleZh: '直接（範疇一）溫室氣體排放', category: 'environmental', required: true, status: 'in_progress', completeness: 85, dataPoints: ['CO₂(tCO₂e)', 'CH₄(tCO₂e)', 'N₂O(tCO₂e)', '合計(tCO₂e)'], evidenceRequired: ['ISO 14064-1 盤查清冊', '冷媒填充紀錄'], formula: '範疇一 = Σ(活動數據 × 排放係數)', unit: 'tCO₂e', notes: '冷媒數據待補' },
  { code: 'GRI 305-2', title: 'Energy indirect (Scope 2) GHG emissions', titleZh: '能源間接（範疇二）溫室氣體排放', category: 'environmental', required: true, status: 'completed', completeness: 100, dataPoints: ['外購電力排放(tCO₂e)', '電力排放係數'], evidenceRequired: ['台電帳單', '排放係數資料'], formula: '範疇二 = 用電度數(kWh) × 電力排放係數(tCO₂e/kWh)', unit: 'tCO₂e', notes: '' },
  { code: 'GRI 305-4', title: 'GHG emissions intensity', titleZh: '溫室氣體排放密度', category: 'environmental', required: false, status: 'pending', completeness: 0, dataPoints: ['排放密度比率', '分母說明'], evidenceRequired: ['305-1', '305-2 數據'], formula: '排放密度 = (範疇一+範疇二) / 選定分母', unit: 'tCO₂e/百萬元', notes: '' },
  { code: 'GRI 306-3', title: 'Waste generated', titleZh: '廢棄物產生', category: 'environmental', required: true, status: 'in_progress', completeness: 60, dataPoints: ['有害廢棄物(噸)', '一般廢棄物(噸)', '廢棄物類型'], evidenceRequired: ['廢棄物清運聯單', '回收商執照'], notes: '數據整合中' },
  // Social
  { code: 'GRI 401-1', title: 'New employee hires and employee turnover', titleZh: '新進員工與員工離職', category: 'social', required: true, status: 'in_progress', completeness: 70, dataPoints: ['新進人數', '離職人數', '流動率%'], evidenceRequired: ['人資系統報表'], formula: '離職率 = 離職人數 / 期初員工數 × 100%', unit: '%', notes: '按年齡/性別細分待補' },
  { code: 'GRI 403-2', title: 'Hazard identification, risk assessment, and incident investigation', titleZh: '危害識別、風險評估與事故調查', category: 'social', required: true, status: 'completed', completeness: 100, dataPoints: ['危害識別方法', '風險評估結果', '事故調查程序'], evidenceRequired: ['ISO 45001 文件', '職安委員會紀錄'], notes: '' },
  { code: 'GRI 403-9', title: 'Work-related injuries', titleZh: '職業傷害', category: 'social', required: true, status: 'completed', completeness: 100, dataPoints: ['傷害頻率(FR)', '嚴重率(SR)', '總工時'], evidenceRequired: ['勞保局職災申報單', '工安事件調查報告'], formula: 'FR = 事故件數 / 總工時 × 1,000,000', unit: '次/百萬工時', notes: '' },
  { code: 'GRI 404-1', title: 'Average hours of training per year per employee', titleZh: '每位員工年均受訓時數', category: 'social', required: true, status: 'pending', completeness: 30, dataPoints: ['平均受訓時數', '按性別/職級細分'], evidenceRequired: ['教育訓練簽到表', '線上課程完課紀錄'], formula: '平均受訓時數 = 總訓練時數 / 員工人數', unit: '小時/人', notes: '數據收集中' },
  { code: 'GRI 405-1', title: 'Diversity of governance bodies and employees', titleZh: '治理機構與員工多元化', category: 'social', required: true, status: 'in_progress', completeness: 65, dataPoints: ['董事會年齡分布', '員工性別比例', '少數族群比例'], evidenceRequired: ['董事會名冊', '人資系統'], notes: '年齡分組數據待確認' },
  { code: 'GRI 413-1', title: 'Operations with local community engagement', titleZh: '與當地社區議合之活動', category: 'social', required: true, status: 'completed', completeness: 100, dataPoints: ['社區投資金額', '受益人數', '活動類型'], evidenceRequired: ['社區活動紀錄', '公益支出憑證'], notes: '' },
  // Governance
  { code: 'GRI 205-1', title: 'Operations assessed for risks related to corruption', titleZh: '貪腐風險評估作業', category: 'governance', required: true, status: 'completed', completeness: 100, dataPoints: ['受評估作業比例', '確定有重大腐敗風險之作業'], evidenceRequired: ['內部稽核報告'], notes: '' },
  { code: 'GRI 205-3', title: 'Confirmed incidents of corruption and actions taken', titleZh: '已確認之貪腐事件及所採取之行動', category: 'governance', required: true, status: 'completed', completeness: 100, dataPoints: ['貪腐事件數', '涉案人員', '處置措施'], evidenceRequired: ['內稽報告', '法務裁罰通知書'], notes: '本年度無貪腐事件' },
  { code: 'GRI 207-1', title: 'Approach to tax', titleZh: '稅務方針', category: 'governance', required: true, status: 'pending', completeness: 40, dataPoints: ['稅務策略', '稅務治理架構', '稅務合規承諾'], evidenceRequired: ['稅務政策文件', '財務長聲明'], notes: '財務部門撰寫中' },
];

const CATEGORY_CONFIG = {
  universal: { label: '通用準則', color: '#003262', bg: '#dbeafe', icon: <Globe size={13} /> },
  environmental: { label: '環境面 E', color: '#16a34a', bg: '#dcfce7', icon: <Leaf size={13} /> },
  social: { label: '社會面 S', color: '#7c3aed', bg: '#ede9fe', icon: <Users size={13} /> },
  governance: { label: '治理面 G', color: '#d97706', bg: '#fef3c7', icon: <Building2 size={13} /> },
};

const STATUS_CONFIG = {
  completed:   { label: '已完成', color: '#16a34a', bg: '#dcfce7', icon: <CheckCircle size={12} /> },
  in_progress: { label: '進行中', color: '#d97706', bg: '#fef3c7', icon: <AlertCircle size={12} /> },
  pending:     { label: '待填報', color: '#6b7280', bg: '#f3f4f6', icon: <Circle size={12} /> },
  na:          { label: '不適用', color: '#9ca3af', bg: '#f9fafb', icon: <Circle size={12} /> },
};

function ProgressBar({ value, color = '#003262' }: { value: number; color?: string }) {
  return (
    <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
    </div>
  );
}

export default function GRITrackerPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [items, setItems] = useState<GRIItem[]>(GRI_ITEMS);
  const [editNotes, setEditNotes] = useState<{ [key: string]: string }>({});

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return item.code.toLowerCase().includes(q) || item.titleZh.toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, categoryFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const total = items.filter(i => i.status !== 'na').length;
    const completed = items.filter(i => i.status === 'completed').length;
    const inProgress = items.filter(i => i.status === 'in_progress').length;
    const pending = items.filter(i => i.status === 'pending').length;
    const avgCompletion = Math.round(items.reduce((acc, i) => acc + i.completeness, 0) / items.length);
    return { total, completed, inProgress, pending, avgCompletion };
  }, [items]);

  const updateStatus = (code: string, status: GRIItem['status']) => {
    setItems(prev => prev.map(i => {
      if (i.code !== code) return i;
      const completeness = status === 'completed' ? 100 : status === 'pending' ? 0 : status === 'na' ? 0 : i.completeness;
      return { ...i, status, completeness };
    }));
  };

  const exportCSV = () => {
    const rows = [
      ['代碼', '標題', '類別', '狀態', '完成度%', '數據點', '佐證文件', '備註'],
      ...items.map(i => [
        i.code, i.titleZh, CATEGORY_CONFIG[i.category].label,
        STATUS_CONFIG[i.status].label, i.completeness,
        i.dataPoints.join('|'), i.evidenceRequired.join('|'), i.notes,
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'GRI_Tracker.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>GRI 揭露追蹤器</h1>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>GRI Disclosure Tracker · GRI 2021 · 5T 誠信協議 · {items.length} 項指標</p>
        </div>
        <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: 'linear-gradient(135deg, #003262, #3b7ea1)', color: 'white', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          <Download size={14} />匯出 CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: '指標總數', value: stats.total, color: '#003262', sub: '項' },
          { label: '已完成', value: stats.completed, color: '#16a34a', sub: '項' },
          { label: '進行中', value: stats.inProgress, color: '#d97706', sub: '項' },
          { label: '待填報', value: stats.pending, color: '#dc2626', sub: '項' },
          { label: '平均完成度', value: `${stats.avgCompletion}%`, color: '#7c3aed', sub: '' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: '12px', border: '1.5px solid #e5e7eb', padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}<span style={{ fontSize: '13px', marginLeft: '2px' }}>{s.sub}</span></div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>整體 GRI 合規完成率</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#003262' }}>{stats.avgCompletion}%</span>
        </div>
        <ProgressBar value={stats.avgCompletion} color="#003262" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
            const catItems = items.filter(i => i.category === key);
            const catAvg = Math.round(catItems.reduce((acc, i) => acc + i.completeness, 0) / catItems.length);
            return (
              <div key={key} style={{ padding: '10px', background: cfg.bg, borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '5px', color: cfg.color }}>
                  {cfg.icon}
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: cfg.color }}>{catAvg}%</div>
                <ProgressBar value={catAvg} color={cfg.color} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋 GRI 代碼或名稱…" style={{ width: '100%', paddingLeft: '32px', padding: '9px 12px 9px 32px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'universal', 'environmental', 'social', 'governance'].map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid', borderColor: categoryFilter === cat ? '#003262' : '#e5e7eb', background: categoryFilter === cat ? '#003262' : 'white', color: categoryFilter === cat ? 'white' : '#374151', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {cat === 'all' ? '全部' : CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG].label}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none', background: 'white' }}>
          <option value="all">全部狀態</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #e5e7eb' }}>
              {['代碼', '指標名稱', '類別', '狀態', '完成度', '操作'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => {
              const catCfg = CATEGORY_CONFIG[item.category];
              const stCfg = STATUS_CONFIG[item.status];
              const isExpanded = expanded === item.code;
              return (
                <>
                  <tr
                    key={item.code}
                    style={{ borderBottom: '1px solid #f3f4f6', background: isExpanded ? '#f0f7ff' : idx % 2 === 0 ? 'white' : '#fafafa', cursor: 'pointer' }}
                    onClick={() => setExpanded(isExpanded ? null : item.code)}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#003262', fontFamily: 'monospace' }}>{item.code}</span>
                      {item.required && <span style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 5px', borderRadius: '3px', background: '#fef2f2', color: '#dc2626', fontWeight: 700 }}>必填</span>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>{item.titleZh}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{item.title}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: catCfg.bg, color: catCfg.color }}>
                        {catCfg.icon}{catCfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: stCfg.bg, color: stCfg.color }}>
                        {stCfg.icon}{stCfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', minWidth: '120px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1 }}><ProgressBar value={item.completeness} color={catCfg.color} /></div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: catCfg.color, minWidth: '32px', textAlign: 'right' }}>{item.completeness}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isExpanded ? <ChevronDown size={14} color="#9ca3af" /> : <ChevronRight size={14} color="#9ca3af" />}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${item.code}-detail`}>
                      <td colSpan={6} style={{ padding: '0' }}>
                        <div style={{ padding: '20px 24px', background: '#f8faff', borderBottom: '1.5px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                          {/* Data Points */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>需填報數據點</div>
                            {item.dataPoints.map((dp, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '12px', color: '#374151' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: catCfg.color, flexShrink: 0 }} />
                                {dp}
                              </div>
                            ))}
                            {item.formula && (
                              <div style={{ marginTop: '10px', padding: '8px 10px', background: '#fff7ed', borderRadius: '7px', border: '1px solid #fed7aa' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: '#92400e', marginBottom: '3px' }}>計算公式</div>
                                <code style={{ fontSize: '11px', color: '#374151', fontFamily: 'monospace' }}>{item.formula}</code>
                                {item.unit && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#9ca3af' }}>({item.unit})</span>}
                              </div>
                            )}
                          </div>
                          {/* Evidence */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>所需佐證文件</div>
                            {item.evidenceRequired.length > 0 ? item.evidenceRequired.map((ev, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '12px', color: '#374151' }}>
                                <Shield size={10} color="#22c55e" style={{ flexShrink: 0 }} />
                                {ev}
                              </div>
                            )) : <span style={{ fontSize: '12px', color: '#9ca3af' }}>無需額外佐證</span>}
                            <div style={{ marginTop: '12px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>備註</div>
                              <input
                                value={editNotes[item.code] ?? item.notes}
                                onChange={e => setEditNotes(prev => ({ ...prev, [item.code]: e.target.value }))}
                                placeholder="填寫備註…"
                                style={{ width: '100%', padding: '6px 10px', border: '1.5px solid #e5e7eb', borderRadius: '7px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>
                          {/* Actions */}
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>更新狀態</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                <button
                                  key={k}
                                  onClick={e => { e.stopPropagation(); updateStatus(item.code, k as GRIItem['status']); }}
                                  style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid', borderColor: item.status === k ? v.color : '#e5e7eb', background: item.status === k ? v.bg : 'white', color: item.status === k ? v.color : '#374151', fontSize: '12px', fontWeight: item.status === k ? 700 : 500, cursor: 'pointer', textAlign: 'left' }}
                                >
                                  {v.icon}{v.label}
                                </button>
                              ))}
                            </div>
                            <div style={{ marginTop: '10px', padding: '8px 10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                              <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>5T 誠信標籤</div>
                              <code style={{ fontSize: '11px', color: '#003262', fontWeight: 700 }}>
                                {item.status === 'completed' ? 'T1+T4+T5 ✓' : item.status === 'in_progress' ? 'T1+T3 →' : 'T1 ⏳'}
                              </code>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
            <BarChart3 size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <div style={{ fontSize: '14px', fontWeight: 600 }}>找不到符合條件的指標</div>
          </div>
        )}
      </div>
    </div>
  );
}