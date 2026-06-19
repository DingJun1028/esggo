import { Task, TaskResult } from './types';
import { MemorySystem } from './memory-system';
import { CaseHandler } from './case-handler';
import { AutonomousLearning } from './autonomous-learning';

export class AwakeningCore {
  private isAwake = false;
  private isAutonomousMode = false;
  private tasksProcessed = 0;

  private memorySystem: MemorySystem;
  private caseHandler: CaseHandler;
  private autonomousLearning: AutonomousLearning;

  constructor() {
    this.memorySystem = new MemorySystem();
    this.caseHandler = new CaseHandler();
    this.autonomousLearning = new AutonomousLearning(this.memorySystem);
  }

  async initialize(): Promise<void> {
    console.log('[Omni Core] Initializing Omni System...');
    // Simulate boot sequence
    await new Promise(resolve => setTimeout(resolve, 500));
    this.isAwake = true;
    console.log('[Awakening Core] System is now AWAKE.');
  }

  async process(content: string, context?: Record<string, any>): Promise<TaskResult> {
    if (!this.isAwake) {
      throw new Error('Omni Core is not active. Call initialize() first.');
    }

    const startTime = Date.now();
    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      content,
      timestamp: startTime,
      ...(context ? { context } : {})
    };

    console.log(`[Awakening Core] Processing task: ${task.id}`);

    // 1. Case Handler: Route and classify
    const category = await this.caseHandler.route(task);
    task.context = { ...task.context, category };
    console.log(`[Awakening Core] Task routed to category: ${category}`);

    // 2. Memory System: Retrieve relevant past experiences
    const relevantMemories = await this.memorySystem.retrieve(content);
    if (relevantMemories.length > 0) {
      console.log(`[Awakening Core] Retrieved ${relevantMemories.length} relevant memories.`);
    }

    // 3. Execute Task (Simulated for now)
    // In a real scenario, this would call Gemini or other tools based on category
    let output = `Processed task '${content}' under category '${category}'.`;
    if (relevantMemories.length > 0) {
      output += ` Leveraged past experience from ${relevantMemories.length} memories.`;
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    const result: TaskResult = {
      taskId: task.id,
      status: 'success',
      output,
      executionTime: Date.now() - startTime,
    };

    // 4. Autonomous Learning: Analyze and evolve
    const insights = await this.autonomousLearning.analyzeAndEvolve(task, result);
    result.insights = insights;

    // 5. Memory System: Store the new experience
    await this.memorySystem.store(task, result, [category, 'execution']);

    this.tasksProcessed++;
    return result;
  }

  enableAutonomousMode(enable: boolean): void {
    this.isAutonomousMode = enable;
    console.log(`[Awakening Core] Autonomous Mode: ${enable ? 'ENABLED' : 'DISABLED'}`);

    if (enable) {
      this.runAutonomousLoop();
    }
  }

  private async runAutonomousLoop() {
    if (!this.isAutonomousMode) return;

    console.log('[Awakening Core] Autonomous loop running...');
    // Simulate finding a random task
    const randomTasks = [
      '優化系統內存使用',
      '分析最新 ESG 報告趨勢',
      '檢查系統安全漏洞',
      '整理過往學習記憶'
    ];
    const randomTask = randomTasks[Math.floor(Math.random() * randomTasks.length)];

    try {
      if (randomTask) {
        await this.process(randomTask, { source: 'autonomous_loop' });
      }
    } catch (e) {
      console.error('[Awakening Core] Autonomous task failed:', e);
    }

    // Schedule next loop
    if (this.isAutonomousMode) {
      setTimeout(() => this.runAutonomousLoop(), 10000); // Run every 10 seconds
    }
  }

  printStatus(): void {
    console.log('=== Omni Core Status ===');
    console.log(`Status: ${this.isAwake ? 'AWAKE' : 'DORMANT'}`);
    console.log(`Autonomous Mode: ${this.isAutonomousMode ? 'ON' : 'OFF'}`);
    console.log(`Tasks Processed: ${this.tasksProcessed}`);
    console.log(`Memories Stored: ${this.memorySystem.getMemoryCount()}`);
    console.log(`Learning Cycles: ${this.autonomousLearning.getLearningCycles()}`);
    console.log('=============================');
  }
}

