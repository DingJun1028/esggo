/**
 * 🛰️ OmniJourneyManager (萬能旅程管理員)
 * Singleton to track and persist the user's progress through the 5+1 ESG Alchemist Journey.
 * Values are synchronized with the [智慧智能團] and reflected in MangaJourney.
 */

export enum JourneyStage {
    HEALTH_CHECK = 'HEALTH_CHECK',
    CARBON_INVENTORY = 'CARBON_INVENTORY',
    IMPACT_REPAIR = 'IMPACT_REPAIR',
    TRUSTWORTHY_SEAL = 'TRUSTWORTHY_SEAL',
    GREEN_FINANCE = 'GREEN_FINANCE',
    ETERNAL_RESONANCE = 'ETERNAL_RESONANCE'
}

export interface IJourneyState {
    currentStage: JourneyStage;
    completedStages: JourneyStage[];
    lastUpdated: number;
}

const STORAGE_KEY = 'omni_journey_pulse';

export class OmniJourneyManager {
    private static instance: OmniJourneyManager;
    private state: IJourneyState = {
        currentStage: JourneyStage.HEALTH_CHECK,
        completedStages: [],
        lastUpdated: Date.now()
    };
    
    private listeners: ((state: IJourneyState) => void)[] = [];

    private constructor() {
        this.load();
    }

    public static getInstance(): OmniJourneyManager {
        if (!this.instance) {
            this.instance = new OmniJourneyManager();
        }
        return this.instance;
    }

    /**
     * 💾 Persist state to localStorage
     */
    private save(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            this.notify();
        }
    }

    /**
     * 📖 Load state from localStorage
     */
    private load(): void {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    this.state = JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse journey state", e);
                }
            }
        }
    }

    /**
     * 🚀 Advance to a specific stage
     */
    public advanceTo(stage: JourneyStage): void {
        if (this.state.currentStage === stage) return;
        
        // Add previous stage to completed if not already there
        if (!this.state.completedStages.includes(this.state.currentStage)) {
            this.state.completedStages.push(this.state.currentStage);
        }
        
        this.state.currentStage = stage;
        this.state.lastUpdated = Date.now();
        this.save();
    }

    /**
     * ✅ Mark a stage as completed
     */
    public completeStage(stage: JourneyStage): void {
        if (!this.state.completedStages.includes(stage)) {
            this.state.completedStages.push(stage);
            this.state.lastUpdated = Date.now();
            this.save();
        }
    }

    public getState(): IJourneyState {
        return { ...this.state };
    }

    /**
     * 👂 Subscribe to state changes
     */
    public subscribe(callback: (state: IJourneyState) => void): () => void {
        this.listeners.push(callback);
        callback(this.getState());
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notify(): void {
        this.listeners.forEach(l => l(this.getState()));
    }
    
    /**
     * 🧹 Reset journey (Dev only)
     */
    public reset(): void {
        this.state = {
            currentStage: JourneyStage.HEALTH_CHECK,
            completedStages: [],
            lastUpdated: Date.now()
        };
        this.save();
    }
}

export const omniJourney = OmniJourneyManager.getInstance();
