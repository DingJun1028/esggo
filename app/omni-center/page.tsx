'use client';
import { useState, useEffect, useCallback } from 'react';
import { OmniNoteCRUD, type NoteData } from './omni-note-crud';
import { OmniOneChat } from './omni-one-chat';
import { FiveTRadar } from './five-t-radar';
import { PdfUploader } from './pdf-uploader';
import { useAgnesApi } from '../../src/components/AgnesProvider';
import { Moon, Sun } from 'lucide-react';

type Tab = 'dashboard'|'notes'|'chat'|'fiveT'|'rag';

const FIVE_T = [
  { key:'traceable',   zh:'真', color:'var(--accent-blue, #3B82F6)' },
  { key:'transparent', zh:'善', color:'var(--accent-green, #22C55E)' },
  { key:'tangible',    zh:'美', color:'#F59E0B' },
  { key:'trustworthy', zh:'信', color:'var(--accent-purple, #8B5CF6)' },
  { key:'trackable',   zh:'通', color:'var(--accent-cyan, #06B6D4)' },
];

const OMNI_MODULES = [
  { name:'萬能筆記', en:'OmniNote',     icon:'📝', color:'var(--accent-teal, #009EB0)',   href:'notes'   as Tab },
  { name:'萬能任務', en:'OmniTask',     icon:'✅', color:'var(--accent-gold, #D4AF37)',   href:'notes'   as Tab },
  { name:'OmniOne', en:'覺醒對話',      icon:'🤖', color:'var(--accent-purple, #8B5CF6)', href:'chat'    as Tab },
  { name:'5T 雷達', en:'FiveT Radar',   icon:'📡', color:'var(--accent-cyan, #06B6D4)',   href:'fiveT'   as Tab },
  { name:'RAG 知識', en:'RAG DB',       icon:'📚', color:'var(--accent-green, #22C55E)',  href:'rag'     as Tab },
  { name:'永續村',   en:'Village',      icon:'🏡', color:'var(--accent-blue, #3B82F6)',   href:'/village' },
];

const DEMO_NOTES: NoteData[] = [
  { id:'ON-A1B2', title:'ESG 永續戰略 2025', content:'Q3 目標：完成碳排放基準年建立、供應鏈 ESG 評估框架設計。\n\n## 關鍵里程碑\n- **7月**: GRI 框架確認\n- **9月**: ZKP 封印報告', tags:['ESG','戰略'], fiveTGate:'transparent', createdAt:Date.now()-86400000*3 },
  { id:'ON-C3D4', title:'OmniOne 覺醒系統記錄', content:'已完成 AwakeningCore + MemorySystem + CaseHandler。\n\n`import { omniOne } from "@/sdks/omni-one/src"`', tags:['OmniOne','AI','開發'], fiveTGate:'trackable', createdAt:Date.now()-86400000 },
];

function polarPoint(a:number, r:number, cx:number, cy:number) {
  return { x:cx+r*Math.cos(a-Math.PI/2), y:cy+r*Math.sin(a-Math.PI/2) };
}

import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function OmniCenterPage() {
  const [tab, setTab]   = useState<Tab>('dashboard');
  const [notes, setNotes] = useState<NoteData[]>(DEMO_NOTES);
  const [pulse, setPulse] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { isReady, status } = useAgnesApi();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => { const t = setInterval(()=>setPulse(p=>!p),1200); return()=>clearInterval(t); },[]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NoteData));
      setNotes(data);
    });
    return () => unsubscribe();
  }, []);

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
    {id:'rag',      label:'知識治理',icon:'📚'},
  ];

  const tabStyle = (active:boolean) => ({
    display:'flex' as const, alignItems:'center' as const, gap:6, padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
    background:active?'var(--accent-teal, #009EB0)':'transparent', color:active?'#FFFFFF':'var(--text-secondary, #64748B)', transition:'all .2s',
  });

  return (
    <div className="min-h-[calc(100vh-52px)] bg-primary text-textPrimary font-['Noto_Sans_TC',sans-serif] p-5 transition-colors duration-300">
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-accentTeal flex items-center justify-center text-xl shadow-lg transition-shadow duration-600 text-white" style={{boxShadow: pulse ? '0 0 20px var(--accent-teal)' : '0 0 10px rgba(0,158,176,0.6)'}}>⊙</div>
        <div>
          <h1 className="font-['Montserrat',sans-serif] text-xl font-bold text-accentTeal">萬能中心 Omni-Core</h1>
          <div className="text-xs text-textSecondary">無礙圓通，無作筆記 — v1.0</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-textSecondary"
            title="切換深色模式"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isReady && <span className="text-[10px] bg-accentPurple/20 text-accentPurple px-2 py-[3px] rounded-md font-bold tracking-wide mr-2">AGNES CORE</span>}
          <div className={`w-2 h-2 rounded-full bg-accentGreen transition-shadow duration-600`} style={{boxShadow: pulse ? '0 0 8px var(--accent-green)' : '0 0 4px var(--accent-green)'}}/>
          <span className="text-xs text-textSecondary">系統運行中</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-secondary p-1 rounded-xl flex-wrap">
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tabStyle(tab===t.id)}><span>{t.icon}</span>{t.label}</button>)}
      </div>

      {/* Dashboard Tab */}
      {tab==='dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Concentric + 5T Mini */}
          <div className="bg-secondary border border-borderColor rounded-2xl p-4 shadow-sm">
            <div className="text-xs text-textSecondary font-semibold tracking-wider mb-2.5">同心圓架構 · 5T 綜合評分</div>
            <div className="flex gap-4 items-center flex-wrap">
              <svg width={200} height={200} className="shrink-0">
                {[75,57,39,21].map((r,i)=><circle key={i} cx={CX} cy={CY} r={r} fill="none" stroke={['var(--accent-blue)','var(--accent-purple)','var(--accent-teal)','var(--accent-gold)'][i]} strokeWidth={pulse&&i===0?2:1} strokeDasharray={i===0?'5 3':undefined} opacity={0.6}/>)}
                <path d={radarPath} fill="var(--accent-teal)" fillOpacity={0.2} stroke="var(--accent-teal)" strokeWidth={2}/>
                {FIVE_T.map((d,i)=>{ const a=(i/5)*Math.PI*2; const p=polarPoint(a,MR+14,CX,CY); return <text key={d.key} x={p.x} y={p.y+4} textAnchor="middle" fill={d.color} fontSize={12} fontWeight={700}>{d.zh}</text>; })}
                <circle cx={CX} cy={CY} r={18} fill="var(--accent-teal)"/>
                <text x={CX} y={CY-4} textAnchor="middle" fill="#FFFFFF" fontSize={8} fontWeight={700}>萬能</text>
                <text x={CX} y={CY+6} textAnchor="middle" fill="#FFFFFF" fontSize={8} fontWeight={700}>中心</text>
              </svg>
              <div className="flex-1">
                <div className="font-['Fira_Code',monospace] text-2xl font-bold text-accentGreen mb-1">{(overall*100).toFixed(1)}%</div>
                <div className="text-xs text-textSecondary mb-2">整體 5T 合規度</div>
                {FIVE_T.map(d=>(
                  <div key={d.key} className="flex items-center gap-1.5 mb-1.5">
                    <span style={{width:12,color:d.color,fontSize:12,fontWeight:700}}>{d.zh}</span>
                    <div className="flex-1 h-1 bg-primary rounded-full"><div className="h-full rounded-full" style={{width:`${SCORES[d.key as keyof typeof SCORES]*100}%`,background:d.color}}/></div>
                    <span className="font-['Fira_Code',monospace] text-[10px]" style={{color:d.color}}>{(SCORES[d.key as keyof typeof SCORES]*100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-col gap-3">
            <div className="bg-secondary border border-borderColor rounded-2xl p-4 shadow-sm">
              <div className="text-xs text-textSecondary font-semibold tracking-wider mb-2.5">系統統計</div>
              <div className="grid grid-cols-2 gap-2">
                {[{l:'筆記數',v:notes.length,c:'var(--accent-teal)'},{l:'OmniOne 案件',v:47,c:'var(--accent-purple)'},{l:'ZKP 封印',v:28,c:'var(--accent-blue)'},{l:'GRI 指標',v:142,c:'var(--accent-gold)'}].map(s=>(
                  <div key={s.l} className="bg-primary rounded-lg py-2 px-2.5">
                    <div className="font-['Fira_Code',monospace] text-xl font-bold" style={{color:s.c}}>{s.v}</div>
                    <div className="text-xs text-textSecondary">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary border border-borderColor rounded-2xl p-4 shadow-sm">
              <div className="text-xs text-textSecondary font-semibold tracking-wider mb-2.5">萬能模組矩陣</div>
              <div className="grid grid-cols-3 gap-1.5">
                {OMNI_MODULES.map(m=>(
                  <button key={m.name} onClick={()=>{
                    if (m.href.startsWith('/')) window.location.href = m.href;
                    else setTab(m.href as Tab);
                  }}
                    className="bg-primary border border-borderColor rounded-lg py-2 px-1.5 cursor-pointer text-center transition-all duration-200 hover:opacity-80"
                    style={{ borderColor: `${m.color}30` }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=`${m.color}30`;}}>
                    <div className="text-lg mb-0.5">{m.icon}</div>
                    <div className="text-[10px] font-semibold" style={{color:m.color}}>{m.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {tab==='notes' && (
        <div className="bg-secondary border border-borderColor rounded-2xl p-4 shadow-sm">
          <OmniNoteCRUD />
        </div>
      )}

      {/* Chat Tab */}
      {tab==='chat' && (
        <div className="bg-secondary border border-borderColor rounded-2xl p-4 shadow-sm min-h-[500px]">
          <OmniOneChat/>
        </div>
      )}

      {/* 5T Tab */}
      {tab==='fiveT' && (
        <div className="bg-secondary border border-borderColor rounded-2xl p-4 shadow-sm">
          <FiveTRadar/>
        </div>
      )}

      {/* RAG Knowledge Base Tab */}
      {tab==='rag' && (
        <div className="bg-secondary border border-borderColor rounded-2xl p-4 shadow-sm max-w-4xl mx-auto">
          <PdfUploader/>
        </div>
      )}
    </div>
  );
}
