
import { sovereignLedger } from '../../1-service/SovereignLedger';

async function testLedger() {
    console.log('--- SovereignLedger Import Test ---');
    try {
        console.log('Ledger Instance:', typeof sovereignLedger);
        console.log('Summary:', sovereignLedger.getImpactSummary());
    } catch (e) {
        console.error('Ledger failure:', e);
    }
}
testLedger();
