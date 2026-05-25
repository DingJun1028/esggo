/**
 * 雜湊工具函數
 * 前後端通用的加密與雜湊函數
 */

import { createHash, randomBytes, createHmac } from 'crypto';
import type { ContentHash } from '../types/evidence.types';

// ============================================
// SHA-256 雜湊
// ============================================

export async function computeSHA256(content: string | Buffer): Promise<ContentHash> {
  const hash = createHash('sha256');
  hash.update(content);
  return hash.digest('hex') as ContentHash;
}

export async function computeSHA256Async(content: string | Buffer): Promise<ContentHash> {
  // 對於大型內容使用異步處理
  return new Promise((resolve, reject) => {
    try {
      const hash = createHash('sha256');
      hash.update(content);
      resolve(hash.digest('hex') as ContentHash);
    } catch (error) {
      reject(error);
    }
  });
}

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
