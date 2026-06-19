import { OmniCore } from './OmniCore.ts';
import { OmniRequest, IVerifiedResponse } from './types/OmniCore.types.ts';

/**
 * ??Ô∏?OmniCommander: The Sovereign Commander (Control/Authority)
 * 
 * Concept: "?¨ËÉΩ?áÊèÆÂÆ? (Universal Commander) / "‰∏ªÊ??áÊèÆ" (Sovereign Command)
 * 5T Alignment: Trustworthy (Authority), Transparent (Orders)
 * Role: Represents the active will and command structure of the system. 
 *       It issues high-level directives, overrides, and strategic commands.
 */
export class OmniCommander {
    private static instance: OmniCommander;
    private core: OmniCore;

    private constructor() {
        this.core = OmniCore.getInstance();
    }

    public static getInstance(): OmniCommander {
        if (!OmniCommander.instance) {
            OmniCommander.instance = new OmniCommander();
        }
        return OmniCommander.instance;
    }

    /**
     * Issue a sovereign command or directive.
     * @param order The command string or object to execute.
     * @param priority The priority level of the command.
     */
    public async command(order: string, priority: 'standard' | 'high' | 'critical' | 'sovereign' = 'standard'): Promise<IVerifiedResponse> {
        const timestamp = Date.now();
        const manifest: OmniRequest = {
            id: crypto.randomUUID(),
            type: 'COMMAND',
            content: `CMD:[${priority.toUpperCase()}] ${order}`,
            timestamp,
            source: 'OmniCommander',
            tags: ['command', 'authority', 'directive', 'control']
        };

        console.log(`[OmniCommander] ??Ô∏?Command Issued: [${priority}] ${order}`);

        return {
            core: manifest,
            message: `??Ô∏?OmniCommander Directive: Command "${order}" acknowledged with ${priority} priority.`,
            verified: true
        };
    }
}
