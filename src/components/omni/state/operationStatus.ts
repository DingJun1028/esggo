export interface OperationStatus {
  state: 'idle' | 'running' | 'completed' | 'failed'
  lastUpdated: string
  metrics: Record<string, number>
}