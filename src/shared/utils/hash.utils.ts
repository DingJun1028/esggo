import { createHash, randomBytes, createHmac } from 'crypto';
import type { ContentHash } from '../types/evidence.types';

// ============================================
// 強化雜湊算法 - 支援 SHA-512 和 ZKP 驗證
// ============================================

export enum HashAlgorithm {
  SHA256 = 'sha256',
  SHA512 = 'sha512',
  BLAKE3 = 'blake3'
}

export enum ZKPDifficulty {
  LOW = 2,    // 00 前綴
  MEDIUM = 4, // 0000 前綴
  HIGH = 8    // 00000000 前綴
}

export interface HashResult {
  hash: ContentHash;
  algorithm: HashAlgorithm;
  timestamp: Date;
  difficulty?: ZKPDifficulty;
  proof?: string;
}

export async function computeHash(
  content: string | Buffer,
  algorithm: HashAlgorithm = HashAlgorithm.SHA512,
  difficulty: ZKPDifficulty = ZKPDifficulty.LOW
): Promise<HashResult> {
  const timestamp = new Date();
  
  if (algorithm === HashAlgorithm.SHA512) {
    const hash = createHash('sha512');
    hash.update(content);
    const hashHex = hash.digest('hex');
    
    // 生成 ZKP 證明
    let proof: string | undefined;
    if (difficulty > ZKPDifficulty.LOW) {
      proof = generateZKPProof(hashHex, difficulty);
    }
    
    return {
      hash: hashHex as ContentHash,
      algorithm,
      timestamp,
      difficulty,
      proof
    };
  } else {
    // 預設使用 SHA-256
    const hash = createHash('sha256');
    hash.update(content);
    return {
      hash: hash.digest('hex') as ContentHash,
      algorithm: HashAlgorithm.SHA256,
      timestamp
    };
  }
}

// 生成 ZKP 證明
function generateZKPProof(hash: string, difficulty: ZKPDifficulty): string {
  const requiredPrefix = '0'.repeat(difficulty);
  let nonce = 0;
  let proof = '';
  
  do {
    const input = `${hash}:${nonce}`;
    const proofHash = createHash('sha256').update(input).digest('hex');
    proof = proofHash;
    nonce++;
  } while (!proof.startsWith(requiredPrefix));
  
  return proof;
}

// ============================================
// SHA-512 雜湊（推薦使用）
// ============================================

export async function computeSHA256(content: string | Buffer): Promise<ContentHash> {
  const result = await computeHash(content, HashAlgorithm.SHA256);
  return result.hash;
}

export async function computeSHA256Async(content: string | Buffer): Promise<ContentHash> {
  return computeSHA256(content);
}

// ============================================
// 向後兼容性函數 - 推薦轉換為 computeHash
// ============================================

// ============================================
// 多層次雜湊（用於 UCC）
// ============================================

export interface MultiLevelHash {
  content_hash: ContentHash;
  metadata_hash: string;
  combined_hash: string;
  algorithm: 'sha256';
  timestamp: Date;
}

export async function computeMultiLevelHash(
  content: string,
  metadata: Record<string, unknown>
): Promise<MultiLevelHash> {
  const contentHash = await computeSHA256(content);
  const metadataString = JSON.stringify(sortObjectKeys(metadata));
  const metadataHash = await computeSHA256(metadataString);
  
  // 組合雜湊：content_hash + metadata_hash
  const combinedHash = await computeSHA256(contentHash + metadataHash);
  
  return {
    content_hash: contentHash,
    metadata_hash: metadataHash,
    combined_hash: combinedHash,
    algorithm: 'sha256',
    timestamp: new Date(),
  };
}

// ============================================
// 對象鍵排序（確保一致性）
// ============================================

export function sortObjectKeys<T extends Record<string, unknown>>(obj: T): T {
  const sorted = {} as T;
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    const value = obj[key];
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sorted[key as keyof T] = sortObjectKeys(value as Record<string, unknown>) as T[keyof T];
    } else {
      sorted[key as keyof T] = value as T[keyof T];
    }
  }
  
  return sorted;
}

// ============================================
// 驗證雜湊
// ============================================

export async function verifyHash(
  content: string | Buffer,
  expectedHash: ContentHash
): Promise<boolean> {
  const computedHash = await computeSHA256(content);
  return computedHash === expectedHash;
}

// ============================================
// 生成隨機鹽值
// ============================================

export function generateSalt(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

// ============================================
// HMAC 簽名
// ============================================

export async function computeHMAC(
  content: string,
  secret: string
): Promise<string> {
  const hmac = createHmac('sha256', secret);
  hmac.update(content);
  return hmac.digest('hex');
}

export async function verifyHMAC(
  content: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const computedSignature = await computeHMAC(content, secret);
  return computedSignature === signature;
}

// ============================================
// 區塊鏈風格的 Merkle Root
// ============================================

export async function computeMerkleRoot(hashes: ContentHash[]): Promise<string> {
  if (hashes.length === 0) {
    throw new Error('Cannot compute Merkle root of empty array');
  }
  
  if (hashes.length === 1) {
    return hashes[0];
  }
  
  const nextLevel: string[] = [];
  
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i];
    const right = hashes[i + 1] || left; // 如果是奇數個，複製最後一個
    const combined = await computeSHA256(left + right);
    nextLevel.push(combined);
  }
  
  return computeMerkleRoot(nextLevel as ContentHash[]);
}

// ============================================
// 內容指紋（用於去重）
// ============================================

export interface ContentFingerprint {
  hash: ContentHash;
  size: number;
  type: string;
  created_at: Date;
}

export async function generateContentFingerprint(
  content: string | Buffer,
  contentType: string
): Promise<ContentFingerprint> {
  const hash = await computeSHA256(content);
  const size = Buffer.byteLength(content);
  
  return {
    hash,
    size,
    type: contentType,
    created_at: new Date(),
  };
}
