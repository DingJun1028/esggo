import React, { useState, useMemo } from 'react';
import {
  Users,
  Heart,
  Globe,
  Award,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { communityImpactManager, ImpactProject } from '../../../services/CommunityImpactManager';
import { IntegrityPassportUI } from '../governance/IntegrityPassportUI';

export const CommunityImpactNetworkUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState<ImpactProject[]>(() =>
    communityImpactManager.getProjects()
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(
    () => ({
      totalBeneficiaries: communityImpactManager.calculateTotalBeneficiaries(),
      averageSRS: communityImpactManager.calculateAverageSRS(),
      activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
    }),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter(
      p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      {/* Social Resonance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ImpactStatCard
          icon={<Heart size={20} />}
          label="Total Beneficiaries"
          value={stats.totalBeneficiaries.toLocaleString()}
          subValue="Direct Social Outreach"
          color="text-pink-400"
          isDark={isDark}
        />
        <ImpactStatCard
          icon={<Sparkles size={20} />}
          label="Avg Resonance Score"
          value={`${stats.averageSRS}%`}
          subValue="Engagement & Outcome Index"
          color="text-amber-400"
          isDark={isDark}
        />
        <ImpactStatCard
          icon={<Globe size={20} />}
          label="Active Initiatives"
          value={stats.activeProjects.toString()}
          subValue="Ongoing Cross-District Impact"
          color="text-cyan-400"
          isDark={isDark}
        />
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left: Project Feed */}
        <div
          className={`flex-[1.2] flex flex-col rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-4 overflow-hidden`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60">
              Impact Pipeline
            </h3>
            <div className="flex gap-2 text-slate-500">
              <Search size={16} />
              <Filter size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={selectedProjectId === project.id}
                onClick={() => setSelectedProjectId(project.id)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>

        {/* Right: Resonance Details & 5T Identity */}
        <div className="flex-[1.8] flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col overflow-hidden"
              >
                {/* Header Info */}
                <div
                  className={`p-6 rounded-2xl border mb-4 relative overflow-hidden ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white border-slate-200'}`}
                >
                  {/* Subtle Background Icon */}
                  <Users
                    size={120}
                    className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none"
                  />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div
                        className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase mb-2 ${
                          isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'
                        }`}
                      >
                        <Award size={10} /> {selectedProject.category} Module
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight">{selectedProject.name}</h2>
                      <div className="flex items-center gap-3 mt-2 text-xs opacity-50 font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {selectedProject.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {selectedProject.volunteeringHours}h Contributed
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black opacity-30 uppercase block">
                        Social ROI
                      </span>
                      <span className="text-2xl font-black text-indigo-400">
                        x{selectedProject.socialRoi}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold opacity-40 uppercase">
                        Outreach Impact
                      </span>
                      <div className="text-xl font-bold">
                        {selectedProject.beneficiaries.toLocaleString()} Beneficiaries
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold opacity-40 uppercase">
                        Resonance Index
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedProject.resonanceScore}%` }}
                            className="h-full bg-pink-500"
                          />
                        </div>
                        <span className="text-sm font-black text-pink-400">
                          {selectedProject.resonanceScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5T Verification Identity */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <h4 className="text-xs font-black uppercase tracking-widest opacity-60">
                      Verified Social Evidence
                    </h4>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <IntegrityPassportUI
                      data={selectedProject.evidenceCore}
                      theme={isDark ? 'dark' : 'light'}
                      className="shadow-none border-none bg-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div
                className={`h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl ${isDark ? 'border-white/5 bg-slate-950/30' : 'border-slate-100 bg-slate-50'}`}
              >
                <Users size={64} className="mb-4 opacity-10 animate-pulse" />
                <h3 className="text-lg font-bold opacity-40">
                  Select Project to View Social Resonance
                </h3>
                <p className="text-xs font-mono opacity-20 mt-2 tracking-widest">
                  AWAITING STAKEHOLDER SELECTION
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, selected, onClick, isDark }: any) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border transition-all text-left relative group overflow-hidden ${
        selected
          ? isDark
            ? 'bg-pink-500/10 border-pink-500/30'
            : 'bg-pink-50 border-pink-200'
          : isDark
            ? 'bg-slate-950 border-transparent hover:border-white/10'
            : 'bg-white border-transparent hover:border-slate-200'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-[9px] font-black uppercase p-1 rounded ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}
        >
          Tier-1 S-ROI
        </span>
        <div
          className={`w-2 h-2 rounded-full ${project.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}
        />
      </div>
      <div className="font-bold text-sm mb-1">{project.name}</div>
      <div className="text-[10px] opacity-50 flex items-center gap-1">
        <MapPin size={10} /> {project.location}
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border-2 ${isDark ? 'border-slate-950 bg-slate-800' : 'border-white bg-slate-200'} flex items-center justify-center`}
            >
              <Users size={10} className="opacity-50" />
            </div>
          ))}
          <div
            className={`w-6 h-6 rounded-full border-2 ${isDark ? 'border-slate-950 bg-indigo-500/20 text-indigo-400' : 'border-white bg-indigo-100 text-indigo-600'} flex items-center justify-center text-[8px] font-black`}
          >
            +{Math.floor(project.beneficiaries / 100)}
          </div>
        </div>
        <ArrowRight
          size={14}
          className={`transition-transform duration-300 ${selected ? 'translate-x-0' : '-translate-x-2 opacity-0'}`}
        />
      </div>
    </button>
  );
};

const ImpactStatCard = ({ icon, label, value, subValue, color, isDark }: any) => (
  <div
    className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} shadow-2xl relative overflow-hidden`}
  >
    {/* Texture Overlay */}
    <div
      className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-white/5 rounded-full -mr-10 -mt-10 pointer-events-none`}
    />

    <div className={`flex items-center gap-2 mb-2 ${color}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">{label}</span>
    </div>
    <div className="text-3xl font-black">{value}</div>
    <div className="text-[10px] font-mono opacity-40 mt-1">{subValue}</div>
  </div>
);

export default CommunityImpactNetworkUI;
