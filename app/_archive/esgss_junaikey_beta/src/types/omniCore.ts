/**
 * Omnipotent Core
 * Triune Core Architecture
 *
 * Composition:
 * 1. Omnipotent Component - Reusable functional units
 * 2. Omnipotent Tag - Semantic tagging system
 * 3. Omnipotent Think Tank - Knowledge and reasoning engine
 */

// ============================================================================
// Phase 1: Omnipotent Tag
// ============================================================================

/**
 * Omnipotent Tag Base Interface
 * Minimum unit for all tags
 */
export interface OmniTag {
  /** Tag unique identifier */
  id: string;
  /** Tag type */
  type: OmniTagType;
  /** Tag name */
  name: string;
  /** Tag value */
  value: unknown;
  /** Metadata */
  metadata?: Record<string, unknown>;
  /** Creation time */
  createdAt: Date;
  /** Update time */
  updatedAt: Date;
}

/**
 * Tag Type Enumeration
 */
export enum OmniTagType {
  /** Perception Tag - Used for marking perception layer data */
  PERCEPTION = 'perception',
  /** Memory Tag - Used for marking memory fragments */
  MEMORY = 'memory',
  /** Reasoning Tag - Used for marking reasoning processes */
  REASONING = 'reasoning',
  /** Action Tag - Used for marking executed actions */
  ACTION = 'action',
  /** Skill Tag - Used for marking skill calls */
  SKILL = 'skill',
  /** Knowledge Tag - Used for marking knowledge snippets */
  KNOWLEDGE = 'knowledge',
  /** Context Tag - Used for marking contextual information */
  CONTEXT = 'context',
}

/**
 * Tag Set Interface
 */
export interface OmniTagSet {
  tags: OmniTag[];
  /** Add a tag */
  add(tag: OmniTag): void;
  /** Remove a tag */
  remove(tagId: string): void;
  /** Find tags by predicate */
  find(predicate: (tag: OmniTag) => boolean): OmniTag[];
  /** Find tags by type */
  findByType(type: OmniTagType): OmniTag[];
}

// ============================================================================
// Phase 2: Omnipotent Component
// ============================================================================

/**
 * Omnipotent Component Base Interface
 * Minimum unit for all components
 */
export interface OmniComponent<TInput = unknown, TOutput = unknown> {
  /** Component unique identifier */
  id: string;
  /** Component name */
  name: string;
  /** Component type */
  type: OmniComponentType;
  /** Component description */
  description?: string;
  /** Input Schema */
  inputSchema?: Record<string, unknown>;
  /** Output Schema */
  outputSchema?: Record<string, unknown>;
  /** Component state */
  state: OmniComponentState;
  /** Tag collection */
  tags: OmniTagSet;

  /** Initialize component */
  initialize(): Promise<void>;
  /** Execute component */
  execute(input: TInput): Promise<TOutput>;
  /** Validate input */
  validate(input: TInput): boolean;
  /** Cleanup resources */
  cleanup(): Promise<void>;
}

/**
 * Component Type Enumeration
 */
export enum OmniComponentType {
  /** Perception Component */
  PERCEPTION = 'perception',
  /** Memory Component */
  MEMORY = 'memory',
  /** Reasoning Component */
  REASONING = 'reasoning',
  /** Action Component */
  ACTION = 'action',
  /** Communication Component */
  COMMUNICATION = 'communication',
  /** Safety Component */
  SAFETY = 'safety',
  /** Learning Component */
  LEARNING = 'learning',
}

/**
 * Component States
 */
export enum OmniComponentState {
  /** Uninitialized */
  UNINITIALIZED = 'uninitialized',
  /** Ready */
  READY = 'ready',
  /** Executing */
  EXECUTING = 'executing',
  /** Error */
  ERROR = 'error',
  /** Cleaned */
  CLEANED = 'cleaned',
}

/**
 * Component Execution Result
 */
export interface OmniComponentResult<T = unknown> {
  /** Whether execution was successful */
  success: boolean;
  /** Result data */
  data?: T;
  /** Error message */
  error?: string;
  /** Execution time (ms) */
  executionTime: number;
  /** Generated tags */
  generatedTags: OmniTag[];
}

// ============================================================================
// Phase 3: Omnipotent Think Tank & ESG RAG
// ============================================================================

/**
 * ESG Knowledge Bases
 */
export enum ESGKnowledgeBase {
  ESG_STANDARDS = 'esg_standards',
  GRI_STANDARDS = 'gri_standards',
  TCFD_FRAMEWORK = 'tcfd_framework',
  SASB_STANDARDS = 'sasb_standards',
  SDGS_GOALS = 'sdgs_goals',
  CARBON_EMISSION = 'carbon_emission',
  ESG_REGULATIONS = 'esg_regulations',
  BEST_PRACTICES = 'best_practices',
}

/**
 * ARVO AI Reasoning Workflow
 */
export enum ARVOStage {
  ANALYZE = 'analyze',
  REASON = 'reason',
  VERIFY = 'verify',
  ORCHESTRATE = 'orchestrate',
}

/**
 * ARVO AI Result
 */
export interface ARVOResult {
  stage: ARVOStage;
  content: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

/**
 * Omnipotent Think Tank Interface
 * Core engine for knowledge and reasoning
 */
export interface OmniThinkTank {
  /** Think Tank ID */
  id: string;
  /** Think Tank Name */
  name: string;
  /** Collection of Knowledge Bases */
  knowledgeBases: OmniKnowledgeBase[];
  /** Collection of Agents */
  agents: OmniAgent[];
  /** Skill Registry */
  skillRegistry: OmniSkillRegistry;

  /** Query knowledge */
  query(query: string, options?: QueryOptions): Promise<KnowledgeResult[]>;
  /** Reasoning */
  reason(input: ReasoningInput): Promise<ReasoningResult>;
  /** Learn */
  learn(knowledge: Knowledge): Promise<void>;
  /** Create agent */
  createAgent(config: AgentConfig): Promise<OmniAgent>;
}

/**
 * Knowledge Base Interface
 */
export interface OmniKnowledgeBase {
  id: string;
  name: string;
  description?: string;
  /** Vector dimensions */
  dimensions: number;
  /** Total number of knowledge chunks */
  totalChunks: number;
  /** Tag collection */
  tags: OmniTagSet;

  /** Store knowledge */
  store(content: string, metadata?: Record<string, unknown>): Promise<string>;
  /** Retrieve knowledge */
  retrieve(query: string, topK?: number): Promise<KnowledgeChunk[]>;
  /** Delete knowledge */
  delete(chunkId: string): Promise<void>;
}

/**
 * Knowledge Chunk Interface
 */
export interface KnowledgeChunk {
  id: string;
  content: string;
  embedding?: number[];
  similarity?: number;
  metadata: Record<string, unknown>;
  tags: OmniTag[];
}

/**
 * Agent Interface
 */
export interface OmniAgent {
  id: string;
  name: string;
  description?: string;
  /** System Prompt */
  systemPrompt: string;
  /** Base Model */
  baseModel: string;
  /** Temperature */
  temperature: number;
  /** Available Skills */
  skills: OmniSkill[];
  /** Knowledge Base */
  knowledgeBase?: OmniKnowledgeBase;
  /** Tag collection */
  tags: OmniTagSet;

  /** Process input */
  process(input: string, context?: AgentContext): Promise<AgentResponse>;
  /** Add a skill */
  addSkill(skill: OmniSkill): void;
  /** Remove a skill */
  removeSkill(skillId: string): void;
}

/**
 * Skill Interface
 */
export interface OmniSkill {
  id: string;
  name: string;
  description?: string;
  category: string;
  /** Requires human-in-the-loop (HITL) review */
  requiresHITL: boolean;
  /** Parameter Schema */
  parametersSchema: Record<string, unknown>;
  /** Tag collection */
  tags: OmniTagSet;

  /** Execute skill */
  execute(parameters: Record<string, unknown>, context?: SkillContext): Promise<SkillResult>;
  /** Validate parameters */
  validateParameters(parameters: Record<string, unknown>): boolean;
}

/**
 * Skill Registry Interface
 */
export interface OmniSkillRegistry {
  /** Register a skill */
  register(skill: OmniSkill): void;
  /** Unregister a skill */
  unregister(skillId: string): void;
  /** Get a skill */
  get(skillId: string): OmniSkill | undefined;
  /** List all skills */
  list(): OmniSkill[];
  /** List skills by category */
  listByCategory(category: string): OmniSkill[];
}

// ============================================================================
// Omnipotent Core - Triune Unity
// ============================================================================

/**
 * Omnipotent Core Interface
 * Integrates Component, Tag, and Think Tank systems into a unified unit
 */
export interface OmniCore {
  /** Core ID */
  id: string;
  /** Core Name */
  name: string;
  /** Core Version */
  version: string;

  // Triune Unity
  /** Component System */
  components: OmniComponentSystem;
  /** Tag System */
  tags: OmniTagSystem;
  /** Think Tank System */
  thinkTank: OmniThinkTank;

  /** Initialize Core */
  initialize(): Promise<void>;
  /** Process request */
  process(request: OmniRequest): Promise<OmniResponse>;
  /** Shutdown Core */
  shutdown(): Promise<void>;
}

/**
 * Component System Interface
 */
export interface OmniComponentSystem {
  /** Register component */
  register<T extends OmniComponent>(component: T): void;
  /** Unregister component */
  unregister(componentId: string): void;
  /** Get component */
  get<T extends OmniComponent>(componentId: string): T | undefined;
  /** Execute component */
  execute<TInput, TOutput>(
    componentId: string,
    input: TInput
  ): Promise<OmniComponentResult<TOutput>>;
  /** List all components */
  list(): OmniComponent[];
}

/**
 * Tag System Interface
 */
export interface OmniTagSystem {
  /** Create a tag */
  create(type: OmniTagType, name: string, value: unknown): OmniTag;
  /** Attach tag to entity */
  attach(entityId: string, tag: OmniTag): void;
  /** Detach tag from entity */
  detach(entityId: string, tagId: string): void;
  /** Get entity tags */
  getTags(entityId: string): OmniTag[];
  /** Find entities by tag predicate */
  findEntities(predicate: (tag: OmniTag) => boolean): string[];
}

/**
 * Omni Request Interface
 */
export interface OmniRequest {
  /** Request ID */
  id: string;
  /** Request Type */
  type: OmniRequestType;
  /** Request Content */
  content: string;
  /** Context */
  context?: Record<string, unknown>;
  /** Tags */
  tags?: OmniTag[];
  /** Timestamp */
  timestamp: Date;
}

/**
 * Request Type Enumeration
 */
export enum OmniRequestType {
  /** Query */
  QUERY = 'query',
  /** Command */
  COMMAND = 'command',
  /** Learn */
  LEARN = 'learn',
  /** Reason */
  REASON = 'reason',
}

/**
 * Omni Response Interface
 */
export interface OmniResponse {
  /** Response ID */
  id: string;
  /** Request ID */
  requestId: string;
  /** Status */
  status: OmniResponseStatus;
  /** Response Content */
  content: string;
  /** Data */
  data?: unknown;
  /** Generated Tags */
  generatedTags: OmniTag[];
  /** Executed Components */
  executedComponents: string[];
  /** Invoked Skills */
  invokedSkills: string[];
  /** Execution Time */
  executionTime: number;
  /** Timestamp */
  timestamp: Date;
}

/**
 * Response Status Enumeration
 */
export enum OmniResponseStatus {
  /** Success */
  SUCCESS = 'success',
  /** Partial Success */
  PARTIAL_SUCCESS = 'partial_success',
  /** Failure */
  FAILURE = 'failure',
  /** Pending Review */
  PENDING_REVIEW = 'pending_review',
}

// ============================================================================
// Helper Definitions
// ============================================================================

export interface QueryOptions {
  topK?: number;
  threshold?: number;
  filters?: Record<string, unknown>;
  knowledgeBases?: ESGKnowledgeBase[];
}

export interface KnowledgeResult {
  content: string;
  similarity: number;
  source: string;
  metadata: Record<string, unknown>;
}

export interface ReasoningInput {
  query: string;
  context?: Record<string, any> | string[];
  constraints?: string[];
}

export interface ReasoningResult {
  conclusion: string;
  reasoning: string[];
  confidence: number;
}

export interface Knowledge {
  content: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface AgentConfig {
  name: string;
  description?: string;
  systemPrompt: string;
  baseModel?: string;
  temperature?: number;
  skills?: string[];
}

export interface AgentContext {
  sessionId?: string;
  userId?: string;
  history?: Array<{ role: string; content: string }>;
  metadata?: Record<string, unknown>;
}

export interface AgentResponse {
  content: string;
  reasoning?: string;
  skillCalls?: Array<{ skill: string; parameters: Record<string, unknown> }>;
  tags: OmniTag[];
}

export interface SkillContext {
  agentId: string;
  sessionId?: string;
  hitlApproved?: boolean;
}

export interface SkillResult {
  success: boolean;
  data?: unknown;
  error?: string;
  tags: OmniTag[];
}
