// app/omni-hub/page.tsx
// 萬能中心 — 統一管理介面（即時同步 + 記憶搜尋 + 任務視覺化）

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { StatusDot } from '@/components/ui/v2/StatusDot';
import { FiveTStrip } from '@/components/ui/v2/FiveTStrip';
import { OmniHeader } from '@/components/ui/v2/OmniHeader';
import { useRealtime } from '@/lib/omni-hub/useRealtime';
import {
  Layers,
  Bot,
  Shield,
  FileText,
  Search,
  Zap,
  Activity,
  Database,
  Settings,
  RefreshCw,
  Plus,
  Cpu,
  Eye,
  Lock,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Play,
  Pause,
  Wifi,
  WifiOff,
  ArrowRight,
  GitBranch,
  X,
  Loader2,
} from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  displayName: string;
  role: string;
  description: string;
  status: string;
  healthScore: number;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
  capabilities: { name: string; description: string }[];
  registeredAt: string;
  lastHeartbeat: string;
}

interface HubStats {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  errorAgents: number;
  totalMemories: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  avgHealthScore: number;
  fiveTCompliance: number;
}

interface MemoryEntry {
  id: string;
  agentId: string;
  agentName: string;
  type: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  visibility: string;
  updatedAt: string;
}

interface TaskEntry {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string;
  status: string;
  priority: string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  parentTaskId: string | null;
  subtaskIds: string[];
}

const ROLE_ICONS: Record<string, React.ElementType> = {
  orchestrator: Bot,
  analyst: Search,
  writer: FileText,
  auditor: Shield,
  researcher: Database,
  calculator: Cpu,
  coordinator: Activity,
  guardian: Lock,
  custom: Settings,
};

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  registered: 'info',
  idle: 'neutral',
  running: 'success',
  paused: 'warning',
  error: 'error',
  deregistered: 'neutral',
};

const TASK_STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  pending: 'neutral',
  accepted: 'info',
  running: 'warning',
  completed: 'success',
  failed: 'error',
  cancelled: 'neutral',
};

export default function OmniHubPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [stats, setStats] = useState<HubStats | null>(null);
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'facilities' | 'memory' | 'tasks'>(
    'overview'
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MemoryEntry[]>([]);
  const [relatedResults, setRelatedResults] = useState<MemoryEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskEntry | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 即時同步狀態
  const realtimeStatus = useRealtime((event) => {
    // 收到即時事件時自動刷新相關資料
    if (event.type.startsWith('facility_') || event.type.startsWith('task_')) {
      fetchFacilities();
      fetchTasks();
    }
    if (event.type.startsWith('memory_')) {
      fetchMemories();
    }
    if (event.type === 'agent_message') {
      fetchStats();
    }
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/hub?action=stats');
      if (res.ok) setStats(await res.json());
    } catch (e) {
      /* silent */
    }
  }, []);

  const fetchFacilities = useCallback(async () => {
    try {
      const res = await fetch('/api/hub?action=facilities');
      if (res.ok) setFacilities(await res.json());
    } catch (e) {
      /* silent */
    }
  }, []);

  const fetchMemories = useCallback(async () => {
    try {
      const res = await fetch('/api/hub?action=memories');
      if (res.ok) setMemories(await res.json());
    } catch (e) {
      /* silent */
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/hub?action=tasks');
      if (res.ok) setTasks(await res.json());
    } catch (e) {
      /* silent */
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchFacilities(), fetchMemories(), fetchTasks()]);
    setLoading(false);
  }, [fetchStats, fetchFacilities, fetchMemories, fetchTasks]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // 搜尋（debounce 300ms）
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!query.trim()) {
      setSearchResults([]);
      setRelatedResults([]);
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/hub/search?q=${encodeURIComponent(query)}&related=true&limit=20`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setRelatedResults(data.related || []);
        }
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch('/api/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', id, status }),
      });
      fetchFacilities();
      fetchStats();
    } catch (e) {
      /* silent */
    }
  };

  const handleHeartbeat = async (id: string) => {
    try {
      await fetch('/api/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'heartbeat', agentId: id }),
      });
      fetchFacilities();
    } catch (e) {
      /* silent */
    }
  };

  const handleCreateMemory = async () => {
    const title = prompt('記憶標題');
    if (!title) return;
    const content = prompt('記憶內容');
    if (!content) return;
    try {
      await fetch('/api/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'memory',
          entry: {
            agentId: 'omni-agent',
            agentName: 'OmniAgent',
            type: 'insight',
            title,
            content,
            summary: content.substring(0, 80),
            tags: ['user-created'],
            visibility: 'public',
            referencedBy: [],
            metadata: {},
          },
        }),
      });
      fetchMemories();
      fetchStats();
    } catch (e) {
      /* silent */
    }
  };

  const handleCreateTask = async () => {
    const title = prompt('任務標題');
    if (!title) return;
    const assignedTo = prompt('指派給（設施 ID）', 'omni-agent');
    if (!assignedTo) return;
    try {
      await fetch('/api/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'task',
          task: {
            title,
            description: '',
            assignedBy: 'omni-agent',
            assignedTo,
            priority: 'normal',
            input: {},
            memoryRefs: [],
            parentTaskId: null,
            subtaskIds: [],
            metadata: {},
          },
        }),
      });
      fetchTasks();
      fetchStats();
    } catch (e) {
      /* silent */
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">萬能中心啟動中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <OmniHeader
          title="萬能中心"
          subtitle="OmniHub — 統一管理所有萬能設施"
          icon={<Layers size={24} className="text-neutral-600" />}
          actions={
            <div className="flex gap-2 items-center">
              {/* 即時連線狀態指示器 */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  realtimeStatus.connected
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {realtimeStatus.connected ? <Wifi size={10} /> : <WifiOff size={10} />}
                {realtimeStatus.connected ? '即時同步' : '離線'}
              </div>
              <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={fetchData}>
                刷新
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={handleCreateMemory}
              >
                新增記憶
              </Button>
            </div>
          }
        />

        {/* 統計卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: '總設施',
                value: stats.totalAgents,
                icon: Layers,
                color: 'text-blue-600 bg-blue-50',
              },
              {
                label: '運行中',
                value: stats.activeAgents,
                icon: Play,
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                label: '共享記憶',
                value: stats.totalMemories,
                icon: Database,
                color: 'text-purple-600 bg-purple-50',
              },
              {
                label: '已完成任務',
                value: stats.completedTasks,
                icon: CheckCircle2,
                color: 'text-amber-600 bg-amber-50',
              },
              {
                label: '5T 合規',
                value: `${stats.fiveTCompliance}%`,
                icon: Shield,
                color: 'text-rose-600 bg-rose-50',
              },
            ].map((stat) => (
              <Card key={stat.label} variant="default" padding="md">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-neutral-900">{stat.value}</p>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 分頁標籤 */}
        <div className="flex gap-2 border-b border-neutral-200 pb-4">
          {[
            { id: 'overview' as const, label: '總覽', icon: Eye },
            { id: 'facilities' as const, label: '設施管理', icon: Bot },
            { id: 'memory' as const, label: '記憶搜尋', icon: Search },
            { id: 'tasks' as const, label: '任務流程', icon: GitBranch },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 總覽 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card variant="default" padding="md">
              <SectionHeader
                title="設施狀態總覽"
                subtitle={`共 ${facilities.length} 個設施已註冊`}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {facilities.map((facility) => {
                  const Icon = ROLE_ICONS[facility.role] || Settings;
                  return (
                    <Card
                      key={facility.id}
                      variant="outlined"
                      padding="md"
                      hover
                      onClick={() => setSelectedFacility(facility)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                            <Icon size={18} className="text-neutral-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-neutral-900">
                              {facility.displayName}
                            </h3>
                            <p className="text-[10px] text-neutral-400">{facility.name}</p>
                          </div>
                        </div>
                        <StatusDot
                          status={(STATUS_COLOR[facility.status] || 'neutral') as 'active'}
                          size="sm"
                        />
                      </div>
                      <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
                        {facility.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <FiveTStrip status={facility.fiveTStatus} size="sm" />
                        <span className="text-[10px] text-neutral-400">
                          {facility.healthScore}% 健康
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>

            {/* 即時事件計數 */}
            {realtimeStatus.lastEvent && (
              <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                <Activity size={10} className="text-emerald-500" />
                <span>
                  最後事件: {realtimeStatus.lastEvent} @{' '}
                  {realtimeStatus.lastEventAt
                    ? new Date(realtimeStatus.lastEventAt).toLocaleTimeString()
                    : '-'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 設施管理 */}
        {activeTab === 'facilities' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {facilities.map((facility) => {
                const Icon = ROLE_ICONS[facility.role] || Settings;
                return (
                  <Card key={facility.id} variant="default" padding="md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                          <Icon size={20} className="text-neutral-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-neutral-900">
                              {facility.displayName}
                            </h3>
                            <Badge variant={STATUS_COLOR[facility.status] || 'neutral'} size="sm">
                              {facility.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-500 mt-0.5">{facility.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] text-neutral-400">
                              角色: {facility.role}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              能力: {facility.capabilities.length}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              健康: {facility.healthScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiveTStrip status={facility.fiveTStatus} size="sm" />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Zap size={12} />}
                          onClick={() => handleHeartbeat(facility.id)}
                        >
                          心跳
                        </Button>
                        {facility.status === 'idle' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Play size={12} />}
                            onClick={() => handleStatusChange(facility.id, 'running')}
                          >
                            啟動
                          </Button>
                        ) : facility.status === 'running' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<Pause size={12} />}
                            onClick={() => handleStatusChange(facility.id, 'idle')}
                          >
                            暫停
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* 記憶搜尋 */}
        {activeTab === 'memory' && (
          <div className="space-y-4">
            <Card variant="default" padding="md">
              <SectionHeader title="記憶搜尋引擎" subtitle="全文搜尋 + 關聯推薦 — 跨設施知識探索" />
              <div className="mt-4 relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                {searching && (
                  <Loader2
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 animate-spin"
                  />
                )}
                <input
                  type="text"
                  placeholder="搜尋記憶（支援中英文）..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>
            </Card>

            {/* 搜尋結果 */}
            {searchQuery && (
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-neutral-900">
                    搜尋結果
                    <span className="text-neutral-400 font-normal ml-2">
                      {searchResults.length} 筆
                      {relatedResults.length > 0 && ` + ${relatedResults.length} 關聯`}
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setRelatedResults([]);
                    }}
                  >
                    <X size={14} className="text-neutral-400" />
                  </button>
                </div>

                {searchResults.length === 0 && !searching && (
                  <div className="p-6 text-center text-neutral-400">
                    <Search size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">無搜尋結果</p>
                  </div>
                )}

                <div className="space-y-3">
                  {searchResults.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 border border-neutral-100 rounded-lg hover:border-neutral-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="info" size="xs">
                              {entry.type}
                            </Badge>
                            <span className="text-[10px] text-neutral-400">{entry.agentName}</span>
                          </div>
                          <h4 className="text-sm font-bold text-neutral-900">{entry.title}</h4>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {entry.summary}
                          </p>
                          {entry.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {entry.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 py-0.5 bg-neutral-100 text-[9px] text-neutral-500 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-300 ml-2">
                          {new Date(entry.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 關聯推薦 */}
                {relatedResults.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-500 mb-3 flex items-center gap-1.5">
                      <ArrowRight size={12} />
                      關聯推薦
                    </h4>
                    <div className="space-y-2">
                      {relatedResults.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-2 bg-neutral-50 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[10px] text-neutral-400 mr-2">{entry.type}</span>
                            <span className="text-xs text-neutral-700">{entry.title}</span>
                          </div>
                          <span className="text-[10px] text-neutral-300">{entry.agentName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* 所有記憶列表 */}
            {!searchQuery && (
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-neutral-900">
                    所有記憶
                    <span className="text-neutral-400 font-normal ml-2">{memories.length} 筆</span>
                  </h3>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus size={12} />}
                    onClick={handleCreateMemory}
                  >
                    新增
                  </Button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {memories.length === 0 ? (
                    <div className="p-6 text-center text-neutral-400">
                      <Database size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">尚無記憶</p>
                    </div>
                  ) : (
                    memories.slice(0, 50).map((entry) => (
                      <div key={entry.id} className="p-3 border border-neutral-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="info" size="xs">
                            {entry.type}
                          </Badge>
                          <span className="text-[10px] text-neutral-400">{entry.agentName}</span>
                        </div>
                        <h4 className="text-xs font-bold text-neutral-900">{entry.title}</h4>
                        <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                          {entry.summary}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 任務視覺化 */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="任務流程" subtitle="設施間的任務分派與協作" />
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={12} />}
                  onClick={handleCreateTask}
                >
                  新增任務
                </Button>
              </div>

              {tasks.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <GitBranch size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">尚無任務</p>
                  <p className="text-[10px] mt-1">新增任務以查看設施間流程圖</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 任務流程 DAG 視覺化 */}
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 overflow-x-auto">
                    <div className="flex items-center gap-2 flex-wrap min-w-max">
                      {/* 按狀態分組顯示流程 */}
                      {['pending', 'accepted', 'running', 'completed'].map((status) => {
                        const statusTasks = tasks.filter((t) => t.status === status);
                        if (statusTasks.length === 0) return null;
                        return (
                          <React.Fragment key={status}>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                                {status === 'pending'
                                  ? '待處理'
                                  : status === 'accepted'
                                  ? '已接受'
                                  : status === 'running'
                                  ? '執行中'
                                  : '已完成'}
                              </span>
                              {statusTasks.slice(0, 3).map((t) => (
                                <div
                                  key={t.id}
                                  onClick={() =>
                                    setSelectedTask(selectedTask?.id === t.id ? null : t)
                                  }
                                  className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer border ${
                                    selectedTask?.id === t.id
                                      ? 'border-neutral-900 bg-white'
                                      : 'border-transparent bg-white'
                                  }`}
                                  style={{
                                    borderLeft: `3px solid ${
                                      status === 'pending'
                                        ? '#94a3b8'
                                        : status === 'accepted'
                                        ? '#3b82f6'
                                        : status === 'running'
                                        ? '#f59e0b'
                                        : '#10b981'
                                    }`,
                                  }}
                                >
                                  {t.title}
                                </div>
                              ))}
                              {statusTasks.length > 3 && (
                                <span className="text-[9px] text-neutral-400 pl-2">
                                  +{statusTasks.length - 3} 更多
                                </span>
                              )}
                            </div>
                            <ArrowRight size={14} className="text-neutral-300 mx-1" />
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* 任務列表 */}
                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const assignee = facilities.find((f) => f.id === task.assignedTo);
                      return (
                        <div
                          key={task.id}
                          onClick={() =>
                            setSelectedTask(selectedTask?.id === task.id ? null : task)
                          }
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedTask?.id === task.id
                              ? 'border-neutral-300 bg-white'
                              : 'border-neutral-100 bg-white hover:border-neutral-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  task.status === 'completed'
                                    ? 'bg-emerald-500'
                                    : task.status === 'running'
                                    ? 'bg-amber-500'
                                    : task.status === 'failed'
                                    ? 'bg-red-500'
                                    : 'bg-neutral-300'
                                }`}
                              />
                              <div>
                                <h4 className="text-sm font-bold text-neutral-900">{task.title}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] text-neutral-400">
                                    {assignee?.displayName || task.assignedTo}
                                  </span>
                                  <span className="text-[10px] text-neutral-300">
                                    {new Date(task.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={TASK_STATUS_COLOR[task.status] || 'neutral'} size="sm">
                              {task.status}
                            </Badge>
                          </div>

                          {/* 展開細節 */}
                          {selectedTask?.id === task.id && (
                            <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-[10px]">
                                <div>
                                  <span className="text-neutral-400">指派者</span>
                                  <p className="text-neutral-700 font-medium">{task.assignedBy}</p>
                                </div>
                                <div>
                                  <span className="text-neutral-400">優先級</span>
                                  <p className="text-neutral-700 font-medium">{task.priority}</p>
                                </div>
                                {task.startedAt && (
                                  <div>
                                    <span className="text-neutral-400">開始時間</span>
                                    <p className="text-neutral-700 font-medium">
                                      {new Date(task.startedAt).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                                {task.completedAt && (
                                  <div>
                                    <span className="text-neutral-400">完成時間</span>
                                    <p className="text-neutral-700 font-medium">
                                      {new Date(task.completedAt).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {task.subtaskIds.length > 0 && (
                                <div>
                                  <span className="text-[10px] text-neutral-400">子任務</span>
                                  <div className="flex gap-1 mt-1">
                                    {task.subtaskIds.map((subId) => (
                                      <span
                                        key={subId}
                                        className="px-1.5 py-0.5 bg-neutral-100 text-[9px] text-neutral-500 rounded"
                                      >
                                        {subId.substring(0, 12)}...
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {task.status !== 'completed' && (
                                <div className="flex gap-2 pt-2">
                                  {task.status === 'pending' && (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => handleStatusChange(task.assignedTo, 'running')}
                                    >
                                      開始
                                    </Button>
                                  )}
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<CheckCircle2 size={12} />}
                                    onClick={async () => {
                                      await fetch('/api/hub', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          action: 'complete',
                                          taskId: task.id,
                                          output: { completed: true },
                                        }),
                                      });
                                      fetchTasks();
                                      fetchStats();
                                    }}
                                  >
                                    完成
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
