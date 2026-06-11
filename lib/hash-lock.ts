import crypto from 'crypto';

/**
 * 產生 ZKP Hash Lock (SHA-256)
 * @param data 需要被封印的原始資料物件
 * @param salt 亂數鹽值，確保相同的資料能產生不同的 Hash
 * @returns 包含 Hash 值與驗證鹽值的封印物件
 */
export function generateHashLock(data: unknown): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const payload = JSON.stringify(data) + salt;
  
  const hash = crypto
    .createHash('sha256')
    .update(payload)
    .digest('hex');

  return { hash, salt };
}

/**
 * 驗證 ZKP Hash Lock
 * @param data 原始資料物件
 * @param salt 當初封印的鹽值
 * @param originalHash 當初產生的 Hash 值
 * @returns boolean
 */
export function verifyHashLock(data: unknown, salt: string, originalHash: string): boolean {
  const payload = JSON.stringify(data) + salt;
  const hash = crypto
    .createHash('sha256')
    .update(payload)
    .digest('hex');
    
  return hash === originalHash;
}
