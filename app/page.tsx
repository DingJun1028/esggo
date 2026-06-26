'use client';
import { useEffect, useState } from 'react';

const C = { teal:'#009EB0', gold:'#D4AF37', blue:'#3B82F6', purple:'#8B5CF6', cyan:'#06B6D4', green:'#22C55E', red:'#FF4D6D', muted:'var(--muted-color)', surface:'var(--surface-bg)', border:'var(--card-border)' };

const CARDS = [
  { icon:'◎', title:'萬能中心', desc:'OmniCore 同心圓系統 · OmniNote · OmniTask · OmniOne 覺醒 AI', color:C.gold, href:'/omni-center', badge:'NEW' },
  { icon:'📊', title:'ESG 報告產生器', desc:'5T 協議 · 28章節 · ZKP 封印 · GRI 指標自動對標', color:C.teal, href:'/sustain-write/v5', badge:'v5.0' },
];

const FIVE_T = [
  { zh:'真', en:'Traceable',   color:'#3B82F6', desc:'可溯源追蹤的真實數據' },
  { zh:'善', en:'Transparent',  color:'#22C55E', desc:'可透明驗算的公正審計' },
  { zh:'美', en:'Tangible',     color:'#F59E0B', desc:'可感知的卓越呈現' },
  { zh:'信', en:'Trustworthy',  color:'#8B5CF6', desc:'不可篡改的信任' },
  { zh:'通', en:'Trackable',    color:'#06B6D4', desc:'超越一切的無礙圓通' },
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(()=>setTick(x=>x+1), 1400); return ()=>clearInterval(t); }, []);

  return (
    <div style={{minHeight:'calc(100vh - 52px)', padding:'40px 20px', maxWidth:900, margin:'0 auto'}}>
      {/* Hero */}
      <div style={{textAlign:'center', marginBottom:48}}>
        <div style={{width:64,height:64,borderRadius:16,background:C.teal,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:28,boxShadow:`0 0 ${tick%2?24:12}px ${C.teal}60`,transition:'box-shadow .7s',color:'#000'}}>⊙</div>
        <h1 style={{fontFamily:"'Montserrat',sans-serif",fontSize:32,fontWeight:700,color:C.teal,marginBottom:8}}>ESGGO 萬能系統</h1>
        <p style={{color:C.muted,fontSize:15,maxWidth:520,margin:'0 auto',lineHeight:1.7}}>
          以「萬能中心同心圓 (Omni-Core)」為核心的永續數據治理平台<br/>
          <span style={{color:C.gold}}>無礙圓通，無作筆記</span>
        </p>
      </div>

      {/* Main Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginBottom:40}}>
        {CARDS.map(c=>(
          <a key={c.title} href={c.href} style={{
            display:'block', background:'var(--card-bg)', border:`1px solid var(--card-border)`,
            borderRadius:16, padding:24, cursor:'pointer', transition:'all .2s', textDecoration:'none',
          }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=c.color;(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=`var(--card-border)`;(e.currentTarget as HTMLElement).style.transform='translateY(0)';}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <span style={{fontSize:24}}>{c.icon}</span>
              <span style={{fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:18,color:c.color}}>{c.title}</span>
              <span style={{marginLeft:'auto',background:c.color,color:'#000',padding:'2px 8px',borderRadius:6,fontSize:11,fontWeight:700}}>{c.badge}</span>
            </div>
            <p style={{color:C.muted,fontSize:13,lineHeight:1.7}}>{c.desc}</p>
          </a>
        ))}
      </div>

      {/* 5T Strip */}
      <div style={{background:'var(--card-bg)',border:`1px solid var(--card-border)`,borderRadius:16,padding:'20px 24px'}}>
        <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:1,marginBottom:14}}>5T 永續數據治理協議</div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          {FIVE_T.map(t=>(
            <div key={t.zh} style={{flex:'1 1 140px',background:C.surface,borderRadius:10,padding:'12px 14px',border:`1px solid ${t.color}30`}}>
              <div style={{fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:22,color:t.color,marginBottom:2}}>{t.zh}</div>
              <div style={{fontSize:11,color:t.color,opacity:.7,marginBottom:4}}>{t.en}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
