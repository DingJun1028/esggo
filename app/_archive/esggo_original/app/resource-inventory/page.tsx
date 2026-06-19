'use client';
import { useState } from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, Database, Code, Globe,
  Cpu, Shield, BookOpen, Zap, Search, Filter
} from 'lucide-react';

type ResourceStatus = 'available' | 'unavailable' | 'partial';

interface Resource {
  name: string;
  category: string;
  type: string;
  status: ResourceStatus;
  reason?: string;
  version?: string;
  notes?: string;
}

const resources: Resource[] = [
  // Frontend
  { name: 'Next.js 15', category: 'Frontend', type: 'Framework', status: 'available', version: '15.0.3', notes: 'App Router, Server Components' },
  { name: 'React 19', category: 'Frontend', type: 'Library', status: 'available', version: '19.0.0' },
  { name: 'TypeScript', category: 'Frontend', type: 'Language', status: 'available', version: '5.3.3' },
  { name: 'Tailwind CSS', category: 'Frontend', type: 'Styling', status: 'available', version: '3.4.1' },
  { name: 'Framer Motion', category: 'Frontend', type: 'Animation', status: 'available', version: '11.15.0' },
  { name: 'Recharts', category: 'Frontend', type: 'Charts', status: 'available', version: '2.13.3' },
  { name: 'Lucide React', category: 'Frontend', type: 'Icons', status: 'available', version: '0.468.0' },
  { name: 'Zustand', category: 'Frontend', type: 'State', status: 'available', version: '4.5.5' },
  { name: 'date-fns', category: 'Frontend', type: 'Utility', status: 'available', version: '3.3.1' },
  { name: 'clsx', category: 'Frontend', type: 'Utility', status: 'available', version: '2.1.0' },
  { name: 'shadcn/ui', category: 'Frontend', type: 'UI Library', status: 'unavailable', reason: '未安裝，使用自訂設計系統替代' },
  { name: 'Radix UI', category: 'Frontend', type: 'UI Primitives', status: 'unavailable', reason: '未安裝' },
  { name: 'next-zksnark', category: 'Frontend', type: 'ZKP Library', status: 'unavailable', reason: '套件不存在，使用 Web Crypto API 模擬 ZKP' },
  // Backend
  { name: 'Supabase', category: 'Backend', type: 'Database', status: 'available', version: '2.39.0', notes: 'PostgreSQL + RLS + Realtime' },
  { name: 'Supabase SSR', category: 'Backend', type: 'Auth Helper', status: 'available', version: '0.1.0' },
  { name: 'Supabase Edge Functions', category: 'Backend', type: 'Serverless', status: 'partial', notes: 'evidence-ai-audit 已部署，需手動設定 Webhook' },
  { name: 'Supabase Realtime', category: 'Backend', type: 'Realtime', status: 'available', notes: 'audit_logs, tasks 表已加入 publication' },
  { name: 'Supabase Storage', category: 'Backend', type: 'Storage', status: 'partial', notes: 'evidence-vault bucket 已建立，需確認政策' },
  { name: 'Supabase Auth', category: 'Backend', type: 'Auth', status: 'partial', notes: 'login 頁面已建立，OAuth callback 需設定' },
  { name: 'Prisma ORM', category: 'Backend', type: 'ORM', status: 'unavailable', reason: '已移除，使用 Supabase JS Client 直接操作' },
  { name: 'Firebase', category: 'Backend', type: 'BaaS', status: 'unavailable', reason: '套件安裝但未實際串接，優先使用 Supabase' },
  // AI
  { name: 'Google Gemini API', category: 'AI', type: 'LLM', status: 'partial', notes: '需填入 NEXT_PUBLIC_GEMINI_API_KEY', version: '@google/generative-ai' },
  { name: 'OpenRouter SDK', category: 'AI', type: 'LLM Gateway', status: 'available', notes: '多模型路由，需填入 OPENROUTER_API_KEY' },
  { name: 'OmniAgent Agent', category: 'AI', type: 'AI Agent', status: 'partial', notes: '頁面已建立，需本地安裝 OmniAgent Gateway' },
  { name: 'Genkit', category: 'AI', type: 'AI Workflow', status: 'unavailable', reason: '規劃中，尚未整合' },
  { name: 'Firebase Genkit', category: 'AI', type: 'AI Workflow', status: 'unavailable', reason: '規劃中，尚未整合' },
  { name: 'Vertex AI', category: 'AI', type: 'Cloud AI', status: 'unavailable', reason: '需 GCP 帳號，規劃中' },
  // Database Tables
  { name: 'esg_data', category: 'DB Tables', type: 'Core', status: 'available', notes: 'E/S/G 指標數據，含 hash_lock' },
  { name: 'audit_logs', category: 'DB Tables', type: 'Core', status: 'available', notes: '5T 不可篡改審計軌跡，含 company_id' },
  { name: 'evidence_vault', category: 'DB Tables', type: 'Core', status: 'available', notes: 'ZKP 狀態 + SHA-256 + Storage 連結' },
  { name: 'reading_room', category: 'DB Tables', type: 'Core', status: 'available', notes: '永續情報文章' },
  { name: 'tasks', category: 'DB Tables', type: 'Ops', status: 'available', notes: 'Kanban 任務，含 company_id' },
  { name: 'company_profiles', category: 'DB Tables', type: 'Ops', status: 'available', notes: '企業基本資料' },
  { name: 'digital_twins', category: 'DB Tables', type: 'Ops', status: 'available', notes: '知識倉庫 + Moral DNA' },
  { name: 'environmental_data', category: 'DB Tables', type: 'ESG', status: 'available', notes: 'GHG/能源/水/廢棄物' },
  { name: 'social_metrics', category: 'DB Tables', type: 'ESG', status: 'available', notes: '勞工/安全/培訓/供應鏈' },
  { name: 'governance_metrics', category: 'DB Tables', type: 'ESG', status: 'available', notes: '董事會/誠信/稅務/風險' },
  { name: 'roadmap_milestones', category: 'DB Tables', type: 'Strategy', status: 'available', notes: '淨零里程碑' },
  { name: 'advisory_sessions', category: 'DB Tables', type: 'AI', status: 'available', notes: 'AI 諮詢對話記錄' },
  { name: 'published_reports', category: 'DB Tables', type: 'Output', status: 'available', notes: '已發布永續報告書' },
  { name: 'health_check_results', category: 'DB Tables', type: 'Health', status: 'available', notes: '企業健檢結果 + 90天路線圖' },
  { name: 'sustainwrite_sections', category: 'DB Tables', type: 'Output', status: 'partial', notes: '需執行 supabase_sustainwrite.sql' },
  { name: 'user_memory', category: 'DB Tables', type: 'Memory', status: 'partial', notes: '需執行 supabase_memory_fix.sql' },
  { name: 'ai_memory', category: 'DB Tables', type: 'Memory', status: 'partial', notes: '需執行 supabase_memory_fix.sql' },
  { name: 'user_sessions', category: 'DB Tables', type: 'Memory', status: 'partial', notes: '需執行 supabase_memory_fix.sql' },
  { name: 'twin_knowledge_base', category: 'DB Tables', type: 'AI', status: 'partial', notes: '已在 Supabase 確認存在' },
  { name: 'stakeholders', category: 'DB Tables', type: 'ESG', status: 'partial', notes: '需執行 supabase_setup_v7_stakeholders.sql' },
  // Pages
  { name: '控制台 /', category: 'Pages', type: 'Core', status: 'available', notes: 'KPI 卡片 + 5T 協議 + 活動日誌' },
  { name: '永續撰寫 /editor', category: 'Pages', type: 'Core', status: 'available', notes: 'GRI 2021 章節式編輯器' },
  { name: '數位分身 /digital-twin', category: 'Pages', type: 'Core', status: 'available', notes: '6-tab 系統' },
  { name: '企業健檢 /health-check', category: 'Pages', type: 'Core', status: 'available', notes: '15 題評估 + 路線圖' },
  { name: '專家諮詢 /advisory', category: 'Pages', type: 'Core', status: 'available', notes: 'SPIRIT Personas AI 對話' },
  { name: '商情中心 /intelligence', category: 'Pages', type: 'Core', status: 'available', notes: 'ESG 法規 + 標竿 + 風險' },
  { name: '環境指揮 /environmental', category: 'Pages', type: 'ESG', status: 'available', notes: 'GHG/Energy/Water/Waste CRUD' },
  { name: '社會影響 /social', category: 'Pages', type: 'ESG', status: 'available' },
  { name: '公司治理 /governance', category: 'Pages', type: 'ESG', status: 'available' },
  { name: '重大性矩陣 /materiality', category: 'Pages', type: 'Governance', status: 'available' },
  { name: '專家模板 /templates', category: 'Pages', type: 'Governance', status: 'available' },
  { name: '審計日誌 /audit-log', category: 'Pages', type: 'Governance', status: 'available' },
  { name: '證據金庫 /vault', category: 'Pages', type: 'Governance', status: 'available', notes: 'ZKP + SHA-256 + 上傳 Modal' },
  { name: '淨零路線圖 /roadmap', category: 'Pages', type: 'Insights', status: 'available' },
  { name: '報告發布 /publish', category: 'Pages', type: 'Insights', status: 'available' },
  { name: '永續閱覽室 /reading-room', category: 'Pages', type: 'Insights', status: 'available' },
  { name: '永續智庫 /library', category: 'Pages', type: 'Insights', status: 'available' },
  { name: '永續財務 /finance', category: 'Pages', type: 'Insights', status: 'available' },
  { name: '供應鏈透明 /supply-chain', category: 'Pages', type: 'Insights', status: 'available' },
  { name: '利害關係人 /stakeholders', category: 'Pages', type: 'Insights', status: 'available' },
  { name: 'VerifyLink™ /audit-verify', category: 'Pages', type: 'Insights', status: 'available', notes: '真實 SHA-256 Web Crypto API' },
  { name: '永續學院 /academy', category: 'Pages', type: 'Academy', status: 'available' },
  { name: '顧問專區 /advisors', category: 'Pages', type: 'Academy', status: 'available' },
  { name: '代理專區 /agents', category: 'Pages', type: 'Academy', status: 'available', notes: '善向幣 GoodCoin 機制' },
  { name: '顧問服務 /consulting', category: 'Pages', type: 'Academy', status: 'available' },
  { name: 'AI 整合平台 /ai-platform', category: 'Pages', type: 'Academy', status: 'available' },
  { name: '任務中心 /tasks', category: 'Pages', type: 'System', status: 'available', notes: 'Kanban + Realtime' },
  { name: '企業管理 /profile', category: 'Pages', type: 'System', status: 'available' },
  { name: '整合中心 /api-setup', category: 'Pages', type: 'System', status: 'available' },
  { name: 'OmniAgent Swarm /swarm', category: 'Pages', type: 'System', status: 'available' },
  { name: 'OmniAgent Agent /omniagent-agent', category: 'Pages', type: 'System', status: 'available' },
  { name: '設計庫 /design-library', category: 'Pages', type: 'System', status: 'available' },
  { name: '系統狀態 /system-status', category: 'Pages', type: 'System', status: 'partial', notes: '頁面存在但資料動態化待完善' },
  { name: '聯盟入口 /alliance', category: 'Pages', type: 'System', status: 'partial', notes: '基本頁面，需完善 ZKP 驗算流程' },
  { name: 'OpenRouter AI /openrouter', category: 'Pages', type: 'System', status: 'partial', notes: '需填入 OPENROUTER_API_KEY' },
  { name: '軌跡壓縮 /trajectory-compressor', category: 'Pages', type: 'Research', status: 'partial' },
  { name: 'Atropos RL /tinker-atropos', category: 'Pages', type: 'Research', status: 'partial' },
  { name: '通知中心 /notifications', category: 'Pages', type: 'System', status: 'partial' },
  { name: '全域搜尋 /search', category: 'Pages', type: 'System', status: 'partial' },
  // Env Variables
  { name: 'NEXT_PUBLIC_SUPABASE_URL', category: 'Env Vars', type: 'Required', status: 'available', notes: 'https://yhwfmavnhaivvgzeuklx.supabase.co' },
  { name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', category: 'Env Vars', type: 'Required', status: 'available', notes: '已設定' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', category: 'Env Vars', type: 'Required', status: 'partial', notes: '請填入 service_role key' },
  { name: 'NEXT_PUBLIC_GEMINI_API_KEY', category: 'Env Vars', type: 'Optional', status: 'partial', notes: '需從 Google AI Studio 取得' },
  { name: 'OPENROUTER_API_KEY', category: 'Env Vars', type: 'Optional', status: 'unavailable', reason: '尚未設定' },
  { name: 'HERMES_API_URL', category: 'Env Vars', type: 'Optional', status: 'unavailable', reason: '需本地啟動 OmniAgent Gateway' },
];

const categories = ['全部', ...Array.from(new Set(resources.map(r => r.category)))];
const statusLabels: Record<ResourceStatus, string> = {
  available: '可用',
  unavailable: '不可用',
  partial: '部分可用',
};

export default function ResourceInventoryPage() {
  const [selectedCat, setSelectedCat] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState<string>('全部');
  const [search, setSearch] = useState('');

  const filtered = resources.filter(r => {
    const catMatch = selectedCat === '全部' || r.category === selectedCat;
    const statusMatch = selectedStatus === '全部' || r.status === selectedStatus;
    const searchMatch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.notes?.toLowerCase().includes(search.toLowerCase());
    return catMatch && statusMatch && searchMatch;
  });

  const counts = {
    available: resources.filter(r => r.status === 'available').length,
    partial: resources.filter(r => r.status === 'partial').length,
    unavailable: resources.filter(r => r.status === 'unavailable').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">系統資源清單</h1>
            <p className="page-subtitle">ESG GO 善向永續 · 全平台資源盤點 · 可用性狀態標記</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
          <div className="card" style={{ border: '1px solid #bbf7d0' }}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={22} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a', letterSpacing: '-0.04em' }}>{counts.available}</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>可用資源</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ border: '1px solid #fde68a' }}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="#d97706" />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#d97706', letterSpacing: '-0.04em' }}>{counts.partial}</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>部分可用</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ border: '1px solid #fecaca' }}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle size={22} color="#dc2626" />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626', letterSpacing: '-0.04em' }}>{counts.unavailable}</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>不可用</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: '1 1 240px', maxWidth: 320 }}>
          <Search size={15} className="search-icon" />
          <input placeholder="搜尋資源名稱..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['全部', 'available', 'partial', 'unavailable'].map(s => (
            <button key={s} className={`chip ${selectedStatus === s ? 'active' : ''}`} onClick={() => setSelectedStatus(s)}>
              {s === '全部' ? '全部狀態' : statusLabels[s as ResourceStatus] || s}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="tabs">
        {categories.map(cat => (
          <button key={cat} className={`tab-item ${selectedCat === cat ? 'active' : ''}`} onClick={() => setSelectedCat(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>資源名稱</th>
                <th>分類</th>
                <th>類型</th>
                <th>版本</th>
                <th>可用性</th>
                <th>備註 / 原因</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span style={{
                      fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                      color: r.status === 'unavailable' ? '#94a3b8' : '#1e293b',
                      textDecoration: r.status === 'unavailable' ? 'line-through' : 'none',
                    }}>
                      {r.name}
                    </span>
                  </td>
                  <td><span className="badge badge-blue">{r.category}</span></td>
                  <td><span className="badge badge-gray">{r.type}</span></td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b' }}>{r.version || '—'}</td>
                  <td>
                    {r.status === 'available' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#16a34a', fontWeight: 600, fontSize: 13 }}>
                        <CheckCircle size={14} /> 可用
                      </span>
                    )}
                    {r.status === 'partial' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#d97706', fontWeight: 600, fontSize: 13 }}>
                        <AlertTriangle size={14} /> 部分可用
                      </span>
                    )}
                    {r.status === 'unavailable' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#dc2626', fontWeight: 600, fontSize: 13 }}>
                        <XCircle size={14} /> 不可用
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 12, color: '#64748b', maxWidth: 280 }}>
                    {r.reason ? <span style={{ color: '#b91c1c' }}>{r.reason}</span> : r.notes || '—'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-state-title">無符合條件的資源</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer">
          <span style={{ fontSize: 12, color: '#94a3b8' }}>共 {filtered.length} 項資源 · 總計 {resources.length} 項</span>
        </div>
      </div>
    </div>
  );
}