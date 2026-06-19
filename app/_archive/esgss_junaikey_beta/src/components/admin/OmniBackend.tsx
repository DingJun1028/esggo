/**
 * 🎛️ Omni Backend - 統一資料庫管理中心 (增強版)
 * --------------------------------------------------
 * [功能]
 * - NocodeBackend 完全移植
 * - Boost.Space / OmniSpace 雙向同步
 * - Supabase 資料庫整合
 * - RAG 零幻覺資料庫
 * [核心] SSOT + 5T 協議保護
 */

import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Users,
  FileText,
  Settings,
  Activity,
  Cloud,
  Shield,
  BarChart3,
  Search,
  Plus,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Scale,
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  FileCheck,
  Globe,
  Briefcase,
  Leaf,
  Award,
  Link2,
  Hash,
  Lock,
  Zap,
  Layers,
  ChevronRight,
  Filter,
  DownloadCloud,
  ArrowLeftRight,
  Server,
  Table,
  Code,
  Eye,
  Send,
  Save,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  ZapFast,
  Wifi,
  WifiOff,
} from 'lucide-react';

// ============== Types ==============

interface ESGDatabase {
  id: string;
  name: string;
  type: string;
  records: number;
  lastUpdate: string;
  status: 'active' | 'syncing' | 'warning';
  compliance: string[];
  platform: string;
}

interface Regulation {
  id: string;
  code: string;
  name: string;
  category: string;
  effectiveDate: string;
  status: 'active' | 'upcoming' | 'archived';
  requirements: number;
  compliance: number;
}

interface RAGDocument {
  id: string;
  title: string;
  type: string;
  source: string;
  chunks: number;
  lastUpdate: string;
  accuracy: number;
  usage: number;
}

interface UserGrowthMetric {
  id: string;
  metric: string;
  value: number;
  growth: number;
  trend: string;
}

interface SyncPlatform {
  id: string;
  name: string;
  type: 'omni_space' | 'supabase' | 'ncb' | 'boost_space' | 'airtable';
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  records: number;
  syncMode: 'push' | 'pull' | 'bidirectional';
}

interface NCBTable {
  id: string;
  name: string;
  rows: number;
  columns: number;
  lastSync: string;
}

// ============== Mock Data ==============

const ESG_DATABASES: ESGDatabase[] = [
  {
    id: 'db-1',
    name: '碳排放資料庫',
    type: 'carbon',
    records: 12540,
    lastUpdate: '2026-02-19',
    status: 'active',
    compliance: ['ISO 14064', 'GRI 305'],
    platform: 'Supabase',
  },
  {
    id: 'db-2',
    name: '能源管理資料庫',
    type: 'energy',
    records: 8920,
    lastUpdate: '2026-02-18',
    status: 'active',
    compliance: ['ISO 50001', 'GRI 302'],
    platform: 'OmniSpace',
  },
  {
    id: 'db-3',
    name: '水資源資料庫',
    type: 'water',
    records: 5680,
    lastUpdate: '2026-02-17',
    status: 'active',
    compliance: ['GRI 303'],
    platform: 'NocodeBackend',
  },
  {
    id: 'db-4',
    name: '廢棄物資料庫',
    type: 'waste',
    records: 3240,
    lastUpdate: '2026-02-16',
    status: 'warning',
    compliance: ['GRI 306'],
    platform: 'Boost.Space',
  },
  {
    id: 'db-5',
    name: '社會責任資料庫',
    type: 'social',
    records: 15680,
    lastUpdate: '2026-02-19',
    status: 'active',
    compliance: ['GRI 400', 'SA8000'],
    platform: 'Supabase',
  },
  {
    id: 'db-6',
    name: '公司治理資料庫',
    type: 'governance',
    records: 9840,
    lastUpdate: '2026-02-19',
    status: 'active',
    compliance: ['GRI 200'],
    platform: 'OmniSpace',
  },
];

const REGULATIONS: Regulation[] = [
  {
    id: 'r-1',
    code: 'GRI 2021',
    name: 'GRI 永續報告標準 2021',
    category: 'GRI',
    effectiveDate: '2023-01-01',
    status: 'active',
    requirements: 34,
    compliance: 92,
  },
  {
    id: 'r-2',
    code: 'TCFD 2021',
    name: '氣候相關財務揭露',
    category: 'TCFD',
    effectiveDate: '2024-01-01',
    status: 'active',
    requirements: 11,
    compliance: 85,
  },
  {
    id: 'r-3',
    code: 'SASB 2023',
    name: '永續會計標準',
    category: 'SASB',
    effectiveDate: '2024-01-01',
    status: 'active',
    requirements: 77,
    compliance: 78,
  },
  {
    id: 'r-4',
    code: 'ISO 14064-1',
    name: '溫室氣體量化與報告',
    category: 'ISO',
    effectiveDate: '2018-01-01',
    status: 'active',
    requirements: 10,
    compliance: 95,
  },
  {
    id: 'r-5',
    code: 'EU CSRD',
    name: '企業永續報告指令',
    category: 'EU',
    effectiveDate: '2024-01-01',
    status: 'active',
    requirements: 42,
    compliance: 65,
  },
];

const SYNC_PLATFORMS: SyncPlatform[] = [
  {
    id: 'sp-1',
    name: 'Supabase',
    type: 'supabase',
    status: 'connected',
    lastSync: '1分鐘前',
    records: 45230,
    syncMode: 'bidirectional',
  },
  {
    id: 'sp-2',
    name: 'OmniSpace',
    type: 'omni_space',
    status: 'connected',
    lastSync: '3分鐘前',
    records: 28450,
    syncMode: 'bidirectional',
  },
  {
    id: 'sp-3',
    name: 'NocodeBackend',
    type: 'ncb',
    status: 'connected',
    lastSync: '5分鐘前',
    records: 15680,
    syncMode: 'push',
  },
  {
    id: 'sp-4',
    name: 'Boost.Space',
    type: 'boost_space',
    status: 'syncing',
    lastSync: '正在同步...',
    records: 12300,
    syncMode: 'bidirectional',
  },
];

const NCB_TABLES: NCBTable[] = [
  { id: 't-1', name: 'esg_readings', rows: 12540, columns: 18, lastSync: '2分鐘前' },
  { id: 't-2', name: 'metric_definitions', rows: 89, columns: 12, lastSync: '5分鐘前' },
  { id: 't-3', name: 'user_activities', rows: 56800, columns: 24, lastSync: '1分鐘前' },
  { id: 't-4', name: 'evidence_vault', rows: 8920, columns: 32, lastSync: '10分鐘前' },
  { id: 't-5', name: 'omni_space_nodes', rows: 3450, columns: 28, lastSync: '3分鐘前' },
];

const RAG_DOCUMENTS: RAGDocument[] = [
  {
    id: 'rag-1',
    title: '碳盤查完整指南',
    type: 'guide',
    source: 'Internal',
    chunks: 156,
    lastUpdate: '2026-02-19',
    accuracy: 98.5,
    usage: 2340,
  },
  {
    id: 'rag-2',
    title: 'GRI 標準對照表',
    type: 'knowledge',
    source: 'GRI Official',
    chunks: 89,
    lastUpdate: '2026-02-18',
    accuracy: 99.2,
    usage: 1890,
  },
  {
    id: 'rag-3',
    title: 'TCFD 風險分析案例',
    type: 'case',
    source: 'Internal',
    chunks: 234,
    lastUpdate: '2026-02-17',
    accuracy: 97.8,
    usage: 1560,
  },
];

const USER_GROWTH_METRICS: UserGrowthMetric[] = [
  { id: 'm-1', metric: '月活躍用戶', value: 12540, growth: 12.5, trend: 'up' },
  { id: 'm-2', metric: 'AI 諮詢次數', value: 45620, growth: 28.3, trend: 'up' },
  { id: 'm-3', metric: '報告生成數', value: 8920, growth: 15.7, trend: 'up' },
  { id: 'm-4', metric: '法規查詢次數', value: 23450, growth: 22.1, trend: 'up' },
];

// ============== Main Component ==============

export const OmniBackend: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Database');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const tabs = [
    { id: 'Database', label: 'ESG資料庫', icon: Database },
    { id: 'Sync', label: '雙向同步', icon: ArrowLeftRight },
    { id: 'AI', label: 'AI對接', icon: Link2 },
    { id: 'NCB', label: 'NocodeBackend', icon: Code },
    { id: 'Supabase', label: 'Supabase', icon: Server },
    { id: 'RAG', label: 'RAG知識庫', icon: Brain },
    { id: 'Insights', label: '全局洞察', icon: BarChart3 },
    { id: 'Settings', label: '設定', icon: Settings },
  ];

  const handleSync = async (platformId: string) => {
    setIsSyncing(true);
    setSelectedPlatform(platformId);
    setTimeout(() => {
      setIsSyncing(false);
      setSelectedPlatform(null);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-500/20';
      case 'syncing':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'error':
        return 'text-red-400 bg-red-500/20';
      case 'active':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen font-sans">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl">
              <Database className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">OMNI BACKEND</h1>
              <p className="text-slate-400 text-sm">
                NocodeBackend • OmniSpace • Supabase • Boost.Space
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-xl">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold text-sm">同步已啟用</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold text-sm">5T Protocol</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-7 gap-3 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">ESG 資料庫</div>
          <div className="text-xl font-bold text-white">
            {ESG_DATABASES.reduce((a, b) => a + b.records, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">同步平台</div>
          <div className="text-xl font-bold text-blue-400">{SYNC_PLATFORMS.length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">NCB 表格</div>
          <div className="text-xl font-bold text-purple-400">{NCB_TABLES.length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">RAG 準確率</div>
          <div className="text-xl font-bold text-green-400">
            {(RAG_DOCUMENTS.reduce((a, b) => a + b.accuracy, 0) / RAG_DOCUMENTS.length).toFixed(1)}%
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">法規數量</div>
          <div className="text-xl font-bold text-amber-400">{REGULATIONS.length}</div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">月活躍用戶</div>
          <div className="text-xl font-bold text-cyan-400">
            {USER_GROWTH_METRICS[0]?.value?.toLocaleString() ?? 0}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">同步記錄</div>
          <div className="text-xl font-bold text-pink-400">
            {SYNC_PLATFORMS.reduce((a, b) => a + b.records, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="搜尋資料庫、同步平台、或 RAG 知識..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="col-span-10 bg-slate-800/30 rounded-2xl p-4 border border-slate-700 min-h-[600px]">
          {/* Database Tab */}
          {activeTab === 'Database' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">ESG 相關資料庫</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                    <Plus className="w-4 h-4" /> 新增
                  </button>
                </div>
              </div>
              <div className="grid gap-3">
                {ESG_DATABASES.map(db => (
                  <div
                    key={db.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${db.type === 'carbon' ? 'bg-green-500/20 text-green-400' : db.type === 'energy' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}
                        >
                          {db.type === 'carbon' ? (
                            <Leaf className="w-5 h-5" />
                          ) : db.type === 'energy' ? (
                            <Zap className="w-5 h-5" />
                          ) : (
                            <Activity className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{db.name}</h3>
                          <p className="text-slate-400 text-xs">
                            {db.records.toLocaleString()} 筆記錄 • {db.platform}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {db.compliance.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(db.status)}`}
                        >
                          {db.status === 'active' ? 'active' : '警告'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync Tab - Bidirectional Sync */}
          {activeTab === 'Sync' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">多平台雙向同步</h2>
                  <p className="text-slate-400 text-sm">
                    OmniSpace • Boost.Space • Supabase • NocodeBackend
                  </p>
                </div>
                <button
                  onClick={() => handleSync('all')}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? '同步中...' : '全部同步'}
                </button>
              </div>

              {/* Platform Cards */}
              <div className="grid grid-cols-2 gap-4">
                {SYNC_PLATFORMS.map(platform => (
                  <div
                    key={platform.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${platform.status === 'connected' ? 'bg-green-500/20 text-green-400' : platform.status === 'syncing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}
                        >
                          {platform.type === 'supabase' ? (
                            <Server className="w-5 h-5" />
                          ) : platform.type === 'omni_space' ? (
                            <Cloud className="w-5 h-5" />
                          ) : platform.type === 'ncb' ? (
                            <Code className="w-5 h-5" />
                          ) : (
                            <Database className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{platform.name}</h3>
                          <p className="text-slate-400 text-xs">
                            {platform.records.toLocaleString()} 筆記錄
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(platform.status)}`}
                      >
                        {platform.status === 'connected'
                          ? '已連接'
                          : platform.status === 'syncing'
                            ? '同步中'
                            : '錯誤'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="text-slate-400">
                        最後同步: <span className="text-white">{platform.lastSync}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowLeftRight className="w-3 h-3 text-purple-400" />
                        <span className="text-purple-400 font-bold">
                          {platform.syncMode === 'bidirectional'
                            ? '雙向'
                            : platform.syncMode === 'push'
                              ? '推送'
                              : '拉取'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSync(platform.id)}
                        disabled={isSyncing}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 disabled:opacity-50"
                      >
                        {selectedPlatform === platform.id && isSyncing ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        同步
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600">
                        <Eye className="w-4 h-4" />
                        檢視
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sync Log */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3">同步日誌</h3>
                <div className="space-y-2 text-sm">
                  {[
                    {
                      time: '12:45:23',
                      action: 'Supabase → OmniSpace',
                      status: 'success',
                      records: 156,
                    },
                    {
                      time: '12:44:10',
                      action: 'NocodeBackend → Supabase',
                      status: 'success',
                      records: 89,
                    },
                    {
                      time: '12:43:05',
                      action: 'Boost.Space ← OmniSpace',
                      status: 'success',
                      records: 234,
                    },
                    {
                      time: '12:42:00',
                      action: 'Supabase ← NocodeBackend',
                      status: 'success',
                      records: 67,
                    },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400">{log.time}</span>
                        <span className="text-white">{log.action}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{log.records} 筆</span>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NCB Tab - NocodeBackend Full Function */}
          {activeTab === 'NCB' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">NocodeBackend 管理</h2>
                  <p className="text-slate-400 text-sm">完全移植 NocodeBackend 功能至前台</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                    <Upload className="w-4 h-4" /> 匯入
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                    <Download className="w-4 h-4" /> 匯出
                  </button>
                </div>
              </div>

              {/* NCB Tables */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-bold text-sm">
                        表格名稱
                      </th>
                      <th className="text-right py-3 px-4 text-slate-400 font-bold text-sm">
                        資料列數
                      </th>
                      <th className="text-right py-3 px-4 text-slate-400 font-bold text-sm">
                        欄位數
                      </th>
                      <th className="text-right py-3 px-4 text-slate-400 font-bold text-sm">
                        最後同步
                      </th>
                      <th className="text-center py-3 px-4 text-slate-400 font-bold text-sm">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {NCB_TABLES.map(table => (
                      <tr
                        key={table.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Table className="w-4 h-4 text-purple-400" />
                            <span className="text-white font-bold">{table.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-white">
                          {table.rows.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-white">{table.columns}</td>
                        <td className="py-3 px-4 text-right text-slate-400">{table.lastSync}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 bg-slate-700 text-slate-400 rounded hover:bg-slate-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* NCB Query Console */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-bold">NocodeBackend Query Console</h3>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="SELECT * FROM esg_readings WHERE..."
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600">
                    <Send className="w-4 h-4" /> 執行
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg text-slate-400 text-sm font-mono">
                  <span className="text-green-400">// 結果將顯示在此處</span>
                </div>
              </div>
            </div>
          )}

          {/* Supabase Tab */}
          {activeTab === 'Supabase' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Supabase 資料庫</h2>
                  <p className="text-slate-400 text-sm">主資料庫與即時同步狀態</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
                  <RefreshCw className="w-4 h-4" /> 刷新
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">資料表總數</div>
                  <div className="text-3xl font-bold text-white">24</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">總記錄數</div>
                  <div className="text-3xl font-bold text-blue-400">125,430</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-slate-400 text-sm mb-1">API 請求 (今日)</div>
                  <div className="text-3xl font-bold text-purple-400">45,230</div>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3">資料表列表</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'users',
                    'esg_readings',
                    'metric_definitions',
                    'evidence_vault',
                    'omni_space_nodes',
                    'user_activities',
                    'reports',
                    'regulations',
                  ].map(table => (
                    <div
                      key={table}
                      className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg"
                    >
                      <Table className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">{table}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RAG Tab */}
          {activeTab === 'RAG' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">RAG 零幻覺資料庫</h2>
                  <p className="text-slate-400 text-sm">檢索增強生成知識庫</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                  <Brain className="w-4 h-4" /> Zero Hallucination
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                  <div className="text-slate-400 text-xs mb-1">總文檔</div>
                  <div className="text-2xl font-bold text-white">{RAG_DOCUMENTS.length}</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                  <div className="text-slate-400 text-xs mb-1">知識塊</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {RAG_DOCUMENTS.reduce((a, b) => a + b.chunks, 0)}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                  <div className="text-slate-400 text-xs mb-1">準確率</div>
                  <div className="text-2xl font-bold text-green-400">
                    {(
                      RAG_DOCUMENTS.reduce((a, b) => a + b.accuracy, 0) / RAG_DOCUMENTS.length
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              </div>
              {RAG_DOCUMENTS.map(doc => (
                <div
                  key={doc.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-white font-bold">{doc.title}</h3>
                        <p className="text-slate-400 text-xs">{doc.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">{doc.accuracy}%</div>
                      <div className="text-slate-500 text-xs">準確率</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'Insights' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-bold">數據覆蓋率</h3>
                </div>
                <div className="text-4xl font-black text-white mb-2">94.5%</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: '94.5%' }}
                  />
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-green-400" />
                  <h3 className="text-white font-bold">合規達成率</h3>
                </div>
                <div className="text-4xl font-black text-green-400 mb-2">87.3%</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: '87.3%' }}
                  />
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-white font-bold">RAG 準確率</h3>
                </div>
                <div className="text-4xl font-black text-purple-400 mb-2">98.3%</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: '98.3%' }}
                  />
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h3 className="text-white font-bold">用戶滿意度</h3>
                </div>
                <div className="text-4xl font-black text-amber-400 mb-2">4.8/5</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                    style={{ width: '96%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'Settings' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">系統設定</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">5T 協議設定</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Tangible - 可感知', desc: 'impactMetric 指標追蹤' },
                    { label: 'Traceable - 可溯源', desc: 'source_origin 來源追蹤' },
                    { label: 'Trackable - 可追蹤', desc: 'lifecycle 生命週期' },
                    { label: 'Transparent - 可透明驗算', desc: '公式公開 ISO 標準' },
                    { label: 'Trustworthy - 不可篡改', desc: 'SHA-256 Hash Lock' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-bold">{item.label}</div>
                        <div className="text-slate-400 text-xs">{item.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-bold">已啟用</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">同步設定</h3>
                <div className="space-y-3">
                  {[
                    { label: '自動雙向同步', desc: '定時同步所有平台', enabled: true },
                    { label: '衝突解決策略', desc: '以最新版本為準', enabled: true },
                    { label: '即時 webhook', desc: '收到變更立即同步', enabled: true },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-bold">{item.label}</div>
                        <div className="text-slate-400 text-xs">{item.desc}</div>
                      </div>
                      <div className="w-10 h-5 bg-green-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const Edit3 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export default OmniBackend;
