import { authService } from '../src/services/auth';
import { analyticsService } from '../src/services/analytics';
import { historicalDataAnalysis } from '../src/services/historicalDataAnalysis';
import { dataManager } from '../src/services/dataManager';
import { omniLogger, LogCategory } from '../src/services/omniLogger';

// Mock logger to avoid console spam if needed, or just let it log
// omniLogger.info = (cat, msg, meta) => console.log(`[INFO] [${cat}] ${msg}`);

async function verifyPhase13() {
  console.log('--- Verifying Phase 13: Engine & Core Services Hardening ---');

  try {
    console.log('[1] Testing AuthService...');
    authService.destroy();
    console.log('AuthService destroyed.');
  } catch (e) {
    console.error('AuthService failed', e);
  }

  try {
    console.log('[2] Testing AnalyticsService...');
    analyticsService.destroy();
    console.log('AnalyticsService destroyed.');
  } catch (e) {
    console.error('AnalyticsService failed', e);
  }

  try {
    console.log('[3] Testing HistoricalDataAnalysis...');
    historicalDataAnalysis.destroy();
    console.log('HistoricalDataAnalysis destroyed.');
  } catch (e) {
    console.error('HistoricalDataAnalysis failed', e);
  }

  try {
    console.log('[4] Testing DataManager...');
    await dataManager.destroy();
    console.log('DataManager destroyed.');
  } catch (e) {
    console.error('DataManager failed', e);
  }

  console.log('--- All Phase 13 Verifications Completed ---');
}

verifyPhase13().catch(console.error);
