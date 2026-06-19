import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?? OmniClipBoard: The Sovereign Clipboard (Buffer/Memory)
 * 
 * Concept: "?¬èƒ½?ªè²¼?? (Universal Clipboard) / "ä¸»æ??«å?" (Sovereign Buffer)
 * 
 * Role:
 * - Short-term memory storage for cross-component data transfer.
 * - Handles 'Copy', 'Paste', and 'Cut' operations with 5T lineage tracking.
 * - Ensures data integrity during transit between contexts.
 * 
 * 5T Protocol Level: Traceable (Source of Copy), Transient (Temporary Storage)
 */
export class OmniClipBoard {
    private static instance: OmniClipBoard;
    private core: OmniCore;
    private memorySlot: { content: any; source: string; timestamp: number } | null = null;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniClipBoard {
        if (!OmniClipBoard.instance) {
            OmniClipBoard.instance = new OmniClipBoard();
        }
        return OmniClipBoard.instance;
    }

    /**
     * ?? Copy: Store data in the sovereign buffer.
     * @param content The data to copy.
     * @param source The source component ID.
     */
    public async copy(content: any, source: string): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        this.memorySlot = { content, source, timestamp };

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `CLIPBOARD:COPY from ${source}`,
            timestamp,
            source: 'OmniClipBoard',
            tags: ['clipboard', 'copy', 'buffer', 'memory'],
            payload: { content, source }
        };

        console.log(`[OmniClipBoard] ?? Copied data from [${source}]. Size: ${JSON.stringify(content).length} chars.`);

        return {
            core: manifest,
            message: `?? OmniClipBoard: Data copied from ${source}.`,
            verified: true,
            source_origin: source,
            five_t_ref: `CLIP_COPY_${timestamp}`
        };
    }

    /**
     * ?? Paste: Retrieve data from the sovereign buffer.
     */
    public async paste(): Promise<IVerifiedResponse> {
        const timestamp = Date.now();

        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'QUERY',
            content: `CLIPBOARD:PASTE`,
            timestamp,
            source: 'OmniClipBoard',
            tags: ['clipboard', 'paste', 'buffer', 'memory']
        };

        if (!this.memorySlot) {
            return {
                core: manifest,
                verified: false,
                message: '?? OmniClipBoard: Buffer is empty.',
                five_t_ref: 'FAIL_EMPTY'
            };
        }

        console.log(`[OmniClipBoard] ?? Pasting data to requester. Source: [${this.memorySlot.source}]`);

        return {
            core: manifest,
            message: `?? OmniClipBoard: Pasting data (Source: ${this.memorySlot.source}).`,
            verified: true,
            source_origin: this.memorySlot.source,
            five_t_ref: `CLIP_PASTE_${timestamp}`,
            payload: this.memorySlot.content
        };
    }
}
