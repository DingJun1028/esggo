// src/utils/seed.ts
import { useTaskSystem } from '../store/useTaskSystem';
import { useImpactProject } from '../store/useImpactProject';
import { useNoteSystem } from '../store/useNoteSystem';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export const injectGenesisData = () => {
  const tasks = useTaskSystem.getState();
  const projects = useImpactProject.getState();
  const notes = useNoteSystem.getState();

  // Prevent duplicate seeding
  if (tasks.tasks.length > 0) return;

  omniLogger.info(LogCategory.SYSTEM, '?? Initiating ESGss Genesis Sequence for CSO DingJun...');

  // 1. Implant Strategic Note
  const strategyNoteId = 'esgss-strategy-2026';
  notes.saveNote(
    strategyNoteId,
    `# 2026 Goodwill Strategy Note (Owner: DingJun)\n\nGoal: Elevate ESG from 'Compliance' to 'ImpactMonetization'.\nKeywords: #Goodwill #Impact #SROI`
  );

  // 2. Implant Core Task
  tasks.addTask({
    title: 'Review: Goodwill Supply Chain Standard v1.0',
    priority: 'CRITICAL',
    contextId: 'esgss-standard',
    sourceNoteId: strategyNoteId,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    tags: ['Standard', 'CSO_Review_DingJun'],
  });

  // 3. Implant Impact Project
  projects.createProject({
    name: '2026 Goodwill Supply Chain Empowerment',
    category: 'SOCIAL',
    sdgTargets: ['SDG_17', 'SDG_12'],
    impactMetrics: [
      { type: 'SROI_VALUE', targetValue: 5000000, currentValue: 1200000, unit: 'TWD' } as any,
    ],
    owner: 'DingJun',
  });
};
