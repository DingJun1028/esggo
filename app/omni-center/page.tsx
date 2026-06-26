'use client';
import { useState, useEffect, useCallback } from 'react';

const C = {
  bg: '#0D0D0D', card: 'rgba(20,20,24,0.85)', border: 'rgba(0,158,176,0.2)',
  teal: '#009EB0', gold: '#D4AF37', blue: '#3B82F6', purple: '#8B5CF6',
  cyan: '#06B6D4', green: '#22C55E', red: '#FF4D6D',
  text: '#E8E8E8', muted: '#9CA3AF', surface: '#1A1A1F',
};

const FIVE_T = [
  { key: 'traceable',   zh: '真', en: 'Traceable',   color: '#3B82F6', desc: '可溯源追蹤的真實數據' },
  { key: 'transparent', zh: '善', en: 'Transparent',  color: '#22C55E', desc: '可透明驗算的公正審計' },
  { key: 'tangible',    zh: '美', en: 'Tangible',     color: '#F59E0B', desc: '可感知的卓越呈現' },
  { key: 'trustworthy', zh: '信', en: 'Trustworthy',  color: '#8B5CF6', desc: '不可篡改的信任' },
  { key: 'trackable',   zh: '通', en: 'Trackable',    color: '#06B6D4', desc: '超越一切的無礙圓通' },
];

const OMNI_MODULES = [
  { name: '萬能筆記', en: 'OmniNote', icon: '📝', color: C.teal, status: 'active' },
  { name: '萬能任務', en: 'OmniTask', icon: '✅', color: C.gold, status: 'active' },
  { name: '萬能日曆', en: 'OmniCalendar', icon: '📅', color: C.blue, status: 'active' },
  { name: '萬能代理', en: 'OmniAgent', icon: '🤖', color: C.purple, status: 'active' },
  { name: '萬能標籤', en: 'OmniTag', icon: '🏷️', color: C.cyan, status: 'active' },
  { name: '萬能基地', en: 'OmniBase', icon: '🏛️', color: C.green, status: 'active' },
  { name: '萬能符文', en: 'OmniRune', icon: '🔮', color: '#F59E0B', status: 'beta' },
  { name: '萬能永憶', en: 'OmniMemory', icon: '💎', color: C.red, status: 'beta' },
];

interface Task {
  id: string; title: string; priority: 'high'|'medium'|'low';
  status: 'pending'|'completed'|'in_progress'; dueAt?: number; tags: string[];
}

const DEMO_TASKS: Task[] = [
  { id:'t1', title:'碳排放基準年建立', priority:'high', status:'pending', dueAt: Date.now()+3*86400000, tags:['ESG','碳排'] },
  { id:'t2', title:'供應鏈 ESG 評估框架', priority:'high', status:'in_progress', dueAt: Date.now()+7*86400000, tags:['供應鏈'] },
  { id:'t3', title:'GRI 報告框架確認', priority:'medium', status:'pending', dueAt: Date.now()+14*86400000, tags:['GRI'] },
  { id:'t4', title:'5T 協議合規審查', priority:'medium', status:'completed', dueAt: Date.now()-86400000, tags:['5T'] },
  { id:'t5', title:'OmniOne 整合測試', priority:'low', status:'pending', dueAt: Date.now()+21*86400000, tags:['OmniOne'] },
  { id:'t6', title:'萬能符文 Beta 測試', priority:'low', status:'pending', dueAt: Date.now()+30*86400000, tags:['OmniRune'] },
];

const OMNI_ONE_LOGS = [
  { time:'00:01', type:'CASE',   msg:'[ESG Report] 5T門控通過 → GRI對標完成' },
  { time:'00:03', type:'LEARN',  msg:'[Memory] 新增記憶 MEM-A1B2，信心度 0.94' },
  { time:'00:07', type:'SYNC',   msg:'[Sync] 數據同步至 OmniNote / OmniCalendar' },
  { time:'00:12', type:'AWAKE',  msg:'[AwakeningCore] 等級提升: awakening → active' },
  { time:'00:15', type:'REPAIR', msg:'[Jules] Bug修復完成 — 觀果→立願→尋因→修因→證果' },
];

function concentric(r:number, color:string, label:string, sub:string, pulse:boolean) {
  return (
    <g key={label}>
      <circle cx={200} cy={200} r={r} fill="none" stroke={color} strokeWidth={pulse?2:1}
        strokeDasharray={pulse?"6 3":undefined} opacity={0.7}/>
      <text x={200} y={200-r+14} textAnchor="middle" fill={color} fontSize={11} fontWeight={600}>{label}</text>
      <text x={200} y={200-r+26} textAnchor="middle" fill={color} fontSize={9} opacity={0.6}>{sub}</text>
    </g>
  );
}

export default function OmniCenterPage() {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [filterPriority, setFilterPriority] = useState<'all'|'high'|'medium'|'low'>('all');
  const [filterDue, setFilterDue]           = useState<'all'|'upcoming'|'overdue'>('all');
  const [sortField, setSortField]           = useState<'dueAt'|'priority'|'status'>('dueAt');
  const [pulse, setPulse]                   = useState(false);
  const [logIdx, setLogIdx]                 = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulse(p=>!p), 1200);
    return ()=>clearInterval(t);
  },[]);

  useEffect(() => {
    const t = setInterval(() => setLogIdx(i=>(i+1)%OMNI_ONE_LOGS.length), 2500);
    return ()=>clearInterval(t);
  },[]);

  const toggleTask = useCallback((id:string) => {
    setTasks(prev=>prev.map(t=>
      t.id===id ? {...t, status: t.status==='completed'?'pending':'completed'} : t
    ));
  },[]);

  const now = Date.now();
  const filtered = tasks
    .filter(t => filterPriority==='all' || t.priority===filterPriority)
    .filter(t => {
      if (filterDue==='all') return true;
      if (!t.dueAt) return false;
      if (filterDue==='overdue') return t.dueAt < now && t.status!=='completed';
      if (filterDue==='upcoming') return t.dueAt >= now && t.dueAt <= now+7*86400000;
      return true;
    })
    .sort((a,b)=>{
      if (sortField==='dueAt') return (a.dueAt??Infinity)-(b.dueAt??Infinity);
      if (sortField==='priority') { const o={high:0,medium:1,low:2}; return o[a.priority]-o[b.priority]; }
      const o={in_progress:0,pending:1,completed:2}; return o[a.status]-o[b.status];
    });

  const stats = { total:tasks.length, done:tasks.filter(t=>t.status==='completed').length,
    high:tasks.filter(t=>t.priority==='high').length, overdue:tasks.filter(t=>t.dueAt&&t.dueAt<now&&t.status!=='completed').length };

  const priorityColor = (p:string) => p==='high'?C.red:p==='medium'?C.gold:C.muted;
  const dueLabel = (d?:number) => {
    if(!d) return null;
    const days = Math.round((d-now)/86400000);
    if(days<0) return <span style={{color:C.red,fontSize:10}}>逾期 {Math.abs(days)}天</span>;
    if(days===0) return <span style={{color:C.gold,fontSize:10}}>今天到期</span>;
    return <span style={{color:C.muted,fontSize:10}}>{days}天後</span>;
  };

  const typeColor = (t:string) => t==='CASE'?C.teal:t==='LEARN'?C.purple:t==='SYNC'?C.cyan:t==='AWAKE'?C.gold:C.red;

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:"'Noto Sans TC',sans-serif",padding:20}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700&family=Fira+Code&family=Montserrat:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${C.teal}44;border-radius:2px}
        .card{background:${C.card};border:1px solid ${C.border};border-radius:16px;padding:16px;backdrop-filter:blur(12px)}
        .btn{border:none;cursor:pointer;border-radius:8px;padding:5px 12px;font-size:12px;transition:all .2s}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .task-row{animation:fadeIn .25s ease}
      `}</style>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <div style={{width:40,height:40,borderRadius:10,background:C.teal,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Montserrat',sans-serif",fontWeight:700,color:'#000',fontSize:18}}>⊙</div>
        <div>
          <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:22,fontWeight:700,color:C.teal}}>萬能中心</h1>
          <div style={{fontSize:11,color:C.muted}}>Omni-Core 同心圓系統 — 無礙圓通，無作筆記</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:pulse?C.green:C.teal,transition:'all .3s',boxShadow:`0 0 ${pulse?8:4}px ${C.green}`}}/>
          <span style={{fontSize:11,color:C.muted}}>系統運行中</span>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        {/* Concentric Circle */}
        <div className="card">
          <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:12,letterSpacing:1}}>同心圓架構</div>
          <svg viewBox="0 0 400 400" style={{width:'100%',height:280}}>
            <defs>
              <radialGradient id="bg-grad" cx="50%" cy="50%"><stop offset="0%" stopColor={C.teal} stopOpacity={0.05}/><stop offset="100%" stopColor="#000" stopOpacity={0}/></radialGradient>
            </defs>
            <circle cx={200} cy={200} r={185} fill="url(#bg-grad)"/>
            {concentric(165,'#3B82F6','ESG GO Platform','ESGGO v5.0',pulse)}
            {concentric(130,'#8B5CF6','OmniOne SDK','覺醒系統',false)}
            {concentric(95,C.teal,'OmniNote / OmniTask','萬能筆記 · 任務',pulse)}
            {concentric(60,C.gold,'5T Protocol','真·善·美·信·通',false)}
            <circle cx={200} cy={200} r={25} fill={C.teal} opacity={0.9}/>
            <text x={200} y={196} textAnchor="middle" fill="#000" fontSize={9} fontWeight={700}>萬能</text>
            <text x={200} y={207} textAnchor="middle" fill="#000" fontSize={9} fontWeight={700}>中心</text>
            {FIVE_T.map((t,i)=>{
              const angle = (i/5)*Math.PI*2 - Math.PI/2;
              const rx = 185*Math.cos(angle)+200, ry = 185*Math.sin(angle)+200;
              return <g key={t.key}>
                <circle cx={rx} cy={ry} r={16} fill={t.color} opacity={0.9}/>
                <text x={rx} y={ry+4} textAnchor="middle" fill="#000" fontSize={10} fontWeight={700}>{t.zh}</text>
              </g>;
            })}
          </svg>
        </div>

        {/* OmniOne Status */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card" style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:12,letterSpacing:1}}>OmniOne 覺醒狀態</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
              {[{l:'覺醒等級',v:'active',c:C.gold},{l:'已處理',v:'47件',c:C.teal},{l:'平均信心',v:'0.91',c:C.purple},{l:'記憶庫',v:'128條',c:C.blue}].map(s=>(
                <div key={s.l} style={{background:C.surface,borderRadius:8,padding:'8px 10px'}}>
                  <div style={{fontSize:10,color:C.muted}}>{s.l}</div>
                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:14,color:s.c,fontWeight:600}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.surface,borderRadius:8,padding:10,minHeight:80}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:6}}>即時運行日誌</div>
              {OMNI_ONE_LOGS.slice(0,3).map((l,i)=>(
                <div key={i} style={{fontSize:11,color:i===logIdx%3?C.text:C.muted,marginBottom:4,transition:'color .3s',display:'flex',gap:6}}>
                  <span style={{color:typeColor(l.type),fontFamily:"'Fira Code',monospace",fontSize:10}}>[{l.type}]</span>
                  <span>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5T Scores */}
          <div className="card">
            <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:10,letterSpacing:1}}>5T 協議評分</div>
            {FIVE_T.map(t=>(
              <div key={t.key} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
                <span style={{width:14,fontSize:12}}>{t.zh}</span>
                <div style={{flex:1,height:6,background:C.surface,borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${(0.85+Math.random()*0.14)*100}%`,background:t.color,borderRadius:3,transition:'width .5s'}}/>
                </div>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:t.color,width:32}}>0.9{Math.floor(Math.random()*9)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OmniNote / OmniTask Panel */}
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,flexWrap:'wrap',gap:8}}>
          <div style={{fontSize:12,fontWeight:600,color:C.muted,letterSpacing:1}}>萬能筆記 · 任務清單 (OmniTask)</div>
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            {/* Priority filter */}
            {(['all','high','medium','low'] as const).map(p=>(
              <button key={p} className="btn" onClick={()=>setFilterPriority(p)}
                style={{background:filterPriority===p?C.teal:'transparent',color:filterPriority===p?'#000':C.muted,border:`1px solid ${filterPriority===p?C.teal:C.border}`}}>
                {p==='all'?'全部':p==='high'?'高':p==='medium'?'中':'低'}
              </button>
            ))}
            <div style={{width:1,height:16,background:C.border}}/>
            {(['all','upcoming','overdue'] as const).map(d=>(
              <button key={d} className="btn" onClick={()=>setFilterDue(d)}
                style={{background:filterDue===d?C.gold:'transparent',color:filterDue===d?'#000':C.muted,border:`1px solid ${filterDue===d?C.gold:C.border}`}}>
                {d==='all'?'所有日期':d==='upcoming'?'即將到來':'已逾期'}
              </button>
            ))}
            <div style={{width:1,height:16,background:C.border}}/>
            <select value={sortField} onChange={e=>setSortField(e.target.value as typeof sortField)}
              style={{background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:'4px 8px',fontSize:12,cursor:'pointer'}}>
              <option value="dueAt">排序: 到期日</option>
              <option value="priority">排序: 優先級</option>
              <option value="status">排序: 完成狀態</option>
            </select>
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:'flex',gap:12,marginBottom:12,flexWrap:'wrap'}}>
          {[{l:'總任務',v:stats.total,c:C.text},{l:'已完成',v:stats.done,c:C.green},{l:'高優先',v:stats.high,c:C.red},{l:'已逾期',v:stats.overdue,c:C.gold}].map(s=>(
            <div key={s.l} style={{background:C.surface,borderRadius:8,padding:'5px 12px',display:'flex',gap:6,alignItems:'center'}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:16,color:s.c,fontWeight:600}}>{s.v}</span>
              <span style={{fontSize:11,color:C.muted}}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Task list */}
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {filtered.length===0 && <div style={{color:C.muted,fontSize:13,padding:16,textAlign:'center'}}>無符合條件的任務</div>}
          {filtered.map(t=>(
            <div key={t.id} className="task-row" style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',
              background:t.status==='completed'?'rgba(34,197,94,0.05)':C.surface,borderRadius:10,
              border:`1px solid ${t.status==='completed'?'rgba(34,197,94,0.2)':C.border}`,transition:'all .2s'}}>
              <button onClick={()=>toggleTask(t.id)} style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${priorityColor(t.priority)}`,
                background:t.status==='completed'?priorityColor(t.priority):'transparent',cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {t.status==='completed'&&<span style={{color:'#000',fontSize:10}}>✓</span>}
              </button>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,color:t.status==='completed'?C.muted:C.text,textDecoration:t.status==='completed'?'line-through':'none',
                  whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.title}</div>
                <div style={{display:'flex',gap:6,marginTop:3,flexWrap:'wrap'}}>
                  {t.tags.map(tag=><span key={tag} style={{fontSize:10,color:C.teal,background:`${C.teal}15`,borderRadius:4,padding:'1px 5px'}}>{tag}</span>)}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2,flexShrink:0}}>
                <span style={{fontSize:10,background:`${priorityColor(t.priority)}20`,color:priorityColor(t.priority),borderRadius:4,padding:'1px 6px'}}>
                  {t.priority==='high'?'高':t.priority==='medium'?'中':'低'}
                </span>
                {dueLabel(t.dueAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="card">
        <div style={{fontSize:12,fontWeight:600,color:C.muted,marginBottom:12,letterSpacing:1}}>萬能模組矩陣</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
          {OMNI_MODULES.map(m=>(
            <div key={m.name} style={{background:C.surface,borderRadius:10,padding:'10px 12px',border:`1px solid ${m.color}30`,cursor:'pointer',transition:'all .2s'}}>
              <div style={{fontSize:20,marginBottom:5}}>{m.icon}</div>
              <div style={{fontSize:12,fontWeight:600,color:m.color}}>{m.name}</div>
              <div style={{fontSize:10,color:C.muted}}>{m.en}</div>
              <div style={{marginTop:5,fontSize:10,background:m.status==='active'?`${C.green}20`:`${C.gold}20`,
                color:m.status==='active'?C.green:C.gold,borderRadius:4,padding:'1px 6px',display:'inline-block'}}>
                {m.status==='active'?'● 運行中':'◐ Beta'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
