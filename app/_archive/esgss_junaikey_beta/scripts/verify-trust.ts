import fetch from 'node-fetch';
import crypto from 'crypto';

const API_IO = 'http://localhost:3001/api';

async function verifyTrustLayer() {
  console.log('🛡️ Initiating Decentralized Trust Layer Verification...');

  // 1. Verify Blockchain Anchoring
  console.log('\nTesting Blockchain Anchoring...');
  const testHash = '0x' + crypto.randomBytes(32).toString('hex');
  try {
    const res = await fetch(`${API_IO}/anchor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hash: testHash,
        metadata: { source: 'Verification Script', type: 'HealthCheck' },
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    const anchorResult = await res.json();
    console.log(`✅ Anchor Success! TxHash: ${anchorResult.txHash} (${anchorResult.status})`);
  } catch (e) {
    console.error('❌ Anchor Failed:', e);
  }

  // 2. Verify ZKP Service
  console.log('\nTesting Zero-Knowledge Proof (Simulation)...');
  try {
    const res = await fetch(`${API_IO}/zkp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proof: { pi_a: [], pi_b: [], pi_c: [] },
        signals: [testHash],
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    const zkpResult = await res.json();
    console.log(`✅ ZKP Verification Result: ${zkpResult.valid ? 'VALID' : 'INVALID'}`);
  } catch (e) {
    console.error('❌ ZKP Failed:', e);
  }
}

verifyTrustLayer();
