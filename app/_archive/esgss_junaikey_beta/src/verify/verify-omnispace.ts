import * as dotenv from 'dotenv';
// Load environment variables *before* any other imports
dotenv.config();

// Remove static imports that trigger early execution
// import { omniSpaceClient } from '../2-infra/api/OmniSpaceClient';
// import { omniLogger, LogCategory } from '../2-infra/logging/OmniLogger';

async function verifyOmniSpace() {
  console.log('🔍 Starting OmniSpace Verification...');
  console.log('Environment Debug: OMNI_SPACE_API_KEY exists?', !!process.env.OMNI_SPACE_API_KEY);

  // Dynamically import to ensure process.env is ready
  const { omniSpaceClient } = await import('../2-infra/api/OmniSpaceClient');
  const { omniLogger, LogCategory } = await import('../2-infra/logging/OmniLogger');
  console.log('Environment Debug: Key length:', process.env.OMNI_SPACE_API_KEY?.length);

  // We can access private property for verification purposes using 'any' cast,
  // or rely on the logger output we just added.
  // Let's rely on the operation.

  try {
    console.log('⏳ Creating sync session...');
    const sessionId = await omniSpaceClient.createSyncSession('VerificationModule');
    console.log(`✅ Session Created: ${sessionId}`);

    console.log('⏳ Fetching aggregated data...');
    const data = await omniSpaceClient.fetchAggregatedData('test-query');
    console.log(`✅ Data Fetched: ${data.length} records`);
  } catch (error: any) {
    omniLogger.error(LogCategory.SYSTEM, '[verify-omnispace] \n❌ Verification Failed!');
    omniLogger.error(LogCategory.SYSTEM, '[verify-omnispace] Errors:', error.message);
  }
}

verifyOmniSpace();
