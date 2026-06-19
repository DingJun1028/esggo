
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import openClawClient from '../server/services/OpenClawGatewayClient.js';
import omniLogger, { LogCategory } from '../server/utils/omniLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config();

/**
 * 🧪 Verify OmniCrew via OpenClaw
 * 
 * This script tests if the InfoOne backend can successfully route a request
 * through the OpenClaw Gateway to the OmniCrew MCP server.
 */
async function verifyIntegration() {
    console.log('--- 🧪 OmniCrew & OpenClaw Integration Verification ---');

    // 1. Check if OpenClaw is enabled
    if (process.env.OPENCLAW_ENABLED !== 'true') {
        console.warn('⚠️ OPENCLAW_ENABLED is not set to true. Setting it for this test...');
        process.env.OPENCLAW_ENABLED = 'true';
    }

    try {
        // 2. Connect to OpenClaw
        console.log('Connecting to OpenClaw Gateway...');
        await openClawClient.connect();
        console.log('✅ Connected to OpenClaw Gateway.');

        // 3. Send a request that should trigger OmniCrew
        // We prompt the model to use a tool provided by omnicrew (CrewAI)
        const prompt = "Please use the 'research_esg' tool in OmniCrew to find the latest ESG trends for 2024.";
        const model = 'claude-3-5-sonnet-20240620';

        console.log(`Sending prompt to OpenClaw (${model}): "${prompt}"`);

        // We use streaming to see real-time progress
        console.log('--- Response Stream Start ---');
        const stream = openClawClient.streamChat(prompt, model);
        let fullResponse = '';

        for await (const chunk of stream) {
            process.stdout.write(chunk);
            fullResponse += chunk;
        }
        console.log('\n--- Response Stream End ---');

        if (fullResponse.length > 0) {
            console.log('✅ Integration test successful! Received response via OpenClaw.');

            // Check if there are signs of tool usage or transparent metadata
            if (fullResponse.includes('CrewAI') || fullResponse.includes('omnicrew')) {
                console.log('💎 Detected OmniCrew specific output or tool usage.');
            }
        } else {
            console.error('❌ Received empty response from OpenClaw.');
        }

    } catch (error: any) {
        console.error('❌ Integration test failed:', error.message);
        if (error.stack) console.error(error.stack);
    } finally {
        process.exit(0);
    }
}

verifyIntegration();
