"use client";

import React, { useEffect, useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { getSupabaseClient } from '@/lib/supabase';

export default function AuditLogPage() {
  const [records, setRecords] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) throw new Error("Supabase client not initialized");
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setRecords(data || []);
      } catch (err: any) {
        console.error("Failed to fetch audit records:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-void-stark text-white p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-4">
          <UniversalBadge variant="success" icon="✨">
            ESG GO 模組
          </UniversalBadge>
          <h1 className="text-4xl font-bold tracking-tight text-white/90">
            審計日誌 Audit Log
          </h1>
          <p className="text-lg text-white/60 max-w-3xl">
            審計日誌頁是平台的治理稽核核心，記錄每一次資料、封印、驗證與操作事件。在此可以檢視透過 ZKP 零知識證明與 Hash 鎖定的不可篡改軌跡。
          </p>
        </header>

        <UniversalCard
          title="系統稽核軌跡 (Immutable Trail)"
          variant="glow"
          className="flex flex-col gap-4"
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-core"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-white/40 italic">
              尚無稽核紀錄，請至「數據治理樞紐」存入驗證證明。
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/60">
                    <th className="py-3 px-4 font-medium">時間</th>
                    <th className="py-3 px-4 font-medium">操作事件</th>
                    <th className="py-3 px-4 font-medium">證明狀態</th>
                    <th className="py-3 px-4 font-medium">資料 Hash 鎖定 (Content Hash)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record: any) => (
                    <tr key={record.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-white/90 font-medium">{record.action}</span>
                          <span className="text-white/50 text-xs">
                            {record.resource} | {record.user_name || 'System'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <UniversalBadge 
                          variant={record.hash_lock ? 'success' : 'warning'} 
                          icon={record.hash_lock ? '✓' : '⟳'}
                        >
                          {record.hash_lock ? 'Verified' : 'Pending'}
                        </UniversalBadge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs text-cyan-core/80 break-all bg-black/20 p-2 rounded">
                          {record.hash_lock || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </UniversalCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <UniversalCard
            title="功能定位"
            variant="default"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 5T 協定中 Trustworthy (信) 的核心實作</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-core" /> 確保敏感資訊在不揭露原始數值下完成驗證</li>
            </ul>
          </UniversalCard>
          <UniversalCard
            title="安全規格"
            variant="bordered"
            className="flex flex-col gap-4"
          >
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-soul" /> SHA-256 密碼學哈希錨定</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-soul" /> Secp256k1 橢圓曲線簽章驗證</li>
            </ul>
          </UniversalCard>
        </div>
      </div>
    </div>
  );
}
