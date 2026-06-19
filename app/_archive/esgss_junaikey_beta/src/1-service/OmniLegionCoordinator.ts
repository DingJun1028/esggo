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
} from '@/types';
import type { Agent, ActiveAvatar } from '@/types';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { OMNI_AGENTS } from '@/data/omni-agents';
import { sovereignLedger } from './SovereignLedger';
import { FiveTValidator } from './FiveTValidator';
import { IComponentCore } from '@/types/esgss_schema';
import keccak256 from 'keccak256';

/**
 * 軍團協調器類
 */
export class OmniLegionCoordinator {
  private legions: Map<LegionId, Legion> = new Map();
  private missionProgress: Map<string, MissionProgress> = new Map();
  private syncStates: Map<LegionId, LegionSyncState> = new Map();

  /**
   * 組建軍團
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

      // 驗證陣型要求
      const formationConfig = FORMATION_CONFIGS[formation];
      if (!formationConfig) {
        throw new Error(`未知陣型: ${formation}`);
      }
      if (members.length < formationConfig.minAgents) {
        throw new Error(
          `陣型 ${formationConfig.displayName} 至少需要 ${formationConfig.minAgents} 名代理`
        );
      }

      const legionId: LegionId = `legion-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const now = new DateTime();

      // 創建軍團成員
      const legionMembers: LegionMember[] = members.map(agent => {
        // Find archetype data if available
        const archetype = OMNI_AGENTS.find(a => a.alias === agent.name || a.id === agent.id);
        const avatar = avatars.get(agent.id);

        return {
          agent,
          avatar:
            avatar ||
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

      // 選擇指揮官
      const commander = legionMembers.reduce((prev, current) =>
        current.agent.level > prev.agent.level ? current : prev
      ).agent.id;

      // 創建軍團
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

      omniLogger.info(LogCategory.LEGION, `⚔️ 軍團組建成功: ${name} (${formation})`, {
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
   * 計算軍團語義共振 (Coherence)
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
   * 分配任務
   */
  async assignMission(legionId: LegionId, mission: MissionObjective): Promise<void> {
    try {
      const legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`軍團 ${legionId} 不存在`);
      }

      if (
        legion.legion_status !== LegionState.READY &&
        legion.legion_status !== LegionState.IN_MISSION
      ) {
        throw new Error(`軍團狀態 ${legion.legion_status} 無法接受新任務`);
      }

      // 驗證軍團是否滿足任務要求
      if (legion.members.length < mission.requirements.minAgents) {
        throw new Error(`任務需要至少 ${mission.requirements.minAgents} 名代理`);
      }

      // 協助：添加到活躍任務
      legion.activeMissions.push(mission);
      legion.legion_status = LegionState.IN_MISSION;

      // 創建任務進度
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

      // 分配任務給成員
      await this.distributeTasks(legionId, mission);

      omniLogger.info(LogCategory.LEGION, `📋 任務已分配: ${mission.name} → ${legion.name}`);
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, `Failed to assign mission: ${mission.name}`, {
        error,
        legionId,
      });
      throw error;
    }
  }

  /**
   * 執行策略
   */
  async executeStrategy(legionId: LegionId, strategy: BattleStrategy): Promise<ExecutionResult> {
    const startTime = Date.now();
    let legion: Legion | undefined;
    let mission: MissionObjective | undefined;

    try {
      legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`軍團 ${legionId} 不存在`);
      }

      if (legion.activeMissions.length === 0) {
        throw new Error(`軍團 ${legion.name} 當前沒有活躍任務`);
      }

      legion.currentStrategy = strategy;

      omniLogger.info(LogCategory.LEGION, `🎯 執行策略: ${strategy.name} (${strategy.type})`);

      // 模擬策略執行
      mission = legion.activeMissions[0];
      if (!mission) throw new Error('No active mission found');

      const progress = this.missionProgress.get(mission.missionId);

      if (progress) {
        progress.mission_status = MissionStatus.IN_PROGRESS;
        progress.startedAt = new DateTime();

        // 模擬任務執行（簡化版）
        await this.simulateMissionExecution(legion, mission, strategy, progress);

        progress.mission_status = MissionStatus.COMPLETED;
        progress.completionRate = 100;
        progress.qualityScore = 85 + Math.random() * 10; // 85-95

        // 記錄任務歷史
        const record: MissionRecord = {
          mission,
          progress,
          participants: legion.members.map(m => m.agent.id),
          startedAt: progress.startedAt!,
          completedAt: new DateTime(),
          outcome: 'success',
          finalScore: progress.qualityScore,
          lessonsLearned: [
            `${strategy.name} 策略表現優異`,
            `${legion.formation} 陣型效果良好`,
            '團隊協作順暢',
          ],
        };

        legion.missionHistory.push(record);
        legion.activeMissions = legion.activeMissions.filter(
          m => m.missionId !== mission!.missionId
        );

        // 更新統計
        legion.stats.totalMissions++;
        legion.stats.successfulMissions++;
        legion.stats.totalActiveTime += Date.now() - startTime;
        legion.stats.averageSuccessRate =
          legion.stats.successfulMissions / legion.stats.totalMissions;

        // 獎勵經驗和聲望
        legion.experience += 500;
        legion.reputation = Math.min(100, legion.reputation + 5);

        // 更新成員貢獻
        for (const member of legion.members) {
          member.contributions.tasksCompleted++;
          member.contributions.totalActiveTime += Date.now() - startTime;
        }

        if (legion.activeMissions.length === 0) {
          legion.legion_status = LegionState.READY;
        }

        // 🛡️ 5T Protocol Integration: Create and Secure Evidence
        try {
          const evidencePayload = this.createMissionEvidence(
            mission,
            record,
            legion,
            progress.qualityScore
          );

          // 📈 Record in Sovereign Ledger
          await sovereignLedger.recordImpact(evidencePayload);

          // 🔐 Secure in Evidence Vault
          await FiveTValidator.pushToEvidenceVault(evidencePayload);

          omniLogger.info(
            LogCategory.LEGION,
            `🔐 5T Impact Secured in Ledger: ${mission.missionId}`
          );
        } catch (vaultError) {
          omniLogger.warn(LogCategory.LEGION, `⚠️ 5T Evidence Failed: ${mission.missionId}`, {
            error: vaultError,
          });
          // Note: We don't fail the mission execution itself, but we log the integrity warning
        }
      }

      const executionTime = Date.now() - startTime;

      const result: ExecutionResult = {
        success: true,
        missionId: mission.missionId,
        output: {
          message: `Mission Executed: ${mission.name} (Success)`,
          results: [],
        },
        metrics: {
          duration: executionTime,
          efficiency: 90 + Math.random() * 10,
          quality: progress?.qualityScore || 0,
          teamwork: 85 + Math.random() * 15,
        },
        issues: [],
        improvements: ['Communication protocols optimized', 'Strategy execution validated'],
        completedAt: new DateTime(),
      };

      omniLogger.info(LogCategory.LEGION, `✅ Strategy Executed: ${executionTime} ms`);
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
          message: `執行失敗: ${errorMessage}`,
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
   * 同步軍團
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
        throw new Error(`軍團 ${legionId} 同步狀態不存在`);
      }

      const legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`軍團 ${legionId} 不存在`);
      }

      // 更新同步狀態
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

      omniLogger.debug(LogCategory.LEGION, `🔄 軍團同步: ${legion.name}`, {
        coherence: syncState.coherence,
      });

      return syncState;
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, `Failed to synchronize legion: ${legionId}`, { error });
      throw error;
    }
  }

  /**
   * 獲取軍團
   */
  getLegion(legionId: LegionId): Legion | undefined {
    return this.legions.get(legionId);
  }

  /**
   * 獲取所有軍團
   */
  getAllLegions(): Legion[] {
    return Array.from(this.legions.values());
  }

  /**
   * 解散軍團
   */
  async disbandLegion(legionId: LegionId): Promise<void> {
    try {
      const legion = this.legions.get(legionId);
      if (!legion) {
        throw new Error(`軍團 ${legionId} 不存在`);
      }

      if (legion.activeMissions.length > 0) {
        throw new Error(`軍團 ${legion.name} 仍有活躍任務，無法解散`);
      }

      legion.legion_status = LegionState.DISBANDED;
      this.legions.delete(legionId);
      this.syncStates.delete(legionId);

      omniLogger.info(LogCategory.LEGION, `💔 軍團已解散: ${legion.name}`);
    } catch (error) {
      omniLogger.error(LogCategory.LEGION, `Failed to disband legion: ${legionId}`, { error });
      throw error;
    }
  }

  /**
   * 獲取任務進度
   */
  getMissionProgress(missionId: string): MissionProgress | undefined {
    return this.missionProgress.get(missionId);
  }

  /**
   * 🏗️ Construct 5T-compliant Evidence
   */
  private createMissionEvidence(
    mission: MissionObjective,
    record: MissionRecord,
    legion: Legion,
    score: number
  ): IComponentCore {
    const rawData = {
      missionId: mission.missionId,
      legionId: legion.legionId,
      outcome: record.outcome,
      score,
      participants: record.participants,
      timestamp: Date.now(),
    };

    // Convert object to string for hashing
    const dataString = JSON.stringify(rawData);
    const hash = keccak256(dataString).toString('hex');

    const component: IComponentCore = {
      uuid: `ev-${mission.missionId}-${Date.now()}`,
      version: '7.0.0-sentient',
      timestamp: Date.now(),
      status: 'Trustworthy',
      meridian: (score > 90 ? 'INWARD_REN' : 'OUTWARD_DU') as any,
      virtues: {
        intelligence: 8 + (score / 100) * 2,
        benevolence: 8.5,
        integrity: 9,
        courage: 8 + legion.level / 10,
        temperance: 8,
        harmony: 9,
      } as any,
      formula: 'Base + Strategy(Coordination)',
      impactMetric: 'Coherence',
      lock: () => {
        Object.freeze(component);
      },
      data: rawData,
      evidence: {
        metrics: { score, outcome: record.outcome }, // [1. Tangible]
        source_origin: `Legion:${legion.name}`, // [2. Traceable]
        lifecycle_hooks: [
          // [3. Trackable]
          {
            event: 'created',
            timestamp: Date.now(),
            actor: `Commander-${legion.commander}`,
            // Added strategy to avoid metadata being missing from type
            ...(legion.currentStrategy
              ? { metadata: { strategy: legion.currentStrategy.name } }
              : {}),
          },
        ],
        logic_formula: `Score(${score}) = Base + Strategy(${legion.currentStrategy?.type})`, // [4. Transparent]
        hash_lock: hash, // [5. Trustworthy] anchor
        manifest: {
          is_crystallized: true,
          // visual_grade: score > 95 ? 'SOVEREIGN' : 'PLATINUM', // Property doesn't exist on type
          qr_link: undefined,
          qr_entropy: hash.substring(0, 16),
        },
        verified_at: Date.now(),
      },
    };

    // Freeze for Trustworthy Protocol
    return Object.freeze(component);
  }

  // ============================================================================
  // 私有輔助方法
  // ============================================================================

  private assignRole(persona: string, formation: LegionFormation): string {
    // 根據人格和陣型分配角色
    const roleMap: Record<string, string> = {
      warrior: '前鋒',
      guardian: '防禦',
      assassin: '刺客',
      strategist: '策略顧問',
      tactician: '戰術指揮',
      oracle: '預言者',
      analyst: '情報分析',
      researcher: '研究員',
      auditor: '質量官',
      innovator: '創新者',
      architect: '架構師',
      artist: '設計師',
      healer: '後勤支援',
      mentor: '導師',
      diplomat: '外交官',
    };

    return roleMap[persona] || '成員';
  }

  private generateMotto(formation: LegionFormation): string {
    const mottos: Record<LegionFormation, string> = {
      [LegionFormation.ASSAULT]: '速戰速決！',
      [LegionFormation.BLITZ]: '閃電突襲，勢不可擋！',
      [LegionFormation.SIEGE]: '持之以恆，厚積薄發！',
      [LegionFormation.FORTRESS]: '堅若磐石，守護一切！',
      [LegionFormation.GUARDIAN_WALL]: '吾等即為守護之牆！',
      [LegionFormation.BALANCED]: '攻守兼備，無懈可擊！',
      [LegionFormation.TACTICAL]: '靈活應變，智取天下！',
      [LegionFormation.SCOUT]: '探索未知，洞悉先機！',
      [LegionFormation.SUPPORT]: '眾志成城，互助共贏！',
      [LegionFormation.SYNERGY]: '協同增效，無限可能！',
      [LegionFormation.VANGUARD]: '先鋒開路，勇往直前！',
      [LegionFormation.IRONCLAD]: '鐵壁銅牆，固若金湯！',
      [LegionFormation.NETWORK]: '網絡連結，無處不在！',
      [LegionFormation.SHADOW]: '如影隨形，無聲無息！',
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
      protocol: CoordinationProtocol.HIERARCHICAL, // 默認階層式
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

    // 簡化版：為每個成員分配任務
    for (const member of legion.members) {
      const assignment: MissionAssignment = {
        assignmentId: `assign - ${Date.now()} -${member.agent.id} `,
        missionId: mission.missionId,
        agentId: member.agent.id,
        persona: member.avatar.currentPersona,
        role: member.role,
        responsibilities: [`執行 ${mission.type} 相關任務`],
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
    // 模擬任務執行過程
    const phases = 5;
    for (let i = 1; i <= phases; i++) {
      await this.sleep(200); // 模擬執行時間
      progress.completionRate = (i / phases) * 100;
      progress.lastUpdated = new DateTime();
      omniLogger.debug(LogCategory.LEGION, `  進度: ${progress.completionRate.toFixed(0)}%`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * 銷毀協調器 (Lifecycle)
   */
  destroy(): void {
    this.legions.clear();
    this.missionProgress.clear();
    this.syncStates.clear();
    omniLogger.info(LogCategory.SYSTEM, 'OmniLegionCoordinator destroyed');
  }
}

// 單例導出
// 單例導出
export const omniLegionCoordinator = new OmniLegionCoordinator();
