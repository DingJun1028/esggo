import { themeStyleService } from '../src/services/ThemeStyleService.js';
import { contextualActionService } from '../src/services/ContextualActionService.js';
import chalk from 'chalk';

/**
 * 🧪 Phase 21: Sentient UI Verification Script
 * Note: Since these services interact with the DOM, we'll mock the DOM environment for the script.
 */

// Mock document for Node environment
if (typeof document === 'undefined') {
    (global as any).document = {
        documentElement: {
            style: {
                setProperty: (name: string, value: string) => {
                    console.log(chalk.gray(`   [DOM] Set ${name} to ${value}`));
                }
            }
        }
    } as any;
}

async function testSentientUI() {
    console.log(chalk.blue('--- Phase 21: Sentient UI & Personalization Audit ---'));

    // 1. Theme Switching Test
    console.log(chalk.gray('1. Testing Dynamic Theme Shift (ETHEREAL)...'));
    themeStyleService.applyTheme('ETHEREAL');
    const etherealTheme = themeStyleService.getCurrentTheme();
    if (etherealTheme.primary === '#a855f7') {
        console.log(chalk.green('   ✅ Theme Logic: ETHEREAL Palette applied.'));
    }

    console.log(chalk.gray('2. Testing Agent-Type Theme Mapping...'));
    const mode = themeStyleService.getThemeByAgentType('SOVEREIGN');
    if (mode === 'SENTIENT') {
        console.log(chalk.green('   ✅ Mapping Logic: Sovereign -> SENTIENT correctly mapped.'));
    }

    // 2. Proactive Advice Test
    console.log(chalk.gray('3. Testing Proactive Context Analysis...'));
    let adviceReceived = false;
    contextualActionService.subscribe((advice) => {
        if (advice && advice.length > 0 && advice[0].sourceAgentId === 'CarbonSentinel') {
            adviceReceived = true;
        }
    });

    contextualActionService.analyzeContext({
        type: 'EMISSION_ALERT',
        value: 1500
    });

    if (adviceReceived) {
        console.log(chalk.green('   ✅ Proactive Logic: Emission alert triggered CarbonSentinel advice.'));
    } else {
        throw new Error('Proactive advice not triggered');
    }

    console.log(chalk.blue('--- Sentient UI Audit Complete ---'));
}

testSentientUI().catch(err => {
    console.error(chalk.red('Verification failed:'), err);
    process.exit(1);
});
