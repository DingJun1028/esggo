// ESG Data Collector - M2 Data Collection Module
import { BehaviorSubject, Subscription } from 'rxjs';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { dataManager, DataOperationResult } from './dataManager';

// Collection Task Interface
export interface CollectionTask {
  id: string;
  name: string;
  dataSource: string;
  interval: number; // Seconds
  status: 'active' | 'paused' | 'error';
  lastRun?: number;
  nextRun?: number;
  config: Record<string, any>;
}

// Collector Config
export interface CollectorConfig {
  maxConcurrentTasks: number;
  defaultInterval: number;
  retryAttempts: number;
}

// Main Class
export class EsgDataCollector {
  private static instance: EsgDataCollector;
  private tasks: Map<string, CollectionTask> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  // Observable for detailed logs if needed
  private collectionLogs$ = new BehaviorSubject<string[]>([]);

  private constructor() {
    this.initializeDefaultTasks();
  }

  static getInstance(): EsgDataCollector {
    if (!EsgDataCollector.instance) {
      EsgDataCollector.instance = new EsgDataCollector();
    }
    return EsgDataCollector.instance;
  }

  // Start Collector
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    omniLogger.info(LogCategory.SYSTEM, 'ESG Data Collector Service Started');

    // Resume all active tasks
    this.tasks.forEach(task => {
      if (task.status === 'active') {
        this.scheduleTask(task);
      }
    });
  }

  // Stop Collector
  stop(): void {
    this.isRunning = false;
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();
    omniLogger.info(LogCategory.SYSTEM, 'ESG Data Collector Service Stopped');
  }

  // Add Task
  addTask(task: Omit<CollectionTask, 'status'>): string {
    const newTask: CollectionTask = {
      ...task,
      status: 'active',
    };
    this.tasks.set(newTask.id, newTask);

    if (this.isRunning) {
      this.scheduleTask(newTask);
    }

    return newTask.id;
  }

  // Remove Task
  removeTask(taskId: string): boolean {
    if (this.timers.has(taskId)) {
      clearInterval(this.timers.get(taskId));
      this.timers.delete(taskId);
    }
    return this.tasks.delete(taskId);
  }

  // Collect Data Immediately
  async collectDataNow(taskId: string): Promise<DataOperationResult<any>> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    const startTime = Date.now();
    try {
      // Simulation of data collection based on data source
      const data = await this.simulateCollection(task.dataSource, task.config);

      // Store data using DataManager
      await dataManager.store(task.dataSource, data);

      task.lastRun = Date.now();
      task.nextRun = Date.now() + task.interval * 1000;

      return {
        success: true,
        data,
        metadata: {
          operation: 'collect_data',
          timestamp: startTime,
          duration: Date.now() - startTime,
        },
      };
    } catch (error) {
      task.status = 'error';
      omniLogger.error(LogCategory.SYSTEM, `Collection failed for task ${taskId}`, { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Private Implementation

  private scheduleTask(task: CollectionTask): void {
    if (this.timers.has(task.id)) {
      clearInterval(this.timers.get(task.id));
    }

    // Interval execution
    const timer = setInterval(() => {
      if (this.isRunning && task.status === 'active') {
        this.collectDataNow(task.id);
      }
    }, task.interval * 1000);

    this.timers.set(task.id, timer);
  }

  public async fetchRealTimeMetrics() {
    return { E: 85 + Math.random() * 5, S: 70 + Math.random() * 5, G: 92 + Math.random() * 3 };
  }

  public getConnectionStatus(): 'connected' | 'disconnected' {
    return this.isRunning ? 'connected' : 'disconnected';
  }

  private async simulateCollection(source: string, config: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    switch (source) {
      case 'smart_meters':
        return {
          power_usage: 100 + Math.random() * 50,
          voltage: 220 + (Math.random() - 0.5) * 5,
          timestamp: Date.now(),
        };
      case 'iot_sensors':
        return {
          temperature: 25 + Math.random() * 5,
          humidity: 60 + Math.random() * 10,
          timestamp: Date.now(),
        };
      case 'api_connector':
        return {
          status: 'ok',
          external_id: Math.floor(Math.random() * 10000),
          payload: { value: Math.random() },
        };
      case 'carbon_emissions':
        return {
          scope1: 50 + Math.random() * 10,
          scope2: 30 + Math.random() * 5,
          unit: 'tCO2e',
        };
      default:
        return { value: Math.random(), note: 'Generic simulated data' };
    }
  }

  private initializeDefaultTasks(): void {
    this.tasks.set('default_meter_collection', {
      id: 'default_meter_collection',
      name: 'Factory Smart Meter',
      dataSource: 'smart_meters',
      interval: 60, // 1 min
      status: 'active',
      config: { targets: ['factory_a'] },
    });

    this.tasks.set('daily_emission_check', {
      id: 'daily_emission_check',
      name: 'Daily Carbon Emission',
      dataSource: 'carbon_emissions',
      interval: 86400, // 24 hours
      status: 'active',
      config: {},
    });
  }

  public destroy(): void {
    this.stop();
    this.tasks.clear();
    EsgDataCollector.instance = null!;
  }
}

export const esgDataCollector = EsgDataCollector.getInstance();
