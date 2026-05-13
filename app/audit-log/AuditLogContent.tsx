'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Search, 
  ShieldCheck, 
  Database,
  RefreshCcw,
  Clock
} from 'lucide-react';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export default function AuditLogContent() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await db.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
              <ClipboardList size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">5T \u5be6\u8b49\u5be9\u8a08\u65e5\u8a8c</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">\u5df2\u9023\u7d50 Supabase Cloud | \u4e0d\u53ef\u7be1\u6539\u7684 ESG \u6578\u64da\u93c8\u7d50\u8ecc\u8de1</p>
        </div>
        <button 
          onClick={() => { setLoading(true); window.location.reload(); }}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center space-y-4">
             <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Ledger...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">\u4ea4\u6613 ID / \u6642\u9593</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">\u6a21\u7d44 / \u52d5\u4f5c</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">\u57f7\u884c\u8005</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">\u8b49\u64da\u96dc\u6e4a (SHA-256)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">\u72c0\u614b</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 text-xs tracking-tighter">{log.txn_id}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Database size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{log.action}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{log.module}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600">{log.actor}</td>
                    <td className="px-8 py-6">
                      <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono group-hover:text-emerald-600 transition-colors">{log.data_hash}</code>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[9px] font-black px-3 py-1.5 rounded-lg border bg-emerald-100 text-emerald-700 border-emerald-200">{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}