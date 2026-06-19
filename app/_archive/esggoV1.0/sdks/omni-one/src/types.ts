export interface Task {
  id: string;
  content: string;
  context?: Record<string, any>;
  timestamp: number;
}

export interface TaskResult {
  taskId: string;
  status: 'success' | 'failure';
  output: string;
  insights?: string[];
  executionTime: number;
}

export interface Memory {
  id: string;
  taskId: string;
  taskContent: string;
  result: TaskResult;
  timestamp: number;
  tags: string[];
}

export interface SystemStatus {
  isAwake: boolean;
  isAutonomousMode: boolean;
  tasksProcessed: number;
  memoriesStored: number;
  learningCycles: number;
}
