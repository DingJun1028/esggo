import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ipmsService, IImpactProject, ProjectState } from '../../services/ipmsService';
import { Layers, Zap, Clock, Users, ArrowUpRight, Plus, Box, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// ==================== BILINGUAL TEXT ====================
const TEXT = {
  TITLE: { zh: 'IPMS 影響力專案執行中心', en: 'IPMS Impact Project Execution Center' },
  SUBTITLE: {
    zh: '管理專案矩陣，最小化系統熵值，最大化社會影響力',
    en: 'Manage project matrix, minimize system entropy, maximize social impact',
  },
  STATS: {
    ACTIVE: { zh: '活躍專案', en: 'Active Projects' },
    ENTROPY: { zh: '累計熵減', en: 'Total Entropy Reduction' },
    UTILIZATION: { zh: '資源利用率', en: 'Resource Utilization' },
  },
  LABELS: {
    PROGRESS: { zh: '進度', en: 'Progress' },
    TARGET: { zh: '目標日期', en: 'Target Date' },
    OWNER: { zh: '負責人', en: 'Owner' },
    ENTROPY_DELTA: { zh: '熵值變化', en: 'Entropy Δ' },
  },
  ACTIONS: {
    NEW_PROJECT: { zh: '啟動新專案', en: 'Initiate New Project' },
    VIEW_DETAILS: { zh: '查看詳情', en: 'View Details' },
  },
  STATES: {
    [ProjectState.INITIATION]: { zh: '初始規劃', en: 'Initiation' },
    [ProjectState.PLANNING]: { zh: '計畫中', en: 'Planning' },
    [ProjectState.EXECUTION]: { zh: '執行中', en: 'Execution' },
    [ProjectState.MONITORING]: { zh: '監控中', en: 'Monitoring' },
    [ProjectState.CLOSURE]: { zh: '已結案', en: 'Closure' },
  },
};

// ==================== COMPONENTS ====================

const StatCard = ({ label, value, icon, color, isZh }: any) => (
  <div className={`bg-slate-900/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</div>
    </div>
  </div>
);

const ProjectCard = ({ project, isZh }: { project: IImpactProject; isZh: boolean }) => {
  const stateText = TEXT.STATES[project.state] || { zh: project.state, en: project.state };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 relative overflow-hidden group transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-[10px] px-2 py-1 rounded border font-bold uppercase tracking-wider
                    ${
                      project.state === ProjectState.EXECUTION
                        ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30'
                        : project.state === ProjectState.MONITORING
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                    }
                `}
        >
          {isZh ? stateText.zh : stateText.en}
        </span>
        <span className="text-xs text-slate-500 font-mono">ID: {project.id}</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
        {project.title}
      </h3>
      <p className="text-xs text-slate-400 mb-6 line-clamp-2 h-8">{project.description}</p>

      {/* Entropy Meter */}
      <div className="mb-4 bg-black/40 rounded-lg p-3 border border-white/5">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-cyan-300 flex items-center gap-1">
            <Zap size={10} /> {isZh ? TEXT.LABELS.ENTROPY_DELTA.zh : TEXT.LABELS.ENTROPY_DELTA.en}
          </span>
          <span className="font-mono text-white">-{project.entropyReduction} J/K</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4">
        <div className="flex items-center gap-1">
          <Users size={12} /> {project.owner}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} /> {project.targetDate}
        </div>
      </div>
    </motion.div>
  );
};

// ==================== MAIN MODULE ====================

export const IpmsModule = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';
  const projects = useMemo(() => ipmsService.getProjects(), []);
  const stats = useMemo(() => ipmsService.getProjectStats(), []);

  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 text-white overflow-hidden relative">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
            <Box className="text-cyan-400" />
            {isZh ? TEXT.TITLE.zh : TEXT.TITLE.en}
          </h2>
          <p className="text-slate-400 text-sm mt-1 ml-1">
            {isZh ? TEXT.SUBTITLE.zh : TEXT.SUBTITLE.en}
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]">
          <Plus size={18} /> {isZh ? TEXT.ACTIONS.NEW_PROJECT.zh : TEXT.ACTIONS.NEW_PROJECT.en}
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-6 shrink-0">
        <StatCard
          label={isZh ? TEXT.STATS.ACTIVE.zh : TEXT.STATS.ACTIVE.en}
          value={stats.totalProjects}
          icon={<Layers size={24} className="text-white" />}
          color="bg-cyan-500"
          isZh={isZh}
        />
        <StatCard
          label={isZh ? TEXT.STATS.ENTROPY.zh : TEXT.STATS.ENTROPY.en}
          value={`-${stats.activeEntropyReduction}`}
          icon={<Zap size={24} className="text-white" />}
          color="bg-emerald-500"
          isZh={isZh}
        />
        <StatCard
          label={isZh ? TEXT.STATS.UTILIZATION.zh : TEXT.STATS.UTILIZATION.en}
          value={`${stats.resourceUtilization}%`}
          icon={<Activity size={24} className="text-white" />}
          color="bg-orange-500"
          isZh={isZh}
        />
      </div>

      {/* Content Grid */}
      <div className="flex-1 bg-black/20 border border-white/5 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <div className="h-full overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} isZh={isZh} />
            ))}

            {/* Dashed Placeholder for New Project */}
            <div className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 cursor-pointer transition-all min-h-[200px]">
              <Plus size={48} className="mb-4 opacity-50" />
              <span className="font-bold">
                {isZh ? '建立新專案矩陣' : 'Create New Project Matrix'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
