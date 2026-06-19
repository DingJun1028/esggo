import {
  Legion,
  LegionId,
  LegionState,
  LegionFormation,
  LegionMember,
  BattleStrategy,
  StrategyType,
  MissionObjective,
  MissionAssignment,
  MissionProgress,
  MissionStatus,
  MissionRecord,
  ExecutionResult,
  LegionSyncState,
  CoordinationProtocol,
  CollaborationEvent,
  FORMATION_CONFIGS,
} from '@/types';
import { DateTime } from '@/types';
import type { Agent } from '@/types';
import type { ActiveAvatar } from '@/types';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { OMNI_AGENTS } from '@/data/omni-agents';

/**
 * Legion Coordinator Class
 */
export class OmniLegionCoordinator {
  private legions: Map<LegionId, Legion> = new Map();
  private missionProgress: Map<string, MissionProgress> = new Map();
  private syncStates: Map<LegionId, LegionSyncState> = new Map();

  /**
   * Form Legion
   */
  async formLegion(
    name: string,
    members: Agent[], // Legacy support, but we extract archetype data
    avatars: Map<string, ActiveAvatar>,
    formation: LegionFormation = LegionFormation.BALANCED
  ): Promise<Legion> {
    try {
      // Check for duplicate name
      if (Array.from(this.legions.values()).some(l => l.name === name)) {
        throw new Error(`Legion with name "${name}" already exists`);
      }

      // Validate formation requirements
      const formationConfig = FORMATION_CONFIGS[formation];
      if (!formationConfig) {
        throw new Error(`Unknown formation: ${formation}`);
      }
      if (members.length < formationConfig.minAgents) {
        throw new Error(
          `Formation ${formationConfig.displayName} requires at least ${formationConfig.minAgents} agents`
        );
      }

      const legionId: LegionId = `legion-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const now = new DateTime();

      // Create legion members
      const legionMembers: LegionMember[] = members.map(agent => {
        // Find archetype data if available
        const archetype = OMNI_AGENTS.find(a => a.alias === agent.name || a.id === agent.id);
        const avatar = avatars.get(agent.id);

        return {
          agent,
          avatar:
            avatar ||
            // @ts-ignore
            ({
              currentPersona: archetype?.type === 'E' ? 'Environmentalist' : 'Strategist',
            } as any),
          role: this.assignRole(archetype?.type || 'U', formation),
          joinedAt: now,
          member_status: 'active',
          contributions: {
            tasksCompleted: 0,
            totalActiveTime: 0,
            successRate: 1.0,
            teamworkScore: 85,
          },
        };
      });

      // Select commander
      const commander = legionMembers.reduce((prev, current) =>
        current.agent.level > prev.agent.level ? current : prev
      ).agent.id;

      // Create legion
      const legion: Legion = {
        legionId,
        name,
        motto: this.generateMotto(formation),
        members: legionMembers,
        commander,
        formation,
        legion_status: LegionState.READY,
        activeMissions: [],
        missionHistory: [],
        level: 1,
        experience: 0,
        reputation: 50,
        stats: {
          totalMissions: 0,
          successfulMissions: 0,
          failedMissions: 0,
          totalActiveTime: 0,
          averageSuccessRate: 0,
        },
        createdAt: now,
        lastActiveAt: now,
      };

      this.legions.set(legionId, legion);
      this.initializeSyncState(legionId);

      omniLogger.info(LogCategory.LEGION, `⚔️ Legion formed successfully: ${name} (${formation})`, {
        memberCount: legionMembers.length,
        commander: members.find(a => a.id === commander)?.name,
      });
      return legion;
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, `Failed to form legion: ${name}`, { error });
      throw error;
    }
  }

  /**
   * Calculate Legion Coherence (Semantic Resonance)
   */
  calculateLegionCoherence(legionId: LegionId): number {
    const legion = this.legions.get(legionId);
    if (!legion) return 0;

    // Base coherence starts high
    let coherence = 90;

    // Penalty for conflicting archetypes if too many types are present
    const types = new Set(
      legion.members.map(m => {
        const archetype = OMNI_AGENTS.find(a => a.id === m.agent.id);
        return archetype?.type || 'U';
      })
    );

    if (types.size > 2) coherence -= 10;
    if (types.size > 3) coherence -= 15;

    // Bonus for Omni agents facilitating communication
    const omniCount = legion.members.filter(m => {
      const archetype = OMNI_AGENTS.find(a => a.id === m.agent.id);
      return archetype?.type === 'U';
    }).length;

    coherence += omniCount * 5;

    return Math.min(100, Math.max(0, coherence));
  }

  /**
   * Assign Mission
   */
  async assignMission(legionId: LegionId, mission: MissionObjective): Promise<void> {
    try {
      const legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`Legion ${legionId} does not exist`);
      }

      if (
        legion.legion_status !== LegionState.READY &&
        legion.legion_status !== LegionState.IN_MISSION
      ) {
        throw new Error(`Legion status ${legion.legion_status} cannot accept new missions`);
      }

      // Verify if legion meets mission requirements
      if (legion.members.length < mission.requirements.minAgents) {
        throw new Error(`Mission requires at least ${mission.requirements.minAgents} agents`);
      }

      // Add to active missions
      legion.activeMissions.push(mission);
      legion.legion_status = LegionState.IN_MISSION;

      // Create mission progress
      const progress: MissionProgress = {
        missionId: mission.missionId,
        mission_status: MissionStatus.ASSIGNED,
        completionRate: 0,
        qualityScore: 0,
        lastUpdated: new DateTime(),
        resourceUsage: {
          cpuTime: 0,
          memoryPeak: 0,
          apiCalls: 0,
        },
        issues: [],
        milestones: [],
      };

      this.missionProgress.set(mission.missionId, progress);

      // Distribute tasks to members
      await this.distributeTasks(legionId, mission);

      omniLogger.info(LogCategory.LEGION, `📋 Mission assigned: ${mission.name} → ${legion.name}`);
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, `Failed to assign mission: ${mission.name}`, {
        error,
        legionId,
      });
      throw error;
    }
  }

  /**
   * Execute Strategy
   */
  async executeStrategy(legionId: LegionId, strategy: BattleStrategy): Promise<ExecutionResult> {
    const startTime = Date.now();
    let legion: Legion | undefined;
    let mission: MissionObjective | undefined;

    try {
      legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`Legion ${legionId} does not exist`);
      }

      if (legion.activeMissions.length === 0) {
        throw new Error(`Legion ${legion.name} has no active missions`);
      }

      legion.currentStrategy = strategy;

      omniLogger.info(
        LogCategory.LEGION,
        `🎯 Executing Strategy: ${strategy.name} (${strategy.type})`
      );

      // Simulate strategy execution
      mission = legion.activeMissions[0];
      if (!mission) throw new Error('No active mission found');

      const progress = this.missionProgress.get(mission.missionId);

      if (progress) {
        progress.mission_status = MissionStatus.IN_PROGRESS;
        progress.startedAt = new DateTime();

        // Simulate mission execution (simplified)
        await this.simulateMissionExecution(legion, mission, strategy, progress);

        progress.mission_status = MissionStatus.COMPLETED;
        progress.completionRate = 100;
        progress.qualityScore = 85 + Math.random() * 10; // 85-95

        // Record mission history
        const record: MissionRecord = {
          mission,
          progress,
          participants: legion.members.map(m => m.agent.id),
          startedAt: progress.startedAt!,
          completedAt: new DateTime(),
          outcome: 'success',
          finalScore: progress.qualityScore,
          lessonsLearned: [
            `${strategy.name} strategy performed excellently`,
            `${legion.formation} formation effect was good`,
            'Team collaboration smooth',
          ],
        };

        legion.missionHistory.push(record);
        legion.activeMissions = legion.activeMissions.filter(
          m => m.missionId !== mission!.missionId
        );

        // Update statistics
        legion.stats.totalMissions++;
        legion.stats.successfulMissions++;
        legion.stats.totalActiveTime += Date.now() - startTime;
        legion.stats.averageSuccessRate =
          legion.stats.successfulMissions / legion.stats.totalMissions;

        // Reward experience and reputation
        legion.experience += 500;
        legion.reputation = Math.min(100, legion.reputation + 5);

        // Update member contributions
        for (const member of legion.members) {
          member.contributions.tasksCompleted++;
          member.contributions.totalActiveTime += Date.now() - startTime;
        }

        if (legion.activeMissions.length === 0) {
          legion.legion_status = LegionState.READY;
        }
      }

      const executionTime = Date.now() - startTime;

      const result: ExecutionResult = {
        success: true,
        missionId: mission.missionId,
        output: {
          message: `Mission ${mission.name} executed successfully`,
          results: [],
        },
        metrics: {
          duration: executionTime,
          efficiency: 90 + Math.random() * 10,
          quality: progress?.qualityScore || 0,
          teamwork: 85 + Math.random() * 15,
        },
        issues: [],
        improvements: [
          'Communication efficiency can be further optimized',
          'Consider more aggressive strategies',
        ],
        completedAt: new DateTime(),
      };

      omniLogger.info(
        LogCategory.LEGION,
        `✅ Strategy execution complete: took ${executionTime} ms`
      );
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      omniLogger.error(LogCategory.LEGION, `Strategy execution failed`, {
        error,
        legionId,
        strategy,
      });

      // Ensure we return a failed result instead of crashing
      return {
        success: false,
        missionId: mission?.missionId || 'unknown',
        output: {
          message: `Execution failed: ${errorMessage}`,
          results: [],
        },
        metrics: {
          duration: executionTime,
          efficiency: 0,
          quality: 0,
          teamwork: 0,
        },
        issues: [errorMessage],
        improvements: [],
        completedAt: new DateTime(),
      };
    }
  }

  /**
   * Synchronize Legion
   */
  async synchronize(legionId: LegionId): Promise<LegionSyncState> {
    try {
      const syncState = this.syncStates.get(legionId);
      if (!syncState) {
        // If missing, try to re-initialize if legion exists
        const legion = this.legions.get(legionId);
        if (legion) {
          omniLogger.warn(
            LogCategory.LEGION,
            `Sync state missing for ${legionId}, re-initializing`
          );
          this.initializeSyncState(legionId);
          return this.syncStates.get(legionId)!;
        }
        throw new Error(`Legion ${legionId} sync state does not exist`);
      }
      const legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`Legion ${legionId} does not exist`);
      }

      // Update sync state
      for (const member of legion.members) {
        const memberState = syncState.memberStates.get(member.agent.id) || {
          lastSync: new DateTime(),
          syncQuality: 100,
          messageQueue: 0,
        };

        memberState.lastSync = new DateTime();
        memberState.syncQuality = 95 + Math.random() * 5;
        memberState.messageQueue = 0;

        syncState.memberStates.set(member.agent.id, memberState);
      }

      syncState.coherence = 95 + Math.random() * 5;
      syncState.latency = 10 + Math.random() * 20; // 10-30ms
      syncState.lastSyncAt = new DateTime();

      omniLogger.debug(LogCategory.LEGION, `🔄 Legion Synchronization: ${legion.name}`, {
        coherence: syncState.coherence,
      });

      return syncState;
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, `Failed to synchronize legion: ${legionId}`, { error });
      throw error;
    }
  }

  /**
   * Get Legion
   */
  getLegion(legionId: LegionId): Legion | undefined {
    return this.legions.get(legionId);
  }

  /**
   * Get all legions
   */
  getAllLegions(): Legion[] {
    return Array.from(this.legions.values());
  }

  /**
   * Disband Legion
   */
  async disbandLegion(legionId: LegionId): Promise<void> {
    try {
      const legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`Legion ${legionId} does not exist`);
      }

      if (legion.activeMissions.length > 0) {
        throw new Error(`Legion ${legion.name} still has active missions, cannot disbanded`);
      }

      legion.legion_status = LegionState.DISBANDED;
      this.legions.delete(legionId);
      this.syncStates.delete(legionId);

      omniLogger.info(LogCategory.LEGION, `💔 Legion disbanded: ${legion.name}`);
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, `Failed to disband legion: ${legionId}`, { error });
      throw error;
    }
  }

  /**
   * Get mission progress
   */
  getMissionProgress(missionId: string): MissionProgress | undefined {
    return this.missionProgress.get(missionId);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private assignRole(persona: string, formation: LegionFormation): string {
    // Assign roles based on persona and formation
    const roleMap: Record<string, string> = {
      warrior: 'Vanguard',
      guardian: 'Defense',
      assassin: 'Assassin',
      strategist: 'Strategic Consultant',
      tactician: 'Tactical Command',
      oracle: 'Oracle',
      analyst: 'Intelligence Analysis',
      researcher: 'Researcher',
      auditor: 'Quality Officer',
      innovator: 'Innovator',
      architect: 'Architect',
      artist: 'Designer',
      healer: 'Logistics Support',
      mentor: 'Mentor',
      diplomat: 'Diplomat',
    };

    return roleMap[persona] || 'Member';
  }

  private generateMotto(formation: LegionFormation): string {
    const mottos: Record<LegionFormation, string> = {
      [LegionFormation.ASSAULT]: 'Swift and Decisive!',
      [LegionFormation.BLITZ]: 'Lightning Strike, Unstoppable!',
      [LegionFormation.SIEGE]: 'Persistence and Accumulation!',
      [LegionFormation.FORTRESS]: 'Solid as a Rock, Protecting Everything!',
      [LegionFormation.GUARDIAN_WALL]: 'We are the Wall of Protection!',
      [LegionFormation.BALANCED]: 'Both Offensive and Defensive, Impeccable!',
      [LegionFormation.TACTICAL]: 'Flexible Adaptation, Conquering by Wisdom!',
      [LegionFormation.SCOUT]: 'Explore the Unknown, Seize the Initiative!',
      [LegionFormation.SUPPORT]: 'Solidarity, Mutual Benefit and Win-win!',
      [LegionFormation.SYNERGY]: 'Synergy, Infinite Possibilities!',
      [LegionFormation.VANGUARD]: 'Pioneer the Path, Forge Ahead!',
      [LegionFormation.IRONCLAD]: 'Impenetrable Fortress, Solid as Gold!',
      [LegionFormation.NETWORK]: 'Network Connection, Everywhere!',
      [LegionFormation.SHADOW]: 'Follow as a Shadow, Silent as Night!',
    };

    return mottos[formation];
  }

  private initializeSyncState(legionId: LegionId): void {
    const legion = this.legions.get(legionId);
    if (!legion) return;

    const memberStates = new Map<string, any>();
    for (const member of legion.members) {
      memberStates.set(member.agent.id, {
        lastSync: new DateTime(),
        syncQuality: 100,
        messageQueue: 0,
      });
    }

    const syncState: LegionSyncState = {
      legionId,
      protocol: CoordinationProtocol.HIERARCHICAL, // Default to Hierarchical
      coherence: 100,
      latency: 10,
      bandwidth: 1000,
      memberStates,
      lastSyncAt: new DateTime(),
    };

    this.syncStates.set(legionId, syncState);
  }

  private async distributeTasks(legionId: LegionId, mission: MissionObjective): Promise<void> {
    const legion = this.legions.get(legionId);
    if (!legion) return;

    // Simplified version: Assign tasks to each member
    for (const member of legion.members) {
      const assignment: MissionAssignment = {
        assignmentId: `assign - ${Date.now()} -${member.agent.id} `,
        missionId: mission.missionId,
        agentId: member.agent.id,
        persona: member.avatar.currentPersona,
        role: member.role,
        responsibilities: [`Execute ${mission.type} related tasks`],
        assignedAt: new DateTime(),
      };

      omniLogger.debug(LogCategory.LEGION, `  → ${member.agent.name} (${member.role})`, {
        assignmentId: assignment.assignmentId,
      });
    }
  }

  private async simulateMissionExecution(
    legion: Legion,
    mission: MissionObjective,
    strategy: BattleStrategy,
    progress: MissionProgress
  ): Promise<void> {
    // Simulate mission execution process
    const phases = 5;
    for (let i = 1; i <= phases; i++) {
      await this.sleep(200); // Simulate execution time
      progress.completionRate = (i / phases) * 100;
      progress.lastUpdated = new DateTime();
      omniLogger.debug(LogCategory.LEGION, `  Progress: ${progress.completionRate.toFixed(0)}%`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * Destroy Coordinator (Lifecycle)
   */
  destroy(): void {
    this.legions.clear();
    this.missionProgress.clear();
    this.syncStates.clear();
    omniLogger.info(LogCategory.SYSTEM, 'OmniLegionCoordinator destroyed');
  }
}

// Singleton Export
export const legionCoordinator = new OmniLegionCoordinator();
