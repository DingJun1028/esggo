'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { 
  CheckSquare, Search, Plus, ShieldCheck, Activity, Brain, 
  Lock, Loader2, Clock, User, AlertCircle, Calendar,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  dueDate: string;
  hashLock: string | null;
}

const mockTasks: Task[] = [
  {
    id: 'TSK-2026-001',
    title: 'ISO 14064-1 溫室氣體盤查報告初稿',
    description: '完成總部與三廠的範疇一、範疇二數據彙整與盤查報告初稿。',
    assignee: 'Alice Chen',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-06-15',
    hashLock: '0x8f4d...3a21'
  },
  {
    id: 'TSK-2026-002',
    title: '供應商 ESG 評鑑問卷發放',
    description: '針對前 50 大供應商發放年度 ESG 評鑑問卷，並追蹤回收率。',
    assignee: 'Bob Lin',
    priority: 'Medium',
    status: 'Todo',
    dueDate: '2026-06-20',
    hashLock: null
  },
  {
    id: 'TSK-2026-003',
    title: '第一季廢棄物減量指標覆核',
    description: '驗證廠區第一季廢棄物減量是否達標，並提交第三方稽核。',
    assignee: 'Charlie Wang',
    priority: 'High',
    status: 'Review',
    dueDate: '2026-06-10',
    hashLock: '0x1c9f...9d4f'
  },
  {
    id: 'TSK-2026-004',
    title: '綠電採購合約簽署 (CPPA)',
    description: '與風能供應商完成 5MW 綠電採購十年期合約簽署。',
    assignee: 'Alice Chen',
    priority: 'Low',
    status: 'Done',
    dueDate: '2026-05-30',
    hashLock: '0x9b2a...1f8e'
  }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Todo' | 'In Progress' | 'Review' | 'Done'>('All');

  useEffect(() => {
    // 模擬 API 載入
    const fetchTasks = async () => {
      setLoading(true);
      setTimeout(() => {
        setTasks(mockTasks);
        setLoading(false);
      }, 800);
    };
    fetchTasks();
  }, []);

  const handleSeal = async (id: string) => {
    setSealingId(id);
    try {
      // 模擬 5T 封印過程
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, hashLock: `0x${Math.random().toString(16).slice(2, 10)}...5t` } : t
      ));
    } finally {
      setSealingId(null);
    }
  };

  const handleAddTask = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const filteredTasks = tasks.filter(t => activeTab === 'All' || t.status === activeTab);

  const priorityColors = {
    High: 'text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20',
    Medium: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    Low: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
  };

  const statusMap = {
    'Todo': { label: '待辦事項', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400' },
    'In Progress': { label: '進行中', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' },
    'Review': { label: '審核中', color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400' },
    'Done': { label: '已完成', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30 shadow-sm relative group">
              <CheckSquare className="text-blue-600 dark:text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm" icon={<Brain size={12}/>}>OmniAgent 輔助中</OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">ESG-TASKS</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">任務中心</h1>
              <p className="text-slate-500 text-sm mt-1">跨部門 ESG 協作與治理執行看板，整合 5T 協議確保過程可溯源。</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton variant="outline" icon={<Search size={16}/>} className="flex-1 md:flex-none">搜尋</OmniButton>
            <OmniButton variant="primary" icon={<Plus size={16}/>} onClick={handleAddTask} isLoading={isProcessing} className="flex-1 md:flex-none">
              新增任務
            </OmniButton>
          </div>
        </header>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '全部任務', count: tasks.length, icon: CheckSquare, color: 'text-blue-500' },
            { label: '待處理', count: tasks.filter(t => t.status === 'Todo').length, icon: Clock, color: 'text-slate-500' },
            { label: '進行中', count: tasks.filter(t => t.status === 'In Progress').length, icon: Activity, color: 'text-cyan-500' },
            { label: '待審核', count: tasks.filter(t => t.status === 'Review').length, icon: AlertCircle, color: 'text-purple-500' }
          ].map((stat, idx) => (
            <OmniBaseCard key={idx} variant="default" className="p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 tracking-wider">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className="text-3xl font-black">{stat.count}</div>
            </OmniBaseCard>
          ))}
        </div>

        {/* Task Board Area */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Todo', 'In Progress', 'Review', 'Done'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                )}
              >
                {tab === 'All' ? '全部任務' : statusMap[tab as keyof typeof statusMap].label}
              </button>
            ))}
          </div>

          {/* Task List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm font-medium tracking-widest uppercase">載入任務數據中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map(task => (
                <OmniBaseCard key={task.id} variant="default" className="p-0 overflow-hidden flex flex-col hover:border-blue-500/30 transition-colors group">
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col gap-2">
                        <span className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border", priorityColors[task.priority])}>
                          {task.priority} Priority
                        </span>
                        <span className="text-xs font-mono text-slate-400">{task.id}</span>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="font-medium">{task.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <User size={14} className="text-slate-400" />
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className={cn("px-2.5 py-1 rounded-full text-xs font-bold", statusMap[task.status].color)}>
                      {statusMap[task.status].label}
                    </div>

                    {task.hashLock ? (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-500/20" title="5T Protocol Sealed">
                        <ShieldCheck size={14} />
                        {task.hashLock.substring(0, 10)}
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSeal(task.id)}
                        disabled={sealingId === task.id}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors disabled:opacity-50"
                      >
                        {sealingId === task.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                        上鏈封裝 (5T)
                      </button>
                    )}
                  </div>
                </OmniBaseCard>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
