/**
 * 🧠 OmniCapacitiesService: AI-Driven Second Brain & Object-Based PKM
 * 
 * 核心功能:
 * 1. 對象化知識索引 (Object-Based Indexing): 將知識視為具體對象 (Person, Project, Concept, etc.)。
 * 2. 網絡化連結 (Networked Connections): 自動追蹤與可視化對象間的雙向連結 (Backlinks)。
 * 3. Tomemo 混合邏輯: 實現 任務 (Task) 與 備忘 (Memo) 的動態轉換。
 * 4. 5T 結晶化整合: 知識對象在達到共鳴閾值後，自動透過 SovereignVault 進行封印。
 * 
 * "知識即資產" —— 讓分散的筆記轉化為結構化的智慧網絡。
 */

import { v4 as uuidv4 } from 'uuid';
import { sovereignVaultService } from './SovereignVaultService';
import { omniKnowledgeBase } from './OmniKnowledgeBase';

export type OmniObjectType = 'PERSON' | 'PROJECT' | 'CONCEPT' | 'MEETING' | 'EVENT' | 'TASK' | 'MEMO';

export interface OmniObject {
    id: string;
    type: OmniObjectType;
    title: string;
    content: string;
    properties: Record<string, any>;
    links: string[]; // Array of linked object IDs
    backlinks: string[]; // Array of IDs linking TO this object
    tags: string[];
    createdAt: number;
    updatedAt: number;
    isSealed: boolean;
    cid?: string;
}

export interface Connection {
    source: string;
    target: string;
    type: 'related' | 'belongs_to' | 'depends_on' | 'mentions';
}

class OmniCapacitiesService {
    private static instance: OmniCapacitiesService;
    private objects: Map<string, OmniObject> = new Map();
    private connections: Connection[] = [];

    private constructor() {
        this.loadFromStorage();
    }

    public static getInstance(): OmniCapacitiesService {
        if (!OmniCapacitiesService.instance) {
            OmniCapacitiesService.instance = new OmniCapacitiesService();
        }
        return OmniCapacitiesService.instance;
    }

    private loadFromStorage() {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem('omni_capacities_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.objects = new Map(Object.entries(parsed.objects));
                this.connections = parsed.connections || [];
            } catch (e) {
                console.error('[OmniCapacities] Load failed', e);
            }
        }
    }

    private saveToStorage() {
        if (typeof window === 'undefined') return;
        const data = {
            objects: Object.fromEntries(this.objects),
            connections: this.connections
        };
        localStorage.setItem('omni_capacities_data', JSON.stringify(data));
    }

    /**
     * 創建知識對象 (Create Knowledge Object)
     */
    public createObject(type: OmniObjectType, title: string, content: string = ''): OmniObject {
        const id = uuidv4();
        const now = Date.now();
        const newObject: OmniObject = {
            id,
            type,
            title,
            content,
            properties: {},
            links: [],
            backlinks: [],
            tags: [],
            createdAt: now,
            updatedAt: now,
            isSealed: false
        };

        this.objects.set(id, newObject);
        this.saveToStorage();
        return newObject;
    }

    /**
     * 建立連結 (Link Objects)
     */
    public link(sourceId: string, targetId: string, type: Connection['type'] = 'related') {
        const source = this.objects.get(sourceId);
        const target = this.objects.get(targetId);

        if (!source || !target) return;

        if (!source.links.includes(targetId)) {
            source.links.push(targetId);
        }
        if (!target.backlinks.includes(sourceId)) {
            target.backlinks.push(sourceId);
        }

        const connectionExists = this.connections.some(c => c.source === sourceId && c.target === targetId);
        if (!connectionExists) {
            this.connections.push({ source: sourceId, target: targetId, type });
        }

        this.saveToStorage();
    }

    /**
     * Tomemo 轉換: 任務 -> 備忘 (Task to Memo)
     * 當任務完成且具備知識價值時執行
     */
    public async convertToMemo(taskId: string): Promise<OmniObject | null> {
        const task = this.objects.get(taskId);
        if (!task || task.type !== 'TASK') return null;

        task.type = 'MEMO';
        task.updatedAt = Date.now();

        // 結晶化與 5T 封印
        const record = await sovereignVaultService.sealRecord('KNOWLEDGE_CRYSTALLIZATION', {
            source: 'TOMEMO',
            originalTaskId: taskId,
            title: task.title,
            content: task.content
        });

        task.isSealed = true;
        task.cid = record.cid;

        this.saveToStorage();
        return task;
    }

    public getObject(id: string): OmniObject | undefined {
        return this.objects.get(id);
    }

    public getAllObjects(): OmniObject[] {
        return Array.from(this.objects.values());
    }

    public getConnections(): Connection[] {
        return [...this.connections];
    }
}

export const omniCapacitiesService = OmniCapacitiesService.getInstance();
export default omniCapacitiesService;
