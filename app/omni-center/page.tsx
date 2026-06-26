'use client';
import { useState, useEffect, useCallback } from 'react';
import { OmniNoteCRUD, type NoteData } from './omni-note-crud';
import { OmniOneChat } from './omni-one-chat';
import { FiveTRadar } from './five-t-radar';

const C = { bg:'#0D0D0D', card:'rgba(20,20,24,0.85)', border:'rgba(0,158,176,0.2)', teal:'#009EB0', gold:'#D4AF37', blue:'#3B82F6', purple:'#8B5CF6', cyan:'#06B6D4', green:'#22C55E', red:'#FF4D6D', text:'#E8E8E8', muted:'#9CA3AF', surface:'#1A1A1F' };
type Tab = 'dashboard'|'notes'|'chat'|'fiveT';

const FIVE_T = [
  { key:'traceable',   zh:'真', color:'#3B82F6' },
  { key:'transparent', zh:'善', color:'#22C55E' },
  { key:'tangible',    zh:'美', color:'#F59E0B' },
  { key:'trustworthy', zh:'信', color:'#8B5CF6' },
  { key:'trackable',   zh:'通', color:'#06B6D4' },
];

const OMNI_MODULES = [
  { name:'萬能筆記', en:'OmniNote',     icon:'📝', color:C.teal,   href:'notes'   as Tab },
  { name:'萬能任務', en:'OmniTask',     icon:'✅', color:C.gold,   href:'notes'   as Tab },
  { name:'OmniOne', en:'覺醒對話',      icon:'🤖', color:C.purple, href:'chat'    as Tab },
  { name:'5T 雷達', en:'FiveT Radar',   icon:'📡', color:C.cyan,   href:'fiveT'   as Tab },
  { name:'萬能代理', en:'OmniAgent',    icon:'⚡', color:C.blue,   href:'dashboard' as Tab },
  { name:'萬能基地', en:'OmniBase',     icon:'🏛️', color:C.green,  href:'dashboard' as Tab },
];

const DEMO_NOTES: NoteData[] = [
  { id:'ON-A1B2', title:'ESG 永續戰略 2025', content:'Q3 目標：完成碳排放基準年建立、供應鏈 ESG 評估框架設計。\n\n## 關鍵里程碑\n- **7月**: GRI 框架確認\n- **9月**: ZKP 封印報告', tags:['ESG','戰略'], fiveTGate:'transparent', createdAt:Date.now()-86400000*3 },
  { id:'ON-C3D4', title:'OmniOne 覺醒系統記錄', content:'已完成 AwakeningCore + MemorySystem + CaseHandler。\n\n`import { omniOne } from "@/sdks/omni-one/src"`', tags:['OmniOne','AI','開發'], fiveTGate:'trackable', createdAt:Date.now()-86400000 },
];

function polarPoint(a:number, r:number, cx:number, cy:number) {
  return { x:cx+r*Math.cos(a-Math.PI/2), y:cy+r*Math.sin(a-Math.PI/2) };
}

export default function OmniCenterPage() {
  const [tab, setTab]   = useState<Tab>('dashboard');
  const [notes, setNotes] = useState<NoteData[]>(DEMO_NOTES);
  const [pulse, setPulse] = useState(false);

  useEffect(() => { const t = setInterval(()=>setPulse(p=>!p),1200); return()=>clearInterval(t); },[]);

  const SCORES = { traceable:0.91, transparent:0.88, tangible:0.90, trustworthy:0.94, trackable:0.87 };
  const overall = Object.values(SCORES).reduce((s,v)=>s+v,0)/5;
  const CX=100, CY=100, MR=75;

  const radarPath = Object.values(SCORES).map((v,i)=>{
    const a=(i/5)*Math.PI*2; const p=polarPoint(a,v*MR,CX,CY);
    return `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ')+' Z';

  const tabs: {id:Tab; label:string; icon:string}[] = [
    {id:'dashboard',label:'儀表板',icon:'◎'},
    {id:'notes',    label:'萬能筆記',icon:'📝'},
    {id:'chat',     label:'OmniOne 對話',icon:'🤖'},
    {id:'fiveT',    label:'5T 雷達圖',icon:'📡'},
  ];

  const tabStyle = (active:boolean) => ({
    display:'flex' as const, alignItems:'center' as const, gap:6, padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
    background:active?C.teal:'transparent', color:active?'#000':C.muted, transition:'all .2s',
  });

  return (
    <div style={{minHeight:'calc(100vh - 52px)',background:C.bg,color:C.text,fontFamily:"'Noto Sans TC',sans-serif",padding:20}}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
        .card{background:${C.card};border:1px solid ${C.border};border-radius:16px;padding:16px;backdrop-filter:blur(12px)}
      `}</style>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <div style={{width:40,height:40,borderRadius:10,background:C.teal,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,boxShadow:`0 0 ${pulse?20:10}px ${C.teal}60`,transition:'box-shadow .6s'}}>⊙</div>
        <div>
          <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:20,fontWeight:700,color:C.teal}}>萬能中心 Omni-Core</h1>
          <div style={{fontSize:11,color:C.muted}}>無礙圓通，無作筆記 — v1.0</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:C.green,boxShadow:`0 0 ${pulse?8:4}px ${C.green}`,transition:'box-shadow .6s'}}/>
          <span style={{fontSize:11,color:C.muted}}>系統運行中</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:16,background:C.surface,padding:4,borderRadius:10,flexWrap:'wrap'}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tabStyle(tab===t.id)}><span>{t.icon}</span>{t.label}</button>)}
      </div>

      {/* Dashboard Tab */}
      {tab==='dashboard' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {/* Concentric + 5T Mini */}
          <div className="card">
            <div style={{fontSize:11,color:C.muted,fontWeight:600,letterSpacing:1,marginBottom:10}}>同心圓架構 · 5T 綜合評分</div>
            <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
              <svg width={200} height={200} style={{flexShrink:0}}>
                {[75,57,39,21].map((r,i)=><circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke={[C.blue,C.purple,C.teal,C.gold][i]} strokeWidth={pulse&&i===0?2:1} strokeDasharray={i===0?'5 3':undefined} opacity={0.6}/>)}
                <path d={radarPath} fill={`${C.teal}20`} stroke={C.teal} strokeWidth={2}/>
                {FIVE_T.map((d,i)=>{ const a=(i/5)*Math.PI*2; const p=polarPoint(a,MR+14,CX,CY); return <text key={d.key} x={p.x} y={p.y+4} textAnchor="middle" fill={d.color} fontSize={12} fontWeight={700}>{d.zh}</text>; })}
                <circle cx={CX} cy={CY} r={18} fill={C.teal}/>
                <text x={CX} y={CY-4} textAnchor="middle" fill="#000" fontSize={8} fontWeight={700}>萬能</text>
                <text x={CX} y={CY+6} textAnchor="middle" fill="#000" fontSize={8} fontWeight={700}>中心</text>
              </svg>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Fira Code',monospace",fontSize:28,fontWeight:700,color:C.green,marginBottom:4}}>{(overall*100).toFixed(1)}%</div>
                <div style={{fontSize:11,color:C.muted,marginBottom:8}}>整體 5T 合規度</div>
                {FIVE_T.map(d=>(
                  <div key={d.key} style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                    <span style={{width:12,color:d.color,fontSize:12,fontWeight:700}}>{d.zh}</span>
                    <div style={{flex:1,height:4,background:C.surface,borderRadius:2}}><div style={{height:'100%',width:`${SCORES[d.key as keyof typeof SCORES]*100}%`,background:d.color,borderRadius:2}}/></div>
                    <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:d.color}}>{(SCORES[d.key as keyof typeof SCORES]*100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="card">
              <div style={{fontSize:11,color:C.muted,fontWeight:600,letterSpacing:1,marginBottom:10}}>系統統計</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {[{l:'筆記數',v:notes.length,c:C.teal},{l:'OmniOne 案件',v:47,c:C.purple},{l:'ZKP 封印',v:28,c:C.blue},{l:'GRI 指標',v:142,c:C.gold}].map(s=>(
                  <div key={s.l} style={{background:C.surface,borderRadius:8,padding:'8px 10px'}}>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:11,color:C.muted}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div style={{fontSize:11,color:C.muted,fontWeight:600,letterSpacing:1,marginBottom:10}}>萬能模組矩陣</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6}}>
                {OMNI_MODULES.map(m=>(
                  <button key={m.name} onClick={()=>m.href&&setTab(m.href as Tab)}
                    style={{background:C.surface,border:`1px solid ${m.color}30`,borderRadius:8,padding:'8px 6px',cursor:'pointer',textAlign:'center',transition:'all .2s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=m.color;(e.currentTarget as HTMLElement).style.background=`${m.color}15`;}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=`${m.color}30`;(e.currentTarget as HTMLElement).style.background=C.surface;}}>
                    <div style={{fontSize:18,marginBottom:2}}>{m.icon}</div>
                    <div style={{fontSize:10,color:m.color,fontWeight:600}}>{m.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {tab==='notes' && (
        <div className="card">
          <OmniNoteCRUD notes={notes} onChange={setNotes}/>
        </div>
      )}

      {/* Chat Tab */}
      {tab==='chat' && (
        <div className="card" style={{minHeight:500}}>
          <OmniOneChat/>
        </div>
      )}

      {/* 5T Tab */}
      {tab==='fiveT' && (
        <div className="card">
          <FiveTRadar/>
        </div>
      )}
    </div>
  );
}
