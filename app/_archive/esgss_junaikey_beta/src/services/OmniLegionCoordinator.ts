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
  DateTime,
} from '../types.js';
import { useOmniMemory } from '../omni/infrastructure/memory/OmniMemory.js';
import type { Agent } from '../types.js';
import type { ActiveAvatar } from '../types.js';
import { omniLogger, LogCategory } from './omniLogger.js';
import { OMNI_AGENTS } from '../data/omni-agents.js';
import { OmniKnowledge } from '../omni/infrastructure/knowledge/OmniKnowledge.js';
import { Insight } from '../types/knowledge.js';

/**
 * Legion Coordinator Service (Omni Legion Coordinator Service)
 * Responsible for managing the formation of proxy legions, mission dispatching, and tactical execution
 */
export class OmniLegionCoordinator {
  private static instance: OmniLegionCoordinator;
  private legions: Map<LegionId, Legion> = new Map();
  private missionProgress: Map<string, MissionProgress> = new Map();
  private syncStates: Map<LegionId, LegionSyncState> = new Map();

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): OmniLegionCoordinator {
    if (!OmniLegionCoordinator.instance) {
      OmniLegionCoordinator.instance = new OmniLegionCoordinator();
    }
    return OmniLegionCoordinator.instance;
  }

  /**
   * Form Legion
   */
  async formLegion(
    name: string,
    members: Agent[],
    avatars: Map<string, ActiveAvatar>,
    formation: LegionFormation = LegionFormation.BALANCED
  ): Promise<Legion> {
    const formationConfig = FORMATION_CONFIGS[formation];
    if (members.length < formationConfig.minAgents) {
      throw new Error(
        `Formation ${formationConfig.displayName} requires at least ${formationConfig.minAgents} agents`
      );
    }

    const legionId: LegionId = `legion-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const now = new DateTime();

    const legionMembers: LegionMember[] = members.map(agent => {
      const archetype = OMNI_AGENTS.find(a => a.alias === agent.name || a.id === agent.id);
      const avatar = avatars.get(agent.id);

      return {
        agent,
        avatar:
          avatar ||
          ({ currentPersona: archetype?.type === 'E' ? 'Environmentalist' : 'Strategist' } as any),
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

    const commander = legionMembers.reduce((prev, current) =>
      current.agent.level > prev.agent.level ? current : prev
    ).agent.id;

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
  }

  calculateLegionCoherence(legionId: LegionId): number {
    const legion = this.legions.get(legionId);
    if (!legion) return 0;

    let coherence = 90;
    const types = new Set(
      legion.members.map(m => {
        const archetype = OMNI_AGENTS.find(a => a.id === m.agent.id);
        return archetype?.type || 'U';
      })
    );

    if (types.size > 2) coherence -= 10;
    if (types.size > 3) coherence -= 15;

    const omniCount = legion.members.filter(m => {
      const archetype = OMNI_AGENTS.find(a => a.id === m.agent.id);
      return archetype?.type === 'U';
    }).length;

    coherence += omniCount * 5;
    return Math.min(100, Math.max(0, coherence));
  }

  async assignMission(legionId: LegionId, mission: MissionObjective): Promise<void> {
    const legion = this.legions.get(legionId);
    if (!legion) throw new Error(`Legion ${legionId} does not exist`);

    if (
      legion.legion_status !== LegionState.READY &&
      legion.legion_status !== LegionState.IN_MISSION
    ) {
      throw new Error(`Legion status ${legion.legion_status} cannot accept new missions`);
    }

    if (legion.members.length < mission.requirements.minAgents) {
      throw new Error(`Mission requires at least ${mission.requirements.minAgents} agents`);
    }

    legion.activeMissions.push(mission);
    legion.legion_status = LegionState.IN_MISSION;

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
    await this.distributeTasks(legionId, mission);

    omniLogger.info(LogCategory.LEGION, `📋 Mission assigned: ${mission.name} → ${legion.name}`);
  }

  async executeStrategy(legionId: LegionId, strategy: BattleStrategy): Promise<ExecutionResult> {
    const legion = this.legions.get(legionId);
    if (!legion) throw new Error(`Legion ${legionId} does not exist`);

    if (legion.activeMissions.length === 0) {
      throw new Error(`Legion ${legion.name} has no active missions`);
    }

    const startTime = Date.now();
    legion.currentStrategy = strategy;

    omniLogger.info(
      LogCategory.LEGION,
      `🎯 Executing strategy: ${strategy.name} (${strategy.type})`
    );

    const mission = legion.activeMissions[0];
    if (!mission) throw new Error('No active mission found');
    const progress = this.missionProgress.get(mission.missionId);

    if (progress) {
      progress.mission_status = MissionStatus.IN_PROGRESS;
      progress.startedAt = new DateTime();

      await this.simulateMissionExecution(legion, mission, strategy, progress);

      progress.mission_status = MissionStatus.COMPLETED;
      progress.completionRate = 100;
      progress.qualityScore = 85 + Math.random() * 10;

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
          `${legion.formation} formation was effective`,
          'Team collaboration was smooth',
        ],
      };

      legion.missionHistory.push(record);
      legion.activeMissions = legion.activeMissions.filter(m => m.missionId !== mission.missionId);

      legion.stats.totalMissions++;
      legion.stats.successfulMissions++;
      legion.stats.totalActiveTime += Date.now() - startTime;
      legion.stats.averageSuccessRate =
        legion.stats.successfulMissions / legion.stats.totalMissions;

      legion.experience += 500;
      legion.reputation = Math.min(100, legion.reputation + 5);

      for (const member of legion.members) {
        member.contributions.tasksCompleted++;
        member.contributions.totalActiveTime += Date.now() - startTime;
      }

      if (legion.activeMissions.length === 0) {
        legion.legion_status = LegionState.READY;
      }

      try {
        const memory = useOmniMemory.getState();
        memory.reinforceConcept(strategy.type, 0.5);
        memory.reinforceConcept(legion.formation, 0.3);
        memory.addInteractionLog(`Legion Mission Success: ${mission.name} via ${strategy.name}`);

        if (progress.qualityScore > 90) {
          memory.updateEvolutionMetrics({
            patternRecognition:
              (memory.evolutionState.wisdomMetrics.patternRecognition || 0) + 0.01,
            inferenceSpeed: (memory.evolutionState.wisdomMetrics.inferenceSpeed || 0) + 0.1,
          });
        }
      } catch (err) {
        omniLogger.warn(
          LogCategory.KNOWLEDGE,
          'Failed to update OmniMemory from LegionCoordinator',
          err
        );
      }

      try {
        const insight: Insight = {
          id: `insight-${mission.missionId}`,
          sourceId: legionId,
          type: 'feedback',
          content: `Strategy ${strategy.name} used for ${mission.name} resulted in score ${progress.qualityScore}`,
          confidence: progress.qualityScore / 100,
          timestamp: Date.now(),
          relatedEntities: [mission.missionId, ...legion.members.map(m => m.agent.id)],
          impact: {
            metric: 'quality',
            value: progress.qualityScore,
          },
        };
        await OmniKnowledge.submitInsight(insight);
      } catch (err) {
        omniLogger.warn(LogCategory.KNOWLEDGE, 'Failed to submit insight to OmniKnowledge', err);
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
        'Can further optimize communication efficiency',
        'Consider more aggressive strategies',
      ],
      completedAt: new DateTime(),
    };

    omniLogger.info(
      LogCategory.LEGION,
      `✅ Strategy execution completed: Took ${executionTime} ms`
    );
    return result;
  }

  async synchronize(legionId: LegionId): Promise<LegionSyncState> {
    const syncState = this.syncStates.get(legionId);
    if (!syncState) throw new Error(`Legion ${legionId} sync state does not exist`);

    const legion = this.legions.get(legionId);
    if (!legion) throw new Error(`Legion ${legionId} does not exist`);

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
    syncState.latency = 10 + Math.random() * 20;
    syncState.lastSyncAt = new DateTime();

    omniLogger.debug(LogCategory.LEGION, `🔄 Legion sync: ${legion.name}`, {
      coherence: syncState.coherence,
    });
    return syncState;
  }

  getLegion(legionId: LegionId): Legion | undefined {
    return this.legions.get(legionId);
  }

  getAllLegions(): Legion[] {
    return Array.from(this.legions.values());
  }

  async disbandLegion(legionId: LegionId): Promise<void> {
    const legion = this.legions.get(legionId);
    if (!legion) throw new Error(`Legion ${legionId} does not exist`);

    if (legion.activeMissions.length > 0) {
      throw new Error(`Legion ${legion.name} still has active missions, cannot disband`);
    }

    legion.legion_status = LegionState.DISBANDED;
    this.legions.delete(legionId);
    this.syncStates.delete(legionId);
    omniLogger.info(LogCategory.LEGION, `💔 Legion disbanded: ${legion.name}`);
  }

  getMissionProgress(missionId: string): MissionProgress | undefined {
    return this.missionProgress.get(missionId);
  }

  private assignRole(persona: string, formation: LegionFormation): string {
    const roleMap: Record<string, string> = {
      warrior: 'Vanguard',
      guardian: 'Defense',
      assassin: 'Assassin',
      strategist: 'Strategic Consultant',
      tactician: 'Tactical Command',
      oracle: 'Prophet',
      analyst: 'Intel Analyst',
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
      [LegionFormation.ASSAULT]: 'Swift action, swift resolution!',
      [LegionFormation.BLITZ]: 'Blitzkrieg, unstoppable!',
      [LegionFormation.SIEGE]: 'Perseverance, steady progress!',
      [LegionFormation.FORTRESS]: 'Solid as a rock, protecting everything!',
      [LegionFormation.GUARDIAN_WALL]: 'We are the wall of protection!',
      [LegionFormation.BALANCED]: 'Balanced attack and defense, impeccable!',
      [LegionFormation.TACTICAL]: 'Flexible adaptation, winning by wisdom!',
      [LegionFormation.SCOUT]: 'Explore the unknown, gain insight!',
      [LegionFormation.SUPPORT]: 'Unity is strength, mutual win!',
      [LegionFormation.SYNERGY]: 'Synergistic efficiency, infinite possibilities!',
      [LegionFormation.VANGUARD]: 'Vanguard clear the way, moving forward!',
      [LegionFormation.IRONCLAD]: 'Iron body, invincible!',
      [LegionFormation.NETWORK]: 'Connecting everything, knowing all!',
      [LegionFormation.SHADOW]: 'Shadowless, waiting for the opportunity!',
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
      protocol: CoordinationProtocol.HIERARCHICAL,
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

    for (const member of legion.members) {
      const assignment: MissionAssignment = {
        assignmentId: `assign-${Date.now()}-${member.agent.id}`,
        missionId: mission.missionId,
        agentId: member.agent.id,
        persona: member.avatar.currentPersona,
        role: member.role,
        responsibilities: [`Execute tasks related to ${mission.type}`],
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
    const phases = 5;
    for (let i = 1; i <= phases; i++) {
      await this.sleep(200);
      progress.completionRate = (i / phases) * 100;
      progress.lastUpdated = new DateTime();
      omniLogger.debug(LogCategory.LEGION, `  Progress: ${progress.completionRate.toFixed(0)}%`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const omniLegionCoordinator = OmniLegionCoordinator.getInstance();
