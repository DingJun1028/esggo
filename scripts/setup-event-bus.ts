import { ncbClient } from '../lib/ncbdb';

async function setupEventBusTable() {
  console.log('🚀 Establishing Persistent Intent Field in NCBDB...');
  
  const dummyEvent = {
    event_type: 'SYSTEM_BOOT',
    payload: JSON.stringify({ message: 'OmniAgent Bus Persistent Layer Active' }),
    timestamp: new Date().toISOString(),
    event_id: 'boot-' + Date.now(),
    source: 'SetupScript'
  };

  try {
    const res = await ncbClient.upsertRecord('omni_event_bus', dummyEvent);
    if (res.success) {
      console.log('✅ Intent Field established successfully.');
    } else {
      console.error('❌ Failed to establish Intent Field:', res.error);
    }
  } catch (e) {
    console.error('💥 Error during setup:', e);
  }
}

setupEventBusTable();
