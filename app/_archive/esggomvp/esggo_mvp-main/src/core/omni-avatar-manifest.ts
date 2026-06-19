import { IOmniAtom, IOmniSeed, IEvidenceMap } from './omni-types';
import { OmniOne } from './omni-one';
import { omniLogger, LogCategory } from './omniLogger';

/**
 * 👤 Sovereign Avatar Payload
 * The digital essence of a user in the OmniUniverse.
 */
export interface ISovereignAvatar {
    nickname: string;
    natureLaw: string; // Left Wing: "自然共鳴律"
    closingLaw: string; // Right Wing: "誠信閉環律"
    auraTheme: 'Aqua' | 'Golden' | 'Cyber';
    initialLevel: number;
    genesisMantra: string;
}

export class SovereignAvatarManifest {
    /**
     * 🌀 Manifest a new Sovereign Avatar atom.
     * This represents the "First Resonance" in the teaching module.
     */
    public static async manifest(
        nickname: string,
        mantra: string = "道法自然，系統毅然"
    ): Promise<IOmniAtom<ISovereignAvatar>> {
        omniLogger.info(LogCategory.SYSTEM, `Avatar: Initializing Resonance for [${nickname}]`);

        const payload: ISovereignAvatar = {
            nickname,
            natureLaw: "道法自然，系統毅然，上善若水，善向永續。",
            closingLaw: "以終為始，始終如一，無始無終，善向永續。",
            auraTheme: 'Aqua',
            initialLevel: 1,
            genesisMantra: mantra
        };

        // Manifest through the Virtuous Flow (Trace -> Verify -> Freeze -> Register -> Wrap)
        const avatarAtom = await OmniOne.manifest<ISovereignAvatar>({
            intent: `Manifest_Sovereign_Avatar: ${nickname}`,
            type: 'Note', // Avatars are Sentient Notes in the 5T protocol
            payload,
            domainRef: 'IDENTITY-DOMAIN',
            tags: ['Avatar', 'Sovereign', 'Resonance'],
            formula: '$A = \\int (Knowledge \\times Practice) dt$',
            impactMetric: 'Sentient_Presence_Index'
        });

        omniLogger.info(LogCategory.SYSTEM, `✨ Avatar Manifested: [${avatarAtom.uuid}] is now Sentient.`);
        return avatarAtom;
    }
}
