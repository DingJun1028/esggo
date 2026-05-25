'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import {
  Bot, Plus, Play, CheckCircle, XCircle, AlertTriangle,
  Clock, FileText, Shield, Activity, RefreshCw, Zap,
  Search, ChevronRight, ArrowUpRight, Info, Layers, List, Lock
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandBadge, BrandStatusDot, BrandTable, 
  BrandModal, BrandInput, StandardPage, BrandTabs 
} from '../../components/brand';
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
      showToast('Hermes 執行完成，草稿已生成');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const pageConfig: UniversalPageConfig = {
    id: 'hermes-orchestrator',
    title: 'Hermes 調度中心',
    subtitle: 'Swarm Orchestration · 多代理任務並行 · 5T 治理日誌。',
    icon: <Bot size={32} className="text-[#003262]" />,
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
          <BrandTabs 
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as any)}
            tabs={[
              { id: 'create', label: '新增任務', icon: <Plus size={14}/> },
              { id: 'executions', label: '執行清單', icon: <Activity size={14}/> },
              { id: 'swarm', label: '蜂群看板', icon: <Bot size={14}/> },
              { id: 'registry', label: '技能庫', icon: <Zap size={14}/> },
              { id: 'audit', label: '治理日誌', icon: <Shield size={14}/> },
            ]}
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
              <div className="space-y-8 animate-in fade-in max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(TASK_TYPE_META).map(([type, m]) => (
                    <button
                      key={type}
                      onClick={() => setTaskType(type as any)}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all text-left group",
                        taskType === type ? 'bg-blue-50 border-[#003262] shadow-premium' : 'bg-white border-slate-100 hover:border-blue-200'
                      )}
                    >
                      <div className="mb-4 transition-transform group-hover:scale-110" style={{ color: m.color }}>{TASK_ICONS[type]}</div>
                      <p className={cn("text-xs font-black uppercase tracking-widest", taskType === type ? 'text-[#003262]' : 'text-slate-400')}>{m.label}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-6">
                   <BrandInput label="任務標題 (Task Title)" placeholder="例如：能源數據提取任務" value={title} onChange={e => setTitle(e.target.value)} />
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">任務說明 (Description)</label>
                      <textarea className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all min-h-[120px]" value={description} onChange={e => setDescription(e.target.value)} placeholder="請輸入任務詳細背景..." />
                   </div>
                   <BrandButton variant="primary" fullWidth size="lg" className="h-16 rounded-[2rem] text-base font-black shadow-xl shadow-blue-500/10" onClick={handleCreate} loading={loading}>
                      <Shield size={18} className="mr-2"/> 啟動 Policy Guard 並建立
                   </BrandButton>
                </div>
              </div>
            )}

            {activeTab === 'executions' && (
              <BrandTable 
                columns={[{ key: 'title', label: '標題' }, { key: 'status', label: '狀態' }, { key: 'time', label: '建立時間' }, { key: 'action', label: '' }]}
                data={executions.map(rec => ({
                  title: <span className="font-black text-slate-700">{rec.task.title}</span>,
                  status: <BrandBadge variant={rec.artifact ? REVIEW_STATUS_MAP[rec.artifact.reviewStatus].variant : 'outline'} size="xs">{rec.artifact ? REVIEW_STATUS_MAP[rec.artifact.reviewStatus].label : '待執行'}</BrandBadge>,
                  time: <span className="text-[10px] font-mono text-slate-400">{new Date(rec.task.createdAt).toLocaleString()}</span>,
                  action: <BrandButton variant="ghost" size="xs" className="h-8 px-4 rounded-xl text-[10px] font-black" onClick={() => setSelected(rec)}>詳情</BrandButton>
                }))}
              />
            )}

            {activeTab === 'swarm' && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
                  {['backlog', 'running', 'review', 'done'].map(lane => (
                    <div key={lane} className="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-200/50 min-h-[500px] flex flex-col">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">{lane}</p>
                       <div className="space-y-4 flex-1">
                          {executions.filter(r => {
                            if (lane === 'backlog') return !r.execution;
                            if (lane === 'running') return r.execution?.status === 'running';
                            if (lane === 'review') return r.artifact?.reviewStatus === 'awaiting_review';
                            return r.artifact?.reviewStatus === 'promoted';
                          }).map(r => (
                            <motion.div layoutId={r.task.id} key={r.task.id} onClick={() => setSelected(r)} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-400 hover:shadow-premium transition-all group">
                               <div className="flex items-center justify-between mb-4">
                                  <div style={{ color: TASK_TYPE_META[r.task.taskType]?.color }}>{TASK_ICONS[r.task.taskType]}</div>
                                   <BrandStatusDot status={r.execution?.status === 'running' ? 'active' : 'inactive'} pulse={r.execution?.status === 'running'} size="sm" />
                               </div>
                               <p className="text-xs font-black text-slate-800 line-clamp-2 leading-tight mb-4">{r.task.title}</p>
                               <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pt-4 border-t border-slate-50">
                                  <span className="text-[9px] font-mono text-slate-300">#{r.task.id.slice(-6)}</span>
                                  <ChevronRight size={12} className="text-blue-500" />
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
          <BrandModal open={!!selected} onClose={() => setSelected(null)} title="任務執行詳情" icon={<Bot size={20} className="text-blue-600"/>}>
            <div className="space-y-8 p-2">
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">任務背景 (Task Context)</p>
                  <h3 className="text-xl font-black text-[#003262] mb-3">{selected.task.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{selected.task.description || '無詳細說明'}</p>
               </div>
               
               {selected.artifact ? (
                 <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">產出草稿 (v{selected.artifact.version})</p>
                       <BrandBadge variant="success" size="xs">AI CONFIDENCE: {Math.round((selected.artifact.confidence || 0.92) * 100)}%</BrandBadge>
                    </div>
                    <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] text-sm text-slate-600 leading-relaxed font-medium font-mono max-h-[300px] overflow-y-auto shadow-inner">
                       {selected.artifact.content}
                    </div>
                    <div className="flex gap-4">
                       <BrandButton variant="primary" fullWidth className="h-14 rounded-2xl font-black shadow-lg">核准並封印</BrandButton>
                       <BrandButton variant="secondary" fullWidth className="h-14 rounded-2xl border-slate-200 text-slate-400">要求修改</BrandButton>
                    </div>
                 </div>
               ) : (
                 <BrandButton variant="primary" fullWidth size="lg" className="h-16 rounded-[2rem] font-black shadow-xl" onClick={() => handleExecute(selected)}>
                    <Play size={20} className="mr-2"/> 啟動 Hermes AI 執行
                 </BrandButton>
               )}
            </div>
          </BrandModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-12 right-12 z-[10000]">
            <div className={cn("px-8 py-5 rounded-3xl shadow-extreme text-white font-black text-sm flex items-center gap-4", toast.type === 'error' ? 'bg-red-600' : 'bg-[#003262]')}>
               {toast.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} className="text-[#FDB515]" />}
               {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
