export type DebugLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface DebugEvent {
  id: string;
  timestamp: number;
  level: DebugLevel;
  source: string;
  message: string;
  context?: Record<string, unknown>;
  error?: Error | unknown;
  duration?: number;
  stack?: string;
}

export interface DebugSnapshot {
  id: string;
  timestamp: number;
  name: string;
  data: Record<string, unknown>;
  tags?: string[];
}

export interface DebugMetrics {
  totalEvents: number;
  errorCount: number;
  warnCount: number;
  avgDuration?: number;
  slowestOperation?: string;
}

export interface DebugConfig {
  enabled: boolean;
  level: DebugLevel;
  remoteEndpoint?: string;
  bufferSize: number;
  captureConsole: boolean;
  captureErrors: boolean;
  captureWarnings: boolean;
}
