'use client';
import { useState, useEffect, useMemo } from 'react';

interface FiveTData { traceable:number; transparent:number; tangible:number; trustworthy:number; trackable:number; }

const DIMS = [
  { key:'traceable',   zh:'真', color:'var(--accent-blue)' },
  { key:'transparent', zh:'善', color:'var(--accent-green)' },
  { key:'tangible',    zh:'美', color:'var(--accent-gold)' },
  { key:'trustworthy', zh:'信', color:'var(--accent-purple)' },
  { key:'trackable',   zh:'通', color:'var(--accent-cyan)' },
] as const;

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

interface Props { companyName?: string; zkpCount?: number; evidenceCount?: number; }

const DEMO_COMPANIES = [
  { name:'台積電 TSMC',    scores:{ traceable:0.94, transparent:0.91, tangible:0.88, trustworthy:0.96, trackable:0.89 } },
  { name:'台達電',          scores:{ traceable:0.87, transparent:0.85, tangible:0.90, trustworthy:0.88, trackable:0.83 } },
  { name:'中鋼',            scores:{ traceable:0.79, transparent:0.82, tangible:0.75, trustworthy:0.84, trackable:0.78 } },
  { name:'鴻海',            scores:{ traceable:0.88, transparent:0.86, tangible:0.85, trustworthy:0.90, trackable:0.84 } },
];

export function FiveTRadar({ companyName, zkpCount, evidenceCount }: Props) {
  const [selected, setSelected] = useState(0);
  const [remoteScores, setRemoteScores] = useState<FiveTData | null>(null);
  const [displayed, setDisplayed] = useState<FiveTData>({ traceable:0,transparent:0,tangible:0,trustworthy:0,trackable:0 });

  const [traceable, transparent, tangible, trustworthy, trackable] = Object.values(remoteScores ?? {
    traceable: Math.min(0.99, 0.4 + (zkpCount || 0) * 0.06),
    transparent: 0.85,
    tangible: 0.80,
    trustworthy: Math.min(0.99, 0.5 + (zkpCount || 0) * 0.05),
    trackable: 0.88,
  });

  const MY_COMPANY = useMemo(() => ({
    name: companyName || '我的數位雙生',
    scores: {
      traceable,
      transparent,
      tangible,
      trustworthy,
      trackable,
    },
  }), [companyName, traceable, transparent, tangible, trustworthy, trackable]);

  const COMPANIES = useMemo(() => [MY_COMPANY, ...DEMO_COMPANIES], [MY_COMPANY]);
  const target = useMemo(() => COMPANIES[selected]?.scores ?? { traceable:0,transparent:0,tangible:0,trustworthy:0,trackable:0 }, [COMPANIES, selected]);

  useEffect(() => {
    const count = Number(evidenceCount || 0);
    setRemoteScores({
      traceable: Math.min(0.99, 0.4 + count * 0.006),
      transparent: Math.min(0.99, 0.85 + count * 0.002),
      tangible: Math.min(0.99, 0.80 + count * 0.003),
      trustworthy: Math.min(0.99, 0.5 + count * 0.005),
      trackable: Math.min(0.99, 0.88 + count * 0.002),
    });
  }, [evidenceCount]);

  useEffect(() => {
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
    };
    requestAnimationFrame(animate);
  }, [selected, target, displayed]);

  const CX = 120, CY = 120, MAX_R = 90;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const overallScore = Object.values(displayed).reduce((s,v)=>s+v,0)/5;
  const allPass = Object.values(target).every(v=>v>=0.8);

  return (
    <div>
      <div className="text-xs font-semibold text-textSecondary tracking-wider mb-2.5">5T 協議即時評分雷達圖</div>

      {/* Company selector */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {COMPANIES.map((c,i)=>(
          <button key={c.name} onClick={()=>setSelected(i)}
            className={`text-[11px] px-2.5 py-1 rounded-md cursor-pointer border-none transition-all duration-200 ${
              selected===i ? 'bg-accentTeal text-white' : 'bg-primary text-textSecondary'
            } ${i===0 ? 'font-bold shadow-sm' : ''}`}>
            {c.name} {i===0 && zkpCount !== undefined ? `(${zkpCount})` : ''}
          </button>
        ))}
      </div>

      <div className="flex gap-4 items-start flex-wrap">
        {/* SVG Radar */}
        <svg width={240} height={240} className="shrink-0">
          {/* Grid */}
          {gridLevels.map(level=>(
            <polygon key={level}
              points={DIMS.map((_,i)=>{ const a=(i/5)*Math.PI*2; const p=polarPoint(a,level*MAX_R,CX,CY); return `${p.x},${p.y}`; }).join(' ')}
              fill="none" stroke="var(--accent-teal)" strokeOpacity={0.2} strokeWidth={1}/>
          ))}
          {/* Axes */}
          {DIMS.map((_,i)=>{
            const a=(i/5)*Math.PI*2;
            const p=polarPoint(a,MAX_R,CX,CY);
            return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="var(--accent-teal)" strokeOpacity={0.2} strokeWidth={1}/>;
          })}
          {/* Score polygon */}
          <path d={radarPath(displayed,MAX_R,CX,CY)} fill="var(--accent-teal)" fillOpacity={0.15} stroke="var(--accent-teal)" strokeWidth={2}/>
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
        <div className="flex-1 min-w-[140px]">
          <div className="mb-2">
            <div className={`font-['Fira_Code',monospace] text-[22px] font-bold ${allPass?'text-accentGreen':'text-accentGold'}`}>{(overallScore*100).toFixed(1)}%</div>
            <div className="text-[11px] text-textSecondary">綜合 5T 合規分數</div>
            <div className={`text-[11px] mt-0.5 ${allPass?'text-accentGreen':'text-accentGold'}`}>{allPass?'● 全部通過 (≥80%)':'◐ 部分待改善'}</div>
          </div>
          {DIMS.map(d=>(
            <div key={d.key} className="flex items-center gap-1.5 mb-1.5">
              <span className="w-3.5 text-xs font-bold" style={{color:d.color}}>{d.zh}</span>
              <div className="flex-1 h-1.5 bg-primary rounded-[3px]">
                <div className="h-full rounded-[3px] transition-all duration-[50ms]" style={{width:`${displayed[d.key]*100}%`,background:d.color}}/>
              </div>
              <span className="font-['Fira_Code',monospace] text-[11px] w-9 text-right" style={{color:d.color}}>{(displayed[d.key]*100).toFixed(0)}%</span>
              <span className={`text-[10px] ${displayed[d.key]>=0.8?'text-accentGreen':'text-accentRed'}`}>{displayed[d.key]>=0.8?'✓':'✗'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
