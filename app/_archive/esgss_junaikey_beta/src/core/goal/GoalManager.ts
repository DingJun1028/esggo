/**
 * Jun.AI.Key - 目標管理服務 (Goal Management Service)
 * 認知層核心：定義、追蹤與評估系統目標
 */

import { v4 as uuidv4 } from 'uuid';

export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalStatus = 'pending' | 'active' | 'completed' | 'failed' | 'blocked';
export type OKRType = 'Cloud' | 'Pilot' | 'Sovereign' | 'Standard';

export interface KeyResult {
  id: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  progress: number; // calculated 0-100
}

export interface Goal {
  id: string;
  description: string;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number; // 0-100 (composite of KRs)
  type: OKRType;
  keyResults: KeyResult[];
  subGoals: string[]; // sub-goal IDs
  deadline?: number;
  createdAt: number;
  completedAt?: number;
  tags: string[];
}

export class GoalManager {
  private goals: Map<string, Goal> = new Map();

  constructor() {}

  /**
   * 設定新目標 (Objective)
   */
  createGoal(
    description: string,
    priority: GoalPriority = 'medium',
    tags: string[] = [],
    type: OKRType = 'Standard'
  ): Goal {
    const goal: Goal = {
      id: uuidv4(),
      description,
      priority,
      status: 'pending',
      progress: 0,
      type,
      keyResults: [],
      subGoals: [],
      createdAt: Date.now(),
      tags,
    };
    this.goals.set(goal.id, goal);
    return goal;
  }

  /**
   * 為目標添加關鍵結果 (Key Result)
   */
  addKeyResult(
    goalId: string,
    description: string,
    targetValue: number,
    unit: string,
    initialValue: number = 0
  ): KeyResult {
    const goal = this.goals.get(goalId);
    if (!goal) throw new Error(`Goal ${goalId} not found`);

    const kr: KeyResult = {
      id: uuidv4(),
      description,
      currentValue: initialValue,
      targetValue,
      unit,
      progress: (initialValue / targetValue) * 100,
    };

    goal.keyResults.push(kr);
    this.recalculateProgress(goalId);
    return kr;
  }

  /**
   * 更新關鍵結果進度
   */
  updateKRProgress(goalId: string, krId: string, currentValue: number): void {
    const goal = this.goals.get(goalId);
    if (!goal) throw new Error(`Goal ${goalId} not found`);

    const kr = goal.keyResults.find(k => k.id === krId);
    if (!kr) throw new Error(`Key Result ${krId} not found in goal ${goalId}`);

    kr.currentValue = currentValue;
    kr.progress = Math.min(100, Math.max(0, (currentValue / kr.targetValue) * 100));

    this.recalculateProgress(goalId);
  }

  /**
   * 重新計算目標總進度 (OKR 邏輯)
   */
  private recalculateProgress(goalId: string): void {
    const goal = this.goals.get(goalId);
    if (!goal || goal.keyResults.length === 0) return;

    const totalProgress = goal.keyResults.reduce((acc, kr) => acc + kr.progress, 0);
    const averageProgress = totalProgress / goal.keyResults.length;

    this.updateProgress(goalId, averageProgress);
  }

  /**
   * 更新目標進度
   */
  updateProgress(goalId: string, progress: number): Goal {
    const goal = this.goals.get(goalId);
    if (!goal) throw new Error(`Goal ${goalId} not found`);

    goal.progress = Math.min(100, Math.max(0, progress));

    if (goal.progress === 100 && goal.status !== 'completed') {
      goal.status = 'completed';
      goal.completedAt = Date.now();
    } else if (goal.progress < 100 && goal.status === 'completed') {
      goal.status = 'active';
      goal.completedAt = undefined;
    }

    if (goal.status === 'pending' && progress > 0) {
      goal.status = 'active';
    }

    return goal;
  }

  /**
   * 獲取所有目標
   */
  getGoals(filter?: { status?: GoalStatus; priority?: GoalPriority }): Goal[] {
    let allGoals = Array.from(this.goals.values());

    if (filter) {
      if (filter.status) {
        allGoals = allGoals.filter(g => g.status === filter.status);
      }
      if (filter.priority) {
        allGoals = allGoals.filter(g => g.priority === filter.priority);
      }
    }

    return allGoals.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * 任務與使命對齊檢查 (Alignment Check)
   */
  checkAlignment(goal: Goal): { aligned: boolean; issues: string[] } {
    const issues: string[] = [];

    // 簡單的規則檢查，模擬 MECE 原則審查
    if (goal.description.length < 5) {
      issues.push('Description too vague');
    }

    // 檢查是否有重複目標 (模擬)
    const duplicates = Array.from(this.goals.values()).filter(
      g => g.id !== goal.id && g.description.toLowerCase() === goal.description.toLowerCase()
    );
    if (duplicates.length > 0) {
      issues.push('Duplicate goal detected');
    }

    return {
      aligned: issues.length === 0,
      issues,
    };
  }

  /**
   * 從資料源批量加載 OKRs
   */
  loadOKRs(okrData: any[]): void {
    okrData.forEach(item => {
      const goal = this.createGoal(
        item.description,
        item.priority || 'medium',
        item.tags || [],
        item.type || 'Standard'
      );

      if (item.keyResults) {
        item.keyResults.forEach((kr: any) => {
          this.addKeyResult(
            goal.id,
            kr.description,
            kr.targetValue,
            kr.unit || '%',
            kr.initialValue || 0
          );
        });
      }
    });
  }
}
