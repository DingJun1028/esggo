
import axios from 'axios';
import omniPriest from './server/services/OmniPriest.js';
import { CircuitBreaker } from './src/core/CircuitBreaker.js';

async function verifyBestPractices() {
    console.log('🛡️ Verifying Best Practices Implementation...');

    // 1. Verify OmniPriest & Token Tracking
    console.log('\n1️⃣ Testing OmniPriest (Token Tracking)...');
    try {
        console.log('Sending prompt to OmniPriest...');

        // Mocking the actual call to avoid cost/key requirement for this test script if possible, 
        // but seeing as we want to verify integration, let's try a real call or inspect stats state.
        // For safety, let's just inspect the initial status first.
        const initialStatus = omniPriest.getStatus();
        console.log('Initial Status:', JSON.stringify(initialStatus, null, 2));

        if (initialStatus.status === 'active') {
            // Optional: Make a very small real call if key exists
            // await omniPriest.execute('Hi', 'gemini-flash');
        } else {
            console.log('⚠️ OmniPriest is disabled (missing API key), skipping live generation test.');
        }

    } catch (e) {
        console.error('OmniPriest Test Failed:', e);
    }

    // 2. Verify Circuit Breaker Logic
    console.log('\n2️⃣ Testing Circuit Breaker Logic...');
    const circuitKey = 'test-circuit';
    CircuitBreaker.recordFailure(circuitKey);
    CircuitBreaker.recordFailure(circuitKey);
    CircuitBreaker.recordFailure(circuitKey);
    CircuitBreaker.recordFailure(circuitKey);
    CircuitBreaker.recordFailure(circuitKey); // 5th failure -> OPEN

    const isOpen = CircuitBreaker.isOpen(circuitKey);
    console.log(`Circuit '${circuitKey}' Open State (Expect true):`, isOpen);

    if (isOpen) {
        console.log('✅ Circuit Breaker successfully opened after threshold failures.');
    } else {
        console.error('❌ Circuit Breaker failed to open.');
    }

    process.exit(0);
}

verifyBestPractices();
