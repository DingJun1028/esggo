'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '../ClientLayout';
import { 
  Shield, Eye, X, Search, Send, Mail, Hash, RefreshCw, 
  CheckCircle, AlertTriangle, Share2, Database, Activity, Lock
} from 'lucide-react';
import { dcListAuditRecords } from '../../lib/dataconnect-services';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  BrandTable, StandardPage 
} from '../../components/brand';
import { fadeIn, slideIn } from '../../lib/animations';
import { cn } from '../../lib/utils';

const ACTION_COLORS: Record<string, string> = {
  'ZKP_SEAL': '#8B5CF6', // Purple
  'VAULT_OMNI_ENGRAVE': '#003262', // Berkeley Blue
  'AGENT_EXECUTE': '#FDB515', // California Gold
  'SAVE_DRAFT': '#10B981', // Verified Green
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

  const pageConfig: any = {
    id: 'audit-log',
    title: '審計稽核日誌 Audit Log',
    subtitle: 'T5 Trackable · 5T 協議執行軌跡 · 不可篡改審計鏈',
    icon: <Shield size={24} />,
    griReference: 'GRI 102-56',
    activeT5Tags: ['T1', 'T4', 'T5'],
    primaryActions: [
      { id: 'refresh', label: '刷新日誌', icon: <RefreshCw size={14} className={loading ? 'animate-spin' : ''}/>, onClick: loadLogs }
    ],
    kpis: [
      { key: 'today', label: '今日事件', value: logs.length, icon: <Activity size={18}/>, color: '#003262' },
      { key: 'seal', label: '5T 封印項', value: logs.filter(l => l.contentHash).length, icon: <Hash size={18}/>, color: '#8B5CF6', verified: true },
      { key: 'agent', label: 'Agent 調度', value: logs.filter(l => l.title?.includes('AGENT')).length, icon: <Database size={18}/>, color: '#FDB515' },
      { key: 'secure', label: '數據誠信度', value: '100%', unit: 'SECURE', icon: <CheckCircle size={18}/>, color: '#10B981', verified: true },
    ],
    sections: [
      {
        id: 'main',
        title: '實時審計流',
        subtitle: 'PostgreSQL Powered · Immutable Audit Chain',
        columns: 12,
        actions: [
          { id: 'filter', icon: <Search size={14} /> }
        ],
        component: (
          <div className="space-y-6">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                className="w-full bg-slate-50/50 border border-slate-200/60 rounded-[20px] pl-11 pr-4 py-3 text-sm focus:border-[#003262] focus:bg-white outline-none transition-all shadow-inner"
                placeholder="搜尋日誌摘要、Hash Lock 或資源來源..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm overflow-hidden min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                   <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-[#003262]/10 border-t-[#003262] animate-spin" />
                      <Shield size={24} className="absolute inset-0 m-auto text-[#003262] animate-pulse" />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing with Audit Chain...</p>
                </div>
              ) : (
                <BrandTable 
                  columns={[
                    { key: 'action', label: '操作類型' },
                    { key: 'resource', label: '資源來源' },
                    { key: 'node', label: '執行節點' },
                    { key: 'standard', label: '規範' },
                    { key: 'hash', label: 'Hash Lock' },
                    { key: 'time', label: '時間' },
                    { key: 'ops', label: '操作' },
                  ]}
                  data={filtered.map(log => ({
                    action: (
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: ACTION_COLORS[log.title!] || '#cbd5e1', color: ACTION_COLORS[log.title!] || '#cbd5e1' }} />
                          <span className="font-bold text-[#003262] text-xs tracking-tight">{log.title}</span>
                       </div>
                    ),
                    resource: <span className="text-xs text-slate-500 font-bold">{log.source || '-'}</span>,
                    node: (
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase border border-slate-200/50 shadow-inner">
                             {log.dataType?.charAt(0) || 'N'}
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{log.dataType || 'Node'}</span>
                       </div>
                    ),
                    standard: <Badge variant="draft" className="bg-[#FDB515]/5 text-[#003262] border-[#FDB515]/10 font-mono text-[9px]">{log.standard || '5T_SYNC'}</Badge>,
                    hash: log.contentHash ? (
                      <div className="flex items-center gap-1.5 group/hash">
                        <Lock size={10} className="text-[#009E9D]/40"/>
                        <code className="text-[10px] text-[#009E9D] bg-[#009E9D]/5 px-2 py-0.5 rounded font-mono border border-[#009E9D]/10">
                          {log.contentHash.slice(0, 10)}
                        </code>
                      </div>
                    ) : <span className="text-[10px] text-slate-300">-</span>,
                    time: <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(log.createdAt || '').toLocaleTimeString()}</span>,
                    ops: (
                       <div className="flex gap-2">
                          <Button variant="glass" size="sm" onClick={() => setSelected(log)} className="h-8 w-8 p-0 rounded-lg"><Eye size={14}/></Button>
                          {log.contentHash && (
                            <>
                              <Button variant="glass" size="sm" onClick={() => setResendingLog(log)} className="h-8 w-8 p-0 rounded-lg text-blue-600"><Send size={14}/></Button>
                              <Button 
                                variant="glass" 
                                size="sm" 
                                onClick={() => {
                                  const url = `${window.location.origin}/audit-verify?uuid=${log.id}`;
                                  navigator.clipboard.writeText(url);
                                  alert('驗證連結已複製！');
                                }} 
                                className="h-8 w-8 p-0 rounded-lg text-emerald-600"
                              >
                                <Share2 size={14}/>
                              </Button>
                            </>
                          )}
                       </div>
                    )
                  }))}
                />
              )}
            </div>
          </div>
        )
      }
    ]
  };

  return (
    <ClientLayout>
      <StandardPage config={pageConfig} />

      {/* Resend Modal */}
      <AnimatePresence>
        {resendingLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#003262]/40 backdrop-blur-xl" onClick={() => setResendingLog(null)} />
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-md"
             >
               <Card className="p-10 bg-white/90 backdrop-blur-2xl rounded-[40px] border border-white shadow-2xl">
                  <header className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#003262]">補發 5T 實證憑證</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resend Integrity Proof</p>
                    </div>
                  </header>

                  <div className="space-y-6">
                     <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/60 shadow-inner">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">目標資源 Resource</span>
                          <Badge variant="verified">SECURED</Badge>
                        </div>
                        <p className="text-sm font-bold text-slate-700 truncate">{resendingLog.source || 'ESG 指標數據'}</p>
                        <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center gap-2">
                           <Hash size={10} className="text-slate-300"/>
                           <code className="text-[9px] text-slate-400 font-mono truncate">{resendingLog.contentHash}</code>
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">接收者 Email Address</label>
                        <input 
                          className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:border-blue-600 outline-none transition-all shadow-sm"
                          placeholder="investor@example.com"
                          value={resendEmail} 
                          onChange={e => setResendEmail(e.target.value)}
                        />
                     </div>

                     <Button variant="primary" size="lg" className="w-full rounded-2xl h-16 font-bold shadow-xl shadow-blue-500/20" onClick={handleResend} isLoading={isResending} disabled={!resendEmail.includes('@')}>
                         確認並發送 5T 憑證
                     </Button>
                     <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-[10px]" onClick={() => setResendingLog(null)}>
                         取消操作
                     </Button>
                  </div>
               </Card>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#003262]/40 backdrop-blur-xl" onClick={() => setSelected(null)} />
             <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg"
             >
               <Card className="bg-white/90 backdrop-blur-2xl rounded-[48px] border border-white shadow-2xl p-12 max-h-[90vh] overflow-y-auto">
                  <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#003262]/5 text-[#003262] flex items-center justify-center">
                        <Activity size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-[#003262] tracking-tight">審計記錄詳情</h3>
                    </div>
                    <Button variant="glass" size="sm" className="w-10 h-10 p-0 rounded-full" onClick={() => setSelected(null)}><X size={20}/></Button>
                  </header>

                  <div className="space-y-4">
                     {[
                       { label: '操作類型 Action', value: selected.title, highlight: true },
                       { label: '資源來源 Source', value: selected.source || '-' },
                       { label: '執行節點 Node', value: selected.dataType || 'Node' },
                       { label: '標準規範 Standard', value: selected.standard || '-' },
                       { label: '描述詳情 Detail', value: selected.description || '-' },
                       { label: 'Hash Lock', value: selected.contentHash || '-', mono: true },
                       { label: 'ZKP 狀態 Proof', value: selected.zkpStatus || '-', badge: true },
                       { label: '時間戳記 Timestamp', value: new Date(selected.createdAt || '').toLocaleString() },
                     ].map(row => (
                       <div key={row.label} className="p-4 bg-slate-50/50 border border-slate-100/60 rounded-2xl flex flex-col gap-1.5 shadow-sm">
                          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{row.label}</span>
                          {row.badge ? (
                            <div className="pt-1"><Badge variant="verified">{row.value}</Badge></div>
                          ) : row.mono ? (
                            <code className="text-[11px] text-[#009E9D] font-mono break-all leading-relaxed bg-[#009E9D]/5 p-2 rounded-lg border border-[#009E9D]/10">{row.value}</code>
                          ) : (
                            <span className={cn("text-slate-700 font-bold text-sm leading-relaxed", row.highlight && "text-[#003262] text-base")}>{row.value}</span>
                          )}
                       </div>
                     ))}
                  </div>
                  
                  <footer className="mt-10">
                     <Button variant="primary" fullWidth size="lg" className="rounded-2xl h-16 font-bold shadow-xl" onClick={() => setSelected(null)}>
                      返回審計控制台
                     </Button>
                  </footer>
               </Card>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </ClientLayout>
  );
}
