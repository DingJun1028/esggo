'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import {
  Fingerprint,
  ShieldAlert,
  Link as LinkIcon,
  Database,
  CheckCircle2,
  History,
  Loader2,
  Search,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AuditCenterPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function fetchLogs() {
      try {
        const { data, error } = await supabase
          .from('esg_atoms')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching audit logs:', error);
          if (isMounted) setLoading(false);
          return;
        }

        if (data && isMounted) {
          const formattedLogs = data.map((atom: any) => {
            const evidence =
              typeof atom.evidence === 'string' ? JSON.parse(atom.evidence) : atom.evidence || {};
            return {
              id: atom.uuid,
              action: evidence.action || 'System Audit',
              entity: evidence.targetId || evidence.domain || 'System Matrix',
              user: evidence.userId || 'OmniCore System',
              time: atom.created_at,
              status: atom.status,
              hash: atom.hash_lock
                ? `${atom.hash_lock.substring(0, 10)}...${atom.hash_lock.substring(
                    atom.hash_lock.length - 4
                  )}`
                : 'N/A',
              fullHash: atom.hash_lock,
            };
          });
          setLogs(formattedLogs);
        }
      } catch (err) {
        console.error('Unexpected error fetching audit logs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLogs();

    // Setup realtime subscription
    const channel = supabase
      .channel('schema-db-changes-esg-atoms')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'esg_atoms' },
        (payload) => {
          if (isMounted) {
            const atom = payload.new as any;
            const evidence =
              typeof atom.evidence === 'string' ? JSON.parse(atom.evidence) : atom.evidence || {};
            const newLog = {
              id: atom.uuid,
              action: evidence.action || 'System Audit',
              entity: evidence.targetId || evidence.domain || 'System Matrix',
              user: evidence.userId || 'OmniCore System',
              time: atom.created_at,
              status: atom.status,
              hash: atom.hash_lock
                ? `${atom.hash_lock.substring(0, 10)}...${atom.hash_lock.substring(
                    atom.hash_lock.length - 4
                  )}`
                : 'N/A',
              fullHash: atom.hash_lock,
            };
            setLogs((prev) => [newLog, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
              <Fingerprint className="text-purple-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge
                  variant="default"
                  size="sm"
                  icon={<ShieldAlert size={12} />}
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                >
                  5T-Verified
                </OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  AUDIT-001
                </span>
                {loading && <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                稽核與信任中心 (Audit Center)
              </h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">
                Cryptographic Hash Locks & Immutable Ledger
              </p>
            </div>
          </div>
        </header>

        {/* 5T Protocol Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <OmniBaseCard
              variant="glass"
              className="p-6 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent"
            >
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Database size={18} className="text-purple-400" /> 5T Integrity Protocol
              </h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Traceable
                  </span>{' '}
                  <span className="font-mono text-xs text-slate-500">100%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Trackable
                  </span>{' '}
                  <span className="font-mono text-xs text-slate-500">100%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Transparent
                  </span>{' '}
                  <span className="font-mono text-xs text-slate-500">100%</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Tangible
                  </span>{' '}
                  <span className="font-mono text-xs text-slate-500">100%</span>
                </li>
                <li className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="flex items-center gap-2 font-bold text-purple-400">
                    <Fingerprint size={16} /> Trustworthy
                  </span>{' '}
                  <span className="font-mono text-xs text-purple-400">Locked</span>
                </li>
              </ul>
            </OmniBaseCard>
          </div>

          {/* Audit Log Table */}
          <div className="lg:col-span-2">
            <OmniBaseCard variant="glass" className="overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <History size={18} className="text-slate-400" /> 不可篡改日誌 (Immutable Ledger)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">Live DB Sync</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-slate-400 font-mono text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Entity</th>
                      <th className="px-6 py-4">Hash Lock</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.length > 0
                      ? logs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                              {new Date(log.time).toLocaleString('zh-TW', { hour12: false })}
                            </td>
                            <td className="px-6 py-4 text-slate-300 font-medium">{log.action}</td>
                            <td className="px-6 py-4 text-slate-400">{log.entity}</td>
                            <td
                              className="px-6 py-4 font-mono text-xs text-purple-400/80 flex items-center gap-1"
                              title={log.fullHash}
                            >
                              <LinkIcon size={12} /> {log.hash}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <OmniBadge
                                variant="outline"
                                size="sm"
                                className={
                                  log.status === 'Trustworthy'
                                    ? 'border-emerald-500/30 text-emerald-400'
                                    : 'border-amber-500/30 text-amber-400'
                                }
                              >
                                {log.status}
                              </OmniBadge>
                            </td>
                          </tr>
                        ))
                      : !loading && (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                              <Search size={32} className="mx-auto mb-4 opacity-30" />
                              <p>目前尚無稽核紀錄</p>
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>
            </OmniBaseCard>
          </div>
        </div>
      </div>
    </div>
  );
}
