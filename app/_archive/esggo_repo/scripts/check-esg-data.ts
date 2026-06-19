import { ncbClient } from '../lib/ncbdb';

async function checkEsgReports() {
  console.log('🔍 Checking ESG_Reports table in NCBDB...');
  try {
    const res = await ncbClient.listRecords('ESG_Reports');
    if (res.success) {
      console.log('✅ Found ESG_Reports:', JSON.stringify(res.data).substring(0, 500) + '...');
    } else {
      console.error('❌ Failed to fetch ESG_Reports:', res.error);
    }
  } catch (e) {
    console.error('💥 Error:', e);
  }
}

checkEsgReports();
