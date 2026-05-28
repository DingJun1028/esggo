'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Activity, Zap, FileText, Database, Compass, 
  ArrowRight, HeartPulse, Sparkles, CheckCircle2, Lock,
  BarChart, Target, Leaf, Users, Briefcase
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { fadeIn, scaleIn, staggerContainer, slideInRight } from '../../lib/animations';

export default function DashboardContent() {
  const [healthScore, setHealthScore] = useState(92);
  
  const activities = [
    { id: 1, agent: 'Jun.Ai.Key', action: '執行了 5T 數據循環檢驗', time: 'Just now', type: 'success' },
    { id: 2, agent: 'ESG_Auditor', action: '鎖定 2024 第三季碳排憑證 (Hash: 0x8a9...)', time: '5m ago', type: 'secure' },
    { id: 3, agent: 'ESG_Researcher', action: '萃取了 3 項新的永續目標標竿數據', time: '12m ago', type: 'info' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden p-8">
      {/* Background Liquid Glass Hologram */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-200/40 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-emerald-200/30 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-primary)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 tracking-tight">
              Sovereign Dashboard
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">
              OmniCore Governance Center • V1.0
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xl px-6 py-2 rounded-2xl border border-slate-200 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Global Compliance Beacon */}
          <motion.div variants={scaleIn} className="md:col-span-1">
            <Card className="h-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl overflow-hidden shadow-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 flex flex-col h-full relative z-10">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                  <Shield size={12} className="text-cyan-600" /> Global Compliance
                </p>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-[30px] animate-pulse" />
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg relative z-10 border-4 border-white">
                      <span className="text-5xl font-black text-white tracking-tighter">A</span>
                    </div>
                  </div>
                  <div className="mt-8 text-center space-y-1">
                    <h3 className="text-xl font-black text-slate-800">5T 評級優良</h3>
                    <p className="text-xs font-bold text-slate-500">系統合規健康度: {healthScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Governance Loop Monitor (Radar/Stats) */}
          <motion.div variants={fadeIn} className="md:col-span-2">
            <Card className="h-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Target size={12} className="text-emerald-600" /> Governance Loop
                  </p>
                  <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase text-cyan-600 hover:bg-cyan-50 h-8">
                    View Matrix <ArrowRight size={10} className="ml-1" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 flex-1">
                  {[
                    { id: 'E', name: 'Environment', icon: <Leaf size={20} />, score: 88, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                    { id: 'S', name: 'Social', icon: <Users size={20} />, score: 95, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
                    { id: 'G', name: 'Governance', icon: <Briefcase size={20} />, score: 92, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
                  ].map((dim) => (
                    <div key={dim.id} className={cn("rounded-2xl p-6 border flex flex-col justify-between transition-all hover:scale-[1.02]", dim.bg, dim.border)}>
                      <div className={cn("p-3 rounded-xl bg-white/50 w-fit backdrop-blur-sm", dim.color)}>
                        {dim.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-black text-slate-800 tracking-tighter">{dim.score}<span className="text-sm text-slate-500 ml-1">%</span></p>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">{dim.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* OmniAgent Activity Stream */}
          <motion.div variants={slideInRight} className="md:col-span-2">
            <Card className="h-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Activity size={12} className="text-cyan-400" /> OmniAgent Stream
                </p>
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-4 border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                      <div className="mt-1">
                        {act.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
                        {act.type === 'secure' && <Lock size={16} className="text-purple-400" />}
                        {act.type === 'info' && <Zap size={16} className="text-cyan-400" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold text-slate-200">{act.action}</p>
                        <p className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                          <span className="text-cyan-400">@{act.agent}</span> • {act.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Action Hub */}
          <motion.div variants={fadeIn} className="md:col-span-1">
            <Card className="h-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl">
              <CardContent className="p-8 flex flex-col h-full">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Compass size={12} className="text-purple-600" /> Quick Actions
                </p>
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <a href="/editor" className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-white border border-cyan-200 text-cyan-900 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600"><FileText size={16} /></div>
                      <span className="font-black text-sm tracking-wide">永續撰寫 (SustainWrite)</span>
                    </div>
                    <ArrowRight size={14} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <a href="/vault" className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 text-emerald-900 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Database size={16} /></div>
                      <span className="font-black text-sm tracking-wide">實證金庫 (Vault-Omni)</span>
                    </div>
                    <ArrowRight size={14} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a href="/omniguide" className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-white border border-purple-200 text-purple-900 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Sparkles size={16} /></div>
                      <span className="font-black text-sm tracking-wide">萬能法典 (OmniGuide)</span>
                    </div>
                    <ArrowRight size={14} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
