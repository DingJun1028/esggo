'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { ClipboardList, FolderOpen, FileText, Upload, CheckCircle2, AlertCircle, Clock, Search, Filter, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const CHECKLIST = [
  { id: 'DOC-001', category: 'Environmental', name: '2025 全年度台電電費單據', status: 'ready', type: 'PDF', size: '12.4 MB', updated: '2026-05-20' },
  { id: 'DOC-002', category: 'Environmental', name: '廢棄物處理委託合約', status: 'missing', type: '-', size: '-', updated: '-' },
  { id: 'DOC-003', category: 'Social', name: '員工滿意度調查原始數據', status: 'pending', type: 'XLSX', size: '2.1 MB', updated: '2026-05-25' },
  { id: 'DOC-004', category: 'Social', name: '勞工健康檢查報告總表', status: 'ready', type: 'PDF', size: '5.8 MB', updated: '2026-05-18' },
  { id: 'DOC-005', category: 'Governance', name: '董事會議事錄 (ESG 專項)', status: 'ready', type: 'PDF', size: '1.2 MB', updated: '2026-05-10' },
  { id: 'DOC-006', category: 'Governance', name: '反貪腐政策簽署清單', status: 'missing', type: '-', size: '-', updated: '-' },
];

export default function DocumentChecklistPage() {
  const [filter, setFilter] = useState('All');

  const filteredDocs = filter === 'All' ? CHECKLIST : CHECKLIST.filter(d => d.category === filter);

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              旅程 II. 策略盤點與分派
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <ClipboardList className="text-cyan-core" /> 文件清單 Checklist
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              確信不缺件。管理 ESG 報告所需的原始佐證文件，並自動勾稽至 Evidence Vault 證據金庫。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
              <Upload size={16} /> 批量上傳
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              <CheckCircle2 size={16} /> 啟動預審
            </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 p-2 rounded-2xl border border-white/10">
              {['All', 'Environmental', 'Social', 'Governance'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    filter === cat ? 'bg-cyan-core text-void-stark shadow-lg' : 'text-white/50 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FolderOpen size={16} /> {cat}
                  </span>
                  <span className={`text-[10px] font-mono ${filter === cat ? 'text-void-stark/60' : 'text-white/20'}`}>
                    {cat === 'All' ? CHECKLIST.length : CHECKLIST.filter(d => d.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
            
            <UniversalCard title="憑證收集進度" variant="bordered">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                  <span>總體達成率</span>
                  <span className="text-cyan-400">66%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-core" style={{ width: '66%' }} />
                </div>
                <p className="text-[10px] text-white/30 text-center italic">尚有 2 份必要文件缺失</p>
              </div>
            </UniversalCard>
          </div>

          {/* Document List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden backdrop-blur-xl">
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                  <input type="text" placeholder="搜尋文件..." className="w-full pl-9 pr-4 py-1.5 bg-black/20 border border-white/10 rounded-lg text-xs outline-none focus:border-cyan-500/50" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-white/40 hover:text-white transition-colors"><Filter size={16} /></button>
                  <button className="p-2 text-white/40 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">狀態</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">文件名 / 憑證描述</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">類型</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">大小</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">更新日期</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="group hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          {doc.status === 'ready' ? <CheckCircle2 className="text-emerald-400" size={18} /> :
                           doc.status === 'pending' ? <Clock className="text-cyan-400 animate-pulse" size={18} /> :
                           <AlertCircle className="text-rose-400" size={18} />}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-white/20" />
                            <div>
                              <p className="text-sm font-bold text-white/90 group-hover:text-cyan-400 transition-colors">{doc.name}</p>
                              <p className="text-[10px] font-mono text-white/30">{doc.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-white/40">{doc.type}</td>
                        <td className="px-6 py-4 text-xs font-mono text-white/40">{doc.size}</td>
                        <td className="px-6 py-4 text-xs font-mono text-white/40">{doc.updated}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/20 hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100">
                            {doc.status === 'ready' ? '檢視' : '上傳'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-cyan-core/5 rounded-[2rem] border border-cyan-500/20">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-core/10 rounded-xl text-cyan-core">
                     <AlertCircle size={20} />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm">缺失憑證提醒</h4>
                     <p className="text-xs text-white/50">「廢棄物處理委託合約」為 GRI 306 必要憑證，請儘速補件以利 AI 撰寫。</p>
                  </div>
               </div>
               <UniversalButton variant="primary" size="sm">立即處理</UniversalButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
