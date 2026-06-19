import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.js';
import { OmniCore } from './OmniCore.ts';

export class OmniClue {
    static getHint(manifest: any, core: any) {
        const defaultHint = `💡 OmniClue Hint: Analyzing context...`;

        const request = {
            message: `Need a hint for: ${JSON.stringify(manifest)}`,
            context: core?.context || {}
        };

        omniLogger.info(LogCategory.BUSINESS, `🔍 OmniClue: Requesting Hint...`, { request });

        return {
            source: 'OmniClue',
            content: defaultHint,
            verified: true,
            timestamp: Date.now()
        };
    }
}
