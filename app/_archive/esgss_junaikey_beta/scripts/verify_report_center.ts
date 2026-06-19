
import { OmniReportService, ReportPipelineTask, ReportPayload } from '../server/services/OmniReportService.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * 驗證 OmniReportService 的 5T 協議合規性 (Corrected Signature)
 */
async function verifyReportCenter() {
    console.log('🔍 Starting Sustainability Report Center Verification (5T Protocol)...');

    const userId = 'test-user-verification';

    // Correct Payload Structure based on OmniReportService.ts
    const reportPayload: ReportPayload = {
        title: 'Verification Report 2026',
        narrative: 'This is a test narrative for 5T verification.',
        quantitativeData: 100, // Carbon Emissions
        domain: 'ENVIRONMENT',
        evidenceIds: ['ev-1', 'ev-2']
    };

    try {
        // 1. Verify Pipeline Creation (Traceable)
        console.log('👉 Step 1: Testing Report Pipeline Creation...');

        const pipeline: ReportPipelineTask = await OmniReportService.createReportPipeline(reportPayload, true);

        if (!pipeline.taskId) throw new Error('❌ Pipeline missing taskId (Traceable failed)');
        if (pipeline.currentNode !== 'seal') throw new Error(`❌ Pipeline node incorrect. Expected 'seal', got '${pipeline.currentNode}'`);
        console.log('✅ Pipeline Created:', pipeline.taskId);

        // 2. Verify Crystal Generation (Trustworthy & Transparent)
        console.log('👉 Step 2: Testing Crystal Generation logic...');

        try {
            const crystal = await OmniReportService.generateCrystal(reportPayload, true);

            // 3. Verify 5T Properties
            console.log('👉 Step 3: Verifying 5T Properties on Crystal...');

            if (!crystal.uuid) throw new Error('❌ Crystal missing UUID');
            if (!crystal.hashLock) throw new Error('❌ Crystal missing hashLock (Trustworthy failed)');
            if (!crystal.genesis_timestamp) throw new Error('❌ Crystal missing timestamp (Trackable failed)');
            if (!crystal.resonance.isLocked) throw new Error('❌ Crystal is not locked');

            // 4. Verify Hash Logic (Re-calculate)
            // const contentToHash = JSON.stringify(crystal.payload) + crystal.uuid + crystal.genesis_timestamp;
            // logic from OmniReportService:
            // const contentToHash = JSON.stringify(crystal.payload) + crystal.uuid + crystal.genesis_timestamp;

            const contentToHash = JSON.stringify(crystal.payload) + crystal.uuid + crystal.genesis_timestamp;
            const expectedHash = crypto.createHash('sha256').update(contentToHash).digest('hex');

            if (crystal.hashLock !== expectedHash) {
                throw new Error(`❌ Hash Mismatch! Expected: ${expectedHash}, Got: ${crystal.hashLock}`);
            }

            console.log('✅ Crystal Verification Successful:', {
                uuid: crystal.uuid,
                hashLock: crystal.hashLock.substring(0, 10) + '...'
            });

        } catch (innerError: any) {
            console.warn('⚠️ Service execution warning:', innerError.message);
            if (innerError.message.includes('supabase') || innerError.message.includes('connection')) {
                console.log('⚠️ Ignoring DB connection error for logic verification.');
            } else {
                throw innerError;
            }
        }

    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
        process.exit(1);
    }
}

verifyReportCenter();
