import React, { memo } from 'react';
import { ImpactProject } from '../../store/useImpactProject';
import { Leaf, Globe, TrendingUp, Users, Shield } from 'lucide-react';

interface ProjectCardProps {
  project: ImpactProject;
}

const ProjectCardComponent: React.FC<ProjectCardProps> = ({ project }) => {
  // Determine icon based on category
  const getCategoryIcon = (category: ImpactProject['category']) => {
    switch (category) {
      case 'ENVIRONMENT':
        return <Leaf className="w-4 h-4" />;
      case 'SOCIAL':
        return <Users className="w-4 h-4" />;
      case 'GOVERNANCE':
        return <Shield className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: ImpactProject['category']) => {
    switch (category) {
      case 'ENVIRONMENT':
        return 'text-green-400 bg-green-900/20';
      case 'SOCIAL':
        return 'text-purple-400 bg-purple-900/20';
      case 'GOVERNANCE':
        return 'text-blue-400 bg-blue-900/20';
      default:
        return 'text-slate-400 bg-slate-800/50';
    }
  };

  // Find SROI metric if it exists
  const sroiMetric = project.impactMetrics.find(m => m.type === 'SROI_VALUE');

  return (
    <div className="relative group p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800 hover:border-celestial-gold/50 transition-all duration-300 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className={`p-2 rounded-lg ${getCategoryColor(project.category)}`}>
            {getCategoryIcon(project.category)}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {project.category}
          </span>
        </div>
        <span className="px-2 py-1 rounded bg-slate-800/50 text-[10px] text-slate-400 font-mono">
          {project.status}
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-celestial-gold transition-colors line-clamp-2">
        {project.name}
      </h3>
      <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow">
        {project.description || 'No description provided.'}
      </p>

      <div className="space-y-4 mt-auto">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Progress</span>
            <span className="text-white font-mono">{project.progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-celestial-emerald to-celestial-blue shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Globe className="w-3 h-3 text-blue-400" />
            <span>{project.sdgTargets.join(', ') || 'General'}</span>
          </div>

          {sroiMetric && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300 ml-auto">
              <TrendingUp className="w-3 h-3 text-celestial-gold" />
              <span className="font-mono text-celestial-gold">
                SROI: {(sroiMetric.currentValue / 1000).toFixed(1)}x
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ⚡ Bolt Optimization: Memoize the card to prevent re-renders when parent list updates
// but the individual project data hasn't changed.
export const ProjectCard = memo(ProjectCardComponent);
