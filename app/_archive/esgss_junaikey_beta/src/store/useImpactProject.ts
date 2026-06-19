import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ImpactMetric {
  type: 'SROI_VALUE' | 'CARBON_SAVED' | 'LIVES_TOUCHED';
  targetValue: number;
  currentValue: number;
  unit: string;
}

export interface ImpactProject {
  id: string;
  name: string;
  description?: string;
  category: 'ENVIRONMENT' | 'SOCIAL' | 'GOVERNANCE';
  sdgTargets: string[];
  impactMetrics: ImpactMetric[];
  owner: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNING';
  progress: number; // 0-100
}

interface ImpactState {
  projects: ImpactProject[];
  createProject: (project: Omit<ImpactProject, 'id' | 'status' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<ImpactProject>) => void;
}

export const useImpactProject = create<ImpactState>()(
  persist(
    set => ({
      projects: [],
      createProject: project =>
        set(state => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: crypto.randomUUID(),
              status: 'PLANNING',
              progress: 0,
            },
          ],
        })),
      updateProject: (id, updates) =>
        set(state => ({
          projects: state.projects.map(p => (p.id === id ? { ...p, ...updates } : p)),
        })),
    }),
    { name: 'jun-ai-key-impact' }
  )
);
