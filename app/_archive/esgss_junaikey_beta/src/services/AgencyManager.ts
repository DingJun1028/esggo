/**
 * 🤖 AgencyManager: Collective Intelligence & Coordination
 * --------------------------------------------------
 * Handles Mission Matrix priorities and Smart Notifications.
 * Ensures all agents are aligned with global ESG goals.
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { geminiCore } from './ai/GeminiService.js';

export interface SmartNotification {
  id: string;
  type: 'ALERT' | 'INSIGHT' | 'ACTION';
  priority: 'CRITICAL' | 'HIGH' | 'LOW';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface MissionObjective {
  id: string;
  agentId: string;
  objective: string; // Used as 'title' in Mobile
  progress: number;
  threatLevel: 'STABLE' | 'ELEVATED' | 'DANGER';
  // Extended fields for Mobile UI
  priority: 'CRITICAL' | 'HIGH PRIORITY' | 'NORMAL' | 'LOW';
  deadline: string;
  assignee: string;
  status5T: '目標 Target' | '追蹤 Track' | '溯源 Origin' | '透明 Clear' | '轉型 Transform';
}

const MS_PER_MINUTE = 60000;
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const FIVE_MINUTES_MS = 5 * MS_PER_MINUTE;

import { ILearningCrystal } from '../lib/ucc-engine';
import { IKnowledgeCard } from '../types/game';

export class AgencyManager {
  private static instance: AgencyManager;
  private notifications: SmartNotification[] = [];
  private missions: MissionObjective[] = [];
  private achievements: ILearningCrystal[] = [];
  private knowledgeCards: IKnowledgeCard[] = [];
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): AgencyManager {
    if (!AgencyManager.instance) {
      AgencyManager.instance = new AgencyManager();
    }
    return AgencyManager.instance;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private createNotification(type: 'ALERT' | 'INSIGHT' | 'ACTION', title: string, message: string, priority: 'CRITICAL' | 'HIGH' | 'LOW' = 'LOW') {
    const notification: SmartNotification = {
      id: `NTF-${Date.now()}`,
      type,
      priority,
      title,
      message,
      timestamp: Date.now(),
      read: false
    };
    this.notifications = [notification, ...this.notifications];
    this.saveState();
  }

  private initializeMockData() {
    this.loadState();
    if (this.missions.length === 0) {
      // ... (existing mock data or empty init) ...
    }
  }

  private saveState() {
    try {
      const state = {
        missions: this.missions,
        achievements: this.achievements,
        knowledgeCards: this.knowledgeCards,
        notifications: this.notifications
      };
      localStorage.setItem('agency_manager_state', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save AgencyManager state', e);
    }
  }

  private loadState() {
    try {
      const stateStr = localStorage.getItem('agency_manager_state');
      if (stateStr) {
        const state = JSON.parse(stateStr);
        this.missions = state.missions || [];
        this.achievements = state.achievements || [];
        this.knowledgeCards = state.knowledgeCards || [];
        this.notifications = state.notifications || [];
      }
    } catch (e) {
      console.error('Failed to load AgencyManager state', e);
    }
  }

  // ... (existing getters: getNotifications, getMissions) ...
  public getNotifications(): SmartNotification[] {
    return [...this.notifications];
  }

  public getMissions(): MissionObjective[] {
    return [...this.missions];
  }

  public getAchievements(): ILearningCrystal[] {
    return [...this.achievements];
  }

  public getKnowledgeCards(): IKnowledgeCard[] {
    return [...this.knowledgeCards];
  }

  public markAsRead(id: string) {
    const ntf = this.notifications.find(n => n.id === id);
    if (ntf) {
      ntf.read = true;
      this.saveState();
      this.notify();
    }
  }

  public clearNotifications() {
    this.notifications = [];
    this.saveState();
    this.notify();
  }

  public async updateMissionProgress(id: string, delta: number) {
    const mission = this.missions.find(m => m.id === id);
    if (mission) {
      mission.progress = Math.min(100, mission.progress + delta);
      omniLogger.info(LogCategory.LEGION, `Mission ${id} progress updated to ${mission.progress}%`);
      this.saveState();
      this.notify();
    }
  }

  public async syncMissions(): Promise<MissionObjective[]> {
    // ... (existing syncMissions logic) ...
    omniLogger.info(LogCategory.SYSTEM, 'Syncing Mission Matrix with OmniIntelligence...');

    // Context for AI
    const context = `
      Current Status: Active ESG Operations.
      Focus: Energy Efficiency, Carbon Reduction, Social Impact.
      Time: ${new Date().toISOString()}
      Review current missions and generate 3-5 updated or new strategic objectives.
      Maintain a mix of priorities.
      Language: Traditional Chinese (繁體中文).
    `;

    const schema = `
      Array of MissionObjective objects:
      {
        id: string (e.g., MSN-XXX),
        agentId: string (e.g., AG-CARBON),
        objective: string (Description of the mission),
        progress: number (0-100),
        threatLevel: "STABLE" | "ELEVATED" | "DANGER",
        priority: "CRITICAL" | "HIGH PRIORITY" | "NORMAL" | "LOW",
        deadline: string (YYYY-MM-DD),
        assignee: string,
        status5T: "目標 Target" | "追蹤 Track" | "溯源 Origin" | "透明 Clear" | "轉型 Transform"
      }
    `;

    try {
      const newMissions = await geminiCore.generateStructuredData<MissionObjective[]>(context, schema);

      if (newMissions && Array.isArray(newMissions)) {
        this.missions = newMissions;
        this.saveState();
        omniLogger.info(LogCategory.AI, 'Mission Matrix Updated via AI', { count: this.missions.length });
        this.createNotification('ALERT', 'Mission Matrix Sync', `Received ${this.missions.length} strategic objectives.`, 'HIGH');
      } else {
        omniLogger.warn(LogCategory.AI, 'AI returned invalid mission structure, retaining previous state.');
      }
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Mission Sync Failed, using fallback', { error });
      if (this.missions.length === 0) {
        this.missions = [
          {
            id: 'MSN-FALLBACK-01',
            agentId: 'AG-SYSTEM',
            objective: 'System Integrity Check (Offline Mode)',
            progress: 0,
            threatLevel: 'STABLE',
            priority: 'NORMAL',
            deadline: new Date().toISOString().substring(0, 10),
            assignee: 'OmniAgent',
            status5T: '追蹤 Track'
          }
        ];
        this.saveState();
      }
    }

    this.notify();
    return this.getMissions();
  }

  /**
   * 🏺 Mind of Alchemy: Mint Learning Crystals
   * Generates "Trustworthy" achievements based on current context.
   */
  public async mintAchievements(userContext: string): Promise<ILearningCrystal[]> {
    omniLogger.info(LogCategory.SYSTEM, 'Minting Learning Crystals via OmniEngine...');

    const context = `
      User Context: ${userContext}
      Current Missions: ${JSON.stringify(this.missions.map(m => m.objective))}
      Time: ${new Date().toISOString()}
      Task: Analyze the user's progress and "crystallize" 2-3 new Learning Achievements (Crystals).
      Philosophy: "Service is Learning, Knowledge is Asset".
      Language: Traditional Chinese (繁體中文).
    `;

    const schema = `
      Array of ILearningCrystal objects:
      {
        uuid: string (e.g., CRYSTAL-XXX),
        version: "1.0.0",
        timestamp: number,
        formula: string (e.g., "Insight * Practice"),
        impactMetric: string (e.g., "95% Competency"),
        status: "Trustworthy",
        hash_lock: string (simulated hash),
        evidence: {
          tangible: { metric: string, timestamp: number },
          traceable: { source_origin: string },
          trackable: { lifecycle_hooks: [{ event: string, timestamp: number, actor: string }] },
          transparent: { formula: string },
          trustworthy: { hash_lock: string, is_frozen: true }
        },
        learning_objective: string,
        competency_tags: string[],
        resonance_level: number (0.0 to 1.0)
      }
    `;

    try {
      const newCrystals = await geminiCore.generateStructuredData<ILearningCrystal[]>(context, schema);

      if (newCrystals && Array.isArray(newCrystals)) {
        this.achievements = [...newCrystals, ...this.achievements];
        this.saveState();
        omniLogger.info(LogCategory.AI, 'Crystals Minted', { count: newCrystals.length });
        this.createNotification('INSIGHT', 'Crystal Crystallized', 'A new Learning Crystal has been forged.', 'CRITICAL');
        this.notify();
        return newCrystals;
      }
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Minting Failed', { error });
    }

    return [];
  }

  /**
   * 🃏 Village Oracle: Generate Knowledge Cards
   * Generates new Knowledge Cards based on the current village entropy and user status.
   */
  public async generateKnowledgeCards(userContext: string): Promise<IKnowledgeCard[]> {
    omniLogger.info(LogCategory.SYSTEM, 'Consulting Dr. Thoth for new Knowledge Cards...');

    const context = `
      User Context: ${userContext}
      Current Missions: ${JSON.stringify(this.missions.map(m => m.objective))}
      Time: ${new Date().toISOString()}
      Task: Generate 3 unique "Knowledge Cards" that help solve the current entropy issues in the village.
      Philosophy: "5T Protocol: Tangible, Traceable, Trackable, Transparent, Trustworthy".
      Language: Traditional Chinese (繁體中文).
    `;

    const schema = `
      Array of IKnowledgeCard objects:
      {
        uuid: string (e.g., CARD-XXX),
        name: string,
        category: "E" | "S" | "G" | "Omni",
        rank: "Common" | "Rare" | "Epic" | "Legendary",
        description: string,
        status: "Pending",
        evidence: {
          tangible_def: string (optional),
          source_origin: string (optional),
          formula_ref: string (optional)
        },
        visual_theme: "Emerald" | "Pink" | "Blue" | "Gold",
        isSealed: false
      }
    `;

    try {
      const newCards = await geminiCore.generateStructuredData<IKnowledgeCard[]>(context, schema);

      if (newCards && Array.isArray(newCards)) {
        this.knowledgeCards = [...newCards, ...this.knowledgeCards];
        this.saveState();
        omniLogger.info(LogCategory.AI, 'Knowledge Cards Materialized', { count: newCards.length });
        this.createNotification('ACTION', 'Oracle Insight', 'New Knowledge Cards have appeared in the Guild.', 'LOW');
        this.notify();
        return newCards;
      }
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Card Generation Failed, using fallback', { error });
      const fallbackCard: IKnowledgeCard = {
        uuid: `CARD-OFFLINE-${Date.now()}`,
        name: 'System Anomaly',
        category: 'Omni',
        rank: 'Common',
        description: 'A data fragment recovered while the Oracle was offline. Analyze to restore connectivity.',
        status: 'Pending',
        evidence: { source_origin: 'Offline_Backup_Protocol' },
        visual_theme: 'Blue',
        isSealed: false
      };
      // Add fallback card to history so user sees something
      this.knowledgeCards = [fallbackCard, ...this.knowledgeCards];
      this.saveState();
      this.notify();
      return [fallbackCard];
    }

    return [];
  }

  /**
   * 📊 Strategic Simulation: Run Advanced Analytics
   * Connects the Mission Matrix with predictive models.
   */
  public async runStrategicSimulation(target: string): Promise<any> {
    omniLogger.info(LogCategory.AI, `Running strategic simulation for: ${target}`);
    this.createNotification('INSIGHT', 'Simulation Started', `Analyzing future outcomes for ${target}...`, 'LOW');

    try {
      // Import on demand to avoid circular deps if any
      const { advancedAnalyticsService } = await import('./advanced-analytics.js');

      const result = await advancedAnalyticsService.trainModel(this.missions, {
        algorithm: 'xgboost',
        targetVariable: target,
        features: ['progress', 'threatLevel', 'priority'],
        hyperparameters: {}
      });

      this.createNotification('ACTION', 'Simulation Complete', `Optimization path for ${target} identified with ${Math.round(result.metrics.accuracy * 100)}% confidence.`, 'HIGH');
      this.notify();
      return result;
    } catch (error) {
      omniLogger.error(LogCategory.AI, 'Simulation Failed', { error });
      this.createNotification('ALERT', 'Simulation Error', 'The predictive engine encountered an anomaly.', 'HIGH');
      return null;
    }
  }
}

export const agencyManager = AgencyManager.getInstance();
