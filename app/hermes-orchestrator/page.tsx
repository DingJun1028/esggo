'use client';
import React, { useState } from 'react';
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

const TASK_ICONS: Record<string, React.ReactNode> = {
  report_drafting:        <FileText size={15}/>,
  compliance_review:      <ShieldCheck size={15}/>,
  evidence_mapping:       <Database size={15}/>,
  course_assistant:       <GraduationCap size={15}/>,
  task_planning:          <ClipboardList size={15}/>,
  stakeholder_analysis:   <Users size={15}/>,
  materiality_generation: <BarChart3 size={15}/>,
  cbam_validation:        <CheckSquare size={15}/>,
};

interface ExecutionRecord {
  task: AgentTask;
  execution: AgentExecution | null;
  artifact: AgentArtifact | null;
  policy: { allowed: boolean; requiresReview: boolean; dataScope: string[] } | null;
}

const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; color: string; bg: string }> = {
  draft:           { label: '草稿',   color: '#64748B', bg: '#F1F5F9' },
  awaiting_review: { label: '待審核', color: '#F59E0B', bg: '#FEF3C7' },
  approved:        { label: '已核准', color: '#22C55E', bg: '#DCFCE7' },
  rejected:        { label: '已拒絕', color: '#EF4444', bg: '#FFE4E6' },
  promoted:        { label: '已提升', color: '#003262', bg: '#EBF2FA' },
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
  const [toastMsg, setToastMsg] = useState('');
  const [gatewayStatus, setGatewayStatus] = useState<{ status: string; is_mock?: boolean } | null>(null);

  const availableSkills = SKILL_REGISTRY.filter(s => s.taskType === taskType && s.enabled);

  React.useEffect(() => {
    import('../../lib/hermes-gateway').then(m => {
      m.fetchHermesStatus().then(setGatewayStatus);
    });
  }, []);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  }

  async function handleCreate() {
    if (!title.trim()) { showToast('請填寫任務標題'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: 'user_001', taskType, title, description, inputRefIds: [], skillKey: selectedSkill }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const rec: ExecutionRecord = { task: data.task, execution: null, artifact: null, policy: data.policy };
      setExecutions(prev => [rec, ...prev]);
      setSelected(rec);
      setTitle(''); setDescription('');
      setActiveTab('executions');
      showToast('任務建立成功，政策守門已通過');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '建立失敗';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute(rec: ExecutionRecord) {
    if (rec.task.status === 'denied') { showToast('此任務已被政策守門拒絕'); return; }
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
      showToast('Hermes 執行完成，草稿已生成，等待審核');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '執行失敗';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(rec: ExecutionRecord, action: 'approve' | 'reject' | 'request_changes') {
    if (!rec.artifact) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/agent/artifacts/${rec.artifact.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reviewNote, reviewerId: 'reviewer_001' }),
      });
      const data = await res.json();
      if (!data.ok && !data.reviewStatus) throw new Error(data.error);

      const updatedArtifact: AgentArtifact = {
        ...rec.artifact,
        reviewStatus: data.reviewStatus as ReviewStatus,
        reviewNote,
        reviewedAt: data.reviewedAt,
      };
      const updated: ExecutionRecord = { ...rec, artifact: updatedArtifact };
      setExecutions(prev => prev.map(r => r.task.id === rec.task.id ? updated : r));
      setSelected(updated);
      setReviewAction(null); setReviewNote('');
      showToast(`審核動作「${action === 'approve' ? '核准' : action === 'reject' ? '拒絕' : '要求修改'}」已完成`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '審核失敗';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handlePromote(rec: ExecutionRecord) {
    if (!rec.artifact || rec.artifact.reviewStatus !== 'approved') {
      showToast('只有已核准的草稿才可提升為正式態');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/agent/artifacts/${rec.artifact.id}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentReviewStatus: rec.artifact.reviewStatus, actorId: 'user_001' }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      // 廣通：同步後端產生的真 Hash Lock 到 UI
      const updatedArtifact: AgentArtifact = { 
        ...rec.artifact, 
        reviewStatus: 'promoted',
        hashLock: data.hashLock, 
      };
      const updated: ExecutionRecord = { ...rec, artifact: updatedArtifact };
      setExecutions(prev => prev.map(r => r.task.id === rec.task.id ? updated : r));
      setSelected(updated);
      
      // [Phase 5] 量子進化：反饋與封印視覺提示
      showToast(`【5T 實證封印成功】\nMaster Seal: ${data.hashLock.slice(0, 16)}...\n內容已自動同步至數位分身記憶矩陣。`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '提升失敗';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  }

  const meta = TASK_TYPE_META[taskType];
  const statusStats = {
    total: executions.length,
    running: executions.filter(e => e.execution?.status === 'running').length,
    awaiting: executions.filter(e => e.artifact?.reviewStatus === 'awaiting_review').length,
    approved: executions.filter(e => e.artifact?.reviewStatus === 'approved' || e.artifact?.reviewStatus === 'promoted').length,
  };

  return (
    <div className="page-container fade-in">
      {/* Toast */}
      {toastMsg && (
        <div className="toast-container" style={{ zIndex: 9999 }}>
          <div className="toast toast-info flex items-center gap-3">
            <Info size={15} style={{ flexShrink: 0 }}/>
            <span style={{ fontSize: '0.875rem' }}>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={24} color="#fff"/>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 style={{ color: '#fff', fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>OmniHermes 系統 + ESG Go 系統</h1>
                <span className="badge badge-gold badge-sm">v1.1</span>
                {gatewayStatus && (
                  <span className={`badge badge-sm ${gatewayStatus.is_mock ? 'badge-warning' : 'badge-success'}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Activity size={10}/>
                    {gatewayStatus.is_mock ? 'Mock Mode' : 'Live VPS'}
                  </span>
                )}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'var(--font-size-base)', marginTop: 4 }}>
                受控代理執行層 · Omni-Agent Orchestration · Policy Guard · Artifact Manager
              </p>
            </div>
          </div>
        </div>

        <div className="ph-stats">
          {[
            { v: statusStats.total,   l: '任務總數' },
            { v: statusStats.running, l: '執行中' },
            { v: statusStats.awaiting,l: '待審核' },
            { v: statusStats.approved,l: '已核准' },
          ].map(s => (
            <div key={s.l} className="ph-stat-item">
              <div className="ph-stat-value">{s.v}</div>
              <div className="ph-stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Governance note */}
      <div className="alert alert-info mb-6" role="note">
        <Shield size={15} style={{ flexShrink: 0 }}/>
        <div style={{ fontSize: 'var(--font-size-sm)' }}>
          <strong>治理邊界聲明：</strong>Hermes 屬於 Agent Orchestration Layer，不直接連接正式資料層。
          所有產出均為草稿態，需經 <strong>Policy Guard → 人工審核 → Approve → Promote</strong> 後才可進入信任層。
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-nav mb-6">
        {([
          { id: 'create',     label: '建立任務', icon: <Plus size={13}/> },
          { id: 'executions', label: `執行記錄 (${executions.length})`, icon: <Activity size={13}/> },
          { id: 'audit',      label: '稽核日誌', icon: <ShieldCheck size={13}/> },
          { id: 'registry',   label: '技能庫',   icon: <Zap size={13}/> },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="bento" style={{ gap: 'var(--space-5)' }}>
        {/* Left Panel */}
        <div style={{ gridColumn: selected ? 'span 7' : 'span 12' }}>

          {/* ── Create Task ── */}
          {activeTab === 'create' && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-card-title flex items-center gap-2">
                  <Plus size={16} style={{ color: 'var(--blue-700)' }}/> 建立代理任務
                </h2>
                <span className="badge badge-info badge-sm">Phase 1</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {/* Task Type */}
                <div className="field-group">
                  <label className="field-label">任務類型 <span className="required">*</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-2)' }}>
                    {Object.entries(TASK_TYPE_META).map(([type, m]) => (
                      <button key={type} onClick={() => {
                        setTaskType(type as AgentTaskType);
                        const first = SKILL_REGISTRY.find(s => s.taskType === type && s.enabled);
                        if (first) setSelectedSkill(first.skillKey);
                      }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                          padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
                          border: `2px solid ${taskType === type ? m.color : 'var(--border-default)'}`,
                          background: taskType === type ? `${m.color}10` : 'var(--surface-card)',
                          cursor: 'pointer', transition: 'all var(--duration-fast)',
                          fontFamily: 'var(--font-sans)',
                        }}>
                        <span style={{ color: m.color }}>{TASK_ICONS[type]}</span>
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: taskType === type ? m.color : 'var(--text-secondary)' }}>
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill */}
                <div className="field-group">
                  <label className="field-label">選擇技能 <span className="required">*</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {availableSkills.map(sk => (
                      <label key={sk.skillKey} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                        padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
                        border: `1.5px solid ${selectedSkill === sk.skillKey ? meta.color : 'var(--border-default)'}`,
                        background: selectedSkill === sk.skillKey ? `${meta.color}08` : 'var(--surface-card)',
                        cursor: 'pointer',
                      }}>
                        <input type="radio" name="skill" checked={selectedSkill === sk.skillKey}
                          onChange={() => setSelectedSkill(sk.skillKey)} style={{ marginTop: 2, accentColor: meta.color }}/>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{sk.skillName}</p>
                          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{sk.description}</p>
                          <div className="flex gap-2 flex-wrap" style={{ marginTop: 6 }}>
                            <span className={`badge badge-sm ${sk.requiresHumanReview ? 'badge-warning' : 'badge-success'}`}>
                              {sk.requiresHumanReview ? '需人工審核' : '低風險'}
                            </span>
                            <span className={`badge badge-sm ${sk.riskLevel === 'high' ? 'badge-error' : sk.riskLevel === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                              風險：{sk.riskLevel}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="field-group">
                  <label className="field-label">任務標題 <span className="required">*</span></label>
                  <input className="input" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="例：2024 年度 GRI 305 溫室氣體章節草稿" aria-label="任務標題"/>
                </div>

                {/* Description */}
                <div className="field-group">
                  <label className="field-label">任務說明</label>
                  <textarea className="input textarea" rows={3} value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="說明任務目的、使用資料範圍與產出期望..."/>
                </div>

                {/* Policy warning */}
                {SKILL_REGISTRY.find(s => s.skillKey === selectedSkill)?.requiresHumanReview && (
                  <div className="alert alert-warning">
                    <AlertTriangle size={14} style={{ flexShrink: 0 }}/>
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>
                      此任務類型需要人工審核。Hermes 產出將為草稿態，不會直接進入正式發布流程。
                    </span>
                  </div>
                )}

                <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
                  {loading ? <RefreshCw size={15} className="spin"/> : <Plus size={15}/>}
                  建立任務（通過政策守門後執行）
                </button>
              </div>
            </div>
          )}

          {/* ── Executions ── */}
          {activeTab === 'executions' && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-card-title flex items-center gap-2">
                  <Activity size={16} style={{ color: 'var(--blue-700)' }}/> 執行記錄
                </h2>
                <span className="badge badge-blue">{executions.length} 筆</span>
              </div>
              {executions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><Bot size={28}/></div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>尚無執行記錄</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>請先建立任務並執行</p>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('create')}>
                    建立任務
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {executions.map((rec, i) => {
                    const tm = TASK_TYPE_META[rec.task.taskType];
                    const revMeta = rec.artifact ? REVIEW_STATUS_META[rec.artifact.reviewStatus] : null;
                    return (
                      <button key={rec.task.id}
                        onClick={() => setSelected(selected?.task.id === rec.task.id ? null : rec)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                          padding: 'var(--space-3) var(--space-4)',
                          borderBottom: i < executions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                          background: selected?.task.id === rec.task.id ? 'var(--blue-50)' : 'transparent',
                          cursor: 'pointer', textAlign: 'left', border: 'none', fontFamily: 'var(--font-sans)',
                          transition: 'background var(--duration-fast)',
                        }}>
                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: `${tm.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tm.color, flexShrink: 0 }}>
                          {TASK_ICONS[rec.task.taskType]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {rec.task.title}
                          </p>
                          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                            {tm.label} · {new Date(rec.task.createdAt).toLocaleString('zh-TW')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!rec.execution && rec.task.status !== 'denied' && (
                            <button className="btn btn-secondary btn-xs flex items-center gap-1"
                              onClick={e => { e.stopPropagation(); handleExecute(rec); }}
                              disabled={loading}>
                              <Play size={11}/> 執行
                            </button>
                          )}
                          {revMeta && (
                            <span className="badge badge-sm" style={{ background: revMeta.bg, color: revMeta.color, borderColor: 'transparent' }}>
                              {revMeta.label}
                            </span>
                          )}
                          {rec.task.status === 'denied' && <span className="badge badge-error badge-sm">政策拒絕</span>}
                          <ChevronRight size={12} style={{ color: 'var(--text-tertiary)' }}/>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Audit Log ── */}
          {activeTab === 'audit' && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-card-title flex items-center gap-2">
                  <ShieldCheck size={16} style={{ color: 'var(--blue-700)' }}/> 稽核日誌
                </h2>
                <span className="badge badge-blue">{executions.length} 筆</span>
              </div>
              {executions.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-12) var(--space-8)' }}>
                  <div className="empty-icon"><Activity size={28}/></div>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>尚無稽核記錄</p>
                </div>
              ) : (
                <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
                  <table className="table table-compact">
                    <thead>
                      <tr>
                        <th>Execution ID</th><th>任務類型</th><th>Runtime</th>
                        <th>模型</th><th>狀態</th><th>執行時間</th>
                      </tr>
                    </thead>
                    <tbody>
                      {executions.filter(r => r.execution).map(rec => (
                        <tr key={rec.execution!.id}>
                          <td><code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--blue-700)' }}>{rec.execution!.id.slice(0, 20)}...</code></td>
                          <td><span className="badge badge-blue badge-sm">{TASK_TYPE_META[rec.task.taskType].label}</span></td>
                          <td><span style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)' }}>hermes v{rec.execution!.runtimeVersion}</span></td>
                          <td><span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{rec.execution!.modelName}</span></td>
                          <td>
                            {(() => {
                              const sm = STATUS_META[rec.execution!.status];
                              return <span className="badge badge-sm" style={{ background: sm.bg, color: sm.color, borderColor: 'transparent' }}>{sm.label}</span>;
                            })()}
                          </td>
                          <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                            {rec.execution!.startedAt ? new Date(rec.execution!.startedAt).toLocaleString('zh-TW') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Skill Registry ── */}
          {activeTab === 'registry' && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-card-title flex items-center gap-2">
                  <Zap size={16} style={{ color: 'var(--gold-500)' }}/> 技能庫 (Skill Registry)
                </h2>
                <span className="badge badge-blue">{SKILL_REGISTRY.length} 技能</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
                {SKILL_REGISTRY.map(sk => {
                  const tm = TASK_TYPE_META[sk.taskType];
                  return (
                    <div key={sk.skillKey} className="card card-sm" style={{ border: `1px solid ${tm.color}25` }}>
                      <div className="card-body" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: `${tm.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tm.color, flexShrink: 0 }}>
                          {TASK_ICONS[sk.taskType]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{sk.skillName}</p>
                            <code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{sk.skillKey}</code>
                          </div>
                          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>{sk.description}</p>
                          <div className="flex gap-2 flex-wrap" style={{ marginTop: 8 }}>
                            <span className="badge badge-sm badge-blue">{tm.label}</span>
                            <span className={`badge badge-sm ${sk.riskLevel === 'high' ? 'badge-error' : sk.riskLevel === 'medium' ? 'badge-warning' : 'badge-success'}`}>
                              {sk.riskLevel} risk
                            </span>
                            <span className={`badge badge-sm ${sk.requiresHumanReview ? 'badge-warning' : 'badge-success'}`}>
                              {sk.requiresHumanReview ? '需人工審核' : '自動推進'}
                            </span>
                            <span className="badge badge-sm badge-default">v{sk.version}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Detail Panel */}
        {selected && (
          <div style={{ gridColumn: 'span 5' }}>
            <div className="card fade-in">
              <div className="card-header">
                <h3 className="text-card-title flex items-center gap-2">
                  <Eye size={14} style={{ color: 'var(--blue-700)' }}/> 詳情
                </h3>
                <button className="btn btn-ghost btn-icon btn-xs" onClick={() => setSelected(null)} aria-label="關閉">
                  <X size={14}/>
                </button>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Task Info */}
                <div>
                  <p className="text-overline mb-2">任務資訊</p>
                  <div style={{ background: 'var(--surface-section)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {[
                      { l: '任務 ID', v: <code style={{ fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)' }}>{selected.task.id}</code> },
                      { l: '類型', v: <span className="badge badge-blue badge-sm">{TASK_TYPE_META[selected.task.taskType].label}</span> },
                      { l: '政策決策', v: <span className={`badge badge-sm ${selected.task.status === 'denied' ? 'badge-error' : 'badge-success'}`}>{selected.task.status === 'denied' ? '政策拒絕' : '已通過'}</span> },
                      { l: '需人工審核', v: <span className={`badge badge-sm ${selected.task.requiresHumanReview ? 'badge-warning' : 'badge-success'}`}>{selected.task.requiresHumanReview ? '是' : '否'}</span> },
                    ].map(row => (
                      <div key={row.l} className="flex justify-between items-center">
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{row.l}</span>
                        {row.v}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execute Button */}
                {!selected.execution && selected.task.status !== 'denied' && (
                  <button className="btn btn-primary flex items-center gap-2" onClick={() => handleExecute(selected)} disabled={loading}>
                    {loading ? <RefreshCw size={14} className="spin"/> : <Play size={14}/>}
                    發送至 Hermes Runtime 執行
                  </button>
                )}

                {/* Execution Info */}
                {selected.execution && (
                  <div>
                    <p className="text-overline mb-2">執行資訊</p>
                    <div style={{ background: 'var(--surface-section)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {[
                        { l: 'Execution ID', v: <code style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>{selected.execution.id.slice(0, 22)}...</code> },
                        { l: 'Runtime', v: <span style={{ fontSize: 'var(--font-size-xs)' }}>hermes v{selected.execution.runtimeVersion}</span> },
                        { l: '模型', v: <span style={{ fontSize: 'var(--font-size-xs)' }}>{selected.execution.modelName}</span> },
                        { l: '狀態', v: (() => { const sm = STATUS_META[selected.execution.status]; return <span className="badge badge-sm" style={{ background: sm.bg, color: sm.color, borderColor: 'transparent' }}>{sm.label}</span>; })() },
                      ].map(row => (
                        <div key={row.l} className="flex justify-between items-center">
                          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{row.l}</span>
                          {row.v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artifact */}
                {selected.artifact && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-overline">草稿產出</p>
                      {(() => {
                        const rm = REVIEW_STATUS_META[selected.artifact.reviewStatus];
                        return <span className="badge badge-sm" style={{ background: rm.bg, color: rm.color, borderColor: 'transparent' }}>{rm.label}</span>;
                      })()}
                    </div>
                    <div style={{ background: 'var(--surface-section)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', maxHeight: 180, overflowY: 'auto', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                      {selected.artifact.content}
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                        <Hash size={10} style={{ display: 'inline', marginRight: 2 }}/>v{selected.artifact.version} · {new Date(selected.artifact.createdAt).toLocaleString('zh-TW')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                {selected.artifact?.reviewStatus === 'awaiting_review' && (
                  <div>
                    <p className="text-overline mb-3">審核動作（三者必須分開）</p>
                    {reviewAction ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <textarea className="input textarea" rows={3} value={reviewNote}
                          onChange={e => setReviewNote(e.target.value)}
                          placeholder={reviewAction === 'approve' ? '核准備注（選填）' : reviewAction === 'reject' ? '拒絕原因（必填）' : '需修改的內容說明'}/>
                        <div className="flex gap-2">
                          <button className="btn btn-primary btn-sm flex-1" onClick={() => handleReview(selected, reviewAction)} disabled={loading}>
                            {loading ? <RefreshCw size={13} className="spin"/> : <CheckCircle size={13}/>}
                            確認{reviewAction === 'approve' ? '核准' : reviewAction === 'reject' ? '拒絕' : '退回'}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setReviewAction(null); setReviewNote(''); }}>
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <button className="btn btn-success btn-sm flex items-center gap-2" onClick={() => setReviewAction('approve')}>
                          <CheckCircle size={13}/> 核准草稿
                        </button>
                        <button className="btn btn-outline btn-sm flex items-center gap-2" onClick={() => setReviewAction('request_changes')}
                          style={{ borderColor: 'var(--amber-500)', color: 'var(--amber-700)' }}>
                          <RefreshCw size={13}/> 要求修改
                        </button>
                        <button className="btn btn-danger btn-sm flex items-center gap-2" onClick={() => setReviewAction('reject')}>
                          <XCircle size={13}/> 拒絕草稿
                        </button>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                          ⚠️ 審核與發布必須分離，核准後才可提升為正式態
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Promote */}
                {selected.artifact?.reviewStatus === 'approved' && (
                  <div>
                    <div className="alert alert-success mb-3">
                      <CheckCircle size={14} style={{ flexShrink: 0 }}/>
                      <span style={{ fontSize: 'var(--font-size-sm)' }}>草稿已核准。可提升為正式態並進入 Trust Layer 封印。</span>
                    </div>
                    <button className="btn btn-primary btn-sm w-full flex items-center gap-2" onClick={() => handlePromote(selected)} disabled={loading}>
                      {loading ? <RefreshCw size={13} className="spin"/> : <ArrowRight size={13}/>}
                      提升為正式態（Hash Lock 封印）
                    </button>
                  </div>
                )}

                {selected.artifact?.reviewStatus === 'promoted' && (
                  <div className="alert alert-info">
                    <Hash size={14} style={{ flexShrink: 0 }}/>
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>已提升為正式態，Hash Lock 已封印，進入 Trust Layer。</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}