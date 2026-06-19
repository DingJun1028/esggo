import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger';
import { Protocol5T } from './types/InfoOne.types';
import { omniOrb } from './OmniOrb';

/**
 * ?? OmniContent: The Sovereign Knowledge Substance (Crystallized Truth).
 * ========================================================================
 * [?¬è³ª] ?¥è??¬é??„ç??¶å??‡ç??¬å?ç®¡ç?ï¼Œç¢ºä¿å…§å®¹ç? 5T å®Œæ•´?§ã€?
 * [EN] Crystallized substance of sovereign knowledge, ensuring 5T integrity and versioned evolution.
 */

export interface ICrystallizedContent {
    uuid: string;
    payload: any;
    version: number;
    protocol: Protocol5T[];
    timestamp: number;
}

export class OmniContentManager {
    private static instance: OmniContentManager;
    private repository: Map<string, ICrystallizedContent[]> = new Map();

    private constructor() { }

    public static getInstance(): OmniContentManager {
        if (!OmniContentManager.instance) {
            OmniContentManager.instance = new OmniContentManager();
        }
        return OmniContentManager.instance;
    }

    /**
     * Crystallize raw data into a sovereign content unit.
     */
    public crystallize(uuid: string, payload: any): ICrystallizedContent {
        omniLogger.info(LogCategory.BUSINESS, `[OmniContent] ?? Crystallizing content for: ${uuid}`);

        const content: ICrystallizedContent = {
            uuid,
            payload,
            version: 1,
            protocol: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRUSTWORTHY],
            timestamp: Date.now()
        };

        this.repository.set(uuid, [content]);

        // Manifest via OmniOrb
        omniOrb.manifest(content, Protocol5T.TANGIBLE);

        return content;
    }

    /**
     * Evolve a content unit by creating a new version.
     */
    public evolve(uuid: string, newPayload: any): ICrystallizedContent {
        const history = this.repository.get(uuid) || [];
        const lastVersion = history.length > 0 ? (history[history.length - 1]?.version || 0) : 0;

        const newContent: ICrystallizedContent = {
            uuid,
            payload: newPayload,
            version: lastVersion + 1,
            protocol: [Protocol5T.TRANSPARENT, Protocol5T.TRACKABLE],
            timestamp: Date.now()
        };

        history.push(newContent);
        this.repository.set(uuid, history);

        omniLogger.info(LogCategory.BUSINESS, `[OmniContent] ?? Content Evolved: ${uuid} (v${newContent.version})`);

        return newContent;
    }

    public getContent(uuid: string): ICrystallizedContent | null {
        const history = this.repository.get(uuid);
        return (history && history.length > 0) ? history[history.length - 1] : null;
    }
}

export const omniContentManager = OmniContentManager.getInstance();
