import React, { useMemo } from 'react';
import { useImpactProject, ImpactProject } from '../store/useImpactProject';
import { Target } from 'lucide-react';
import { ProjectCard } from './cards/ProjectCard';

export const OmniProjectBoard: React.FC = () => {
  const { projects } = useImpactProject();

  // ⚡ Bolt Optimization: Memoize the demo project data so it doesn't get recreated on every render.
  const demoProject: ImpactProject = useMemo(
    () => ({
      id: 'demo-solar-audit',
      name: 'Solar Supply Chain Audit',
      description:
        'Comprehensive verification of supplier renewable energy certificates across Tier 1 and Tier 2 partners.',
      category: 'ENVIRONMENT',
      status: 'ACTIVE',
      progress: 75,
      sdgTargets: ['SDG 7', '13'],
      impactMetrics: [
        {
          type: 'SROI_VALUE',
          targetValue: 5000,
          currentValue: 4200, // Divided by 1000 in component = 4.2x
          unit: 'Ratio',
        },
      ],
      owner: 'System',
    }),
    []
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-celestial-gold" />
            Impact Initiatives
          </h1>
          <p className="text-slate-400 text-sm">
            Strategic Goal: <span className="text-celestial-emerald font-bold">Net Zero 2030</span>
          </p>
        </div>
        <button className="bg-celestial-emerald/10 hover:bg-celestial-emerald/20 text-celestial-emerald border border-celestial-emerald/50 px-4 py-2 rounded-lg text-sm font-bold transition-all">
          + New Initiative
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Demo Project Card */}
        <ProjectCard project={demoProject} />

        {/* Render Actual Projects */}
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
