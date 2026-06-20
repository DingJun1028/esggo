// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  ShieldCheck,
  Zap,
  Brain,
  Lock,
  Loader2,
  CheckCircle2,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Settings,
  Activity,
  Database,
  FileText,
  Globe,
  MessageSquare,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface SubAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error' | 'paused';
  icon: React.ElementType;
  lastAction: string;
  tasksCompleted: number;
  tasksFailed: number;
  avgResponseTime: number;
  capabilities: string[];
}

interface AgentTask {
  id: string;
  agentId: string;
  agentName: string;
  task: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
}

/* ─── Main Page ─── */
export default function AgentsPage() {
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents/status');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || getDefaultAgents());
      } else {
        setAgents(getDefaultAgents());
      }
    } catch {
      setAgents(getDefaultAgents());
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/agents/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch {
      /* ignore */
    }
  };

  const getDefaultAgents = (): SubAgent[] => [
    {
      id: 'sa-001',
      name: 'SustainWrite Agent',
      role: '永續報告撰寫',
      status: 'active',
      icon: FileText,
      lastAction: '正在撰寫 GRI 305 章節',
      tasksCompleted: 47,
      tasksFailed: 2,
      avgResponseTime: 1.2,
      capabilities: ['報告撰寫', 'GRI標準', '數據分析'],
    },
    {
      id: 'sa-002',
      name: 'Intelligence Agent',
      role: '商情分析',
      status: 'active',
      icon: Globe,
      lastAction: '掃描 CBAM 最新動態',
      tasksCompleted: 128,
      tasksFailed: 5,
      avgResponseTime: 0.8,
      capabilities: ['新聞爬取', '法規追蹤', '市場分析'],
    },
    {
      id: 'sa-003',
      name: 'Audit Agent',
      role: '稽核驗證',
      status: 'idle',
      icon: ShieldCheck,
      lastAction: '等待上傳證據檔案',
      tasksCompleted: 89,
      tasksFailed: 1,
      avgResponseTime: 2.1,
      capabilities: ['5T驗證', 'Hash鎖定', '合規檢查'],
    },
    {
      id: 'sa-004',
      name: 'Data Agent',
      role: '數據管理',
      status: 'active',
      icon: Database,
      lastAction: '同步 Supabase 資料',
      tasksCompleted: 256,
      tasksFailed: 8,
      avgResponseTime: 0.5,
      capabilities: ['資料同步', 'ETL處理', '品質檢查'],
    },
    {
      id: 'sa-005',
      name: 'Vault Agent',
      role: '證據保管',
      status: 'idle',
      icon: Lock,
      lastAction: 'Hash 驗證完成',
      tasksCompleted: 64,
      tasksFailed: 0,
      avgResponseTime: 1.5,
      capabilities: ['證據儲存', 'ZKP驗證', '區塊鏈上鏈'],
    },
    {
      id: 'sa-006',
      name: 'Notes Agent',
      role: '筆記整理',
      status: 'active',
      icon: MessageSquare,
      lastAction: '整理會議筆記',
      tasksCompleted: 312,
      tasksFailed: 3,
      avgResponseTime: 0.3,
      capabilities: ['筆記整理', '重點摘要', '分類標籤'],
    },
    {
      id: 'sa-owl',
      name: 'OWL Agent',
      role: '情報與深度洞察',
      status: 'active',
      icon: Brain,
      lastAction: '融合完成，全域情資掃描中',
      tasksCompleted: 999,
      tasksFailed: 12,
      avgResponseTime: 3.2,
      capabilities: ['深度分析', '情報融合', '預測模型'],
    },
  ];

  const handleToggleAgent = async (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== agentId) return a;
        const newStatus = a.status === 'active' ? 'paused' : 'active';
        return { ...a, status: newStatus };
      })
    );
    try {
      await fetch(`/api/agents/${agentId}/toggle`, { method: 'POST' });
    } catch {
      /* ignore */
    }
  };

  const handleRunTask = async (agentId: string, task: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      agentId,
      agentName: agent.name,
      task,
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    try {
      await fetch(`/api/agents/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });
      // Simulate task completion
      setTimeout(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === newTask.id ? { ...t, status: 'completed', progress: 100 } : t))
        );
      }, 3000);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === newTask.id ? { ...t, status: 'failed' } : t)));
    }
  };

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ─── Header ─── */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-neutral-900">子代理管理</h1>
                <p className="text-sm text-neutral-500">管理所有 AI 子代理 · 監控任務執行</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" size="sm">
                {activeAgents} 活躍
              </Badge>
              <Badge variant="info" size="sm">
                {totalTasks} 任務
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  fetchAgents();
                  fetchTasks();
                }}
              >
                <RefreshCw size={14} />
                重新載入
              </Button>
            </div>
          </div>
        </Card>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: '活躍代理', value: activeAgents, icon: Bot, color: 'success' },
            { label: '總任務', value: totalTasks, icon: Activity, color: 'info' },
            { label: '已完成', value: completedTasks, icon: CheckCircle2, color: 'success' },
            {
              label: '平均回應',
              value: `${(
                agents.reduce((s, a) => s + a.avgResponseTime, 0) / (agents.length || 1)
              ).toFixed(1)}s`,
              icon: Zap,
              color: 'warning',
            },
          ].map((stat) => (
            <Card key={stat.label} variant="default" padding="sm">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    stat.color === 'success'
                      ? 'bg-emerald-50'
                      : stat.color === 'info'
                      ? 'bg-blue-50'
                      : 'bg-amber-50'
                  )}
                >
                  <stat.icon
                    size={18}
                    className={cn(
                      stat.color === 'success'
                        ? 'text-emerald-600'
                        : stat.color === 'info'
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    )}
                  />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                  <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ─── Agents Grid ─── */}
        <SectionHeader title="子代理列表" subtitle={`${agents.length} 個代理已註冊`} />

        {loading ? (
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-center gap-3 py-8">
              <Loader2 size={20} className="animate-spin text-neutral-400" />
              <span className="text-sm text-neutral-500">載入中...</span>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card key={agent.id} variant="default" padding="md" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          agent.status === 'active'
                            ? 'bg-emerald-50'
                            : agent.status === 'paused'
                            ? 'bg-amber-50'
                            : agent.status === 'error'
                            ? 'bg-red-50'
                            : 'bg-neutral-100'
                        )}
                      >
                        <Icon
                          size={18}
                          className={cn(
                            agent.status === 'active'
                              ? 'text-emerald-600'
                              : agent.status === 'paused'
                              ? 'text-amber-600'
                              : agent.status === 'error'
                              ? 'text-red-600'
                              : 'text-neutral-400'
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900">{agent.name}</h3>
                        <p className="text-[10px] text-neutral-500">{agent.role}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        agent.status === 'active'
                          ? 'success'
                          : agent.status === 'paused'
                          ? 'warning'
                          : agent.status === 'error'
                          ? 'error'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {agent.status === 'active'
                        ? '運行中'
                        : agent.status === 'paused'
                        ? '已暫停'
                        : agent.status === 'error'
                        ? '錯誤'
                        : '閒置'}
                    </Badge>
                  </div>

                  <p className="text-xs text-neutral-500 mb-3 truncate">{agent.lastAction}</p>

                  <div className="flex items-center gap-3 text-[10px] text-neutral-400 mb-3">
                    <span>完成: {agent.tasksCompleted}</span>
                    <span>失敗: {agent.tasksFailed}</span>
                    <span>回應: {agent.avgResponseTime}s</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {agent.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={agent.status === 'active' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleAgent(agent.id)}
                      className="flex-1"
                    >
                      {agent.status === 'active' ? (
                        <>
                          <Pause size={12} />
                          暫停
                        </>
                      ) : (
                        <>
                          <Play size={12} />
                          啟動
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRunTask(agent.id, `執行 ${agent.role} 任務`)}
                      disabled={agent.status !== 'active'}
                    >
                      <Play size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                    >
                      <Settings size={12} />
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {selectedAgent === agent.id && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                      <p className="text-[10px] font-medium text-neutral-500">快速任務</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.map((cap) => (
                          <button
                            key={cap}
                            onClick={() => handleRunTask(agent.id, cap)}
                            className="text-[9px] px-2 py-1 rounded-full bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          >
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── Task Queue ─── */}
        {tasks.length > 0 && (
          <>
            <SectionHeader title="任務佇列" subtitle={`${tasks.length} 個任務`} />
            <Card variant="default" padding="none">
              <div className="divide-y divide-neutral-50">
                {tasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          task.status === 'running'
                            ? 'bg-blue-500 animate-pulse'
                            : task.status === 'completed'
                            ? 'bg-emerald-500'
                            : task.status === 'failed'
                            ? 'bg-red-500'
                            : 'bg-neutral-300'
                        )}
                      />
                      <div>
                        <p className="text-xs font-medium text-neutral-700">{task.task}</p>
                        <p className="text-[10px] text-neutral-400">
                          {agentName(task.agentId, agents)} ·{' '}
                          {new Date(task.createdAt).toLocaleTimeString('zh-TW')}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.status === 'running'
                          ? 'info'
                          : task.status === 'completed'
                          ? 'success'
                          : task.status === 'failed'
                          ? 'error'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {task.status === 'running'
                        ? '執行中'
                        : task.status === 'completed'
                        ? '已完成'
                        : task.status === 'failed'
                        ? '失敗'
                        : '等待中'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function agentName(id: string, agents: SubAgent[]): string {
  return agents.find((a) => a.id === id)?.name || id;
}
