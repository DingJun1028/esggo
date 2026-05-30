'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { ListChecks, Plus, Filter, Search, MoreVertical, Calendar, Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const COLUMNS = [
  { id: 'todo', name: '待處理 To Do', color: 'border-white/20' },
  { id: 'in-progress', name: '執行中 In Progress', color: 'border-cyan-500/50' },
  { id: 'review', name: '審核中 Review', color: 'border-amber-500/50' },
  { id: 'done', name: '已完成 Done', color: 'border-emerald-500/50' },
];

const MOCK_TASKS = [
  { id: 'T-101', title: '收集 2025 年 Q4 電費單據', status: 'done', priority: 'High', owner: 'Alice', deadline: '2026-05-15' },
  { id: 'T-102', title: '編寫環境章節：能源消耗分析', status: 'in-progress', priority: 'Medium', owner: 'Bob', deadline: '2026-06-01' },
  { id: 'T-103', title: '供應鏈人權風險問卷回收', status: 'todo', priority: 'High', owner: 'Charlie', deadline: '2026-06-10' },
  { id: 'T-104', title: '董事會 ESG 培訓計畫報呈', status: 'review', priority: 'Low', owner: 'Alice', deadline: '2026-05-28' },
  { id: 'T-105', title: '更新 5T 誠信感測器配置', status: 'in-progress', priority: 'Extreme', owner: 'OmniAgent', deadline: '2026-05-31' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              旅程 II. 策略盤點與分派
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <ListChecks className="text-cyan-core" /> 任務中心 Tasks
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              跨部門協作中樞。分配任務、設定截止日期，並透過 5T 協議追蹤執行誠信。
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input type="text" placeholder="搜尋任務..." className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm outline-none focus:border-cyan-500/50" />
            </div>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              <Plus size={16} /> 建立任務
            </UniversalButton>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col gap-4">
              <div className={`p-4 bg-white/5 rounded-2xl border-b-2 ${col.color} flex justify-between items-center`}>
                <h3 className="font-black text-xs uppercase tracking-widest text-white/70">{col.name}</h3>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-white/40">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>

              <div className="space-y-4 min-h-[500px]">
                {tasks.filter(t => t.status === col.id).map((task) => (
                  <motion.div
                    layoutId={task.id}
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group"
                  >
                    <UniversalCard variant="bordered" className="p-4 hover:border-cyan-500/30 transition-all cursor-grab active:cursor-grabbing">
                      <div className="flex justify-between items-start mb-3">
                        <UniversalBadge variant={
                          task.priority === 'Extreme' ? 'error' :
                          task.priority === 'High' ? 'warning' :
                          'secondary'
                        } className="text-[9px]">
                          {task.priority}
                        </UniversalBadge>
                        <button className="text-white/20 hover:text-white transition-colors"><MoreVertical size={14} /></button>
                      </div>
                      
                      <h4 className="font-bold text-sm text-white/90 mb-4 group-hover:text-cyan-400 transition-colors">
                        {task.title}
                      </h4>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cyan-core/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-black text-cyan-400">
                            {task.owner[0]}
                          </div>
                          <span className="text-[10px] text-white/40 font-bold uppercase">{task.owner}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
                          <Clock size={10} /> {task.deadline}
                        </div>
                      </div>
                    </UniversalCard>
                  </motion.div>
                ))}
                
                <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/20 text-xs font-bold hover:border-cyan-500/30 hover:text-cyan-400/50 transition-all flex items-center justify-center gap-2 group">
                  <Plus size={14} /> 快速新增
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Task Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center gap-4">
            <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-400/60 tracking-widest">本週進度</p>
              <h4 className="text-xl font-bold">已完成 8 個項目</h4>
            </div>
          </div>
          
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center gap-4">
            <div className="p-4 bg-rose-500/20 rounded-2xl text-rose-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-rose-400/60 tracking-widest">逾期警報</p>
              <h4 className="text-xl font-bold">2 個項目延遲中</h4>
            </div>
          </div>

          <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-[2rem] flex items-center gap-4">
            <div className="p-4 bg-cyan-500/20 rounded-2xl text-cyan-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-cyan-400/60 tracking-widest">活躍成員</p>
              <h4 className="text-xl font-bold">12 位協作中</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
