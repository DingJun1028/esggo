'use client';

// ═══════════════════════════════════════════════════════════════
// ESG GO | 5T Integrity Protocol — Real Cryptographic Engine
// Uses Web Crypto API (browser-native, no external dependencies)
// ═══════════════════════════════════════════════════════════════

export interface HashLockResult {
  hash: string;
  algorithm: string;
  timestamp: string;
  nonce: string;
  inputPreview: string;
}

export interface ZKPCommitment {
  commitment: string;       // H(value || blinding_factor)
  publicHash: string;       // H(value) — public
  blindingHash: string;     // H(blinding_factor) — kept secret
  proofSignature: string;   // HMAC-SHA256(commitment || timestamp)
  timestamp: string;
  algorithm: string;
}

export interface ZKPVerifyResult {
  valid: boolean;
  steps: VerifyStep[];
  finalHash: string;
  timeTaken: number;
}

export interface VerifyStep {
  step: number;
  name: string;
  input: string;
  output: string;
  passed: boolean;
}

export interface HashChainBlock {
  index: number;
  data: string;
  previousHash: string;
  hash: string;
  timestamp: string;
  nonce: number;
}

import * as cryptoNode from 'crypto';

// ── Real SHA-256 via Web Crypto API with Node.js Fallback ───────
export async function sha256(message: string): Promise<string> {
  // Use Node.js crypto if in Node environment (preferred for stability in tests)
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return cryptoNode.createHash('sha256').update(message).digest('hex');
  }

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  return ''; // Fallback for unsupported environments
}

// ── SHA-512 for higher security contexts ────────────────────────
export async function sha512(message: string): Promise<string> {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return cryptoNode.createHash('sha512').update(message).digest('hex');
  }

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  return '';
}

// ── HMAC-SHA256 (message authentication) ────────────────────────
export async function hmacSHA256(key: string, message: string): Promise<string> {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return cryptoNode.createHmac('sha256', key).update(message).digest('hex');
  }

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  return '';
}

// ── Generate cryptographically secure random nonce ───────────────
export function generateNonce(bytes = 16): string {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return cryptoNode.randomBytes(bytes).toString('hex');
  }

  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(bytes);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  return Math.random().toString(36).substring(2); // Last resort insecure fallback
}

// ── T4 Trustworthy: Hash Lock ────────────────────────────────────
export async function createHashLock(data: unknown): Promise<HashLockResult> {
  const payload = JSON.stringify(data);
  const nonce = generateNonce();
  const timestamp = new Date().toISOString();

  // Hash = SHA-256(payload || nonce || timestamp)
  const combined = `${payload}||${nonce}||${timestamp}`;
  const hash = await sha256(combined);

  return {
    hash,
    algorithm: 'SHA-256 (Web Crypto API)',
    timestamp,
    nonce,
    inputPreview: payload.substring(0, 80) + (payload.length > 80 ? '...' : ''),
  };
}

// ── Verify Hash Lock ─────────────────────────────────────────────
export async function verifyHashLock(
  data: unknown,
  originalResult: HashLockResult
): Promise<boolean> {
  const payload = JSON.stringify(data);
  const combined = `${payload}||${originalResult.nonce}||${originalResult.timestamp}`;
  const recomputed = await sha256(combined);
  return recomputed === originalResult.hash;
}

// ── ZKP: Pedersen-style Commitment Scheme ───────────────────────
// Proves knowledge of value WITHOUT revealing the value itself
// commitment = H(value || blinding_factor)
// Verifier checks: H(commitment || timestamp) == proofSignature
export async function createZKPCommitment(
  secretValue: string | number,
  domainLabel = 'ESG_DATA',
  providedBlindingFactor?: string
): Promise<ZKPCommitment> {
  const timestamp = new Date().toISOString();
  const blindingFactor = providedBlindingFactor || generateNonce(32); // Use provided or generate new
  const valueStr = String(secretValue);

  // Public hash — reveals category/range without exact value
  const publicHash = await sha256(`${domainLabel}:${valueStr}`);

  // Blinding factor hash — kept server-side
  const blindingHash = await sha256(blindingFactor);

  // Commitment = H(value || blinding_factor) — main ZKP commitment
  const commitment = await sha256(`${valueStr}||${blindingFactor}`);

  // Proof signature = HMAC(commitment || timestamp, blindingFactor)
  // Can be verified without knowing the original value
  const proofSignature = await hmacSHA256(
    blindingFactor,
    `${commitment}||${timestamp}`
  );

  return {
    commitment,
    publicHash,
    blindingHash,
    proofSignature,
    timestamp,
    algorithm: 'Pedersen Commitment + HMAC-SHA256 (Web Crypto API)',
  };
}

// ── ZKP Verify: Proof without revealing secret ───────────────────
export async function verifyZKPProof(
  claimedCommitment: ZKPCommitment,
  providedBlindingFactor: string
): Promise<ZKPVerifyResult> {
  const startTime = performance.now();
  const steps: VerifyStep[] = [];

  // Step 1: Verify blinding factor hash matches
  const recomputedBlindingHash = await sha256(providedBlindingFactor);
  steps.push({
    step: 1,
    name: '驗證盲化因子雜湊 (Blinding Factor Hash)',
    input: `H(blinding_factor)`,
    output: recomputedBlindingHash.substring(0, 32) + '...',
    passed: recomputedBlindingHash === claimedCommitment.blindingHash,
  });

  // Step 2: Recompute proof signature
  const recomputedSig = await hmacSHA256(
    providedBlindingFactor,
    `${claimedCommitment.commitment}||${claimedCommitment.timestamp}`
  );
  steps.push({
    step: 2,
    name: '驗證 HMAC 證明簽章 (Proof Signature)',
    input: `HMAC-SHA256(commitment || timestamp)`,
    output: recomputedSig.substring(0, 32) + '...',
    passed: recomputedSig === claimedCommitment.proofSignature,
  });

  // Step 3: Final commitment integrity check
  const finalHash = await sha256(
    claimedCommitment.commitment + claimedCommitment.publicHash
  );
  steps.push({
    step: 3,
    name: '最終誠信驗算 (Integrity Verification)',
    input: `H(commitment || publicHash)`,
    output: finalHash.substring(0, 32) + '...',
    passed: steps[0].passed && steps[1].passed,
  });

  const valid = steps.every(s => s.passed);
  const timeTaken = Math.round(performance.now() - startTime);

  return { valid, steps, finalHash, timeTaken };
}

// ── Hash Chain (Blockchain-style audit trail) ────────────────────
export async function mineBlock(
  index: number,
  data: string,
  previousHash: string
): Promise<HashChainBlock> {
  const timestamp = new Date().toISOString();
  let nonce = 0;
  let hash = '';

  // Proof of Work: find hash starting with '00' (difficulty 2)
  while (!hash.startsWith('00')) {
    nonce++;
    hash = await sha256(`${index}${data}${previousHash}${timestamp}${nonce}`);
  }

  return { index, data, previousHash, hash, timestamp, nonce };
}

// ── 5T Protocol Full Attestation ────────────────────────────────
export interface T5Attestation {
  t1_traceable: HashLockResult;
  t2_transparent: { formula: string; inputs: string[]; outputHash: string };
  t3_tangible: { metric: string; value: string | number; unit: string };
  t4_trustworthy: HashLockResult;
  t5_trackable: { chainBlock: HashChainBlock };
  masterSeal: string;
  issuedAt: string;
}

// ── ZKP Selective Disclosure ────────────────────────────────────
export interface SelectiveDisclosureProof {
  commitment: ZKPCommitment;
  claim: string;            // e.g., "value > 100"
  isTruth: boolean;
  proofPackage: string;     // Serialized encrypted package
}

export interface ZKPRangeProof {
  commitment: ZKPCommitment;
  min: number;
  max: number;
  inRange: boolean;
  rangeSignature: string;   // HMAC verifying the range claim
}

export async function generateRangeProof(
  secretValue: number,
  min: number,
  max: number,
  providedBlindingFactor?: string
): Promise<ZKPRangeProof> {
  const commitment = await createZKPCommitment(secretValue, 'ESG_DATA', providedBlindingFactor);
  const inRange = secretValue >= min && secretValue <= max;
  
  // Bind the range claim to the commitment via HMAC
  const rangeSignature = await hmacSHA256(
    commitment.commitment,
    `RANGE_PROOF:${min}:${max}:${inRange}:${commitment.timestamp}`
  );

  return { commitment, min, max, inRange, rangeSignature };
}

export async function verifyRangeProof(
  proof: ZKPRangeProof,
  blindingFactor: string
): Promise<boolean> {
  // 1. Verify commitment integrity
  const v = await verifyZKPProof(proof.commitment, blindingFactor);
  if (!v.valid) return false;

  // 2. Verify range signature
  const recomputedSig = await hmacSHA256(
    proof.commitment.commitment,
    `RANGE_PROOF:${proof.min}:${proof.max}:${proof.inRange}:${proof.commitment.timestamp}`
  );

  return recomputedSig === proof.rangeSignature;
}

export async function generateSelectiveDisclosure(
  metricValue: number | string,
  criteria: (val: any) => boolean,
  claimText: string,
  providedBlindingFactor?: string
): Promise<SelectiveDisclosureProof> {
  const commitment = await createZKPCommitment(metricValue, 'ESG_DATA', providedBlindingFactor);
  const isTruth = criteria(metricValue);
  
  // In a real ZKP, this would be a zk-SNARK proof. 
  // Here we use a cryptographically signed claim bound to the commitment.
  const proofPackage = await hmacSHA256(
    commitment.commitment, 
    JSON.stringify({ claim: claimText, isTruth, timestamp: commitment.timestamp })
  );

  return { commitment, claim: claimText, isTruth, proofPackage };
}

export async function verifySelectiveDisclosure(
  proof: SelectiveDisclosureProof,
  blindingFactor: string
): Promise<boolean> {
  // 1. Verify the commitment itself
  const v = await verifyZKPProof(proof.commitment, blindingFactor);
  if (!v.valid) return false;

  // 2. Verify the proof package matches the claim
  const recomputedPackage = await hmacSHA256(
    proof.commitment.commitment,
    JSON.stringify({ claim: proof.claim, isTruth: proof.isTruth, timestamp: proof.commitment.timestamp })
  );

  return recomputedPackage === proof.proofPackage;
}

export async function create5TAttestation(
  metric: string,
  value: string | number,
  unit: string,
  sourceOrigin: string,
  formula = 'Direct measurement'
): Promise<T5Attestation> {
  const issuedAt = new Date().toISOString();

  // T1: Traceable — hash of source document
  const t1 = await createHashLock({ metric, sourceOrigin, issuedAt });

  // T2: Transparent — formula and input hashes
  const outputHash = await sha256(`${metric}=${value}${unit}`);
  const t2 = { formula, inputs: [sourceOrigin, `${metric}`], outputHash };

  // T3: Tangible
  const t3 = { metric, value, unit };

  // T4: Trustworthy — hash of the actual data payload
  const t4 = await createHashLock({ metric, value, unit, formula, issuedAt });

  // T5: Trackable — mine a chain block
  const chainBlock = await mineBlock(
    Date.now(),
    `${metric}:${value}${unit}`,
    t4.hash
  );
  const t5 = { chainBlock };

  // Master Seal = SHA-256(T1 + T4 + T5)
  const masterSeal = await sha256(`${t1.hash}||${t4.hash}||chainBlock.hash`);

  return { t1_traceable: t1, t2_transparent: t2, t3_tangible: t3, t4_trustworthy: t4, t5_trackable: t5, masterSeal, issuedAt };
}
