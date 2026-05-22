'use client';
import { useState } from 'react';
import { Cpu, Play, Pause, Activity, CheckSquare, Inbox } from 'lucide-react';

const agents = [
  { name: 'Aurora', role: 'Orchestrator', state: 'Idle', task: '待命：接收指令並生成 SwarmBrief', health: 100 },
  { name: 'Carbon-Analyst', role: 'Researcher', state: 'Running', task: '分析 CBAM 碳關稅對供應鏈的影響', health: 95 },
  { name: 'GRI-Reviewer', role: 'Reviewer', state: 'Waiting', task: '等待 Builder 提交 Checkpoint...', health: 100 },
  { name: 'ESG-Scribe', role: 'Builder', state: 'Running', task: '撰寫 GRI 305 章節草稿', health: 98 },
];

export default function SwarmPage() {
  const [prompt, setPrompt] = useState('');
  const [tab, setTab] = useState('control');

  return (
    <div className="fade-in" style={{ maxWidth: 1300 }}>
      <div className="page-header">
        <div className="page-eyebrow"><Cpu size={12} /> Hermes Swarm v1.0 · ESG 代理蜂群</div>
        <h1 className="page-title">Hermes Swarm Mode ☤</h1>
        <p className="page-sub">蜂群自動編排 · 異步任務調度 · 人類審核閘口 (Greenlight Gate)</p>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>向 Orchestrator (Aurora) 發布意圖</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input className="inp" style={{ flex: 1 }} placeholder="例如：幫我分析本季供應鏈碳排異常，生成摘要..." value={prompt} onChange={e => setPrompt(e.target.value)} />
          <button className="btn btn-primary">Dispatch Brief</button>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: '1rem' }}>
        {[['control', '控制平面'], ['kanban', '任務看板'], ['inbox', '收件箱']].map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'control' && (
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