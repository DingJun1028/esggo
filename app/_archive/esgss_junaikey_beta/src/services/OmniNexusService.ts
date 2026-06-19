/**
 * OmniNexusService
 *
 * Central Nervous System for External/Internal Data Streams.
 * Connects Legion, IPMS, Compliance, and System metrics.
 */

import { ipmsService } from './ipmsService.js';
import { reportingService } from './reportingService.js';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { legionCoordinator } from '@/omni/services/OmniLegionCoordinator.js';

export interface IGlobalMetrics {
  globalGScore: number;
  totalEntropyReduced: number;
  activeAgents: number;
  activeProjects: number;
  complianceRate: number;
  systemHealth: 'STABLE' | 'OPTIMAL' | 'CRITICAL';
  knowledgeNodes: number;
}

export interface INexusStreamItem {
  id: string;
  timestamp: string;
  source: 'LEGION' | 'IPMS' | 'COMPLIANCE' | 'SYSTEM';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  metadata?: any;
}

class OmniNexusService {
  private static instance: OmniNexusService;
  private stream: INexusStreamItem[] = [];
  private metrics: IGlobalMetrics = {
    globalGScore: 850,
    totalEntropyReduced: 42.5,
    activeAgents: 0,
    activeProjects: 12,
    complianceRate: 0.98,
    systemHealth: 'OPTIMAL',
    knowledgeNodes: 1420,
  };

  private constructor() {
    this.startHeartbeat();
  }

  public static getInstance(): OmniNexusService {
    if (!OmniNexusService.instance) {
      OmniNexusService.instance = new OmniNexusService();
    }
    return OmniNexusService.instance;
  }

  private startHeartbeat() {
    setInterval(() => {
      this.updateMetrics();
    }, 5000);
  }

  private async updateMetrics() {
    try {
      // Sync with Legion
      const legions = legionCoordinator.getAllLegions();
      const agentCount = legions.reduce((acc, l) => acc + l.members.length, 0);

      // Sync with IPMS (Mock)
      const projects = await ipmsService.getProjects();

      // Update State
      this.metrics.activeAgents = agentCount;
      this.metrics.activeProjects = projects.length;
      this.metrics.systemHealth = this.calculateHealth();

      this.emitStreamUpdate({
        id: `pulse-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'SYSTEM',
        priority: 'LOW',
        message: 'Nexus Heartbeat Synced',
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Nexus Sync Failed', { error });
    }
  }

  private calculateHealth(): 'STABLE' | 'OPTIMAL' | 'CRITICAL' {
    if (this.metrics.complianceRate < 0.8) return 'CRITICAL';
    if (this.metrics.complianceRate > 0.95 && this.metrics.activeAgents > 0) return 'OPTIMAL';
    return 'STABLE';
  }

  public getGlobalMetrics(): IGlobalMetrics {
    return { ...this.metrics };
  }

  public getStream(limit: number = 50): INexusStreamItem[] {
    return this.stream.slice(0, limit);
  }

  public emitStreamUpdate(item: INexusStreamItem) {
    this.stream.unshift(item);
    if (this.stream.length > 200) this.stream.pop();
    omniLogger.info(LogCategory.INTEGRATION, `[Nexus] ${item.source}: ${item.message}`);
  }
}

export const omniNexus = OmniNexusService.getInstance();
