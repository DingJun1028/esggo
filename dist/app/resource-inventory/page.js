'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
const resources = [
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
    { name: 'NoCodeBackend (NCB)', category: 'Backend', type: 'Database', status: 'available', notes: 'Serverless DB + Auth + RLS (取代 Supabase)' },
    { name: 'Better-Auth (NCB)', category: 'Backend', type: 'Auth', status: 'available', notes: '透過 NCB Proxy 進行會話管理' },
    { name: 'Supabase Edge Functions', category: 'Backend', type: 'Serverless', status: 'partial', notes: 'evidence-ai-audit 已部署，需手動設定 Webhook' },
    { name: 'Supabase Storage', category: 'Backend', type: 'Storage', status: 'partial', notes: 'evidence-vault bucket 已建立，需確認政策' },
    { name: 'Supabase', category: 'Backend', type: 'BaaS', status: 'unavailable', reason: '已全面遷移至 NoCodeBackend' },
    { name: 'Firebase', category: 'Backend', type: 'BaaS', status: 'unavailable', reason: '已全面遷移至 NoCodeBackend' },
    // AI
    { name: 'Google Gemini API', category: 'AI', type: 'LLM', status: 'partial', notes: '需填入 NEXT_PUBLIC_GEMINI_API_KEY', version: '@google/generative-ai' },
    { name: 'OpenRouter SDK', category: 'AI', type: 'LLM Gateway', status: 'available', notes: '多模型路由，需填入 OPENROUTER_API_KEY' },
    { name: 'OmniAgent Agent', category: 'AI', type: 'AI Agent', status: 'partial', notes: '頁面已建立，需本地安裝 OmniAgent Gateway' },
    { name: 'Genkit', category: 'AI', type: 'AI Workflow', status: 'unavailable', reason: '規劃中，尚未整合' },
    { name: 'Firebase Genkit', category: 'AI', type: 'AI Workflow', status: 'unavailable', reason: '規劃中，尚未整合' },
    { name: 'Vertex AI', category: 'AI', type: 'Cloud AI', status: 'unavailable', reason: '需 GCP 帳號，規劃中' },
    // Database Tables
    { name: 'esg_data', category: 'DB Tables', type: 'Core', status: 'available', notes: '已建置於 NCB，含 hash_lock' },
    { name: 'audit_logs', category: 'DB Tables', type: 'Core', status: 'available', notes: '已建置於 NCB，5T 不可篡改審計軌跡' },
    { name: 'evidence_vault', category: 'DB Tables', type: 'Core', status: 'available', notes: '已建置於 NCB，ZKP 狀態 + SHA-256' },
    { name: 'reading_room', category: 'DB Tables', type: 'Core', status: 'available', notes: '已建置於 NCB，永續情報文章' },
    { name: 'tasks', category: 'DB Tables', type: 'Ops', status: 'available', notes: '已建置於 NCB，Kanban 任務' },
    { name: 'company_profiles', category: 'DB Tables', type: 'Ops', status: 'available', notes: '已建置於 NCB，企業基本資料' },
    { name: 'digital_twins', category: 'DB Tables', type: 'Ops', status: 'available', notes: '已建置於 NCB，知識倉庫 + Moral DNA' },
    { name: 'environmental_data', category: 'DB Tables', type: 'ESG', status: 'available', notes: '已建置於 NCB，GHG/能源/水/廢棄物' },
    { name: 'social_metrics', category: 'DB Tables', type: 'ESG', status: 'available', notes: '已建置於 NCB，勞工/安全/培訓/供應鏈' },
    { name: 'governance_metrics', category: 'DB Tables', type: 'ESG', status: 'available', notes: '已建置於 NCB，董事會/誠信/稅務/風險' },
    { name: 'roadmap_milestones', category: 'DB Tables', type: 'Strategy', status: 'available', notes: '已建置於 NCB，淨零里程碑' },
    { name: 'advisory_sessions', category: 'DB Tables', type: 'AI', status: 'available', notes: '已建置於 NCB，AI 諮詢對話記錄' },
    { name: 'published_reports', category: 'DB Tables', type: 'Output', status: 'available', notes: '已建置於 NCB，已發布永續報告書' },
    { name: 'health_check_results', category: 'DB Tables', type: 'Health', status: 'available', notes: '已建置於 NCB，企業健檢結果 + 90天路線圖' },
    { name: 'sustainwrite_sections', category: 'DB Tables', type: 'Output', status: 'available', notes: '已建置於 NCB' },
    { name: 'user_memory', category: 'DB Tables', type: 'Memory', status: 'available', notes: '已建置於 NCB' },
    { name: 'ai_memory', category: 'DB Tables', type: 'Memory', status: 'available', notes: '已建置於 NCB' },
    { name: 'ncba_session', category: 'DB Tables', type: 'Memory', status: 'available', notes: 'NCB 內建 Session 管理表 (取代 user_sessions)' },
    { name: 'twin_knowledge_base', category: 'DB Tables', type: 'AI', status: 'available', notes: '已建置於 NCB' },
    { name: 'stakeholders', category: 'DB Tables', type: 'ESG', status: 'available', notes: '已建置於 NCB' },
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
    { name: 'NCB_INSTANCE_ID', category: 'Env Vars', type: 'Required', status: 'available', notes: 'NoCodeBackend Instance ID' },
    { name: 'NCB_API_TOKEN', category: 'Env Vars', type: 'Required', status: 'available', notes: 'NoCodeBackend API Token' },
    { name: 'NCB_SECRET_KEY', category: 'Env Vars', type: 'Required', status: 'available', notes: 'NoCodeBackend HMAC Secret Key' },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', category: 'Env Vars', type: 'Optional', status: 'unavailable', reason: '已全面遷移至 NoCodeBackend' },
    { name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', category: 'Env Vars', type: 'Optional', status: 'unavailable', reason: '已全面遷移至 NoCodeBackend' },
    { name: 'NEXT_PUBLIC_GEMINI_API_KEY', category: 'Env Vars', type: 'Optional', status: 'partial', notes: '需從 Google AI Studio 取得' },
    { name: 'OPENROUTER_API_KEY', category: 'Env Vars', type: 'Optional', status: 'unavailable', reason: '尚未設定' },
    { name: 'OMNIAGENT_API_URL', category: 'Env Vars', type: 'Optional', status: 'unavailable', reason: '需本地啟動 OmniAgent Gateway' },
];
const categories = ['全部', ...Array.from(new Set(resources.map(r => r.category)))];
const statusLabels = {
    available: '可用',
    unavailable: '不可用',
    partial: '部分可用',
};
export default function ResourceInventoryPage() {
    const [selectedCat, setSelectedCat] = useState('全部');
    const [selectedStatus, setSelectedStatus] = useState('全部');
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
    return (_jsxs("div", { className: "page-container", children: [_jsxs("div", { className: "page-header", children: [_jsx("div", { className: "page-header-row", children: _jsxs("div", { children: [_jsx("h1", { className: "page-title", children: "\u7CFB\u7D71\u8CC7\u6E90\u6E05\u55AE" }), _jsx("p", { className: "page-subtitle", children: "ESG GO \u5584\u5411\u6C38\u7E8C \u00B7 \u5168\u5E73\u53F0\u8CC7\u6E90\u76E4\u9EDE \u00B7 \u53EF\u7528\u6027\u72C0\u614B\u6A19\u8A18" })] }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }, children: [_jsx("div", { className: "card", style: { border: '1px solid #bbf7d0' }, children: _jsxs("div", { className: "card-body", style: { display: 'flex', alignItems: 'center', gap: 14, padding: 20 }, children: [_jsx("div", { style: { width: 44, height: 44, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(CheckCircle, { size: 22, color: "#16a34a" }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 28, fontWeight: 800, color: '#16a34a', letterSpacing: '-0.04em' }, children: counts.available }), _jsx("div", { style: { fontSize: 13, color: '#64748b', fontWeight: 600 }, children: "\u53EF\u7528\u8CC7\u6E90" })] })] }) }), _jsx("div", { className: "card", style: { border: '1px solid #fde68a' }, children: _jsxs("div", { className: "card-body", style: { display: 'flex', alignItems: 'center', gap: 14, padding: 20 }, children: [_jsx("div", { style: { width: 44, height: 44, borderRadius: 10, background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(AlertTriangle, { size: 22, color: "#d97706" }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 28, fontWeight: 800, color: '#d97706', letterSpacing: '-0.04em' }, children: counts.partial }), _jsx("div", { style: { fontSize: 13, color: '#64748b', fontWeight: 600 }, children: "\u90E8\u5206\u53EF\u7528" })] })] }) }), _jsx("div", { className: "card", style: { border: '1px solid #fecaca' }, children: _jsxs("div", { className: "card-body", style: { display: 'flex', alignItems: 'center', gap: 14, padding: 20 }, children: [_jsx("div", { style: { width: 44, height: 44, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(XCircle, { size: 22, color: "#dc2626" }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 28, fontWeight: 800, color: '#dc2626', letterSpacing: '-0.04em' }, children: counts.unavailable }), _jsx("div", { style: { fontSize: 13, color: '#64748b', fontWeight: 600 }, children: "\u4E0D\u53EF\u7528" })] })] }) })] })] }), _jsxs("div", { style: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }, children: [_jsxs("div", { className: "search-bar", style: { flex: '1 1 240px', maxWidth: 320 }, children: [_jsx(Search, { size: 15, className: "search-icon" }), _jsx("input", { placeholder: "\u641C\u5C0B\u8CC7\u6E90\u540D\u7A31...", value: search, onChange: e => setSearch(e.target.value) })] }), _jsx("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap' }, children: ['全部', 'available', 'partial', 'unavailable'].map(s => (_jsx("button", { className: `chip ${selectedStatus === s ? 'active' : ''}`, onClick: () => setSelectedStatus(s), children: s === '全部' ? '全部狀態' : statusLabels[s] || s }, s))) })] }), _jsx("div", { className: "tabs", children: categories.map(cat => (_jsx("button", { className: `tab-item ${selectedCat === cat ? 'active' : ''}`, onClick: () => setSelectedCat(cat), children: cat }, cat))) }), _jsxs("div", { className: "card", children: [_jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { className: "data-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u8CC7\u6E90\u540D\u7A31" }), _jsx("th", { children: "\u5206\u985E" }), _jsx("th", { children: "\u985E\u578B" }), _jsx("th", { children: "\u7248\u672C" }), _jsx("th", { children: "\u53EF\u7528\u6027" }), _jsx("th", { children: "\u5099\u8A3B / \u539F\u56E0" })] }) }), _jsxs("tbody", { children: [filtered.map((r, i) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("span", { style: {
                                                            fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                                                            color: r.status === 'unavailable' ? '#94a3b8' : '#1e293b',
                                                            textDecoration: r.status === 'unavailable' ? 'line-through' : 'none',
                                                        }, children: r.name }) }), _jsx("td", { children: _jsx("span", { className: "badge badge-blue", children: r.category }) }), _jsx("td", { children: _jsx("span", { className: "badge badge-gray", children: r.type }) }), _jsx("td", { style: { fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b' }, children: r.version || '—' }), _jsxs("td", { children: [r.status === 'available' && (_jsxs("span", { style: { display: 'inline-flex', alignItems: 'center', gap: 5, color: '#16a34a', fontWeight: 600, fontSize: 13 }, children: [_jsx(CheckCircle, { size: 14 }), " \u53EF\u7528"] })), r.status === 'partial' && (_jsxs("span", { style: { display: 'inline-flex', alignItems: 'center', gap: 5, color: '#d97706', fontWeight: 600, fontSize: 13 }, children: [_jsx(AlertTriangle, { size: 14 }), " \u90E8\u5206\u53EF\u7528"] })), r.status === 'unavailable' && (_jsxs("span", { style: { display: 'inline-flex', alignItems: 'center', gap: 5, color: '#dc2626', fontWeight: 600, fontSize: 13 }, children: [_jsx(XCircle, { size: 14 }), " \u4E0D\u53EF\u7528"] }))] }), _jsx("td", { style: { fontSize: 12, color: '#64748b', maxWidth: 280 }, children: r.reason ? _jsx("span", { style: { color: '#b91c1c' }, children: r.reason }) : r.notes || '—' })] }, i))), filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, children: _jsx("div", { className: "empty-state", children: _jsx("div", { className: "empty-state-title", children: "\u7121\u7B26\u5408\u689D\u4EF6\u7684\u8CC7\u6E90" }) }) }) }))] })] }) }), _jsx("div", { className: "card-footer", children: _jsxs("span", { style: { fontSize: 12, color: '#94a3b8' }, children: ["\u5171 ", filtered.length, " \u9805\u8CC7\u6E90 \u00B7 \u7E3D\u8A08 ", resources.length, " \u9805"] }) })] })] }));
}
//# sourceMappingURL=page.js.map