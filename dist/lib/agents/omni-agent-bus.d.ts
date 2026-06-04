/**
 * OmniAgentBus: High-Speed Event & Message Bus
 * v4.0.0 | High-Resonance Intent Field + SSE Bridge
 *
 * 5T Protocol Gate: T5 Trackable — lifecycle-aware event propagation.
 * Now includes a pluggable SSE broadcast hook for real-time frontend observability.
 */
export type BusBroadcastHook = (event: string, payload: Record<string, unknown>) => void;
export interface OmniSkill {
    id: string;
    name: string;
    description: string;
    trigger: string;
    penetration?: boolean;
    cooldown?: number;
    autonomy?: boolean;
    handler: (payload: Record<string, unknown>) => Promise<unknown> | unknown;
}
export declare class OmniAgentBus {
    private static instance;
    private listeners;
    private broadcastHooks;
    private autonomyInterval;
    private commandStatus;
    private skills;
    private skillCooldowns;
    registerSkill(skill: OmniSkill): void;
    unregisterSkill(skillId: string): void;
    getSkill(skillId: string): OmniSkill | undefined;
    listSkills(): OmniSkill[];
    private constructor();
    /**
     * Register the persistence handler to listen for core events
     * and persist them to the Postgres AuditRecord table.
     */
    private registerPersistenceHandler;
    /**
     * Register handlers for common Supabase CLI commands.
     * Listens for "supabase:run" events with payload { cmd: string, workdir?: string }.
     */
    private registerSupabaseHandlers;
    private updateCommandStatus;
    penetrationBypass(target: string, reason?: string): Promise<{
        bypassed: string;
        method: string;
    }>;
    static getInstance(): OmniAgentBus;
    /**
     * Start Autonomous Mode
     * Periodically triggers 'system:autonomy:tick' to awaken autonomous skills.
     */
    startAutonomy(intervalMs?: number): void;
    /**
     * Stop Autonomous Mode
     */
    stopAutonomy(): void;
    /**
     * Register a broadcast hook (e.g., SSE pushBusEvent).
     * All future publish() calls will also invoke this hook.
     */
    registerBroadcastHook(hook: BusBroadcastHook): void;
    /**
     * Unregister a previously registered broadcast hook.
     */
    unregisterBroadcastHook(hook: BusBroadcastHook): void;
    /**
     * Publish an event to the bus.
     * Propagates to: 1) Local listeners, 2) SSE broadcast hooks, 3) NCBDB persistence.
     */
    publish(event: string, payload: Record<string, unknown>): Promise<void>;
    private extractQuantumEssence;
    private SacredLibrary;
    private activateAgents;
    private EntropyForge;
    private OmnipotentRepository;
    /**
     * 奧義六式執行框架 (Celestial Command Framework)
     * The supreme orchestrator that maps abstract intents to concrete agent skills
     * following the JunAiKey-BindAi axioms.
     */
    executeCelestialCommand(intent: string, context?: Record<string, any>): Promise<{
        status: string;
        intent: string;
        artifactUuid: string;
        timestamp: string;
        message: string;
        error?: undefined;
    } | {
        status: string;
        intent: string;
        message: string;
        error: any;
        artifactUuid?: undefined;
        timestamp?: undefined;
    }>;
    /**
        * Execute a Supabase CLI command and publish results.
        * @param cmd - Supabase CLI command (e.g., "supabase start").
        * @param workdir - Optional working directory.
        */
    runSupabaseCommand(cmd: string, workdir?: string): Promise<{
        stdout: string;
        stderr: string;
        code: number;
    }>;
    supabaseInit(workdir?: string): Promise<{
        stdout: string;
        stderr: string;
        code: number;
    }>;
    supabaseStart(workdir?: string): Promise<{
        stdout: string;
        stderr: string;
        code: number;
    }>;
    supabaseStop(workdir?: string): Promise<{
        stdout: string;
        stderr: string;
        code: number;
    }>;
    supabaseDbPush(workdir?: string): Promise<{
        stdout: string;
        stderr: string;
        code: number;
    }>;
    supabaseDbReset(workdir?: string): Promise<{
        stdout: string;
        stderr: string;
        code: number;
    }>;
    private registerBuiltInSkills;
    private executePowerShell;
    private executeShell;
    subscribe(event: string, callback: (payload: Record<string, unknown>) => void): () => void;
    /**
     * Get current hook count (for diagnostics).
     */
    get hookCount(): number;
}
export declare const omniAgentBus: OmniAgentBus;
//# sourceMappingURL=omni-agent-bus.d.ts.map