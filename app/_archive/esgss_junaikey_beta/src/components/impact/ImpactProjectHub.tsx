import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Target, Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface ImpactProject {
  id: string;
  title: string;
  category: 'Environmental' | 'Social' | 'Governance';
  status: 'Planning' | 'Active' | 'Completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  beneficiaries: number;
  sdgs: number[]; // SDG Goal Numbers
  progress: number;
}

const ImpactProjectHub: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  // Mock Data
  const projects: ImpactProject[] = [
    {
      id: 'p1',
      title: 'Community Solar Alliance',
      category: 'Environmental',
      status: 'Active',
      budget: 500000,
      spent: 320000,
      startDate: '2025-03-01',
      endDate: '2026-03-01',
      beneficiaries: 1200,
      sdgs: [7, 11, 13],
      progress: 65,
    },
    {
      id: 'p2',
      title: 'Tech Skills for Youth',
      category: 'Social',
      status: 'Active',
      budget: 150000,
      spent: 45000,
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      beneficiaries: 300,
      sdgs: [4, 8],
      progress: 30,
    },
    {
      id: 'p3',
      title: 'Supply Chain Audit 2025',
      category: 'Governance',
      status: 'Completed',
      budget: 80000,
      spent: 78000,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      beneficiaries: 0,
      sdgs: [12, 17],
      progress: 100,
    },
  ];

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-purple-400" />
            Impact Project Hub
          </h2>
          <p className="text-sm text-slate-400">Manage and track your ESG initiatives</p>
        </div>

        <div className="flex bg-slate-800 rounded-lg p-1">
          {['All', 'Active', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
        {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  project.category === 'Environmental'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : project.category === 'Social'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {project.category}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-bold border ${
                  project.status === 'Active'
                    ? 'border-purple-500 text-purple-300'
                    : project.status === 'Completed'
                      ? 'border-slate-500 text-slate-400'
                      : 'border-slate-500 text-slate-400'
                }`}
              >
                {project.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
              {project.title}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Budget
                </span>
                <span className="text-white font-mono">
                  ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Beneficiaries
                </span>
                <span className="text-white font-mono">
                  {project.beneficiaries.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 h-2 rounded-full mb-4 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* SDG Badges */}
            <div className="flex gap-2">
              {project.sdgs.map(sdg => (
                <div
                  key={sdg}
                  className="w-8 h-8 rounded bg-white text-black font-black flex items-center justify-center text-xs"
                  title={`SDG ${sdg}`}
                >
                  {sdg}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Add New Card */}
        <button className="border-2 border-dashed border-white/20 rounded-xl p-5 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5 transition-all">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
            <span className="text-2xl">+</span>
          </div>
          <span className="font-bold">Create New Initiative</span>
        </button>
      </div>
    </div>
  );
};

export default ImpactProjectHub;
