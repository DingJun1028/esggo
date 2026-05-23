'use client';
import React, { useState, useEffect } from 'react';
import {
  Bot, Plus, Play, CheckCircle, XCircle, AlertTriangle,
  Clock, FileText, ShieldCheck, Database, GraduationCap,
  ClipboardList, ChevronRight, Zap, Eye, RefreshCw,
  Info, Shield, Activity, Hash, X, ArrowRight,
  Users, BarChart3, CheckSquare, Lock,
} from 'lucide-react';
import type {
  AgentTask, AgentExecution, AgentArtifact,
  AgentTaskType, ReviewStatus,
} from '../../lib/agent/types';
import { SKILL_REGISTRY, TASK_TYPE_META, STATUS_META } from '../../lib/agent/registry';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandT5Strip, BrandInput, BrandCardHeader, StandardPage, BrandModal
} from '../../components/brand';
import { UniversalPageConfig } from '../../lib/page-config';

const TASK_ICONS: Record<string, React.ReactNode> = {
  report_drafting:        <FileText size={16}/>,
  compliance_review:      <ShieldCheck size={16}/>,
  evidence_mapping:       <Database size={16}/>,
  course_assistant:       <GraduationCap size={16}/>,
  task_planning:          <ClipboardList size={16}/>,
  stakeholder_analysis:   <Users size={16}/>,
  materiality_generation: <BarChart3 size={16}/>,
  cbam_validation:        <CheckSquare size={16}/>,
};

interface ExecutionRecord {
  task: AgentTask;
  execution: AgentExecution | null;
  artifact: AgentArtifact | null;
  policy: { allowed: boolean; requiresReview: boolean; dataScope: string[] } | null;
}

const REVIEW_STATUS_MAP: Record<ReviewStatus, { label: string; variant: any }> = {
  draft:           { label: '草稿',   variant: 'outline' },
  awaiting_review: { label: '待審核', variant: 'warning' },
  approved:        { label: '已核准', variant: 'success' },
  rejected:        { label: '已拒絕', variant: 'error' },
  promoted:        { label: '已提升', variant: 'gold' },
};

export default function HermesOrchestratorPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'swarm' | 'executions' | 'audit' | 'registry'>('create');
  const [taskType, setTaskType] = useState<AgentTaskType>('report_drafting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('gri_report_draft');
  const [loading, setLoading] = useState(false);
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [selected, setSelected] = useState<ExecutionRecord | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<{ status: string; is_mock?: boolean } | null>(null);

  // Initial Data Loading
  useEffect(() => {
    async function init() {
      try {
        const [tasksRes, execsRes, artsRes] = await Promise.all([
          fetch('/api/agent/tasks'),
          fetch('/api/agent/executions'),
          fetch('/api/agent/artifacts'),
        ]);
        const tasksData = await tasksRes.json();
        const execsData = await execsRes.json();
        const artsData = await artsRes.json();

        if (tasksData.ok) {
          const merged: ExecutionRecord[] = tasksData.tasks.map((t: AgentTask) => {
            const execution = execsData.executions?.find((e: any) => e.taskId === t.id) || null;
            const artifact = artsData.artifacts?.find((a: any) => a.taskId === t.id) || null;
            return { task: t, execution, artifact, policy: null };
          });
          setExecutions(merged);
        }
      } catch (e) {
        console.error('Failed to load initial data', e);
      }
    }

    import('../../lib/hermes-gateway').then(m => {
      m.fetchHermesStatus().then(setGatewayStatus);
    });

    init();
  }, []);

  function showToast(msg: string, type: 'success' | 'error' | 'info' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function getUserId() {
    try {
      const u = localStorage.getItem('omni_user');
      if (u) return JSON.parse(u).id || 'user_001';
    } catch (e) {}
    return 'user_001';
  }

  async function handleCreate() {
    if (!title.trim()) { showToast('請填寫任務標題', 'error'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: getUserId(), taskType, title, description, skillKey: selectedSkill }),
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

  async function handlePromote(rec: ExecutionRecord) {
    setLoading(true);
    try {
      const res = await fetch(`/api/agent/artifacts/${rec.artifact!.id}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentReviewStatus: rec.artifact!.reviewStatus, actorId: getUserId() }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const updated: ExecutionRecord = { 
        ...rec, 
        artifact: { ...rec.artifact!, reviewStatus: 'promoted', hashLock: data.hashLock } 
      };
      setExecutions(prev => prev.map(r => r.task.id === rec.task.id ? updated : r));
      setSelected(updated);
      showToast('5T 實證封印成功，內容已同步至知識庫');
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(rec: ExecutionRecord, action: 'approve' | 'reject') {
    setLoading(true);
    try {
      const res = await fetch(`/api/agent/artifacts/${rec.artifact!.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reviewerId: getUserId() }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const updated: ExecutionRecord = { 
        ...rec, 
        artifact: { ...rec.artifact!, reviewStatus: data.reviewStatus } 
      };
      setExecutions(prev => prev.map(r => r.task.id === rec.task.id ? updated : r));
      if (selected?.task.id === rec.task.id) setSelected(updated);
      showToast(`草稿已${action === 'approve' ? '核准' : '拒絕'}`);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const activeTabLabel = { create: '建立任務', swarm: '蜂群監控', executions: '執行記錄', audit: '稽核日誌', registry: '技能庫' }[activeTab];

  // ── Universal Page Configuration (萬能配置) ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'hermes-orchestrator',
    title: 'OmniHermes 調度中心',
    subtitle: '受控代理執行層 · Policy Guard · 5T 實證流程，管理全自動 ESG 指標撰寫與審核。',
    icon: <Bot size={32} />,
    griReference: 'AI Agent OS',
    activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],

    primaryActions: [
      { id: 'refresh', label: '刷新狀態', icon: <RefreshCw size={16}/>, variant: 'ghost', onClick: () => window.location.reload() },
      { id: 'add', label: '快捷建立', icon: <Plus size={16}/>, onClick: () => setActiveTab('create') }
    ],

    kpis: [
      { key: 'execs', label: '累計執行', value: executions.length, icon: <Activity size={18}/> },
      { key: 'sealed', label: '5T 封印率', value: '94', unit: '%', icon: <Lock size={18}/>, verified: true },
      { key: 'latency', label: '平均延遲', value: '2.4', unit: 'sec', icon: <Zap size={18}/> },
      { key: 'status', label: 'Gateway', value: gatewayStatus?.status === 'online' ? 'ONLINE' : 'OFFLINE', icon: <Bot size={18}/> },
    ],

    sections: [
      {
        id: 'main-nav',
        title: activeTabLabel || '調度中心',
        columns: selected ? 7 : 12,
        component: (
          <div className="space-y-6">
            <BrandTabs 
              activeTab={activeTab}
              onTabChange={(t) => setActiveTab(t as any)}
              tabs={[
                { id: 'create', label: '建立任務', icon: <Plus size={14}/> },
                { id: 'swarm', label: '蜂群監控', icon: <Users size={14}/> },
                { id: 'executions', label: `執行記錄`, icon: <Activity size={14}/> },
                { id: 'audit', label: '稽核日誌', icon: <ShieldCheck size={14}/> },
                { id: 'registry', label: '技能庫', icon: <Zap size={14}/> },
              ]}
            />

            {activeTab === 'create' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(TASK_TYPE_META).map(([type, m]) => (
                    <button
                      key={type}
                      onClick={() => { setTaskType(type as any); const skill = SKILL_REGISTRY.find(s => s.taskType === type); if (skill) setSelectedSkill(skill.skillKey); }}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${taskType === type ? 'bg-blue-50 border-[#003262] shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                    >
                      <div className="mb-2" style={{ color: m.color }}>{TASK_ICONS[type]}</div>
                      <p className={`text-[11px] font-bold ${taskType === type ? 'text-[#003262]' : 'text-slate-500'}`}>{m.label}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                   <BrandInput label="任務標題" placeholder="任務標題" value={title} onChange={e => setTitle(e.target.value)} />
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">任務說明</label>
                      <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-blue-600 min-h-[100px]" value={description} onChange={e => setDescription(e.target.value)} placeholder="詳細說明..." />
                   </div>
                   <BrandButton variant="primary" fullWidth size="lg" onClick={handleCreate} loading={loading}>啟動 Policy Guard 並建立</BrandButton>
                </div>
              </div>
            )}

            {activeTab === 'executions' && (
              <BrandTable 
                columns={[{ key: 'title', label: '標題' }, { key: 'status', label: '狀態' }, { key: 'action', label: '' }]}
                data={executions.map(rec => ({
                  title: <span className="font-bold">{rec.task.title}</span>,
                  status: <BrandBadge variant={rec.artifact ? REVIEW_STATUS_MAP[rec.artifact.reviewStatus].variant : 'outline'} size="xs">{rec.artifact ? REVIEW_STATUS_MAP[rec.artifact.reviewStatus].label : '待執行'}</BrandBadge>,
                  action: <BrandButton variant="ghost" size="xs" onClick={() => setSelected(rec)}>詳情</BrandButton>
                }))}
              />
            )}

            {activeTab === 'swarm' && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['backlog', 'running', 'review', 'done'].map(lane => (
                    <div key={lane} className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 min-h-[300px]">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">{lane}</p>
                       <div className="space-y-2">
                          {executions.filter(r => {
                            if (lane === 'backlog') return !r.execution;
                            if (lane === 'running') return r.execution?.status === 'running';
                            if (lane === 'review') return r.artifact?.reviewStatus === 'awaiting_review';
                            return r.artifact?.reviewStatus === 'promoted';
                          }).map(r => (
                            <div key={r.task.id} onClick={() => setSelected(r)} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-400 transition-all text-xs font-bold text-slate-700 truncate">
                               {r.task.title}
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            )}
            
            {(activeTab === 'registry' || activeTab === 'audit') && (
              <p className="text-center text-slate-400 py-20 italic font-medium">數據加載中，符合 5T 實證標準...</p>
            )}
          </div>
        )
      }
    ],

    features: {
      useAuditLog: true
    }
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />

      {/* Detail Panel */}
      {selected && (
        <BrandModal 
          open={!!selected} 
          onClose={() => setSelected(null)}
          title="任務執行詳情"
          icon={<Bot size={20}/>}
        >
          <div className="space-y-6">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">任務內容</p>
                <p className="text-sm text-slate-700 font-bold">{selected.task.title}</p>
                <p className="text-xs text-slate-500 mt-2">{selected.task.description}</p>
             </div>
             
             {selected.artifact && (
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">產出草稿 (v{selected.artifact.version})</p>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 leading-relaxed font-mono max-h-64 overflow-y-auto">
                     {selected.artifact.content}
                  </div>
                  
                  {selected.artifact.reviewStatus === 'awaiting_review' && (
                    <div className="flex gap-2">
                       <BrandButton variant="primary" fullWidth onClick={() => handleReview(selected, 'approve')} loading={loading}>核准</BrandButton>
                       <BrandButton variant="outline" fullWidth onClick={() => handleReview(selected, 'reject')} disabled={loading}>拒絕</BrandButton>
                    </div>
                  )}

                  {selected.artifact.reviewStatus === 'approved' && (
                    <BrandButton variant="primary" fullWidth onClick={() => handlePromote(selected)} loading={loading}>
                       <Shield size={16} className="mr-2"/> 5T 實證封印
                    </BrandButton>
                  )}
               </div>
             )}

             {!selected.execution && (
               <BrandButton variant="primary" fullWidth onClick={() => handleExecute(selected)} loading={loading}>
                  <Play size={16} className="mr-2"/> 啟動 AI 執行
               </BrandButton>
             )}
          </div>
        </BrandModal>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white shadow-xl ${toast.type === 'error' ? 'bg-red-600' : 'bg-blue-700'}`}>
             {toast.type === 'success' ? <CheckCircle size={16} /> : <Info size={16} />}
             <span className="text-sm font-bold">{toast.msg}</span>
          </BrandCard>
        </div>
      )}
    </div>
  );
}
