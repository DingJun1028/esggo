/**
 * 🤖 InterAgentDashboard - AI 對接儀表板
 * --------------------------------------------------
 * [功能] 顯示多 AI 系統狀態、任務進度與服務調用
 */

import React, { useEffect, useState } from 'react';
import { useInterAgent } from '@/hooks/useInterAgent';
import {
  Bot,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Link2,
  ArrowRight,
  Users,
  Layers,
  Globe,
  Shield,
} from 'lucide-react';

interface InterAgentDashboardProps {
  className?: string;
}

const STATUS_COLORS = {
  idle: 'bg-green-500',
  busy: 'bg-yellow-500',
  offline: 'bg-red-500',
};

const TASK_STATUS_COLORS = {
  pending: 'text-yellow-400',
  in_progress: 'text-blue-400',
  completed: 'text-green-400',
  failed: 'text-red-400',
  blocked: 'text-orange-400',
};

export const InterAgentDashboard: React.FC<InterAgentDashboardProps> = ({ className = '' }) => {
  const { agents, tasks, availableAgents, isConnected, refresh } = useInterAgent();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  return (
    <div className={`liquid-glass rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI 對接中心</h3>
            <p className="text-sm text-slate-400">多系統任務協調與服務發現</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-400'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-1" />
            {autoRefresh ? '自動' : '手動'}
          </button>
          <button onClick={refresh} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Zap className="w-5 h-5 text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
        />
        <span className="text-sm text-slate-400">
          {isConnected ? '已連接至 AI 協調網絡' : '連接中...'}
        </span>
        <span className="text-xs text-slate-500 ml-auto">{agents.length} 個 AI 節點</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">在線 AI</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {agents.filter(a => a.status !== 'offline').length}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">可用 AI</span>
          </div>
          <div className="text-2xl font-bold text-white">{availableAgents.length}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">進行中任務</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {tasks.filter(t => t.status === 'in_progress').length}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">已完成</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          AI 節點狀態
        </h4>
        <div className="space-y-2">
          {agents.map(agent => (
            <div
              key={agent.agentId}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[agent.status]}`} />
                <div>
                  <div className="text-sm font-medium text-white">
                    {agent.capabilities.agentName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {agent.capabilities.services.slice(0, 3).join(', ')}
                    {agent.capabilities.services.length > 3 && '...'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">
                  {agent.currentTasks.length}/{agent.capabilities.maxConcurrentTasks}
                </div>
                <div className="text-xs text-slate-500">任務</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <h4 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          最近任務
        </h4>
        <div className="space-y-2">
          {tasks.slice(0, 5).map(task => (
            <div
              key={task.taskId}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
            >
              <div className="flex items-center gap-3">
                {task.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : task.status === 'in_progress' ? (
                  <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                ) : task.status === 'blocked' ? (
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <div className="text-sm font-medium text-white">{task.title}</div>
                  <div className="text-xs text-slate-500">
                    {task.assignee ? `負責: ${task.assignee}` : '未分配'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`text-sm font-bold ${TASK_STATUS_COLORS[task.status]}`}>
                    {task.progress}%
                  </div>
                  <div className="text-xs text-slate-500">進度</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无任務</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterAgentDashboard;
