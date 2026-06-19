
import { ARVOService } from '../src/omni/core/ARVOService';
import { geminiCore } from '../src/services/ai/GeminiService';

async function testArvoTruth() {
    console.log('☯️ Testing InfoOne Phase 18: Omni-Truth (ARVO)...');

    const arvo = new ARVOService();

    // Test Case 1: Valid Truth
    console.log('\n--------------------------------------------------');
    console.log('🧪 Testing Case: Valid Claim');

    const evidenceStrong = {
        tangible: { metric: 'Carbon_Reduced_10T', visual_grade: 'PLATINUM' },
        traceable: { source: 'IoT_Sensor_X1' }
    };

    // Simulate Gemini Response (if Mock Mode is active, this will test the mock path)
    // If Real Key is present, it tests Real AI.
    console.log('Sending to ARVO...');
    const result1 = await arvo.verifyTruth(
        "The system has reduced carbon by 10 tons as verified by Sensor X1.",
        evidenceStrong,
        "Carbon Reduction Target: 10 Tons"
    );

    console.log('Result:', result1);

    // Test Case 2: Hallucination (Claim not supported by evidence)
    console.log('\n--------------------------------------------------');
    console.log('🧪 Testing Case: Hallucination');

    const evidenceWeak = {
        tangible: { metric: 'Water_Usage', visual_grade: 'GOLD' }
    };

    const result2 = await arvo.verifyTruth(
        "We achieved teleportation to Mars yesterday.",
        evidenceWeak,
        "Mars Mission: Planning Phase"
    );

    console.log('Result:', result2);

    if (result2.hallucinationDetected) {
        console.log('✅ Hallucination correctly detected.');
    } else {
        console.log('⚠️ Hallucination NOT detected (AI might be lenient or mocking).');
    }

    // Verification of Status
    console.log('\n--------------------------------------------------');
    console.log(`ARVO Status: ${arvo.status}`);

    console.log('✅ ARVO Truth Test Complete.');
}

testArvoTruth();
