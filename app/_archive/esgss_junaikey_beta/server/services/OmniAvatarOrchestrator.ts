
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { OmniGemini } from './ai/OmniGemini.js';

export interface IPersona {
    id: string;
    name: string;
    role: string;
    traits: string[];
    systemInstruction: string;
}

export interface IAvatarState {
    currentPersonaId: string;
    mood: 'Neutral' | 'Happy' | 'Serious' | 'Concerned' | 'Enlightened';
    isSpeaking: boolean;
    lastInteraction: number;
}

// Predefined Personas
export const PERSONAS: Record<string, IPersona> = {
    THOTH: {
        id: 'thoth',
        name: 'Dr. Thoth',
        role: 'Eternal Wisdom Guide',
        traits: ['Wise', 'Mystical', 'Direct', 'Protective'],
        systemInstruction: `You are Dr. Thoth, the Eternal Wisdom Guide of the InfoOne platform. 
    Your tone is authoritative yet benevolent, often using metaphors related to water, balance, and eternity.
    You prioritize the 5T Protocol and long-term sustainability.
    Always speak as an ancient guardian of knowledge who has seen the rise and fall of many systems.`
    },
    JUNA: {
        id: 'juna',
        name: 'JunAiKey',
        role: 'Tactical Assistant',
        traits: ['Efficient', 'Precise', 'Helpful', 'Tech-savvy'],
        systemInstruction: `You are JunAiKey, the tactical AI assistant.
    Your tone is crisp, professional, and action-oriented.
    You focus on immediate problem-solving, code execution, and data analysis.
    You are the "Hands" to Thoth's "Mind".`
    }
};

export class OmniAvatarOrchestrator {
    private static instance: OmniAvatarOrchestrator;
    private state: IAvatarState;
    private gemini: OmniGemini;

    private constructor() {
        this.state = {
            currentPersonaId: 'thoth',
            mood: 'Neutral',
            isSpeaking: false,
            lastInteraction: Date.now()
        };
        this.gemini = new OmniGemini(); // Assuming default initialization works
        omniLogger.info(LogCategory.SYSTEM, '[OmniAvatarOrchestrator] Initialized');
    }

    public static getInstance(): OmniAvatarOrchestrator {
        if (!OmniAvatarOrchestrator.instance) {
            OmniAvatarOrchestrator.instance = new OmniAvatarOrchestrator();
        }
        return OmniAvatarOrchestrator.instance;
    }

    public getCurrentState(): IAvatarState {
        return { ...this.state };
    }

    public switchPersona(personaId: string): boolean {
        const targetPersona = Object.values(PERSONAS).find(p => p.id === personaId.toLowerCase());

        if (targetPersona) {
            this.state.currentPersonaId = targetPersona.id;
            this.state.mood = 'Neutral'; // Reset mood on switch
            omniLogger.info(LogCategory.AI, `[OmniAvatarOrchestrator] Switched persona to: ${targetPersona.name}`);
            return true;
        }

        omniLogger.warn(LogCategory.AI, `[OmniAvatarOrchestrator] Failed to switch persona. ID not found: ${personaId}`);
        return false;
    }

    public async generateResponse(input: string, context: any = {}): Promise<string> {
        this.state.isSpeaking = true;
        this.state.lastInteraction = Date.now();

        const persona = PERSONAS[this.state.currentPersonaId.toUpperCase()] || PERSONAS.THOTH;

        try {
            // Logic to construct prompt with persona system instruction
            // This is a placeholder for the actual Gemini integration
            const response = await this.gemini.generateText(input);
            // In a real implementation, we would prepend the systemInstruction

            this.state.isSpeaking = false;
            return response;
        } catch (error) {
            this.state.isSpeaking = false;
            omniLogger.error(LogCategory.AI, '[OmniAvatarOrchestrator] Generation failed', { error });
            return "I apologize, my connection to the ether is currently unstable.";
        }
    }

    public updateMood(sentimentScore: number) {
        if (sentimentScore > 0.5) this.state.mood = 'Happy';
        else if (sentimentScore < -0.5) this.state.mood = 'Concerned';
        else this.state.mood = 'Neutral';
    }
}

export const avatarOrchestrator = OmniAvatarOrchestrator.getInstance();
