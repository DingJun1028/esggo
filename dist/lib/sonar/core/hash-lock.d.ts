/**
 * ESGSonar | Hash Lock Mechanism
 * Provides secure content hashing, version detection, and HMAC support.
 */
export declare class HashLock {
    /**
     * Generate SHA-256 hash for content
     */
    static sha256(content: string | Buffer): string;
    /**
     * Generate SHA-512 hash for extra security
     */
    static sha512(content: string | Buffer): string;
    /**
     * Generate HMAC for authenticated content
     */
    static hmac(content: string | Buffer, secret: string): string;
    /**
     * Constant-time comparison to prevent timing attacks
     */
    static secureCompare(a: string, b: string): boolean;
    /**
     * Check if content has changed against a stored hash
     */
    static hasChanged(currentContent: string, storedHash: string): boolean;
    /**
     * Generate a batch hash lock for multiple items
     */
    static batchHash(items: unknown[]): string;
}
//# sourceMappingURL=hash-lock.d.ts.map