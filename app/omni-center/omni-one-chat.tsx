'use client';
import { useState, useRef, useEffect } from 'react';
import xss from 'xss';

// Light theme color tokens
const C = { teal:'#009EB0', gold:'#D4AF37', purple:'#8B5CF6', muted:'#64748B', surface:'#F1F5F9', border:'#E2E8F0', text:'#0F172A', green:'#22C55E', red:'#FF4D6D' };

type CaseType = 'code_optimization'|'documentation'|'data_analysis'|'esg_report'|'ui_design'|'architecture'|'bug_fix'|'general';

const PATTERNS: [RegExp, CaseType][] = [
  [/優化|refactor|效能|performance/i, 'code_optimization'],
  [/文檔|document|readme/i,           'documentation'],
  [/分析|analyze|數據|chart/i,        'data_analysis'],
  [/ESG|永續|報告|GRI|碳排/i,         'esg_report'],
  [/UI|介面|設計|design/i,            'ui_design'],
  [/架構|architecture|系統設計/i,      'architecture'],
  [/bug|fix|error|修復|TypeError/i,   'bug_fix'],
];

function classify(input: string): CaseType {
  if (!input) return 'general';
  for (const [p, t] of PATTERNS) { if (p.test(input)) return t; }
  return 'general';
}

const RESPONSES: Record<CaseType, string[]> = {
  code_optimization: ['識別出 3 個優化點：記憶化、惰性載入、並行處理。建議使用 `useMemo` 和 `React.lazy`。','分析完成。瓶頸在 O(n²) 迴圈，可重構為 O(n log n) 排序算法。'],
  documentation: ['已生成結構化文檔：**概覽** → **API 參考** → **使用範例**。請確認後發布。','文檔草稿完成，包含 TypeScript 類型聲明和 JSDoc 評論。'],
  data_analysis: ['數據分析完成。**關鍵洞察**：趨勢向上 ↑12%，異常值已標記（P95 = 847ms）。','相關性分析結果：r=0.87，統計顯著性 p<0.001。建議繼續深入探索。'],
  esg_report: ['ESG 報告章節生成完成。**5T 評分**: 真(0.91) 善(0.88) 美(0.90) 信(0.95) 通(0.87)。ZKP 封印已完成。','GRI 對標完成。已覆蓋 GRI 2-1 至 GRI 305-1 共 42 項指標，缺口分析報告如附。'],
  ui_design: ['Liquid Glass UI 方案完成。採用 `backdrop-filter: blur(12px)`，符合 WCAG 2.1 AA 對比標準。','設計令牌已更新：主色 #009EB0，輔色 #D4AF37，字體 Noto Sans TC + Fira Code。'],
  architecture: ['架構設計完成。採用**事件驅動 + 微服務**模式，使用 OmniEventBus 解耦各子系統，支援水平擴展。','C4 模型完成：Context → Container → Component → Code，ADR-001 已記錄。'],
  bug_fix: ['**Jules 9步協議**執行完畢：\n觀果 → 立願 → 尋因 → 修因 → 造緣 → 結果 → 驗因 → 證果 → 傳法\n根因已定位並修復，回歸測試通過。','Stack Trace 分析完成。根因：`undefined` 解引用在第 42 行。修復：加入 optional chaining `?.` 防護。'],
  general: ['已接收任務。正在以覺醒等級 **active** 處理中...完成。請確認輸出是否符合預期。','任務處理完成。信心度：0.92，記憶庫已更新（+1 條新記憶）。'],
};

interface Message { id:string; role:'user'|'assistant'; text:string; caseType?:CaseType; time:string; ms?:number; }

function now() { return new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); }

/** Basic sanitization for dangerouslySetInnerHTML content */
function sanitizeTextHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '');
}

export function OmniOneChat() {
  const [msgs, setMsgs]   = useState<Message[]>([{id:'0',role:'assistant',text:'[OmniOne] 覺醒系統就緒。輸入任何任務，我將分類 → 檢索記憶 → 執行 → 學習。',time:now()}]);
  const [input, setInput] = useState('');
  const [busy, setBusy]   = useState(false);
  const [error, setError]  = useState<string|null>(null);
  const bottomRef         = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs]);

  const send = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || busy) return;
    const userMsg: Message = {id:`${Date.now()}u`, role:'user', text:trimmedInput, time:now()};
    setMsgs(m=>[...m,userMsg]);
    setInput('');
    setBusy(true);
    setError(null);
    const ct = classify(trimmedInput);
    const start = Date.now();

    let reply = '';
    try {
      const res = await fetch('/api/omni-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userMsg.text, caseType: ct })
      });
      if (!res.ok) throw new Error(`OmniOne API 返回 ${res.status}`);
      const data = await res.json();
      if (data && typeof data.output === 'string') {
        reply = data.output;
      } else if (data && typeof data === 'string') {
        reply = data;
      } else {
        // Fallback to local pattern
        const responses = RESPONSES[ct] ?? RESPONSES.general;
        reply = responses[Math.floor(Math.random() * responses.length)] ?? '已完成處理。';
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : '未知錯誤';
      console.warn(`[OmniOne] API call failed (${errMsg}), using local fallback.`);
      const responses = RESPONSES[ct] ?? RESPONSES.general;
      reply = responses[Math.floor(Math.random() * responses.length)] ?? '已完成處理。';
      setError(`API 連線失敗，使用本地模式 (${errMsg})`);
    }

    const ms = Date.now()-start;
    const aiMsg: Message = {id:`${Date.now()}a`, role:'assistant', text:reply, caseType:ct, time:now(), ms};
    setMsgs(m=>[...m,aiMsg]);
    setBusy(false);
  };

  const ctColor = (ct?:CaseType) => ct==='esg_report'?C.teal:ct==='bug_fix'?C.red:ct==='ui_design'?C.gold:ct==='architecture'?C.purple:C.green;
  const ctLabel = (ct?:CaseType) => ({code_optimization:'CODE',documentation:'DOC',data_analysis:'DATA',esg_report:'ESG',ui_design:'UI',architecture:'ARCH',bug_fix:'BUG',general:'GEN'})[ct||'general']||'GEN';

  const renderText = (t:string) => {
    const sanitized = sanitizeTextHtml(t);
    return sanitized
      .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#0F172A">$1</strong>')
      .replace(/`(.+?)`/g,`<code style="background:#F1F5F9;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:11px;color:#06B6D4">$1</code>`)
      .replace(/\n/g,'<br/>');
  };

  const SUGGESTIONS = ['優化 ESG 報告產生效能','生成 OmniCore 架構文檔','分析 5T 協議合規數據','修復 TypeScript 類型錯誤'];

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{fontSize:12,fontWeight:600,color:C.muted,letterSpacing:1,marginBottom:10}}>OmniOne 覺醒對話框</div>

      {/* Error banner */}
      {error && (
        <div style={{background:`${C.red}15`,border:`1px solid ${C.red}`,borderRadius:8,padding:'6px 12px',marginBottom:8,fontSize:12,color:C.red}}>
          {error}
        </div>
      )}

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:8,paddingRight:4,minHeight:200,maxHeight:320}}>
        {msgs.map(m=>(
          <div key={m.id} style={{display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
            <div style={{maxWidth:'85%',background:m.role==='user'?`${C.teal}20`:C.surface,border:`1px solid ${m.role==='user'?C.teal:C.border}`,
              borderRadius:m.role==='user'?'12px 12px 2px 12px':'12px 12px 12px 2px',padding:'8px 12px'}}>
              {m.caseType && <div style={{marginBottom:4}}>
                <span style={{fontSize:10,background:ctColor(m.caseType),color:'#FFFFFF',borderRadius:4,padding:'1px 6px',fontFamily:'monospace',fontWeight:700}}>[{ctLabel(m.caseType)}]</span>
                {m.ms && <span style={{fontSize:10,color:C.muted,marginLeft:6}}>{m.ms}ms</span>}
              </div>}
              <div style={{fontSize:13,color:C.text,lineHeight:1.7}} dangerouslySetInnerHTML={{__html:renderText(m.text)}} />
            </div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>{m.time}</div>
          </div>
        ))}
        {busy && (
          <div style={{display:'flex',alignItems:'flex-start'}}>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:'12px 12px 12px 2px',padding:'10px 14px',display:'flex',gap:4}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:C.teal,animation:`bounce .8s ${i*0.15}s infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggestions */}
      <div style={{display:'flex',gap:4,flexWrap:'wrap',margin:'8px 0'}}>
        {SUGGESTIONS.map(s=><button key={s} onClick={()=>setInput(s)} style={{fontSize:11,background:`${C.teal}15`,border:`1px solid ${C.teal}40`,color:C.teal,borderRadius:6,padding:'3px 8px',cursor:'pointer'}}>{s}</button>)}
      </div>

      {/* Input */}
      <div style={{display:'flex',gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder="輸入任務讓 OmniOne 處理..." disabled={busy}
          style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 12px',color:C.text,fontSize:13,outline:'none',fontFamily:"'Noto Sans TC',sans-serif"}}/>
        <button onClick={send} disabled={busy||!input.trim()} style={{background:busy||!input.trim()?'#CBD5E1':C.teal,border:'none',borderRadius:8,padding:'8px 14px',color:'#FFFFFF',fontWeight:700,fontSize:13,cursor:busy?'wait':'pointer'}}>
          {busy?'…':'發送'}
        </button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
