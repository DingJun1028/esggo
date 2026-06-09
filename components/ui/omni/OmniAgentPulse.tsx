import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Brain, Activity, Database, CheckCircle2, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface PulseTask {
  id: string;
  type: 'etl_sync' | 'memory_extraction' | 'zkp_seal';
  status: 'pending' | 'active' | 'completed' | 'failed';
  message: string;
}

export function OmniAgentPulse() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState<PulseTask[]>([
    { id: '1', type: 'etl_sync', status: 'completed', message: '外部 ERP 數據同步完成' },
    { id: '2', type: 'zkp_seal', status: 'completed', message: '5T 協議 Hash 刻印成功' },
    { id: '3', type: 'memory_extraction', status: 'active', message: '萃取 ESG 永續記憶碎片中...' },
  ]);
  const dragControls = useDragControls();

  // Simulate incoming tasks
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prev => {
        const newTasks = [...prev];
        const activeTaskIndex = newTasks.findIndex(t => t.status === 'active');
        if (activeTaskIndex !== -1) {
          newTasks[activeTaskIndex].status = 'completed';
          newTasks[activeTaskIndex].message = newTasks[activeTaskIndex].message.replace('中...', '完成');
        } else {
          // add a new random task
          const types: PulseTask['type'][] = ['etl_sync', 'memory_extraction', 'zkp_seal'];
          const newType = types[Math.floor(Math.random() * types.length)];
          const msgMap = {
            etl_sync: '自動抓取最新碳排指標中...',
            memory_extraction: '合成「碳排減量奧義」碎片中...',
            zkp_seal: '為新紀錄執行防篡改封印中...'
          };
          
          newTasks.unshift({
            id: Date.now().toString(),
            type: newType,
            status: 'active',
            message: msgMap[newType]
          });
          
          if (newTasks.length > 5) newTasks.pop();
        }
        return newTasks;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getIcon = (type: PulseTask['type']) => {
    switch (type) {
      case 'etl_sync': return <Database size={14} className="text-blue-400" />;
      case 'zkp_seal': return <CheckCircle2 size={14} className="text-emerald-400" />;
      case 'memory_extraction': return <Brain size={14} className="text-purple-400" />;
    }
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.1}
      className={cn(
        "fixed z-50 bottom-6 right-6 flex flex-col items-end gap-2",
        "font-sans selection:bg-cyan-500/30"
      )}
    >
      {/* 展開面板 */}
      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-72 bg-void-stark/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Activity size={16} className="animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Agent Pulse</span>
            </div>
            <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-white transition-colors">
              <Minimize2 size={14} />
            </button>
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-500/30 [&::-webkit-scrollbar-thumb]:rounded-full">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 text-sm">
                <div className={cn(
                  "mt-0.5 shrink-0 rounded-full p-1",
                  task.status === 'active' ? "bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.5)] animate-pulse" : "bg-white/5"
                )}>
                  {getIcon(task.type)}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-xs font-medium leading-relaxed",
                    task.status === 'active' ? "text-cyan-100" : "text-slate-400"
                  )}>
                    {task.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 懸浮按鈕 (Drag Handle) */}
      <motion.div
        onPointerDown={(e) => dragControls.start(e)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing",
          "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md",
          "border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
          "relative group overflow-hidden"
        )}
      >
        <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Brain className="text-cyan-400 relative z-10" size={24} />
        
        {/* Status Indicator Dot */}
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
      </motion.div>
    </motion.div>
  );
}
