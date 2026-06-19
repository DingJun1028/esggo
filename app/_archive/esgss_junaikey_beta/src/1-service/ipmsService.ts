/**
 * 永續影響管理系統服務 (Impact Project Management System Service)
 * --------------------------------------------------
 * [分類] 永續影響層 (ESG Impact Layer)
 */

import { omniLogger, LogCategory } from '@infra/logging/OmniLogger.ts';

export enum ProjectState {
  INITIATION = 'initiation',
  PLANNING = 'planning',
  EXECUTION = 'execution',
  MONITORING = 'monitoring',
  CLOSURE = 'closure',
}

export interface IResource {
  id: string;
  name: string;
  type: 'human' | 'compute' | 'capital';
  allocation: number; // 0-100%
}

export interface IImpactProject {
  id: string;
  title: string;
  description: string;
  state: ProjectState;
  progress: number; // 0-100
  entropyReduction: number; // The core impact metric
  startDate: string;
  targetDate: string;
  resources: IResource[];
  owner: string;
}

class IpmsService {
  private static instance: IpmsService;
  private projects: IImpactProject[] = [];

  private constructor() {
    this.projects = this.generateMockProjects();
  }

  public static getInstance(): IpmsService {
    if (!IpmsService.instance) {
      IpmsService.instance = new IpmsService();
    }
    return IpmsService.instance;
  }

  // "Deep Logic": Calculate Entropy Reduction based on resource efficiency and progress
  public calculateEntropyReduction(project: IImpactProject): number {
    if (!project || !project.resources) {
      omniLogger.warn(LogCategory.SYSTEM, 'Invalid project provided for entropy calculation');
      return 0;
    }
    const baseEntropy = 1000;
    // Avoid division by zero
    const totalAllocation = project.resources.reduce((acc, r) => acc + (r.allocation || 0), 0);
    const maxPossibleAllocation = project.resources.length * 100 || 1;

    const efficiency = totalAllocation / maxPossibleAllocation;

    // Progress safety
    const safeProgress = Math.max(0, Math.min(100, project.progress || 0));

    return Math.floor(baseEntropy * (safeProgress / 100) * efficiency);
  }

  public getProjects(): IImpactProject[] {
    return [...this.projects]; // Return a copy to enforce immutability of the source truth
  }

  public getProjectById(id: string): IImpactProject | undefined {
    return this.projects.find(p => p.id === id);
  }

  public updateProjectStatus(id: string, state: ProjectState, progress: number): boolean {
    const project = this.projects.find(p => p.id === id);
    if (project) {
      project.state = state;
      project.progress = Math.max(0, Math.min(100, progress));
      // Recalculate impact dynamically
      project.entropyReduction = this.calculateEntropyReduction(project);
      return true;
    }
    return false;
  }

  public getProjectStats(): {
    totalProjects: number;
    activeEntropyReduction: number;
    resourceUtilization: number;
  } {
    const totalEntropy = this.projects.reduce((acc, p) => acc + (p.entropyReduction || 0), 0);
    const totalResources = this.projects.reduce(
      (acc, p) => acc + (p.resources ? p.resources.length : 0),
      0
    );

    return {
      totalProjects: this.projects.length,
      activeEntropyReduction: totalEntropy,
      resourceUtilization: totalResources > 0 ? 78 : 0, // Mock utilization, safe guard
    };
  }

  private generateMockProjects(): IImpactProject[] {
    return [
      {
        id: 'prj-001',
        title: 'Ocean Plastic Circular Economy',
        description: 'Establishing a closed-loop supply chain for recovered marine plastics.',
        state: ProjectState.EXECUTION,
        progress: 65,
        entropyReduction: 450,
        startDate: '2025-01-01',
        targetDate: '2025-12-31',
        resources: [{ id: 'res-1', name: 'Recycling Unit A', type: 'compute', allocation: 80 }],
        owner: 'Dr. Sarah Chen',
      },
      {
        id: 'prj-002',
        title: 'Urban Vertical Farming Grid',
        description: 'Optimizing yield for 50 rooftop gardens using IoT sensors.',
        state: ProjectState.MONITORING,
        progress: 88,
        entropyReduction: 720,
        startDate: '2024-06-15',
        targetDate: '2025-06-15',
        resources: [{ id: 'res-2', name: 'Sensor Net X', type: 'compute', allocation: 40 }],
        owner: 'AgriTech AI',
      },
      {
        id: 'prj-003',
        title: 'Community Energy Microgrid',
        description: 'Decentralized solar distribution for Taipei District 4.',
        state: ProjectState.PLANNING,
        progress: 15,
        entropyReduction: 50,
        startDate: '2025-03-01',
        targetDate: '2026-03-01',
        resources: [],
        owner: 'Taipei Power',
      },
    ];
  }

  /**
   * 銷毀 IpmsService 實例
   */
  public static destroy(): void {
    IpmsService.instance = undefined as unknown as IpmsService;
    omniLogger.info(LogCategory.SYSTEM, 'IpmsService destroyed');
  }
}

/**
 * 導出 IpmsService 單例 (Exported Singleton)
 */
export const ipmsService = IpmsService.getInstance();
