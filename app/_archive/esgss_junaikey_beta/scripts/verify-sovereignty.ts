import { SovereigntyService } from '../src/services/SovereigntyService';
import { EvidenceVault } from '../src/services/EvidenceVault';

async function verifySovereignty() {
    console.log('🧪 Verifying Tier 5 Sovereign Identity & Data Sovereignty...');

    // 1. Identity Awakening
    console.log('\n--- Step 1: Identity Awakening ---');
    const me = await SovereigntyService.getMyIdentity();
    console.log('Sovereign DID:', me.did);
    console.log('Sovereign Name:', me.name);

    // 2. Data Engraving
    console.log('\n--- Step 2: Data Engraving ---');
    const sensitiveData = { carbonCredits: 500, origin: 'Amazon Rainforest' };
    const seal = await SovereigntyService.engrave(sensitiveData, me.did);
    console.log('Seal Signature:', seal.signature);

    // 3. Evidence Vault Integration
    console.log('\n--- Step 3: Evidence Vault Sovereign Deposit ---');
    const metadata = await EvidenceVault.deposit(
        sensitiveData,
        'carbon_cert.json',
        'application/json',
        me.did,
        seal.signature
    );
    console.log('Evidence Metadata with Sovereignty:', {
        owner: metadata.sovereignOwnerId,
        seal: metadata.sovereignSeal
    });

    // 4. Verification Check
    console.log('\n--- Step 4: Seal Verification ---');
    const isValid = await SovereigntyService.verifySeal(sensitiveData, seal);
    console.log('Seal is Valid:', isValid);

    const tamperedData = { ...sensitiveData, carbonCredits: 999999 };
    const isTamperValid = await SovereigntyService.verifySeal(tamperedData, seal);
    console.log('Tampered Data is Valid (Should be false):', isTamperValid);

    if (isValid && !isTamperValid && metadata.sovereignOwnerId === me.did) {
        console.log('\n✅ [VERIFICATION PASSED] Sovereignty Protocol is Active.');
    } else {
        console.log('\n❌ [VERIFICATION FAILED]');
    }
}

verifySovereignty().catch(console.error);
