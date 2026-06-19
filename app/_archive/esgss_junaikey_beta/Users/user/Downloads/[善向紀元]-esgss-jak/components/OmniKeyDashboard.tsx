import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Brain,
  MemoryStick,
  Hammer,
  Gem,
  Cpu,
  Users,
  Activity,
  Zap,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Target,
  ArrowRight,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { omniKeyCore, OmniKeyEvents } from '../services/omniKey-core';

interface PillarStatus {
  selfNavigation: boolean;
  longTermMemory: {
    knowledgeCount: number;
    experiencePatterns: number;
    decisionHistory: number;
  };
  authorityForging: {
    capabilitiesCount: number;
    evolutionIndex: number;
  };
  runeEngrafting: {
    integratedCapabilities: number;
    pluginCount: number;
  };
}

interface AgentStatus {
  total: number;
  active: number;
  groups: number;
}

interface TaskStatus {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  failed: number;
}

interface SyncStatus {
  endpoints: number;
  activeEndpoints: number;
  recentOperations: any[];
}

const OmniKeyDashboard: React.FC = () => {
  const [pillarsStatus, setPillarsStatus] = useState<PillarStatus | null>(null);
  const [agentsStatus, setAgentsStatus] = useState<AgentStatus | null>(null);
  const [tasksStatus, setTasksStatus] = useState<TaskStatus | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'overview' | 'pillars' | 'agents' | 'tasks' | 'sync'>('overview');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 監聽 OmniKey 事件
  useEffect(() => {
    const handleCoreReady = (data: OmniKeyEvents['core-ready'][0]) => {
      setIsConnected(true);
      loadAllStatus();
    };

    const handleCoreError = (data: OmniKeyEvents['core-error'][0]) => {
      setIsConnected(false);
      setSystemHealth('critical');
    };

    const handleTaskUpdate = () => {
      loadTasksStatus();
      setLastUpdate(new Date());
    };

    const handleSyncUpdate = () => {
      loadSyncStatus();
      setLastUpdate(new Date());
    };

    omniKeyCore.on('core-ready', handleCoreReady);
    omniKeyCore.on('core-error', handleCoreError);
    omniKeyCore.on('task-started', handleTaskUpdate);
    omniKeyCore.on('task-completed', handleTaskUpdate);
    omniKeyCore.on('task-failed', handleTaskUpdate);
    omniKeyCore.on('sync-completed', handleSyncUpdate);
    omniKeyCore.on('sync-failed', handleSyncUpdate);

    // 初始化載入
    loadAllStatus();

    return () => {
      omniKeyCore.removeAllListeners();
    };
  }, []);

  const loadAllStatus = useCallback(async () => {
    try {
      setPillarsStatus(omniKeyCore.getPillarsStatus());
      setAgentsStatus(omniKeyCore.getAgentsStatus());
      setTasksStatus(omniKeyCore.getTasksStatus());
      setSyncStatus(omniKeyCore.getSyncStatus());
      setLastUpdate(new Date());
      updateSystemHealth();
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  }, []);

  const loadPillarsStatus = () => setPillarsStatus(omniKeyCore.getPillarsStatus());
  const loadAgentsStatus = () => setAgentsStatus(omniKeyCore.getAgentsStatus());
  const loadTasksStatus = () => setTasksStatus(omniKeyCore.getTasksStatus());
  const loadSyncStatus = () => setSyncStatus(omniKeyCore.getSyncStatus());

  const updateSystemHealth = () => {
    if (!isConnected) {
      setSystemHealth('critical');
      return;
    }

    if (tasksStatus?.failed && tasksStatus.failed > 0) {
      setSystemHealth('warning');
      return;
    }

    setSystemHealth('healthy');
  };

  useEffect(() => {
    updateSystemHealth();
  }, [isConnected, tasksStatus]);

  const getPillarIcon = (pillar: string) => {
    switch (pillar) {
      case 'selfNavigation': return <Target className="h-6 w-6" />;
      case 'longTermMemory': return <MemoryStick className="h-6 w-6" />;
      case 'authorityForging': return <Hammer className="h-6 w-6" />;
      case 'runeEngrafting': return <Gem className="h-6 w-6" />;
      default: return <Activity className="h-6 w-6" />;
    }
  };

  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'selfNavigation': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'longTermMemory': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'authorityForging': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'runeEngrafting': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-700 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    return `${hours} 小時前`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 系統健康狀態 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">系統健康狀態</h3>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-slate-600">
              上次更新: {formatTimeAgo(lastUpdate)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${getHealthColor(systemHealth)}`}>
            <div className="flex items-center gap-2 mb-2">
              {getHealthIcon(systemHealth)}
              <span className="font-medium">系統狀態</span>
            </div>
            <div className="text-2xl font-bold capitalize">{systemHealth}</div>
          </div>

          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">活躍代理</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {agentsStatus?.active || 0}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-700">執行任務</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {tasksStatus?.inProgress || 0}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-700">同步端點</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {syncStatus?.activeEndpoints || 0}
            </div>
          </div>
        </div>
      </div>

      {/* 四大支柱狀態 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Jun.Ai.Key 四大核心支柱</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillarsStatus && Object.entries(pillarsStatus).map(([pillar, data]) => (
            <div key={pillar} className={`p-4 rounded-lg border ${getPillarColor(pillar)}`}>
              <div className="flex items-center gap-2 mb-3">
                {getPillarIcon(pillar)}
                <span className="font-medium capitalize">
                  {pillar === 'selfNavigation' ? '自我導航' :
                   pillar === 'longTermMemory' ? '永久記憶' :
                   pillar === 'authorityForging' ? '權能冶煉' :
                   pillar === 'runeEngrafting' ? '符文嵌合' : pillar}
                </span>
              </div>

              {pillar === 'selfNavigation' && (
                <div className="text-sm">
                  <div className="text-2xl font-bold mb-1">
                    {data ? '✓' : '○'}
                  </div>
                  <div className="text-xs opacity-75">狀態</div>
                </div>
              )}

              {pillar === 'longTermMemory' && (
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-xs opacity-75">知識: </span>
                    <span className="font-bold">{data.knowledgeCount}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-xs opacity-75">模式: </span>
                    <span className="font-bold">{data.experiencePatterns}</span>
                  </div>
                </div>
              )}

              {pillar === 'authorityForging' && (
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-xs opacity-75">能力: </span>
                    <span className="font-bold">{data.capabilitiesCount}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-xs opacity-75">進化: </span>
                    <span className="font-bold">{(data.evolutionIndex * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}

              {pillar === 'runeEngrafting' && (
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="text-xs opacity-75">整合: </span>
                    <span className="font-bold">{data.integratedCapabilities}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-xs opacity-75">插件: </span>
                    <span className="font-bold">{data.pluginCount}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">快速操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => omniKeyCore.createTask({ type: 'analysis', priority: 'high' })}
            className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-blue-700">執行分析</div>
          </button>

          <button
            onClick={() => omniKeyCore.createTask({ type: 'data_sync', priority: 'medium' })}
            className="p-4 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <RefreshCw className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-green-700">數據同步</div>
          </button>

          <button
            onClick={() => omniKeyCore.createTask({ type: 'integration', priority: 'medium' })}
            className="p-4 border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
            <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-purple-700">系統整合</div>
          </button>

          <button
            onClick={() => setActiveView('pillars')}
            className="p-4 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
          >
            <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-orange-700">支柱詳情</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPillarsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">四大核心支柱詳情</h2>
        <button
          onClick={() => setActiveView('overview')}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
        >
          返回總覽
        </button>
      </div>

      {/* 支柱詳情卡片 */}
      {pillarsStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 自我導航 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">自我導航</h3>
                <p className="text-sm text-slate-600">Proxy of Authority</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">狀態</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pillarsStatus.selfNavigation
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {pillarsStatus.selfNavigation ? '活躍' : '待機'}
                </span>
              </div>
              <p className="text-sm text-slate-700">
                讓 AI 成為你意志的延伸，主動規劃與執行任務，根據用戶意圖自主協調各系統。
              </p>
            </div>
          </div>

          {/* 永久記憶 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MemoryStick className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">永久記憶</h3>
                <p className="text-sm text-slate-600">Mind Atlas</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {pillarsStatus.longTermMemory.knowledgeCount}
                  </div>
                  <div className="text-sm text-slate-600">知識點</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {pillarsStatus.longTermMemory.experiencePatterns}
                  </div>
                  <div className="text-sm text-slate-600">經驗模式</div>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                結構化知識圖譜，記錄所有操作、決策脈絡，形成個人知識根基。
              </p>
            </div>
          </div>

          {/* 權能冶煉 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Hammer className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">權能冶煉</h3>
                <p className="text-sm text-slate-600">Evolution Engine</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {pillarsStatus.authorityForging.capabilitiesCount}
                  </div>
                  <div className="text-sm text-slate-600">專屬能力</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {(pillarsStatus.authorityForging.evolutionIndex * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-600">進化指數</div>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                將重複任務冶煉為專屬能力，持續優化個人化體驗。
              </p>
            </div>
          </div>

          {/* 符文嵌合 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Gem className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">符文嵌合</h3>
                <p className="text-sm text-slate-600">Collective Empowerment</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {pillarsStatus.runeEngrafting.integratedCapabilities}
                  </div>
                  <div className="text-sm text-slate-600">整合能力</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {pillarsStatus.runeEngrafting.pluginCount}
                  </div>
                  <div className="text-sm text-slate-600">插件生態</div>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                無縫整合全球 AI 能力，讓個人 AI 隨時進化。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      {/* 頂部導航 */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                萬能元鑰控制中心
              </h1>
              <p className="text-slate-500 text-sm">OmniKey Core • ESG 數位中台</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? '系統連接正常' : '系統連接中斷'}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadAllStatus}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
            刷新狀態
          </button>
        </div>
      </div>

      {/* 導航標籤 */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200">
          {[
            { id: 'overview', label: '總覽', icon: Activity },
            { id: 'pillars', label: '四大支柱', icon: Brain },
            { id: 'agents', label: '智慧代理', icon: Cpu },
            { id: 'tasks', label: '任務管理', icon: Target },
            { id: 'sync', label: '雙向同步', icon: RefreshCw }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                activeView === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* 內容區域 */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'pillars' && renderPillarsView()}
      {activeView === 'agents' && (
        <div className="text-center py-12">
          <Cpu className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">智慧代理管理功能開發中...</p>
        </div>
      )}
      {activeView === 'tasks' && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">任務管理功能開發中...</p>
        </div>
      )}
      {activeView === 'sync' && (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">雙向同步管理功能開發中...</p>
        </div>
      )}
    </div>
  );
};

export default OmniKeyDashboard;