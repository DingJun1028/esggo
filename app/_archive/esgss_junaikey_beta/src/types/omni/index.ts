import { z } from 'zod';

// ==================== OMNI CRYSTAL CORE ====================

export const OmniCrystalSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Perception', 'Cognition', 'Memory', 'Expression', 'Nexus']),
  description: z.string(),
  state: z.enum(['Fragmented', 'Crystallizing', 'Restored', 'Perfected']),
  integrity: z.number(),
  fragmentsCollected: z.number(),
  fragmentsRequired: z.number(),
  personalSettings: z.optional(z.object({
    language: z.string(),
    theme: z.enum(['light', 'dark', 'aqua']),
    notifications: z.boolean(),
    aiTone: z.enum(['professional', 'friendly', 'zen']),
    customLabels: z.array(z.string()).optional(),
  })),
});
export type OmniCrystal = z.infer<typeof OmniCrystalSchema>;

export interface PersonalSettings {
  language: string;
  theme: 'light' | 'dark' | 'aqua';
  notifications: boolean;
  aiTone: 'professional' | 'friendly' | 'zen';
  customLabels?: string[];
}

export type CrystalState = 'inactive' | 'initializing' | 'active' | 'suspended' | 'terminated';
export type CrystalType = 'OmniEsgCell' | 'OmniAgent' | 'OmniService' | 'OmniProxy';

export class DateTime {
  private readonly timestamp: number;

  constructor(value?: string | number | Date) {
    this.timestamp = value ? new Date(value).getTime() : Date.now();
  }

  toISOString(): string {
    return new Date(this.timestamp).toISOString();
  }

  valueOf(): number {
    return this.timestamp;
  }
}

// ==================== SYSTEMS VITALS & METRICS ====================

export interface TrinityState {
  perception: number;
  cognition: number;
  action: number;
}

export interface OperationalKpi {
  efficiency: { hoursSaved: number; reportLatency: number; commFriction: number };
  sanctity: { ocrAccuracy: number; gapCoverage: number };
  resonance: { actionFrequency: number; autoInterventions: number };
  integrity: { apiSyncRate: number; responseDelay: number };
}

export type CircuitStatus = 'OPEN' | 'CLOSED';

export interface ComponentGrowth {
  heat: number;
  evolutionLevel: number;
  lastInteraction: number;
  circuitStatus: CircuitStatus;
}

export interface SystemVital {
  evolutionStage: number;
  contextLoad: number;
  activeThreads: number;
  memoryNodes: number;
  entropy: number;
  integrityScore: number;
  trinity: TrinityState;
  synergyLevel: number;
  activeCircuits: number;
  isEvolving?: boolean;
  kpis: OperationalKpi;
}

// ==================== KNOWLEDGE & LOGIC ====================

export type OmniEsgTrait =
  | 'learning'
  | 'optimization'
  | 'bridging'
  | 'evolution'
  | 'seamless'
  | 'gap-filling';
export type OmniEsgDataLink = 'live' | 'ai' | 'blockchain' | 'eternal_sync';
export type OmniEsgMode = 'card' | 'list' | 'compact' | 'cell' | 'badge';
export type OmniEsgConfidence = 'high' | 'medium' | 'low';
export type OmniEsgColor = 'emerald' | 'gold' | 'purple' | 'blue' | 'cyan' | 'rose' | 'slate' | 'aqua';

export interface OmniLabel {
  text?: string; // Added text property as it is used in evolutionEngine
  semantics: string[]; // e.g., ["Identity", "Email"]
  importance: number | 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
  uiWidget?: string;
  autoFill?: 'static' | 'evolutionary' | 'ai';
  defaultValue?: unknown;
  validation?: {
    pattern?: string;
    errorMessage?: string;
    strict?: boolean;
    min?: number;
    max?: number;
  };
  accessLevel?: 'public' | 'internal' | 'private' | 'restricted';
  pii?: boolean;
  encrypted?: boolean;
  learnable?: boolean;
  adaptiveLayout?: boolean;
  version?: string;
  createdAt?: string;
  extensions?: Record<string, unknown>;

  definition?: string;
  formula?: string;
  rationale?: string;
  id?: string;
  uuid?: string; // Phase 5: Traceability
  source_origin?: string; // Phase 5: Traceability

  // 🌟 Awakening Form Extensions (Omni Awakening)
  awakeningState?: 'dormant' | 'awakening' | 'awakened';
  syncConfig?: {
    enabled: boolean;
    mode: 'unidirectional' | 'bidirectional' | 'permanent_binding';
    autoSync: boolean;
    frequency: 'realtime' | 'eternal'; // Eternal = Permanent Websocket/Subscription
    sourceSystem?: string;
    targetSystem?: string;
  };
}

export class OmniLabelFactory {
  static customerIdentifier(): OmniLabel {
    return {
      semantics: ['Customer.Identifier'],
      importance: 'High',
      uiWidget: 'CustomerSearchComboBox',
      validation: {
        pattern: '^[A-Z]{3}-\\d{4}$',
        errorMessage: 'Invalid format (expected: ABC-1234)',
        strict: true,
      },
      accessLevel: 'private',
      pii: true,
      autoFill: 'evolutionary',
      learnable: true,
    };
  }
  static esgMetric(category: 'E' | 'S' | 'G'): OmniLabel {
    return {
      semantics: [`ESG.${category}.Metric`],
      importance: 'Critical',
      uiWidget: 'ESGMetricCard',
      validation: { min: 0, strict: true },
      learnable: true,
      adaptiveLayout: true,
      accessLevel: 'internal',
    };
  }
  static fromJSONSchema(schema: Record<string, unknown>): OmniLabel {
    const omniLabel = (schema['x-omni-label'] as Record<string, unknown>) || {};
    return {
      semantics: (omniLabel['semantics'] as string[]) || ['Generic'],
      importance: (omniLabel['importance'] as OmniLabel['importance']) || 'Medium',
      uiWidget: omniLabel['ui-widget'] as string,
      validation: schema.pattern ? { pattern: schema.pattern as string } : undefined,
      accessLevel: (omniLabel['access-level'] as OmniLabel['accessLevel']) || 'public',
    };
  }
}

export interface OmniKnowledgeNode {
  id: string;
  type: 'component' | 'concept' | 'data';
  label: OmniLabel;
  currentValue: unknown;
  traits: OmniEsgTrait[];
  confidence: OmniEsgConfidence;
  lastInteraction: number;
  interactionCount: number;
  memory: { history: unknown[]; aiInsights: unknown[] };
  growth: ComponentGrowth;
}

export interface QuantumNode {
  id: string;
  atom: string;
  vector: string[];
  weight: number;
  source: string;
  growth?: ComponentGrowth;
  label?: unknown;
}

export interface NeuralSignal {
  id: string;
  origin: string;
  type:
  | 'DATA_COLLISION'
  | 'LOGIC_RESONANCE'
  | 'ENTROPY_PURGE'
  | 'RUNE_ACTIVATION'
  | 'CIRCUIT_TRIP'
  | 'MEMORY_COMMITTED';
  intensity: number;
  payload?: unknown;
  timestamp: number;
}

export interface LogicWitness {
  witnessHash: string;
}

// ==================== ETERNAL MEMORY & EVOLUTION ====================

export interface EternalPalaceConfig {
  endpoint?: string;
  encryption: 'aes-256' | 'post-quantum';
  mode: 'read-only' | 'write-only' | 'read-write';
  timeout?: number;
}

export interface Connection {
  id: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: DateTime;
  lastActivity?: DateTime;
}

export type MemoryQueryType =
  | 'evolution-history'
  | 'omniscient-retro'
  | 'causal-insight'
  | 'eternal-resonance'
  | 'best-practices';

export interface MemoryQuery {
  type: MemoryQueryType;
  crystalId?: string;
  timestamp?: DateTime;
  query?: string;
  params?: Record<string, unknown>;
}

export interface MemoryResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: { queryTime: number; source: string; confidence?: number };
}

export interface SystemSnapshot {
  timestamp: DateTime;
  state: Record<string, unknown>;
  metadata: { version: string; crystalCount: number };
}

export type EvolutionEvent = {
  type:
  | 'initialization'
  | 'execution'
  | 'evolution'
  | 'termination'
  | 'error'
  | 'ultimate-awakening'
  | 'RITUAL_SECRET_OPENING';
  timestamp: string | DateTime;
  data: Record<string, any>;
  context?: Context;
  result?: unknown;
};

export interface EvolutionHistory {
  crystalId: string;
  events: EvolutionEvent[];
  createdAt: DateTime;
  lastUpdated: DateTime;
}

export interface Context {
  input: unknown;
  metadata?: Record<string, unknown>;
  trace?: string[];
}

export interface Result {
  success: boolean;
  output?: unknown;
  error?: Error;
  metadata?: Record<string, unknown>;
}

export interface CausalStep {
  event: string;
  timestamp: DateTime;
  impact: number;
  relatedEvents: string[];
}

export interface CausalChain {
  rootCause: string;
  steps: CausalStep[];
  confidence: number;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: DateTime;
}

export interface Impact {
  target: string;
  type: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  probability: number;
}

export interface ImpactGraph {
  action: string;
  directImpacts: Impact[];
  indirectImpacts: Impact[];
  totalScore: number;
}

export interface Decision {
  id: string;
  description: string;
  options: string[];
  context: Context;
}

export interface Alternative {
  option: string;
  pros: string[];
  cons: string[];
  riskScore: number;
  expectedOutcome: string;
}

export interface Pattern {
  id: string;
  type: string;
  description: string;
  frequency: number;
  lastSeen: DateTime;
  examples: unknown[];
}

export interface Knowledge {
  id: string;
  domain: string;
  content: unknown;
  confidence: number;
  sources: string[];
}

export interface Reference {
  sourceId: string;
  targetId: string;
  relationType: 'related' | 'derived' | 'contradicts' | 'supports';
  strength: number;
}

export interface Fragment {
  id: string;
  content: unknown;
  source: string;
  timestamp: DateTime;
}

export interface Wisdom {
  synthesis: string;
  sources: string[];
  confidence: number;
  applicability: string[];
}

export interface Feedback {
  success: boolean;
  metrics?: Record<string, number>;
  error?: Error;
  suggestions?: string[];
}

export interface Evolution {
  optimizations: string[];
  improvements: Record<string, unknown>;
  confidence: number;
}

export interface EvolutionLogEntry {
  id: string;
  timestamp: number;
  action: string;
  details?: string;
  type: 'OPTIMIZATION' | 'ALERT' | 'INFO';
}

// ==================== INTERFACES ====================

export interface EternalMemoryLink {
  connect(): Promise<Connection>;
  query(request: MemoryQuery): Promise<MemoryResponse>;
  recordEvolution(event: EvolutionEvent): Promise<void>;
  disconnect(): Promise<void>;
}

export interface OmniscientRetro {
  queryStateAt(timestamp: DateTime): Promise<SystemSnapshot>;
  traceEvolution(componentId: string): Promise<EvolutionHistory>;
  reconstructContext(eventId: string): Promise<Context>;
}

export interface CausalInsight {
  getRootCause(anomaly: Anomaly): Promise<CausalChain>;
  predictImpact(action: string): Promise<ImpactGraph>;
  findAlternatives(decision: Decision): Promise<Alternative[]>;
}

export interface EternalResonance {
  findPatterns(query: string): Promise<Pattern[]>;
  crossReference(knowledge: Knowledge): Promise<Reference[]>;
  synthesize(fragments: Fragment[]): Promise<Wisdom>;
}

export interface OmniCrystalCore {
  readonly crystalId: string;
  readonly crystalType: CrystalType;
  readonly createdAt: DateTime;
  readonly memoryLink: EternalMemoryLink;
  initialize(): Promise<void>;
  execute(context: Context): Promise<Result>;
  evolve(feedback: Feedback): Promise<Evolution>;
  suspend(): Promise<void>;
  resume(): Promise<void>;
  terminate(): Promise<void>;
}

export const NCB_CONFIG = {
  baseUrl: 'http://localhost:8080',
  instanceId: 'junaikey_v1',
  token: 'dev-token-placeholder',
};

// ==================== LOGS & FILES ====================

export interface KernelLog {
  id: string;
  timestamp: number;
  source:
  | 'KERNEL'
  | 'MCP'
  | 'EVOLUTION'
  | 'BACKEND'
  | 'AUTH'
  | 'MANIFEST'
  | 'SYNC'
  | 'RAG'
  | 'LOGIC'
  | 'SEC'
  | 'FINANCE';
  operation: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  metadata?: unknown;
}

export interface AppFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadedAt: number;
  url: string;
}

export interface BidirectionalSyncBridge {
  sourceSystem: 'ESG_SYSTEM' | 'BOOST_SPACE' | 'JUNAIKEY_HUB';
  targetSystem: 'ESG_SYSTEM' | 'BOOST_SPACE' | 'JUNAIKEY_HUB';
  mappings: {
    entityMappings: Record<string, string>;
    fieldMappings: Record<string, string>;
    workflowMappings: Record<string, string>;
  };
  syncRules: {
    triggerEvents: string[];
    conflictResolution: 'SOURCE_WINS' | 'TARGET_WINS' | 'MERGE' | 'MANUAL';
    frequency: 'REAL_TIME' | 'MINUTELY' | 'HOURLY' | 'DAILY';
  };
  healthMetrics: {
    lastSync: number;
    successRate: number;
    latency: number;
    errorCount: number;
  };
}

export * from './evolution.js';
