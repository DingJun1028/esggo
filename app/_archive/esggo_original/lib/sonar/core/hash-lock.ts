import { createHash, createHmac, timingSafeEqual } from 'crypto';

/**
 * ESGSonar | Hash Lock Mechanism
 * Provides secure content hashing, version detection, and HMAC support.
 */

export class HashLock {
  /**
   * Generate SHA-256 hash for content
   */
  static sha256(content: string | Buffer): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Generate SHA-512 hash for extra security
   */
  static sha512(content: string | Buffer): string {
    return createHash('sha512').update(content).digest('hex');
  }

  /**
   * Generate HMAC for authenticated content
   */
  static hmac(content: string | Buffer, secret: string): string {
    return createHmac('sha256', secret).update(content).digest('hex');
  }

  /**
   * Constant-time comparison to prevent timing attacks
   */
  static secureCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }

  /**
   * Check if content has changed against a stored hash
   */
  static hasChanged(currentContent: string, storedHash: string): boolean {
    const currentHash = this.sha256(currentContent);
    return !this.secureCompare(currentHash, storedHash);
  }

  /**
   * Generate a batch hash lock for multiple items
   */
  static batchHash(items: any[]): string {
    const payload = JSON.stringify(items.sort());
    return this.sha256(payload);
  }
}
