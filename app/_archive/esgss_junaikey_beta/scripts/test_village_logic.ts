import { globalPulseService } from '../src/services/GlobalPulseService.js';

async function testVillageLogic() {
    console.log('--- Phase 86: GlobalPulseService Logic Verification ---');

    // Initial State
    console.log('Initial Resonance:', globalPulseService.getResonance());
    console.log('Initial Granular:', globalPulseService.getGranularResonance());

    // Generate a pulse
    console.log('\nGenerating Pulse...');
    const event = await globalPulseService.generatePulse();
    console.log('Event Detected:', event.message || event.title, `(${event.type})`, 'Intensity:', event.intensity);

    // Check State After Pulse
    console.log('\nNew Global Resonance:', globalPulseService.getResonance());
    console.log('New Granular Resonance:', globalPulseService.getGranularResonance());

    // Verify Crystallization
    console.log('\nCrystallizing Pulse Asset...');
    const asset = await globalPulseService.crystallizePulse();
    console.log('Asset UUID:', asset.uuid);
    console.log('Asset Tangible Metric:', asset.evidence.tangible?.metric);
    console.log('Asset Data Granular:', JSON.stringify(asset.data.granular));

    if (asset.status === 'Trustworthy' && asset.data.granular) {
        console.log('\n✅ VERIFICATION SUCCESSFUL: Logic alignment confirmed.');
    } else {
        console.log('\n❌ VERIFICATION FAILED: Asset state inconsistent.');
        process.exit(1);
    }
}

testVillageLogic().catch(err => {
    console.error('Test Execution Error:', err);
    process.exit(1);
});
