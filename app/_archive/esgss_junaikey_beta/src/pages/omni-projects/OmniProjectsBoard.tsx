/**
 * 🎯 Omni Projects Board - Stitch Design System
 * 專案看板頁面
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Plus,
  Search,
  Grid,
  List,
  Kanban,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  PauseCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CalendarDays,
  Minus,
  MoreHorizontal,
} from 'lucide-react';
import { View } from '@/types/core';

type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
type ProjectPriority = 'critical' | 'high' | 'medium' | 'low';
type ViewMode = 'grid' | 'list' | 'kanban';

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  endDate: string;
  budget: number;
  owner: { name: string; avatar: string };
  team: { name: string; avatar: string }[];
  category: 'environmental' | 'social' | 'governance' | 'integration';
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: '碳中和行動計劃',
    description: '推動組織實現2030年碳中和目標',
    status: 'active',
    priority: 'critical',
    progress: 65,
    endDate: '2025-12-31',
    budget: 5000000,
    owner: { name: '張志明', avatar: 'ZC' },
    team: [{ name: '李美華', avatar: 'LM' }],
    category: 'environmental',
  },
  {
    id: 'proj-002',
    name: '員工賦能計劃',
    description: '提升員工技能與職業發展',
    status: 'active',
    priority: 'high',
    progress: 42,
    endDate: '2025-11-30',
    budget: 2000000,
    owner: { name: '陳雅婷', avatar: 'CY' },
    team: [],
    category: 'social',
  },
  {
    id: 'proj-003',
    name: '公司治理優化',
    description: '強化董事会多元化與風險管理',
    status: 'planning',
    priority: 'high',
    progress: 15,
    endDate: '2025-09-30',
    budget: 1500000,
    owner: { name: '劉國華', avatar: 'LG' },
    team: [],
    category: 'governance',
  },
  {
    id: 'proj-004',
    name: '供應商ESG審計',
    description: '對關鍵供應商進行ESG評估',
    status: 'active',
    priority: 'medium',
    progress: 78,
    endDate: '2025-03-31',
    budget: 800000,
    owner: { name: '周小莉', avatar: 'ZX' },
    team: [],
    category: 'integration',
  },
  {
    id: 'proj-005',
    name: '綠色辦公室認證',
    description: '取得LEED和WELL認證',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    endDate: '2024-12-31',
    budget: 3000000,
    owner: { name: '孫明華', avatar: 'SM' },
    team: [],
    category: 'environmental',
  },
];

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const config: Record<ProjectStatus, { color: string; label: string }> = {
    planning: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: '規劃中' },
    active: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: '執行中' },
    'on-hold': { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: '暫停' },
    completed: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: '已完成' },
    archived: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', label: '已歸檔' },
  };
  const { color, label } = config[status] || config.planning;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      {label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: ProjectPriority }> = ({ priority }) => {
  const config: Record<ProjectPriority, { color: string; label: string }> = {
    critical: { color: 'text-red-400', label: '緊急' },
    high: { color: 'text-orange-400', label: '高' },
    medium: { color: 'text-yellow-400', label: '中' },
    low: { color: 'text-slate-400', label: '低' },
  };
  const { color, label } = config[priority] ?? config.medium;
  return <span className={`text-xs font-medium ${color}`}>{label}</span>;
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const defaultStyle = { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: '整合' };
  const styles: Record<string, { color: string; label: string }> = {
    environmental: {
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      label: '環境',
    },
    social: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: '社會' },
    governance: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: '治理' },
    integration: defaultStyle,
  };
  const style = styles[category] || defaultStyle;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${style.color}`}>
      {style.label}
    </span>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-[#63a6b0]/50 transition-all duration-300 p-5"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <CategoryBadge category={project.category} />
        <PriorityBadge priority={project.priority} />
      </div>
    </div>
    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#63a6b0]">{project.name}</h3>
    <p className="text-sm text-slate-400 mb-4">{project.description}</p>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs text-slate-500">進度</span>
      <span className="text-sm font-bold text-[#63a6b0]">{project.progress}%</span>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full mb-4">
      <motion.div
        className="h-full bg-gradient-to-r from-[#63a6b0] to-[#4A8291] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${project.progress}%` }}
      />
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-white/5">
      <div className="flex -space-x-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#63a6b0] to-[#4A8291] flex items-center justify-center text-xs font-bold text-white border-2 border-white/20">
          {project.owner.avatar}
        </div>
      </div>
      <StatusBadge status={project.status} />
    </div>
  </motion.div>
);

const OmniProjectsBoard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: MOCK_PROJECTS.length,
      active: MOCK_PROJECTS.filter(p => p.status === 'active').length,
      completed: MOCK_PROJECTS.filter(p => p.status === 'completed').length,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-4 bg-[#63a6b0]/20 rounded-2xl">
            <Layers className="text-[#63a6b0]" size={28} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight">專案看板</h1>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
              OMNI_AURA_PROJECT_SYSTEM
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase">總專案數</p>
              <p className="text-3xl font-black text-white">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#63a6b0]/20 flex items-center justify-center">
              <Layers className="text-[#63a6b0]" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase">執行中</p>
              <p className="text-3xl font-black text-emerald-400">{stats.active}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase">已完成</p>
              <p className="text-3xl font-black text-purple-400">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <CheckCircle className="text-purple-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase">平均進度</p>
              <p className="text-3xl font-black text-amber-400">50%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Target className="text-amber-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="搜尋專案..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#63a6b0]/50"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
          >
            <option value="all">所有狀態</option>
            <option value="planning">規劃中</option>
            <option value="active">執行中</option>
            <option value="on-hold">暫停</option>
            <option value="completed">已完成</option>
          </select>
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#63a6b0]/20 text-[#63a6b0]' : 'text-slate-400'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#63a6b0]/20 text-[#63a6b0]' : 'text-slate-400'}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg ${viewMode === 'kanban' ? 'bg-[#63a6b0]/20 text-[#63a6b0]' : 'text-slate-400'}`}
            >
              <Kanban size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#63a6b0] to-[#4A8291] rounded-xl text-white font-medium">
            <Plus size={18} />
            新建專案
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          )}
          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <CategoryBadge category={project.category} />
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-sm text-slate-400">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#63a6b0]">{project.progress}%</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          {viewMode === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {(['planning', 'active', 'on-hold', 'completed'] as ProjectStatus[]).map(status => (
                <div key={status} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="font-bold text-white mb-4 capitalize">{status}</h3>
                  <div className="space-y-3">
                    {filteredProjects
                      .filter(p => p.status === status)
                      .map(project => (
                        <div
                          key={project.id}
                          className="p-3 bg-white/5 rounded-lg border border-white/5"
                        >
                          <h4 className="text-sm font-medium text-white mb-1">{project.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#63a6b0]">{project.progress}%</span>
                            <PriorityBadge priority={project.priority} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OmniProjectsBoard;
