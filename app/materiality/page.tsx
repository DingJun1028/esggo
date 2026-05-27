'use client';
import { useState } from 'react';
import { Grid, List, Plus, Save, Bot, Sparkles, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { fadeIn, staggerContainer, slideIn } from '@/lib/animations';
import { motion, AnimatePresence } from 'framer-motion';

const initialTopics = [
  { id: 1, name: '溫室氣體排放', category: 'E', gri: 'GRI 305', impact: 4.5, concern: 4.8, status: 'critical' },
  { id: 2, name: '能源管理', category: 'E', gri: 'GRI 302', impact: 4.2, concern: 4.5, status: 'material' },
  { id: 3, name: '水資源管理', category: 'E', gri: 'GRI 303', impact: 3.8, concern: 4.0, status: 'material' },
  { id: 4, name: '廢棄物管理', category: 'E', gri: 'GRI 306', impact: 3.5, concern: 3.8, status: 'watchlist' },
  { id: 5, name: '員工健康安全', category: 'S', gri: 'GRI 403', impact: 4.7, concern: 4.9, status: 'critical' },
  { id: 6, name: '人才培育發展', category: 'S', gri: 'GRI 404', impact: 4.0, concern: 4.2, status: 'material' },
  { id: 7, name: '多元共融政策', category: 'S', gri: 'GRI 405', impact: 3.6, concern: 3.9, status: 'watchlist' },
  { id: 8, name: '供應鏈管理', category: 'S', gri: 'GRI 308', impact: 4.1, concern: 4.3, status: 'material' },
  { id: 9, name: '公司治理結構', category: 'G', gri: 'GRI 2-9', impact: 4.8, concern: 4.7, status: 'critical' },
  { id: 10, name: '反貪腐政策', category: 'G', gri: 'GRI 205', impact: 4.3, concern: 4.4, status: 'material' },
  { id: 11, name: '稅務透明度', category: 'G', gri: 'GRI 207', impact: 3.7, concern: 3.8, status: 'watchlist' },
  { id: 12, name: '資訊安全隱私', category: 'G', gri: 'GRI 418', impact: 4.0, concern: 4.2, status: 'material' },
];

export default function MaterialityPage() {
  const [topics, setTopics] = useState(initialTopics);
  const [viewMode, setViewMode] = useState<'matrix' | 'table'>('matrix');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskOmniAgent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: 'user_001',
          taskType: 'materiality_generation',
          title: '重大性議題 AI 分析與座標校正',
          description: '分析當前 12 個議題的衝擊與關注度，建議座標調整以符合 2026 最新趨勢。',
          skillKey: 'materiality_matrix_generator',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.href = '/omniagent-orchestrator';
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = selectedCategory === 'ALL' ? topics : topics.filter(t => t.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'var(--t4-text)';
      case 'material': return 'var(--aqua-cyan-midtone)';
      case 'watchlist': return 'var(--eternal-gold-midtone)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical': return '核心重大';
      case 'material': return '重大議題';
      case 'watchlist': return '觀察關注';
      default: return status;
    }
  };

  return (
    <motion.div 
      className="page-container space-y-10 lg:space-y-14 pb-24 relative z-10"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative z-10">
        <motion.div variants={fadeIn} className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-bold text-aqua-cyan-midtone tracking-tighter leading-none uppercase">重大性矩陣</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">Materiality Matrix · GRI 3-1/3-2 · 雙重重大性評估</p>
        </motion.div>
        <motion.div variants={fadeIn} className="flex gap-3">
          <Button variant={viewMode === 'matrix' ? 'primary' : 'ghost'} onClick={() => setViewMode('matrix')} className="rounded-xl px-6 h-11 border-border-primary">
            <Grid size={16} className="mr-2" />矩陣圖
          </Button>
          <Button variant={viewMode === 'table' ? 'primary' : 'ghost'} onClick={() => setViewMode('table')} className="rounded-xl px-6 h-11 border-border-primary">
            <List size={16} className="mr-2" />列表
          </Button>
        </motion.div>
      </header>

      <motion.div variants={fadeIn} className="flex gap-3 flex-wrap">
        {['ALL', 'E', 'S', 'G'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
              selectedCategory === cat 
                ? "bg-aqua-cyan-midtone text-white border-none shadow-lg shadow-aqua-cyan-midtone/20" 
                : "bg-white/40 backdrop-blur-md border-border-primary text-slate-500 hover:text-aqua-cyan-midtone"
            )}
          >
            {cat === 'ALL' ? '全部' : cat === 'E' ? '環境 (E)' : cat === 'S' ? '社會 (S)' : '治理 (G)'}
          </button>
        ))}
      </motion.div>

      {viewMode === 'matrix' ? (
        <motion.div variants={fadeIn}>
          <Card className="bg-white/60 backdrop-blur-md border-border-primary overflow-hidden shadow-xl">
            <CardHeader className="p-8 border-b border-slate-100/60 flex items-center justify-between bg-white/40">
              <div>
                <CardTitle className="text-xl font-bold text-aqua-cyan-midtone tracking-tight">雙重重大性矩陣</CardTitle>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">X 軸：衝擊重大性 | Y 軸：利害關係人關注度</p>
              </div>
              <Badge variant="verified">Sovereign_Analysis</Badge>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative h-[500px] bg-slate-50/30 border border-border-primary rounded-3xl overflow-hidden shadow-inner">
                <div className="absolute top-[10%] left-[50%] right-0 bottom-0 bg-aqua-cyan/5 rounded-bl-[40px]" />
                <div className="absolute top-8 right-10 text-[10px] font-black text-aqua-cyan-midtone uppercase tracking-[0.3em] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-aqua-cyan/20">核心重大區 Critical Zone</div>
                <div className="absolute bottom-8 left-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">觀察關注區 Watchlist</div>
                <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">利害關係人關注度 Stakeholder Concern →</div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">衝擊重大性 Business Impact →</div>

                {filtered.map(topic => {
                  const x = ((topic.impact - 3) / 2) * 80 + 10;
                  const y = 90 - (((topic.concern - 3) / 2) * 80);
                  return (
                    <motion.div
                      key={topic.id}
                      onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className="absolute cursor-pointer flex items-center justify-center text-white text-[10px] font-black rounded-full shadow-lg border-2 border-white transition-all"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: 32,
                        height: 32,
                        backgroundColor: getStatusColor(topic.status),
                        borderColor: selectedTopic?.id === topic.id ? 'var(--text-primary)' : '#fff',
                        boxShadow: selectedTopic?.id === topic.id ? '0 0 20px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      title={topic.name}
                    >
                      {topic.id}
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {selectedTopic && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-8 p-6 bg-white border rounded-3xl shadow-lg border-l-8"
                    style={{ borderLeftColor: getStatusColor(selectedTopic.status) }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="verified" className="bg-aqua-cyan/10 text-aqua-cyan-midtone border-aqua-cyan/20">{selectedTopic.category}</Badge>
                          <span className="text-xs font-black text-slate-400 font-mono">{selectedTopic.gri}</span>
                          <Badge variant="verified" style={{ backgroundColor: `${getStatusColor(selectedTopic.status)}10`, color: getStatusColor(selectedTopic.status), borderColor: `${getStatusColor(selectedTopic.status)}20` }}>
                            {getStatusLabel(selectedTopic.status)}
                          </Badge>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 tracking-tight">{selectedTopic.name}</h4>
                        <div className="flex gap-8">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Impact Score</p>
                            <p className="text-lg font-black text-aqua-cyan-midtone font-mono">{selectedTopic.impact}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stakeholder Concern</p>
                            <p className="text-lg font-black text-eternal-gold-midtone font-mono">{selectedTopic.concern}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTopic(null)} className="rounded-full w-10 h-10 p-0 text-slate-400">
                        <X size={20} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={fadeIn}>
          <Card className="bg-white/60 backdrop-blur-md border-border-primary overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-white/40 border-b border-slate-100">
                     {['#', '議題名稱', '類別', 'GRI 對應', '衝擊重大性', '利害關係人關注度', '狀態'].map((h, i) => (
                       <th key={i} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {filtered.map(topic => (
                     <tr key={topic.id} className="hover:bg-white/40 transition-colors group">
                       <td className="px-8 py-5 text-xs font-mono font-black text-slate-300">{topic.id}</td>
                       <td className="px-8 py-5 font-bold text-slate-700">{topic.name}</td>
                       <td className="px-8 py-5">
                         <Badge variant="verified" className="bg-aqua-cyan/5 text-aqua-cyan-midtone border-aqua-cyan/10">{topic.category}</Badge>
                       </td>
                       <td className="px-8 py-5 text-xs font-black text-aqua-cyan-midtone/60 font-mono">{topic.gri}</td>
                       <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                           <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                             <div className="h-full bg-aqua-cyan-midtone" style={{ width: `${(topic.impact / 5) * 100}%` }} />
                           </div>
                           <span className="text-xs font-black text-slate-600 font-mono">{topic.impact}</span>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                           <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                             <div className="h-full bg-eternal-gold-midtone" style={{ width: `${(topic.concern / 5) * 100}%` }} />
                           </div>
                           <span className="text-xs font-black text-slate-600 font-mono">{topic.concern}</span>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <span className="text-xs font-black uppercase tracking-wider" style={{ color: getStatusColor(topic.status) }}>{getStatusLabel(topic.status)}</span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </Card>
        </motion.div>
      )}

      {/* Floating AI Assistant Button */}
      <motion.button
        variants={fadeIn}
        onClick={handleAskOmniAgent}
        disabled={loading}
        className="fixed bottom-10 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-aqua-cyan-midtone to-aqua-cyan text-white shadow-[0_12px_40px_-10px_rgba(0,255,255,0.4)] flex items-center justify-center z-100 group active:scale-95 transition-all"
      >
        {loading ? <RefreshCw size={32} className="animate-spin" /> : <Bot size={32} className="group-hover:rotate-12 transition-transform" />}
        <div className="absolute right-24 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-aqua-cyan/20 shadow-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 pointer-events-none transition-all duration-300">
          <p className="text-[9px] font-black text-aqua-cyan-midtone uppercase tracking-[0.2em] mb-0.5">Supreme Intelligence</p>
          <p className="text-sm font-black text-slate-800 whitespace-nowrap">Ask OmniAgent AI 分析重大性</p>
        </div>
      </motion.button>
    </motion.div>
  );
}
