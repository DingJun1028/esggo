'use client';
import { useState, useEffect } from 'react';

interface FiveTData { traceable:number; transparent:number; tangible:number; trustworthy:number; trackable:number; }

const DIMS = [
  { key:'traceable',   zh:'真', color:'#3B82F6' },
  { key:'transparent', zh:'善', color:'#22C55E' },
  { key:'tangible',    zh:'美', color:'#F59E0B' },
  { key:'trustworthy', zh:'信', color:'#8B5CF6' },
  { key:'trackable',   zh:'通', color:'#06B6D4' },
] as const;

type DimKey = typeof DIMS[number]['key'];

function polarPoint(angle:number, r:number, cx:number, cy:number) {
  return { x: cx + r * Math.cos(angle - Math.PI/2), y: cy + r * Math.sin(angle - Math.PI/2) };
}

function radarPath(scores: FiveTData, maxR:number, cx:number, cy:number): string {
  return DIMS.map((d,i) => {
    const angle = (i / 5) * Math.PI * 2;
    const r = scores[d.key] * maxR;
    const p = polarPoint(angle, r, cx, cy);
    return `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ') + ' Z';
}

interface Props { companyName?: string; onFetch?: ()=>Promise<FiveTData>; }

const DEMO_COMPANIES = [
  { name:'台積電 TSMC',    scores:{ traceable:0.94, transparent:0.91, tangible:0.88, trustworthy:0.96, trackable:0.89 } },
  { name:'台達電',          scores:{ traceable:0.87, transparent:0.85, tangible:0.90, trustworthy:0.88, trackable:0.83 } },
  { name:'中鋼',            scores:{ traceable:0.79, transparent:0.82, tangible:0.75, trustworthy:0.84, trackable:0.78 } },
  { name:'鴻海',            scores:{ traceable:0.88, transparent:0.86, tangible:0.85, trustworthy:0.90, trackable:0.84 } },
];

// Light theme color tokens
const C = { muted:'#64748B', surface:'#F1F5F9', border:'#E2E8F0', text:'#0F172A' };

export function FiveTRadar({ }: Props) {
  const [selected, setSelected] = useState(0);
  const [displayed, setDisplayed] = useState<FiveTData>({ traceable:0,transparent:0,tangible:0,trustworthy:0,trackable:0 });
  const [loading, setLoading] = useState(false);

  const target = DEMO_COMPANIES[selected]?.scores ?? { traceable:0,transparent:0,tangible:0,trustworthy:0,trackable:0 };

  // Animate scores on change
  useEffect(() => {
    setLoading(true);
    let frame = 0;
    const FRAMES = 30;
    const start = { ...displayed };
    const animate = () => {
      frame++;
      const t = frame / FRAMES;
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      setDisplayed({
        traceable:   start.traceable   + (target.traceable   - start.traceable)   * ease,
        transparent: start.transparent + (target.transparent - start.transparent) * ease,
        tangible:    start.tangible    + (target.tangible    - start.tangible)    * ease,
        trustworthy: start.trustworthy + (target.trustworthy - start.trustworthy) * ease,
        trackable:   start.trackable   + (target.trackable   - start.trackable)   * ease,
      });
      if (frame < FRAMES) requestAnimationFrame(animate);
      else { setDisplayed(target); setLoading(false); }
    };
    requestAnimationFrame(animate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const CX = 120, CY = 120, MAX_R = 90;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const overallScore = Object.values(displayed).reduce((s,v)=>s+v,0)/5;
  const allPass = Object.values(target).every(v=>v>=0.8);

  return (
    <div>
      <div style={{fontSize:12,fontWeight:600,color:C.muted,letterSpacing:1,marginBottom:10}}>5T 協議即時評分雷達圖</div>

      {/* Company selector */}
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
        {DEMO_COMPANIES.map((c,i)=>(
          <button key={c.name} onClick={()=>setSelected(i)}
            style={{fontSize:11,padding:'4px 10px',borderRadius:6,cursor:'pointer',border:'none',
              background:selected===i?'#009EB0':C.surface,color:selected===i?'#FFFFFF':C.muted,transition:'all .2s'}}>
            {c.name}
          </button>
        ))}
      </div>

      <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
        {/* SVG Radar */}
        <svg width={240} height={240} style={{flexShrink:0}}>
          {/* Grid */}
          {gridLevels.map(level=>(
            <polygon key={level}
              points={DIMS.map((_,i)=>{ const a=(i/5)*Math.PI*2; const p=polarPoint(a,level*MAX_R,CX,CY); return `${p.x},${p.y}`; }).join(' ')}
              fill="none" stroke="rgba(0,158,176,0.2)" strokeWidth={1}/>
          ))}
          {/* Axes */}
          {DIMS.map((_,i)=>{
            const a=(i/5)*Math.PI*2;
            const p=polarPoint(a,MAX_R,CX,CY);
            return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(0,158,176,0.2)" strokeWidth={1}/>;
          })}
          {/* Score polygon */}
          <path d={radarPath(displayed,MAX_R,CX,CY)} fill="rgba(0,158,176,0.15)" stroke="#009EB0" strokeWidth={2}/>
          {/* Labels */}
          {DIMS.map((d,i)=>{
            const a=(i/5)*Math.PI*2;
            const p=polarPoint(a,MAX_R+16,CX,CY);
            return <text key={d.key} x={p.x} y={p.y+4} textAnchor="middle" fill={d.color} fontSize={13} fontWeight={700}>{d.zh}</text>;
          })}
          {/* Score dots */}
          {DIMS.map((d,i)=>{
            const a=(i/5)*Math.PI*2;
            const r=displayed[d.key]*MAX_R;
            const p=polarPoint(a,r,CX,CY);
            return <circle key={d.key} cx={p.x} cy={p.y} r={4} fill={d.color}/>;
          })}
        </svg>

        {/* Scores list */}
        <div style={{flex:1,minWidth:140}}>
          <div style={{marginBottom:8}}>
            <div style={{fontFamily:"'Fira Code',monospace",fontSize:22,fontWeight:700,color:allPass?'#22C55E':'#F59E0B'}}>{(overallScore*100).toFixed(1)}%</div>
            <div style={{fontSize:11,color:C.muted}}>綜合 5T 合規分數</div>
            <div style={{fontSize:11,marginTop:2,color:allPass?'#22C55E':'#F59E0B'}}>{allPass?'● 全部通過 (≥80%)':'◐ 部分待改善'}</div>
          </div>
          {DIMS.map(d=>(
            <div key={d.key} style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
              <span style={{width:14,fontSize:12,color:d.color,fontWeight:700}}>{d.zh}</span>
              <div style={{flex:1,height:5,background:C.surface,borderRadius:3}}>
                <div style={{height:'100%',width:`${displayed[d.key]*100}%`,background:d.color,borderRadius:3,transition:'width .05s'}}/>
              </div>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:d.color,width:36,textAlign:'right'}}>{(displayed[d.key]*100).toFixed(0)}%</span>
              <span style={{fontSize:10,color:displayed[d.key]>=0.8?'#22C55E':'#FF4D6D'}}>{displayed[d.key]>=0.8?'✓':'✗'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
