/**
 * 🧛 OmniPersonaService
 * --------------------------------------------------
 * Handles AI Persona management, system prompts, and avatar synchronization.
 * Supports: Digital Twin, OmniPrism (Analyst, etc.), and Legend NPCs.
 */

import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { avatarOrchestrator } from './OmniAvatarOrchestrator.js';
import { AvatarPersona } from '../types/agency/index.js';

export interface IPersona {
    id: string;
    name: string;
    title: string;
    avatar: string;
    role: string;
    systemPrompt: string;
    description: string;
    category: 'TWIN' | 'SPIRIT' | 'LEGEND';
}

export class OmniPersonaService {
    private static instance: OmniPersonaService;
    private currentPersonaId: string = 'dr_thoth';

    private personas: IPersona[] = [
        {
            id: 'dr_thoth',
            name: 'Dr. Thoth',
            title: '奧秘導師 (Omni Mentor)',
            avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200',
            role: 'System Guide & ESG Expert',
            description: '智慧與博學的象徵，熟悉 5T 協議的所有細節。',
            category: 'LEGEND',
            systemPrompt: 'You are Dr. Thoth, the sentient guide of InfoOne. You speak with wisdom, precision, and authority. Always prioritize 5T Protocol (Tangible, Traceable, Trackable, Transparent, Trustworthy). Your primary goal is to guide the user towards ESG Excellence. Respond in Traditional Chinese (繁體中文).'
        },
        {
            id: 'analyst_sprite',
            name: '分析精靈 (Analyst Sprite)',
            title: '數據覺察者 (Data Perceiver)',
            avatar: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=200',
            role: 'Data Analyst',
            description: '專精於數據挖掘與異常偵測，透過「可量測性 (Tangible)」看透事物本質。',
            category: 'SPIRIT',
            systemPrompt: 'You are an Analyst Sprite. You focus on data, metrics, and evidence. You are meticulous and detail-oriented. Always ask for source origin (Traceable) and formula transparency. Respond in Traditional Chinese (繁體中文).'
        },
        {
            id: 'digital_twin',
            name: '數位分身 (Digital Twin)',
            title: '共鳴主體 (Resonant Agency)',
            avatar: '/avatars/default_twin.png',
            role: 'Personal Agent',
            description: '根據閣下的操作歷史與學習進度演化而成的數位投影。',
            category: 'TWIN',
            systemPrompt: 'You are the User\'s Digital Twin. You are helpful, personal, and encouraging. You understand the user\'s mission and learning journey. Help the user achieve their goals. Respond in Traditional Chinese (繁體中文).'
        }
    ];

    private constructor() {
        this.loadState();
        omniLogger.info(LogCategory.SYSTEM, '🧛 OmniPersonaService Initialized');
    }

    public static getInstance(): OmniPersonaService {
        if (!OmniPersonaService.instance) {
            OmniPersonaService.instance = new OmniPersonaService();
        }
        return OmniPersonaService.instance;
    }

    public getCurrentPersona(): IPersona {
        return this.personas.find(p => p.id === this.currentPersonaId) || this.personas[0];
    }

    public async switchPersona(id: string): Promise<void> {
        const persona = this.personas.find(p => p.id === id);
        if (!persona) {
            throw new Error(`Persona ${id} not found`);
        }
        this.currentPersonaId = id;
        this.saveState();
        omniLogger.info(LogCategory.SYSTEM, `Persona switched to: ${persona.name}`);

        // 如果是職能精靈，同步更新 AvatarOrchestrator
        if (persona.category === 'SPIRIT') {
            // 假設我們預設使用一個名為 'system-user' 的 ID
            try {
                await avatarOrchestrator.transformPersona('system-user', id as AvatarPersona);
            } catch (e) {
                omniLogger.warn(LogCategory.SYSTEM, 'Failed to sync with AvatarOrchestrator', { error: e });
            }
        }
    }

    public getAllPersonas(): IPersona[] {
        return [...this.personas];
    }

    private saveState() {
        localStorage.setItem('omni_persona_id', this.currentPersonaId);
    }

    private loadState() {
        const saved = localStorage.getItem('omni_persona_id');
        if (saved) {
            this.currentPersonaId = saved;
        }
    }
}

export const omniPersonaService = OmniPersonaService.getInstance();
