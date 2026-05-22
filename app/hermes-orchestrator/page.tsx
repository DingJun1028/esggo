'use client';
import React, { useState, useEffect } from 'react';
import {
  Bot, Plus, Play, CheckCircle, XCircle, AlertTriangle,
  Clock, FileText, ShieldCheck, Database, GraduationCap,
  ClipboardList, ChevronRight, Zap, Eye, RefreshCw,
  Info, Shield, Activity, Hash, X, ArrowRight,
  Users, BarChart3, CheckSquare,
} from 'lucide-react';
import type {
  AgentTask, AgentExecution, AgentArtifact,
  AgentTaskType, ReviewStatus,
} from '../../lib/agent/types';
import { SKILL_REGISTRY, TASK_TYPE_META, STATUS_META } from '../../lib/agent/registry';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTable, BrandTabs, BrandStatusDot, BrandT5Strip, BrandInput
} from '../../components/brand';

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
  rejected:        { label: '已拒絕', variant: 'danger' },
  promoted:        { label: '已提升', variant: 'gold' },
};

export default function HermesOrchestratorPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'executions' | 'audit' | 'registry'>('create');
  const [taskType, setTaskType] = useState<AgentTaskType>('report_drafting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('gri_report_draft');
  const [loading, setLoading] = useState(false);
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [selected, setSelected] = useState<ExecutionRecord | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request_changes' | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<{ status: string; is_mock?: boolean } | null>(null);

  const availableSkills = SKILL_REGISTRY.filter(s => s.taskType === taskType && s.enabled);

  useEffect(() => {
    import('../../lib/hermes-gateway').then(m => {
      m.fetchHermesStatus().then(setGatewayStatus);
    });
  }, []);

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

  async function handlePromote(rec: ExecutionRecord) {
    setLoading(true);
    try {
      const res = await fetch(`/api/agent/artifacts/${rec.artifact!.id}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentReviewStatus: rec.artifact!.reviewStatus, actorId: 'user_001' }),
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

  const meta = TASK_TYPE_META[taskType];

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-blue-700'}`}>
             {toast.type === 'success' ? <CheckCircle size={16} /> : <Info size={16} />}
             <span className="text-sm font-bold">{toast.msg}</span>
          </BrandCard>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Bot size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[#003262]">OmniHermes 調度中心</h1>
              {gatewayStatus && (
                <BrandBadge variant={gatewayStatus.is_mock ? 'warning' : 'success'} size="xs">
                  {gatewayStatus.is_mock ? 'Mock Mode' : 'Live VPS'}
                </BrandBadge>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium">受控代理執行層 · Policy Guard · 5T 實證流程</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <BrandStatusDot status={gatewayStatus?.status === 'online' ? 'active' : 'inactive'} text="Hermes Runtime" size="sm" pulse />
        </div>
      </header>

      {/* Tabs */}
      <BrandTabs 
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t as any)}
        tabs={[
          { id: 'create', label: '建立任務', icon: <Plus size={14}/> },
          { id: 'executions', label: `執行記錄 (${executions.length})`, icon: <Activity size={14}/> },
          { id: 'audit', label: '稽核日誌', icon: <ShieldCheck size={14}/> },
          { id: 'registry', label: '技能庫', icon: <Zap size={14}/> },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Main Content Area */}
        <div className={(selected && !loading) ? 'lg:col-span-7' : 'lg:col-span-12'}>

          {activeTab === 'create' && (
            <BrandCard title="配置新任務" subtitle="Policy Guard 將自動審核您的請求權限" padding="lg">
              {/* ... (Create form logic) */}

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">任務類型</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(TASK_TYPE_META).map(([type, m]) => (
                      <button 
                        key={type} 
                        onClick={() => setTaskType(type as any)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${taskType === type ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 hover:border-slate-100'}`}
                      >
                        <div style={{ color: m.color }} className="mb-2">{TASK_ICONS[type]}</div>
                        <p className="text-xs font-bold text-slate-700">{m.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <BrandInput 
                    label="任務標題" 
                    placeholder="例：2024 年度 GRI 305 排放草稿" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">任務說明</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm min-h-[100px] focus:bg-white focus:border-blue-600 transition-all outline-none"
                      placeholder="詳細說明執行範疇..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <BrandButton variant="primary" fullWidth size="lg" onClick={handleCreate} loading={loading}>
                  <Zap size={16}/> 通過 Policy Guard 並建立
                </BrandButton>
              </div>
            </BrandCard>
          )}

          {activeTab === 'executions' && (
            <BrandCard title="任務執行軌跡" padding="none">
               <BrandTable 
                 columns={[
                   { key: 'title', label: '任務標題' },
                   { key: 'type', label: '類型' },
                   { key: 'status', label: '狀態' },
                   { key: 'time', label: '時間' },
                   { key: 'action', label: '' },
                 ]}
                 rows={executions.map(rec => ({
                   title: <span className="font-bold text-slate-700">{rec.task.title}</span>,
                   type: <BrandBadge variant="outline" size="xs">{TASK_TYPE_META[rec.task.taskType].label}</BrandBadge>,
                   status: rec.artifact ? (
                     <BrandBadge variant={REVIEW_STATUS_MAP[rec.artifact.reviewStatus].variant} size="xs">
                        {REVIEW_STATUS_MAP[rec.artifact.reviewStatus].label}
                     </BrandBadge>
                   ) : <BrandBadge variant="outline" size="xs">待執行</BrandBadge>,
                   time: <span className="text-[10px] text-slate-400 font-mono">{new Date(rec.task.createdAt).toLocaleTimeString()}</span>,
                   action: (
                     <BrandButton variant="ghost" size="sm" onClick={() => setSelected(rec)}>詳情</BrandButton>
                   )
                 }))}
               />
            </BrandCard>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="lg:col-span-5 fade-in">
             <BrandCard 
               title="任務控制台" 
               subtitle={selected.task.title} 
               padding="lg"
               headerExtra={<BrandButton variant="ghost" size="icon" onClick={() => setSelected(null)}><X size={16}/></BrandButton>}
             >
                <div className="space-y-6">
                   <BrandT5Strip 
                     activeSteps={selected.artifact?.reviewStatus === 'promoted' ? [1,2,3,4,5] : [1,2,3]} 
                     currentStep={selected.artifact?.reviewStatus === 'promoted' ? 5 : 3} 
                   />

                   <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">治理決策</p>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                         <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Policy Guard</span>
                            <span className="text-green-600 font-bold">ALLOW_WITH_REVIEW</span>
                         </div>
                         <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Data Scope</span>
                            <span className="text-blue-700 font-mono">restricted:esg_data</span>
                         </div>
                      </div>
                   </div>

                   {!selected.execution && (
                     <BrandButton variant="primary" fullWidth onClick={() => handleExecute(selected)} loading={loading}>
                        <Play size={16}/> 啟動 AI 執行
                     </BrandButton>
                   )}

                   {selected.artifact && (
                     <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">產出草稿 (v{selected.artifact.version})</p>
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-600 leading-relaxed font-mono max-h-48 overflow-y-auto">
                           {selected.artifact.content}
                        </div>
                        
                        {selected.artifact.reviewStatus === 'approved' && (
                          <BrandButton variant="secondary" fullWidth onClick={() => handlePromote(selected)} loading={loading}>
                             <Shield size={16}/> 提升為正式態 (5T 封印)
                          </BrandButton>
                        )}
                        
                        {selected.artifact.reviewStatus === 'promoted' && (
                          <div className="p-4 bg-gold-50 border border-gold-200 rounded-2xl">
                             <div className="flex items-center gap-2 text-gold-700 font-bold text-xs mb-1">
                                <Lock size={14}/> SHA-256 MASTER SEAL
                             </div>
                             <code className="text-[10px] text-gold-600 break-all">{selected.artifact.hashLock}</code>
                          </div>
                        )}
                     </div>
                   )}
                </div>
             </BrandCard>
          </div>
        )}

      </div>
    </div>
  );
}
