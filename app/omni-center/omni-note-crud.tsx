'use client';
import { useState, useCallback } from 'react';
import xss from 'xss';

// Light theme color tokens
const C = { teal:'#009EB0', gold:'#D4AF37', red:'#FF4D6D', muted:'#64748B', surface:'#F1F5F9', border:'#E2E8F0', text:'#0F172A', green:'#22C55E' };

export interface NoteData { id:string; title:string; content:string; tags:string[]; fiveTGate?:string; createdAt:number; }

function rnd() { return Math.random().toString(36).slice(2,6).toUpperCase(); }

interface Props { notes: NoteData[]; onChange: (notes:NoteData[])=>void; }

/** Basic HTML sanitization: escape <script> and dangerous tags to prevent XSS */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '');
}

export function OmniNoteCRUD({ notes, onChange }: Props) {
  const [editing, setEditing]   = useState<NoteData|null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft]       = useState({ title:'', content:'', tags:'', fiveTGate:'' });
  const [preview, setPreview]   = useState<string|null>(null);

  const startCreate = () => { setDraft({title:'',content:'',tags:'',fiveTGate:''}); setCreating(true); setEditing(null); };
  const startEdit   = (n:NoteData) => { setDraft({title:n.title,content:n.content,tags:(n.tags??[]).join(', '),fiveTGate:n.fiveTGate||''}); setEditing(n); setCreating(false); };
  const cancel      = () => { setCreating(false); setEditing(null); };

  const save = useCallback(() => {
    const tags = (draft.tags||'').split(',').map(t=>t.trim()).filter(Boolean);
    if (editing) {
      onChange(notes.map(n => n.id===editing.id ? {...n,...draft,tags} : n));
    } else {
      onChange([...notes, {id:`ON-${rnd()}`,title:draft.title||'未命名',content:draft.content,tags,fiveTGate:draft.fiveTGate||undefined,createdAt:Date.now()}]);
    }
    cancel();
  }, [draft, editing, notes, onChange]);

  const remove = useCallback((id:string) => {
    onChange(notes.filter(n=>n.id!==id));
  }, [notes, onChange]);

  const gateColor = (g?:string) => g==='traceable'?'#3B82F6':g==='transparent'?'#22C55E':g==='tangible'?'#F59E0B':g==='trustworthy'?'#8B5CF6':g==='trackable'?'#06B6D4':C.muted;

  const renderMd = (s:string) => {
    const sanitized = sanitizeHtml(s);
    return sanitized
      .replace(/^### (.+)$/gm,'<h3 style="color:#D4AF37;font-size:14px;margin:8px 0 4px">$1</h3>')
      .replace(/^## (.+)$/gm,'<h2 style="color:#009EB0;font-size:15px;margin:10px 0 4px">$1</h2>')
      .replace(/^# (.+)$/gm,'<h1 style="color:#009EB0;font-size:17px;margin:10px 0 6px">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#0F172A">$1</strong>')
      .replace(/`(.+?)`/g,'<code style="background:#F1F5F9;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:12px;color:#06B6D4">$1</code>')
      .replace(/\n/g,'<br/>');
  };

  const inputStyle = { width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 10px', color:C.text, fontSize:13, outline:'none', fontFamily:"'Noto Sans TC',sans-serif" };
  const btnStyle   = (c:string) => ({ border:'none', borderRadius:8, padding:'6px 14px', fontSize:12, cursor:'pointer', fontWeight:600, background:c, color:'#FFFFFF' });

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:600,color:C.muted,letterSpacing:1}}>萬能筆記 (OmniNote) — CRUD</div>
        <button onClick={startCreate} style={btnStyle(C.teal)}>+ 新增筆記</button>
      </div>

      {/* Editor */}
      {(creating||editing) && (
        <div style={{background:C.surface,border:`1px solid ${C.teal}`,borderRadius:12,padding:16,marginBottom:14}}>
          <div style={{fontSize:12,color:C.teal,marginBottom:10,fontWeight:600}}>{editing?'✏️ 編輯筆記':'✨ 新增筆記'}</div>
          <input style={{...inputStyle,marginBottom:8}} placeholder="標題" value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} />
          <div style={{display:'flex',gap:6,marginBottom:8}}>
            <button onClick={()=>setPreview(null)} style={{...btnStyle(preview===null?C.teal:C.surface),color:preview===null?'#FFFFFF':C.muted,flex:1}}>✏️ 編輯</button>
            <button onClick={()=>setPreview(draft.content)} style={{...btnStyle(preview!==null?C.gold:C.surface),color:preview!==null?'#FFFFFF':C.muted,flex:1}}>👁 預覽</button>
          </div>
          {preview!==null
            ? <div style={{minHeight:100,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'10px 12px',fontSize:13,lineHeight:1.8,color:C.text}} dangerouslySetInnerHTML={{__html:renderMd(preview)}} />
            : <textarea style={{...inputStyle,minHeight:100,resize:'vertical',display:'block'}} placeholder="內容 (支援 Markdown: # ## ### **粗體** `code`)" value={draft.content} onChange={e=>setDraft(d=>({...d,content:e.target.value}))} />
          }
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:8}}>
            <input style={inputStyle} placeholder="標籤 (逗號分隔)" value={draft.tags} onChange={e=>setDraft(d=>({...d,tags:e.target.value}))} />
            <select style={{...inputStyle,cursor:'pointer'}} value={draft.fiveTGate} onChange={e=>setDraft(d=>({...d,fiveTGate:e.target.value}))}>
              <option value="">5T 門控 (選填)</option>
              {['traceable','transparent','tangible','trustworthy','trackable'].map(g=><option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button onClick={save} style={btnStyle(C.green)}>💾 儲存</button>
            <button onClick={cancel} style={{...btnStyle(C.surface),color:C.muted}}>取消</button>
          </div>
        </div>
      )}

      {/* Note List */}
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {notes.length===0 && <div style={{color:C.muted,fontSize:13,textAlign:'center',padding:20}}>尚無筆記，點擊「新增筆記」開始</div>}
        {notes.map(n=>(
          <div key={n.id} style={{background:C.surface,borderRadius:10,padding:'12px 14px',border:`1px solid ${gateColor(n.fiveTGate)}30`}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:14,color:C.text,marginBottom:4}}>{n.title}</div>
                <div style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:6,
                  overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as const}}>
                  {n.content}
                </div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {n.fiveTGate && <span style={{fontSize:10,background:`${gateColor(n.fiveTGate)}20`,color:gateColor(n.fiveTGate),borderRadius:4,padding:'1px 6px'}}>{n.fiveTGate}</span>}
                  {(n.tags??[]).map(t=><span key={t} style={{fontSize:10,color:C.teal,background:`${C.teal}15`,borderRadius:4,padding:'1px 5px'}}>{t}</span>)}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4,flexShrink:0}}>
                <button onClick={()=>startEdit(n)} style={{...btnStyle(C.gold),padding:'4px 10px',fontSize:11}}>編輯</button>
                <button onClick={()=>remove(n.id)} style={{...btnStyle(C.red),padding:'4px 10px',fontSize:11}}>刪除</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
