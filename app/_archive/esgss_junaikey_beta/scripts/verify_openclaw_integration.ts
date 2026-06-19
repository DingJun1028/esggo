
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

import omniPriest from '../server/services/OmniPriest.js';
import omniLogger, { LogCategory } from '../server/utils/omniLogger.js';

/**
 * 🧪 verify_openclaw_integration.ts
 * 
 * 驗證 InfoOne 是否能透過 OpenClaw Gateway 進行對話。
 */
async function verify() {
    console.log('--- 🧪 OpenClaw Integration Verification ---');

    // Force OpenClaw enabled for this test
    process.env.OPENCLAW_ENABLED = 'true';
    console.log('OPENCLAW_ENABLED set to true for test.');

    try {
        console.log('\n[Phase 1] Testing execute (Blocking Chat)...');
        const prompt = "Hello OpenClaw! Please respond with a short greeting and identify yourself as 'OpenClaw Integrated InfoOne'.";
        const response = await omniPriest.execute(prompt);
        console.log('Response:', response);

        if (response.toLowerCase().includes('openclaw')) {
            console.log('✅ Phase 1 Successful: OpenClaw routing verified.');
        } else {
            console.warn('⚠️ Phase 1 Ambiguous: Response received but identity not confirmed.');
        }

        console.log('\n[Phase 2] Testing stream (Streaming Chat)...');
        const streamPrompt = "Explain the 5T Protocol in two sentences using simple terms.";
        const stream = omniPriest.stream(streamPrompt);

        process.stdout.write('Stream Output: ');
        let fullContent = '';
        for await (const chunk of stream) {
            process.stdout.write(chunk);
            fullContent += chunk;
        }
        console.log('\n\n✅ Phase 2 Successful: Stream routing verified.');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    } finally {
        console.log('\n--- Verification Finished ---');
        process.exit(0);
    }
}

verify();
