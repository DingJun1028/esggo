import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ?“¹ OmniCapture: The Sovereign Input (Sensor/Eye)
 * 
 * Concept: "?¬èƒ½?•æ?" (Universal Capture) / "ä¸»æ??Ÿæ¸¬" (Sovereign Sensor)
 * 5T Alignment: Traceable (Input), Tangible (Record)
 * Role: Captures inputs, events, or data from external sources or internal states.
 *       The "Eyes/Ears" of the system.
 */
export class OmniCapture {
    private static instance: OmniCapture;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCapture {
        if (!OmniCapture.instance) {
            OmniCapture.instance = new OmniCapture();
        }
        return OmniCapture.instance;
    }

    /**
     * Snap/Record - Capture a moment or data point.
     * @param source The source of the capture.
     * @param data The data captured.
     */
    public async snap(source: string, data: Record<string, unknown>): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'REASON', // Input implies reasoning/processing needs
            content: `SNAP:${source}`,
            timestamp,
            source: 'OmniCapture',
            tags: ['capture', 'snap', 'input']
        };

        console.log(`[OmniCapture] ?“¹ Snapping from: ${source}`, data);

        return {
            core: manifest,
            message: `?“¹ OmniCapture: Snapped data from "${source}".`,
            verified: true,
            // Including data in response for now to complete the cycle, though ideally stored.
        };
    }
}
