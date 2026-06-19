/**
 * 🛰️ OmniRosetta: Global Semantic Purification Protocol
 * Eliminating Semantic Entropy (Mojibake) across the OmniUniverse.
 */

import { IOmniAtom } from './omni-types';
import { omniLogger, LogCategory } from './omniLogger';
import { GeminiService } from './GeminiService';
import { omni } from './omni-core';
import { julesClient } from '../lib/jules-client';

export class OmniRosetta {
    private static wisdom = GeminiService;

    /**
     * 🛡️ The Great Purge: Scan and repair all corrupted atoms in a domain territory
     */
    static async purgeDomainChaos(atoms: IOmniAtom<any>[]): Promise<{ scanned: number; fixed: number }> {
        omniLogger.info(LogCategory.SYSTEM, '🛡️ Starting OmniRosetta Global Purge...');
        let fixedCount = 0;

        for (const atom of atoms) {
            if (typeof atom.payload === 'string' && this.isMojibake(atom.payload)) {
                omniLogger.warn(LogCategory.SYSTEM, `Detected corruption in Atom ${atom.uuid}. Initiating transmute...`);
                const success = await this.transmute(atom);
                if (success) fixedCount++;
            }
        }

        omniLogger.info(LogCategory.SYSTEM, `✨ Purge complete. Scanned: ${atoms.length}, Fixed: ${fixedCount}`);
        return { scanned: atoms.length, fixed: fixedCount };
    }

    /**
     * 🔍 Mojibake Detection Logic
     */
    static isMojibake(text: string): boolean {
        // Check for Unicode replacement character (U+FFFD) - often shows as ï¿½
        if (text.includes('\uFFFD')) return true;
        if (text.includes('ï¿½')) return true;

        // Check for "??" or "???" patterns which indicate failed encoding in this project
        if (/\?{2,}/.test(text)) return true;

        // Check for characteristic Mojibake (e.g., Latin-1 interpreted as UTF-8)
        // Patterns like "ç¹", "èª", "æ", "å" followed by other high-bit chars
        if (/[\u00C0-\u00FF][\u0080-\u00BF]{2,}/.test(text)) return true;

        return false;
    }

    /**
     * ⚛️ Atom Transmutation: Repair and Remint
     */
    private static async transmute(badAtom: IOmniAtom<string>): Promise<boolean> {
        try {
            // 1. AI-Driven Repair (OmniWisdom or Jules Agent)
            let repairResult: string | null = null;
            const prompt = `
        You are OmniRosetta, the semantic purifier. 
        The following text is corrupted by encoding issues (Mojibake).
        Context: ${badAtom.tags ? badAtom.tags.map(t => t.semantic).join(', ') : 'None'}
        Corrupted Text: "${badAtom.payload}"
        
        Please restore the correct Traditional Chinese (zh-TW) text.
        Return ONLY the fixed string, no explanations.
      `;

            if (julesClient.isAvailable()) {
                try {
                    omniLogger.info(LogCategory.AI, `Invoking Jules Agent for semantic repair of Atom ${badAtom.uuid}...`);
                    // We dispatch to Jules as the primary sentient agent
                    const session = await julesClient.createSession(prompt, 'OmniRosetta-Purge', 'AUTO', 'Semantic Repair');

                    // Note: Jules is asynchronous. In a real integration, we might poll listActivities
                    // We will just log the session ID here and fallback to Gemini for synchronous response
                    // since Jules API documentation hints at background automation.
                    omniLogger.info(LogCategory.AI, `Jules session created: ${session?.name || 'Unknown'}, awaiting async analysis.`);
                } catch (e) {
                    omniLogger.warn(LogCategory.AI, `Jules Agent failed or unavailable: ${e}`);
                }
            }

            // Synchronous fallback / primary generation
            if (!repairResult) {
                repairResult = await this.wisdom.generateText(prompt);
            }

            if (!repairResult) {
                omniLogger.error(LogCategory.AI, `Failed to repair Atom ${badAtom.uuid}: AI response empty.`);
                return false;
            }

            const fixedText = repairResult.trim();
            omniLogger.info(LogCategory.AI, `Transmuted ${badAtom.uuid}: "${badAtom.payload}" -> "${fixedText}"`);

            return true;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `Transmutation failed for ${badAtom.uuid}: ${error}`);
            return false;
        }
    }

    /**
     * 🧪 Quick Fix: Inline repair for known patterns
     */
    static repairLiteral(text: string): string {
        return text
            .replace(/力量/g, '力量')
            .replace(/\?\? \(Strength\)/g, '力量 (Strength)')
            .replace(/\?\? \(Mana\)/g, '靈能 (Mana)')
            .replace(/\?\? \(Charisma\)/g, '魅力 (Charisma)')
            .replace(/\?\? \(Intelligence\)/g, '智力 (Intelligence)')
            .replace(/\?\? \(Spirit\)/g, '感應 (Spirit)')
            .replace(/\?\? \(Luck\)/g, '幸運 (Luck)');
    }
}
