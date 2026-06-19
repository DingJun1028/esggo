import {
  integrityPassport,
  IntegrityPassportService,
  PassportData,
} from '../src/services/IntegrityPassportService';
import { evidenceVault } from '../src/1-service/EvidenceVaultService';
import { IComponentCore } from '../src/types/core'; // Adjust import path
import { omniLogger, LogCategory } from '../src/2-infra/logging/OmniLogger';

import { ncb } from '../src/lib/ncb/client';

/**
 * 🧪 Verification Script: Integrity Passport & 5T Logic
 * ----------------------------------------------------
 * Simulates:
 * 1. User gets initial passport.
 * 2. User mints and seals a Crystal DNA.
 * 3. Passport score updates dynamically.
 * 4. User keeps sealing crystals to evolve Rank.
 */

async function runVerification() {
  console.log('🚀 Starting Integrity Passport Verification...\n');

  // Wait for NCB Client to be ready (sign-in)
  await (ncb as any).waitReady();
  const { data: sessionData } = await ncb.auth.getSession();
  const USER_ID = sessionData?.session?.user?.id || 'verify-user-001';

  console.log(`--- [Step 1] Initial Passport Check for User: ${USER_ID} ---`);
  let passport = await integrityPassport.getPassport(USER_ID);
  logPassport(passport);

  if (passport.score !== 0)
    console.warn('⚠️ Initial score should be 0 (if no assets). Current:', passport.score);
  // Note: My calculation logic in service: calculateTotalScore(pillars).
  // Pillars start at 0 if no assets. So score 0.

  // --- Step 2: Mint & Seal First Crystal ---
  console.log('\n--- [Step 2] Minting & Sealing Crystal #1 ---');
  const crystal1: IComponentCore = createMockCrystal(
    `crystal-${Date.now()}-001`,
    'First Quest Badge',
    'Impact: 100 Co2'
  );

  passport = await integrityPassport.sealAsset(USER_ID, crystal1);
  logPassport(passport);

  // Assertions
  if (passport.sealedCrystals.length !== 1) throw new Error('❌ Crystal not sealed!');
  if (passport.pillars.trustworthy !== 20)
    throw new Error(`❌ Trustworthy score wrong. Expected 20, got ${passport.pillars.trustworthy}`);
  if (passport.score < 50) throw new Error('❌ Total score too low.');
  console.log('✅ Crystal #1 Sealed & Score Updated.');

  // --- Step 3: Rank Evolution (Spamming Crystals) ---
  console.log('\n--- [Step 3] Rank Evolution to Diamond ---');

  // We need ~800 points for Diamond.
  // Each crystal gives roughly:
  // Tangible(10) + Traceable(10) + Trackable(10) + Transparent(10) + Trustworthy(20) = 60 points.
  // We need about 14 crystals total.

  const crystalsNeeded = 13;
  for (let i = 0; i < 14; i++) {
    const c = createMockCrystal(`crystal-bulk-${i}`, `Bulk Asset ${i}`, 'Impact: High');
    await integrityPassport.sealAsset(USER_ID, c);
  }

  passport = await integrityPassport.getPassport(USER_ID);
  logPassport(passport);

  if (passport.rank !== 'Diamond' && passport.rank !== 'Transcended') {
    throw new Error(`❌ Rank Evolution Failed. Expected Diamond+, got ${passport.rank}`);
  }
  console.log('✅ Rank Evolution Verified! User is now:', passport.rank);

  console.log('\n🎉 Verification Complete! 5T Logic & Passport Integration is SOLID.');
}

function createMockCrystal(uuid: string, name: string, impact: string): IComponentCore {
  return {
    uuid,
    timestamp: Date.now(),
    formula: 'E = MC^2', // Transparent +10
    impactMetric: impact, // Tangible +10
    status: 'Trustworthy', // Trustworthy +20 (handled by seal logic mostly, but we assume it becomes this)
    data: { name },
    evidence: {
      trustworthy: { hash_lock: `hash-${uuid}`, is_frozen: true, locked_at: Date.now() },
      traceable: { source_origin: 'Genesis' }, // Traceable +10
      trackable: { lifecycle_events: [] }, // Trackable logic checked in service? (Yes, if timestamp exists +10)
      transparent: { formula: 'E=MC^2' },
      tangible: { impact_metric: impact },
    },
  } as any; // Cast to any because IComponentCore is complex
}

function logPassport(p: PassportData) {
  console.log(`[Passport] Rank: ${p.rank} | Score: ${p.score} | Seals: ${p.sealedCrystals.length}`);
  console.log(
    `           Pillars: Tangible(${p.pillars.tangible}) Trustworthy(${p.pillars.trustworthy})...`
  );
}

runVerification().catch(err => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
