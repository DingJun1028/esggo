import { RealTimeDataSync } from '../src/services/realTimeDataSync';
import { IntegrationService } from '../src/services/integrationService';
import { omniLogger } from '../src/services/omniLogger';

// Mock logger
omniLogger.info = (cat, msg, meta) => console.log(`[INFO] [${cat}] ${msg}`, meta || '');
omniLogger.error = (cat, msg, meta) => console.error(`[ERROR] [${cat}] ${msg}`, meta || '');
omniLogger.warn = (cat, msg, meta) => console.warn(`[WARN] [${cat}] ${msg}`, meta || '');

async function verifyIntegration() {
  console.log('--- Verifying Data Integration Hardening ---');

  // 1. RealTimeDataSync
  console.log('\n--- Verifying RealTimeDataSync ---');
  const syncService = RealTimeDataSync.getInstance();

  // Set some state if possible via public methods
  syncService.configureSync({
    id: 'test-sync',
    dataSourceId: 'ds-1',
    enabled: true,
    mode: 'full' as any,
    interval: 1000,
    batchSize: 100,
    retryPolicy: { maxRetries: 3, retryDelay: 1000, exponentialBackoff: true },
    conflictResolution: 'local_wins',
  });

  // @ts-ignore - Check internal state access
  if (syncService.syncConfigs.size === 1) {
    console.log('State populated: sync config added.');
  }

  syncService.destroy();

  // @ts-ignore
  if (syncService.syncConfigs.size === 0) {
    console.log('SUCCESS: RealTimeDataSync destroyed (configs cleared).');
  } else {
    console.error('FAILURE: Sync configs not cleared.');
  }

  // 2. IntegrationService
  console.log('\n--- Verifying IntegrationService ---');
  const integrationService = new IntegrationService();

  // Create dummy service
  await integrationService.createAPIService({
    name: 'Test API',
    version: '1.0',
    baseUrl: '/test',
    endpoints: [],
    authentication: { type: 'none', required: false },
    rateLimits: { requestsPerMinute: 60, requestsPerHour: 100, requestsPerDay: 1000 },
    status: 'active',
    documentation: '',
  });

  // @ts-ignore
  if (integrationService.apiServices.size > 0) {
    console.log('State populated: API service added.');
  }

  integrationService.destroy();

  // @ts-ignore
  if (integrationService.apiServices.size === 0) {
    console.log('SUCCESS: IntegrationService destroyed (state cleared).');
  } else {
    console.error('FAILURE: API services not cleared.');
  }

  console.log('\n--- Verification Complete ---');
}

verifyIntegration().catch(console.error);
