// import { createHash } from 'crypto'; // Removed for browser compatibility
import { v4 as uuidv4 } from 'uuid';
import { omniLogger, LogCategory } from "./omniLogger";

import { IOmniTag } from './omni-types';

/**
 * 🌿 Wu-Zuo-Miao-De (無作妙德) Automated Note System
 * "Actionless Wondrous Virtue" - 靈感激發、隨手而記、自動成章。
 */

export interface IEvidence {
    originId: string;
    category: 'Carbon' | 'Social' | 'Governance' | 'Sentient';
    protocol: string;
    hash?: string;
    location?: string;
    timestamp: number;
}

export interface IOmniNote {
    readonly uuid: string;
    title: string;
    content: string;
    readonly timestamp: number;
    status: 'Draft' | 'Sentient' | 'Trustworthy' | 'Archived';
    evidence?: IEvidence;
    tags?: IOmniTag[];
}

export class OmniWuzuoNoteService {
    private static STORAGE_KEY = 'esggo_wuzuo_notes';
    private static _initialized = false;
    private static _notes: IOmniNote[] = [
        {
            uuid: 'NOTE-001',
            title: '關於供應鏈碳中和的隨想',
            content: '我們應該考慮將 5T 協議直接植入供應商的 IoT 設備中，實現「無感填報」。',
            timestamp: Date.now() - 86400000,
            status: 'Trustworthy',
            tags: [
                { id: 't1', semantic: 'Strategy', dimension: 'Context', weight: 0.9 },
                { id: 't2', semantic: 'Carbon', dimension: 'Domain', weight: 0.8 }
            ],
            evidence: {
                originId: 'Brainstorm-01',
                category: 'Sentient',
                protocol: 'Omni-v1',
                hash: 'sha256:4f5e...',
                timestamp: Date.now() - 86400000
            }
        },
        {
            uuid: 'NOTE-002',
            title: '善向幣的激勵模型修正',
            content: '目前的發放率過高，需導入「永續寶石」作為稀有度調節器。',
            timestamp: Date.now() - 3600000,
            status: 'Draft',
            tags: [
                { id: 't3', semantic: 'Economy', dimension: 'Context', weight: 0.7 },
                { id: 't4', semantic: 'Village', dimension: 'Context', weight: 0.6 }
            ]
        }
    ];

    private static init() {
        if (typeof window === 'undefined' || this._initialized) return;
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            this._notes = JSON.parse(saved);
        }
        this._initialized = true;
    }

    private static save() {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._notes));
        }
    }

    /**
     * 📜 getAllNotes: 獲取所有筆記
     */
    public static async getAllNotes(): Promise<IOmniNote[]> {
        this.init();
        return [...this._notes].sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * ✍️ createNote: 創建新筆記 (無作生成)
     */
    public static async createNote(title: string, content: string): Promise<IOmniNote> {
        const newNote: IOmniNote = {
            uuid: `OMNI-NOTE-${uuidv4().slice(0, 8).toUpperCase()}`,
            title,
            content,
            timestamp: Date.now(),
            status: 'Draft',
            tags: [{ id: `tag-${Date.now()}`, semantic: 'Uncategorized', dimension: 'AI_Inferred', weight: 0.1 }]
        };
        this.init();
        this._notes.push(newNote);
        this.save();
        omniLogger.info(LogCategory.SYSTEM, `WuzuoNote: Created new draft ${newNote.uuid}`);
        return newNote;
    }

    /**
     * 🔒 engraveNote: 執行 5T 封印 (Trustworthy)
     */
    public static async engraveNote(uuid: string): Promise<IOmniNote> {
        const index = this._notes.findIndex(n => n.uuid === uuid);
        if (index === -1) throw new Error("Note not found");

        const note = this._notes[index];
        const dataString = JSON.stringify({ uuid: note.uuid, title: note.title, content: note.content });
        let hashVal = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hashVal = ((hashVal << 5) - hashVal) + char;
            hashVal = hashVal & hashVal;
        }
        const hash = `SH_${Math.abs(hashVal).toString(16)}`;

        const engravedNote: IOmniNote = {
            ...note,
            status: 'Trustworthy',
            evidence: {
                originId: 'OmniWuzuoSystem',
                category: 'Sentient',
                protocol: '5T-Trust-Core',
                hash: `sha256:${hash}`,
                timestamp: Date.now()
            }
        };

        this._notes[index] = engravedNote;
        this.save();
        omniLogger.info(LogCategory.SYSTEM, `WuzuoNote: Engraved note ${uuid} with hash ${hash}`);
        return engravedNote;
    }

    /**
     * 🗑️ deleteNote
     */
    public static async deleteNote(uuid: string): Promise<void> {
        this.init();
        this._notes = this._notes.filter(n => n.uuid !== uuid);
        this.save();
    }

    /**
     * 🔄 updateNote
     */
    public static async updateNote(uuid: string, updates: Partial<IOmniNote>): Promise<IOmniNote> {
        const index = this._notes.findIndex(n => n.uuid === uuid);
        if (index === -1) throw new Error("Note not found");

        if (this._notes[index].status === 'Trustworthy') {
            throw new Error("Cannot edit a Trustworthy (Sealed) note.");
        }

        this.init();
        this._notes[index] = { ...this._notes[index], ...updates };
        this.save();
        return this._notes[index];
    }

    /**
     * 🌉 getRelatedNotes: 根據標籤尋找關聯資產 (進化版：包含相似度權重)
     */
    public static async getRelatedNotes(currentNote: IOmniNote): Promise<{ note: IOmniNote; similarity: number }[]> {
        if (!currentNote.tags || currentNote.tags.length === 0) return [];

        const currentSemantics = currentNote.tags.map(t => t.semantic);
        const results = this._notes
            .filter(n => n.uuid !== currentNote.uuid)
            .map(n => {
                const commonTags = n.tags?.filter(t => currentSemantics.includes(t.semantic)) || [];
                if (commonTags.length === 0) return null;

                // 計算相似度權重：標籤重合度 * 平均權重
                const avgWeight = commonTags.reduce((acc, t) => acc + (t.weight || 0.5), 0) / commonTags.length;
                const similarity = (commonTags.length / currentNote.tags!.length) * avgWeight;

                return { note: n, similarity };
            })
            .filter((res): res is { note: IOmniNote; similarity: number } => res !== null)
            .sort((a, b) => b.similarity - a.similarity);

        return results;
    }
}
