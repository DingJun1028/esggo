'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Plus, Play, CheckCircle, XCircle, AlertTriangle,
  Clock, FileText, Shield, Activity, RefreshCw, Zap,
  Search, ChevronRight, ArrowUpRight, Info, Layers, List, Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn, staggerContainer } from '../../lib/animations';
import { SKILL_REGISTRY } from '../../lib/agent/registry';
import { UniversalPageConfig } from '../../lib/page-config';

interface ExecutionRecord {
  task: any;
  execution: any;
  artifact: any;
  policy: any;
}

const TASK_TYPE_META: Record<string, { label: string; color: string }> = {
  report_drafting: { label: '報告撰寫', color: '#003262' },
  compliance_review: { label: '合規審查', color: '#8B5CF6' },
  evidence_mapping: { label: '證據映射', color: '#10B981' },
  task_planning: { label: '任務規劃', color: '#3B7EA1' },
};

const TASK_ICONS: Record<string, React.ReactNode> = {
  report_drafting: <FileText size={16} />,
  compliance_review: <Shield size={16} />,
  evidence_mapping: <Layers size={16} />,
  task_planning: <List size={16} />,
};

const REVIEW_STATUS_MAP: Record<string, { label: string; variant: any }> = {
  awaiting_review: { label: '待審核', variant: 'warning' },
  approved: { label: '已核准', variant: 'info' },
  rejected: { label: '已拒絕', variant: 'error' },
  promoted: { label: '已封印', variant: 'success' },
};

export default function OrchestratorPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'executions' | 'swarm' | 'registry' | 'audit'>('executions');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ExecutionRecord | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form State
  const [taskType, setTaskType] = useState<keyof typeof TASK_TYPE_META>('report_drafting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(SKILL_REGISTRY[0].skillKey);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [tRes, eRes, aRes, auRes] = await Promise.all([
        fetch('/api/agent/tasks'),
        fetch('/api/agent/executions'),
        fetch('/api/agent/artifacts'),
        fetch('/api/audit-log')
      ]);
      const [tData, eData, aData, auData] = await Promise.all([tRes.json(), eRes.json(), aRes.json(), auRes.json()]);
      
      setTasks(tData.tasks || []);
      const merged = (tData.tasks || []).map((t: any) => ({
        task: t,
        execution: eData.executions?.find((e: any) => e.taskId === t.id) || null,
        artifact: aData.artifacts?.find((a: any) => a.taskId === t.id) || null,
        policy: null
      }));
      setExecutions(merged);
      setAuditLogs(auData.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleCreate() {
    if (!title.trim()) { showToast('請填寫任務標題', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: 'user_001', taskType, title, description, skillKey: selectedSkill }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const rec: ExecutionRecord = { task: data.task, execution: null, artifact: null, policy: data.policy };
      setExecutions(prev => [rec, ...prev]);
      setSelected(rec);
      setTitle(''); setDescription('');
      setActiveTab('executions');
      showToast('任務建立成功，政策守門已通過');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute(rec: ExecutionRecord) {
    setLoading(true);
    try {
      const res = await fetch(`/api/agent/tasks/${rec.task.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: rec.task }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const updated: ExecutionRecord = { ...rec, execution: data.execution, artifact: data.artifact };
      setExecutions(prev => prev.map(r => r.task.id === rec.task.id ? updated : r));
      setSelected(updated);
      showToast('OmniAgent 執行完成，草稿已生成');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const pageConfig: UniversalPageConfig = {
    id: 'omniagent-orchestrator',
    title: 'OmniAgent 調度中心',
    subtitle: 'Swarm Orchestration · 多代理任務並行 · 5T 治理日誌。',
    icon: <Bot size={32} className="text-berkeley-blue" />,
    griReference: 'Orchestrator',
    activeT5Tags: ['T3', 'T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'create', label: '建立代理任務', icon: <Plus size={16}/>, onClick: () => setActiveTab('create') },
      { id: 'refresh', label: '刷新', icon: <RefreshCw size={16}/>, variant: 'secondary', onClick: fetchTasks }
    ],

    kpis: [
      { key: 'active', label: '活躍 Agent', value: '4', icon: <Bot size={18}/>, verified: true },
      { key: 'tasks', label: '累計任務', value: tasks.length.toString(), icon: <FileText size={18}/> },
      { key: 'uptime', label: '系統負載', value: '1.24', unit: 'load', icon: <Activity size={18}/> },
    ],

    sections: [
      {
        id: 'nav',
        title: '資源導覽',
        columns: 12,
        component: (
          <Tabs 
            active={activeTab}
            onChange={(t) => setActiveTab(t as any)}
            tabs={[
              { key: 'create', label: '新增任務', icon: <Plus size={14}/> },
              { key: 'executions', label: '執行清單', icon: <Activity size={14}/> },
              { key: 'swarm', label: '蜂群看板', icon: <Bot size={14}/> },
              { key: 'registry', label: '技能庫', icon: <Zap size={14}/> },
              { key: 'audit', label: '治理日誌', icon: <Shield size={14}/> },
            ]}
            variant="pills"
          />
        )
      },
      {
        id: 'main-content',
        title: activeTab.toUpperCase(),
        columns: 12,
        component: (
          <div className="min-h-[400px]">
            {activeTab === 'create' && (
              <div className="space-y-10 animate-in fade-in max-w-4xl pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(TASK_TYPE_META).map(([type, m]) => (
                    <button
                      key={type}
                      onClick={() => setTaskType(type as any)}
                      className={cn(
                        "p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left group relative overflow-hidden",
                        taskType === type ? 'bg-berkeley-blue/5 border-berkeley-blue shadow-lg' : 'bg-white border-slate-100 hover:border-berkeley-blue/30'
                      )}
                    >
                      <div className="mb-6 transition-transform group-hover:scale-110 relative z-10" style={{ color: m.color }}>{TASK_ICONS[type]}</div>
                      <p className={cn("text-xs font-black uppercase tracking-widest relative z-10", taskType === type ? 'text-berkeley-blue' : 'text-slate-400')}>{m.label}</p>
                      {taskType === type && <motion.div layoutId="bg-pill" className="absolute inset-0 bg-berkeley-blue/5 z-0" />}
                    </button>
                  ))}
                </div>
                <div className="space-y-8">
                   <Input label="任務標題 (Task Title)" placeholder="例如：能源數據提取任務" value={title} onChange={e => setTitle(e.target.value)} />
                   <div className="space-y-2.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">任務說明 (Description)</label>
                      <textarea className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-berkeley-blue/5 transition-all min-h-[160px] shadow-inner" value={description} onChange={e => setDescription(e.target.value)} placeholder="請輸入任務詳細背景與 5T 要求..." />
                   </div>
                   <Button variant="primary" className="w-full h-16 rounded-[2rem] text-base tracking-widest shadow-glass" onClick={handleCreate} isLoading={loading}>
                      <Shield size={20} className="mr-3"/> 啟動 Policy Guard 並建立
                   </Button>
                </div>
              </div>
            )}

            {activeTab === 'executions' && (
              <DataTable 
                columns={[
                  { key: 'title', header: '任務標題', render: (_: any, rec: any) => <span className="font-bold text-slate-800">{rec.task.title}</span> },
                  { key: 'status', header: '執行狀態', render: (_: any, rec: any) => (
                    <Badge variant={rec.artifact ? (REVIEW_STATUS_MAP[rec.artifact.reviewStatus]?.variant || 'verified') : 'draft'}>
                      {rec.artifact ? REVIEW_STATUS_MAP[rec.artifact.reviewStatus]?.label : '待執行'}
                    </Badge>
                  ) },
                  { key: 'time', header: '建立時間', render: (_: any, rec: any) => <span className="text-[11px] font-mono text-slate-400 font-bold">{new Date(rec.task.createdAt).toLocaleString()}</span> },
                  { key: 'action', header: '', render: (_: any, rec: any) => <Button variant="glass" size="sm" className="h-9 px-5 rounded-xl text-[11px] font-bold" onClick={() => setSelected(rec)}>檢視詳情</Button> }
                ]}
                data={executions as any[]}
                searchable
                searchPlaceholder="搜尋調度任務..."
              />
            )}

            {activeTab === 'swarm' && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-full">
                  {['backlog', 'running', 'review', 'done'].map(lane => (
                    <div key={lane} className="bg-slate-50/30 rounded-[3rem] p-8 border border-slate-100/50 min-h-[600px] flex flex-col shadow-inner">
                       <div className="flex items-center justify-between mb-8 px-2">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">{lane}</p>
                          <Badge variant="primary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                            {executions.filter(r => {
                                if (lane === 'backlog') return !r.execution;
                                if (lane === 'running') return r.execution?.status === 'running';
                                if (lane === 'review') return r.artifact?.reviewStatus === 'awaiting_review';
                                return r.artifact?.reviewStatus === 'promoted';
                            }).length}
                          </Badge>
                       </div>
                       <div className="space-y-5 flex-1">
                          {executions.filter(r => {
                            if (lane === 'backlog') return !r.execution;
                            if (lane === 'running') return r.execution?.status === 'running';
                            if (lane === 'review') return r.artifact?.reviewStatus === 'awaiting_review';
                            return r.artifact?.reviewStatus === 'promoted';
                          }).map(r => (
                            <motion.div layoutId={r.task.id} key={r.task.id} onClick={() => setSelected(r)} className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] shadow-glass border border-white/80 cursor-pointer hover:border-berkeley-blue/40 hover:shadow-lg transition-all group">
                               <div className="flex items-center justify-between mb-5">
                                  <div style={{ color: TASK_TYPE_META[r.task.taskType]?.color }}>{TASK_ICONS[r.task.taskType]}</div>
                                   <BrandStatusDot status={r.execution?.status === 'running' ? 'active' : 'inactive'} pulse={r.execution?.status === 'running'} />
                               </div>
                               <p className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug mb-5">{r.task.title}</p>
                               <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-4 border-t border-slate-100/50">
                                  <span className="text-[10px] font-mono text-slate-300 font-bold uppercase">#{r.task.id.slice(-6)}</span>
                                  <ChevronRight size={14} className="text-berkeley-blue" />
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            )}
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative h-full">
      <StandardPage config={pageConfig} />

      <AnimatePresence>
        {selected && (
          <Modal 
            open={!!selected} 
            onClose={() => setSelected(null)} 
            title="任務執行詳情" 
            size="xl"
            subtitle={`Task ID: ${selected.task.id}`}
          >
            <div className="space-y-10 py-2">
               <div className="p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">任務背景 (Task Context)</p>
                  <h3 className="text-2xl font-black text-berkeley-blue mb-4 tracking-tight">{selected.task.title}</h3>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{selected.task.description || '無詳細說明'}</p>
               </div>
               
               {selected.artifact ? (
                 <div className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                       <div className="flex items-center gap-3">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">產出草稿 (v{selected.artifact.version})</p>
                          <div className="h-1 w-1 rounded-full bg-slate-300" />
                          <p className="text-[10px] font-bold text-berkeley-blue/60 uppercase font-mono">{selected.artifact.id}</p>
                       </div>
                       <Badge variant="verified" className="px-4 py-1.5 text-[11px]">AI CONFIDENCE: {Math.round((selected.artifact.confidence || 0.92) * 100)}%</Badge>
                    </div>
                    <div className="p-10 bg-white border border-slate-200 rounded-[3rem] text-[15px] text-slate-700 leading-relaxed font-medium font-mono max-h-[400px] overflow-y-auto shadow-inner scrollbar-hide">
                       {selected.artifact.content}
                    </div>
                    <div className="flex gap-4 pt-4">
                       <Button variant="primary" className="flex-1 h-14 rounded-2xl shadow-glass text-base tracking-widest">核准並執行 5T 封印</Button>
                       <Button variant="glass" className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-500 hover:text-error hover:border-error/20">要求修正細節</Button>
                    </div>
                 </div>
               ) : (
                 <Button variant="primary" className="w-full h-16 rounded-[2rem] text-lg tracking-[0.2em] shadow-xl" onClick={() => handleExecute(selected)} isLoading={loading}>
                    <Play size={24} className="mr-4" fill="currentColor"/> 啟動 HERMES AI 執行序列
                 </Button>
               )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-12 right-12 z-[10000]">
            <div className={cn("px-8 py-5 rounded-[2rem] shadow-2xl text-white font-black text-sm flex items-center gap-5 border border-white/20 backdrop-blur-xl", toast.type === 'error' ? 'bg-error' : 'bg-berkeley-blue')}>
               {toast.type === 'error' ? <XCircle size={24} /> : <CheckCircle size={24} className="text-california-gold" />}
               <span className="tracking-tight">{toast.msg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
