'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Activity, Database, Code, Zap, CheckCircle, Play, Copy, RefreshCw, Terminal, BookOpen, GitBranch, Shield, Search, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
const SAMPLE_QUERIES = [
    {
        name: 'Dashboard Stats',
        category: 'Query',
        description: '獲取系統 KPI 統計數據',
        gri: 'GRI 2-1',
        query: `query DashboardStats {
  dashboardStats {
    complianceRate
    carbonEmissions
    griCoverage
    auditCount
    taskCount
    evidenceCount
    verifiedCount
    lastUpdated
  }
}`,
    },
    {
        name: 'ESG Metrics',
        category: 'Query',
        description: '查詢環境面 ESG 指標',
        gri: 'GRI 302-306',
        query: `query ESGMetrics {
  esgMetrics(category: "E") {
    id
    metricName
    metricValue
    unit
    griStandard
    verified
    hashLock
  }
}`,
    },
    {
        name: 'Evidence Vault',
        category: 'Query',
        description: '列出已驗證的佐證文件',
        gri: 'GRI 2-5',
        query: `query EvidenceFiles {
  evidenceFiles(status: "verified") {
    id
    fileName
    category
    griReference
    zkpProof
    hashLock
    createdAt
  }
}`,
    },
    {
        name: 'Audit Logs',
        category: 'Query',
        description: '查詢 5T 審計追蹤日誌',
        gri: 'T5 Trackable',
        query: `query AuditLogs {
  auditLogs(limit: 20) {
    id
    action
    userName
    t5Tag
    hashLock
    details
    createdAt
  }
}`,
    },
    {
        name: 'Create Task',
        category: 'Mutation',
        description: '建立新的 ESG 任務',
        gri: 'GRI 2-23',
        query: `mutation CreateTask {
  createTask(input: {
    title: "完成 GRI 305-1 碳盤查"
    priority: "critical"
    assignee: "環安衛主任"
    department: "環安衛"
    griReference: "GRI 305-1"
    dueDate: "2025-12-31"
  }) {
    id
    title
    status
    priority
    hashLock
    createdAt
  }
}`,
    },
    {
        name: 'Upsert ESG Metric',
        category: 'Mutation',
        description: '新增或更新 ESG 數據指標',
        gri: 'GRI 305-1',
        query: `mutation UpsertMetric {
  upsertESGMetric(input: {
    category: "E"
    metricName: "範疇一直接排放量"
    metricValue: 1250
    unit: "tCO2e"
    year: 2024
    griStandard: "GRI 305-1"
    sourceOrigin: "ISO 14064-1 盤查清冊"
  }) {
    id
    metricName
    metricValue
    hashLock
    verified
  }
}`,
    },
    {
        name: 'Verify Evidence',
        category: 'Mutation',
        description: 'ZKP 零知識證明驗算',
        gri: 'T4 Trustworthy',
        query: `mutation VerifyEvidence {
  verifyEvidence(
    id: "your-evidence-uuid"
    hashLock: "your-sha256-hash"
  ) {
    valid
    message
    hashMatch
    timestamp
  }
}`,
    },
    {
        name: 'GRI Disclosures',
        category: 'Query',
        description: '查詢 GRI 揭露項目狀態',
        gri: 'GRI 2021',
        query: `query GRIDisclosures {
  griDisclosures(status: "pending") {
    id
    code
    title
    category
    status
    department
    priority
    isNew
  }
}`,
    },
];
const SCHEMA_TYPES = [
    {
        name: 'DashboardStats',
        fields: ['complianceRate: Float!', 'carbonEmissions: Float!', 'griCoverage: Float!', 'auditCount: Int!', 'taskCount: Int!', 'evidenceCount: Int!', 'verifiedCount: Int!'],
        description: '系統 KPI 統計數據',
        color: '#003262',
    },
    {
        name: 'ESGMetric',
        fields: ['id: ID!', 'category: String!', 'metricName: String!', 'metricValue: Float', 'unit: String', 'griStandard: String', 'hashLock: String', 'verified: Boolean!'],
        description: 'ESG 指標數據節點',
        color: '#22c55e',
    },
    {
        name: 'EvidenceFile',
        fields: ['id: ID!', 'fileName: String!', 'status: String!', 'zkpProof: Boolean!', 'hashLock: String', 'griReference: String'],
        description: '5T 佐證文件節點',
        color: '#f59e0b',
    },
    {
        name: 'AuditLog',
        fields: ['id: ID!', 'action: String!', 'userName: String!', 't5Tag: String', 'hashLock: String', 'details: String'],
        description: 'T5 不可篡改審計日誌',
        color: '#8b5cf6',
    },
    {
        name: 'Task',
        fields: ['id: ID!', 'title: String!', 'status: String!', 'priority: String!', 'assignee: String', 'griReference: String', 'hashLock: String'],
        description: '跨部門 ESG 任務節點',
        color: '#3b7ea1',
    },
    {
        name: 'VerifyResult',
        fields: ['valid: Boolean!', 'message: String!', 'hashMatch: Boolean!', 'timestamp: String!'],
        description: 'ZKP 零知識驗算結果',
        color: '#ef4444',
    },
];
export default function ApolloStudioPage() {
    const [activeTab, setActiveTab] = useState('explorer');
    const [selectedQuery, setSelectedQuery] = useState(SAMPLE_QUERIES[0]);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState('checking');
    const [searchSchema, setSearchSchema] = useState('');
    const [expandedTypes, setExpandedTypes] = useState(new Set(['DashboardStats']));
    const [filterCategory, setFilterCategory] = useState('all');
    const checkApiStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: '{ dashboardStats { complianceRate } }' }),
            });
            if (res.ok)
                setApiStatus('online');
            else
                setApiStatus('offline');
        }
        catch {
            setApiStatus('offline');
        }
    }, []);
    useEffect(() => {
        checkApiStatus();
    }, [checkApiStatus]);
    const runQuery = async () => {
        setLoading(true);
        setResult('');
        try {
            const res = await fetch('/api/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: selectedQuery.query }),
            });
            const data = await res.json();
            setResult(JSON.stringify(data, null, 2));
        }
        catch (e) {
            setResult(JSON.stringify({ error: e.message }, null, 2));
        }
        finally {
            setLoading(false);
        }
    };
    const copyQuery = () => {
        navigator.clipboard.writeText(selectedQuery.query).catch(() => { });
    };
    const filteredQueries = SAMPLE_QUERIES.filter((q) => filterCategory === 'all' || q.category === filterCategory);
    const filteredTypes = SCHEMA_TYPES.filter((t) => !searchSchema || t.name.toLowerCase().includes(searchSchema.toLowerCase()) || t.description.includes(searchSchema));
    const toggleType = (name) => {
        setExpandedTypes((prev) => {
            const next = new Set(prev);
            if (next.has(name))
                next.delete(name);
            else
                next.add(name);
            return next;
        });
    };
    const roverCommands = [
        { step: '01', title: 'Install Rover CLI', cmd: 'curl -sSL https://rover.apollo.dev/nix/latest | sh', desc: '安裝 Apollo Rover CLI 工具' },
        { step: '02', title: 'Authenticate', cmd: 'rover config auth', desc: '使用 Apollo 個人 API Key 認證' },
        { step: '03', title: 'Introspect Schema', cmd: `rover graph introspect ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/graphql`, desc: '從本地端點擷取 Schema 定義' },
        { step: '04', title: 'Publish Schema', cmd: 'rover graph publish ESG-GO@current --schema lib/graphql/schema.graphql', desc: '發布 Schema 至 Apollo GraphOS Studio' },
        { step: '05', title: 'Check Schema', cmd: 'rover graph check ESG-GO@current --schema lib/graphql/schema.graphql', desc: '檢查 Schema 變更的破壞性影響' },
        { step: '06', title: 'Subgraph (Federation)', cmd: 'rover subgraph publish ESG-GO@current --name esg-core --schema lib/graphql/schema.graphql --routing-url /api/graphql', desc: '以 Federation 模式發布子圖' },
    ];
    return (_jsxs("div", { style: { padding: '24px', maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { background: 'linear-gradient(135deg, #003262 0%, #1a5276 100%)', borderRadius: '16px', padding: '28px 32px', marginBottom: '24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }, children: [_jsx("div", { style: { background: '#FDB515', borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Activity, { size: 22, color: "#003262" }) }), _jsx("h1", { style: { margin: 0, fontSize: '22px', fontWeight: 700 }, children: "Apollo Studio" }), _jsx("span", { style: { background: 'rgba(253,181,21,0.2)', color: '#FDB515', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }, children: "GraphQL API" })] }), _jsx("p", { style: { margin: 0, opacity: 0.75, fontSize: '14px' }, children: "ESG GO | 5T \u8AA0\u4FE1\u5354\u8B70 \u00B7 Type-Safe GraphQL \u00B7 Rover CLI \u6574\u5408" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px' }, children: [_jsx("div", { style: { width: '8px', height: '8px', borderRadius: '50%', background: apiStatus === 'online' ? '#22c55e' : apiStatus === 'offline' ? '#ef4444' : '#f59e0b', animation: apiStatus === 'checking' ? 'pulse 1s infinite' : 'none' } }), _jsx("span", { style: { fontSize: '13px', fontWeight: 600 }, children: apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Checking...' })] }), _jsx("button", { onClick: checkApiStatus, style: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }, children: _jsx(RefreshCw, { size: 16 }) })] })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }, children: [
                    { icon: Code, label: 'Operations', value: '3', sub: 'Query + Mutation + Sub', color: '#003262' },
                    { icon: Database, label: 'Types', value: `${SCHEMA_TYPES.length}`, sub: 'GraphQL Type Nodes', color: '#22c55e' },
                    { icon: Zap, label: 'Queries', value: `${SAMPLE_QUERIES.filter((q) => q.category === 'Query').length}`, sub: 'Read Operations', color: '#3b7ea1' },
                    { icon: GitBranch, label: 'Mutations', value: `${SAMPLE_QUERIES.filter((q) => q.category === 'Mutation').length}`, sub: 'Write Operations', color: '#f59e0b' },
                    { icon: Shield, label: '5T Protocol', value: 'Active', sub: 'Hash Lock + ZKP', color: '#8b5cf6' },
                ].map((stat) => (_jsxs("div", { style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsx("div", { style: { background: `${stat.color}15`, borderRadius: '8px', padding: '8px' }, children: _jsx(stat.icon, { size: 18, color: stat.color }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '18px', fontWeight: 700, color: '#1e293b' }, children: stat.value }), _jsx("div", { style: { fontSize: '11px', color: '#64748b' }, children: stat.sub })] })] }, stat.label))) }), _jsx("div", { style: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }, children: ['explorer', 'schema', 'rover', 'metrics'].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), style: { padding: '8px 20px', borderRadius: '8px', border: '1px solid', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', background: activeTab === tab ? '#003262' : '#fff', color: activeTab === tab ? '#fff' : '#64748b', borderColor: activeTab === tab ? '#003262' : '#e2e8f0' }, children: tab === 'explorer' ? '🚀 Explorer' : tab === 'schema' ? '📋 Schema Browser' : tab === 'rover' ? '🛸 Rover CLI' : '📊 Metrics' }, tab))) }), activeTab === 'explorer' && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }, children: [_jsxs("div", { style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }, children: [_jsx("div", { style: { padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '8px', flexWrap: 'wrap' }, children: ['all', 'Query', 'Mutation'].map((cat) => (_jsx("button", { onClick: () => setFilterCategory(cat), style: { padding: '4px 10px', borderRadius: '6px', border: '1px solid', fontSize: '11px', fontWeight: 600, cursor: 'pointer', background: filterCategory === cat ? '#003262' : '#f8fafc', color: filterCategory === cat ? '#fff' : '#64748b', borderColor: filterCategory === cat ? '#003262' : '#e2e8f0' }, children: cat === 'all' ? 'All' : cat }, cat))) }), _jsx("div", { style: { padding: '8px', maxHeight: '520px', overflowY: 'auto' }, children: filteredQueries.map((q) => (_jsxs("button", { onClick: () => setSelectedQuery(q), style: { width: '100%', textAlign: 'left', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '4px', background: selectedQuery.name === q.name ? '#f0f4ff' : 'transparent', transition: 'background 0.15s' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }, children: [_jsx("span", { style: { fontSize: '13px', fontWeight: 600, color: '#1e293b' }, children: q.name }), _jsx("span", { style: { fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: q.category === 'Query' ? '#dbeafe' : '#fef3c7', color: q.category === 'Query' ? '#1d4ed8' : '#92400e', fontWeight: 600 }, children: q.category })] }), _jsx("p", { style: { margin: '0 0 4px', fontSize: '11px', color: '#64748b' }, children: q.description }), _jsx("span", { style: { fontSize: '10px', color: '#3b7ea1', fontWeight: 600 }, children: q.gri })] }, q.name))) })] }), _jsxs("div", { style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { style: { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }, children: selectedQuery.name }), _jsxs("p", { style: { margin: '2px 0 0', fontSize: '12px', color: '#64748b' }, children: [selectedQuery.description, " \u00B7 ", _jsx("span", { style: { color: '#3b7ea1', fontWeight: 600 }, children: selectedQuery.gri })] })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsxs("button", { onClick: copyQuery, style: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }, children: [_jsx(Copy, { size: 14 }), " Copy"] }), _jsxs("button", { onClick: runQuery, disabled: loading || apiStatus === 'offline', style: { padding: '6px 16px', borderRadius: '6px', border: 'none', background: loading ? '#94a3b8' : '#003262', color: '#fff', cursor: loading || apiStatus === 'offline' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }, children: [_jsx(Play, { size: 14 }), " ", loading ? 'Running...' : 'Run'] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: '400px' }, children: [_jsxs("div", { style: { borderRight: '1px solid #f1f5f9', overflow: 'auto' }, children: [_jsx("div", { style: { padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }, children: "Query" }), _jsx("pre", { style: { margin: 0, padding: '16px', fontSize: '12px', color: '#1e293b', fontFamily: "'Courier New', monospace", lineHeight: 1.6, overflowX: 'auto', background: '#fafafa' }, children: selectedQuery.query })] }), _jsxs("div", { style: { overflow: 'auto' }, children: [_jsx("div", { style: { padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }, children: "Response" }), result ? (_jsx("pre", { style: { margin: 0, padding: '16px', fontSize: '12px', fontFamily: "'Courier New', monospace", lineHeight: 1.6, overflowX: 'auto', color: result.includes('"errors"') ? '#dc2626' : '#166534', background: result.includes('"errors"') ? '#fef2f2' : '#f0fdf4' }, children: result })) : (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' }, children: [_jsx(Play, { size: 32, style: { marginBottom: '8px', opacity: 0.4 } }), _jsx("p", { style: { margin: 0, fontSize: '13px' }, children: "Click Run to execute query" })] }))] })] })] })] })), activeTab === 'schema' && (_jsxs("div", { style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }, children: [_jsxs("div", { style: { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'center' }, children: [_jsx(Search, { size: 16, color: "#64748b" }), _jsx("input", { type: "text", placeholder: "\u641C\u5C0B Type\u3001Field...", value: searchSchema, onChange: (e) => setSearchSchema(e.target.value), style: { border: 'none', outline: 'none', fontSize: '14px', flex: 1, color: '#1e293b' } }), _jsxs("span", { style: { fontSize: '12px', color: '#94a3b8' }, children: [filteredTypes.length, " types"] })] }), _jsx("div", { style: { padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }, children: filteredTypes.map((type) => (_jsxs("div", { style: { border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }, children: [_jsxs("button", { onClick: () => toggleType(type.name), style: { width: '100%', padding: '14px 16px', background: `${type.color}08`, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("div", { style: { width: '10px', height: '10px', borderRadius: '50%', background: type.color } }), _jsx("span", { style: { fontWeight: 700, color: '#1e293b', fontSize: '14px', fontFamily: 'monospace' }, children: type.name })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("span", { style: { fontSize: '11px', color: '#64748b' }, children: type.description }), expandedTypes.has(type.name) ? _jsx(ChevronUp, { size: 14, color: "#94a3b8" }) : _jsx(ChevronDown, { size: 14, color: "#94a3b8" })] })] }), expandedTypes.has(type.name) && (_jsx("div", { style: { padding: '12px 16px', borderTop: '1px solid #f1f5f9' }, children: type.fields.map((field) => (_jsxs("div", { style: { fontFamily: 'monospace', fontSize: '12px', color: '#334155', padding: '4px 0', borderBottom: '1px dotted #f1f5f9', display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: '#1d4ed8' }, children: field.split(':')[0] }), _jsx("span", { style: { color: '#059669' }, children: field.split(':')[1]?.trim() })] }, field))) }))] }, type.name))) })] })), activeTab === 'rover' && (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: _jsxs("div", { style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }, children: [_jsx(Terminal, { size: 20, color: "#003262" }), _jsx("h3", { style: { margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }, children: "Rover CLI \u6574\u5408\u6307\u5357" }), _jsx("span", { style: { background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }, children: "Apollo GraphOS" })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: roverCommands.map((cmd) => (_jsxs("div", { style: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'grid', gridTemplateColumns: '40px 1fr', gap: '16px', alignItems: 'start' }, children: [_jsx("div", { style: { background: '#003262', color: '#FDB515', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }, children: cmd.step }), _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }, children: [_jsx("span", { style: { fontWeight: 600, color: '#1e293b', fontSize: '13px' }, children: cmd.title }), _jsxs("button", { onClick: () => navigator.clipboard.writeText(cmd.cmd).catch(() => { }), style: { background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '10px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx(Copy, { size: 10 }), " Copy"] })] }), _jsx("code", { style: { display: 'block', background: '#1e293b', color: '#e2e8f0', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', marginBottom: '6px', wordBreak: 'break-all' }, children: cmd.cmd }), _jsx("p", { style: { margin: 0, fontSize: '12px', color: '#64748b' }, children: cmd.desc })] })] }, cmd.step))) })] }) })), activeTab === 'metrics' && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }, children: [[
                        { title: 'Query Operations', items: SAMPLE_QUERIES.filter((q) => q.category === 'Query'), color: '#003262' },
                        { title: 'Mutation Operations', items: SAMPLE_QUERIES.filter((q) => q.category === 'Mutation'), color: '#f59e0b' },
                    ].map((group) => (_jsxs("div", { style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }, children: [_jsxs("div", { style: { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("div", { style: { width: '8px', height: '8px', borderRadius: '50%', background: group.color } }), _jsx("h3", { style: { margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }, children: group.title }), _jsx("span", { style: { marginLeft: 'auto', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }, children: group.items.length })] }), _jsx("div", { style: { padding: '12px' }, children: group.items.map((op) => (_jsxs("div", { style: { padding: '10px 12px', borderRadius: '8px', marginBottom: '6px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '13px', fontWeight: 600, color: '#1e293b' }, children: op.name }), _jsx("div", { style: { fontSize: '11px', color: '#64748b' }, children: op.gri })] }), _jsxs("button", { onClick: () => { setSelectedQuery(op); setActiveTab('explorer'); }, style: { background: '#003262', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }, children: ["Run ", _jsx(ArrowUpRight, { size: 12 })] })] }, op.name))) })] }, group.title))), _jsxs("div", { style: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', gridColumn: 'span 2' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }, children: [_jsx(BookOpen, { size: 18, color: "#003262" }), _jsx("h3", { style: { margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }, children: "5T Protocol GraphQL \u6574\u5408\u72C0\u614B" })] }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }, children: ['T1 Traceable', 'T2 Transparent', 'T3 Tangible', 'T4 Trustworthy', 'T5 Trackable'].map((t, i) => (_jsxs("div", { style: { textAlign: 'center', padding: '16px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' }, children: [_jsx(CheckCircle, { size: 20, color: "#22c55e", style: { marginBottom: '8px' } }), _jsx("div", { style: { fontSize: '12px', fontWeight: 700, color: '#1e293b' }, children: t.split(' ')[0] }), _jsx("div", { style: { fontSize: '11px', color: '#64748b' }, children: ['source_origin 欄位', 'Schema 公開', 'GraphQL UI', 'hashLock 欄位', 'auditLogs 訂閱'][i] })] }, t))) })] })] }))] }));
}
//# sourceMappingURL=page.js.map