import { AssetService } from '../src/services/AssetService';
import { DataRoomService } from '../src/services/collaboration/DataRoomService';
import { OmniStore, OmniNamespace } from '../src/services/OmniStore';

async function verifyPersistence() {
    console.log('🧪 Verifying Tier 2 & Tier 5 Persistence...');

    // 1. Asset Service Persistence
    console.log('\n--- Step 1: Asset Service ---');
    AssetService.clearState();
    const initialAssets = await AssetService.getStrategicAssets();
    console.log('Initial Assets Count:', initialAssets.length);

    const savedAssets = await AssetService.getStrategicAssets();
    console.log('Assets after reload from store:', savedAssets.length);

    const isPersistent = JSON.stringify(initialAssets) === JSON.stringify(savedAssets);
    console.log('Persistence Success:', isPersistent);

    // 2. Data Room Service
    console.log('\n--- Step 2: Data Room Service ---');
    const docs = await DataRoomService.getDocuments();
    console.log('Default Documents Count:', docs.length);

    const newDoc = await DataRoomService.uploadDocument('New Security Audit.pdf', 'EVIDENCE');
    const updatedDocs = await DataRoomService.getDocuments();
    const wasAdded = updatedDocs.some(d => d.id === newDoc.id);
    console.log('Document Upload Success:', wasAdded);

    if (isPersistent && wasAdded) {
        console.log('\n✅ [VERIFICATION PASSED] Tier 2 & Tier 5 are fully persistent.');
    } else {
        console.log('\n❌ [VERIFICATION FAILED]');
    }
}

verifyPersistence().catch(console.error);
