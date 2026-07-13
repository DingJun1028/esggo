interface Task {
  id: string
  type: 'analysis' | 'refactor' | 'test' | 'build' | 'deploy' | 'monitor' | 'optimize' | 'security'
  description: string
  parameters: Record<string, any>
  dependencies: string[]
  priority: 'high' | 'medium' | 'low'
  timeout: number
  retryCount: number
  tags: string[]
  createdAt: number
  metadata?: Record<string, any>
}

interface TaskResult {
  success: boolean
  result?: any
  error?: string
  metrics?: {
    executionTime: number
    memoryUsage?: number
    qualityScore?: number
    complianceScore?: number
  }
  suggestions?: string[]
  timestamp: number
}

interface MultiStepResult {
  success: boolean
  results: TaskResult[]
  summary: {
    totalTasks: number
    successfulTasks: number
    failedTasks: number
    executionTime: number
    averageQualityScore: number
  }
  recommendations: string[]
}

interface OptimizationStrategy {
  id: string
  description: string
  priority: 'high' | 'medium' | 'low'
  riskLevel: 'low' | 'medium' | 'high'
  estimatedTime: number
  estimatedCost: number
  tasks: OptimizationTask[]
  expectedImpact: {
    performance: number
    security: number
    quality: number
  }
}

interface OptimizationTask {
  id: string
  name: string
  description: string
  complexity: 'simple' | 'moderate' | 'complex'
  dependencies: string[]
  estimatedTime: number
  requiredSkills: string[]
}

interface ImplementationPlan {
  phases: ImplementationPhase[]
  totalPhases: number
  estimatedTotalTime: number
  budget?: string
  successMetrics: string[]
}

interface ImplementationPhase {
  phase: number
  description: string
  tasks: {
    name: string
    complexity: string
    dependencies: string[]
    estimatedTime: number
  }[]
  priority: string
  riskLevel: string
  estimatedTime: number
}

interface FeedbackReport {
  systemHealth: SystemHealth
  aiPerformance: AIPerformance
  coordinationMetrics: CoordinationMetrics
  recommendations: Recommendation[]
  nextReview: Date
}

interface SystemHealth {
  overallScore: number
  performance: {
    score: number
    responseTime: number
    throughput: number
  }
  memory: {
    usage: number
    available: number
  }
  cpu: {
    usage: number
  }
}

interface AIPerformance {
  modelLatency: number
  responseAccuracy: number
  costPerTask: number
  tasksProcessed: number
}

interface CoordinationMetrics {
  tasksCompleted: number
  collaborationEfficiency: number
  communicationLatency: number
}

interface Recommendation {
  category: 'performance' | 'security' | 'coordination' | 'quality'
  message: string
  priority: 'high' | 'medium' | 'low'
  action: string
}

interface StepResult {
  taskId: string
  success: boolean
  result?: any
  error?: string
  executionTime: number
  qualityScore: number
}

interface AgentStatus {
  name: string
  version: string
  status: 'online' | 'offline' | 'degraded' | 'maintenance'
  capabilities: string[]
  protocols: string[]
  health: SystemHealth
  uptime: number
  lastTask?: string
}

interface ExecutionContext {
  startTime: number
  currentTasks: string[]
  completedTasks: string[]
  failedTasks: string[]
  getLastTask(): string
}
