import { omniCollectorService } from '../server/src/services/OmniCollectorService.js';
import { omniLogger, LogCategory } from '../src/omni/infrastructure/logging/OmniLogger.js';

/**
 * 🧪 OmniCollector Flow Verification
 * --------------------------------------------------
 * Simulates a document upload, AI extraction, and 5T fusion.
 */
async function verifyCollectorFlow() {
    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting OmniCollector Verification Flow...');

    // 1. Mock File
    const mockFile = {
        name: 'Carbon_Emission_Report_2026.pdf',
        type: 'application/pdf',
        size: 1024 * 1024
    };

    try {
        // 2. Execute Collection
        omniLogger.info(LogCategory.SYSTEM, '--- Step 1: Collection & Structuring ---');
        const result = await omniCollectorService.collectFromDocument(mockFile);

        console.log('\n📊 Collection Result:');
        console.log(`- Task ID: ${result.taskId}`);
        console.log(`- Structured Content Preview: ${result.structuredContent.substring(0, 100)}...`);
        console.log(`- Global Correlation Score: ${(result.correlationScore * 100).toFixed(2)}%`);
        console.log(`- Evidence ID: ${result.evidenceId}`);

        console.log('\n💎 Extracted Metrics:');
        result.metrics.forEach(m => {
            console.log(`  [${m.category}] ${m.key}: ${m.value} ${m.unit || ''} (Confidence: ${(m.confidence * 100).toFixed(2)}%)`);
        });

        // 3. Finalize to Trinity
        omniLogger.info(LogCategory.SYSTEM, '--- Step 2: Finalizing to Trinity ---');
        const trinity = await omniCollectorService.finalizeToTrinity(result, {
            location: 'Factory A',
            collector: 'JunAiKey-Sentry'
        });

        console.log('\n🏗️ Trinity Asset Forged:');
        console.log(`- UUID: ${trinity.uuid}`);
        console.log(`- Status: ${trinity.isLocked() ? '🔒 LOCKED (Trustworthy)' : '🔓 UNLOCKED'}`);
        console.log(`- KB Entry Hash: ${trinity.knowledge.hashLock}`);

        omniLogger.info(LogCategory.SYSTEM, '✅ OmniCollector Verification Successful.');
    } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, '❌ OmniCollector Verification Failed.', { error });
        process.exit(1);
    }
}

verifyCollectorFlow();
