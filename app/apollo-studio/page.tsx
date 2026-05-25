'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Database, Code, Zap, CheckCircle, AlertTriangle,
  Play, Copy, RefreshCw, Terminal, BookOpen, GitBranch, Shield,
  Search, ArrowUpRight, ChevronDown, ChevronUp
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'explorer' | 'schema' | 'rover' | 'metrics'>('explorer');
  const [selectedQuery, setSelectedQuery] = useState(SAMPLE_QUERIES[0]);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [searchSchema, setSearchSchema] = useState('');
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['DashboardStats']));
  const [filterCategory, setFilterCategory] = useState<'all' | 'Query' | 'Mutation'>('all');

  const checkApiStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ dashboardStats { complianceRate } }' }),
      });
      if (res.ok) setApiStatus('online');
      else setApiStatus('offline');
    } catch {
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
    } catch (e: any) {
      setResult(JSON.stringify({ error: e.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const copyQuery = () => {
    navigator.clipboard.writeText(selectedQuery.query).catch(() => {});
  };

  const filteredQueries = SAMPLE_QUERIES.filter(
    (q) => filterCategory === 'all' || q.category === filterCategory
  );

  const filteredTypes = SCHEMA_TYPES.filter(
    (t) => !searchSchema || t.name.toLowerCase().includes(searchSchema.toLowerCase()) || t.description.includes(searchSchema)
  );

  const toggleType = (name: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
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

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003262 0%, #1a5276 100%)', borderRadius: '16px', padding: '28px 32px', marginBottom: '24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: '#FDB515', borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={22} color="#003262" />
            </div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Apollo Studio</h1>
            <span style={{ background: 'rgba(253,181,21,0.2)', color: '#FDB515', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>GraphQL API</span>
          </div>
          <p style={{ margin: 0, opacity: 0.75, fontSize: '14px' }}>ESG GO | 5T 誠信協議 · Type-Safe GraphQL · Rover CLI 整合</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: apiStatus === 'online' ? '#22c55e' : apiStatus === 'offline' ? '#ef4444' : '#f59e0b', animation: apiStatus === 'checking' ? 'pulse 1s infinite' : 'none' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Checking...'}</span>
          </div>
          <button onClick={checkApiStatus} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: Code, label: 'Operations', value: '3', sub: 'Query + Mutation + Sub', color: '#003262' },
          { icon: Database, label: 'Types', value: `${SCHEMA_TYPES.length}`, sub: 'GraphQL Type Nodes', color: '#22c55e' },
          { icon: Zap, label: 'Queries', value: `${SAMPLE_QUERIES.filter((q) => q.category === 'Query').length}`, sub: 'Read Operations', color: '#3b7ea1' },
          { icon: GitBranch, label: 'Mutations', value: `${SAMPLE_QUERIES.filter((q) => q.category === 'Mutation').length}`, sub: 'Write Operations', color: '#f59e0b' },
          { icon: Shield, label: '5T Protocol', value: 'Active', sub: 'Hash Lock + ZKP', color: '#8b5cf6' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: `${stat.color}15`, borderRadius: '8px', padding: '8px' }}>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(['explorer', 'schema', 'rover', 'metrics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', background: activeTab === tab ? '#003262' : '#fff', color: activeTab === tab ? '#fff' : '#64748b', borderColor: activeTab === tab ? '#003262' : '#e2e8f0' }}
          >
            {tab === 'explorer' ? '🚀 Explorer' : tab === 'schema' ? '📋 Schema Browser' : tab === 'rover' ? '🛸 Rover CLI' : '📊 Metrics'}
          </button>
        ))}
      </div>

      {/* Explorer Tab */}
      {activeTab === 'explorer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['all', 'Query', 'Mutation'] as const).map((cat) => (
                <button key={cat} onClick={() => setFilterCategory(cat)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid', fontSize: '11px', fontWeight: 600, cursor: 'pointer', background: filterCategory === cat ? '#003262' : '#f8fafc', color: filterCategory === cat ? '#fff' : '#64748b', borderColor: filterCategory === cat ? '#003262' : '#e2e8f0' }}>
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
            <div style={{ padding: '8px', maxHeight: '520px', overflowY: 'auto' }}>
              {filteredQueries.map((q) => (
                <button key={q.name} onClick={() => setSelectedQuery(q)} style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '4px', background: selectedQuery.name === q.name ? '#f0f4ff' : 'transparent', transition: 'background 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{q.name}</span>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: q.category === 'Query' ? '#dbeafe' : '#fef3c7', color: q.category === 'Query' ? '#1d4ed8' : '#92400e', fontWeight: 600 }}>{q.category}</span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#64748b' }}>{q.description}</p>
                  <span style={{ fontSize: '10px', color: '#3b7ea1', fontWeight: 600 }}>{q.gri}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{selectedQuery.name}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{selectedQuery.description} · <span style={{ color: '#3b7ea1', fontWeight: 600 }}>{selectedQuery.gri}</span></p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={copyQuery} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                  <Copy size={14} /> Copy
                </button>
                <button onClick={runQuery} disabled={loading || apiStatus === 'offline'} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: loading ? '#94a3b8' : '#003262', color: '#fff', cursor: loading || apiStatus === 'offline' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                  <Play size={14} /> {loading ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: '400px' }}>
              <div style={{ borderRight: '1px solid #f1f5f9', overflow: 'auto' }}>
                <div style={{ padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Query</div>
                <pre style={{ margin: 0, padding: '16px', fontSize: '12px', color: '#1e293b', fontFamily: "'Courier New', monospace", lineHeight: 1.6, overflowX: 'auto', background: '#fafafa' }}>{selectedQuery.query}</pre>
              </div>
              <div style={{ overflow: 'auto' }}>
                <div style={{ padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Response</div>
                {result ? (
                  <pre style={{ margin: 0, padding: '16px', fontSize: '12px', fontFamily: "'Courier New', monospace", lineHeight: 1.6, overflowX: 'auto', color: result.includes('"errors"') ? '#dc2626' : '#166534', background: result.includes('"errors"') ? '#fef2f2' : '#f0fdf4' }}>{result}</pre>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' }}>
                    <Play size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '13px' }}>Click Run to execute query</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schema Browser Tab */}
      {activeTab === 'schema' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Search size={16} color="#64748b" />
            <input type="text" placeholder="搜尋 Type、Field..." value={searchSchema} onChange={(e) => setSearchSchema(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '14px', flex: 1, color: '#1e293b' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{filteredTypes.length} types</span>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filteredTypes.map((type) => (
              <div key={type.name} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => toggleType(type.name)} style={{ width: '100%', padding: '14px 16px', background: `${type.color}08`, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: type.color }} />
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', fontFamily: 'monospace' }}>{type.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{type.description}</span>
                    {expandedTypes.has(type.name) ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
                  </div>
                </button>
                {expandedTypes.has(type.name) && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                    {type.fields.map((field) => (
                      <div key={field} style={{ fontFamily: 'monospace', fontSize: '12px', color: '#334155', padding: '4px 0', borderBottom: '1px dotted #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#1d4ed8' }}>{field.split(':')[0]}</span>
                        <span style={{ color: '#059669' }}>{field.split(':')[1]?.trim()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rover CLI Tab */}
      {activeTab === 'rover' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Terminal size={20} color="#003262" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>Rover CLI 整合指南</h3>
              <span style={{ background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Apollo GraphOS</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roverCommands.map((cmd) => (
                <div key={cmd.step} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'grid', gridTemplateColumns: '40px 1fr', gap: '16px', alignItems: 'start' }}>
                  <div style={{ background: '#003262', color: '#FDB515', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>{cmd.step}</div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>{cmd.title}</span>
                      <button onClick={() => navigator.clipboard.writeText(cmd.cmd).catch(() => {})} style={{ background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontSize: '10px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={10} /> Copy
                      </button>
                    </div>
                    <code style={{ display: 'block', background: '#1e293b', color: '#e2e8f0', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', marginBottom: '6px', wordBreak: 'break-all' }}>{cmd.cmd}</code>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{cmd.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {[
            { title: 'Query Operations', items: SAMPLE_QUERIES.filter((q) => q.category === 'Query'), color: '#003262' },
            { title: 'Mutation Operations', items: SAMPLE_QUERIES.filter((q) => q.category === 'Mutation'), color: '#f59e0b' },
          ].map((group) => (
            <div key={group.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: group.color }} />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{group.title}</h3>
                <span style={{ marginLeft: 'auto', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>{group.items.length}</span>
              </div>
              <div style={{ padding: '12px' }}>
                {group.items.map((op) => (
                  <div key={op.name} style={{ padding: '10px 12px', borderRadius: '8px', marginBottom: '6px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{op.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{op.gri}</div>
                    </div>
                    <button onClick={() => { setSelectedQuery(op); setActiveTab('explorer'); }} style={{ background: '#003262', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Run <ArrowUpRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <BookOpen size={18} color="#003262" />
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>5T Protocol GraphQL 整合狀態</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {['T1 Traceable', 'T2 Transparent', 'T3 Tangible', 'T4 Trustworthy', 'T5 Trackable'].map((t, i) => (
                <div key={t} style={{ textAlign: 'center', padding: '16px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' }}>
                  <CheckCircle size={20} color="#22c55e" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{t.split(' ')[0]}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{['source_origin 欄位', 'Schema 公開', 'GraphQL UI', 'hashLock 欄位', 'auditLogs 訂閱'][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}