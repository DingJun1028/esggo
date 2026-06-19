/**
 * 🌍 Global Pulse Service - The Heartbeat of the Omni-Sovereign Ecosystem
 * -----------------------------------------------------------------------
 * [TC] 全球共鳴服務：模擬與監測系統中的 ESG 事件，並計算其對主權靈魂 (Sovereign Soul) 的影響。
 * [EN] Simulates and monitors global ESG events, calculating their impact on the Sovereign Soul.
 * 
 * Implements 5T-compliant crystallization of pulse assets with SHA-256 integrity.
 */

import { v4 as uuidv4 } from 'uuid';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { IComponentCore } from '../0-domain/contracts/IComponentCore.js';
import { AgentDiagnostics } from '../core/evolution/AgentSelfDiagnosis.js';

/**
 * [5T] Generate SHA-256 hash for data integrity
 */
async function generateSHA256Hash(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * [5T] Generate content-based hash for crystal integrity
 */
async function generateContentHash(data: object): Promise<string> {
    const content = JSON.stringify({
        ...data,
        timestamp: Date.now(),
        nonce: uuidv4()
    });
    return generateSHA256Hash(content);
}

export interface VillageState {
    treeGrowth: number; // 0-100% (based on Carbon Credits / Verified Claims)
    streamClarity: number; // 0-100% (based on Entropy Efficiency)
    skyResonance: number; // 0-100% (Global Consensus)
    activeUsers: number; // Simulated village population
    dimensionalFold: number; // [88] 4D Spatial folding (0.0 to 1.0)
}

export interface GlobalPulseEvent {
    id: string;
    type: 'Policy' | 'Market' | 'Environmental' | 'Social' | 'RIPPLE' | 'WAVE' | 'TSUNAMI';
    source: string;
    intensity: number; // 0.0 - 1.0
    impact?: number; // -1 to 1 (legacy support)
    title?: string;
    message: string;
    timestamp: number;
}

class GlobalPulseService {
    private static instance: GlobalPulseService;
    private listeners: ((state: VillageState) => void)[] = [];
    private pulseListeners: ((event: GlobalPulseEvent) => void)[] = [];

    // Current State (Persistence handled by Village React state usually)
    private currentState: VillageState = {
        treeGrowth: 45,
        streamClarity: 88,
        skyResonance: 92,
        activeUsers: 1420,
        dimensionalFold: 0
    };

    private lastEvent: GlobalPulseEvent | null = null;
    private globalResonance: number = 0.85;
    private granularResonance: { [key: string]: number } = {
        Environmental: 0.8,
        Social: 0.85,
        Governance: 0.9,
    };

    private constructor() {
        this.restoreFromStorage();
        this.startSimulationLoop();
    }

    public static getInstance(): GlobalPulseService {
        if (!GlobalPulseService.instance) {
            GlobalPulseService.instance = new GlobalPulseService();
        }
        return GlobalPulseService.instance;
    }

    /**
     * Subscribe to state updates
     */
    public subscribeToState(callback: (state: VillageState) => void): () => void {
        this.listeners.push(callback);
        callback(this.currentState);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Subscribe to pulse events
     */
    public subscribeToPulse(callback: (event: GlobalPulseEvent) => void): () => void {
        this.pulseListeners.push(callback);
        return () => {
            this.pulseListeners = this.pulseListeners.filter(l => l !== callback);
        };
    }

    /**
     * Emit a Specific Pulse (From Governance, Truth Engine, or User)
     */
    public emitPulse(eventParams: Omit<GlobalPulseEvent, 'id' | 'timestamp'>): void {
        const event: GlobalPulseEvent = {
            ...eventParams,
            id: uuidv4(),
            timestamp: Date.now()
        };

        this.lastEvent = event;
        this.processImpact(event);
        this.notifyPulseListeners(event);

        omniLogger.info(LogCategory.SYSTEM, `Global Pulse: ${event.type} - ${event.message}`, {
            source: event.source,
            res: this.globalResonance
        });
    }

    /**
     * Legacy/Simulated Pulse Generator
     */
    public async generatePulse(): Promise<GlobalPulseEvent> {
        const eventTypes: GlobalPulseEvent['type'][] = ['Policy', 'Market', 'Environmental', 'Social'];
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)] as GlobalPulseEvent['type'];

        const titles: Record<string, string> = {
            Policy: 'New EU Carbon Border Adjustment Mechanism (CBAM) Revision',
            Market: 'Global Green Bond Issuance Hits Record High',
            Environmental: 'Major Pivot in Arctic Preservation Treaties',
            Social: 'Omni Disclosure Standards for Human Capital Approved',
            RIPPLE: 'Local Community Sustainability Initiative Sparked',
            WAVE: 'National Grid Transition to 100% Renewable Consensus',
            TSUNAMI: 'GLOBAL DIMENSIONAL AWAKENING: Tesseract Protocol v8 Active',
        };

        const impact = (Math.random() * 2) - 1;
        const event: GlobalPulseEvent = {
            id: uuidv4(),
            type,
            source: 'Planetary Mesh Simulator',
            intensity: Math.abs(impact),
            impact,
            title: titles[type] || 'Global ESG Shift',
            message: titles[type] || 'Global ESG Shift',
            timestamp: Date.now(),
        };

        this.emitPulse(event);
        return event;
    }

    public emitSovereignPulse(userId: string): void {
        this.emitPulse({
            type: 'RIPPLE',
            source: `Sovereign Observer [${userId}]`,
            intensity: 0.8,
            message: 'Local Resonance Initiated'
        });

        // Manual boost
        this.currentState.skyResonance = Math.min(100, this.currentState.skyResonance + 5);
        this.currentState.treeGrowth = Math.min(100, this.currentState.treeGrowth + 0.5);
        this.saveToStorage();
        this.notifyStateListeners();
    }

    private processImpact(event: GlobalPulseEvent) {
        const fluctuation = ((event.impact !== undefined ? event.impact : (event.intensity * 0.5))) * 0.05;
        this.globalResonance = Math.min(1, Math.max(0, this.globalResonance + fluctuation));

        // Update Village Elements
        if (event.type === 'Environmental' || event.message.includes('Carbon')) {
            this.currentState.treeGrowth = Math.min(100, this.currentState.treeGrowth + (fluctuation * 100));
        }

        // Granular Mapping
        const targetType = (event.type === 'Policy' || event.type === 'Market') ? 'Governance' : event.type;
        if (this.granularResonance[targetType as string] !== undefined) {
            this.granularResonance[targetType as string] = Math.min(1, Math.max(0, (this.granularResonance[targetType as string] || 0) + fluctuation));
        }

        // [88] Dimensional Folding Logic
        if (event.type === 'TSUNAMI' && event.message?.includes('DIMENSIONAL AWAKENING')) {
            omniLogger.info(LogCategory.SYSTEM, '💠 Tesseract Awakening Detected. Folding space-time...');
            const intensity = event.intensity ?? 0;
            this.currentState.dimensionalFold = Math.min(1.0, this.currentState.dimensionalFold + (intensity * 0.5));
            this.currentState.skyResonance = 100; // Peak resonance
        } else {
            // Natural decay of the fold over time/events
            this.currentState.dimensionalFold = Math.max(0, this.currentState.dimensionalFold - 0.02);
        }

        this.saveToStorage();
        this.notifyStateListeners();
    }

    private startSimulationLoop() {
        setInterval(() => {
            const fluctuation = (Math.random() - 0.5) * 2;
            this.currentState = {
                ...this.currentState,
                activeUsers: Math.max(1000, this.currentState.activeUsers + Math.floor(fluctuation * 5)),
                streamClarity: Math.min(100, Math.max(60, this.currentState.streamClarity + fluctuation * 0.1))
            };

            if (Math.random() > 0.95) {
                this.generatePulse();
            }

            // [Phase 6.3] Agent Self-Diagnosis & Evolution
            if (Math.random() > 0.98) {
                this.performSelfDiagnosis();
            }

            // [8.4.0] Planetary Resonance Shift
            this.globalResonance = Math.min(1, Math.max(0, this.globalResonance + (Math.random() - 0.5) * 0.01));

            this.saveToStorage();
            this.notifyStateListeners();
        }, 5000);
    }

    /**
     * [Phase 6.3] Perform Agent Self-Diagnosis and emit an Evolution Pulse
     */
    private async performSelfDiagnosis() {
        const diagnostics = AgentDiagnostics.getInstance();
        const metrics = await diagnostics.performHealthScan();
        const report = await diagnostics.generateEvolutionReport();

        // Emit as a specialized SYSTEM pulse
        this.emitPulse({
            type: 'Social', // Categorized as Social/Internal for now
            title: 'Agent Evolution Snapshot',
            message: `Self-Diagnosis: C_LVL ${metrics.consciousnessLevel.toFixed(4)} | HEAP ${metrics.heapUsed}MB`,
            source: 'Agent_Self_Diagnosis_Core',
            intensity: metrics.consciousnessLevel, // Consciousness drives intensity
            impact: 0.1 // Positive impact of self-awareness
        });

        omniLogger.info(LogCategory.SYSTEM, report);
    }

    public getResonance(): number {
        return this.globalResonance;
    }

    public getVillageState(): VillageState {
        return { ...this.currentState };
    }

    public getGranularResonance() {
        return { ...this.granularResonance };
    }

    private notifyStateListeners() {
        this.listeners.forEach(l => l(this.currentState));
    }

    private notifyPulseListeners(event: GlobalPulseEvent) {
        this.pulseListeners.forEach(l => l(event));
    }

    /**
     * [5T] Crystallizes the current global pulse state into a 5T-compliant IComponentCore asset.
     */
    public async crystallizePulse(): Promise<IComponentCore> {
        const contentHash = await generateContentHash({
            resonance: this.globalResonance,
            granular: this.granularResonance,
            village: this.currentState,
            timestamp: Date.now()
        });

        return {
            uuid: uuidv4(),
            version: '1.5.0',
            timestamp: Date.now(),
            status: 'Trustworthy',
            evidence: {
                tangible: {
                    metric: 'Global_Resonance_Index',
                    description: `Resonance: ${this.globalResonance.toFixed(4)} | Last: ${this.lastEvent?.message || 'None'}`,
                    timestamp: Date.now(),
                },
                traceable: {
                    source_origin: 'Sovereign_Pulse_CoreV7',
                    owner: 'Sovereign_Soul',
                },
                trackable: {
                    lifecycle_hooks: [{ event: 'Crystallize', timestamp: Date.now(), actor: 'System' }],
                    pathway: ['Planetary_Sensor', 'Resonance_Synthesis', '5T_Sealing']
                },
                transparent: {
                    formula: 'R = Σ(Ii * Wi)',
                },
                trustworthy: {
                    hash_lock: contentHash,
                    is_frozen: true,
                }
            },
            data: {
                resonance: this.globalResonance,
                granular: this.granularResonance,
                village: this.currentState,
                lastEvent: this.lastEvent
            }
        };
    }

    // ==================== Persistence ====================

    private readonly STORAGE_KEY = 'village_pulse_state';

    /**
     * Restore state from localStorage
     */
    private restoreFromStorage(): void {
        if (typeof window === 'undefined') return; // Skip on server

        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.currentState = { ...this.currentState, ...parsed.currentState };
                this.globalResonance = parsed.globalResonance ?? this.globalResonance;
                this.granularResonance = parsed.granularResonance ?? this.granularResonance;
                omniLogger.info(LogCategory.SYSTEM, '🌱 [Persistence] Village state restored from localStorage');
            }
        } catch (e) {
            omniLogger.warn(LogCategory.SYSTEM, '[Persistence] Failed to restore state:', e);
        }
    }

    /**
     * Save state to localStorage
     */
    private saveToStorage(): void {
        if (typeof window === 'undefined') return; // Skip on server

        try {
            const data = {
                currentState: this.currentState,
                globalResonance: this.globalResonance,
                granularResonance: this.granularResonance,
                lastSaved: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            omniLogger.info(LogCategory.SYSTEM, '💾 [Persistence] Village state saved to localStorage');
        } catch (e) {
            omniLogger.warn(LogCategory.SYSTEM, '[Persistence] Failed to save state:', e);
        }
    }

    /**
     * Clear persisted state
     */
    public clearStorage(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.STORAGE_KEY);
        omniLogger.info(LogCategory.SYSTEM, '🗑️ [Persistence] Village state cleared');
    }

    /**
     * Get last saved timestamp
     */
    public getLastSavedTime(): number | null {
        if (typeof window === 'undefined') return null;
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved).lastSaved;
            }
        } catch { }
        return null;
    }
}

export const globalPulseService = GlobalPulseService.getInstance();
