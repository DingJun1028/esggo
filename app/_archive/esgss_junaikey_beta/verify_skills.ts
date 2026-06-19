
import { JunAiKeySkillsService } from './server/services/JunAiKeySkillsService.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import fs from 'fs';

const LOG_FILE = 'verification_log.txt';

function log(message: string) {
    console.log(message);
    fs.appendFileSync(LOG_FILE, message + '\n', 'utf8');
}

async function verifySkills() {
    // Clear log file
    fs.writeFileSync(LOG_FILE, '', 'utf8');

    log('--- Verifying JunAiKey Skills ---');

    const skillsService = JunAiKeySkillsService.getInstance();
    const registry = skillsService.getRegistry();

    log(`Registered Skills: ${registry.length}`);
    registry.forEach(s => log(`- ${s.name}: ${s.description}`));

    // Mock User ID for testing
    const TEST_USER_ID = '00000000-0000-0000-0000-000000000000'; // Replace with valid UUID if testing against real DB

    // Test: Create Note Skill
    log('\n--- Testing: create_note ---');
    try {
        const result = await skillsService.executeSkill('create_note', {
            user_id: TEST_USER_ID,
            title: 'Test Note from Verification Script',
            content: 'This is a test note created to verify the skills architecture.',
            tags: 'test,verification,junAiKey'
        });

        log('Result: ' + JSON.stringify(result, null, 2));
    } catch (error) {
        log('Error testing create_note: ' + error);
    }

    // Test: Find Resonance
    log('\n--- Testing: find_resonance ---');
    try {
        // We'll skip this if we don't have a valid note UUID, or use a dummy one
        // Ideally we use the ID returned from the previous step, but let's just show it's callable
        // For real verification we need a valid ID.
        log('Skipping actual execution without valid Note ID, but skill is registered.');
    } catch (error) {
        log('Error testing find_resonance: ' + error);
    }
}

verifySkills().catch(console.error);
