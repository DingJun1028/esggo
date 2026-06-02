'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Server, Database, Key, ShieldCheck, Link as LinkIcon, Activity } from 'lucide-react';

interface TableDef {
  name: string;
  description: string;
  columns: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean; desc: string }[];
}

const DATABASE_SCHEMA: TableDef[] = [
  {
    name: 'omni_users',
    description: '使用者與組織關聯核心表 (Supabase Auth 擴充)',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, desc: '對應 auth.users.id' },
      { name: 'org_id', type: 'uuid', isForeign: true, desc: '所屬組織 ID' },
      { name: 'role', type: 'text', desc: '權限角色 (admin, auditor, user)' },
      { name: 'created_at', type: 'timestamp', desc: '建立時間' },
    ]
  },
  {
    name: 'esg_records',
    description: 'ESG 指標紀錄 (環境、社會、治理數據)',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, desc: '紀錄唯一碼' },
      { name: 'org_id', type: 'uuid', isForeign: true, desc: '所屬組織 ID' },
      { name: 'category', type: 'text', desc: '分類 (E, S, G)' },
      { name: 'metric_value', type: 'jsonb', desc: '彈性指標數值 (Data)' },
      { name: 'zkp_hash', type: 'text', desc: 'ZKP 零知識證明封印 Hash' },
      { name: 'timestamp', type: 'timestamp', desc: '紀錄發布時間' },
    ]
  },
  {
    name: 'audit_logs',
    description: '5T 協議不可篡改稽核日誌 (Immutable Ledger)',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, desc: '日誌唯一碼' },
      { name: 'record_id', type: 'uuid', isForeign: true, desc: '關聯 ESG 紀錄' },
      { name: 'action', type: 'text', desc: '動作 (INSERT, SEAL, VERIFY)' },
      { name: 'actor_id', type: 'uuid', desc: '執行者 ID' },
      { name: 'hash_signature', type: 'text', desc: '區塊鏈級別雜湊簽章' },
      { name: 'created_at', type: 'timestamp', desc: '稽核時間' },
    ]
  },
  {
    name: 'omni_memory_shards',
    description: 'OmniAgent 記憶碎片 (AI 系統自我進化用)',
    columns: [
      { name: 'id', type: 'uuid', isPrimary: true, desc: '碎片唯一碼' },
      { name: 'title', type: 'text', desc: '碎片標題' },
      { name: 'description', type: 'text', desc: '詳細內容' },
      { name: 'tags', type: 'text[]', desc: '特徵標籤' },
      { name: 'timestamp', type: 'timestamp', desc: '萃取時間' },
    ]
  }
];

export default function OmniERDPage() {
  const [activeTable, setActiveTable] = useState<string>(DATABASE_SCHEMA[0].name);

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
              <Server className="text-emerald-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="success" size="sm" icon={<Database size={12}/>}>NCBDB Core</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">ERD-001</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">NCBDB 實體模型 (ERD)</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Entity Relationship & 5T Schema</p>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Table List (Sidebar) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">資料庫結構 (Database Schema)</h3>
            <div className="flex flex-col gap-3">
              {DATABASE_SCHEMA.map(table => {
                const isActive = activeTable === table.name;
                return (
                  <button
                    key={table.name}
                    onClick={() => setActiveTable(table.name)}
                    className={`flex flex-col gap-1 p-4 rounded-xl transition-all duration-300 border text-left ${
                      isActive 
                        ? 'bg-emerald-900/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                        : 'bg-black/20 border-white/5 hover:border-emerald-500/20 hover:bg-emerald-950/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-mono font-bold ${isActive ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {table.name}
                      </span>
                      <Database size={14} className={isActive ? 'text-emerald-400' : 'text-slate-600'} />
                    </div>
                    <span className="text-xs text-slate-500 truncate">{table.description}</span>
                  </button>
                );
              })}
            </div>
            
            <UniversalCard variant="glass" className="p-4 mt-8 border-cyan-500/20 bg-cyan-950/10">
              <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2 mb-2">
                <ShieldCheck size={16} /> Row Level Security
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                所有資料表皆已啟用 RLS。資料存取必須夾帶 JWT Token，並且依照 `org_id` 進行嚴格的租戶隔離 (Tenant Isolation)。
              </p>
            </UniversalCard>
          </div>

          {/* Table Details & Columns (Main) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {DATABASE_SCHEMA.map(table => (
                table.name === activeTable && (
                  <motion.div
                    key={table.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <UniversalCard variant="glass" className="p-6 h-full border-emerald-500/20 flex flex-col">
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                        <div>
                          <h2 className="text-2xl font-bold font-mono text-emerald-100 flex items-center gap-3">
                            <Database className="text-emerald-500" size={24} />
                            {table.name}
                          </h2>
                          <p className="text-slate-400 mt-2">{table.description}</p>
                        </div>
                        <UniversalBadge variant="success" size="sm">Active</UniversalBadge>
                      </div>

                      <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
                              <th className="pb-3 pl-2 font-bold">欄位 (Column)</th>
                              <th className="pb-3 font-bold">型別 (Type)</th>
                              <th className="pb-3 font-bold">屬性 (Attributes)</th>
                              <th className="pb-3 pr-2 font-bold">說明 (Description)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns.map((col, idx) => (
                              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="py-4 pl-2">
                                  <span className="font-mono text-sm text-emerald-300 font-semibold">{col.name}</span>
                                </td>
                                <td className="py-4">
                                  <span className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300 border border-slate-700">
                                    {col.type}
                                  </span>
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-2">
                                    {col.isPrimary && (
                                      <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                        <Key size={12} /> PK
                                      </div>
                                    )}
                                    {col.isForeign && (
                                      <div className="flex items-center gap-1 text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                                        <LinkIcon size={12} /> FK
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 pr-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                  {col.desc}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Activity size={14} className="text-emerald-500" />
                          5T Protocol Verified Table
                        </div>
                      </div>
                    </UniversalCard>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
