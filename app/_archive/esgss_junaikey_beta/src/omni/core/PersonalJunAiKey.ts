/**
 * PersonalJunAiKey
 *
 * A specialized Omni Crystal for individual accounts that supports
 * personalized settings and reflects them in its lifecycle.
 */

import { JunAiKey } from './OmniCrystal.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import type { PersonalSettings, Context, Result, Evolution, Feedback } from '../../types/index.ts';

export class PersonalJunAiKey extends JunAiKey {
    constructor(settings?: PersonalSettings) {
        super('OmniProxy', settings);
    }

    protected async onInitialize(): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, `[PersonalJunAiKey] Initializing with personalized settings...`, this.personalSettings);

        // Apply theme or language if provided (Simulated)
        if (this.personalSettings) {
            omniLogger.debug(LogCategory.UI, `[PersonalJunAiKey] Applying theme: ${this.personalSettings.theme}`);
            omniLogger.debug(LogCategory.UI, `[PersonalJunAiKey] Language set to: ${this.personalSettings.language}`);
        }

        // In a real application, this might trigger context hydration from the Palace
    }

    protected async onExecute(context: Context): Promise<Result> {
        omniLogger.info(LogCategory.SYSTEM, `[PersonalJunAiKey] Executing with personal context preference: ${this.personalSettings?.aiTone || 'default'}`);

        // Return current settings as part of the output if requested by context
        return {
            success: true,
            output: {
                ...((context.input as any) || {}),
                appliedSettings: this.personalSettings
            }
        };
    }

    protected async onEvolve(feedback: Feedback): Promise<Evolution> {
        // Evolve based on user usage of personalized features
        const optimizations: string[] = [];
        if (feedback.success) {
            optimizations.push('personalization-resonance');
        }

        return {
            optimizations,
            improvements: { personalizationEfficiency: 'high' },
            confidence: 0.98
        };
    }

    /**
     * Update settings dynamically
     */
    public updateSettings(newSettings: Partial<PersonalSettings>): void {
        if (!this.personalSettings) {
            this.personalSettings = {
                language: 'zh-TW',
                theme: 'aqua',
                notifications: true,
                aiTone: 'professional'
            };
        }
        this.personalSettings = { ...this.personalSettings, ...newSettings };
        omniLogger.info(LogCategory.SYSTEM, `[PersonalJunAiKey] Settings updated`, this.personalSettings);
    }
}
