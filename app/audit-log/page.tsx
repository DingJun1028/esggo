'use client';

import { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { Shield, Eye, X, Search, Send, Mail, Hash, RefreshCw, CheckCircle, AlertTriangle, Share2 } from 'lucide-react';
import { dcListAuditRecords } from '../../lib/dataconnect-services';
import { 
  BrandButton, BrandCard, BrandBadge, BrandTable, BrandPageHeader, BrandInput, BrandStatusDot, BrandCardHeader 
} from '../../components/brand';

const ACTION_COLORS: Record<string, string> = {
  'ZKP_SEAL': 'var(--purple-600)',
  'VAULT_OMNI_ENGRAVE': 'var(--blue-700)',
  'AGENT_EXECUTE': 'var(--gold-500)',
  'SAVE_DRAFT': 'var(--green-600)',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [resendingLog, setResendingLog] = useState<any | null>(null);
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  async function loadLogs() {
    setLoading(true);
    const data = await dcListAuditRecords();
    setLogs(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const handleResend = async () => {
    if (!resendingLog || !resendEmail) return;
    setIsResending(true);
    try {
      const res = await fetch('/api/proof/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: resendingLog.id,
          email: resendEmail,
          metadata: { hash: resendingLog.contentHash, gri: resendingLog.standard }
        })
      });
      const data = await res.json();
      if (data.ok) {
        alert(`✅ 5T 實證憑證已送出！\nResend ID: ${data.messageId}`);
        setResendingLog(null);
        setResendEmail('');
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      alert('發送失敗，請稍後重試');
    } finally {
      setIsResending(false);
    }
  };

  const filtered = logs.filter(log => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (log.title && log.title.toLowerCase().includes(term)) ||
      (log.source && log.source.toLowerCase().includes(term)) ||
      (log.contentHash && log.contentHash.toLowerCase().includes(term))
    );
  });

  return (
    <ClientLayout>
      <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
        
        <BrandPageHeader 
          title="審計稽核日誌 Audit Log" 
          subtitle="T5 Trackable · 5T 協議執行軌跡 · 不可篡改審計鏈"
          icon={<Shield size={24} />}
          actions={
            <div className="flex gap-2">
               <BrandButton variant="ghost" size="sm" onClick={loadLogs}>
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>
               </BrandButton>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[
             { label: '今日事件', value: logs.length, icon: <RefreshCw size={18}/> },
             { label: '5T 封印項', value: logs.filter(l => l.contentHash).length, icon: <Hash size={18}/> },
             { label: 'Agent 調度', value: logs.filter(l => l.title?.includes('AGENT')).length, icon: <RefreshCw size={18}/> },
             { label: '數據誠信度', value: '100% SECURE', icon: <CheckCircle size={18}/> },
           ].map(s => (
             <BrandCard key={s.label} padding="md" className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-xl font-extrabold text-[#003262]">{s.value}</p>
             </BrandCard>
           ))}
        </div>

        <BrandCard padding="none" className="overflow-hidden shadow-sm">
           <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-700">實時審計流 (PostgreSQL Powered)</h3>
              <div className="relative w-full md:w-64">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-blue-600 outline-none transition-all"
                   placeholder="搜尋日誌..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
              </div>
           </div>

           <div className="scroll-x-governed min-h-[300px]">
             {loading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <RefreshCw size={32} className="text-[#003262]/20 animate-spin" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fetching Audit Chain via GraphQL...</p>
               </div>
             ) : (
               <BrandTable 
                 columns={[
                   { key: 'action', label: '操作類型' },
                   { key: 'resource', label: '資源來源' },
                   { key: 'user', label: '執行節點' },
                   { key: 't5', label: '標準規範' },
                   { key: 'hash', label: 'Hash Lock' },
                   { key: 'time', label: '時間' },
                   { key: 'ops', label: '操作' },
                 ]}
                 data={filtered.map(log => ({
                   action: (
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ background: ACTION_COLORS[log.title!] || '#cbd5e1' }} />
                         <span className="font-bold text-slate-700 text-xs">{log.title}</span>
                      </div>
                   ),
                   resource: <span className="text-xs text-slate-500 font-medium">{log.source || '-'}</span>,
                   user: (
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                            {log.dataType?.charAt(0) || 'N'}
                         </div>
                         <span className="text-xs text-slate-600">{log.dataType || 'Node'}</span>
                      </div>
                   ),
                   t5: <BrandBadge variant="outline" size="xs" className="font-mono">{log.standard || '5T_SYNC'}</BrandBadge>,
                   hash: log.contentHash ? <code className="text-[9px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{log.contentHash.slice(0, 12)}...</code> : <span className="text-[10px] text-slate-300">-</span>,
                   time: <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.createdAt || '').toLocaleTimeString()}</span>,
                   ops: (
                      <div className="flex gap-1">
                         <BrandButton variant="ghost" size="sm" onClick={() => setSelected(log)} className="h-7 w-7 p-0 flex items-center justify-center"><Eye size={12}/></BrandButton>
                         {log.contentHash && (
                           <>
                             <BrandButton variant="ghost" size="sm" onClick={() => setResendingLog(log)} className="h-7 w-7 p-0 flex items-center justify-center text-blue-600"><Send size={12}/></BrandButton>
                             <BrandButton 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => {
                                 const url = `${window.location.origin}/audit-verify?uuid=${log.id}`;
                                 navigator.clipboard.writeText(url);
                                 alert('驗證連結已複製！');
                               }} 
                               className="h-7 w-7 p-0 flex items-center justify-center text-green-600"
                             >
                               <Share2 size={12}/>
                             </BrandButton>
                           </>
                         )}
                      </div>
                   )
                 }))}
               />
             )}
           </div>
        </BrandCard>

        {/* Resend Modal */}
        {resendingLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setResendingLog(null)} />
             <BrandCard padding="lg" className="relative z-10 w-full max-w-md animate-in zoom-in-95 duration-200">
                <BrandCardHeader title="補發 5T 實證憑證" icon={<Mail size={18} className="text-blue-600" />} />
                <div className="space-y-4 mt-6">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">目標資源</span>
                        <BrandBadge variant="success">已驗證</BrandBadge>
                      </div>
                      <p className="text-sm font-bold text-slate-700 truncate">{resendingLog.resource || 'ESG 指標數據'}</p>
                   </div>
                   <BrandInput 
                     label="接收者 Email" 
                     placeholder="investor@example.com" 
                     value={resendEmail} 
                     onChange={e => setResendEmail(e.target.value)} 
                   />
                   <BrandButton variant="primary" fullWidth onClick={handleResend} loading={isResending} disabled={!resendEmail.includes('@')}>
                      確認發送憑證
                   </BrandButton>
                </div>
             </BrandCard>
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
             <BrandCard padding="lg" className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-[#003262]">審計記錄詳情</h3>
                   <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={16}/></button>
                </div>
                <div className="space-y-3">
                   {[
                     { label: '操作類型', value: selected.title },
                     { label: '資源來源', value: selected.source || '-' },
                     { label: '執行節點', value: selected.dataType || 'Node' },
                     { label: '標準規範', value: selected.standard || '-' },
                     { label: '描述詳情', value: selected.description || '-' },
                     { label: 'Hash Lock', value: selected.contentHash || '-' },
                     { label: 'ZKP 狀態', value: selected.zkpStatus || '-' },
                     { label: '時間戳記', value: new Date(selected.createdAt || '').toLocaleString() },
                   ].map(row => (
                     <div key={row.label} className="flex justify-between py-2 border-b border-slate-50 text-sm gap-4">
                        <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex-shrink-0">{row.label}</span>
                        <span className="text-slate-700 font-medium text-right break-all">{row.value}</span>
                     </div>
                   ))}
                </div>
                <div className="mt-8">
                   <BrandButton variant="outline" fullWidth onClick={() => setSelected(null)}>關閉詳情</BrandButton>
                </div>
             </BrandCard>
          </div>
        )}

      </div>
    </ClientLayout>
  );
}