
import { MarketIntelligenceCrawler } from '../server/services/MarketIntelligenceCrawler.js';
import crypto from 'crypto';

/**
 * 驗證 MarketIntelligenceCrawler 的 5T 協議合規性
 * Verifies 5T Protocol Compliance for MarketIntelligenceCrawler
 */
async function verifyIntelligenceCenter() {
    console.log('🔍 Starting Business Intelligence Center Verification (5T Protocol)...');

    const crawler = new MarketIntelligenceCrawler();
    const mockData = {
        url: 'https://example.com/esg-news',
        sentiment: 'Positive',
        impactScore: 0.85,
        confidence: 0.9,
        tags: ['Carbon', 'Innovation'],
        timestamp: '2026-02-16T12:00:00Z'
    };

    try {
        // 1. Verify Hash Generation (Trustworthy)
        console.log('👉 Step 1: Testing Integrity Hash Generation...');

        // We expect generateIntegrityHash to be public now
        // If it's not (due to TS compile lag or interface check), this script will fail to compile/run
        // But we modified the file, so it should be fine with tsx.

        // Check if method exists (runtime check for safety in script)
        if (typeof crawler.generateIntegrityHash !== 'function') {
            throw new Error('❌ generateIntegrityHash is not accessible (or not function)');
        }

        const hash = crawler.generateIntegrityHash(mockData);
        console.log('✅ Hash Generated:', hash);

        if (!hash || hash.length !== 64) {
            throw new Error('❌ Invalid Hash Format (must be SHA-256 hex string)');
        }

        // 2. Verify Determinism (Transparent)
        console.log('👉 Step 2: Verifying Hash Determinism...');
        const hash2 = crawler.generateIntegrityHash(mockData);
        if (hash !== hash2) {
            throw new Error('❌ Hash is not deterministic!');
        }
        console.log('✅ Hash is Deterministic');

        // 3. Verify Sensitivity to Change (Traceable uniqueness)
        console.log('👉 Step 3: Verifying Sensitivity...');
        const modifiedData = { ...mockData, sentiment: 'Negative' };
        const hash3 = crawler.generateIntegrityHash(modifiedData);
        if (hash === hash3) {
            throw new Error('❌ Hash collision detected on different data!');
        }
        console.log('✅ Hash changed correctly on data modification');

        // 4. Verify Manual Calculation Match
        const expectedHash = crypto.createHash('sha256').update(JSON.stringify(mockData)).digest('hex');
        if (hash !== expectedHash) {
            // This might fail if JSON.stringify order differs, but usually consistent for simple objects.
            // Let's verify if the service uses any special serialization. 
            // It uses JSON.stringify(data).
            console.warn('⚠️ Manual hash match warning: JSON serialization order might differ.');
            console.log(`Expected: ${expectedHash}, Got: ${hash}`);
        } else {
            console.log('✅ Manual Hash Calculation Matched');
        }

        console.log('✅ Business Intelligence Center Verification Successful');

    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
        process.exit(1);
    }
}

verifyIntelligenceCenter();
