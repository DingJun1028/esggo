'use client';
import { useState } from 'react';
import { Cpu, Play, Pause, Activity, CheckSquare, Inbox } from 'lucide-react';

const agents = [
  { name: 'Aurora', role: 'Orchestrator', state: 'Idle', task: '待命：接收指令並生成 SwarmBrief', health: 100, memory: '85%' },
  { name: 'Stakeholder-Surveyor', role: 'Analyst', state: 'Running', task: '提取 2024 年度問卷異常關注點', health: 98, memory: '42%' },
  { name: 'Materiality-Maven', role: 'Architect', state: 'Waiting', task: '等待問卷數據以更新重大性矩陣', health: 100, memory: '12%' },
  { name: 'CBAM-Sentinel', role: 'Validator', state: 'Running', task: '校驗第三季鋼鐵進口排放數據格式', health: 92, memory: '67%' },
  { name: 'ESG-Scribe', role: 'Builder', state: 'Running', task: '撰寫 GRI 305 章節草稿', health: 98, memory: '91%' },
];

function ConsciousStream() {
  return (
    <div style={{ padding: '1rem', background: 'rgba(0,50,98,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Activity size={14} className="pulse" style={{ color: 'var(--blue-700)' }} />
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-700)' }}>CONSCIOUS STREAM (AI 共鳴流)</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          { time: '14:32:10', event: 'OmniMemory 碎片整合：GRI 305-1 → CBAM Sector Mapping', type: 'sync' },
          { time: '14:32:08', event: 'Aurora 分發任務：Stakeholder-Surveyor [High Priority]', type: 'dispatch' },
          { time: '14:31:55', event: 'CBAM-Sentinel 完成格式校驗，寫入 Draft Store', type: 'complete' },
          { time: '14:31:40', event: 'Hash Lock 預備封印：Artifact_Exec_882', type: 'trust' },
        ].map((log, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.68rem', opacity: 1 - i * 0.2 }}>
            <span style={{ color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>{log.time}</span>
            <span style={{ color: log.type === 'trust' ? 'var(--blue-700)' : 'var(--text-primary)', fontWeight: log.type === 'trust' ? 700 : 400 }}>
              {log.event}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

export default function SwarmPage() {
  const [agents, setAgents] = useState([
    { name: 'Aurora', role: 'Orchestrator', state: 'Idle', task: '待命：接收指令並生成 SwarmBrief', health: 100 },
    { name: 'Stakeholder-Surveyor', role: 'Analyst', state: 'Running', task: '提取 2024 年度問卷異常關注點', health: 98 },
    { name: 'Materiality-Maven', role: 'Architect', state: 'Waiting', task: '等待問卷數據以更新重大性矩陣', health: 100 },
    { name: 'CBAM-Sentinel', role: 'Validator', state: 'Running', task: '校驗第三季鋼鐵進口排放數據格式', health: 92 },
    { name: 'ESG-Scribe', role: 'Builder', state: 'Running', task: '撰寫 GRI 305 章節草稿', health: 98 },
  ]);
  const [prompt, setPrompt] = useState('');
  const [tab, setTab] = useState('control');
  const [dispatching, setDispatching] = useState(false);

  const handleDispatch = async () => {
    if (!prompt.trim()) return;
    setDispatching(true);
    
    // UI 即時回饋：Orchestrator 進入思考狀態
    setAgents(prev => prev.map(a => a.name === 'Aurora' ? { ...a, state: 'Running', task: '分析語意並拆解子任務中...' } : a));

    try {
      // 模擬 Swarm 拆解邏輯並實際寫入 Database Tasks (透過 API)
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: 'user_001',
          taskType: 'task_planning',
          title: `[Swarm 派遣] ${prompt.substring(0, 15)}...`,
          description: `Aurora Orchestrator 自動拆解的任務。原始指令：${prompt}`,
          skillKey: 'task_planning',
        }),
      });
      
      const data = await res.json();
      if (!data.ok) throw new Error('Dispatch failed');

      // 狀態機流轉
      setAgents(prev => prev.map(a => {
        if (a.name === 'Aurora') return { ...a, state: 'Idle', task: '待命中' };
        if (a.name === 'Stakeholder-Surveyor') return { ...a, state: 'Running', task: `處理子任務: ${prompt.substring(0,20)}` };
        return a;
      }));

      setPrompt('');
      alert('Aurora 已將您的指令拆解，並派發給對應 Agent，請至「任務中心」查看進度！');
    } catch (e) {
      console.error(e);
      alert('派遣失敗，請檢查系統連線');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1300 }}>
      <div className="page-header">
        <div className="page-eyebrow"><Cpu size={12} /> OmniHermes Swarm v1.1 · ESG 代理蜂群</div>
        <h1 className="page-title">OmniHermes 系統 + ESG Go 系統 ☤</h1>
        <p className="page-sub">蜂群自動編排 · 異步任務調度 · 人類審核閘口 (Greenlight Gate)</p>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>向 Orchestrator (Aurora) 發布意圖</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input className="inp" style={{ flex: 1 }} placeholder="例如：幫我分析本季供應鏈碳排異常，生成摘要..." value={prompt} onChange={e => setPrompt(e.target.value)} disabled={dispatching} />
          <button className="btn btn-primary" onClick={handleDispatch} disabled={dispatching || !prompt}>
            {dispatching ? <Activity size={14} className="spin" /> : <Zap size={14} />}
            Dispatch Brief
          </button>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: '1rem' }}>
        {[['control', '控制平面'], ['kanban', '任務看板'], ['inbox', '收件箱']].map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'control' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ConsciousStream />
          <div className="g-auto">
            {agents.map((a, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.state === 'Running' ? '#00A598' : '#94a3b8' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{a.name}</div>
                </div>
                <span className="badge badge-gray" style={{ fontSize: '0.6rem' }}>{a.role}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.875rem' }}>{a.task}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-xs"><Play size={10} /></button>
                  <button className="btn btn-ghost btn-xs"><Pause size={10} /></button>
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#00A598' }}>HEALTH {a.health}%</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {['Ready', 'Running', 'Review', 'Done'].map(lane => (
            <div key={lane}>
              <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{lane}</div>
              <div style={{ background: '#f8fafc', borderRadius: 8, minHeight: 200, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {lane === 'Running' && (
                  <>
                    <div className="card" style={{ padding: '0.875rem', borderLeft: '3px solid #ED4E33' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>撰寫 GRI 305 章節</div>
                      <span className="badge badge-teal" style={{ fontSize: '0.6rem', marginTop: 6 }}>ESG-Scribe</span>
                    </div>
                    <div className="card" style={{ padding: '0.875rem', borderLeft: '3px solid #FDB515' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>CBAM 法規分析</div>
                      <span className="badge badge-teal" style={{ fontSize: '0.6rem', marginTop: 6 }}>Carbon-Analyst</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'inbox' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
            <Inbox size={32} style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontWeight: 600 }}>收件箱空白</div>
            <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Checkpoint 與審核任務將出現於此</div>
          </div>
        </div>
      )}
    </div>
  );
}